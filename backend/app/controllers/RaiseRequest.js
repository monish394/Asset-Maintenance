import RaiseRequest from "../models/RaiseRequest.js";
import User from "../models/Registeruser.js";
import Notification from "../models/NotificationUser.js";
const RaiseRequestCtrl={};
// creating raise request
RaiseRequestCtrl.Postissue=async (req,res) => {
    const {assetid,description}=req.body;
    console.log(req.body)
    try{
        const userissue=new RaiseRequest({
            assetid,
            description,
            userid:req.userid,

        });
        await userissue.save()
        res.json(userissue);

    }catch(err){
        console.log(err.messsage)
        res.json({err:"something went wrong while in Postissue api!!!"})
    }
    
}

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
        select: 'name',  
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
  .populate({ path: "userid", select: "name address" }); 

    res.status(200).json(requests);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: "Something went wrong fetching technician requests" });
  }
};

RaiseRequestCtrl.TechnicianAccept = async (req, res) => {
  const { requestid } = req.params;
  const technicianId = req.userid; 

  try {
    const updated = await RaiseRequest.findByIdAndUpdate(
      requestid,
      { status: "assigned", assignAt: new Date(), assignedto: technicianId },
      { new: true }
    );
    res.status(200).json(updated);
  } catch(err) {
    console.log(err.message);
    res.status(500).json({ err: "Update failed" });
  }
};

RaiseRequestCtrl.TechnicianStatusUpdate = async (req, res) => {
  const { requestid } = req.params;
  const { status, costEstimate } = req.body;
    let message;


  try {
    const updatedRequest = await RaiseRequest.findByIdAndUpdate(
      requestid,
      {
        status,
        costEstimate: costEstimate !== undefined ? costEstimate : undefined,
      },
      { new: true }
    ).populate("assetid");
    if(status==="completed"){
      message=`Your request for  ${updatedRequest.assetid.assetName} has been completed`;
    }
    if(status==="in-process"){
      message=`Your request for  ${updatedRequest.assetid.assetName} has been in progress`
    }
  if(message){
    await Notification.create({
      userid:updatedRequest.userid._id,
      message,
      requestid:updatedRequest._id
    })
  }
   res.status(200).json({
  status: true,
  message: message,
  updated: updatedRequest
});

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: "Something went wrong while updating technician status!" });
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
    const inprocessrequest=await RaiseRequest.countDocuments({assignedto:req.userid,status:["pending","assigned"]})
    const completedrequest=await RaiseRequest.countDocuments({assignedto:req.userid,status:"completed"})

    res.status(200).json({technicianassignstats,technicianpendingrequest,inprocessrequest,completedrequest})

  }catch(err){
    console.log(err.message)
    res.status(400).json({err:"something went wrong while fetching fetchtechnician Stats!!!"})
  }
  
}



export default RaiseRequestCtrl