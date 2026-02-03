import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TechData } from "../context/Techniciandatamaintenance";

export default function TechnicianNavbar() {
  const{techniciansnotifications,techinfo}=TechData();
  console.log(techinfo)
  // console.log(techniciansnotifications)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50">
      <div>
        <img style={{cursor:"pointer"}} onClick={()=>navigate("/technician/home")} src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      <ul className="flex items-center gap-6 text-gray-700 font-medium text-base relative">
        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/technician/home">Home</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/technician/assignedrequest">AssignedRequest</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/technician/requestdetails">RequestDetails</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/technician/service">Service</Link>
        </li>

        <li
          className="cursor-pointer hover:text-blue-600 transition relative"
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowUserMenu(false);
          }}
        >
          <IoMdNotifications size={28} />
          {showNotifications && (
  <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>

    {techniciansnotifications.length === 0 ? (
      <p className="text-gray-500 text-sm">No new notifications</p>
    ) : (
      <ul className="max-h-64 overflow-y-auto">
        {techniciansnotifications
          .slice(0, 5).reverse() 
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
              {!n.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></span>
              )}
            </li>
          ))}
      </ul>
    )}

    {/* {usernotifications.length > 5 && (
      <div className="mt-2 text-center">
        <button
          className="text-blue-500 text-sm hover:underline"
          onClick={() => navigate("/notifications")}
        >
          See all notifications
        </button>
      </div>
    )} */}
  </div>
)}
        </li>

        <li
          className="cursor-pointer hover:text-blue-600 transition relative"
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
          }}
        >
          <FaUser size={23} />
         {showUserMenu && (
  <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl p-4 z-50 border border-gray-200">

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
        <span className="text-right max-w-[150px] truncate">
          {techinfo.address}
        </span>
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
      className="h-10 w-full px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
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
