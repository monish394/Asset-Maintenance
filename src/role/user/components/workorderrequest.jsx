import { useUserAsset } from "../context/userassetprovider";

export default function WorkOrderRequest() {
  const { myraiserequest } = useUserAsset();

  const completedRequests = myraiserequest.filter(req => req.status === "completed");

  return (
    <>
      <div style={{ width: "100%", padding: "30px" }}>
        <h1 style={{ marginBottom: "24px", fontSize: '25px' }}>My Requests</h1>

        {myraiserequest.length === 0 ? (
          <p style={{ textAlign: "center" }}>No requests found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myraiserequest.map(req => (
              <div
                key={req._id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={req.assetid.assetImg}
                  alt={req.assetid.assetName}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2 style={{ margin: 0, fontSize: "1rem" }}>{req.assetid.assetName}</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Category:</strong> {req.aiCategory} | <strong>Priority:</strong> {req.aiPriority}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    <strong>Type:</strong> {req.requesttype} | <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: "#fff",
                        backgroundColor:
                          req.status === "pending"
                            ? "#f39c12"
                            : req.status === "in-progress"
                              ? "#8a50ff"
                              : req.status === "completed"
                                ? "#447132"
                                : "#8132c2",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        display: "inline-block",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      {req.status}
                    </span>
                  </p>

                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Description:</strong> {req.description}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Technician:</strong> {req.assignedto ? req.assignedto.name : "Not assigned"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>AI Response:</strong> {req.aiResponse}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem" }}>
                    <strong>Created At:</strong> {new Date(req.createdAt).toLocaleString()}
                  </p>
                  {req.completedAt && (
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>
                      <strong>Completed At:</strong> {new Date(req.completedAt).toLocaleString()}
                    </p>
                  )}
                  {req.costEstimate && (
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>
                      <strong>Cost Estimate:</strong> ${req.costEstimate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: "100%", padding: "20px" }}>
        <h2 style={{ marginBottom: "12px", fontSize: "20px" }}>Completed Requests</h2>

        {completedRequests.length === 0 ? (
          <p>No completed requests.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {completedRequests.map(req => (
              <div
                key={req._id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={req.assetid.assetImg}
                  alt={req.assetid.assetName}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2 style={{ margin: 0, fontSize: "1rem" }}>{req.assetid.assetName}</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Category:</strong> {req.aiCategory} | <strong>Priority:</strong> {req.aiPriority}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Type:</strong> {req.requesttype}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "2px 0" }}>
                    <span
                      style={{
                        color: "#fff",
                        backgroundColor: "#2a784b",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      COMPLETED
                    </span>
                    <span style={{ fontSize: "0.85rem" }}>
                      <strong>Technician:</strong> {req.assignedto ? req.assignedto.name : "Not assigned"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>Description:</strong> {req.description}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    <strong>AI Response:</strong> {req.aiResponse}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem" }}>
                    <strong>Created At:</strong> {new Date(req.createdAt).toLocaleString()}
                  </p>
                  {req.completedAt && (
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>
                      <strong>Completed At:</strong> {new Date(req.completedAt).toLocaleString()}
                    </p>
                  )}
                  {req.costEstimate && (
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>
                      <strong>Cost Estimate:</strong> ${req.costEstimate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
