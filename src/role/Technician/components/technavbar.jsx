import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TechnicianNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50">
      <div>
        <img src={logo} alt="Logo" className="h-16 w-auto" />
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
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>

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
            <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg p-3 z-50 flex flex-col gap-2">
              <p className="cursor-pointer hover:text-blue-600">Profile</p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  navigate("/");
                }}
                className="h-10 w-full px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
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
