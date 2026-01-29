import Notification from "../models/NotificationUser.js";

const NotificationCtrl={};

NotificationCtrl.UsersNotification=async (req,res) => {

    try{
        const UsersNotification=await Notification.find({userid:req.userid})
        res.json(UsersNotification)

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while feching user Notification!!"})

    }
    
}

NotificationCtrl.TechniciansNotification=async (req,res) => {

    try{
        const techniciannotification=await Notification.find({userid:req.userid})
        res.json(techniciannotification)

    }catch(err){
        console.log(err.message)
        res.status(400).json({err:"something went wrong while fetching technician notification!!"})
    }
    
}

export default NotificationCtrl