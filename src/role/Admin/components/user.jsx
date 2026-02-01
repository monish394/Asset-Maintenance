import { useEffect, useState ,useReducer} from "react";

import axios from "axios";
import { FaLeaf } from "react-icons/fa6";


  const initialstate={
    users:[],
    editUser:null,
    isediting:false
  }

function userReducer(state, action) {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "START_EDIT":
      return { ...state, editUser: action.payload, isediting: true };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map(u =>
          u._id === action.payload._id ? action.payload : u
        ),
        editUser: null,
        isediting: false
      };
    default:
      return state;
  }
}



export default function Users() {
  const [allusers, setAllusers] = useState([]);

 const [state, dispatch] = useReducer(userReducer, initialstate);

 const {users,editUser}=state;
 console.log(users)
 console.log(editUser)

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/findusers")
      .then((res) => {
        dispatch({type:"SET_USERS", payload:res.data});
        setAllusers(res.data)
      })
        

      .catch((err) => console.error(err.message));
  }, []);

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/deleteuser/${id}`);

    // Update reducer state directly
    dispatch({
      type: "SET_USERS",
      payload: users.filter(user => user._id !== id)
    });

    alert("User deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete user!");
  }
};


const handleEdit=(user)=>{
  dispatch({type:"START_EDIT",payload:user})

}
const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!editUser) return;

  try {
    const res = await axios.put(`http://localhost:5000/api/updateuser/${editUser._id}`, {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      address: editUser.address,
    });

    dispatch({ type: "UPDATE_USER", payload: res.data });
    alert("User updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update user!");
  }
};




  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-8 ml-53 mt-5">



      {editUser && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
    <form
      onSubmit={handleEditSubmit}
      className="bg-white rounded-xl p-6 w-[400px] max-w-[90%] shadow-lg space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center">Edit User</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={editUser.name}
          onChange={(e) => dispatch({ 
            type: "START_EDIT", 
            payload: { ...editUser, name: e.target.value } 
          })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={editUser.email}
          onChange={(e) => dispatch({ 
            type: "START_EDIT", 
            payload: { ...editUser, email: e.target.value } 
          })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
        <input
          type="text"
          value={editUser.phone}
          onChange={(e) => dispatch({ 
            type: "START_EDIT", 
            payload: { ...editUser, phone: e.target.value } 
          })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
        <input
          type="text"
          value={editUser.address}
          onChange={(e) => dispatch({ 
            type: "START_EDIT", 
            payload: { ...editUser, address: e.target.value } 
          })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "START_EDIT", payload: null,isediting:false })}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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




      
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>

         <tbody className="divide-y divide-gray-200">
  {allusers.length > 0 ? (
    users.map((user) => (
      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
  <td className="px-8 py-4 text-gray-700 text-base">{user.name}</td>
  <td className="px-8 py-4 text-gray-700 text-base">{user.email}</td>
  <td className="px-8 py-4 text-gray-700 text-base">{user.phone}</td>
  <td className="px-8 py-4 text-gray-700 text-base">{user.address}</td>
  <td className="px-8 py-4">
    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
      User
    </span>
  </td>
  <td className="px-8 py-4 text-gray-500 text-base">{formatDate(user.createdAt)}</td>
  <td className="px-8 py-4 text-center flex justify-center gap-3">
    <button onClick={()=>handleEdit(user)} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm transition">
      Edit
    </button>
    <button
      onClick={() => handleDelete(user._id)}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 text-sm transition"
    >
      Delete
    </button>
  </td>
</tr>

    ))
  ) : (
    <tr>
      <td colSpan={7} className="px-8 py-6 text-center text-gray-500 text-base">
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
