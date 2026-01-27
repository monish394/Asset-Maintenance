import { useState } from "react";

import { AdminData } from "../context/Admindatamaintenance";

export default function Admin() {
  const {allraiserequest} =AdminData();
  console.log(allraiserequest)
  const [showdetails,setShowdetails]=useState(false)
  const[requestid,setRequestid]=useState("")
  console.log("requestid -",requestid)
  const[requestinfo,setRequestinfo]=useState(null)

  const handleRequestid=(reqid)=>{
    setRequestid(reqid)
    const allinfo=allraiserequest.find((ele)=>ele._id===reqid)
    console.log(allinfo)
    setRequestinfo(allinfo)

  }


  return (
    <div>
     
      <div className="p-8 mt-20 ml-64">
        <h1>Dashboard Page</h1>

       {showdetails&&requestinfo &&(<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

  <div className="relative z-10 w-96 rounded-xl bg-white p-6 shadow-2xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">Service Request Details</h2>
      <button onClick={()=>{setRequestinfo(null);setShowdetails(false)}
      } className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
    </div>

    <div className="mb-4 border-b border-gray-200 pb-3">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Info</h3>
      <div className="flex justify-between text-sm text-gray-700">
        <span>Status:</span>
        <span className="text-blue-600">{requestinfo?.status}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-700 mt-1">
        <span>Asset Name:</span>
       <span>{requestinfo.assignedto?.name || "Not Assigned"}</span>

      </div>
    </div>

   
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Description</h3>
      <p className="text-sm text-gray-700">
        {requestinfo?.description}
      </p>
    </div>

    
    <div className="mb-4 border-t border-gray-200 pt-3">
      <div className="flex justify-between text-sm text-gray-700">
        <span>Raised By:</span>
        <span>{requestinfo.userid?.name || "N/A"}</span>

      </div>
      <div className="flex justify-between text-sm text-gray-700 mt-1">
        <span>Assigned Technician:</span>
        <span>{requestinfo.assignedto?.name}</span>
      </div>
    </div>

    <div className="flex justify-end">
      <button onClick={() => { setShowdetails(false);
        setRequestinfo(null)
       }} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition text-sm">
        Close
      </button>
    </div>
  </div>
</div>)}

        


        <div className="p-6">
  <h1 className="text-xl font-semibold text-gray-800 mb-4">Recent Request Issues</h1>

  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Asset Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Issue
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Raised By
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {allraiserequest.slice(-5).reverse().map((ele) => (
          <tr key={ele._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-700">{ele.assetid.assetName}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{ele.description}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{ele.userid.name}</td>
            <td className={`px-6 py-4 text-sm font-medium
              ${ele.status === 'assigned' ? 'text-blue-600' :
                ele.status === 'in-process' ? 'text-purple-600' :
                'text-green-600'}`}>
              {ele.status}
            </td>
            <td className="px-6 py-4 text-sm flex gap-2">
              <button
                onClick={() => { setShowdetails(true);
                   handleRequestid(ele._id)  }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
              >
                View
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
