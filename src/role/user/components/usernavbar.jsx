import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function UserNavbar() {
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
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>
              <p className="font-semibold text-sm mb-2">Notifications</p>

              
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
