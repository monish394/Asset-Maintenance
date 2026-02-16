import { TechData } from "../context/Techniciandatamaintenance"
import { useState,useEffect } from "react";

export default function ServiceHistory() {
  const { technicianassignedassert } = TechData()
  const [loading, setLoading] = useState(true);
    console.log(technicianassignedassert)
  
    useEffect(() => {
      if (technicianassignedassert) {
        setTimeout(() => {
          setLoading(false)
          
        }, 500);
      }
       }, [technicianassignedassert]);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center mt-20">
          <p className="text-gray-500 text-lg">Loading request details...</p>
        </div>
      );
    }

  const inProgress = technicianassignedassert.filter(
    ele => ele.status === "in-process"
  )

  const completed = technicianassignedassert.filter(
    ele => ele.status === "completed"
  )

  return (
<div
  className="p-8 space-y-10 min-h-screen bg-gray-50"
  style={{ fontFamily: "Calibri, Segoe UI, sans-serif",fontSize:"30px"}}
>
  <h1 className="text-3xl font-semibold text-gray-800">
    Service Details
  </h1>

  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        In Progress Work Orders
      </h2>
      <span className="text-sm text-gray-500 font-medium">
        {inProgress.length} Active
      </span>
    </div>

    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">Asset</th>
            <th className="px-5 py-3 text-left font-semibold">Issue</th>
            <th className="px-5 py-3 text-left font-semibold">Priority</th>
            <th className="px-5 py-3 text-left font-semibold">Cost</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {inProgress.length ? (
            inProgress.map((ele) => (
              <tr key={ele._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 font-medium text-gray-900">
                  {ele.assetid?.assetName}
                </td>

                <td className="px-5 py-3 text-gray-600 max-w-md">
                  {ele.description}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${ele.aiPriority === "high" && "bg-red-100 text-red-700"}
                      ${ele.aiPriority === "medium" && "bg-yellow-100 text-yellow-700"}
                      ${ele.aiPriority === "low" && "bg-green-100 text-green-700"}
                    `}
                  >
                    {ele.aiPriority}
                  </span>
                </td>

                <td className="px-5 py-3 font-semibold text-gray-800">
                  {ele.costEstimate ? `₹${ele.costEstimate}` : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-5 py-6 text-center text-gray-400">
                No in-progress work orders
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Completed Work Orders
      </h2>
      <span className="text-sm text-gray-500 font-medium">
        {completed.length} Completed
      </span>
    </div>

    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">Asset</th>
            <th className="px-5 py-3 text-left font-semibold">Issue</th>
            <th className="px-5 py-3 text-left font-semibold">Completed At</th>
            <th className="px-5 py-3 text-left font-semibold">Cost</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {completed.length ? (
            completed.map((ele) => (
              <tr key={ele._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 font-medium text-gray-900">
                  {ele.assetid?.assetName}
                </td>

                <td className="px-5 py-3 text-gray-600 max-w-md">
                  {ele.description}
                </td>

                <td className="px-5 py-3 text-gray-600">
                  {ele.completedAt
                    ? new Date(ele.completedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-5 py-3 font-semibold text-gray-800">
                  ₹{ele.costEstimate}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-5 py-6 text-center text-gray-400">
                No completed work orders
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
