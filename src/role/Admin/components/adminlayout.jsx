import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./navbar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("role in layout", role)

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate, token, role]);

  if (!token || role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* 
        On mobile: pt-16 to clear the 4rem (h-16) top nav, no left margin
        On lg+:    pt-24 to clear the 6rem (h-24) top nav, pl-60 to clear the 15rem sidebar
      */}
      <div className="pt-16 md:pt-24 lg:pl-60">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
