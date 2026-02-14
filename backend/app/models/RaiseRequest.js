import mongoose from "mongoose";

const raiseRequestSchema = new mongoose.Schema({

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  assetid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset"
  },

  requesttype: {
    type: String,
    default: null
  },

  description: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "assigned", "in-process", "completed"],
    default: "pending"
  },

  assignedto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  costEstimate: {
    type: Number,
    default: null
  },

  assignAt: {
    type: Date,
    default: null
  },

  completedAt: {
    type: Date,
    default: null
  },

  aiCategory: { type: String, default: null },
  aiPriority: { type: String, default: null },
  aiResponse: { type: String, default: null },

  // ✅ ADD THIS
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

}, { timestamps: true });

raiseRequestSchema.index({ location: "2dsphere" });

const RaiseRequest = mongoose.model("RaiseRequest", raiseRequestSchema);

export default RaiseRequest;
