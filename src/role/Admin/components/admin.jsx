import { useEffect, useState } from "react";
import { AdminData } from "../context/Admindatamaintenance";
import axios from "axios";
import AdminDashboardPieChart from "./Admindashboardpiechart";
import AdminDashboardLineBarChart from "./Admindashboardlinechart";

export default function Admin() {
  const [admindashboardstats, setAdmindashboardstats] = useState(null);
  const [admindashboardraiserequeststats, setAdmindashboardraiserequeststats] = useState(null);
  const { allraiserequest } = AdminData();
  const [showdetails, setShowdetails] = useState(false);
  const [requestid, setRequestid] = useState("");
  console.log(requestid)
  const [requestinfo, setRequestinfo] = useState(null);

  const handleRequestid = (reqid) => {
    setRequestid(reqid);
    const allinfo = allraiserequest.find((ele) => ele._id === reqid);
    setRequestinfo(allinfo);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboardstats")
      .then((res) => setAdmindashboardstats(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/raiserequeststats")
      .then((res) => setAdmindashboardraiserequeststats(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <div>
      <div className="ml-70 mt-10 mb-6 max-w-5xl">
        

      </div>

      {admindashboardstats && (
        <div className="inline-block bg-grey-100 p-8 rounded-xl border border-slate-200 ml-70 mt-6">
          <h1 className="text-2xl text-gray-800 tracking-wide text-center mr-200">
            Assets Overview
          </h1>
          

          <div className="flex gap-8 mt-2">
            <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xl text-gray-500">Total Assets</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {admindashboardstats.totalAssets}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-3xl">📦</span>
              </div>
            </div>

            <div className="w-[220px] h-[150px] bg-white rounded-xl border border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xl text-gray-500">Working</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {admindashboardstats.workingAssets}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-2xl">✔️</span>
              </div>
            </div>

            <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xm text-gray-500">Under Maintenance</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {admindashboardstats.undermaintance}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-orange-600 text-2xl">🔧</span>
              </div>
            </div>

            <div className="w-[220px] h-[150px] bg-white border rounded-xl border-gray-300 px-5 py-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {admindashboardstats.pendingRequests}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 text-2xl">🕒</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ml-40 mt-12 mb-6 max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 ml-45">
          Maintenance & Service Analytics
        </h2>
        <p className="text-xl text-gray-600 ml-45 ">
          Visual analytics showing asset maintenance distribution and service
          request trends. These insights help identify recurring issues,
          workload patterns, and overall system performance.
        </p>
      </div>

      <div className="mt-6 px-4">
        {admindashboardstats && admindashboardraiserequeststats && (
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center ml-40">
            <AdminDashboardPieChart stats={admindashboardstats} />
            <AdminDashboardLineBarChart stats={admindashboardraiserequeststats} />
          </div>
        )}
      </div>

      <div className="p-8 mt-20 ml-64">
        {showdetails && requestinfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="relative z-10 w-96 rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Service Request Details
                </h2>
                <button
                  onClick={() => {
                    setRequestinfo(null);
                    setShowdetails(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 border-b border-gray-200 pb-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Status:</span>
                  <span className="font-medium">{requestinfo.status}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-1">
                  <span>Asset Name:</span>
                  <span>{requestinfo.assetid?.assetName || "Not Assigned"}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  {requestinfo.description}
                </p>
              </div>

              <div className="mb-4 border-t border-gray-200 pt-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Raised By:</span>
                  <span>{requestinfo.userid?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-1">
                  <span>Assigned Technician:</span>
                  <span>{requestinfo.assignedto?.name || "Not Assigned"}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowdetails(false);
                    setRequestinfo(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Recent Service Requests
          </h1>
          <p className="text-xl text-gray-600 mb-4 ">
            Displays the latest asset-related issues raised by users, along with
            their current service status and assigned technicians.
          </p>

          <div className="overflow-x-auto">
    <table className=" min-w-full divide-y divide-gray-200 rounded-lg shadow-md font-sans">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-balck-500 uppercase tracking-wider">
        Asset Name
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-balck-500 uppercase tracking-wider">
        Issue
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">
        Raised By
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">
        Status
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider">
        Action
      </th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    {allraiserequest.slice(-5).reverse().map((ele, index) => (
      <tr
        key={ele._id}
        className={`transition-colors duration-300 ${
          index % 2 === 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"
        }`}
      >
        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
          {ele.assetid?.assetName || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {ele.description || "No description"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">
          {ele.userid?.name || "Unknown"}
        </td>
        <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              ele.status === "pending"
                ? "text-yellow-800 bg-yellow-100"
                : ele.status === "assigned"
                ? "text-blue-800 bg-blue-100"
                : ele.status === "in-process"
                ? "text-purple-800 bg-purple-100"
                : ele.status === "completed"
                ? "text-green-800 bg-green-100"
                : "text-gray-500 bg-gray-100"
            }`}
          >
            {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm flex gap-2">
          <button
            onClick={() => {
              setShowdetails(true);
              handleRequestid(ele._id);
            }}
            className="px-3 py-1 bg-green-400 text-white rounded-md hover:bg-green-700 transition text-xs font-medium mt-3"
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
