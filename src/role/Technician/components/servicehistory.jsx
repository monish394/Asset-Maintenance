import { TechData } from "../context/Techniciandatamaintenance"
import { useState, useEffect } from "react";
import { FaTools, FaCheckCircle, FaClipboardList } from "react-icons/fa";

export default function ServiceHistory() {
  const { technicianassignedassert, acceptedGeneralRequests } = TechData()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (technicianassignedassert || acceptedGeneralRequests) {
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
  }, [technicianassignedassert, acceptedGeneralRequests]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-32 gap-4">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading service records...</p>
      </div>
    );
  }

  const inProgressAsset = technicianassignedassert.filter(ele => ele.status === "in-process");
  const completedAsset = technicianassignedassert.filter(ele => ele.status === "completed");
  
  const inProgressGeneral = acceptedGeneralRequests.filter(ele => ["ACCEPTED", "APPROVED"].includes(ele.status));
  const completedGeneral = acceptedGeneralRequests.filter(ele => ele.status === "COMPLETED");

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const ServiceTable = ({ data, title, type, isCompleted = false, isGeneral = false }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            {isCompleted ? <FaCheckCircle className="text-emerald-500" size={16} /> : <FaTools className="text-amber-500" size={16} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
          {data.length} {isCompleted ? 'Resolved' : 'Active'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Target</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Issue Details</th>
              <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Timeline</th>
              {!isGeneral && <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Final Cost</th>}
              <th className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {data.length ? (
              data.map((ele) => (
                <tr key={ele._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                        {isGeneral ? "GEN" : (ele.assetid?.assetName?.charAt(0) || "A")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{isGeneral ? "General Support" : (ele.assetid?.assetName || "N/A")}</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">Ref: #{ele._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[300px] text-xs text-slate-500 leading-relaxed line-clamp-2" title={isGeneral ? ele.issue : ele.description}>
                      {isGeneral ? ele.issue : (ele.description || "N/A")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-500 whitespace-nowrap">{formatDate(isCompleted ? (ele.completedAt || ele.updatedAt) : ele.createdAt)}</p>
                  </td>
                  {!isGeneral && (
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                      {ele.costEstimate ? `₹${ele.costEstimate.toLocaleString()}` : "N/A"}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ele.status === "COMPLETED" || ele.status === "completed" ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ['ACCEPTED', 'APPROVED', 'in-process'].includes(ele.status) ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {ele.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isGeneral ? "4" : "5"} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                  No records to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-12 min-h-screen max-w-6xl mx-auto" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service History</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Comprehensive log of your maintenance and assistance performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-4 py-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Asset Maintenance Jobs</h2>
          </div>
          <ServiceTable data={inProgressAsset} title="Active Assets" type="In-process work orders" />
          <ServiceTable data={completedAsset} title="Completed Assets" type="Resolved work orders" isCompleted />
        </section>

        <section className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-4 py-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">General Support Logs</h2>
          </div>
          <ServiceTable data={inProgressGeneral} title="Active General Support" type="Current assistance tasks" isGeneral />
          <ServiceTable data={completedGeneral} title="Completed General Support" type="Finished assistance tasks" isCompleted isGeneral />
        </section>
      </div>
    </div>
  )
}
