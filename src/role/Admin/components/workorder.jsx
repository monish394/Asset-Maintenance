import Navbar from "./navbar";
import { AdminData } from "../context/Admindatamaintenance";
import {  useState } from "react";
import axios from "axios";
export default function WorkOrder() {
  
  
  const[requestid,setRequestid]=useState("")
  console.log("assetid ",requestid)
  const[technicianid,setTechnicianid]=useState("")
  console.log("tech -",technicianid)
  const [showform,setShowform]=useState(false)
  const {allraiserequest,setAllraiserequest,alltechnicians}=AdminData();
  console.log(alltechnicians)
  console.log(allraiserequest)
 

  
    



const handleAssign = () => {
  if (!technicianid || !requestid) {
    alert("Please select a technician");
    return;
  }

  const technicianObj = alltechnicians.find((t) => t._id === technicianid);

  axios
    .put(`http://localhost:5000/api/assigntechnician/${requestid}`, { technicianid })
    .then((res) => {
      console.log("Updated request:", res.data);

      setAllraiserequest((prev) =>
        prev.map((req) =>
          req._id === requestid
            ? { ...req, assignedto: technicianObj } 
            : req
        )
      );
      setTechnicianid("");

      setShowform(false);
    })
    .catch((err) => console.log(err.message));
};


  return (
    <div className="p-8 mt-20 ml-64">
  {showform && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[90%] p-6 relative animate-fadeIn">
      
      <button
        onClick={() => {
      setTechnicianid("");

          setShowform(false)}}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg"
      >
        ✕
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Assign Technician</h1>
      <p className="text-sm text-gray-500 mb-5">
        Select a technician from the list to assign this request.
      </p>

      <div className="mb-6">
        <label
          htmlFor="technician"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Technician
        </label>
        <select
          id="technician"
          value={technicianid}
          onChange={(e) => setTechnicianid(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
        >
          <option value="">-- Select Technician --</option>
          {alltechnicians.map((ele) => (
            <option key={ele._id} value={ele._id}>
              {ele.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() =>{ 
            setTechnicianid("");
            setShowform(false)}}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}





        <div>
         
               <h1>WorkOrder Page</h1>

        </div>
        <div>
          <h1>Visual overview</h1>


         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
  {allraiserequest.map((ele) => (
    <div
      key={ele._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:blue-400 transition-shadow duration-200 w-full"
    >
    
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-3">
        {ele.assetid?.assetImg ? (
          <img
            src={ele.assetid.assetImg}
            alt={ele.assetid?.assetName}
            className="w-40 h-30 object-cover"
          />
        ) : (
          <span className="text-gray-400 font-medium">No Image</span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {ele.assetid?.assetName || ele.assetid || "Unknown Asset"}
        </h2>

        <p className="text-sm text-balck-500 truncate">
          <span className="font-medium">Raised By:</span> {ele.userid?.name || ele.userid || "Unknown"}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2">
          {ele.description || "No description"}
        </p>

        <p className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`font-semibold ${
              ele.status === "pending"
                ? "text-yellow-600"
                : ele.status === "assigned"
                ? "text-blue-600"
                : ele.status === "in-process"
                ? "text-purple-600"
                : ele.status === "completed"
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {ele.status}
          </span>
        </p>

       <p className="text-sm text-black-500 truncate">
  <span className="font-medium">Assigned To:</span> {ele.assignedto?.name || "Unassigned"}
</p>

      </div>
    </div>
  ))}
</div>
<div className="mt-8">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Actionable Details</h2>
  
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Asset Name</th>

          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Status</th>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Priority</th>

          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Issue</th>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Technician</th>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Assign Technician</th>

        </tr>
      </thead>
      <tbody>
{allraiserequest.map((ele, index) => (
  <tr
    key={ele._id}
    className={`border-t border-gray-200 transition-colors duration-300 ${
      index % 2 === 0
        ? "bg-blue-100 hover:bg-blue-200"
        : "bg-white hover:bg-gray-100"
    }`}
  >
    <td className="px-4 py-2 text-sm text-gray-800 break-words">
      {ele.assetid?.assetName || "Unknown Asset"}
    </td>

    <td className="px-4 py-2 text-sm text-ellipsis overflow-hidden whitespace-nowrap">
      <span
        className={`font-semibold ${
          ele.status === "pending"
            ? "text-yellow-600"
            : ele.status === "assigned"
            ? "text-blue-600"
            : ele.status === "in-process"
            ? "text-purple-600"
            : ele.status === "completed"
            ? "text-green-600"
            : "text-gray-500"
        }`}
      >
        {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
      </span>
    </td>
    <td className="px-4 py-3 align-middle">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      ele.aiPriority === "high"
        ? "bg-red-100 text-red-800 ml-2"
        : ele.aiPriority === "medium"
        ? "bg-yellow-100 text-yellow-800"
        : ele.aiPriority === "low"
        ? "bg-green-100 text-green-800 ml-2"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {ele.aiPriority || "N/A"}
  </span>
</td>

    <td className="px-4 py-2 text-sm text-gray-600 break-words whitespace-normal">
      {ele.description || "No description"}
    </td>

    <td
      className={`px-4 py-2 text-sm font-medium break-words whitespace-normal ${
        ele.assignedto ? "text-blue-800" : "text-red-500"
      }`}
    >
      {ele.assignedto?.name || "Unassigned"}
    </td>

    <td className="px-4 py-2 text-sm">
      {ele.assignedto ? (
        <span className="font-medium text-blue-800">Assigned</span>
      ) : (
        <button
          onClick={() => {
            setRequestid(ele._id);
            setShowform(true);
          }}
          className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
        >
          Assign
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
    </div>
  );
}
