import { AdminData } from "../context/Admindatamaintenance";

export default function Maintenance() {
  const { allraiserequest } = AdminData();

  return (
  <div className="ml-5">
  <div className="flex-1 p-8 ml-50 space-y-8 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
    
    
  
    
    <div className="p-6 overflow-x-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">All Issue Requests</h2>
      <table className="w-full table-auto text-sm border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr className="text-gray-700 font-medium">
            <th className="px-4 py-3 border text-left">Asset</th>
            <th className="px-4 py-3 border text-left w-28">Image</th>
            <th className="px-4 py-3 border text-left">Raised By</th>
            <th className="px-4 py-3 border text-left">Phone</th>
            <th className="px-4 py-3 border text-left">Technician</th>
            <th className="px-4 py-3 border text-left">Priority</th>
            <th className="px-4 py-3 border text-left">Status</th>
            <th className="px-4 py-3 border text-left w-[400px]">Description</th>
            <th className="px-4 py-3 border text-left">Cost</th>
          </tr>
        </thead>
        <tbody>
          {allraiserequest.length > 0 ? (
            allraiserequest.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 align-middle">
                <td className="px-4 py-3 border font-medium whitespace-nowrap">{req.assetid?.assetName || "N/A"}</td>
                <td className="px-4 py-3 border w-28 h-28 flex items-center justify-center">
                  {req.assetid?.assetImg ? (
                    <img
                      src={req.assetid.assetImg}
                      alt={req.assetid.assetName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </td>
                <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.name || "N/A"}</td>
                <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.phone || "N/A"}</td>
                <td className="px-4 py-3 border whitespace-nowrap">{req.assignedto?.name || "Not Assigned"}</td>
                <td className="px-4 py-3 border">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                <td className="px-4 py-3 border">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "in-process"
                        ? "bg-purple-100 text-purple-800"
                        : req.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 border break-words max-w-[400px]">{req.description}</td>
                <td className="px-4 py-3 border font-semibold whitespace-nowrap">₹{req.costEstimate || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center px-4 py-6 text-gray-500">
                No requests to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

 


 


<div className="p-6 overflow-x-auto bg-white rounded-2xl shadow-lg">
  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Working On Assets</h2>
  <table className="w-full table-auto text-sm border border-gray-200 rounded-lg">
    <thead className="bg-gray-100">
      <tr className="text-gray-700 font-medium">
        <th className="px-4 py-3 border text-left">Asset</th>
        <th className="px-4 py-3 border text-left w-28">Image</th>
        <th className="px-4 py-3 border text-left">User</th>
        <th className="px-4 py-3 border text-left">Phone</th>
        <th className="px-4 py-3 border text-left">Technician</th>
        <th className="px-4 py-3 border text-left">Priority</th>
        <th className="px-4 py-3 border text-left">Status</th>
        <th className="px-4 py-3 border text-left w-[400px]">Description</th>
        <th className="px-4 py-3 border text-left">Cost</th>
      </tr>
    </thead>
    <tbody>
      {allraiserequest.filter((req) => req.status === "assigned" || req.status === "in-process").length > 0 ? (
        allraiserequest
          .filter((req) => req.status === "assigned" || req.status === "in-process")
          .map((req) => (
            <tr key={req._id} className="hover:bg-gray-50 align-middle">
              <td className="px-4 py-3 border font-medium whitespace-nowrap">{req.assetid?.assetName || "N/A"}</td>
              <td className="px-4 py-3 border w-28 h-28 flex items-center justify-center">
                {req.assetid?.assetImg ? (
                  <img
                    src={req.assetid.assetImg}
                    alt={req.assetid.assetName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.name || "N/A"}</td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.phone || "N/A"}</td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.assignedto?.name || "Not Assigned"}</td>
              <td className="px-4 py-3 border">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
              <td className="px-4 py-3 border">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    req.status === "in-process"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3 border break-words max-w-[400px]">{req.description}</td>
              <td className="px-4 py-3 border font-semibold whitespace-nowrap">₹{req.costEstimate || "N/A"}</td>
            </tr>
          ))
      ) : (
        <tr>
          <td colSpan={9} className="text-center px-4 py-6 text-gray-500">
            No working assets to display
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


 <div className="p-6 overflow-x-auto bg-white rounded-2xl shadow-lg">
  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Completed Requests</h2>
  <table className="w-full table-auto text-sm border border-gray-200 rounded-lg">
    <thead className="bg-gray-100">
      <tr className="text-gray-700 font-medium">
        <th className="px-4 py-3 border text-left">Asset</th>
        <th className="px-4 py-3 border text-left w-28">Image</th>
        <th className="px-4 py-3 border text-left">User</th>
        <th className="px-4 py-3 border text-left">Phone</th>
        <th className="px-4 py-3 border text-left">Technician</th>
        <th className="px-4 py-3 border text-left">Priority</th>
        <th className="px-4 py-3 border text-left">Status</th>
        <th className="px-4 py-3 border text-left w-[400px]">Description</th>
        <th className="px-4 py-3 border text-left">Cost</th>
      </tr>
    </thead>
    <tbody>
      {allraiserequest.filter((req) => req.status === "completed").length > 0 ? (
        allraiserequest
          .filter((req) => req.status === "completed")
          .map((req) => (
            <tr key={req._id} className="hover:bg-gray-50 align-middle">
              <td className="px-4 py-3 border font-medium whitespace-nowrap">{req.assetid?.assetName || "N/A"}</td>
              <td className="px-4 py-3 border w-28 h-28 flex items-center justify-center">
                {req.assetid?.assetImg ? (
                  <img
                    src={req.assetid.assetImg}
                    alt={req.assetid.assetName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.name || "N/A"}</td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.userid?.phone || "N/A"}</td>
              <td className="px-4 py-3 border whitespace-nowrap">{req.assignedto?.name || "Not Assigned"}</td>
              <td className="px-4 py-3 border">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
              <td className="px-4 py-3 border">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-green-100 text-green-800">
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3 border break-words max-w-[400px]">{req.description}</td>
              <td className="px-4 py-3 border font-semibold whitespace-nowrap">₹{req.costEstimate || "N/A"}</td>
            </tr>
          ))
      ) : (
        <tr>
          <td colSpan={9} className="text-center px-4 py-6 text-gray-500">
            No completed requests to display
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


  </div>
</div>

  );
}
