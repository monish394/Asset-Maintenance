import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAsset } from "../context/userassetprovider";

export default function Payment() {
  const [paidRequests, setPaidRequests] = useState([]);
  const { myraiserequest } = useUserAsset();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => setRazorpayLoaded(true);
  document.body.appendChild(script);

  
  const token = localStorage.getItem("token");
  if (token) {
   axios
  .get("http://localhost:5000/api/payment/user", { headers: { Authorization: token } })
  .then((res) => {
    const paidIds = res.data.payments 
      .map((p) => p.raiseRequestId);
    setPaidRequests(paidIds);
  })
  .catch((err) => console.error(err));

  }
}, []); 


  if (!myraiserequest || myraiserequest.length === 0) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>No requests found.</p>;
  }

  const completedRequests = myraiserequest.filter(
    (req) => req.status?.toLowerCase() === "completed"
  );

  const handlePayment = async (request) => {
    try {
      if (!window.Razorpay || !razorpayLoaded) {
        alert("Razorpay not loaded yet");
        return;
      }

      setLoadingId(request._id);

      const { data } = await axios.post(
        "http://localhost:5000/api/create-order",
        { amount: request.costEstimate, raiseRequestId: request._id },
        { headers: { Authorization: localStorage.getItem("token")} }
      );

      if (!data.success) {
        alert("Order creation failed");
        setLoadingId(null);
        return;
      }

      const { order } = data;

      const options = {
        key: "rzp_test_SASa7h9ZCNmybV",
        amount: order.amount,
        currency: "INR",
        name: "Mk_Assets",
        description: "Payment for asset",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: request.costEstimate,
                raiseRequestId: request._id,
              },
              { headers: { Authorization: localStorage.getItem("token")} }
            );

            if (verifyRes.data.success) {
             
              setPaidRequests((prev) => [...prev, request._id]);
            } else {
              alert("Payment verification failed ❌");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed ❌");
          }

          setLoadingId(null);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9655181539",
        },
        theme: { color: "#4caf50" },
        modal: { ondismiss: () => setLoadingId(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setLoadingId(null);
    }
  };

  return (
    <div>
     <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 20 }}>
    Completed Requests & Payments
  </h2>
<div
  style={{
    maxWidth: "100%",
    margin: "50px auto",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Poppins, sans-serif",
  }}
  
>
  
  {completedRequests.length === 0 ? (
    <p style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
      No completed requests available for payment.
    </p>
  ) : (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: 800,
          fontSize: 14,
          color: "#555",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f9fafb" }}>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
              Asset
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
                width: "30%",
              }}
            >
              Description
            </th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
              Status
            </th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
              Amount
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
                whiteSpace: "nowrap",
              }}
            >
              Payment
            </th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {completedRequests.map((request) => {
            const asset = request.assetid || {};
            return (
              <tr
                key={request._id}
                style={{
                  borderBottom: "1px solid #eee",
                  verticalAlign: "middle",
                  transition: "background 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {asset.assetImg && (
                    <img
                      src={asset.assetImg}
                      alt={asset.assetName}
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  )}
                  <span style={{ fontWeight: 500 }}>{asset.assetName || "Asset Name"}</span>
                </td>

                <td style={{ padding: "10px", maxWidth: 300, wordWrap: "break-word" }}>
                  {request.description || "No description"}
                </td>

                <td style={{ padding: "10px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 12,
                      backgroundColor:
                        request.status.toLowerCase() === "completed"
                          ? "#e0f7e9"
                          : "#fde2e2",
                      color:
                        request.status.toLowerCase() === "completed"
                          ? "#2e7d32"
                          : "#c62828",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {request.status}
                  </span>
                </td>

                <td style={{ padding: "10px", fontWeight: 500 }}>₹{request.costEstimate}</td>

                <td style={{ padding: "10px" }}>
                  {paidRequests.includes(request._id) ? (
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: 12,
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        fontWeight: 600,
                        fontSize: 13,
                        display: "inline-block",
                      }}
                    >
                      Success ✅
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: 12,
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        fontWeight: 600,
                        fontSize: 13,
                        display: "inline-block",
                      }}
                    >
                      Pending ⏳
                    </span>
                  )}
                </td>

                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handlePayment(request)}
                    disabled={
                      !razorpayLoaded ||
                      loadingId === request._id ||
                      paidRequests.includes(request._id)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 14,
                      backgroundColor:
                        !razorpayLoaded ||
                        loadingId === request._id ||
                        paidRequests.includes(request._id)
                          ? "#74d659"
                          : "#5a57e1",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor:
                        !razorpayLoaded ||
                        loadingId === request._id ||
                        paidRequests.includes(request._id)
                          ? "not-allowed"
                          : "pointer",
                      transition: "background 0.3s",
                    }}
                  >
                    {paidRequests.includes(request._id)
                      ? "Paid ✅"
                      : loadingId === request._id
                      ? "Processing..."
                      : "Pay Now"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
</div>


  );
}
