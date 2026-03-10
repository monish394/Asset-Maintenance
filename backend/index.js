import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
import cors from "cors"
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ConfigureDB } from "./config/config.js";
import UserCtrl from "./app/controllers/UsersControllers.js";
import AssetsCtrl from "./app/controllers/AssetsControllers.js";
import RaiseRequestCtrl from "./app/controllers/RaiseRequest.js";
import { AuthenticateUser } from "./app/middlewares/AuthenticateUser.js";
import NotificationCtrl from "./app/controllers/NotificationControllers.js";
import PaymentCtrl from "./app/controllers/PaymentCtrl.js";
import RequestCtrl from "./app/controllers/RequestAssetCtrl.js";
import GeneralRequestCtrl from "./app/controllers/GeneralRequestCtrl.js";
import EnquiryCtrl from "./app/controllers/EnquiryControllers.js";
import AiCtrl from "./app/controllers/AiController.js";
import Payment from "./app/models/Payment.js";
import ChatMessage from "./app/models/ChatMessage.js";
import { upload } from "./app/middlewares/cloudinaryUpload.js";





const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;
ConfigureDB();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    const roomId = userId.toString();
    socket.join(roomId);
    console.log(`User ${roomId} joined room ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, requestId, requestModel, message } = data;
    try {
      const newMessage = new ChatMessage({
        sender,
        receiver,
        requestId,
        requestModel,
        message
      });
      await newMessage.save();

      const messageData = {
        ...newMessage.toObject(),
        sender: newMessage.sender.toString(),
        receiver: newMessage.receiver.toString(),
        requestId: newMessage.requestId.toString()
      };

      io.to(messageData.receiver).emit("receiveMessage", messageData);
      io.to(messageData.sender).emit("receiveMessage", messageData);
    } catch (err) {
      console.error("Socket chat error:", err);
    }
  });

  socket.on("markAsRead", async ({ requestId, userId }) => {
    try {
      await ChatMessage.updateMany(
        { requestId, receiver: userId, isRead: false },
        { isRead: true }
      );

      const messages = await ChatMessage.find({ requestId });
      const uniqueSenders = [...new Set(messages.map(m => m.sender.toString()))];
      uniqueSenders.forEach(sender => {
        if (sender !== userId) {
          io.to(sender).emit("messagesRead", { requestId, readerId: userId });
        }
      });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  });

  socket.on("deleteMessage", async ({ messageId, userId }) => {
    try {
      const msg = await ChatMessage.findById(messageId);
      if (msg && msg.sender.toString() === userId) {
        msg.isDeleted = true;
        msg.message = "This message was deleted";
        await msg.save();
        io.to(msg.receiver.toString()).emit("messageDeleted", { messageId });
        io.to(msg.sender.toString()).emit("messageDeleted", { messageId });
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  });

  socket.on("editMessage", async ({ messageId, userId, newMessage }) => {
    try {
      const msg = await ChatMessage.findById(messageId);
      if (msg && msg.sender.toString() === userId && !msg.isDeleted) {
        msg.message = newMessage;
        msg.isEdited = true;
        await msg.save();
        io.to(msg.receiver.toString()).emit("messageEdited", { messageId, newMessage, isEdited: true });
        io.to(msg.sender.toString()).emit("messageEdited", { messageId, newMessage, isEdited: true });
      }
    } catch (err) {
      console.error("Edit message error:", err);
    }
  });

  socket.on("addReaction", async ({ messageId, userId, emoji }) => {
    try {
      const msg = await ChatMessage.findById(messageId);
      if (msg) {
        const existingIndex = msg.reactions.findIndex(r => r.user.toString() === userId);
        if (existingIndex > -1) {
          msg.reactions[existingIndex].emoji = emoji;
        } else {
          msg.reactions.push({ user: userId, emoji });
        }
        await msg.save();
        io.to(msg.receiver.toString()).emit("reactionUpdated", { messageId, reactions: msg.reactions });
        io.to(msg.sender.toString()).emit("reactionUpdated", { messageId, reactions: msg.reactions });
      }
    } catch (err) {
      console.error("Add reaction error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("io", io);


//public route

app.post("/api/usersregister", UserCtrl.Registeruser)
app.post("/api/userslogin", UserCtrl.Loginuser)
app.post("/api/google-login", UserCtrl.GoogleLogin)
app.get("/api/dashboardroute", AuthenticateUser, UserCtrl.dashboardRoute)
app.get("/api/findusers", UserCtrl.FindAllUser)
app.get("/api/findtechnicians", UserCtrl.FindAllTechnician)
app.delete("/api/deleteuser/:id", UserCtrl.DeleteUser)
app.put("/api/updateuser/:id", UserCtrl.EditUser)
app.put("/api/approve-technician/:id", AuthenticateUser, UserCtrl.ApproveTechnician)
app.get("/api/userinfo", AuthenticateUser, UserCtrl.GetuserInfo)
app.put("/api/changepassword", AuthenticateUser, UserCtrl.ChangePassword)



//all dashboard route
app.get("/api/dashboardstats", AssetsCtrl.DashboardStats)
app.get("/api/userdashboardstats", AuthenticateUser, AssetsCtrl.UserStatsDashboard)
app.get("/api/raiserequeststats", RaiseRequestCtrl.getRaiserequestStats)
app.get("/api/technicianstats", AuthenticateUser, RaiseRequestCtrl.getTechnicianStats)


//assets route

app.post("/api/assets/upload-image", upload.single("image"), AssetsCtrl.UploadAssetImage)
app.post("/api/assets", AssetsCtrl.CreateAsset)
app.get("/api/assets", AssetsCtrl.GetAsset)
app.put("/api/assets/:assetid", AuthenticateUser, AssetsCtrl.Assignuser)
app.get("/api/userassets", AuthenticateUser, AssetsCtrl.Userasset)
app.put("/api/editassert/:assetid", AssetsCtrl.EditAllFieldAsset)
app.put("/api/user/assign-asset/:assetid", AuthenticateUser, AssetsCtrl.AssignAssetToSelf)
app.put("/api/user/unassign-asset/:assetid", AuthenticateUser, AssetsCtrl.UnassignAsset)
app.delete("/api/assets/:assetid", AssetsCtrl.DeleteAsset)



//raise request route

app.post("/api/raiserequest", AuthenticateUser, RaiseRequestCtrl.Postissue)
app.get("/api/userraiserequest", AuthenticateUser, RaiseRequestCtrl.Getuserissue)
app.get("/api/allraiserequest", RaiseRequestCtrl.Getallrequest)
app.put("/api/assigntechnician/:requestid", RaiseRequestCtrl.AssignTechnician)
app.get("/api/alltechnicianrequest", AuthenticateUser, RaiseRequestCtrl.getTechnicianrequests)
app.put("/api/raiserequest/accept/:requestid", AuthenticateUser, RaiseRequestCtrl.TechnicianAccept)
app.put("/api/technicianstatusupdate/:requestid", RaiseRequestCtrl.TechnicianStatusUpdate)



//notification route

app.get("/api/usersnotifications", AuthenticateUser, NotificationCtrl.UsersNotification)
app.get("/api/techniciansnotifications", AuthenticateUser, NotificationCtrl.TechniciansNotification)
app.put("/api/notifications/:id/read", AuthenticateUser, NotificationCtrl.MarkAsRead)
app.put("/api/notifications/mark-all-read", AuthenticateUser, NotificationCtrl.MarkAllAsRead)



//payment route
app.post("/api/create-order", AuthenticateUser, PaymentCtrl.createOrder)
app.post("/api/verify-payment", AuthenticateUser, PaymentCtrl.verifyPayment)
app.get("/api/payment/user", AuthenticateUser, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userid });
    res.status(200).json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

//request for asset

app.post("/api/requestasset", AuthenticateUser, RequestCtrl.CreateRequest)
app.get("/api/getallrequestasset", RequestCtrl.GetAllRequests)
app.put("/api/updaterequeststatus/:id", RequestCtrl.StausUpdate)
app.get("/api/getusersrequest", AuthenticateUser, RequestCtrl.GetUsersRequest)

app.post("/api/generalraiserequest", AuthenticateUser, GeneralRequestCtrl.createGeneralrequest)
app.get("/api/usergeneralrequest", AuthenticateUser, GeneralRequestCtrl.Getusergeneralrequest)

app.post("/api/getnearbytechnician", AuthenticateUser, UserCtrl.getNearbyTechnicians)
app.post("/api/admin/update-tech-coordinates", AuthenticateUser, UserCtrl.updateTechCoordinates)




//general request route

app.get("/api/technician/general-requests", AuthenticateUser, GeneralRequestCtrl.getNearbyOpenRequests)
app.post("/api/technician/general-request/:id/accept", AuthenticateUser, GeneralRequestCtrl.acceptGeneralRequest)
app.get("/api/technician/general-request/assigned", AuthenticateUser, GeneralRequestCtrl.getAssignedRequests)

app.get("/api/gettechnicianaccepetedgeneralrequest", AuthenticateUser, GeneralRequestCtrl.getTechnicianAccecptedGeneralReqeust)

app.get("/api/user/location", AuthenticateUser, UserCtrl.UserLocation)
app.patch("/api/technician/general-request/:id/complete", AuthenticateUser, GeneralRequestCtrl.completeGeneralRequest)
app.get("/api/getnearbyassetrequest", AuthenticateUser, RaiseRequestCtrl.getNearbyAssetRequests)
app.get("/api/getallgeneralrequest", AuthenticateUser, GeneralRequestCtrl.getAllGeneralRequest)

app.post("/api/generate-description", AuthenticateUser, AiCtrl.GenerateDescription)

app.post("/api/enquiry", EnquiryCtrl.createEnquiry)
app.get("/api/enquiries", EnquiryCtrl.getAllEnquiries)




// sockets route

app.get("/api/chat/unread", AuthenticateUser, async (req, res) => {
  try {
    const unread = await ChatMessage.find({ receiver: req.userid, isRead: false });
    const ids = [...new Set(unread.map(m => m.requestId.toString()))];
    res.json(ids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/chat/:requestId", AuthenticateUser, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ requestId: req.params.requestId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/{*splat}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  } else {
    res.status(404).json({ message: "API route not found" });
  }
});

const startServer = () => {
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on port ${PORT}`);
  });
};

httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️  Port ${PORT} busy — retrying in 4 seconds...`);
    httpServer.close();
    setTimeout(startServer, 4000);
  } else {
    throw err;
  }
});

startServer();
