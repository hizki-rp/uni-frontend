import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/context";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !(user.groups.includes("admin") || user.is_staff)) {
    // Optional: Create an "Unauthorized" page to show a friendly message
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
