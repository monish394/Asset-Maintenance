
import Carousel from "./Carousel";
import { useUserAsset } from "../context/userassetprovider";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen } from "react-icons/fa6";
import { AiFillSetting } from "react-icons/ai";
import { IoMdClock } from "react-icons/io";
import { MdDone } from "react-icons/md";




export default function UserHome() {
  const [userdashboardstats,setUserdashboardstats]=useState([])

  const token=localStorage.getItem("token")
  console.log(token)
  const { myasset,myraiserequest} = useUserAsset();
  console.log(myraiserequest)
 console.log("User assets in Home:", myasset);


 useEffect(()=>{
  axios.get("http://localhost:5000/api/userdashboardstats",{
    headers:{
      Authorization:token
    }
  })
  .then((res)=>{
    setUserdashboardstats(res.data)
    console.log(res.data)
  })
  .catch((err)=>{
    console.log(err.message)
  })

 },[])









  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>User Home Page</h1>

      <Carousel />


{userdashboardstats && (
  <div className="inline-block bg-gray-100 p-8 rounded-xl border border-slate-200 mt-20 ml-30">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-wide">
  Quick Stats Overview
</h1>


    <div className="flex gap-14 flex-wrap">

      <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xl text-gray-500">My Assets</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.userassets}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 text-3xl"><FaBoxOpen /></span>
        </div>
      </div>

      <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xl text-gray-500">Active Work Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.activeworkorders}</p>
        </div>
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-600 text-3xl"><AiFillSetting /></span>
        </div>
      </div>

      <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xl text-gray-500">Pending Requests</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.pendingrequests}</p>
        </div>
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <span className="text-yellow-600 text-3xl"><IoMdClock /></span>
        </div>
      </div>

      <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xl text-gray-500">Completed Requests</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.completedrequests}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span className="text-green-600 text-3xl"><MdDone /></span>
        </div>
      </div>

    </div>
  </div>
)}




   <div className="mt-10">
  <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center md:text-left">
    My Assigned Assets
  </h1>

 <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mt-6">
  <table className="min-w-full divide-y divide-gray-200 font-sans">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Asset
        </th>
        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Name
        </th>
        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Description
        </th>
        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Category
        </th>
      </tr>
    </thead>

    <tbody className="bg-white divide-y divide-gray-200">
      {myasset.length > 0 ? (
        myasset.map((ele) => (
          <tr
            key={ele._id}
            className="hover:bg-gray-50 transition duration-150 cursor-pointer"
          >
            <td className="px-4 py-2">
              <img
                src={ele.assetImg}
                alt={ele.assetName}
                className="w-12 h-12 object-cover rounded-md border border-gray-200"
              />
            </td>

            <td className="px-4 py-2 text-sm font-medium text-gray-800">
              {ele.assetName}
            </td>

            <td className="px-4 py-2 text-sm text-gray-600 max-w-[250px] truncate">
              {ele.description}
            </td>

            <td className="px-4 py-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {ele.category}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="px-4 py-12 text-center text-gray-500">
            No assets assigned
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

</div>






 <div className="mt-12 px-4">
  <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">
    Recent Work Orders
  </h2>

  <div className="overflow-x-auto shadow-lg rounded-xl">
    <table className="min-w-full bg-white border border-gray-200 rounded-xl">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Asset
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Technician
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Service Cost
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Issue
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {myraiserequest.length > 0 ? (
          myraiserequest.map((req) => (
            <tr
              key={req._id}
              className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 flex items-center gap-3">
                <img
                  src={req.assetid.assetImg}
                  alt={req.assetid.assetName}
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <span className="text-gray-900 font-medium text-base">
                  {req.assetid.assetName}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.status === "assigned"
                      ? "bg-blue-100 text-blue-800"
                      : req.status === "in-process"
                      ? "bg-purple-100 text-purple-800"
                      : req.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {req.status.replace("-", " ")}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-700 font-medium">
                {req.assignedto?.name || "N/A"}
              </td>

              <td className="px-6 py-4 text-gray-700 font-medium">
                {req.costEstimate ? `$${req.costEstimate}` : "N/A"}
              </td>

              <td className="px-6 py-4 text-gray-600 max-w-[400px] break-words">
                {req.description}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              className="px-6 py-6 text-center text-gray-500 font-medium"
            >
              No requests found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>



   <div className="mt-12 px-4">
  <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wide">
    Technician Info
  </h2>

  <div className="overflow-x-auto shadow-lg rounded-xl">
    <table className="min-w-full bg-white border border-gray-200 rounded-xl">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Technician
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Contact
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Working On
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {myraiserequest.length > 0 ? (
          myraiserequest.map((req) => (
            <tr
              key={req._id}
              className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
            
              

              <td className="px-6 py-4 text-gray-700 font-medium">
                {req.assignedto?.name || "Not Assigned"}
              </td>

              <td className="px-6 py-4 text-gray-700 font-medium">
                {req.assignedto?.phone || "Not Assigned"}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {req.assignedto?.address || "N/A"}
              </td>

             
              <td className="px-6 py-4 flex items-center gap-3">
              
                <span className="text-gray-900 font-medium text-base">
                  {req.assetid.assetName}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-6 text-center text-gray-500 font-medium"
            >
              No recent work orders
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
}
