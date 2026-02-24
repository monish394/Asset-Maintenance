import Notification from "../models/NotificationUser.js";

const NotificationCtrl = {};

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


NotificationCtrl.TechniciansNotification = async (req, res) => {

  try {
    const techniciannotification = await Notification.find({ userid: req.userid })
    res.json(techniciannotification)

  } catch (err) {
    console.log(err.message)
    res.status(400).json({ err: "something went wrong while fetching technician notification!!" })
  }

}



NotificationCtrl.MarkAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isread: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "Failed to mark notification as read" });
  }
};

NotificationCtrl.MarkAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userid: req.userid, isread: false },
      { isread: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "Failed to mark all notifications as read" });
  }
};

export default NotificationCtrl;