import GeneralRequest from "../models/GeneralRequest.js"
import User from "../models/Registeruser.js";
import Notification from "../models/NotificationUser.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
const GeneralRequestCtrl = {};


GeneralRequestCtrl.createGeneralrequest = async (req, res) => {
  const { issue } = req.body;

  if (!issue) return res.status(400).json({ err: "Issue is required" });

  try {
    const user = await User.findById(req.userid);
    if (!user) return res.status(404).json({ err: "User not found" });

    if (!user.location?.coordinates || user.location.coordinates.length !== 2) {
      return res.status(400).json({ err: "User location not set properly" });
    }

    let aiData = {
      aiResponse: "Technician will review the issue.",
      aiCategory: "General",
      aiPriority: "medium"
    };

    const getAiDiagnosis = async (desc) => {
      // 1. Try Gemini
      if (process.env.GEMINI_API_KEY) {
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Analyze maintenance issue: "${desc}". Response JSON ONLY: {"response":"advice","category":"type","priority":"low|medium|high"}`;
          const result = await model.generateContent(prompt);
          const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
          if (jsonMatch) return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Gemini failed:", e.message);
        }
      }

      // 2. Try Pollinations
      try {
        const promptForAI = `Analyze maintenance issue: "${desc}". Response JSON ONLY: {"response":"advice","category":"type","priority":"low|medium|high"}`;
        const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(promptForAI)}?json=true`;
        const response = await axios.get(pollinationsUrl, { timeout: 8000 });
        if (response.data) {
          return typeof response.data === 'string' ? JSON.parse(response.data.match(/\{[\s\S]*\}/)[0]) : response.data;
        }
      } catch (e) {
        console.error("Pollinations failed:", e.message);
      }

      // 3. Rule-based
      const p = desc.toLowerCase();
      if (p.includes("power") || p.includes("shock") || p.includes("wire")) return { response: "Electrical safety risk! Do not touch.", category: "Electrical", priority: "high" };
      if (p.includes("water") || p.includes("leak") || p.includes("pipe")) return { response: "Plumbing leak detected. Stop main flow.", category: "Plumbing", priority: "high" };
      return { response: "Issue logged. A professional will assess soon.", category: "General", priority: "medium" };
    };

    try {
      const parsed = await getAiDiagnosis(issue);
      if (parsed) {
        aiData.aiResponse = (parsed.response || aiData.aiResponse) + " Technician will be assigned soon.";
        aiData.aiCategory = parsed.category || aiData.aiCategory;
        aiData.aiPriority = (parsed.priority || aiData.aiPriority).toLowerCase();
      }
    } catch (e) {
      console.error("Diagnosis process failed:", e.message);
    }

    const newGeneralRequest = new GeneralRequest({
      issue,
      userId: req.userid,
      location: {
        type: "Point",
        coordinates: user.location.coordinates
      },
      ...aiData
    });

    await newGeneralRequest.save();

    const nearbyTechnicians = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: user.location.coordinates
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000,
          query: { role: "technician" }
        }
      }
    ]);

    for (const tech of nearbyTechnicians) {
      await Notification.create({
        userid: tech._id,
        message: `New General Request: "${issue}" ${user.name}`,
        type: "general_request",
        referenceId: newGeneralRequest._id
      });
    }

    res.status(200).json(newGeneralRequest);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "Failed to create general request" });
  }
};


GeneralRequestCtrl.Getusergeneralrequest = async (req, res) => {
  try {
    const getusergeneralrequest = await GeneralRequest.find({ userId: req.userid })
      .populate("acceptedBy", "name");
    res.status(200).json(getusergeneralrequest);
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ err: "Something went wrong while fetching general requests!" });
  }
};



GeneralRequestCtrl.getNearbyOpenRequests = async (req, res) => {
  try {
    const tech = await User.findById(req.userid);

    if (!tech?.location?.coordinates || tech.location.coordinates.length !== 2) {
      return res.status(400).json({ err: "Technician location missing" });
    }

    const [lng, lat] = tech.location.coordinates;

    const requests = await GeneralRequest.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000
        }
      },
      {
        $match: {
          status: "OPEN",
          acceptedBy: null
        }
      },
      {
        $sort: { distance: 1 }
      }
    ]);

    await GeneralRequest.populate(requests, {
      path: "userId",
      select: "name phone address"
    });

    console.log("Nearby open requests:", requests);

    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Failed to fetch nearby open requests" });
  }
};


GeneralRequestCtrl.acceptGeneralRequest = async (req, res) => {
  try {
    const techId = req.userid;
    const requestId = req.params.id;

    const request = await GeneralRequest.findOneAndUpdate(
      { _id: requestId, status: "OPEN", acceptedBy: null },
      { status: "ACCEPTED", acceptedBy: techId },
      { new: true }
    ).populate("userId", "name phone address");

    if (!request) {
      return res
        .status(400)
        .json({ err: "Request already accepted by another technician" });
    }

    // Store notification in DB for the user
    await Notification.create({
      userid: request.userId._id,
      message: `Your general request "${request.issue}" has been accepted by a technician.`,
      requestid: request._id
    });

    // Real-time notification via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.to(request.userId.toString()).emit("notification", {
        type: "GENERAL_REQUEST_ACCEPTED",
        message: `Your general request "${request.issue}" has been accepted by technician.`,
        requestId: request._id,
      });
    }

    const otherTechs = await User.find({ role: "technician", _id: { $ne: techId } });
    const notifications = otherTechs.map((tech) => ({
      userid: tech._id,
      message: `Request "${request.issue}" has been accepted by another technician.`,
      requestid: request._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(200).json(request);
  } catch (err) {
    console.error("acceptGeneralRequest error:", err);
    return res.status(500).json({ err: "Failed to accept request" });
  }
};


GeneralRequestCtrl.getAssignedRequests = async (req, res) => {
  try {
    const requests = await GeneralRequest.find({
      acceptedBy: req.userid,
      status: "ACCEPTED"
    }).populate("userId", "name phone address");

    res.status(200).json(requests);
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: "Failed to fetch assigned requests" });
  }
};



GeneralRequestCtrl.getTechnicianAccecptedGeneralReqeust = async (req, res) => {
  try {
    const techacceptedgeneral = await GeneralRequest.find({ acceptedBy: req.userid })
      .populate("userId", "name phone address");

    res.status(200).json(techacceptedgeneral);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Something went wrong while fetching accepted requests" });
  }
};


GeneralRequestCtrl.completeGeneralRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const techId = req.userid;

    const request = await GeneralRequest.findOneAndUpdate(
      {
        _id: requestId,
        acceptedBy: techId,
        status: "ACCEPTED",
      },
      { status: "COMPLETED" },
      { new: true }
    ).populate("userId", "name phone");

    if (!request) {
      return res
        .status(400)
        .json({ err: "Request not found or not assigned to you" });
    }


    await Notification.create({
      userid: request.userId._id,
      message: `Your request "${request.issue}" has been completed by the technician.`,
      type: "general_request_completed",
      referenceId: request._id,
    });

    res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Failed to complete request" });
  }
};

GeneralRequestCtrl.getAllGeneralRequest = async (req, res) => {
  // only admin can access this
  try {
    if (req.role !== "admin") return res.status(401).json({ err: "Acces Denied!!!" });
    const requests = await GeneralRequest.find().populate("userId", "name phone address").populate("acceptedBy", "name");
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Failed to fetch general requests" });
  }
};

export default GeneralRequestCtrl;
