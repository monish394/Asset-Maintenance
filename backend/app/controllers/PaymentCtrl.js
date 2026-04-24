import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";

// Removing global initialization and putting it inside the methods where needed

const PaymentCtrl = {};

PaymentCtrl.createOrder = async (req, res) => {
  try {
    const { amount, raiseRequestId, generalRequestId, requestType } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      order,
      raiseRequestId,
      generalRequestId,
      requestType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

PaymentCtrl.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      raiseRequestId,
      generalRequestId,
      requestType,
    } = req.body;
    const userId = req.userid;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment data" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const status = generated_signature === razorpay_signature ? "success" : "failed";

    const paymentData = {
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      status,
      requestType: requestType || "asset",
    };

    if (requestType === "general") {
      paymentData.generalRequestId = generalRequestId;
    } else {
      paymentData.raiseRequestId = raiseRequestId;
    }

    const payment = new Payment(paymentData);
    await payment.save();

    res.status(200).json({ success: status === "success", payment });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

PaymentCtrl.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userid });
    res.status(200).json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};

export default PaymentCtrl;
