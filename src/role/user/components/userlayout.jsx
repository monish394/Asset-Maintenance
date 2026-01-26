import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./footer";

export default function UserLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

  
    if (!token || role !== "user") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="flex-1 mt-24 p-8">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
