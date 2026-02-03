import RequestAsset from "../models/RequestAsset.js";


const RequestCtrl={}


RequestCtrl.CreateRequest=async (req,res) => {
    const body=req.body;

    try{
        const requestasset=new RequestAsset({name:body.name,category:body.category,requestedBy:req.userid})
        await requestasset.save()
        res.status(200).json(requestasset)

    }catch(err){
        res.status(400).json({err:"something went wrong while creating the Requesting for Asset!!!"})
        console.log(err.message)
    }
    
}

RequestCtrl.GetAllRequests=async (req,res) => {


    try{
        const Allrequest=await RequestAsset.find().populate("requestedBy name")
        res.status(200).json(Allrequest)

    }catch(err){
        res.status(400).json({err:'something went wrong while fetching All requests!!'})
        console.log(err.message)
    }
    
}

RequestCtrl.StausUpdate=async (req,res) => {
    const {status}=req.body;
    const id=req.params.id;
    try{
        const updaterequeststatus=await RequestAsset.findByIdAndUpdate(id,{status:status},{new:true})
        res.status(200).json(updaterequeststatus)

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while updating request status!!!"})
    }
    
}


RequestCtrl.GetUsersRequest=async (req,res) => {
    try{
        const userrequestasset=await RequestAsset.find({requestedBy:req.userid})
        res.status(200).json(userrequestasset)

    }catch(err){
        res.status(400).json({err:"something went wrong while fetching user request!!!"})
        console.log(err.message)
    }
    
}

export default RequestCtrl