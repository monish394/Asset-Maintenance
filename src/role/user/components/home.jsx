
import Carousel from "./Carousel";
import { useUserAsset } from "../context/userassetprovider";
import React, { useEffect, useState } from "react";
import axios from "../../../config/api";
import { FaBoxOpen, FaTrashCan } from "react-icons/fa6";
import { AiFillSetting } from "react-icons/ai";
import { IoMdClock } from "react-icons/io";
import { PiCurrencyInrLight } from "react-icons/pi";
import { MdDone } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function UserHome() {
  const [userdashboardstats, setUserdashboardstats] = useState(null)
  const [selectedRemoveAsset, setSelectedRemoveAsset] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
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

  const token = localStorage.getItem("token")
  const { userinfo, myasset, myraiserequest, setMyasset, usergeneralrequest } = useUserAsset();

  useEffect(() => {
    if (!userinfo?._id) return;
    const key = `welcome_seen_${userinfo._id}`;
    if (!localStorage.getItem(key)) {
      setTimeout(() => {
        setConfettiOpacity(1);
        setShowWelcomeModal(true);
        setShowConfetti(true);
      }, 600);
      localStorage.setItem(key, "1");
    }
  }, [userinfo]);



  useEffect(() => {
    axios.get("/userdashboardstats", {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        setUserdashboardstats(res.data)

      })
      .catch((err) => {
        console.log(err.message)
      })

  }, [])

  const handleRemoveAsset = async () => {
    try {
      await axios.put(
        `/user/unassign-asset/${selectedRemoveAsset._id}`,
        {},
        { headers: { Authorization: token } }
      );
      setMyasset((prev) => prev.filter((a) => a._id !== selectedRemoveAsset._id));
      setShowRemoveConfirm(false);
      setSelectedRemoveAsset(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.err || "Failed to remove asset");
    }
  };


  const assetCategories = myasset.reduce((acc, asset) => {
    if (asset.category) {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categoryChartData = {
    labels: Object.keys(assetCategories),
    datasets: [
      {
        label: 'Assets',
        data: Object.values(assetCategories),
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return gradient;
        },
        borderColor: '#6366f1',
        borderWidth: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        tension: 0.45,
        fill: true,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffsetX: 3,
        shadowOffsetY: 5,
      },
    ],
  };

  const statusChartData = {
    labels: ['Active WO', 'Pending', 'Completed'],
    datasets: [
      {
        data: [
          userdashboardstats?.activeworkorders || 0,
          userdashboardstats?.pendingrequests || 0,
          userdashboardstats?.completedrequests || 0,
        ],
        backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 10,
      },
    ],
  };

  const costByAsset = myraiserequest.reduce((acc, req) => {
    if (req.assetid?.assetName && req.costEstimate) {
      const name = req.assetid.assetName;
      acc[name] = (acc[name] || 0) + Number(req.costEstimate);
    }
    return acc;
  }, {});

  const costChartData = {
    labels: Object.keys(costByAsset),
    datasets: [
      {
        data: Object.values(costByAsset),
        backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 20,
        cutout: '80%',
      },
    ],
  };

  const generalStatusCounts = (usergeneralrequest || []).reduce((acc, req) => {
    const status = (req.status || 'OPEN').toUpperCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const generalPieData = {
    labels: Object.keys(generalStatusCounts),
    datasets: [
      {
        data: Object.values(generalStatusCounts),
        backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 15,
      },
    ],
  };



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 12,
        titleFont: { weight: 'bold' },
        bodyFont: { weight: 'medium' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f8fafc', drawBorder: false },
        ticks: { font: { weight: '600', size: 10 }, color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { weight: '600', size: 10 }, color: '#94a3b8' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { weight: '800', size: 10, family: 'Inter' },
          color: '#64748b'
        }
      }
    }
  };


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>

      {showConfetti && (
        <div style={{ opacity: confettiOpacity, transition: "opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1)", pointerEvents: "none" }}>
          <style>{`
            @keyframes paper-fall {
              0%   { transform: translateY(-120px) rotateX(0deg)   rotateZ(0deg)   skewX(0deg);  opacity: 1; }
              25%  { transform: translateY(25vh)   rotateX(60deg)  rotateZ(45deg)  skewX(6deg);  opacity: 1; }
              50%  { transform: translateY(50vh)   rotateX(20deg)  rotateZ(-30deg) skewX(-4deg); opacity: 0.9; }
              75%  { transform: translateY(75vh)   rotateX(80deg)  rotateZ(60deg)  skewX(8deg);  opacity: 0.7; }
              100% { transform: translateY(110vh)  rotateX(0deg)   rotateZ(90deg)  skewX(0deg);  opacity: 0; }
            }
            @keyframes wobble-x {
              0%,100% { margin-left: 0; }
              25%      { margin-left: 18px; }
              75%      { margin-left: -18px; }
            }
            .paper-piece {
              position: fixed;
              top: -80px;
              pointer-events: none;
              z-index: 9997;
              perspective: 400px;
              animation: paper-fall linear infinite, wobble-x ease-in-out infinite;
            }
            .paper-inner {
              width: 100%;
              height: 100%;
              box-shadow: 2px 3px 6px rgba(0,0,0,0.18);
            }

            @keyframes modal-pop {
              0%   { opacity:0; transform: scale(0.7) translateY(60px); }
              65%  { transform: scale(1.04) translateY(-6px); }
              100% { opacity:1; transform: scale(1) translateY(0); }
            }
            .paper-modal { animation: modal-pop 0.5s cubic-bezier(.22,1,.36,1) forwards; }

            .tear-edge::before {
              content: '';
              position: absolute;
              top: -10px; left: 0; right: 0;
              height: 20px;
              background: white;
              clip-path: polygon(
                0% 100%, 3% 20%, 6% 80%, 9% 10%, 12% 70%, 15% 30%,
                18% 85%, 21% 15%, 24% 75%, 27% 25%, 30% 90%, 33% 5%,
                36% 65%, 39% 35%, 42% 80%, 45% 10%, 48% 60%, 51% 40%,
                54% 85%, 57% 20%, 60% 70%, 63% 30%, 66% 90%, 69% 15%,
                72% 75%, 75% 25%, 78% 80%, 81% 10%, 84% 65%, 87% 35%,
                90% 85%, 93% 20%, 96% 75%, 100% 100%
              );
            }

            @keyframes fw-burst {
              0%   { transform: translate(0,0) rotate(var(--a)) scale(1);    opacity: 1; }
              60%  { transform: translate(var(--dx), var(--dy)) rotate(calc(var(--a) + 180deg)) scale(0.9); opacity: 1; }
              100% { transform: translate(calc(var(--dx)*1.6), calc(var(--dy)*1.6)) rotate(calc(var(--a) + 360deg)) scale(0.3); opacity: 0; }
            }
            @keyframes background-animate {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .background-animate {
              background-size: 200% 200%;
              animation: background-animate 3s linear infinite;
            }
          `}</style>


          {Array.from({ length: 90 }).map((_, i) => {
            const colors = ["#6366f1", "#4f46e5", "#8b5cf6", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];
            const w = 9 + Math.random() * 11;
            const h = 6 + Math.random() * 8;
            const dur = 2.8 + Math.random() * 2;
            const delay = Math.random() * 4;
            const color = colors[i % colors.length];
            const bg = i % 3 === 0 ? color : i % 3 === 1 ? `linear-gradient(135deg, ${color}, white)` : `linear-gradient(45deg, ${color}, #00000022)`;

            return (
              <div
                key={i}
                className="paper-piece"
                style={{
                  left: `${(i / 80) * 100 + Math.random() * 3 - 1.5}vw`,
                  width: `${w}px`,
                  height: `${h}px`,
                  animationDuration: `${dur}s, ${dur * 0.6}s`,
                  animationDelay: `${delay}s, ${delay}s`,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  borderRadius: i % 4 === 0 ? "2px" : "50%",
                }}
              >
                <div className="paper-inner" style={{ background: bg, borderRadius: "inherit" }} />
              </div>
            );
          })}



          {showWelcomeModal && (
            <div
              className="fixed inset-0 flex items-center justify-center px-4"
              style={{ zIndex: 9998, background: "rgba(15,23,42,0.25)", backdropFilter: "blur(6px)", pointerEvents: "auto" }}
            >
              <div
                className="paper-modal relative bg-white/95 rounded-[1.75rem] shadow-2xl max-w-sm w-full text-center overflow-hidden border border-white/40 backdrop-blur-2xl"
                style={{ padding: "2.5rem 1.5rem" }}
                onClick={e => e.stopPropagation()}
              >
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-[0_10px_25px_rgba(79,70,229,0.3)] flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                    Welcome to <br /> Your Asset Hub
                  </h2>

                  <p className="text-slate-500 text-sm font-medium mb-6">
                    Hello, <span className="text-indigo-600 font-bold">{userinfo?.name || "Premium User"}</span>! Everything you need to monitor and manage your equipment is ready.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {[
                      { label: "📦 Inventory" },
                      { label: "🛠️ Quick Support" },
                      { label: "📈 Live Status" }
                    ].map((badge) => (
                      <motion.span
                        key={badge.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-100 uppercase tracking-wider cursor-default hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150 shadow-sm hover:shadow-md"
                      >
                        {badge.label}
                      </motion.span>
                    ))}
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
                  >
                    Let's Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Carousel />


      <div className="mt-20 px-4 md:px-0">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 tracking-wide">
          Quick Stats Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-6 h-[180px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <p className="text-lg font-medium text-gray-700">My Assets</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl md:text-4xl font-bold text-gray-900">
                {userdashboardstats?.userassets || 0}
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
                {userdashboardstats?.activeworkorders || 0}
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
                {userdashboardstats?.pendingrequests || 0}
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
                {userdashboardstats?.completedrequests || 0}
              </span>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <MdDone className="text-green-600 text-2xl md:text-3xl" />
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-30">
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-gray-100 shadow-2xl overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Asset Categories</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">My Assets by Category</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                <FaBoxOpen className="text-lg" />
              </div>
            </div>
            <div className="h-[250px] w-full">
              {myasset.length > 0 ? (
                <Line key={myasset.length} data={categoryChartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic font-medium">No inventory data available</div>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-gray-100 shadow-2xl group hover:shadow-rose-500/20 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Asset Status</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Work Order Breakdown</p>
              </div>
              <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                <AiFillSetting className="text-lg" />
              </div>
            </div>
            <div className="h-[250px] w-full">
              {myraiserequest.length > 0 ? (
                <Pie key={myraiserequest.length} data={statusChartData} options={pieOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic font-medium">No service history</div>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-gray-100 shadow-2xl overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">General Requests</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">General Stats by Status</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                <IoMdClock className="text-lg" />
              </div>
            </div>
            <div className="h-[250px] w-full flex items-center justify-center">
              {usergeneralrequest?.length > 0 ? (
                <Pie key={usergeneralrequest.length} data={generalPieData} options={pieOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic font-medium">No service history</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {showRemoveConfirm && selectedRemoveAsset && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowRemoveConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-6 shadow-2xl w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove{" "}
              <strong>{selectedRemoveAsset.assetName}</strong> from your assigned assets?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveAsset()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Confirm
              </button>

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
            <thead className="bg-gray-50/80 backdrop-blur-md sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 text-left text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Asset
                </th>
                <th className="px-5 py-4 text-left text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Details
                </th>
                <th className="px-5 py-4 text-left text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Description
                </th>
                <th className="px-5 py-4 text-left text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-5 py-4 text-right text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {myasset.length > 0 ? (
                myasset.map((ele) => (
                  <tr
                    key={ele._id}
                    className="hover:bg-slate-50 transition-colors duration-200 group"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                        <img
                          src={ele.assetImg}
                          alt={ele.assetName}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-gray-900 font-bold text-sm md:text-base leading-tight">{ele.assetName}</p>
                      <p className="text-gray-400 text-[10px] mt-1 sm:hidden font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block">{ele.category}</p>
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-sm max-w-[250px] truncate">
                      {ele.description}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {ele.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRemoveAsset(ele);
                          setShowRemoveConfirm(true);
                        }}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white hover:shadow-xl hover:shadow-rose-200 transition-all duration-300"
                      >
                        <FaTrashCan className="text-xs group-hover:scale-110 transition-transform duration-300" />
                        <span className="hidden md:inline">Remove</span>
                        <span className="md:hidden">Remove</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
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
            <thead className="bg-gray-50/80 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Asset Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Technician
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Issue
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {myraiserequest.length > 0 ? (
                myraiserequest.slice(-5).reverse().map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-slate-50 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <img
                            src={req.assetid?.assetImg}
                            alt={req.assetid?.assetName}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold text-sm">{req.assetid?.assetName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${req.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : req.status === "assigned"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : req.status === "in-process"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : req.status === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-gray-50 text-gray-500 border-gray-100"
                          }`}
                      >
                        {req.status.replace("-", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 text-sm font-semibold">
                      {req.assignedto?.name || "Not Assigned"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold text-sm">
                      <div className="flex items-center gap-0.5">
                        {req.costEstimate ? (
                          <>
                            <PiCurrencyInrLight className="text-base" />
                            {req.costEstimate}
                          </>
                        ) : (
                          <span className="text-gray-300 font-normal">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-sm max-w-[200px] truncate">
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
        </div >
      </div >


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
                  Address
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

                    <td className="px-6 py-4 text-gray-700">
                      {ele.assignedto?.address || "Not Assigned"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${ele.status === "pending"
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


    </div >
  );
}
