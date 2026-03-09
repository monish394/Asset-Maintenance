
import Carousel from "./Carousel";
import { useUserAsset } from "../context/userassetprovider";
import React, { useEffect, useState } from "react";
import axios from "../../../config/api";
import { FaBoxOpen } from "react-icons/fa6";
import { AiFillSetting } from "react-icons/ai";
import { IoMdClock } from "react-icons/io";
import { PiCurrencyInrLight } from "react-icons/pi";
import { MdDone } from "react-icons/md";

export default function UserHome() {
  const [userdashboardstats, setUserdashboardstats] = useState([])
  const [selectedRemoveAsset, setSelectedRemoveAsset] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const launchFireworks = React.useCallback((originX, originY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = [
      "#6366f1", "#a78bfa", "#ec4899", "#fbbf24",
      "#34d399", "#38bdf8", "#f87171", "#e879f9",
      "#fb923c", "#4ade80", "#c084fc", "#fff",
    ];

    const makeBurst = (x, y, count = 90) => {
      const particles = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        const speed = 3 + Math.random() * 8;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 3 + Math.random() * 5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color, size,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.012,
          gravity: 0.12,
          drag: 0.96,
          trail: [],
          shape: Math.random() > 0.5 ? "circle" : "rect",
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3,
        });
      }
      return particles;
    };

    let allParticles = [];
    const addBurst = (x, y, delay) =>
      setTimeout(() => {
        allParticles.push(...makeBurst(x, y, 90));
      }, delay);

    addBurst(originX, originY, 0);
    addBurst(window.innerWidth * 0.2, window.innerHeight * 0.3, 200);
    addBurst(window.innerWidth * 0.8, window.innerHeight * 0.25, 350);
    addBurst(window.innerWidth * 0.15, window.innerHeight * 0.6, 500);
    addBurst(window.innerWidth * 0.85, window.innerHeight * 0.55, 650);
    addBurst(window.innerWidth * 0.5, window.innerHeight * 0.2, 800);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      allParticles = allParticles.filter(p => p.alpha > 0.01);

      for (const p of allParticles) {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.55);
        }
        ctx.restore();
      }

      if (allParticles.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShowWelcome(false);
      }
    };

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const handleGetStarted = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    launchFireworks(cx, cy);
  };

  const token = localStorage.getItem("token")
  const { userinfo, myasset, myraiserequest, setMyasset } = useUserAsset();

  useEffect(() => {
    if (!userinfo?._id) return;
    const key = `welcome_seen_${userinfo._id}`;
    if (!localStorage.getItem(key)) {
      setTimeout(() => setShowWelcome(true), 600);
      localStorage.setItem(key, "1");
    }
  }, [userinfo]);
  // console.log(myraiserequest)
  // console.log("User assets in Home:", myasset);


  useEffect(() => {
    axios.get("/userdashboardstats", {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        setUserdashboardstats(res.data)
        // console.log(res.data)
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


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>

      {showWelcome && (
        <>
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
          `}</style>

          {Array.from({ length: 70 }).map((_, i) => {
            const colors = [
              "#6366f1", "#818cf8", "#a78bfa", "#c084fc",
              "#f472b6", "#fb7185", "#fbbf24", "#34d399",
              "#38bdf8", "#f87171", "#4ade80", "#e879f9",
            ];
            const w = 8 + Math.random() * 14;
            const h = 6 + Math.random() * 10;
            const dur = 2.5 + Math.random() * 3.5;
            const delay = Math.random() * 3;
            const color = colors[i % colors.length];
            const bg = i % 3 === 0
              ? `linear-gradient(135deg, ${color}dd, ${color}88)`
              : i % 3 === 1
                ? color
                : `linear-gradient(160deg, ${color}, white 200%)`;

            return (
              <div
                key={i}
                className="paper-piece"
                style={{
                  left: `${(i / 70) * 100 + Math.random() * 4 - 2}vw`,
                  width: `${w}px`,
                  height: `${h}px`,
                  animationDuration: `${dur}s, ${dur * 0.6}s`,
                  animationDelay: `${delay}s, ${delay}s`,
                  borderRadius: i % 4 === 0 ? "2px" : i % 4 === 1 ? "50%" : "1px",
                }}
              >
                <div
                  className="paper-inner"
                  style={{
                    background: bg,
                    borderRadius: "inherit",
                  }}
                />
              </div>
            );
          })}

          <canvas
            ref={canvasRef}
            style={{
              position: "fixed", inset: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 10001,
              pointerEvents: "none",
              display: showWelcome ? "block" : "none",
            }}
          />

          <div
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{ zIndex: 9998, background: "rgba(15,23,42,0.35)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowWelcome(false)}
          >
            <div
              className="paper-modal tear-edge relative bg-white rounded-3xl shadow-2xl max-w-md w-full text-center overflow-hidden"
              style={{ padding: "2.5rem 2.5rem 2rem" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ position: "absolute", top: "-48px", right: "-48px", width: "180px", height: "180px", background: "radial-gradient(circle,#e0e7ff,transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-48px", left: "-48px", width: "180px", height: "180px", background: "radial-gradient(circle,#ede9fe,transparent 70%)", pointerEvents: "none" }} />

              <div className="flex justify-center mb-5" style={{ position: "relative" }}>
                <div style={{ position: "relative", width: "72px", height: "72px" }}>
                  {[3, 2, 1, 0].map(n => (
                    <div key={n} style={{
                      position: "absolute", inset: 0,
                      background: n === 0
                        ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                        : ["#c7d2fe", "#ddd6fe", "#e9d5ff"][n - 1],
                      borderRadius: "14px",
                      transform: `rotate(${(n - 1.5) * 6}deg)`,
                      boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                    }}>
                      {n === 0 && (
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🎉</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                Welcome aboard!
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500, marginBottom: "6px" }}>
                Hey <span style={{ color: "#6366f1", fontWeight: 700 }}>{userinfo?.name || "there"}</span>, your account is all set!
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                You now have full access to your Asset Maintenance dashboard.
                Track assets, raise service requests, and monitor work orders — all in one place.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "1.75rem" }}>
                {["📦 My Assets", "🔧 Service Requests", "📊 Dashboard Stats"].map(label => (
                  <span key={label} style={{
                    padding: "4px 14px", borderRadius: "999px",
                    background: "#eef2ff", color: "#4338ca",
                    fontSize: "0.7rem", fontWeight: 700,
                    border: "1px solid #c7d2fe",
                  }}>
                    {label}
                  </span>
                ))}
              </div>

              <button
                onClick={handleGetStarted}
                style={{
                  width: "100%", padding: "14px",
                  borderRadius: "14px", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                  color: "white", fontWeight: 700, fontSize: "0.85rem",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                  transition: "opacity 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => { e.target.style.opacity = 0.88; e.target.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.target.style.opacity = 1; e.target.style.transform = "scale(1)"; }}
              >
                Let's Get Started →
              </button>
            </div>
          </div>
        </>
      )}

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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Action
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
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-600"
                      >
                        {ele.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedRemoveAsset(ele);
                          setShowRemoveConfirm(true);
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        Remove
                      </button>



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
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${req.status === "pending"
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


    </div>
  );
}
