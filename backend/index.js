import dotenv from "dotenv";
dotenv.config()
import cors from "cors"
import express from "express";
import { ConfigureDB } from "./config/config.js";
import UserCtrl from "./app/controllers/UsersControllers.js";
import  AssetsCtrl  from "./app/controllers/AssetsControllers.js";
import RaiseRequestCtrl from "./app/controllers/RaiseRequest.js";
import { AuthenticateUser } from "./app/middlewares/AuthenticateUser.js";
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



//assets route

app.post("/api/assets",AssetsCtrl.CreateAsset)

//dashboard stats
app.get("/api/dashboardstats",AssetsCtrl.DashboardStats)

app.get("/api/assets",AssetsCtrl.GetAsset)
app.put("/api/assets/:assetid",AssetsCtrl.Assignuser)
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



















app.listen(PORT,()=>{
    console.log(`server is running on port  ${PORT}`)
})