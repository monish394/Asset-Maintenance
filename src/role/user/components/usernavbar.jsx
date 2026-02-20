import { IoMdNotifications } from "react-icons/io";
import {
  FaUser,
  FaHome,
  FaFileAlt,
  FaCreditCard,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useUserAsset } from "../context/userassetprovider";

export default function UserNavbar() {
  const { usernotifications = [], userinfo, markNotificationsAsRead } =
    useUserAsset();

  const [showUserNotifications, setShowUserNotifications] = useState(false);
  const [showUsermenu, setShowUsermenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [hasUnreadOverride, setHasUnreadOverride] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hasUnread = usernotifications.some((n) => !n.isRead);
    setHasUnreadOverride(hasUnread);
  }, [usernotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (notificationRef.current &&
          notificationRef.current.contains(event.target)) ||
        (userMenuRef.current && userMenuRef.current.contains(event.target)) ||
        (mobileMenuRef.current && mobileMenuRef.current.contains(event.target))
      ) {
        return;
      }

      setShowUserNotifications(false);
      setShowUsermenu(false);
      setShowMobileMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menu = [
    { label: "Home", to: "/user/home", icon: <FaHome size={18} /> },
    { label: "Raise Request", to: "/user/raiserequest", icon: <FaFileAlt size={18} /> },
    { label: "Payment", to: "/user/payment", icon: <FaCreditCard size={18} /> },
    { label: "My Work Orders", to: "/user/workorderrequest", icon: <FaClipboardList size={18} /> },
    { label: "Assets", to: "/user/pickassets", icon: <FaBoxOpen size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleNotificationClick = async () => {
    const willOpen = !showUserNotifications;

    setShowUserNotifications(willOpen);
    setShowUsermenu(false);
    setShowMobileMenu(false);

    if (willOpen) {
      setHasUnreadOverride(false);

      if (typeof markNotificationsAsRead === "function") {
        await markNotificationsAsRead();
      }
    }
  };

  const handleUserMenuClick = () => {
    setShowUsermenu((prev) => !prev);
    setShowUserNotifications(false);
    setShowMobileMenu(false);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu((prev) => !prev);
    setShowUserNotifications(false);
    setShowUsermenu(false);
  };

  return (
    <nav className="w-full h-24 flex items-center justify-between px-4 md:px-8 shadow-lg bg-gray-50 fixed top-0 left-0 z-50 font-sans">
      
      <div>
        <img
          onClick={() => navigate("/user/home")}
          src={logo}
          alt="Logo"
          className="h-12 md:h-16 w-auto cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-4">

        <ul className="hidden lg:flex items-center gap-8 text-gray-700 font-medium text-base">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `transition px-3 py-2 rounded flex items-center gap-2 ${
                    isActive
                      ? "bg-blue-400 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">

          <div ref={notificationRef} className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-700 hover:text-gray-900"
            >
              <IoMdNotifications size={26} />

              {!showUserNotifications && hasUnreadOverride && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-white" />
              )}
            </button>

            {showUserNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                  Notifications
                </h3>

                {usernotifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new notifications</p>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {usernotifications
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .slice(0, 5)
                      .map((n) => (
                        <li
                          key={n._id}
                          className={`mb-2 p-2 rounded ${
                            !n.isRead
                              ? "bg-blue-50 border-l-2 border-blue-500"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <p className="text-sm">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              onClick={handleUserMenuClick}
              className="text-gray-700 hover:text-gray-900"
            >
              <FaUser size={23} />
            </button>

            {showUsermenu && userinfo && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-200">
                
                <div className="flex items-center gap-3 border-b pb-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {userinfo.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {userinfo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userinfo.email}
                    </p>
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
                    <span className="text-right max-w-[140px] truncate">
                      {userinfo.address}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Joined on{" "}
                    {new Date(userinfo.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full h-10 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div ref={mobileMenuRef} className="lg:hidden relative">
            <button onClick={handleMobileMenuClick}>
              {showMobileMenu ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>

            {showMobileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl p-2 z-50 border border-gray-200">
                <ul className="space-y-1">
                  {menu.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setShowMobileMenu(false)}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}