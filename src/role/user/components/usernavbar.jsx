import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useUserAsset } from "../context/userassetprovider";
export default function UserNavbar() {
  const {usernotifications}=useUserAsset();
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

    {/* {usernotifications.length > 5 && (
      <div className="mt-2 text-center">
        <button
          className="text-blue-500 text-sm hover:underline"
          onClick={() => navigate("/notifications")}
        >
          See all notifications
        </button>
      </div>
    )} */}
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
            <div className="absolute right-0 mt-5 w-40 bg-blue-100 shadow-lg rounded-lg p-3 z-500">
              <p className="cursor-pointer hover:text-blue-600">Profile</p><br />
                  <button onClick={()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/")
    return;
    
  }}
  className="
    h-10 w-28
    px-4
    rounded-lg
    bg-blue-600
    text-white
    font-semibold
    shadow-md
    hover:bg-blue-800
    transition
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-blue-400
  "
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
