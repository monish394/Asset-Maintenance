import { useEffect, useState, useReducer } from "react";
import axios from "../../../config/api";

const initialstate = {
  users: [],
  editUser: null,
  isediting: false,
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
    default:
      return state;
  }
}

export default function Users() {
  const [allusers, setAllusers] = useState([]);
  const [state, dispatch] = useReducer(userReducer, initialstate);
  const { users, editUser } = state;

  useEffect(() => {
    axios
      .get("/findtechnicians")
      .then((res) => {
        dispatch({ type: "SET_USERS", payload: res.data });
        setAllusers(res.data);
      })
      .catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/deleteuser/${id}`);
      dispatch({
        type: "SET_USERS",
        payload: users.filter((user) => user._id !== id),
      });
      alert("User deleted successfully!");
    } catch {
      alert("Failed to delete user!");
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
      alert("User updated successfully!");
    } catch {
      alert("Failed to update user!");
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
<div className="p-8 ml-52 mt-5 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
  {editUser && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleEditSubmit}
        className="bg-white rounded-2xl p-6 w-[400px] shadow-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Edit Technician
        </h2>

        {["name", "email", "phone", "address"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={editUser[field]}
              onChange={(e) =>
                dispatch({
                  type: "START_EDIT",
                  payload: { ...editUser, [field]: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "START_EDIT", payload: null })}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )}

  <div className="mb-6 max-w-4xl">
    <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
      Manage Technicians Personal Info
    </h1>
    <p className="text-gray-600 text-lg mb-6">
      View, update, and manage registered technicians within the asset maintenance system.
    </p>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-2xl shadow-md">
      <thead className="bg-gray-100">
        <tr>
          {["Name", "Email", "Phone", "Address", "Role", "Created At", "Action"].map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y">
        {allusers.length > 0 ? (
          users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition">
              {["name", "email", "phone", "address"].map((field) => (
                <td key={field} className="px-6 py-4 text-gray-800">
                  {user[field]}
                </td>
              ))}
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Technician
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-6 text-gray-500">
              No technicians found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}
