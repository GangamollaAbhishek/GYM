import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLandingPageCMS } from "../../context/LandingPageCMSContext";
import { Activity } from "lucide-react";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { cmsData } = useLandingPageCMS();
  const location = useLocation();

  // Show a smooth dark cyberpunk loader while verifying session with backend
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E50914]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF2E4C] via-[#FF526B] to-[#00F0FF] p-[2px] shadow-[0_0_30px_rgba(255,46,76,0.4)] animate-pulse">
            <div className="w-full h-full bg-[#090C0E] rounded-[14px] flex items-center justify-center">
              <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF2E4C]">
                P
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h2 className="font-heading font-black text-2xl tracking-wider text-white">
              PAMS
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8A94A0]">
              VERIFYING CREDENTIALS...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to login page preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user's role is permitted
  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = String(user?.role || "CUSTOMER").toUpperCase().trim();
    const userRole = rawRole === "SUPERADMIN" ? "SUPER_ADMIN" : rawRole;
    const normalizedAllowed = allowedRoles.map((r) => {
      const u = String(r).toUpperCase().trim();
      return u === "SUPERADMIN" ? "SUPER_ADMIN" : u;
    });

    // SUPER_ADMIN has platform-wide bypass across all administrative routes
    const isSuperAdmin = userRole === "SUPER_ADMIN";
    const hasPermission =
      isSuperAdmin ||
      normalizedAllowed.includes(userRole) ||
      (normalizedAllowed.includes("ADMIN") && userRole === "ADMIN");

    if (!hasPermission) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children ? children : null;
}
