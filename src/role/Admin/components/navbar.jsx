import { NavLink, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdWorkHistory } from "react-icons/md";
import { FaBox, FaUsers, FaUserAlt } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { GrHostMaintenance } from "react-icons/gr";
import logo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Navbar() {
  const [userinfo, setUserinfo] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/userinfo", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setUserinfo(res.data))
      .catch((err) => console.log(err.message));
  }, []);

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
      <div
        style={{ fontFamily: "calibri" }}
        className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50 font-sans"
      >
        <div>
          <img
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
            className="h-16 w-auto ml-10"
            src={logo}
            alt="Logo"
          />
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

            {showProfilePopup && userinfo && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{userinfo.name}</p>
                  <p className="text-sm text-gray-500">{userinfo.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {userinfo.role}
                  </span>
                </div>

                <div className="p-4 text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Phone:</strong> {userinfo.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {userinfo.address}
                  </p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(userinfo.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 border-t flex justify-center">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      navigate("/");
                    }}
                    className="h-9 w-full rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ fontFamily: "calibri" }}
        className="w-60 bg-gray-50 shadow-lg p-6 flex flex-col fixed top-24 bottom-0 left-0"
      >
        <ul className="flex flex-col gap-4 text-gray-700 font-medium text-base">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
  to={item.to}
  className={({ isActive }) =>
    `flex items-center gap-3 p-3 text-xl rounded-lg transition-colors duration-300 ease-in-out
    ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
  }
>
  {item.icon}
  <span className="flex-1">{item.label}</span>
</NavLink>

            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
