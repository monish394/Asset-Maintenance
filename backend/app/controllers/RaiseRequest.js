import RaiseRequest from "../models/RaiseRequest.js";
import User from "../models/Registeruser.js";
import Notification from "../models/NotificationUser.js";
const RaiseRequestCtrl={};




import { GoogleGenerativeAI } from "@google/generative-ai";





RaiseRequestCtrl.Postissue = async (req, res) => {
  const { assetid, description } = req.body;

  if (!description)
    return res.status(400).json({ err: "Description is required" });
  if (!req.userid)
    return res.status(401).json({ err: "User not authenticated" });

  let aiData = {
    aiResponse: "Technician will review the issue.",
    aiCategory: "General",
    aiPriority: "medium",
    requesttype: "repair",
    
  };

  try {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const prompt = `
You are a maintenance AI assistant.
Respond ONLY in valid JSON:

{
  "response": "short maintenance advice",
  "category": "asset category",
  "priority": "low | medium | high",
  "requestType": "repair | maintenance",
  "costEstimate": number or null
}

Issue:
"${description}"
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiData.aiResponse =
          (parsed.response || aiData.aiResponse) +
          " Technician will be assigned soon if applicable.";
        aiData.aiCategory = parsed.category || aiData.aiCategory;
        aiData.aiPriority = parsed.priority || aiData.aiPriority;
        aiData.requesttype = parsed.requestType || aiData.requesttype;
       
      }
    }
  } catch (err) {
    console.error("AI classification failed:", err.message);
  }

  try {
    const user = await User.findById(req.userid);

    if (!user?.location?.coordinates?.length)
      return res.status(400).json({ err: "User location missing" });

    const newRequest = new RaiseRequest({
      assetid: assetid || null,
      description,
      userid: req.userid,
      assignedto: null,
      status: "pending",
      location: {
        type: "Point",
        coordinates: user.location.coordinates
      },
      ...aiData,
    });

    if (newRequest.aiPriority !== "high") {
      const nearbyTechs = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: user.location.coordinates },
            distanceField: "distance",
            spherical: true,
            maxDistance: 5000,
            query: { role: "technician" },
          },
        },
      ]);

      for (const tech of nearbyTechs) {
        await Notification.create({
          userid: tech._id,
          message: `New request available: "${newRequest.description}". Click ACCEPT to take it.`,
          requestid: newRequest._id,
        });
      }
    }

    await newRequest.save();
    res.status(201).json(newRequest);

  } catch (err) {
    console.error("Postissue failed:", err.message);
    res.status(500).json({ err: "Failed to create request" });
  }
};

//get all user Raise request

RaiseRequestCtrl.Getuserissue=async (req,res) => {
    try{
        const alluserissue=await RaiseRequest.find({userid:req.userid}).populate("assetid", "assetName assetImg") .populate("assignedto", "name address phone")
        res.status(200).json(alluserissue)

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while getting all userraiserequest!!!"})
    }
    
}

RaiseRequestCtrl.Getallrequest = async (req, res) => {
  try {
    const allraiserequest = await RaiseRequest.find()
      .populate({
        path: 'assetid', 
        select: 'assetName assetImg', 
      })
      .populate({
        path: 'userid', 
        select: 'name phone',  
      })
      .populate({
        path: 'assignedto',
        select: 'name address phone', 
      });

    res.status(200).json(allraiserequest);
  } catch(err) {
    console.log(err.message);
    res.status(400).json({
      err: "Something went wrong while fetching all raise requests",
    });
  }
};

RaiseRequestCtrl.AssignTechnician = async (req, res) => {
  const  {requestid }  = req.params;
  console.log(requestid )
  const { technicianid } = req.body;

  try {
    const technician=await User.findById(technicianid)
     if (!technician) return res.status(404).json({ err: "Technician not found" });
    const updated = await RaiseRequest.findByIdAndUpdate(
      requestid ,
      { assignedto: technicianid, },
      { new: true }
    ).populate('assetid');

    const message=`Your request for ${updated.assetid.assetName} has been assigned to ${technician.name} `
    await Notification.create({
      userid:updated.userid,
      message:message,
      requestid:updated._id
    })
    const techMessage = `You have been assigned to "${updated.assetid.assetName}"`;
    await Notification.create({
      userid: technician._id,
      message: techMessage,
      requestid: updated._id
    });

    res.status(200).json({
  success: true,
  message: 'Technician assigned and user notified',
  updatedRequest: updated
});

  } catch(err) {
    console.log(err.message)
    res.status(500).json({ err: "Update failed" });
  }
};


RaiseRequestCtrl.getTechnicianrequests = async (req, res) => {
  try {
    const technicianId = req.userid; 

   const requests = await RaiseRequest.find({ assignedto: technicianId })
  .populate({ path: "assetid", select: "assetName assetImg" })
  .populate({ path: "userid", select: "name address phone" }); 

    res.status(200).json(requests);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: "Something went wrong fetching technician requests" });
  }
};



RaiseRequestCtrl.TechnicianAccept = async (req, res) => {
  const { requestid } = req.params;
  const techId = req.userid;

  try {
    let updated = await RaiseRequest.findOneAndUpdate(
      { _id: requestid, assignedto: null },
      { status: "assigned", assignedto: techId, assignAt: new Date() },
      { new: true }
    )
      .populate("userid", "name phone address")
      .populate("assetid", "assetName");

    if (!updated) {
      const request = await RaiseRequest.findById(requestid);

      if (!request) return res.status(404).json({ err: "Request not found" });

      if (request.assignedto?.toString() !== techId) {
        return res.status(400).json({ err: "Request already assigned to another technician" });
      }

      if (request.status === "pending") {
        request.status = "assigned";
        request.acceptedAt = new Date();
        updated = await request.save();

        await Notification.create({
          userid: request.userid,
          message: `Your request "${request.description}" has been accepted by the technician.`,
          requestid: request._id
        });

        return res.status(200).json(updated);
      }

      return res.status(400).json({ err: "Request already accepted" });
    }

    await Notification.create({
      userid: updated.userid,
      message: `Your request "${updated.description}" has been assigned to a technician.`,
      requestid: updated._id
    });

    const otherTechs = await User.find({
      role: "technician",
      _id: { $ne: techId }
    });

    const notifications = otherTechs.map((tech) => ({
      userid: tech._id,
      message: `Request "${updated.description}" has been accepted by another technician.`,
      requestid: updated._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json(updated);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: "Failed to accept request" });
  }
};



RaiseRequestCtrl.TechnicianStatusUpdate = async (req, res) => {
  const { requestid } = req.params;
  const { status, costEstimate } = req.body;

  try {
    const updateData = {
      status,
    };

    if (costEstimate !== undefined && costEstimate !== null) {
      updateData.costEstimate = costEstimate;
    }

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updatedRequest = await RaiseRequest.findByIdAndUpdate(
      requestid,
      updateData,
      { new: true }
    )
      .populate("assetid", "assetName")
      .populate("userid", "name phone address");

    if (!updatedRequest) {
      return res.status(404).json({ err: "Request not found" });
    }

    let message;
    if (status === "completed") {
      message = `Your request for "${updatedRequest.assetid.assetName}" has been completed`;
    } else if (status === "in-process") {
      message = `Your request for "${updatedRequest.assetid.assetName}" is in progress`;
    }

    if (message && updatedRequest.userid) {
      await Notification.create({
        userid: updatedRequest.userid._id,
        message,
        requestid: updatedRequest._id,
      });
    }

    res.status(200).json({
      status: true,
      message,
      updated: updatedRequest,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      err: "Something went wrong while updating technician status!",
    });
  }
};



RaiseRequestCtrl.getRaiserequestStats=async (req,res) => {
  try{
    const pendingrequest=await RaiseRequest.countDocuments({status:"pending"})
    const inprocessrequest=await RaiseRequest.countDocuments({status:"in-process"})
    const completedrequest=await RaiseRequest.countDocuments({status:"completed"})

    res.status(200).json({
      pendingrequest,inprocessrequest,completedrequest
    })

  }catch(err){
    console.log(err.message)
    res.status(400).json({err:"something went wrong wile fetching Raiserequest Stats!!!"})
  }
  
}

RaiseRequestCtrl.getTechnicianStats=async (req,res) => {
  try{

    const technicianassignstats=await RaiseRequest.countDocuments({assignedto:req.userid})
    const technicianpendingrequest=await RaiseRequest.countDocuments({assignedto:req.userid,status:"pending"})
    const inprocessrequest=await RaiseRequest.countDocuments({assignedto:req.userid,status:["in-process","assigned"]})
    const completedrequest=await RaiseRequest.countDocuments({assignedto:req.userid,status:"completed"})

    res.status(200).json({technicianassignstats,technicianpendingrequest,inprocessrequest,completedrequest})

  }catch(err){
    console.log(err.message)
    res.status(400).json({err:"something went wrong while fetching fetchtechnician Stats!!!"})
  }
  
}
 
RaiseRequestCtrl.getNearbyAssetRequests = async (req, res) => {
  try {
    const tech = await User.findById(req.userid);

    if (!tech?.location?.coordinates || tech.location.coordinates.length !== 2) {
      return res.status(400).json({ err: "Technician location missing" });
    }

    const [lng, lat] = tech.location.coordinates;

    const requests = await RaiseRequest.aggregate([
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
          status: "pending",
          assignedto: null,
          aiPriority: { $regex: /^(low|medium)$/i }
        }
      },
      {
        $sort: { distance: 1 }
      }
    ]);

    await RaiseRequest.populate(requests, {
      path: "userid",
      select: "name email phone"
    });

    console.log("Nearby asset requests:", requests);

    res.status(200).json(requests);

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Failed to fetch nearby asset requests" });
  }
};


export default RaiseRequestCtrl;










