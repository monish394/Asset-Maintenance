import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {

  let token = sessionStorage.getItem("token");
  let role = sessionStorage.getItem("role");


  if (!token) {
    token = localStorage.getItem("token");
    role = localStorage.getItem("role");
  }

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
