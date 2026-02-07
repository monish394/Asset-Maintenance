// import { required } from "joi";
import mongoose from "mongoose";
const GeneralRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  issue:{type: String ,required:true},
  status: {
    type: String,
    enum: ["OPEN", "ACCEPTED", "APPROVED", "COMPLETED"],
    default: "OPEN"
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GeneralRequest=mongoose.model("GeneralRequest",GeneralRequestSchema)

export default GeneralRequest