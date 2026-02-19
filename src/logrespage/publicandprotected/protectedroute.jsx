import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {

    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "user") return <Navigate to="/user/home" replace />;
    if (role === "technician") return <Navigate to="/technician/home" replace />;
  }

  return children;
}
