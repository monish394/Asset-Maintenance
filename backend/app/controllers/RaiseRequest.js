import RaiseRequest from "../models/RaiseRequest.js";
import User from "../models/Registeruser.js";
import Notification from "../models/NotificationUser.js";
import AiService from "../services/AiService.js";
import Payment from "../models/Payment.js";

const RaiseRequestCtrl = {};

RaiseRequestCtrl.Postissue = async (req, res) => {
  const { assetid, description, faultImg } = req.body;

  if (!assetid) return res.status(400).json({ err: "Please select an asset before submitting." });
  if (!description) return res.status(400).json({ err: "Description is required" });
  if (!req.userid) return res.status(401).json({ err: "User not authenticated" });

  try {
    const user = await User.findById(req.userid);
    if (!user?.location?.coordinates?.length) return res.status(400).json({ err: "User location missing" });

    let aiData = {
      aiResponse: "Issue logged. Technician will assess.",
      aiCategory: "General",
      aiPriority: "medium",
      requesttype: "repair"
    };

    console.log("Starting getAiDiagnosis");
    try {
      const parsed = await AiService.getAiDiagnosis(description, "repair");
      console.log("AiService parsed result:", parsed);
      if (parsed) {
        aiData.aiResponse = parsed.response || aiData.aiResponse;
        aiData.aiCategory = parsed.category || aiData.aiCategory;
        aiData.aiPriority = (parsed.priority || aiData.aiPriority).toLowerCase();
        aiData.requesttype = (parsed.requestType || aiData.requesttype).toLowerCase();
      }
    } catch (e) {
      console.error("AI fetch error:", e.message);
    }
    console.log("Finished getAiDiagnosis", aiData);

    const newRequest = new RaiseRequest({
      assetid,
      description,
      faultImg,
      userid: req.userid,
      assignedto: null,
      status: "pending",
      location: { type: "Point", coordinates: user.location.coordinates },
      ...aiData
    });

    console.log("Saving newRequest");
    await newRequest.save();
    console.log("newRequest saved successfully");

    (async () => {
      try {
        const nearbyTechs = await User.aggregate([
          { $geoNear: { near: { type: "Point", coordinates: user.location.coordinates }, distanceField: "distance", spherical: true, maxDistance: 5000, query: { role: "technician" } } }
        ]);

        for (const tech of nearbyTechs) {
          await Notification.create({
            userid: tech._id,
            message: `New ${newRequest.aiPriority} priority request: "${newRequest.description.substring(0, 50)}...".`,
            requestid: newRequest._id,
          });
        }
      } catch (err) {
        console.error("Notification error:", err.message);
      }
    })();

    res.status(201).json(newRequest); 
    console.log("Response sent to frontend");

  } catch (err) {
    console.error("Postissue failed:", err.message);
    if (!res.headersSent) res.status(500).json({ err: "Failed to create request" });
  }
};

RaiseRequestCtrl.Getuserissue = async (req, res) => {
  try {
    const alluserissue = await RaiseRequest.find({ userid: req.userid }).populate("assetid", "assetName assetImg").populate("assignedto", "name address phone")
    res.status(200).json(alluserissue)
  } catch (err) {
    res.status(400).json({ err: "Failed to get user requests" })
  }
}

RaiseRequestCtrl.Getallrequest = async (req, res) => {
  try {
    const allraiserequest = await RaiseRequest.find()
      .populate("assetid", "assetName assetImg")
      .populate("userid", "name phone")
      .populate("assignedto", "name address phone");

    const requestsWithPayments = await Promise.all(allraiserequest.map(async (requestItem) => {
      const payment = await Payment.findOne({ raiseRequestId: requestItem._id, status: "success" });
      return { ...requestItem.toObject(), payment };
    }));

    res.status(200).json(requestsWithPayments);
  } catch (err) {
    res.status(400).json({ err: "Failed to fetch all requests" });
  }
};

RaiseRequestCtrl.AssignTechnician = async (req, res) => {
  const { requestid } = req.params;
  const { technicianid } = req.body;
  try {
    const technician = await User.findById(technicianid);
    if (!technician) return res.status(404).json({ err: "Technician not found" });
    const updated = await RaiseRequest.findByIdAndUpdate(requestid, { assignedto: technicianid }, { new: true }).populate('assetid');
    await Notification.create({ userid: updated.userid, message: `Your request for ${updated.assetid.assetName} has been assigned to ${technician.name}`, requestid: updated._id });
    await Notification.create({ userid: technician._id, message: `You have been assigned to "${updated.assetid.assetName}"`, requestid: updated._id });
    res.status(200).json({ success: true, updatedRequest: updated });
  } catch (err) {
    res.status(500).json({ err: "Update failed" });
  }
};

