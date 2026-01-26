import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./navbar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("role in layout" ,role)

 useEffect(() => {
  if (!token || role !== "admin") {
    navigate("/", { replace: true });
  }
}, [navigate, token, role]);



  if (!token || role !== "admin") return null;

  return (
    <div>
      <Navbar />
      <div className="flex-1 p-8 mt-10">
        <Outlet />
      </div>
    </div>
  );
}
