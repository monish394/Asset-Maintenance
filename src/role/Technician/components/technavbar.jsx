import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TechData } from "../context/Techniciandatamaintenance";

export default function TechnicianNavbar() {
 

  const { techniciansnotifications, techinfo } = TechData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
  if (techniciansnotifications.some((n) => !n.isRead)) {
    setShowDot(true);
  }
}, [techniciansnotifications]);
 const [showDot, setShowDot] = useState(
  techniciansnotifications.some((n) => !n.isRead)
);


  return (
    <div className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50 font-sans">
      <div>
        <img
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/technician/home")}
          src={logo}
          alt="Logo"
          className="h-16 w-auto"
        />
      </div>

      <ul className="flex items-center gap-6 relative">
        <li style={{ fontFamily: "calibri", fontSize: "20px" }}>
          <NavLink
            to="/technician/home"
            className={({ isActive }) =>
              `transition px-3 py-1 rounded ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li style={{ fontFamily: "calibri", fontSize: "20px" }}>
          <NavLink
            to="/technician/assignedrequest"
            className={({ isActive }) =>
              `transition px-3 py-1 rounded ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Assigned Request
          </NavLink>
        </li>
        <li style={{ fontFamily: "calibri", fontSize: "20px" }}>
          <NavLink
            to="/technician/requestdetails"
            className={({ isActive }) =>
              `transition px-3 py-1 rounded ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Request Details
          </NavLink>
        </li>
        <li style={{ fontFamily: "calibri", fontSize: "20px" }}>
          <NavLink
            to="/technician/service"
            className={({ isActive }) =>
              `transition px-3 py-1 rounded ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Service
          </NavLink>
        </li>

<li
  className="cursor-pointer relative"
  onClick={() => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);

    if (!showNotifications) {
      setShowDot(false);
    }
  }}
>
  <IoMdNotifications size={28} />

  {showDot && (
    <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-white"></span>
  )}

  {showNotifications && (
    <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
      <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>
      {techniciansnotifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No new notifications</p>
      ) : (
        <ul className="max-h-64 overflow-y-auto">
          {techniciansnotifications
            .slice(-5).reverse()
            
            .map((n) => (
              <li
                key={n._id}
                className="mb-2 p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  )}
</li>



        <li
          className="cursor-pointer relative"
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
          }}
        >
          <FaUser size={23} />
          {showUserMenu && techinfo && (
            <div className="absolute right-0 mt-5 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-200">
              <div className="flex items-center gap-3 border-b pb-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {techinfo.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{techinfo.name}</p>
                  <p className="text-xs text-gray-500">{techinfo.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {techinfo.role}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{techinfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="text-right max-w-[150px] truncate">{techinfo.address}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Joined on {new Date(techinfo.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  navigate("/");
                }}
                className="h-10 w-full px-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Logout
              </button>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}
