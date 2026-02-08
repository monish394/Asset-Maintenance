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
    const getusergeneralrequest = await GeneralRequest.find({
      userId: req.userid,
    });
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
      }
    ]);

    console.log("Nearby open requests:", requests);

    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Failed to fetch requests" });
  }
};





export default GeneralRequestCtrl;
