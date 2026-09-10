import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Crown,
  CreditCard,
  Dumbbell,
  Users,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  Shield,
  LayoutDashboard,
  Globe,
  UserCheck,
  UserCog,
  ShieldCheck,
  ArrowRight,
  CalendarCheck,
  Activity,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProfileDropdown({ onLogout }) {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
      >
        <User size={14} />
        <span>Sign In</span>
      </Link>
    );
  }

  const handleOpenAccountTab = (tabId) => {
    setDropdownOpen(false);
    navigate(`/account?tab=${tabId}`);
  };

  const handleUserLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate("/");
    }
  };

  const role = (user.role || "customer").toLowerCase().trim();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. ADMIN PILL */}
      {role === "admin" ? (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={() => setDropdownOpen(true)}
          className="flex items-center gap-1.5 bg-[#181114] hover:bg-[#23151A] border border-[#FF1E27]/50 hover:border-[#FF1E27] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.2)] group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF1E27] to-[#B91C1C] text-white flex items-center justify-center shadow-sm">
            <Shield size={12} className="text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white max-w-[90px] truncate">
              {user.name ? user.name.split(" ")[0] : "Admin"}
            </span>
            <span className="px-1 py-0.2 rounded bg-[#FF1E27]/20 border border-[#FF1E27]/30 text-[#FF1E27] text-[8px] font-mono font-black uppercase">
              HQ
            </span>
          </div>
          {dropdownOpen ? (
            <ChevronUp size={13} className="text-[#FF1E27] transition-transform" />
          ) : (
            <ChevronDown size={13} className="text-slate-400 group-hover:text-white transition-transform" />
          )}
        </button>
      ) : role === "receptionist" ? (
        /* 2. RECEPTIONIST PILL */
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={() => setDropdownOpen(true)}
          className="flex items-center gap-1.5 bg-[#1B1710] hover:bg-[#251E14] border border-amber-500/50 hover:border-amber-400 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-black flex items-center justify-center shadow-sm">
            <UserCog size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-white max-w-[90px] truncate">
            {user.name ? user.name.split(" ")[0] : "Desk"}
          </span>
          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono font-bold">
            DESK
          </span>
          {dropdownOpen ? (
            <ChevronUp size={13} className="text-amber-400" />
          ) : (
            <ChevronDown size={13} className="text-slate-400" />
          )}
        </button>
      ) : role === "trainer" ? (
        /* 3. TRAINER PILL */
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={() => setDropdownOpen(true)}
          className="flex items-center gap-1.5 bg-[#171120] hover:bg-[#21172E] border border-purple-500/50 hover:border-purple-400 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-purple-800 text-white flex items-center justify-center shadow-sm">
            <Dumbbell size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-white max-w-[90px] truncate">
            {user.name ? user.name.split(" ")[0] : "Coach"}
          </span>
          <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[8px] font-mono font-bold">
            COACH
          </span>
          {dropdownOpen ? (
            <ChevronUp size={13} className="text-purple-400" />
          ) : (
            <ChevronDown size={13} className="text-slate-400" />
          )}
        </button>
      ) : (
        /* 4. CUSTOMER / ATHLETE PILL (MATCHES USER SCREENSHOT) */
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={() => setDropdownOpen(true)}
          className="flex items-center gap-2 bg-[#151722] hover:bg-[#1f2333] border border-white/15 hover:border-[#FF2E4C]/50 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-tr from-[#E50914] to-[#FF2E4C] text-white font-extrabold text-[11px] flex items-center justify-center uppercase shadow-sm">
            {user.avatar || user.profilePic ? (
              <img
                src={user.avatar || user.profilePic}
                alt={user.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              (user.name || "U").charAt(0)
            )}
          </div>
          <span className="text-xs font-bold text-white max-w-[90px] sm:max-w-[120px] truncate">
            {user.name || "Athlete"}
          </span>
          {dropdownOpen ? (
            <ChevronUp size={13} className="text-slate-400 group-hover:text-white transition-transform" />
          ) : (
            <ChevronDown size={13} className="text-slate-400 group-hover:text-white transition-transform" />
          )}
        </button>
      )}

      {/* DROPDOWN FLOATING CARD */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseLeave={() => setDropdownOpen(false)}
            className="absolute right-0 top-full mt-2 w-72 bg-[#12161E] border border-white/15 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] overflow-hidden z-[110] p-3 text-xs"
          >
            {/* 1. ADMIN VIEW */}
            {role === "admin" && (
              <>
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#1A1215] -mx-3 -mt-3 mb-2 rounded-t-3xl">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#FF1E27]" />
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-white font-mono">
                      Admin Command HQ
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/40 text-[9px] font-mono font-bold">
                    ROOT ACCESS
                  </span>
                </div>

                <div className="py-1 space-y-0.5 max-h-80 overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <LayoutDashboard size={16} className="text-[#FF1E27] group-hover:scale-110 transition-transform" />
                    <span>Admin Command Center</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <Globe size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Landing Pages (CMS)</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <UserCheck size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Customer Management</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <Dumbbell size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Trainer Management</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <UserCog size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Receptionist Staff</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <ShieldCheck size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Membership Plans</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#B91C1C] text-white font-bold text-xs flex items-center justify-between hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.4)]"
                  >
                    <span>Launch Admin Portal</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

            {/* 2. RECEPTIONIST VIEW */}
            {role === "receptionist" && (
              <>
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#1F1912] -mx-3 -mt-3 mb-2 rounded-t-3xl">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400 font-mono">
                    Front Desk Terminal
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                    RECEPTIONIST
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/receptionist");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <UserCog size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Receptionist Dashboard</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/receptionist");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center justify-between hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    <span>Open Front Desk</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

            {/* 3. TRAINER VIEW */}
            {role === "trainer" && (
              <>
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#1B1324] -mx-3 -mt-3 mb-2 rounded-t-3xl">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-purple-300 font-mono">
                    Coach Hub
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-mono font-bold">
                    TRAINER
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/trainer");
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <Dumbbell size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Trainer Dashboard & Schedule</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/trainer");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-between hover:bg-purple-500 transition-all cursor-pointer"
                  >
                    <span>Open Trainer Hub</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

            {/* 4. CUSTOMER VIEW (EXACT MATCH TO SCREENSHOT) */}
            {role !== "admin" && role !== "receptionist" && role !== "trainer" && (
              <>
                {/* Header: YOUR ACCOUNT + PRO MEMBER */}
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-300 font-mono">
                    YOUR ACCOUNT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/40 text-[9px] font-mono font-black tracking-wider">
                    PRO MEMBER
                  </span>
                </div>

                {/* Account Navigation Menu Items */}
                <div className="py-1.5 space-y-0.5 max-h-80 overflow-y-auto no-scrollbar">
                  {/* 1. Personal Information */}
                  <button
                    onClick={() => handleOpenAccountTab("personal")}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#2A141A]/60 border border-[#FF2E4C]/30 text-white font-semibold transition-colors text-left cursor-pointer group"
                  >
                    <User size={16} className="text-[#FF2E4C] group-hover:scale-110 transition-transform" />
                    <span className="text-[#FF2E4C]">Personal Information</span>
                  </button>

                  {/* 2. Attendance */}
                  <button
                    onClick={() => handleOpenAccountTab("attendance")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarCheck size={16} className="text-slate-400 group-hover:text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Attendance</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-mono">
                      Live QR
                    </span>
                  </button>

                  {/* 3. Membership Details */}
                  <button
                    onClick={() => handleOpenAccountTab("membership")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Crown size={16} className="text-slate-400 group-hover:text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Membership Details</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-mono">
                      ACTIVE
                    </span>
                  </button>

                  {/* 4. Trainers */}
                  <button
                    onClick={() => handleOpenAccountTab("trainers")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-slate-400 group-hover:text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>Trainers</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-mono">
                      Faculty
                    </span>
                  </button>

                  {/* 5. Payments */}
                  <button
                    onClick={() => handleOpenAccountTab("payments")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Payments</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-mono font-bold">
                      1
                    </span>
                  </button>

                  {/* 6. Products & Supplements */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/products");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Products & Store</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      STORE
                    </span>
                  </button>

                  {/* 7. My Cart */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/cart");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={16} className="text-[#FF2E4C] group-hover:scale-110 transition-transform" />
                      <span>My Cart</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      totalItemsCount > 0 
                        ? "bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/30" 
                        : "bg-white/[0.06] text-slate-400"
                    }`}>
                      {totalItemsCount > 0 ? `${totalItemsCount} ${totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}` : "EMPTY"}
                    </span>
                  </button>

                  {/* 8. Workout & Diet Plan */}
                  <button
                    onClick={() => handleOpenAccountTab("workout-diet")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Dumbbell size={16} className="text-slate-400 group-hover:text-rose-400 group-hover:scale-110 transition-transform" />
                      <span>Workout & Diet Plan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-mono">
                      Active
                    </span>
                  </button>

                  {/* 9. Feedback & Support */}
                  <button
                    onClick={() => handleOpenAccountTab("feedback")}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                  >
                    <MessageSquare size={16} className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-transform" />
                    <span>Feedback & Support</span>
                  </button>
                </div>

                {/* 8. Log Out */}
                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={handleUserLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 font-semibold transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
