import { TechData } from "../context/Techniciandatamaintenance";
import { useState, useEffect } from "react";

export default function RequestDetails() {
  const { technicianassignedassert } = TechData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (technicianassignedassert) setLoading(false);
  }, [technicianassignedassert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-gray-500 text-lg">Loading request details...</p>
      </div>
    );
  }

  if (!technicianassignedassert || technicianassignedassert.length === 0) {
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-gray-500 text-lg">No assigned requests found.</p>
      </div>
    );
  }

  return (
    <div className="font-[Inter] space-y-10 mt-6">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
        Request Details
      </h1>

      {technicianassignedassert.map((ele) => (
        <div key={ele._id} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={ele.assetid?.assetImg || "/placeholder.png"}
                  alt={ele.assetid?.assetName || "Asset Image"}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {ele.assetid?.assetName || "Unknown Asset"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {ele.aiCategory} • {ele.requesttype}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="flex justify-end gap-2">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                      ${ele.status === "completed" ? "bg-green-100 text-green-700" : ""}
                      ${ele.status === "in-progress" ? "bg-orange-100 text-orange-700" : ""}
                      ${ele.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                    `}
                  >
                    {ele.status}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                      ${ele.aiPriority === "high" ? "bg-red-100 text-red-700" : ""}
                      ${ele.aiPriority === "medium" ? "bg-orange-100 text-orange-700" : ""}
                      ${ele.aiPriority === "low" ? "bg-blue-100 text-blue-700" : ""}
                    `}
                  >
                    {ele.aiPriority} Priority
                  </span>
                </div>
                <p className="text-xs text-gray-400">Request ID: {ele._id}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 mt-6 text-sm text-gray-600 border-t pt-4">
              <span>
                <strong className="text-gray-700">Created:</strong>{" "}
                {new Date(ele.createdAt).toLocaleString()}
              </span>
              <span>
                <strong className="text-gray-700">Assigned:</strong>{" "}
                {ele.assignAt ? new Date(ele.assignAt).toLocaleString() : "Pending"}
              </span>
              {ele.completedAt && (
                <span>
                  <strong className="text-gray-700">Completed:</strong>{" "}
                  {new Date(ele.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Issue Details</h2>

            <div className="border-l-4 border-blue-600 pl-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Customer Reported Issue
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">{ele.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">AI Diagnosis</h3>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                    ${ele.aiPriority === "high" ? "bg-red-100 text-red-700" : ""}
                    ${ele.aiPriority === "medium" ? "bg-orange-100 text-orange-700" : ""}
                    ${ele.aiPriority === "low" ? "bg-blue-100 text-blue-700" : ""}
                  `}
                >
                  {ele.aiPriority} Priority
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{ele.aiResponse}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
