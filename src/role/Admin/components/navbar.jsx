import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdWorkHistory } from "react-icons/md";
import { FaBox, FaUsers, FaUserAlt } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { GrHostMaintenance } from "react-icons/gr";
import logo from "../assets/logo.png";
import { useState, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  const menu = [
    { icon: <MdSpaceDashboard />, label: "Dashboard", to: "/admin/dashboard" },
    { icon: <FaBox />, label: "Assets", to: "/admin/assets" },
    { icon: <MdWorkHistory />, label: "Work Orders", to: "/admin/workorders" },
    { icon: <FaUsers />, label: "Users", to: "/admin/users" },
    { icon: <GiAutoRepair />, label: "Technicians", to: "/admin/technicians" },
    { icon: <GrHostMaintenance />, label: "Maintenance", to: "/admin/maintenance" },
  ];

  return (
    <>
      <div style={{fontFamily:"calibri"}} className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50 font-sans">
        <div>
          <img className="h-16 w-auto ml-10" src={logo} alt="Logo" />
        </div>

        <div className="flex items-center gap-6 text-gray-700 font-medium text-base relative">
          <p className="cursor-pointer hover:text-gray-900 transition mr-10">
            <u>{role}</u>
          </p>

          <div className="relative" ref={popupRef}>
            <span
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="flex items-center cursor-pointer hover:text-gray-900 transition"
            >
              <FaUserAlt size={25} className="text-gray-500" />
            </span>

            {showProfilePopup && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <ul className="flex flex-col">

                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
                    onClick={() => {
                      // alert("Profile clicked");
                      setShowProfilePopup(false);
                    }}
                  >
                    Profile
                  </li>
                  <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/"); }} className="ml-2 h-10 w-28 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 ml-5 mb-1" > Logout </button>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{fontFamily:"calibri"}} className="w-60 bg-gray-50 shadow-lg p-6 flex flex-col fixed top-24 bottom-0 left-0">
        <ul className="flex flex-col gap-4 text-gray-700 font-medium text-base">
          {menu.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex items-center gap-3 p-3 text-xl rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
