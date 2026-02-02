import { useEffect, useState } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "axios";
import { FaBoxOpen, FaCheckCircle, FaTools, FaClock } from "react-icons/fa";
import TechnicianStatusPieChart from "./technicianstatspiechart";
import TechnicianRequestCostChart from "./techniciancostlinechart";
export default function TechnicianHome() {
  const [technicianstats, setTechnicianstats] = useState(null);
  const { technicianassignedassert } = TechData();
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
      <h1  className="text-2xl font-semibold ml-20 text-gray-800 mb-4">
        Assigned Asset's Overview
      </h1>

      {technicianstats && (
        <div className="flex flex-wrap gap-8 justify-center mt-10 mb-10">
          <div className="w-[240px] h-[160px] bg-white border border-gray-300 rounded-2xl px-6 py-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
            <div>
              <p className="text-lg font-medium text-gray-500">My Assigned Assets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {technicianstats.technicianassignstats}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
              <FaBoxOpen className="text-blue-600 text-3xl" />
            </div>
          </div>

          <div className="w-[240px] h-[160px] bg-white border border-gray-300 rounded-2xl px-6 py-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
            <div>
              <p className="text-lg font-medium text-gray-500">Working On</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {technicianstats.inprocessrequest}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
              <FaClock className="text-yellow-600 text-3xl" />
            </div>
          </div>

          <div className="w-[240px] h-[160px] bg-white border border-gray-300 rounded-2xl px-6 py-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
            <div>
              <p className="text-lg font-medium text-gray-500">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {technicianstats.technicianpendingrequest}
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
              <FaTools className="text-orange-600 text-3xl" />
            </div>
          </div>

          <div className="w-[240px] h-[160px] bg-white border border-gray-300 rounded-2xl px-6 py-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
            <div>
              <p className="text-lg font-medium text-gray-500">Completed Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {technicianstats.completedrequest}
              </p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
              <FaCheckCircle className="text-green-600 text-3xl" />
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




      <div className="p-6 space-y-4 mt-15">
        <h2  className="text-2xl font-semibold text-gray-800  mb-4">
          Recent Assigned Requests
        </h2>

        <div className="grid gap-4">
          {technicianassignedassert.map((ele, i) => (
  <div
    key={i}
    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col sm:flex-row gap-4"
  >
    <div className="flex-1 flex flex-col sm:flex-row sm:gap-4">
      {ele.assetid?.assetImg && (
        <img
          src={ele.assetid.assetImg}
          alt={ele.assetid.assetName}
          className="w-20 h-20 rounded-md object-cover mb-2 sm:mb-0"
        />
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {ele.assetid?.assetName || "N/A"}
        </h3>
        <p className="text-gray-700 text-sm mt-1 line-clamp-2">
          {ele.description}
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-1 text-sm text-gray-700 sm:w-[220px]">
      <div>
        <span className="font-semibold">Raised By:</span> {ele.userid?.name || "N/A"}
      </div>
      <div>
        <span className="font-semibold">Address:</span> {ele.userid?.address || "N/A"}
      </div>
      <div>
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
      </div>
      <div>
        <span className="font-semibold">Assigned At:</span>{" "}
        {ele.assignAt
          ? new Date(ele.assignAt).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Not Assigned"}
      </div>
    </div>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
