
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
  const { myasset} = useUserAsset();
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
  
  
  <section className="flex flex-col items-center mt-20 px-4">
    <h2 className="inline text-2xl font-semibold text-gray-800  ">
      Quick Stats Overview
    </h2>

    <div className="w-full max-w-6xl  p-8 ">
      <div className="flex gap-17 flex-wrap justify-center">
        <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-lg transition">
          <div>
            <p className="text-xl text-gray-500">My Assets</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.userassets}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaBoxOpen className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-lg transition">
          <div>
            <p className="text-xl text-gray-500">Active Work Orders</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.activeworkorders}</p>
          </div>
          <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
            <AiFillSetting className="text-red-500 text-3xl" />
          </div>
        </div>

        <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-lg transition">
          <div>
            <p className="text-xl text-gray-500">Pending Requests</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.pendingrequests}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <IoMdClock className="text-yellow-600 text-3xl" />
          </div>
        </div>

        <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-lg transition">
          <div>
            <p className="text-xl text-gray-500">Completed Requests</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{userdashboardstats.completedrequests}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MdDone className="text-green-600 text-3xl" />
          </div>
        </div>
      </div>
    </div>
  </section>
  
)}


   <div className="mt-10">
  <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center md:text-left">
    My Assigned Assets
  </h1>

  <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
            Asset Image
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
            Asset Name
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
            Category
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {myasset.length > 0 ? (
          myasset.map((ele) => (
            <tr key={ele._id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-3">
                <img
                  src={ele.assetImg}
                  alt={ele.assetName}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </td>

              <td className="px-6 py-3 text-sm font-medium text-gray-800">
                {ele.assetName}
              </td>

              <td className="px-6 py-3 text-sm text-gray-600 max-w-[300px] truncate">
                {ele.description}
              </td>

              <td className="px-6 py-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {ele.category}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
              No assets assigned
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>






      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Recent Work Orders</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Work Order #{item}
            </div>
          ))}
        </div>
      </section>

    
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Technician Info Panel</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Technician #{item} Info
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
