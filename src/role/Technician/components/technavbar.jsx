import { IoMdNotifications } from "react-icons/io";
import {
  FaUser,
  FaHome,
  FaClipboardList,
  FaFileAlt,
  FaTools,
  FaCamera, FaTimes, FaEdit, FaSignOutAlt, FaLock
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "../../../config/api";

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

export default function TechnicianNavbar() {
  const {
    techniciansnotifications = [],
    techinfo,
    setTechinfo,
    markTechNotificationsAsRead,
    markSingleTechNotificationAsRead
  } = TechData();

  const [showTechNotifications, setShowTechNotifications] = useState(false);
  const [showTechMenu, setShowTechMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "", profile: "" });
  const [uploading, setUploading] = useState(false);
  const [hasUnreadOverride, setHasUnreadOverride] = useState(false);

  const notificationRef = useRef(null);
  const techMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (techinfo) {
      setEditForm({
        name: techinfo.name || "",
        email: techinfo.email || "",
        phone: techinfo.phone || "",
        address: techinfo.address || "",
        profile: techinfo.profile || ""
      });
    }
  }, [techinfo]);

  useEffect(() => {
    const hasUnread = techniciansnotifications.some((n) => !n.isread);
    setHasUnreadOverride(hasUnread);
  }, [techniciansnotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (notificationRef.current &&
          notificationRef.current.contains(event.target)) ||
        (techMenuRef.current &&
          techMenuRef.current.contains(event.target)) ||
        (mobileMenuRef.current &&
          mobileMenuRef.current.contains(event.target))
      ) {
        return;
      }

      setShowTechNotifications(false);
      setShowTechMenu(false);
      setShowMobileMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/assets/upload-image", formData);
      setEditForm(prev => ({ ...prev, profile: res.data.imageUrl }));
    } catch (err) {
      console.error("Profile image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/updateuser/${techinfo._id}`, editForm);
      setTechinfo(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      await axios.put("/changepassword", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      alert("Password updated successfully!");
    } catch (err) {
      setPasswordError(err.response?.data?.err || "Failed to update password");
    }
  };

  const menu = [
    { label: "Home", to: "/technician/home", icon: <FaHome size={18} /> },
    {
      label: "Assigned Request",
      to: "/technician/assignedrequest",
      icon: <FaClipboardList size={18} />,
    },
    {
      label: "Request Details",
      to: "/technician/requestdetails",
      icon: <FaFileAlt size={18} />,
    },
    { label: "Service", to: "/technician/service", icon: <FaTools size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleNotificationClick = async () => {
    const willOpen = !showTechNotifications;

    setShowTechNotifications(willOpen);
    setShowTechMenu(false);
    setShowMobileMenu(false);

    if (willOpen) {
      setHasUnreadOverride(false);

      if (typeof markTechNotificationsAsRead === "function") {
        await markTechNotificationsAsRead();
      }
    }
  };

  const handleTechMenuClick = () => {
    setShowTechMenu((prev) => !prev);
    setShowTechNotifications(false);
    setShowMobileMenu(false);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu((prev) => !prev);
    setShowTechNotifications(false);
    setShowTechMenu(false);
  };

  return (
    <nav className="w-full h-24 flex items-center justify-between px-4 md:px-8 shadow-lg bg-gray-50 fixed top-0 left-0 z-50 font-sans">
      <div>
        <img
          onClick={() => navigate("/technician/home")}
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
                  `transition px-3 py-2 rounded flex items-center gap-2 ${isActive
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
              className="relative text-gray-700 hover:text-gray-900 group"
            >
              <IoMdNotifications size={26} className="group-hover:scale-110 transition-transform" />
              {!showTechNotifications && hasUnreadOverride && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white font-bold rounded-full border-2 border-white flex items-center justify-center">
                  {techniciansnotifications.filter(n => !n.isread).length}
                </span>
              )}
            </button>

            {showTechNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl z-50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  {techniciansnotifications.some(n => !n.isread) && (
                    <button
                      onClick={markTechNotificationsAsRead}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tight"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {techniciansnotifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IoMdNotifications size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 text-left">
                      {techniciansnotifications
                        .slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((n) => (
                          <div
                            key={n._id}
                            onClick={() => !n.isread && markSingleTechNotificationAsRead(n._id)}
                            className={`p-4 transition cursor-pointer hover:bg-gray-50 relative group ${!n.isread ? "bg-blue-50/30" : ""}`}
                          >
                            {!n.isread && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                            )}
                            <div className="flex gap-3">
                              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isread ? "bg-blue-500 animate-pulse" : "bg-transparent"}`} />
                              <div className="flex-1">
                                <p className={`text-sm leading-relaxed ${!n.isread ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                                  {n.message}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                                  {formatRelativeTime(n.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {techniciansnotifications.length > 0 && (
                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-700">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={techMenuRef} className="relative">
            <button
              onClick={handleTechMenuClick}
              className="group flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              {techinfo?.profile ? (
                <img src={techinfo.profile} alt="Avatar" className="h-10 w-10 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                  {techinfo?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showTechMenu && techinfo && (
              <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
                  <div className="mx-auto h-20 w-20 rounded-full border-4 border-white/30 shadow-xl mb-3 overflow-hidden">
                    {techinfo.profile ? (
                      <img src={techinfo.profile} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-blue-400 flex items-center justify-center text-2xl font-bold">
                        {techinfo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{techinfo.name}</h3>
                  <p className="text-blue-100 text-sm">{techinfo.email}</p>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Role</p>
                      <p className="text-sm font-semibold text-gray-700 capitalize">{techinfo.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Joined</p>
                      <p className="text-sm font-semibold text-gray-700">{new Date(techinfo.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowTechMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition group"
                  >
                    <FaEdit className="text-gray-400 group-hover:text-blue-600" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowTechMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition group"
                  >
                    <FaLock className="text-gray-400 group-hover:text-blue-600" />
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition group"
                  >
                    <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Edit Profile Modal ── */}
          {showEditModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                  <h2 className="text-xl font-bold">Edit Profile</h2>
                  <button onClick={() => setShowEditModal(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer">
                      <div className="h-32 w-32 rounded-full border-4 border-slate-100 shadow-lg overflow-hidden relative">
                        {editForm.profile ? (
                          <img src={editForm.profile} className="h-full w-full object-cover" alt="Profile" />
                        ) : (
                          <div className="h-full w-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                            {techinfo.name.charAt(0)}
                          </div>
                        )}

                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="h-8 w-8 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                          </div>
                        )}
                      </div>

                      <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition transform hover:scale-110 text-center">
                        <FaCamera size={14} className="mx-auto mt-1" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 font-medium italic">Click the camera icon to update photo</p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition transform active:scale-[0.98]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white font-sans">
                  <h2 className="text-xl font-bold">Change Password</h2>
                  <button onClick={() => setShowPasswordModal(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
                  {passwordError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 font-sans">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4 text-center font-sans">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl transition transform active:scale-[0.98]"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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