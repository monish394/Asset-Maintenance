
import Asset from "../models/AssertSchema.js";
import RaiseRequest from "../models/RaiseRequest.js";
import Notification from "../models/NotificationUser.js";
const AssetsCtrl = {}

AssetsCtrl.CreateAsset = async (req, res) => {
    const body = req.body;
    try {
        const newAsset = new Asset(body);
        await newAsset.save()
        res.status(201).json(newAsset)

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: "Something went wrong!!!" })
    }

}
//get all asset
AssetsCtrl.GetAsset = async (req, res) => {
    try {
        const assets = await Asset.find().populate("assignedTo", "name");
        res.json(assets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }

}

//assign asset to user by admin

AssetsCtrl.Assignuser = async (req, res) => {
  const { assetid } = req.params
  const { userid } = req.body

  try {
    const assignedAsset = await Asset.findByIdAndUpdate(
      assetid,
      { assignedTo: userid, status: "assigned" },
      { new: true }
    ).populate("assignedTo", "name")

    if (!assignedAsset) {
      return res.status(404).json({ err: "Asset not found" })
    }

    await Notification.create({
      userid:assignedAsset.assignedTo._id,
      message: `The asset "${assignedAsset.assetName}" has been assigned to you by the administrator.`
    })

    res.status(200).json({
      message: "Asset assigned successfully",
      asset: assignedAsset
    })

  } catch (err) {
    console.error(err.message)
    res.status(400).json({ err: "Something went wrong!" })
  }
}


//user view asset

AssetsCtrl.Userasset = async (req, res) => {

    try {
        const Userasset = await Asset.find({ assignedTo: req.userid });
        res.json(Userasset);

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ err: "something went wrong whiel fectcing user assert" })
    }

}
//Admin dashboard stats count of totalassert working asert undermaintance pendign 
AssetsCtrl.DashboardStats = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        const workingAssets = await Asset.find({
            status: { $in: ["assigned", "unassigned"] }
        }).countDocuments()
        const undermaintance = await Asset.find({ status: "undermaintenance" }).countDocuments()

        const pendingRequests = await RaiseRequest.countDocuments({ status: "pending" }).countDocuments()

        res.json({
            totalAssets,
            undermaintance,
            workingAssets,
            pendingRequests,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to load counts", error: err.message });
    }
}

//edit asset all fields



AssetsCtrl.EditAllFieldAsset = async (req, res) => {
  const { assetid } = req.params;
  const { assetName, description, category, status, assignedTo, assetImg } = req.body;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetid,
      {
        assetName,
        description,
        category,
        status,
        assignedTo: status === "unassigned" ? null : assignedTo || null,
        assetImg
      },
      { new: true }
    ).populate("assignedTo", "name");

    if (!updatedAsset) return res.status(404).json({ message: "Asset not found" });

    res.json(updatedAsset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


AssetsCtrl.UserStatsDashboard=async (req,res) => {

    try{

        const userassets=await Asset.find({assignedTo:req.userid}).countDocuments()
        const activeworkorders=await RaiseRequest.countDocuments({userid:req.userid,status:["assigned","in-process"]})
        const pendingrequests=await RaiseRequest.countDocuments({userid:req.userid,status:"pending"})
        const completedrequests=await RaiseRequest.countDocuments({userid:req.userid,status:"completed"})
        res.status(200).json({
            userassets,activeworkorders,pendingrequests,completedrequests
        })


    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while fetching user stats!!!"})
    }
    
}

export default AssetsCtrl;