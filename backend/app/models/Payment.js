import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 

  raiseRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RaiseRequest",
    default: null
  },

  generalRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralRequest",
    default: null
  },

  requestType: {
    type: String,
    enum: ["asset", "general"],
    default: "asset"
  },

  orderId: { 
    type: String, 
    required: true 
  }, 

  paymentId: { 
    type: String, 
    required: true 
  }, 

  signature: { 
    type: String, 
    required: true 
  }, 
  amount: { 
    type: Number, 
    required: true 
  }, 

  status: { 
    type: String, 
    enum: ["success", "failed"], 
    required: true 
  }, 

  createdAt: { 
    type: Date, 
    default: Date.now 
  }, 
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
