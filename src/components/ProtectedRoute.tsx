import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-sans">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If logged in but wrong role, push them to their proper dashboard or home
    if (user.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'Client') return <Navigate to="/dashboard/client" replace />;
    if (user.role === 'Freelancer') return <Navigate to="/dashboard/freelancer" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
