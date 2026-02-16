import { TechData } from "../context/Techniciandatamaintenance";
import { useState, useEffect } from "react";

export default function RequestDetails() {
  const { technicianassignedassert } = TechData();
  const [loading, setLoading] = useState(true);
  console.log(technicianassignedassert)

  useEffect(() => {
    if (technicianassignedassert) {
      setTimeout(() => {
        setLoading(false)
        
      }, 400);
    }
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
  <div className="font-sans mt-6 space-y-6">
  <h1 className="text-2xl font-semibold text-gray-800">
    Request Details
  </h1>

  {technicianassignedassert.map((ele) => (
    <div
      key={ele._id}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 space-y-5"
      style={{ fontFamily: "Calibri, sans-serif" }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={ele.assetid?.assetImg || "/placeholder.png"}
            alt={ele.assetid?.assetName || "Asset"}
            className="w-14 h-14 rounded-md object-cover border"
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {ele.assetid?.assetName || "Unknown Asset"}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {ele.aiCategory} • {ele.requesttype}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize
              ${ele.status === "completed" ? "bg-green-100 text-green-700" : ""}
              ${ele.status === "in-process" ? "bg-purple-100 text-purple-700" : ""}
              ${ele.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
            `}
          >
            {ele.status}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize
              ${ele.aiPriority === "high" ? "bg-red-100 text-red-700" : ""}
              ${ele.aiPriority === "medium" ? "bg-orange-100 text-orange-700" : ""}
              ${ele.aiPriority === "low" ? "bg-blue-100 text-blue-700" : ""}
            `}
          >
            {ele.aiPriority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-3">
        <div>
          <span className="font-medium text-gray-700">Created:</span>{" "}
          {new Date(ele.createdAt).toLocaleString()}
        </div>

        <div>
          <span className="font-medium text-gray-700">Assigned:</span>{" "}
          {ele.assignAt
            ? new Date(ele.assignAt).toLocaleString()
            : "Pending"}
        </div>

        <div>
          <span className="font-medium text-gray-700">Completed:</span>{" "}
          {ele.completedAt
            ? new Date(ele.completedAt).toLocaleString()
            : "-"}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Customer Reported Issue
          </h3>
          <p className="text-sm text-gray-600">
            {ele.description}
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            AI Diagnosis
          </h3>
          <p className="text-sm text-gray-700">
            {ele.aiResponse}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

  );
}
