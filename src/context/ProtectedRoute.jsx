
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Authcontext";
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center">Checking session...</p>;
  }

  return user
    ? <Outlet />
    : <Navigate to="/auth/login" replace />;
}