RaiseRequestCtrl.getTechnicianrequests = async (req, res) => {
  try {
    const requests = await RaiseRequest.find({ assignedto: req.userid })
      .populate("assetid", "assetName assetImg")
      .populate("userid", "name address phone");

    const requestsWithPayments = await Promise.all(requests.map(async (request) => {
      const payment = await Payment.findOne({ raiseRequestId: request._id, status: "success" });
      return { ...request.toObject(), payment };
    }));

    res.status(200).json(requestsWithPayments);
  } catch (err) {
    res.status(400).json({ err: "Failed to fetch technician requests" });
  }
};

RaiseRequestCtrl.TechnicianAccept = async (req, res) => {
  try {
    const { requestid } = req.params;
    const updated = await RaiseRequest.findOneAndUpdate({ _id: requestid, assignedto: null }, { status: "assigned", assignedto: req.userid, acceptedAt: new Date() }, { new: true }).populate("userid").populate("assetid");
    if (!updated) return res.status(400).json({ err: "Already assigned or not found" });
    await Notification.create({ userid: updated.userid, message: `Your request for ${updated.assetid?.assetName || "asset"} has been accepted.`, requestid: updated._id });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ err: "Failed to accept" });
  }
};

RaiseRequestCtrl.TechnicianStatusUpdate = async (req, res) => {
  const { requestid } = req.params;
  const { status, costEstimate } = req.body;
  try {
    const updateData = { status };
    if (costEstimate) updateData.costEstimate = costEstimate;
    if (status === "completed") updateData.completedAt = new Date();
    const updated = await RaiseRequest.findByIdAndUpdate(requestid, updateData, { new: true }).populate("assetid").populate("userid");
    if (!updated) return res.status(404).json({ err: "Request not found" });
    let message = `Your request for "${updated.assetid.assetName}" status updated to ${status}.`;
    await Notification.create({ userid: updated.userid._id, message, requestid: updated._id });
    res.status(200).json({ status: true, updated });
  } catch (err) {
    res.status(400).json({ err: "Update failed" });
  }
};

RaiseRequestCtrl.getRaiserequestStats = async (req, res) => {
  try {
    const stats = {
      pendingrequest: await RaiseRequest.countDocuments({ status: "pending" }),
      inprocessrequest: await RaiseRequest.countDocuments({ status: "in-process" }),
      completedrequest: await RaiseRequest.countDocuments({ status: "completed" })
    };
    res.status(200).json(stats);
  } catch (err) {
    res.status(400).json({ err: "Failed stats" });
  }
}

RaiseRequestCtrl.getTechnicianStats = async (req, res) => {
  try {
    const stats = {
      technicianassignstats: await RaiseRequest.countDocuments({ assignedto: req.userid }),
      technicianpendingrequest: await RaiseRequest.countDocuments({ assignedto: req.userid, status: "pending" }),
      inprocessrequest: await RaiseRequest.countDocuments({ assignedto: req.userid, status: ["in-process", "assigned"] }),
      completedrequest: await RaiseRequest.countDocuments({ assignedto: req.userid, status: "completed" })
    };
    res.status(200).json(stats);
  } catch (err) {
    res.status(400).json({ err: "Failed stats" });
  }
}

RaiseRequestCtrl.getNearbyAssetRequests = async (req, res) => {
  try {
    const tech = await User.findById(req.userid);
    if (!tech?.location?.coordinates) return res.status(400).json({ err: "Technician location missing" });
    const requests = await RaiseRequest.aggregate([
      { $geoNear: { near: { type: "Point", coordinates: tech.location.coordinates }, distanceField: "distance", spherical: true, maxDistance: 5000 } },
      { $match: { status: "pending", assignedto: null } },
      { $sort: { distance: 1 } }
    ]);
    await RaiseRequest.populate(requests, { path: "userid", select: "name phone email" });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ err: "Failed nearby" });
  }
};

RaiseRequestCtrl.DeleteRequest = async (req, res) => {
  const { requestid } = req.params;
  try {
    const request = await RaiseRequest.findById(requestid);
    if (!request) return res.status(404).json({ err: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ err: "Only pending requests can be deleted" });
    }

    await Notification.deleteMany({ requestid: request._id });
    await RaiseRequest.findByIdAndDelete(requestid);

    const io = req.app.get("io");
    if (io) {
      io.emit("ASSET_REQUEST_DELETED", { requestId: requestid });
    }

    res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: "Failed to delete request" });
  }
};

export default RaiseRequestCtrl;
