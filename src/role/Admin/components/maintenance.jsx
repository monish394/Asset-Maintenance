import { AdminData } from "../context/Admindatamaintenance";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllGeneralRequest } from "../../../slices/generalrequestslices";


export default function Maintenance() {
  const dispatch = useDispatch()
  const { allraiserequest } = AdminData();
  const GeneralRequest = useSelector((state) => {
    return state.GeneralRequest.data
  })
  // console.log(GeneralRequest)

  useEffect(() => {
    dispatch(fetchAllGeneralRequest())


  }, [])

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">Active Issue Requests</h2>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-[0.1em]">
            <tr>
              <th className="px-6 py-4 text-left">Asset Details</th>
              <th className="px-6 py-4 text-left">Requester</th>
              <th className="px-6 py-4 text-left">Technician</th>
              <th className="px-6 py-4 text-left">Priority & Status</th>
              <th className="px-6 py-4 text-left">Maintenance Summary</th>
              <th className="px-6 py-4 text-right">Financials</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allraiserequest.length > 0 ? (
              allraiserequest.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                        {req.assetid?.assetImg ? (
                          <img src={req.assetid.assetImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">N/A</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{req.assetid?.assetName || "N/A"}</p>
                        <p className="text-[10px] text-slate-400 font-medium capitalize">{req.assetid?.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-700">{req.userid?.name || "N/A"}</p>
                    <p className="text-[10px] text-slate-400">{req.userid?.phone || "N/A"}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-xs font-semibold ${req.assignedto ? "text-slate-700" : "text-rose-500 italic"}`}>
                      {req.assignedto?.name || "Unassigned"}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${req.aiPriority === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" : req.aiPriority === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                        {req.aiPriority || "Low"} Priority
                      </span>
                      <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${req.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-[250px] mb-2" title={req.description}>
                      {req.description || "No description provided"}
                    </p>
                    {req.faultImg && (
                      <img
                        src={req.faultImg}
                        alt="Fault"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-100 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                        onClick={() => window.open(req.faultImg, '_blank')}
                      />
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-black text-slate-800">₹{req.costEstimate || "0"}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Est. Recovery</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center px-4 py-6 text-gray-500">No requests to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">Working On Assets</h2>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-[0.1em]">
            <tr>
              <th className="px-6 py-4 text-left">Asset Details</th>
              <th className="px-6 py-4 text-left">User Info</th>
              <th className="px-6 py-4 text-left">Technician</th>
              <th className="px-6 py-4 text-left">Engagement</th>
              <th className="px-6 py-4 text-left">Issue Summary</th>
              <th className="px-6 py-4 text-right">Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allraiserequest.filter((req) => req.status === "assigned" || req.status === "in-process").length > 0 ? (
              allraiserequest
                .filter((req) => req.status === "assigned" || req.status === "in-process")
                .map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                          {req.assetid?.assetImg ? (
                            <img src={req.assetid.assetImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">N/A</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{req.assetid?.assetName || "N/A"}</p>
                          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{req.assetid?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700">{req.userid?.name || "N/A"}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{req.userid?.phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                        <p className="text-xs font-semibold text-indigo-600">{req.assignedto?.name || "Assigning..."}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`w-fit px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${req.aiPriority === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                          {req.aiPriority || "Medium"} Priority
                        </span>
                        <span className="w-fit px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {req.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px] mb-2" title={req.description}>
                        {req.description || "In progress..."}
                      </p>
                      {req.faultImg && (
                        <img
                          src={req.faultImg}
                          alt="Fault"
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 cursor-pointer hover:scale-110 transition-transform shadow-sm"
                          onClick={() => window.open(req.faultImg, '_blank')}
                        />
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-black text-slate-800">₹{req.costEstimate || "0"}</p>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center px-4 py-6 text-gray-500">No working assets to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">Completed Requests</h2>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-[0.1em]">
            <tr>
              <th className="px-6 py-4 text-left">Resolved Asset</th>
              <th className="px-6 py-4 text-left">Owner</th>
              <th className="px-6 py-4 text-left">Fulfilled By</th>
              <th className="px-6 py-4 text-left">Outcome</th>
              <th className="px-6 py-4 text-left">Closing Notes</th>
              <th className="px-6 py-4 text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allraiserequest.filter((req) => req.status === "completed").length > 0 ? (
              allraiserequest
                .filter((req) => req.status === "completed")
                .map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 ">
                          {req.assetid?.assetImg ? (
                            <img src={req.assetid.assetImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[8px] text-slate-300">N/A</div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-600  decoration-slate-300">{req.assetid?.assetName || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-semibold text-slate-600">{req.userid?.name || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-emerald-600">{req.assignedto?.name || "System"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Resolved
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic max-w-[200px] mb-1">{req.description || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-bold text-slate-900">₹{req.costEstimate || "0"}</p>
                      <p className={`inline-block text-xs font-semibold px-2 py-1 rounded-md mt-1 
  ${req.payment ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {req.payment ? "Paid" : "Unpaid"}
                      </p>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center px-4 py-6 text-gray-500">No completed requests to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">General Requests ({GeneralRequest.length})</h2>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-[0.1em]">
            <tr>
              <th className="px-6 py-4 text-left">Requester</th>
              <th className="px-6 py-4 text-left">Issue</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Technician</th>
              <th className="px-6 py-4 text-left">Location / Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {GeneralRequest.length > 0 ? (
              GeneralRequest.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-700">{req.userId?.name || "N/A"}</p>
                    <p className="text-[10px] text-slate-400">{req.userId?.phone || "N/A"}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-600 mb-2 max-w-[200px]" title={req.issue}>
                      {req.issue}
                    </p>

                  </td>
                  <td className="px-6 py-5">
                    <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${req.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      req.status === "ACCEPTED" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                      {req.status} {req.payment && <span className="ml-1 text-[8px] text-emerald-500">(PAID)</span>}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-xs font-semibold ${req.acceptedBy ? "text-indigo-600" : "text-rose-500 italic"}`}>
                      {req.acceptedBy?.name || "Not Accepted Yet"}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic max-w-[250px]" title={req.userId?.address}>
                      {req.userId?.address || "N/A"}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">No general requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
