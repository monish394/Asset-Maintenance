import RaiseRequest from "../models/RaiseRequest.js";

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
        const alluserissue=await RaiseRequest.find({userid:req.userid}).populate("assetid", "assetName assetImg")
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
        select: 'name', // get technician name
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
    const updated = await RaiseRequest.findByIdAndUpdate(
      requestid ,
      { assignedto: technicianid,status:"assigned" },
      { new: true }
    );

    res.status(200).json(updated);
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
      .populate({ path: "userid", select: "name" });

    res.status(200).json(requests);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: "Something went wrong fetching technician requests" });
  }
};


export default RaiseRequestCtrl