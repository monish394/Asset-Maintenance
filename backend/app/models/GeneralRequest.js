import mongoose from "mongoose";

const GeneralRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  issue: {
    type: String,
    required: true
  },
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
  },
  status: {
    type: String,
    enum: ["OPEN", "ACCEPTED", "APPROVED", "COMPLETED"],
    default: "OPEN"
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

GeneralRequestSchema.index({ location: "2dsphere" });

export default mongoose.model("GeneralRequest", GeneralRequestSchema);
