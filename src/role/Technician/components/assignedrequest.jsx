import { useState,useEffect } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "axios";
import OSMTrackMap from "./techniciantrack";

export default function AssignedRequest() {
const [showMap, setShowMap] = useState(false);
const [trackAddress, setTrackAddress] = useState("");
const [acceptedtechniciangeneralreqeust,setAcceptedtechniciangeneralreqeust]=useState([])
console.log(acceptedtechniciangeneralreqeust)


  const [costEstimateEdit, setCostEstimateEdit] = useState("");
  const [requestid, setRequestid] = useState("")
  const [statusedit, setStatusedit] = useState("")
  const [showeditform, setShoweditform] = useState(false)
  const { technicianassignedassert, setTechnicianassignedassert,requests,setRequests } = TechData();
  // console.log(requests)


  useEffect(()=>{
    axios.get("/api/gettechnicianaccepetedgeneralrequest",
      {headers:{
        Authorization:localStorage.getItem("token")

    }})
    .then((res)=>{
      setAcceptedtechniciangeneralreqeust(res.data)
      // console.log(res.data)
    })
    .catch((err)=>console.log(err.message))

  },[])



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
          completedAt: res.data.updated.completedAt ?? item.completedAt 
        }
      : item
  )
)


      console.log(res.data)
      setShoweditform(false);
      setCostEstimateEdit("")
    } catch (err) {
      console.log(err.message);
    }
  };

const handleTrack = (address) => {
  if (!address) return alert("User address not available");
  setTrackAddress(address);
  setShowMap(true);
};




