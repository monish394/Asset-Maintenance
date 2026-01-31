import Razorpay from "razorpay";
import crypto from"crypto"
import Payment from "../models/Payment.js";
const razorpay = new Razorpay({
  key_id:"rzp_test_SASa7h9ZCNmybV",
  key_secret: "pCVRCRUVJA7mgr5uzVZJKUh2",
});

const PaymentCtrl = {};

PaymentCtrl.createOrder = async (req, res) => {
  try {
    const { amount, raiseRequestId } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      order,
      raiseRequestId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
PaymentCtrl.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, raiseRequestId } = req.body;
    const userId = req.userid;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment data" });
    }

    const generated_signature = crypto
      .createHmac("sha256", "pCVRCRUVJA7mgr5uzVZJKUh2") // your Razorpay secret
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const status = generated_signature === razorpay_signature ? "success" : "failed";

    const payment = new Payment({
      userId,
      raiseRequestId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      status,
    });

    await payment.save();

    res.status(200).json({ success: status === "success", payment });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


export default PaymentCtrl;
