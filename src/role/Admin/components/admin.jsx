import { useEffect, useState } from "react";
import { AdminData } from "../context/Admindatamaintenance";
import axios from "axios";
import AdminDashboardPieChart from "./Admindashboardpiechart";
import AdminDashboardLineBarChart from "./Admindashboardlinechart";


export default function Admin() {
  //changes madeee

  
  // const [userinfo,setUserinfo]=useState(null)
  const token=localStorage.getItem("token")
  console.log(token)


  const [assets,setAssets]=useState([])
  console.log(assets)
  const [admindashboardstats, setAdmindashboardstats] = useState(null);
  const [admindashboardraiserequeststats, setAdmindashboardraiserequeststats] = useState(null);
  const { allraiserequest } = AdminData();
  console.log(allraiserequest)
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
    useEffect(() => {
    axios.get("http://localhost:5000/api/assets")
      .then(res => setAssets(res.data))
      .catch(err => console.log(err));
  }, []);



  
const recentAssigned = allraiserequest
  .filter(a => a.assignAt) 
  .sort((a, b) => new Date(b.assignAt) - new Date(a.assignAt)) 
  .slice(0, 5);

  return (
    <div>
      <div className="ml-70 mt-10 mb-6 max-w-5xl">
        

      </div>

{admindashboardstats && (
  <div
    className="bg-gray-30 p-8 rounded-2xl border border-gray-200 shadow-md
               w-full lg:w-[calc(100%-16rem)] ml-0 lg:ml-64"
  >
    <h1 className="text-3xl font-serif font-semibold text-gray-800 tracking-wide mb-8">
      Assets Overview
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div className="h-[150px] bg-white border border-gray-200 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 font-sans">
            Total Assets
          </p>
          <p className="text-3xl font-bold text-gray-900 font-mono mt-2">
            {admindashboardstats.totalAssets}
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
          <span className="text-blue-600 text-3xl">📦</span>
        </div>
      </div>

      <div className="h-[150px] bg-white border border-gray-200 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 font-sans">
            Working
          </p>
          <p className="text-3xl font-bold text-gray-900 font-mono mt-2">
            {admindashboardstats.workingAssets}
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
          <span className="text-green-600 text-3xl">✔️</span>
        </div>
      </div>

      <div className="h-[150px] bg-white border border-gray-200 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 font-sans">
            Under Maintenance
          </p>
          <p className="text-3xl font-bold text-gray-900 font-mono mt-2">
            {admindashboardstats.undermaintance}
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
          <span className="text-orange-600 text-3xl">🔧</span>
        </div>
      </div>

      <div className="h-[150px] bg-white border border-gray-200 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 font-sans">
            Pending Requests
          </p>
          <p className="text-3xl font-bold text-gray-900 font-mono mt-2">
            {admindashboardstats.pendingRequests}
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
          <span className="text-yellow-600 text-3xl">🕒</span>
        </div>
      </div>

    </div>
  </div>
)}






      

      <div className="mt-15 px-4 border-sm">
        {admindashboardstats && admindashboardraiserequeststats && (
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center ml-40">
            <AdminDashboardPieChart stats={admindashboardstats} />
            <AdminDashboardLineBarChart stats={admindashboardraiserequeststats} />
          </div>
        )}
      </div>

<div className="p-8 mt-20 ml-64 font-sans">
  {showdetails && requestinfo && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-96 rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-serif font-semibold text-gray-900">
            Service Request Details
          </h2>
          <button
            onClick={() => {
              setRequestinfo(null);
              setShowdetails(false);
            }}
            className="text-gray-400 hover:text-gray-700 text-xl font-semibold"
          >
            ×
          </button>
        </div>

        <div className="mb-4 border-b border-gray-200 pb-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Status</span>
          <span
  className={`font-mono text-sm font-medium ${
    requestinfo.status === "pending"
      ? "text-amber-600"
      : requestinfo.status === "in-process"
      ? "text-blue-600"
      : requestinfo.status === "completed"
      ? "text-green-600"
      : "text-gray-600"
  }`}
>
  {requestinfo.status}
</span>

          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Asset Name</span>
            <span>{requestinfo.assetid?.assetName || "Not Assigned"}</span>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-700 leading-relaxed">
          {requestinfo.description}
        </div>

        <div className="mb-4 border-t border-gray-200 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Raised By</span>
            <span>{requestinfo.userid?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">Assigned Technician</span>
            <span>{requestinfo.assignedto?.name || "Not Assigned"}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setShowdetails(false);
              setRequestinfo(null);
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}

  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
    <h1 className="text-xl font-serif font-semibold text-gray-900 mb-1">
      Recent Service Requests
    </h1>

    <p className="text-sm text-gray-600 mb-4 max-w-3xl">
      Displays the latest asset-related issues raised by users, along with their
      current service status and assigned technicians.
    </p>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Asset Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Issue
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Raised By
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {allraiserequest.slice(-5).reverse().map((ele, index) => (
            <tr
              key={ele._id}
              className={`transition-colors duration-200 ${
                index % 2 === 0
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
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
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${
      ele.status === "pending"
        ? "bg-amber-100 text-amber-800"
        : ele.status === "in-process"
        ? "bg-indigo-100 text-indigo-800"
        : ele.status === "completed"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
  </span>
</td>


              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => {
                    setShowdetails(true);
                    handleRequestid(ele._id);
                  }}
                  className="px-4 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-xs font-medium"
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









<div className="ml-64 mt-10 p-6 bg-white rounded-md border border-gray-200 shadow-sm overflow-x-auto font-sans">
  <h2 className="mb-5 text-xl font-serif font-semibold text-gray-900">
    Recently Added Assets
  </h2>

  <table className="w-full table-auto border-collapse text-sm">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Asset
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Image
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Category
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Assigned To
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-[400px]">
          Description
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Status
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Created
        </th>
      
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {assets.slice(-5).reverse().map((ele, index) => (
        <tr
          key={ele._id}
          className="hover:bg-gray-50 transition-colors"
        >
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
            {ele.assetName}
          </td>

          <td className="px-4 py-3">
            <img
              src={ele.assetImg}
              alt={ele.assetName}
              className="h-16 w-16 rounded-sm object-cover border border-gray-200"
            />
          </td>

          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
            {ele.category}
          </td>

          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
            {ele.assignedTo?.name || "Not Assigned"}
          </td>

          <td className="px-4 py-3 text-gray-700 w-[400px]">
            {ele.description}
          </td>

        <td className="px-4 py-3 whitespace-nowrap">
  <span
    className={`inline-flex items-center rounded-sm px-3 py-1 text-xs font-medium ${
      ele.status === "assigned"
        ? "bg-blue-100 text-blue-800"
        : ele.status === "available"
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {ele.status}
  </span>
</td>


          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
            {new Date(ele.createdAt).toLocaleDateString()}
          </td>
        </tr>
      ))}

      {assets.length === 0 && (
        <tr>
          <td
            colSpan={8}
            className="px-4 py-6 text-center text-gray-500"
          >
            No assets to display
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



<div className="ml-64 mt-10 p-6 bg-white border border-gray-200 rounded-md shadow-sm overflow-x-auto font-sans">
  <h2 className="mb-5 text-xl font-serif font-semibold text-gray-900">
    Recently Assigned Work Orders
  </h2>

  <table className="w-full table-auto border-collapse text-sm">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Asset
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Image
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Assigned To
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Category
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700">
          Status
        </th>
        <th className="px-4 py-3 text-left font-medium text-gray-700 w-[400px]">
          Description
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {recentAssigned.map((asset) => (
        <tr
          key={asset._id}
          className="align-top hover:bg-gray-50 transition-colors"
        >
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
            {asset.assetid.assetName}
          </td>

          <td className="px-4 py-3">
            <img
              src={asset.assetid.assetImg}
              alt={asset.assetid.assetName}
              className="h-16 w-16 rounded-sm object-cover border border-gray-200"
            />
          </td>

          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
            {asset.assignedto?.name || "Not Assigned"}
          </td>

          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
            {asset.aiCategory}
          </td>

          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium ${
                asset.status === "assigned"
                  ? "bg-gray-900 text-white"
                  : asset.status === "pending"
                  ? "bg-gray-200 text-gray-800"
                  : asset.status === "in-process"
                  ? "bg-gray-300 text-gray-900"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {asset.status}
            </span>
          </td>

          <td className="px-4 py-3 text-gray-700 w-[400px]">
            {asset.description}
          </td>
        </tr>
      ))}

      {recentAssigned.length === 0 && (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-6 text-center text-gray-500"
          >
            No recently assigned work orders
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


    </div>
  );
}
