import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAsset } from "../context/userassetprovider";

export default function UserNavbar() {
  const { usernotifications, userinfo } = useUserAsset();
  const [showUserNotifications, setShowUserNotifications] = useState(false);
  const [showUserDot, setShowUserDot] = useState(
    usernotifications?.some((n) => !n.isRead) || false
  );

  const [showUsermenu, setShowUsermenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (usernotifications?.some((n) => !n.isRead)) {
      setShowUserDot(true);
    }
  }, [usernotifications]);

  const menu = [
    { label: "Home", to: "/user/home" },
    { label: "RaiseRequest", to: "/user/raiserequest" },
    { label: "Payment", to: "/user/payment" },
    { label: "MyWorkOrders", to: "/user/workorderrequest" },
    { label: "Assets", to: "/user/pickassets" },
    
  ];

  return (
    <div className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-gray-50 fixed top-0 left-0 z-50 font-sans"
>
      <div>
        <img
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/user/home")}
          src={logo}
          alt="Logo"
          className="h-16 w-auto ml-4"
        />
      </div>

      <ul className="flex items-center gap-8 text-gray-700 font-medium text-base relative">
        {menu.map((item) => (
          <li key={item.to} style={{ fontFamily: "calibri", fontSize: "20px" }}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `transition px-3 py-1 rounded ${
                  isActive ? "bg-blue-500 text-white" : "text-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}

        <li
          className="cursor-pointer relative"
          onClick={() => {
            setShowUserNotifications(!showUserNotifications);
            setShowUsermenu(false);
            if (!showUserNotifications) setShowUserDot(false);
          }}
        >
          <IoMdNotifications size={28} />
          {showUserDot && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-white"></span>
          )}
          {showUserNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>
              {usernotifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new notifications</p>
              ) : (
                <ul className="max-h-64 overflow-y-auto">
                  {usernotifications
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((n) => (
                      <li
                        key={n._id}
                        className="mb-2 p-2 rounded flex justify-between items-start hover:bg-gray-100 cursor-pointer"
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
            setShowUsermenu(!showUsermenu);
            setShowUserNotifications(false);
          }}
        >
          <FaUser size={23} />
          {showUsermenu && userinfo && (
            <div className="absolute right-0 mt-5 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-200">
              <div className="flex items-center gap-3 border-b pb-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {userinfo.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userinfo.name}</p>
                  <p className="text-xs text-gray-500">{userinfo.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {userinfo.role}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{userinfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="text-right max-w-[140px] truncate">{userinfo.address}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Joined on {new Date(userinfo.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  setTimeout(() => {
                      navigate("/");
                    
                  }, (500));
                
                }}
                className="w-full h-10 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
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
