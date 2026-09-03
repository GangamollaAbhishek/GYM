import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
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
          {cmsData?.brand?.logo ? (
            <div className="w-16 h-16 rounded-2xl bg-[#121217] border border-white/15 p-2 flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.6)] animate-pulse">
              <img
                src={cmsData.brand.logo}
                alt={cmsData?.brand?.name || "Logo"}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_30px_rgba(229,9,20,0.6)] animate-pulse">
              <Activity
                size={32}
                className="animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <h2 className="font-bebas text-2xl tracking-wider text-white">
              {cmsData?.brand?.name || "TITAN•PULSE"}
            </h2>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#8A94A0]">
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
    const userRole = (user?.role || "customer").toLowerCase().trim();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

    // Admin role generally has bypass or check if explicitly in allowed
    const hasPermission =
      userRole === "admin" || normalizedAllowed.includes(userRole);

    if (!hasPermission) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children ? children : null;
}
