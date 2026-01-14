import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Role = "ADMIN" | "COMMANDER" | "MEDIC";

type Props = {
  children: React.ReactNode;
  allowedRoles: Role[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but role not permitted → unauthorized page
  if (!role || !allowedRoles.includes(role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return <>{children}</>;
}
