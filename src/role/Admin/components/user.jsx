import { useEffect, useState, useReducer } from "react";
import axios from "axios";

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
      .get("http://localhost:5000/api/findusers")
      .then((res) => {
        dispatch({ type: "SET_USERS", payload: res.data });
        setAllusers(res.data);
      })
      .catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/deleteuser/${id}`);
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
        `http://localhost:5000/api/updateuser/${editUser._id}`,
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
    <div
      className="p-8 ml-53 mt-5"
      style={{ fontFamily: "Calibri, sans-serif" }}
    >
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-xl p-6 w-[400px] max-w-[90%] shadow-lg space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Edit User
            </h2>

            {["name", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  value={editUser[field]}
                  onChange={(e) =>
                    dispatch({
                      type: "START_EDIT",
                      payload: { ...editUser, [field]: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400"
                  required
                />
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "START_EDIT", payload: null })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        User Management
      </h1>
      <p className="text-xl text-gray-600 mb-6 max-w-4xl">
        Manage registered users, update personal details, and maintain accurate
        user records within the asset maintenance and service tracking system.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
         <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {allusers.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      User
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
