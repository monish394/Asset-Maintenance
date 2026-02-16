
import Carousel from "./Carousel";
import { useUserAsset } from "../context/userassetprovider";
import { useEffect, useState } from "react";
import axios from "../../../config/api";
import { FaBoxOpen } from "react-icons/fa6";
import { AiFillSetting } from "react-icons/ai";
import { IoMdClock } from "react-icons/io";
import { PiCurrencyInrLight } from "react-icons/pi";
import { MdDone } from "react-icons/md";




export default function UserHome() {
  const [userdashboardstats,setUserdashboardstats]=useState([])

  const token=localStorage.getItem("token")
  console.log(token)
  const { myasset,myraiserequest} = useUserAsset();
  console.log(myraiserequest)
 console.log("User assets in Home:", myasset);


 useEffect(()=>{
  axios.get("/userdashboardstats",{
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
      {/* <h1 style={{ marginBottom: "20px" }}>User Home Page</h1> */}

      <Carousel />


{userdashboardstats && (
  <div className="mt-20 px-4 md:px-0">
    <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 tracking-wide">
      Quick Stats Overview
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white rounded-2xl p-6 h-[180px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <p className="text-lg font-medium text-gray-700">My Assets</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {userdashboardstats.userassets}
          </span>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaBoxOpen className="text-blue-600 text-2xl md:text-3xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 h-[180px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <p className="text-lg font-medium text-gray-700">Active Work Orders</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {userdashboardstats.activeworkorders}
          </span>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-xl flex items-center justify-center">
            <AiFillSetting className="text-red-600 text-2xl md:text-3xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 h-[180px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <p className="text-lg font-medium text-gray-700">Pending Requests</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {userdashboardstats.pendingrequests}
          </span>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
            <IoMdClock className="text-yellow-600 text-2xl md:text-3xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 h-[180px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <p className="text-lg font-medium text-gray-700">Completed Requests</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {userdashboardstats.completedrequests}
          </span>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-xl flex items-center justify-center">
            <MdDone className="text-green-600 text-2xl md:text-3xl" />
          </div>
        </div>
      </div>

    </div>
  </div>
)}









<div className="mt-10 font-sans mt-20">
  <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center md:text-left tracking-wide">
    My Assigned Assets
  </h1>

  <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 mt-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Asset
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Category
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-100">
        {myasset.length > 0 ? (
          myasset.map((ele) => (
            <tr
              key={ele._id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer rounded-xl"
            >
              <td className="px-6 py-4">
                <img
                  src={ele.assetImg}
                  alt={ele.assetName}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </td>

              <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                {ele.assetName}
              </td>

              <td className="px-6 py-4 text-gray-600 text-sm max-w-[300px] truncate">
                {ele.description}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    ele.category === "Hardware"
                      ? "bg-blue-100 text-blue-800"
                      : ele.category === "Software"
                      ? "bg-green-100 text-green-800"
                      : ele.category === "Network"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ele.category}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
              No assets assigned
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>







<div className="mt-20 px-4 font-sans">
  <h2 className=" md:text-3xl font-bold text-gray-900 mb-6 tracking-wide">
    Recent Work Orders
  </h2>

  <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
    <table className="min-w-full bg-white rounded-2xl">
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
          myraiserequest.slice(-5).map((req) => (
            <tr
              key={req._id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 flex items-center gap-4">
                <img
                  src={req.assetid.assetImg}
                  alt={req.assetid.assetName}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <span className="text-gray-900 font-semibold text-base">
                  {req.assetid.assetName}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
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
                {req.assignedto?.name || "Not Assigned"}
              </td>

              <td className="px-6 py-4 text-gray-700 font-medium flex items-center gap-1">
                {req.costEstimate ? (
                  <>
                    <PiCurrencyInrLight className="inline text-lg " />
                    {req.costEstimate}
                  </>
                ) : (
                  "N/A"
                )}
              </td>

              <td className="px-6 py-4 text-gray-600 max-w-[400px] break-words">
                {req.description}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="px-6 py-12 text-center text-gray-500 font-medium"
            >
              No requests found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>




<div className="mt-20 px-4 font-sans">
  <h2 className=" md:text-3xl font-bold text-gray-900 mb-6 tracking-wide">
    Technician Info
  </h2>

  <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
    <table className="min-w-full bg-white rounded-2xl">
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
            Status
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Working On
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {myraiserequest.length > 0 ? (
          myraiserequest.slice(-5).map((ele) => (
            <tr
              key={ele._id}
              className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <td className="px-6 py-4 text-gray-800 font-semibold">
                {ele.assignedto?.name || "Not Assigned"}
              </td>

              <td className="px-6 py-4 text-gray-700 font-medium">
                {ele.assignedto?.phone || "Not Assigned"}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {ele.assignedto?.address || "Not Assigned"}
              </td>

                <td className="px-4 py-3 whitespace-nowrap">
            <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${
      ele.status === "pending"
        ? "bg-amber-100 text-amber-800"
        : ele.status === "in-process"
        ? "bg-purple-100 text-purple-800"
        : ele.status === "completed"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-blue-100 text-blue-700"
    }`}
  >
    {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
  </span>
          </td>
              <td className="px-6 py-4 flex items-center gap-3">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium whitespace-nowrap">
                  {ele.assetid?.assetName || "N/A"}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-12 text-center text-gray-500 font-medium"
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
