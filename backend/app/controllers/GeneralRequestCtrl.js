import GeneralRequest from "../models/GeneralRequest.js"
import User from "../models/Registeruser.js";
import Notification from "../models/NotificationUser.js";
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

    const newGeneralRequest = new GeneralRequest({
      issue,
      userId: req.userid,
      location: {
        type: "Point",
        coordinates: user.location.coordinates
      }
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







export default GeneralRequestCtrl;
