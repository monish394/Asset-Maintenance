import GeneralRequest from "../models/GeneralRequest.js";

const GeneralRequestCtrl={};




GeneralRequestCtrl.createGeneralrequest=async (req,res) => {
    const {issue}=req.body;

    try{
        const createGeneralRequet=new GeneralRequest({issue:issue,userId:req.userid})
        await createGeneralRequet.save()
        res.status(200).json(createGeneralRequet)

        
    }catch(err){
        res.status(400).json({err:"something went wrong while create General Request!!!"})
        console.log(err.message)
    }
    
}

GeneralRequestCtrl.Getusergeneralrequest=async (req,res) => {
    

    try{
        const getusergeneralrequest=await GeneralRequest.find({userId:req.userid})
        res.status(200).json(getusergeneralrequest)

        
    }catch(err){
        res.status(400).json({err:"something went wrong while create General Request!!!"})
        console.log(err.message)
    }
    
}




export default GeneralRequestCtrl