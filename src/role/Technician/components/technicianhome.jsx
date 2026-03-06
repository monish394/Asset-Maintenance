import { useEffect, useState } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "../../../config/api";
import {
  FaUserTie,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaTools,
  FaClock,
} from "react-icons/fa";
import { socket } from "../../../socket";
import TechnicianStatusPieChart from "./technicianstatspiechart";
import TechnicianRequestCostChart from "./techniciancostlinechart";
import AcceptedRequestsChart from "./AcceptedRequestsChart";

export default function TechnicianHome() {
  const [technicianstats, setTechnicianstats] = useState(null);
  const [acceptedGeneralRequests, setAcceptedGeneralRequests] = useState([]);
  const { technicianassignedassert, techinfo } = TechData();

  const completedAssetRequests = technicianassignedassert.filter(r => r.status === 'completed');
  const completedGeneralRequests = acceptedGeneralRequests.filter(r => r.status === 'COMPLETED');

  useEffect(() => {

    if (techinfo?._id) {
      socket.connect();
      socket.emit("join", techinfo._id);
    }

    axios
      .get("/technicianstats", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setTechnicianstats(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });


    axios
      .get("/gettechnicianaccepetedgeneralrequest", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setAcceptedGeneralRequests(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    return () => {
      socket.disconnect();
    };
  }, [techinfo]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "in-process":
        return "bg-indigo-50 text-indigo-600 border border-indigo-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "assigned":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Assigned";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statsCards = [
    {
      title: "My assigned requests",
      value: technicianstats?.technicianassignstats,
      icon: FaBoxOpen,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Work in progress",
      value: technicianstats?.inprocessrequest,
      icon: FaClock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending requests",
      value: technicianstats?.technicianpendingrequest,
      icon: FaTools,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Completed requests",
      value: technicianstats?.completedrequest,
      icon: FaCheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div
      className="min-h-screen p-6 space-y-8"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <FaUserTie className="text-white text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Technician dashboard
                </p>
                <h1 className="text-xl font-semibold text-slate-900">
                  Welcome, {techinfo?.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-slate-400" size={12} />
                <span>{techinfo?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-slate-400" size={12} />
                <span>{techinfo?.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
            <FaCalendarAlt className="text-slate-400" size={12} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {technicianstats && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Assigned requests overview
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Quick snapshot of your current workload
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-700">
                      {stat.title}
                    </p>
                    <div
                      className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`${stat.iconColor} text-lg`} />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value ?? 0}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <TechnicianStatusPieChart stats={technicianstats} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <AcceptedRequestsChart
            raiseRequests={technicianassignedassert.filter(r => r.status !== 'pending')}
            generalRequests={acceptedGeneralRequests}
            completedRaise={completedAssetRequests}
            completedGeneral={completedGeneralRequests}
          />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <TechnicianRequestCostChart
            technicianassignedassert={technicianassignedassert}
          />
        </div>
      </div>

      {/* Recent Requests Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Recent assigned requests
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Latest 5 requests assigned to you
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Raised by
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Assigned at
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {technicianassignedassert
                  .slice(-5)
                  .reverse()
                  .map((ele, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {ele.assetid?.assetImg ? (
                            <img
                              src={ele.assetid.assetImg}
                              alt={ele.assetid.assetName}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                              <FaTools className="text-slate-300" size={14} />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-slate-800">
                            {ele.assetid?.assetName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {ele.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {ele.userid?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {ele.userid?.address || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusStyle(
                            ele.status
                          )}`}
                        >
                          {ele.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(ele.assignAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Completed Asset Requests */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Completed asset requests
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            History of your completed asset maintenance tasks
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-emerald-50/30 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Issue
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Completion Date
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedAssetRequests.length > 0 ? (
                  completedAssetRequests
                    .slice()
                    .reverse()
                    .map((ele, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {ele.assetid?.assetImg ? (
                              <img
                                src={ele.assetid.assetImg}
                                alt=""
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                <FaTools className="text-slate-400" size={12} />
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-700">
                              {ele.assetid?.assetName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {ele.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(ele.completedAt || ele.updatedAt)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          ₹{ele.costEstimate || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400 text-sm"
                    >
                      No completed asset requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Completed General Requests */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Completed general requests
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            General maintenance requests successfully resolved
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-emerald-50/30 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Issue
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedGeneralRequests.length > 0 ? (
                  completedGeneralRequests
                    .slice()
                    .reverse()
                    .map((req, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                          {req.userId?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {req.issue}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {req.userId?.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {req.userId?.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400 text-sm"
                    >
                      No completed general requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}