import { TechData } from "../context/Techniciandatamaintenance";
import { useState, useEffect, useMemo } from "react";
import { FaCalendarAlt, FaExclamationCircle, FaCheckCircle, FaTools, FaHistory, FaUserClock, FaEye, FaCoins } from "react-icons/fa";

export default function RequestDetails() {
  const { technicianassignedassert, acceptedGeneralRequests } = TechData();
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    if (technicianassignedassert || acceptedGeneralRequests) {
      setTimeout(() => {
        setLoading(false)
      }, 400);
    }
  }, [technicianassignedassert, acceptedGeneralRequests]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };



  const RequestTable = ({ data, isGeneral = false }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technician Target</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority/Status</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
            {!isGeneral && <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost Estimate</th>}
            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((req) => (
            <tr key={req._id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                    { (isGeneral ? req.faultImg : req.assetid?.assetImg) ? (
                      <img src={isGeneral ? req.faultImg : req.assetid.assetImg} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[8px] text-slate-300">NO IMG</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{isGeneral ? "General Support" : (req.assetid?.assetName || "Asset")}</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">ID: #{req._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-semibold text-slate-700">{(isGeneral ? req.userId?.name : req.userid?.name) || "Guest"}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{(isGeneral ? req.userId?.address : req.userid?.address) || "Location N/A"}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider w-fit border ${
                    req.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    req.status?.toLowerCase() === 'in-process' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    ['pending', 'open'].includes(req.status?.toLowerCase()) ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    ['assigned', 'accepted', 'approved'].includes(req.status?.toLowerCase()) ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {req.status}
                  </span>
                  {!isGeneral && req.aiPriority && (
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider w-fit border ${
                      req.aiPriority?.toLowerCase() === "high" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      req.aiPriority?.toLowerCase() === "medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      req.aiPriority?.toLowerCase() === "low" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>
                      {req.aiPriority}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <FaCalendarAlt size={10} className="text-slate-300" />
                    <span className="whitespace-nowrap">Created: {formatDate(req.createdAt)}</span>
                  </div>
                  {(req.completedAt || (isGeneral && req.status === 'COMPLETED')) && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600">
                      <FaCheckCircle size={10} className="text-emerald-400" />
                      <span className="whitespace-nowrap">Closed: {formatDate(req.completedAt || req.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </td>
              {!isGeneral && (
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800">
                    {req.costEstimate ? `₹${req.costEstimate.toLocaleString()}` : "N/A"}
                  </p>
                </td>
              )}
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => setSelectedIssue(isGeneral ? req.issue : req.description)}
                  className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  <FaEye size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="py-12 text-center border-t border-slate-50">
          <p className="text-slate-400 text-sm font-medium">No records found.</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-32 gap-4">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading request details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100/50 rounded-xl">
            <FaTools className="text-indigo-600" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Maintenance Management</h1>
            <p className="text-slate-400 text-sm font-medium">Comprehensive overview of all assigned, working, and completed asset tasks</p>
          </div>
        </div>
        <RequestTable data={technicianassignedassert} />
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2.5 bg-blue-100/50 rounded-xl">
            <FaHistory className="text-blue-600" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Support Management</h1>
            <p className="text-slate-400 text-sm font-medium">Master log of all accepted and active general assistance requests</p>
          </div>
        </div>
        <RequestTable data={acceptedGeneralRequests} isGeneral={true} />
      </section>

      {selectedIssue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedIssue(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg"><FaExclamationCircle className="text-amber-500" /></div>
              <h3 className="text-lg font-bold text-slate-900">Issue Description</h3>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">{selectedIssue}</p>
            <button 
              onClick={() => setSelectedIssue(null)}
              className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
