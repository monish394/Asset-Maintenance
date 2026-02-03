import mongoose from "mongoose"

const AssetRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  category: { type: String, required: true },   
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }  
});

const RequestAsset= mongoose.model("AssetRequest", AssetRequestSchema);
export default RequestAsset