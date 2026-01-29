import { useState } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "axios";

export default function AssignedRequest() {
  const [costEstimateEdit, setCostEstimateEdit] = useState("");
  const [requestid, setRequestid] = useState("")
  const [statusedit, setStatusedit] = useState("")
  const [showeditform, setShoweditform] = useState(false)
  const { technicianassignedassert, setTechnicianassignedassert } = TechData();

  const handleAccept = async (requestId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/raiserequest/accept/${requestId}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );


      setTechnicianassignedassert(prev =>
        prev.map(req =>
          req._id === requestId
            ? { ...res.data, assetid: req.assetid, userid: req.userid }
            : req
        )
      );

    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEdit = (request) => {
    setRequestid(request._id);
    setStatusedit(request.status || "assigned");
    setCostEstimateEdit(request.costEstimate || "");
    setShoweditform(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {};
      if (statusedit && statusedit !== "") payload.status = statusedit;
      if (costEstimateEdit !== "" && costEstimateEdit !== null)
        payload.costEstimate = Number(costEstimateEdit);

      const res = await axios.put(
        `http://localhost:5000/api/technicianstatusupdate/${requestid}`,
        payload
      );

      setTechnicianassignedassert(prev =>
  prev.map(item =>
    item._id === res.data.updated._id
      ? {
          ...item,
          status: res.data.updated.status,
          costEstimate: res.data.updated.costEstimate ?? Number(costEstimateEdit),
        }
      : item
  )
);

      console.log(res.data)
      setShoweditform(false);
      setCostEstimateEdit("")
    } catch (err) {
      console.log(err.message);
    }
  };



  return (
    <div className="p-6">
      {showeditform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShoweditform(false)}
          />

          <div className="relative z-10 w-80 rounded-xl bg-white p-6 shadow-2xl">

            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Update Request Status
            </h3>

            <select
              value={statusedit}
              onChange={(e) => setStatusedit(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm
                   text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="assigned">Assigned</option>
              <option value="in-process">In Process</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="number"
              placeholder="Enter cost estimate"
              value={costEstimateEdit}
              onChange={(e) => setCostEstimateEdit(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm
             text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />


            <div className="flex justify-end gap-3">
              <button
                onClick={() =>{setCostEstimateEdit(""); setShoweditform(false)}}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                     text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium
                     text-white hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


      <h1 className="text-2xl font-bold mb-4">Assigned Requests</h1>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Assigned Requests
      </h2>

      <div className="overflow-x-auto">
       <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 text-sm table-fixed">
    <thead className="bg-blue-50">
      <tr>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Asset</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-2/6">Issue</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Raised By</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Address</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/12">Status</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/12">Assigned At</th>
<th className="px-4 py-3 text-left font-medium text-gray-700 w-1/6">Cost</th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-1/12">Action</th>
      </tr>
    </thead>
    <tbody>
      {technicianassignedassert.map((ele, i) => (
        <tr
          key={ele._id}
          className={`border-t border-gray-200 align-middle ${i % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-gray-100 transition`}
        >
          <td className="px-4 py-3 font-medium text-gray-900 align-middle">{ele.assetid?.assetName || "N/A"}</td>
          <td className="px-4 py-3 text-gray-700 align-middle break-words max-w-[400px]">{ele.description}</td>
          <td className="px-4 py-3 text-gray-700 align-middle">{ele.userid?.name || "N/A"}</td>
          <td className="px-4 py-3 text-gray-700 align-middle">{ele.userid?.address || "N/A"}</td>
          <td className="px-4 py-3 align-middle">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                ele.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : ele.status === "assigned"
                  ? "bg-blue-100 text-blue-800"
                  : ele.status === "in-process"
                  ? "bg-purple-100 text-purple-800"
                  : ele.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {ele.status}
            </span>
          </td>
          <td className="px-4 py-3 text-gray-700 align-middle">
            {ele.assignAt
              ? new Date(ele.assignAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Not Assigned"}
          </td>
          <td className="px-4 py-3 text-gray-700 align-middle">
            {ele.costEstimate ? `$${ele.costEstimate}` : "N/A"}
          </td>
          <td className="px-4 py-3 align-middle space-x-2">
            {ele.status === "pending" && (
              <button
                className=" px-3 py-1 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => handleAccept(ele._id)}
                disabled={ele.status !== "pending"}
              >
                Accept
              </button>
            )}
            {["assigned", "in-process", "completed"].includes(ele.status) && (
              <button
                className="px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                onClick={() => handleEdit(ele)}
              >
                Edit
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}
