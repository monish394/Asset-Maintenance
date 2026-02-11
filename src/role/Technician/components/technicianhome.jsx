import { useEffect, useState } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "axios";
      import { FaUserTie, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

import { FaBoxOpen, FaCheckCircle, FaTools, FaClock } from "react-icons/fa";
import TechnicianStatusPieChart from "./technicianstatspiechart";
import TechnicianRequestCostChart from "./techniciancostlinechart";
export default function TechnicianHome() {
  const [technicianstats, setTechnicianstats] = useState(null);
  const { technicianassignedassert ,techinfo} = TechData();
  console.log(technicianassignedassert)

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/technicianstats", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data)
        setTechnicianstats(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className=" min-h-screen p-8 font-sans">


<div className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-6 
                flex flex-col md:flex-row md:items-center md:justify-between">

  <div>
    <div className="flex items-center gap-3">
      <FaUserTie className="text-gray-600 text-xl" />
      <h1 className="text-3xl font-semibold text-gray-800">
        Welcome, {techinfo?.name}
      </h1>
    </div>

    <p className="text-base text-gray-600 mt-2">
      Technician Dashboard Overview
    </p>

    <div className="mt-4 flex flex-wrap gap-6 text-base text-gray-600">

      <div className="flex items-center gap-2">
        <FaEnvelope className="text-gray-500" />
        <span>{techinfo?.email}</span>
      </div>

      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-gray-500" />
        <span>{techinfo?.address}</span>
      </div>

    </div>
  </div>

  <div className="mt-6 md:mt-0 flex items-center gap-2 text-base text-gray-600">
    <FaCalendarAlt className="text-gray-500" />
    <span>
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  </div>

</div>


      
<h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5 tracking-wide mt-30">
  Assigned Requests Overview
</h1>


{technicianstats && (
  <div className="mt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <div className="bg-white rounded-xl p-6 h-[180px]
                      shadow-sm hover:shadow-md transition-all duration-300 
                      border border-gray-100 flex flex-col justify-between">

        <p className="text-lg font-semibold text-gray-700">
          My Assigned Requests
        </p>

        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-gray-900">
            {technicianstats.technicianassignstats}
          </span>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaBoxOpen className="text-blue-600 text-xl" />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl p-6 h-[180px]
                      shadow-sm hover:shadow-md transition-all duration-300 
                      border border-gray-100 flex flex-col justify-between">

        <p className="text-lg font-semibold text-gray-700">
          Work In Progress
        </p>

        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-gray-900">
            {technicianstats.inprocessrequest}
          </span>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl p-6 h-[180px]
                      shadow-sm hover:shadow-md transition-all duration-300 
                      border border-gray-100 flex flex-col justify-between">

        <p className="text-lg font-semibold text-gray-700">
          Pending Requests
        </p>

        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-gray-900">
            {technicianstats.technicianpendingrequest}
          </span>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FaTools className="text-orange-600 text-xl" />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl p-6 h-[180px]
                      shadow-sm hover:shadow-md transition-all duration-300 
                      border border-gray-100 flex flex-col justify-between">

        <p className="text-lg font-semibold text-gray-700">
          Completed Requests
        </p>

        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-gray-900">
            {technicianstats.completedrequest}
          </span>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
        </div>

      </div>

    </div>
  </div>
)}




      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 mt-10">
  <div className="flex-1 min-w-[300px] max-w-md mt-8">
    <TechnicianStatusPieChart stats={technicianstats} />
  </div>

  <div className="flex-1 min-w-[300px] max-w-2xl">
    <TechnicianRequestCostChart technicianassignedassert={technicianassignedassert} />
  </div>
</div>




     <div className="mt-14 px-6">

  <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-6">
    Recent Assigned Requests
  </h2>

  <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
    <table className="min-w-full text-sm text-left text-gray-700">
      
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
        <tr>
          <th className="px-6 py-4">Asset</th>
          <th className="px-6 py-4">Description</th>
          <th className="px-6 py-4">Raised By</th>
          <th className="px-6 py-4">Address</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Assigned At</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {technicianassignedassert.map((ele, i) => (
          <tr key={i} className="hover:bg-gray-50 transition duration-200">

            <td className="px-6 py-4 flex items-center gap-3">
              {ele.assetid?.assetImg && (
                <img
                  src={ele.assetid.assetImg}
                  alt={ele.assetid.assetName}
                  className="w-12 h-12 rounded-md object-cover"
                />
              )}
              <span className="font-medium text-gray-900">
                {ele.assetid?.assetName || "N/A"}
              </span>
            </td>

            <td className="px-6 py-4 max-w-xs truncate">
              {ele.description}
            </td>

            <td className="px-6 py-4">
              {ele.userid?.name || "N/A"}
            </td>

            <td className="px-6 py-4">
              {ele.userid?.address || "N/A"}
            </td>

            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ele.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : ele.status === "assigned"
                    ? "bg-blue-100 text-blue-700"
                    : ele.status === "in-process"
                    ? "bg-purple-100 text-purple-700"
                    : ele.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ele.status}
              </span>
            </td>

            <td className="px-6 py-4 text-gray-600">
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

          </tr>
        ))}
      </tbody>

    </table>
  </div>

</div>

    </div>
  );
}
