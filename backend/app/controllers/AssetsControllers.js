
import Asset from "../models/AssertSchema.js";
 const AssetsCtrl={}

AssetsCtrl.CreateAsset=async (req,res) => {
    const body=req.body;
    try{
        const newAsset=new Asset(body);
        await newAsset.save()
        res.status(201).json(newAsset)

    }catch(err){
        console.log(err.message)
        res.status(500).json({err:"Something went wrong!!!"})
    }
    
}
//get all asset
AssetsCtrl.GetAsset=async (req,res) => {
     try {
    const assets = await Asset.find().populate("assignedTo", "name"); 
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
    
}

//assign asset to user by admin

AssetsCtrl.Assignuser=async (req,res) => {
    const {assetid}=req.params;
    const {userid}=req.body;


    try{
        const assinguser=await Asset.findByIdAndUpdate(assetid,{assignedTo:userid,status:"assigned"},{new:true}).populate("assignedTo", "name");
        res.json(assinguser)

    }catch(err){
        console.log(err.message);
        res.status(400).josn({err:"somthing went wrong!!!"})
    }
    
}

//user view asset

AssetsCtrl.Userasset=async (req,res) => {

    try{
        const Userasset=await Asset.find({assignedTo:req.userid});
        res.json(Userasset);

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong whiel fectcing user assert"})
    }
    
}



export default AssetsCtrl;