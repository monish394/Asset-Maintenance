import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["unassigned", "assigned", "undermaintenance"],
    default: "unassigned",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assetImg: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Asset= mongoose.model("Asset", assetSchema);
export default Asset