const handleGeneralAccept = async (id) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/technician/general-request/${id}/accept`,
      {},
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    setRequests(prev => prev.filter(req => req._id !== id));
    setAcceptedtechniciangeneralreqeust(prev => [...prev, res.data]);

  } catch (err) {
    if (err.response?.status === 400) {
      alert(err.response.data.err || "This request is already accepted by another technician");
      setRequests(prev => prev.filter(req => req._id !== id));
    } else {
      console.error("Failed to accept request:", err.response?.data || err.message);
    }
  }
};





const handleComplete = async (requestId) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/technician/general-request/${requestId}/complete`,
      {},
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    setAcceptedtechniciangeneralreqeust((prev) =>
      prev.map((req) => (req._id === requestId ? res.data : req))
    );
  } catch (err) {
    console.log("Error completing request:", err.response?.data || err.message);
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

     {showMap && trackAddress && (
  <OSMTrackMap
    userAddress={trackAddress}
    onClose={() => setShowMap(false)}
  />
)}



     

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Assigned Requests
      </h2>

      <div className="overflow-x-auto">
<div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 font-[Inter]">

  <table className="min-w-full text-base">

    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Asset</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Issue</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Raised By</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Address</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Priority</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Assigned</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Cost</th>
        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Action</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {technicianassignedassert.map((ele) => (
        <tr
          key={ele._id}
          className="hover:bg-gray-50 transition duration-200"
        >
          <td className="px-5 py-4 font-semibold text-gray-900">
            {ele.assetid?.assetName || "N/A"}
          </td>

          <td className="px-5 py-4 text-gray-700 max-w-xs truncate">
            {ele.description}
          </td>

          <td className="px-5 py-4 text-gray-700">
            {ele.userid?.name || "N/A"}
          </td>

          <td className="px-5 py-4 text-gray-700 truncate">
            {ele.userid?.address || "N/A"}
          </td>

          <td className="px-5 py-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                ele.aiPriority === "high"
                  ? "bg-red-100 text-red-700"
                  : ele.aiPriority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : ele.aiPriority === "low"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {ele.aiPriority || "N/A"}
            </span>
          </td>

          <td className="px-5 py-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                ele.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : ele.status === "assigned"
                  ? "bg-blue-100 text-blue-700"
                  : ele.status === "in-process"
                  ? "bg-purple-100 text-purple-700"
                  : ele.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {ele.status}
            </span>
          </td>

          <td className="px-5 py-4 text-gray-600 text-sm">
            {ele.assignAt
              ? new Date(ele.assignAt).toLocaleDateString()
              : "—"}
          </td>

          <td className="px-5 py-4 text-gray-800 font-semibold">
            ₹ {ele.costEstimate || "—"}
          </td>

          <td className="px-5 py-4 space-x-2">
            {ele.status === "pending" && (
              <button
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => handleAccept(ele._id)}
              >
                Accept
              </button>
            )}

            {["assigned", "in-process", "completed"].includes(ele.status) && (
              <button
                className="px-4 py-2 text-sm font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
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



<div className="p-6 rounded-2xl font-[Poppins]">

  <h1 className="text-xl md:text-3xl font-semibold text-gray-800 mb-8 tracking-tight">
    Assigned Requests
  </h1>

  {technicianassignedassert.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {technicianassignedassert.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 p-5 flex flex-col justify-between"
        >
          <div>
            <h4 className="text-gray-900 font-semibold text-lg mb-3 truncate">
              {item.userid?.name}
            </h4>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium text-gray-700">Phone:</span>{" "}
                <a
                  href={`tel:${item.userid?.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.userid?.phone}
                </a>
              </p>

              <p>
                <span className="font-medium text-gray-700">Address:</span>{" "}
                {item.userid?.address}
              </p>

              <p>
                <span className="font-medium text-gray-700">Asset:</span>{" "}
                {item.assetid?.assetName}
              </p>

              <p className="truncate">
                <span className="font-medium text-gray-700">Issue:</span>{" "}
                {item?.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleTrack(item.userid?.address)}
            className="mt-5 w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Track
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-10 text-gray-500 text-sm">
      No assigned requests available.
    </div>
  )}

</div>



<div className="p-6 bg-gray-50 rounded-xl font-[Poppins] mt-8">

  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 tracking-tight">
    General Requests
  </h2>

  {requests.length === 0 ? (
    <div className="text-center py-8 text-gray-500 text-base">
      No general requests available
    </div>
  ) : (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-base">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              User
            </th>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              Issue
            </th>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              Phone
            </th>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              Address
            </th>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="px-5 py-4 text-left font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {requests.map((req) => (
            <tr
              key={req._id}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-5 py-4 font-medium text-gray-900">
                {req.userId?.name}
              </td>

              <td className="px-5 py-4 text-gray-700">
                {req.issue}
              </td>

              <td className="px-5 py-4 text-gray-700">
                {req.userId?.phone}
              </td>

              <td className="px-5 py-4 text-gray-700">
                {req.userId?.address}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    req.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {req.status}
                </span>
              </td>

              <td className="px-5 py-4">
                {req.status === "OPEN" && (
                  <button
                    onClick={() => handleGeneralAccept(req._id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                  >
                    Accept
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )}

</div>





<div className="p-6 mt-10 bg-gray-50 rounded-xl font-[Montserrat]">

  <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
    Accepted Requests
  </h2>

  {acceptedtechniciangeneralreqeust.length === 0 ? (
    <p className="text-gray-500 text-center text-base py-6">
      No accepted requests yet
    </p>
  ) : (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-base">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-700">User</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Issue</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">Address</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {acceptedtechniciangeneralreqeust.map((req) => (
            <tr
              key={req._id}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900">
                {req.userId?.name}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {req.issue}
              </td>

              <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                {req.userId?.phone}
              </td>

              <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                {req.userId?.address}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    req.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {req.status}
                </span>
              </td>

              <td className="px-6 py-4 flex gap-3 whitespace-nowrap">
                <button
                  onClick={() => handleTrack(req.userId?.address)}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Track
                </button>

                {req.status !== "COMPLETED" && (
                  <button
                    onClick={() => handleComplete(req._id)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Complete
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )}
</div>








      </div>
    </div>
  );
}
