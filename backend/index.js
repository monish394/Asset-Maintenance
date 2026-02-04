import dotenv from "dotenv";
dotenv.config()
import cors from "cors"
import express from "express";
import { ConfigureDB } from "./config/config.js";
import UserCtrl from "./app/controllers/UsersControllers.js";
import  AssetsCtrl  from "./app/controllers/AssetsControllers.js";
import RaiseRequestCtrl from "./app/controllers/RaiseRequest.js";
import { AuthenticateUser } from "./app/middlewares/AuthenticateUser.js";
import NotificationCtrl from "./app/controllers/NotificationControllers.js";
import PaymentCtrl from "./app/controllers/PaymentCtrl.js";
import RequestCtrl from "./app/controllers/RequestAssetCtrl.js";
import Payment from "./app/models/Payment.js";
const app=express();
app.use(cors())
app.use(express.json())


const PORT=process.env.PORT;
console.log(PORT)
ConfigureDB();

// register route

app.post("/api/usersregister",UserCtrl.Registeruser)
app.post("/api/userslogin",UserCtrl.Loginuser)
app.get("/api/dashboardroute",AuthenticateUser,UserCtrl.dashboardRoute)
app.get("/api/findusers",UserCtrl.FindAllUser)
app.get("/api/findtechnicians",UserCtrl.FindAllTechnician)
app.delete("/api/deleteuser/:id",UserCtrl.DeleteUser)
app.put("/api/updateuser/:id",UserCtrl.EditUser)
app.get("/api/userinfo",AuthenticateUser,UserCtrl.GetuserInfo)


//dashboard stats
app.get("/api/dashboardstats",AssetsCtrl.DashboardStats)
app.get("/api/userdashboardstats",AuthenticateUser,AssetsCtrl.UserStatsDashboard)
app.get("/api/raiserequeststats",RaiseRequestCtrl.getRaiserequestStats)
app.get("/api/technicianstats",AuthenticateUser,RaiseRequestCtrl.getTechnicianStats)






//assets route
app.post("/api/assets",AssetsCtrl.CreateAsset)
app.get("/api/assets",AssetsCtrl.GetAsset)
app.put("/api/assets/:assetid",AuthenticateUser,AssetsCtrl.Assignuser)
app.get("/api/userassets",AuthenticateUser,AssetsCtrl.Userasset)
app.put("/api/editassert/:assetid",AssetsCtrl.EditAllFieldAsset)


//raise request route

app.post("/api/raiserequest",AuthenticateUser,RaiseRequestCtrl.Postissue)
app.get("/api/userraiserequest",AuthenticateUser,RaiseRequestCtrl.Getuserissue)
app.get("/api/allraiserequest",RaiseRequestCtrl.Getallrequest)
app.put("/api/assigntechnician/:requestid", RaiseRequestCtrl.AssignTechnician)
app.get("/api/alltechnicianrequest",AuthenticateUser, RaiseRequestCtrl.getTechnicianrequests)
app.put("/api/raiserequest/accept/:requestid",AuthenticateUser,RaiseRequestCtrl.TechnicianAccept)
app.put("/api/technicianstatusupdate/:requestid",RaiseRequestCtrl.TechnicianStatusUpdate)


//Notification route

app.get("/api/usersnotifications",AuthenticateUser,NotificationCtrl.UsersNotification)
app.get("/api/techniciansnotifications",AuthenticateUser,NotificationCtrl.TechniciansNotification)


//payment route

app.post("/api/create-order", AuthenticateUser, PaymentCtrl.createOrder);
app.post("/api/verify-payment", AuthenticateUser, PaymentCtrl.verifyPayment);
app.get("/api/payment/user", AuthenticateUser, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userid }); 
    res.status(200).json({ payments }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});




// Request for Assets


app.post("/api/requestasset",AuthenticateUser,RequestCtrl.CreateRequest)
app.get("/api/getallrequestasset",RequestCtrl.GetAllRequests)
app.put("/api/updaterequeststatus/:id",RequestCtrl.StausUpdate)
app.get("/api/getusersrequest",AuthenticateUser,RequestCtrl.GetUsersRequest)









app.listen(PORT,()=>{
    console.log(`server is running on port  ${PORT}`)
})