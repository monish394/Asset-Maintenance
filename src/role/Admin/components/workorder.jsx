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
  const handleSubmit=()=>{
    
    setShowform(!showform)
  }


  
    



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
            ? { ...req, assignedto: technicianObj, status: "assigned" } // <-- assign full object
            : req
        )
      );

      setShowform(false);
    })
    .catch((err) => console.log(err.message));
};


  return (
    <div className="p-8 mt-20 ml-64">
  {showform&&<div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">

  <div className="bg-white rounded-lg shadow-lg p-6 w-80">
   
    <h1 className="text-lg font-semibold text-gray-800 mb-4">Assign Technician</h1>
    <div className="flex flex-col gap-2 mb-4">
      <label htmlFor="technician" className="text-sm font-medium text-gray-700">
        Select Technician
      </label>
      <select value={technicianid} onChange={e=>setTechnicianid(e.target.value)}
        id="technician"
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Technician --</option>
        {
          alltechnicians.map((ele)=>{
            
            
            return <option  value={ele._id}>{ele.name}</option>
          })
        }
      </select>
    </div>
    <div className="flex justify-end gap-2">
      <button onClick={handleSubmit} className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
        Cancel
      </button>
      <button onClick={handleAssign} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Assign
      </button>
    </div>
  </div>
</div>}


        <div>
         
               <h1>WorkOrder Page</h1>

        </div>
        <div>
          <h1>Visual overview</h1>


         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
  {allraiserequest.map((ele) => (
    <div
      key={ele._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
    >
    
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center p-3">
        {ele.assetid?.assetImg ? (
          <img
            src={ele.assetid.assetImg}
            alt={ele.assetid?.assetName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 font-medium">No Image</span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {ele.assetid?.assetName || ele.assetid || "Unknown Asset"}
        </h2>

        <p className="text-sm text-gray-500 truncate">
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

       <p className="text-sm text-gray-500 truncate">
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
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Issue</th>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Technician</th>
          <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Assign Technician</th>

        </tr>
      </thead>
      <tbody>
        {allraiserequest.map((ele) => (
          <tr key={ele._id} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-800">{ele.assetid?.assetName || "Unknown Asset"}</td>
            <td className="px-4 py-2 text-sm">
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
            </td>
            <td className="px-4 py-2 text-sm text-gray-600">{ele.description || "No description"}</td>
<td className="px-4 py-2 text-sm text-gray-800">
  {ele.assignedto?.name || "Unassigned"}
</td>

           <td className="px-4 py-2 text-sm">
  <button onClick={()=>{
    setRequestid(ele._id)
    setShowform(true)
  }}
    className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
  
  >
    Assign
  </button>
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
