import { TechData } from "../context/Techniciandatamaintenance";
import { useState, useEffect } from "react";
import { FaClipboardList, FaRobot, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";

export default function RequestDetails() {
  const { technicianassignedassert } = TechData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (technicianassignedassert) {
      setTimeout(() => {
        setLoading(false)
      }, 400);
    }
  }, [technicianassignedassert]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-32 gap-4">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading request details...</p>
      </div>
    );
  }

  if (!technicianassignedassert || technicianassignedassert.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-32 gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
          <FaClipboardList className="text-slate-300" size={28} />
        </div>
        <p className="text-slate-400 text-sm font-medium">No assigned requests found.</p>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "in-process": return "bg-indigo-50 text-indigo-600 border border-indigo-100";
      case "pending": return "bg-amber-50 text-amber-600 border border-amber-100";
      case "assigned": return "bg-blue-50 text-blue-600 border border-blue-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high": return "bg-rose-50 text-rose-600 border border-rose-100";
      case "medium": return "bg-amber-50 text-amber-600 border border-amber-100";
      case "low": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request Details</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Detailed view of all your assigned maintenance requests.</p>
      </div>

      <div className="space-y-4">
        {technicianassignedassert.map((ele) => (
          <div
            key={ele._id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                  {ele.assetid?.assetImg ? (
                    <img
                      src={ele.assetid.assetImg}
                      alt={ele.assetid?.assetName || "Asset"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">N/A</div>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {ele.assetid?.assetName || "Unknown Asset"}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium capitalize mt-0.5">
                    {ele.aiCategory} • {ele.requesttype}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(ele.status)}`}>
                  {ele.status}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${getPriorityStyle(ele.aiPriority)}`}>
                  {ele.aiPriority || "N/A"}
                </span>
              </div>
            </div>

            {/* Timeline Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-50 bg-slate-50/50">
              {[
                { label: "Created", value: formatDate(ele.createdAt) },
                { label: "Assigned", value: ele.assignAt ? formatDate(ele.assignAt) : "Pending" },
                { label: "Completed", value: ele.completedAt ? formatDate(ele.completedAt) : "—" }
              ].map((item, idx) => (
                <div key={idx} className={`px-6 py-3 flex items-center gap-2 ${idx < 2 ? "md:border-r border-slate-100" : ""}`}>
                  <FaCalendarAlt className="text-slate-300" size={10} />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs text-slate-600 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationCircle className="text-amber-400" size={12} />
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Reported Issue</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-5">
                  {ele.description}
                </p>
              </div>

              {ele.aiResponse && (
                <div className="bg-gradient-to-r from-indigo-50/50 to-slate-50/50 border border-indigo-100/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRobot className="text-indigo-400" size={12} />
                    <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Diagnosis</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5">
                    {ele.aiResponse}
                  </p>
                </div>
              )}

              {ele.costEstimate && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated Cost</p>
                  <p className="text-lg font-black text-slate-800">₹{ele.costEstimate.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
