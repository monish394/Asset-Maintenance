import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    requestid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RaiseRequest",
    },
    isread:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const Notification=mongoose.model("Notification",notificationSchema)
export default Notification