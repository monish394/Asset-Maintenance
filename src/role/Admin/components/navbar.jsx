import { NavLink, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdWorkHistory } from "react-icons/md";
import { FaBox, FaUsers, FaUserAlt } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { GrHostMaintenance } from "react-icons/gr";
import logo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";
import axios from "../../../config/api";
import { FaCamera, FaTimes, FaEdit, FaSignOutAlt, FaLock, FaBars, FaUserShield } from "react-icons/fa";

export default function Navbar() {
  const [userinfo, setUserinfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get("/userinfo")
      .then((res) => setUserinfo(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  const navigate = useNavigate();
  const role = sessionStorage.getItem("role") || localStorage.getItem("role");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "", profile: "" });
  const [uploading, setUploading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (userinfo) {
      setEditForm({
        name: userinfo.name || "",
        email: userinfo.email || "",
        phone: userinfo.phone || "",
        address: userinfo.address || "",
        profile: userinfo.profile || ""
      });
    }
  }, [userinfo]);

  // Close sidebar and profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && !e.target.closest("#admin-sidebar") && !e.target.closest("#sidebar-toggle")) {
        setSidebarOpen(false);
      }
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

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
      const res = await axios.put(`/updateuser/${userinfo._id}`, editForm);
      setUserinfo(res.data);
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
        className="w-full h-16 md:h-24 flex items-center justify-between px-4 md:px-8 shadow-lg bg-gray-50 fixed top-0 left-0 z-50 font-sans"
      >
        <div className="flex items-center gap-3">
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <img
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
            className="h-10 md:h-16 w-auto"
            src={logo}
            alt="Logo"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-gray-700 font-medium text-base relative">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-gray-900 font-bold text-sm tracking-wide capitalize">{role}</p>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">{userinfo?.name}</p>
          </div>

          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="group flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              {userinfo?.profile ? (
                <img src={userinfo.profile} alt="Avatar" className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                  {userinfo?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showProfilePopup && userinfo && (
              <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-red-500 p-6 text-white text-center relative">
                  <div className="absolute top-3 right-3 bg-white/20 rounded-full p-1">
                    <FaUserShield size={12} className="text-white/80" />
                  </div>
                  <div className="mx-auto h-20 w-20 rounded-full border-4 border-white/30 shadow-xl mb-3 overflow-hidden">
                    {userinfo.profile ? (
                      <img src={userinfo.profile} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-indigo-400 flex items-center justify-center text-2xl font-bold">
                        {userinfo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{userinfo.name}</h3>
                  <p className="text-indigo-100 text-sm">{userinfo.email}</p>
                  <span className="mt-2 inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {userinfo.role}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
                      <p className="text-sm font-semibold text-gray-700">{userinfo.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Joined</p>
                      <p className="text-sm font-semibold text-gray-700">{new Date(userinfo.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowProfilePopup(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition group"
                  >
                    <FaEdit className="text-gray-400 group-hover:text-indigo-600" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowProfilePopup(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition group"
                  >
                    <FaLock className="text-gray-400 group-hover:text-indigo-600" />
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      sessionStorage.removeItem("token");
                      sessionStorage.removeItem("role");
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition group"
                  >
                    <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
            <div className="bg-white w-full max-w-[380px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                <div className="flex justify-center pb-2">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-full border-2 border-slate-50 shadow-sm overflow-hidden bg-slate-50">
                      {editForm.profile ? (
                        <img src={editForm.profile} className="h-full w-full object-cover" alt="Profile" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-300">
                          {userinfo.name.charAt(0)}
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-all border-2 border-white">
                      <FaCamera size={10} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[1.5] px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
            <div className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Security</h2>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
                {passwordError && (
                  <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-xl text-[11px] font-bold border border-red-100">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[1.5] px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        id="admin-sidebar"
        style={{ fontFamily: "calibri" }}
        className={`
          fixed top-16 md:top-24 bottom-0 left-0 z-40
          w-60 bg-gray-50 shadow-lg p-6 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <ul className="flex flex-col gap-4 text-gray-700 font-medium text-base">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 text-xl rounded-lg transition-colors duration-300 ease-in-out
    ${isActive ? "bg-blue-400 text-white" : "text-gray-700"}`
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
