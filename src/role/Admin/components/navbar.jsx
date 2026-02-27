import { NavLink, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdWorkHistory } from "react-icons/md";
import { FaBox, FaUsers, FaBars, FaTimes as FaXMark } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { GrHostMaintenance } from "react-icons/gr";
import logo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";
import axios from "../../../config/api";
import { FaCamera, FaTimes, FaEdit, FaSignOutAlt, FaLock } from "react-icons/fa";

export default function Navbar() {
  const [userinfo, setUserinfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    axios.get("/userinfo")
      .then((res) => setUserinfo(res.data))
      .catch((err) => console.log(err.message));
  }, []);

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
      {/* ── Top Navbar ── */}
      <div
        style={{ fontFamily: "calibri" }}
        className="w-full h-16 md:h-24 flex items-center justify-between px-4 md:px-8 shadow-lg bg-gray-50 fixed top-0 left-0 z-50"
      >
        {/* Hamburger — only visible on mobile */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaXMark size={20} /> : <FaBars size={20} />}
        </button>

        <div>
          <img
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
            className="h-10 md:h-16 w-auto"
            src={logo}
            alt="Logo"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-gray-700 font-medium relative">
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
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                  {userinfo?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showProfilePopup && userinfo && (
              <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
                  <div className="mx-auto h-20 w-20 rounded-full border-4 border-white/30 shadow-xl mb-3 overflow-hidden">
                    {userinfo.profile ? (
                      <img src={userinfo.profile} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-blue-400 flex items-center justify-center text-2xl font-bold">
                        {userinfo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{userinfo.name}</h3>
                  <p className="text-blue-100 text-sm">{userinfo.email}</p>
                </div>
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Role</p>
                      <p className="text-sm font-semibold text-gray-700 capitalize">{userinfo.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Joined</p>
                      <p className="text-sm font-semibold text-gray-700">{new Date(userinfo.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setShowEditModal(true); setShowProfilePopup(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition group">
                    <FaEdit className="text-gray-400 group-hover:text-blue-600" /> Edit Profile
                  </button>
                  <button onClick={() => { setShowPasswordModal(true); setShowProfilePopup(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition group">
                    <FaLock className="text-gray-400 group-hover:text-blue-600" /> Change Password
                  </button>
                  <button onClick={() => {
                    localStorage.removeItem("token"); localStorage.removeItem("role");
                    sessionStorage.removeItem("token"); sessionStorage.removeItem("role");
                    navigate("/");
                  }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition group">
                    <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/10 p-2 rounded-full transition"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                  <div className="h-32 w-32 rounded-full border-4 border-slate-100 shadow-lg overflow-hidden relative">
                    {editForm.profile ? (
                      <img src={editForm.profile} className="h-full w-full object-cover" alt="Profile" />
                    ) : (
                      <div className="h-full w-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                        {userinfo?.name?.charAt(0)}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="h-8 w-8 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition">
                    <FaCamera size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <p className="text-xs text-gray-500 font-medium italic">Click the camera icon to update photo</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "Full Name", key: "name", type: "text" },
                  { label: "Email Address", key: "email", type: "email" },
                  { label: "Phone Number", key: "phone", type: "text" },
                  { label: "Address", key: "address", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                    <input type={type} value={editForm[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                      required />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit"
                  className="flex-[2] px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="hover:bg-white/10 p-2 rounded-full transition"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
              {passwordError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">{passwordError}</div>}
              <div className="space-y-4">
                {[
                  { label: "Current Password", key: "oldPassword" },
                  { label: "New Password", key: "newPassword" },
                  { label: "Confirm New Password", key: "confirmPassword" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                    <input type="password" value={passwordForm[key]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none text-sm font-medium"
                      required />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit"
                  className="flex-[2] px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl transition">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile Backdrop ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <div
        style={{ fontFamily: "calibri" }}
        className={`
          w-60 bg-gray-50 shadow-lg p-6 flex flex-col fixed top-16 md:top-24 bottom-0 left-0 z-40
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
                  ${isActive ? "bg-blue-400 text-white" : "text-gray-700 hover:bg-gray-200"}`
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
