import { TechData } from "../context/Techniciandatamaintenance"
import { useState, useEffect } from "react";
import { FaTools, FaCheckCircle } from "react-icons/fa";

export default function ServiceHistory() {
  const { technicianassignedassert } = TechData()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (technicianassignedassert) {
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
  }, [technicianassignedassert]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-32 gap-4">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading service records...</p>
      </div>
    );
  }

  const inProgress = technicianassignedassert.filter(
    ele => ele.status === "in-process"
  )

  const completed = technicianassignedassert.filter(
    ele => ele.status === "completed"
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div
      className="p-8 space-y-8 min-h-screen"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service History</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Track your active and completed maintenance operations.</p>
      </div>

      {/* In Progress Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <FaTools className="text-amber-500" size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">In Progress</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Active work orders</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            {inProgress.length} Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Asset Name</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Issue Description</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Priority</th>
                <th className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Est. Cost</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {inProgress.length ? (
                inProgress.map((ele) => (
                  <tr key={ele._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{ele.assetid?.assetName}</p>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ele.description}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider
                          ${ele.aiPriority === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" : ""}
                          ${ele.aiPriority === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                          ${ele.aiPriority === "low" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : ""}
                        `}
                      >
                        {ele.aiPriority || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-800">
                        {ele.costEstimate ? `₹${ele.costEstimate.toLocaleString()}` : "—"}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <FaTools className="text-slate-300" size={20} />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No active work orders</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-500" size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Completed</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Resolved maintenance jobs</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            {completed.length} Done
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Asset Name</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Issue Description</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Resolved On</th>
                <th className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Final Cost</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {completed.length ? (
                completed.map((ele) => (
                  <tr key={ele._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{ele.assetid?.assetName}</p>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ele.description}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-500">{formatDate(ele.completedAt)}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-800">₹{ele.costEstimate?.toLocaleString() || "0"}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <FaCheckCircle className="text-slate-300" size={20} />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No completed work orders yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
