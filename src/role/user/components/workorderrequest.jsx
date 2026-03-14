import { useUserAsset } from "../context/userassetprovider";

export default function WorkOrderRequest() {
  const { myraiserequest, usergeneralrequest } = useUserAsset();

  const completedRequests = myraiserequest.filter(ele => ele.status === "completed" || ele.status === "COMPLETED");
  const activeRequests = myraiserequest.filter(ele => ele.status !== "completed" && ele.status !== "COMPLETED");

  const completedGeneralRequests = usergeneralrequest.filter(ele => ele.status === "COMPLETED" || ele.status === "completed");
  const activeGeneralRequests = usergeneralrequest.filter(ele => ele.status !== "COMPLETED" && ele.status !== "completed");

  const renderAssetTable = (requests, emptyMessage) => {
    if (requests.length === 0) {
      return (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Technician</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Raised At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50/50 transition-colors align-top">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {req.assetid?.assetImg ? (
                      <img src={req.assetid.assetImg} alt="" className="w-12 h-12 object-cover rounded-xl shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold">N/A</div>
                    )}
                    <span className="text-slate-700 font-bold text-sm tracking-tight">{req.assetid?.assetName || "General"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-sm">
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{req.description}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    req.aiPriority === "high" ? "bg-rose-50 text-rose-600" :
                    req.aiPriority === "medium" ? "bg-amber-50 text-amber-600" :
                    "bg-emerald-50 text-emerald-600"
                  }`}>
                    {req.aiPriority || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 text-sm font-medium">{req.assignedto?.name || "Pending..."}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    req.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    req.status?.toLowerCase() === 'in-process' ? 'bg-indigo-50 text-indigo-600' :
                    ['pending', 'open'].includes(req.status?.toLowerCase()) ? 'bg-amber-50 text-amber-600' :
                    ['assigned', 'accepted', 'approved'].includes(req.status?.toLowerCase()) ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 text-[11px] font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGeneralTable = (requests, emptyMessage) => {
    if (requests.length === 0) {
      return (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Technician</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50/50 transition-colors align-top">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {req.faultImg ? (
                      <img src={req.faultImg} alt="" className="w-12 h-12 object-cover rounded-xl shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 bg-amber-50 flex items-center justify-center rounded-xl text-amber-500">
                        <span className="text-lg">📋</span>
                      </div>
                    )}
                    <span className="text-slate-400 text-[10px] font-bold">#{req._id.slice(-6).toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{req.issue}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 text-sm font-medium">{req.acceptedBy?.name || "Hunting for tech..."}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    req.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    req.status?.toLowerCase() === 'in-process' ? 'bg-indigo-50 text-indigo-600' :
                    ['pending', 'open'].includes(req.status?.toLowerCase()) ? 'bg-amber-50 text-amber-600' :
                    ['assigned', 'accepted', 'approved'].includes(req.status?.toLowerCase()) ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 text-[11px] font-medium">{new Date(req.createdAt).toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full px-6 py-8 font-sans space-y-12">
      {/* Active Asset Based Requests */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
          Active Asset Maintenance Requests
        </h2>
        {renderAssetTable(activeRequests, "No active asset requests found.")}
      </div>

      {/* Completed Asset Based Requests */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Completed Asset Maintenance Requests
        </h2>
        {renderAssetTable(completedRequests, "No completed asset requests found.")}
      </div>

      {/* Active General Requests Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
          Active General Assistance Requests
        </h2>
        {renderGeneralTable(activeGeneralRequests, "No active general assistance requests found.")}
      </div>

      {/* Completed General Requests Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Completed General Assistance Requests
        </h2>
        {renderGeneralTable(completedGeneralRequests, "No completed general assistance requests found.")}
      </div>
    </div>
  );
}
