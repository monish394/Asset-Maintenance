import Notification from "../models/NotificationUser.js";

const NotificationCtrl={};

NotificationCtrl.UsersNotification = async (req, res) => {
  try {

    const userNotifications = await Notification.find({
      userid: req.userid
    }).sort({ createdAt: -1 })

    res.status(200).json(userNotifications)

  } catch (err) {
    console.log(err.message)
    res.status(400).json({
      err: "Something went wrong while fetching user notifications"
    })
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