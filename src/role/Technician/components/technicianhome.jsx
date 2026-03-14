import { useEffect, useState } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "../../../config/api";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
  const [selectedRemoveAsset, setSelectedRemoveAsset] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  const { technicianassignedassert, techinfo } = TechData();

  const handleGetStarted = (e) => {
    const duration = 3500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    var count = 200;
    function fire(particleRatio, opts) {
      confetti(Object.assign({}, { zIndex: 10001 }, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    const shootConfetti = (x, y) => {
      fire(0.25, { spread: 26, startVelocity: 55, origin: { x, y } });
      fire(0.2, { spread: 60, origin: { x, y } });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x, y } });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, origin: { x, y } });
      fire(0.1, { spread: 120, startVelocity: 45, origin: { x, y } });
    };

    shootConfetti(0.2, 0.6);
    shootConfetti(0.5, 0.6);
    shootConfetti(0.8, 0.6);

    setShowWelcomeModal(false);
    setTimeout(() => setConfettiOpacity(0), 500);
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

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

  useEffect(() => {
    if (!techinfo?._id || !techinfo.isApproved) return;
    const key = `tech_welcome_seen_${techinfo._id}`;
    if (!localStorage.getItem(key)) {
      setTimeout(() => {
        setConfettiOpacity(1);
        setShowWelcomeModal(true);
        setShowConfetti(true);
      }, 600);
      localStorage.setItem(key, "1");
    }
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
      {showConfetti && (
        <div style={{ opacity: confettiOpacity, transition: "opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1)", pointerEvents: "none" }}>
          {showWelcomeModal && (
            <div
              className="fixed inset-0 flex items-center justify-center px-4"
              style={{ zIndex: 9999, background: "rgba(15,23,42,0.25)", backdropFilter: "blur(6px)", pointerEvents: "auto" }}
            >
              <style>{`
                @keyframes modal-pop {
                  0%   { opacity:0; transform: scale(0.7) translateY(60px); }
                  65%  { transform: scale(1.04) translateY(-6px); }
                  100% { opacity:1; transform: scale(1) translateY(0); }
                }
                .paper-modal { animation: modal-pop 0.5s cubic-bezier(.22,1,.36,1) forwards; }
              `}</style>
              <div
                className="paper-modal relative bg-white/95 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center overflow-hidden border border-white/40 backdrop-blur-2xl px-10 py-12"
                style={{ fontFamily: 'Calibri, sans-serif' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner">
                      <span className="text-4xl">✅</span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-semibold text-slate-900 tracking-tight leading-tight mb-3">
                    Request Approved!
                  </h2>

                  <p className="text-slate-500 text-sm font-normal leading-relaxed mb-10">
                    Great news, <span className="text-emerald-600 font-semibold">{techinfo?.name}</span>! <br />
                    Your approved pending request is approved. You can now start accepting maintenance tasks.
                  </p>

                  <button
                    onClick={handleGetStarted}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold text-sm hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] tracking-widest uppercase text-[11px]"
                  >
                    Let's Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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