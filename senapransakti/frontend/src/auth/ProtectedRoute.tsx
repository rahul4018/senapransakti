import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
  allowedRoles: ("ADMIN" | "COMMANDER" | "MEDIC")[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();
  const location = useLocation();

  // If not logged in → send to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If logged in but role not allowed → unauthorized
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise allow access
  return children;
}
