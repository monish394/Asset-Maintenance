import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useUserAsset } from "../context/userassetprovider";
export default function UserNavbar() {
  const {usernotifications,userinfo}=useUserAsset();
  console.log(usernotifications)
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUsermenu, setShowUsermenu] = useState(false);

  return (
    <div className="w-full h-24 flex items-center justify-between px-8 shadow-lg bg-white fixed top-0 left-0 z-50">
      <div>
        <img src={logo} alt="Logo" className="h-16 w-auto ml-4" />
      </div>

      <ul className="flex items-center gap-8 text-gray-700 font-medium text-base relative">
        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/user/home">Home</Link>
        </li>

        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/user/raiserequest">RaiseRequest</Link>
        </li>

        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/user/payment">Payment</Link>
        </li>

        <li className="cursor-pointer hover:text-blue-600 transition">
          <Link to="/user/workorderrequest">WorkOrder Request</Link>
        </li>

        <li
          className="cursor-pointer hover:text-blue-600 transition relative"
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowUsermenu(false);
          }}
        >
          <IoMdNotifications size={28} />

   {showNotifications && (
  <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>

    {usernotifications.length === 0 ? (
      <p className="text-gray-500 text-sm">No new notifications</p>
    ) : (
      <ul className="max-h-64 overflow-y-auto">
        {usernotifications
          .slice(0, 5).reverse() 
          .map((n) => (
            <li
              key={n._id}
              className="mb-2 p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></span>
              )}
            </li>
          ))}
      </ul>
    )}
  </div>
)}


        </li>

        <li
          className="cursor-pointer hover:text-blue-600 transition relative"
          onClick={() => {
            setShowUsermenu(!showUsermenu);
            setShowNotifications(false);
          }}
        >
          <FaUser size={23} />

        {showUsermenu && (
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
      <span className="text-right max-w-[140px] truncate">
        {userinfo.address}
      </span>
    </div>

    <p className="text-xs text-gray-400 mt-2">
      Joined on {new Date(userinfo.createdAt).toLocaleDateString()}
    </p>
  </div>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
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
