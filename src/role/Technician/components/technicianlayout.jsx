import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import TechnicianNavbar from "./technavbar";
import TechnicianFooter from "./technicianfooter";
import { TechData } from "../context/Techniciandatamaintenance";
import { FaClock } from "react-icons/fa";

export default function TechnicianLayout() {
  const navigate = useNavigate();
  const { techinfo } = TechData();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "technician") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (techinfo && techinfo.isApproved === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <FaClock className="text-orange-600 text-3xl animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Access Restricted</h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg font-medium">
          Welcome, <span className="font-bold text-gray-800">{techinfo.name}</span>. Your technician account is currently <span className="text-orange-600">Pending Approval</span>.
        </p>
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-700 max-w-lg mb-10">
          <p className="mb-2 font-semibold">What happens next?</p>
          <p className="text-sm leading-relaxed">Our administrators will review your credentials. Once approved, you will have full access to view and manage service requests. This process usually takes 24-48 business hours.</p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TechnicianNavbar />
      <main className="pt-24 px-8 mt-7">
        <Outlet />
      </main>
      <TechnicianFooter />
    </div>
  );
}
