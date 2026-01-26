import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import TechnicianNavbar from "./technavbar";

export default function TechnicianLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    //not tech navigate to login
    if (!token || role !== "technician") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <TechnicianNavbar />
      <main className="pt-24 px-8 mt-7">
        <Outlet />
      </main>
    </div>
  );
}
