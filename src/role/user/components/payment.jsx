import React, { useEffect, useState } from "react";
import axios from "../../../config/api";
import { useUserAsset } from "../context/userassetprovider";

export default function Payment() {
  const [paidRaiseIds, setPaidRaiseIds] = useState([]);
  const [paidGeneralIds, setPaidGeneralIds] = useState([]);
  const { myraiserequest, usergeneralrequest } = useUserAsset();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState("asset");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/payment/user", { headers: { Authorization: token } })
        .then((res) => {
          const raisePaid = res.data.payments
            .filter((p) => p.requestType === "asset" || (!p.requestType && p.raiseRequestId))
            .map((p) => p.raiseRequestId);
          const generalPaid = res.data.payments
            .filter((p) => p.requestType === "general")
            .map((p) => p.generalRequestId);
          setPaidRaiseIds(raisePaid);
          setPaidGeneralIds(generalPaid);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const completedAssetRequests = (myraiserequest || []).filter(
    (req) => req.status?.toLowerCase() === "completed"
  );

  const completedGeneralRequests = (usergeneralrequest || []).filter(
    (req) => req.status?.toUpperCase() === "COMPLETED"
  );

  const handlePayment = async (request, type = "asset") => {
    try {
      if (!window.Razorpay || !razorpayLoaded) {
        alert("Razorpay not loaded yet");
        return;
      }

      setLoadingId(request._id);

      const amount = request.costEstimate || 0;
      const body = type === "general"
        ? { amount, generalRequestId: request._id, requestType: "general" }
        : { amount, raiseRequestId: request._id, requestType: "asset" };

      const { data } = await axios.post(
        "/create-order",
        body,
        { headers: { Authorization: localStorage.getItem("token") } }
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
        description: type === "general" ? "Payment for General Request" : "Payment for Asset Request",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyBody = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              requestType: type,
              ...(type === "general"
                ? { generalRequestId: request._id }
                : { raiseRequestId: request._id }),
            };

            const verifyRes = await axios.post(
              "/verify-payment",
              verifyBody,
              { headers: { Authorization: localStorage.getItem("token") } }
            );

            if (verifyRes.data.success) {
              if (type === "general") {
                setPaidGeneralIds((prev) => [...prev, request._id]);
              } else {
                setPaidRaiseIds((prev) => [...prev, request._id]);
              }
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
        theme: { color: type === "general" ? "#72b058ff" : "#4caf50" },
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

  const tableHeaderStyle = {
    padding: "12px 14px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px",
    verticalAlign: "middle",
    borderBottom: "1px solid #f3f4f6",
    fontSize: 14,
    color: "#374151",
  };

  const badge = (label, bg, color) => (
    <span
      style={{
        padding: "5px 12px",
        borderRadius: 20,
        backgroundColor: bg,
        color,
        fontWeight: 600,
        fontSize: 12,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );

  const payButton = (request, type, isPaid) => (
    <button
      onClick={() => handlePayment(request, type)}
      disabled={!razorpayLoaded || loadingId === request._id || isPaid || !request.costEstimate}
      style={{
        padding: "9px 18px",
        fontSize: 13,
        fontWeight: 600,
        backgroundColor:
          isPaid ? "#74d659" :
          !request.costEstimate ? "#d1d5db" :
          loadingId === request._id ? "#cffca5ff" : "#6366f1",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: isPaid || !request.costEstimate || loadingId === request._id ? "not-allowed" : "pointer",
        transition: "background 0.3s",
        whiteSpace: "nowrap",
      }}
      title={!request.costEstimate ? "Awaiting cost estimate from technician" : undefined}
    >
      {isPaid
        ? "Paid ✅"
        : !request.costEstimate
        ? "No estimate yet"
        : loadingId === request._id
        ? "Processing..."
        : "Pay Now"}
    </button>
  );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "12px 0" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
        Payments
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
        Manage payments for your completed service requests.
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: 0,
        }}
      >
        {[
          { key: "asset", label: "🔧 Asset Requests", count: completedAssetRequests.length },
          { key: "general", label: "📋 General Requests", count: completedGeneralRequests.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderBottom: activeTab === tab.key ? "2px solid #6366f1" : "2px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === tab.key ? "#4887d8ff" : "#6b7280",
              cursor: "pointer",
              marginBottom: -2,
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {tab.label}
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: activeTab === tab.key ? "#ede9fe" : "#f3f4f6",
                color: activeTab === tab.key ? "#6366f1" : "#9ca3af",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === "asset" && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {completedAssetRequests.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 15, padding: "50px 20px" }}>
              No completed asset requests available for payment.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    <th style={tableHeaderStyle}>Asset</th>
                    <th style={{ ...tableHeaderStyle, width: "28%" }}>Description</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Amount</th>
                    <th style={tableHeaderStyle}>Payment</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAssetRequests.map((request) => {
                    const asset = request.assetid || {};
                    const isPaid = paidRaiseIds.includes(request._id);
                    return (
                      <tr key={request._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {asset.assetImg && (
                              <div style={{ width: 70, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                                <img src={asset.assetImg} alt={asset.assetName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{asset.assetName || "—"}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>#{request.assetid?._id?.slice(-6).toUpperCase() || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, maxWidth: 280, wordWrap: "break-word", lineHeight: 1.6, color: "#6b7280" }}>
                          {request.description || "No description"}
                        </td>
                        <td style={tdStyle}>
                          {badge("Completed", "#e0f7e9", "#2e7d32")}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>₹{request.costEstimate || 0}</span>
                        </td>
                        <td style={tdStyle}>
                          {isPaid ? badge("Paid ✅", "#e8f5e9", "#2e7d32") : badge("Pending ⏳", "#fff3e0", "#ef6c00")}
                        </td>
                        <td style={tdStyle}>
                          {payButton(request, "asset", isPaid)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "general" && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {completedGeneralRequests.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 15, padding: "50px 20px" }}>
              No completed general requests available for payment.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    <th style={tableHeaderStyle}>Issue</th>
                    <th style={tableHeaderStyle}>Accepted By</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Amount</th>
                    <th style={tableHeaderStyle}>Payment</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedGeneralRequests.map((request) => {
                    const isPaid = paidGeneralIds.includes(request._id);
                    return (
                      <tr key={request._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ ...tdStyle, maxWidth: 260, wordWrap: "break-word", lineHeight: 1.6 }}>
                          <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                            {request.issue?.substring(0, 80) || "No description"}
                          </div>
                          {request.faultImg && (
                            <div style={{ width: 60, height: 50, borderRadius: 6, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                              <img src={request.faultImg} alt="fault" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                            #{request._id?.slice(-6).toUpperCase()}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: "#374151" }}>
                            {request.acceptedBy?.name || "N/A"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {badge("Completed", "#e0f7e9", "#2e7d32")}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>
                            {request.costEstimate ? `₹${request.costEstimate}` : (
                              <span style={{ color: "#9ca3af", fontSize: 12 }}>Pending estimate</span>
                            )}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {isPaid ? badge("Paid ✅", "#e8f5e9", "#2e7d32") : badge("Pending ⏳", "#fff3e0", "#ef6c00")}
                        </td>
                        <td style={tdStyle}>
                          {payButton(request, "general", isPaid)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "general" && completedGeneralRequests.some(r => !r.costEstimate) && (
        <p style={{ marginTop: 16, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          💡 Requests showing "No estimate yet" are awaiting a cost estimate from the technician before payment can be processed.
        </p>
      )}
    </div>
  );
}
