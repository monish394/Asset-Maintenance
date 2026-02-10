import { useUserAsset } from "../context/userassetprovider";

export default function WorkOrderRequest() {
  const { myraiserequest } = useUserAsset();

  const completedRequests = myraiserequest.filter(req => req.status === "completed");

  return (
<div className="w-full px-6 py-8 font-sans space-y-12">

 <div>
  <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
    My Requests
  </h2>

  {myraiserequest.length === 0 ? (
    <p className="text-center text-gray-500 py-6">No requests found.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Asset</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Issue</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Priority</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Technician</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Raised At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {myraiserequest.map((req) => (
            <tr key={req._id} className="hover:bg-gray-50 transition-colors align-top">
              <td className="px-4 py-2 flex items-center gap-2">
                {req.assetid?.assetImg && (
                  <img
                    src={req.assetid.assetImg}
                    alt={req.assetid.assetName}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                )}
                <span className="text-gray-800 font-medium">{req.assetid?.assetName || "N/A"}</span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 whitespace-pre-wrap">{req.description}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.aiPriority === "high"
                      ? "bg-red-100 text-red-800"
                      : req.aiPriority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.aiPriority === "low"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {req.aiPriority || "N/A"}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{req.assignedto?.name || "Unassigned"}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.status === "in-progress"
                      ? "bg-purple-100 text-purple-800"
                      : req.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">
                {new Date(req.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


<div>
  <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
    Completed Requests
  </h2>

  {completedRequests.length === 0 ? (
    <p className="text-center text-gray-500 py-6">No completed requests.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Asset</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Issue</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Priority</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Technician</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {completedRequests.map((req) => (
            <tr key={req._id} className="hover:bg-gray-50 transition-colors align-top">
             <td className="px-4 py-2 flex items-center gap-2">
  {req.assetid?.assetImg && (
    <img
      src={req.assetid.assetImg}
      alt={req.assetid.assetName}
      className="w-14 h-14 object-cover rounded-md"
    />
  )}
  <span className="text-gray-800 font-medium">{req.assetid?.assetName || "N/A"}</span>
</td>

              <td className="px-4 py-2 text-sm text-gray-700 whitespace-pre-wrap">{req.description}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.aiPriority === "high"
                      ? "bg-red-100 text-red-800"
                      : req.aiPriority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.aiPriority === "low"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {req.aiPriority || "N/A"}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{req.assignedto?.name || "Unassigned"}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  COMPLETED
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">
                {new Date(req.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

</div>


  );
}
