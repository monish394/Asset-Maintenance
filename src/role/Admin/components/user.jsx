import { useEffect, useState, useReducer } from "react";
import axios from "../../../config/api";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTrash, FaEdit, FaTimes, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialstate = {
  users: [],
  editUser: null,
  isediting: false,
  deleteUser: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "START_EDIT":
      return { ...state, editUser: action.payload, isediting: true };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
        editUser: null,
        isediting: false,
      };
    case "SET_DELETE_USER":
      return { ...state, deleteUser: action.payload };
    default:
      return state;
  }
}

export default function Users() {
  const [allusers, setAllusers] = useState([]);
  const [state, dispatch] = useReducer(userReducer, initialstate);
  const { users, editUser, deleteUser } = state;

  useEffect(() => {
    axios
      .get("/findusers")
      .then((res) => {
        dispatch({ type: "SET_USERS", payload: res.data });
        setAllusers(res.data);
      })
      .catch(() => { });
  }, []);

  const handleApprove = async (id, currentStatus) => {
    try {
      const res = await axios.put(`/approve-technician/${id}`, { isApproved: !currentStatus });
      dispatch({ type: "UPDATE_USER", payload: res.data });
      toast.success(`User ${!currentStatus ? 'Approved' : 'Disapproved'} successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.err || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      await axios.delete(`/deleteuser/${deleteUser._id}`);
      dispatch({
        type: "SET_USERS",
        payload: users.filter((u) => u._id !== deleteUser._id),
      });
      dispatch({ type: "SET_DELETE_USER", payload: null });
      toast.success("User account deactivated successfully");
    } catch {
      toast.error("System error: Failed to remove user records");
    }
  };

  const handleEdit = (user) => {
    dispatch({ type: "START_EDIT", payload: user });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const res = await axios.put(
        `/updateuser/${editUser._id}`,
        {
          name: editUser.name,
          email: editUser.email,
          phone: editUser.phone,
          address: editUser.address,
        }
      );
      dispatch({ type: "UPDATE_USER", payload: res.data });
      toast.success("User profile synchronized successfully");
    } catch {
      toast.error("Process failed: Could not update user details");
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-4 md:p-8 ml-0 lg:ml-64 mt-16 md:mt-5 font-sans selection:bg-indigo-100 selection:text-indigo-700" style={{ fontFamily: "'Outfit', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>

      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: "START_EDIT", payload: null })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative z-[101] overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Modify User</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Adjust user credentials and contact data</p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "START_EDIT", payload: null })}
                    className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Member Name</label>
                      <div className="relative group">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                          value={editUser.name}
                          onChange={(e) => dispatch({ type: "START_EDIT", payload: { ...editUser, name: e.target.value } })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-semibold"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Line</label>
                      <div className="relative group">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                          value={editUser.phone}
                          onChange={(e) => dispatch({ type: "START_EDIT", payload: { ...editUser, phone: e.target.value } })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-semibold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registered Email</label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                      <input
                        type="email"
                        value={editUser.email}
                        onChange={(e) => dispatch({ type: "START_EDIT", payload: { ...editUser, email: e.target.value } })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Static Address</label>
                    <div className="relative group">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                      <textarea
                        value={editUser.address}
                        onChange={(e) => dispatch({ type: "START_EDIT", payload: { ...editUser, address: e.target.value } })}
                        rows={2}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-semibold resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "START_EDIT", payload: null })}
                      className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-4 px-10 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >
                      Update Records
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {deleteUser && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: "SET_DELETE_USER", payload: null })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative z-[111] text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
                <FaExclamationTriangle className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Delete Account?</h2>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
                You are about to remove <span className="font-bold text-slate-900">{deleteUser.name}</span> from the management database. This cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Confirm Removal
                </button>
                <button
                  onClick={() => dispatch({ type: "SET_DELETE_USER", payload: null })}
                  className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Keep Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-6 max-w-4xl">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
          User Directory
        </h1>
        <p className="text-gray-500 text-lg mb-6 leading-relaxed">
          Overview of all registered platform users. Manage their access levels and personal information securely.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-xl bg-white">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-[0.1em]">
            <tr>
              <th className="px-6 py-5 text-left">Profile</th>

              <th className="px-6 py-5 text-left">User</th>
              <th className="px-6 py-5 text-left">Contact Info</th>
              <th className="px-6 py-5 text-left">Location</th>
              <th className="px-6 py-5 text-left">Access Tier</th>
              <th className="px-6 py-5 text-left">Security Status</th>
              <th className="px-6 py-5 text-center">System Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {allusers.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                 <td className="px-6 py-5">
  {user.profile ? (
    <img
      src={user.profile}
      alt={user.name}
      className="w-10 h-10 rounded-full object-cover border border-slate-200"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
      {user.name?.charAt(0).toUpperCase()}
    </div>
  )}
</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
                      Assets: <span className="font-bold text-indigo-500">{user.assetCount || 0}</span> • Requests: <span className="font-bold text-indigo-500">{user.requestCount || 0}</span>
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FaEnvelope size={10} />
                        <span className="text-xs font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <FaPhone size={10} />
                        <span className="text-xs font-medium">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-slate-500 max-w-[200px]">
                    <p className="truncate" title={user.address}>{user.address}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Standard {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className={`w-fit px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${user.isApproved ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {user.isApproved ? 'Verified' : 'Pending'}
                      </span>
                      <p className="text-[9px] text-slate-400">Joined {formatDate(user.createdAt)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(user._id, user.isApproved)}
                      className={`p-3 rounded-xl transition-all duration-300 ${user.isApproved
                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                      title={user.isApproved ? "Suspend Approval" : "Grant Approval"}
                    >
                      {user.isApproved ? <FaTimes size={14} /> : <FaCheck size={14} />}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300"
                      title="Adjust Records"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => dispatch({ type: "SET_DELETE_USER", payload: user })}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                      title="Remove Account"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                      <FaUser size={20} />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No registered users located in database</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
