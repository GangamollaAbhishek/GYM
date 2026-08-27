import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home, UserCheck, LogOut, Lock } from 'lucide-react';

export default function ForbiddenPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoToPortal = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const role = (user.role || '').toLowerCase().trim();
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'receptionist') {
      navigate('/receptionist');
    } else if (role === 'trainer') {
      navigate('/trainer');
    } else {
      navigate('/');
    }
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#FF2E4C] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#FF2E4C]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            <Lock size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl text-white tracking-wider leading-none">
              TITAN<span className="text-[#FF2E4C]">•</span>PULSE
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#8A94A0] font-mono leading-tight">
              SECURITY PROTOCOL
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151515] border border-white/10 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-white hover:border-[#FF2E4C] transition-all shadow-lg"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
      </header>

      {/* Main 403 Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#12161A]/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(229,9,20,0.15)] text-center flex flex-col items-center">
        
        {/* Shield Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-[#FF2E4C] mb-6 shadow-[0_0_25px_rgba(255,46,76,0.3)] animate-pulse">
          <ShieldAlert size={40} className="stroke-[2.5]" />
        </div>

        {/* Status Code & Title */}
        <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-[#FF2E4C] text-[11px] font-mono uppercase tracking-widest mb-3">
          HTTP 403 FORBIDDEN
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white uppercase tracking-wide mb-3">
          ACCESS RESTRICTED
        </h1>

        <p className="text-sm text-[#8A94A0] leading-relaxed mb-6 max-w-sm">
          You do not have the required administrative or role authorization to view this secure partition of the TITAN PULSE system.
        </p>

        {/* Current User Role Diagnostic Card */}
        {user && (
          <div className="w-full p-4 rounded-2xl bg-[#090C0E] border border-white/10 text-left space-y-2 mb-6 font-mono text-xs">
            <div className="flex justify-between items-center text-[#8A94A0]">
              <span>AUTHENTICATED USER:</span>
              <span className="text-white font-bold">{user.name}</span>
            </div>
            <div className="flex justify-between items-center text-[#8A94A0]">
              <span>EMAIL ADDRESS:</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between items-center text-[#8A94A0]">
              <span>ASSIGNED ROLE:</span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-[#FF2E4C] uppercase font-bold text-[10px]">
                {user.role || 'customer'}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoToPortal}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#FF2B35] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <UserCheck size={16} />
            <span>Go To Authorized Portal</span>
          </button>

          <button
            onClick={handleSwitchAccount}
            className="py-3.5 px-4 rounded-2xl bg-[#151515] border border-white/10 hover:border-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            <span>Switch Account</span>
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 text-xs text-[#8A94A0] hover:text-white flex items-center gap-1 font-mono transition-colors"
        >
          <ArrowLeft size={14} /> Back to Public Showcase
        </Link>

      </div>
    </div>
  );
}
