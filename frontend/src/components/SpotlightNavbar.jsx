import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  User,
  Crown,
  CreditCard,
  Dumbbell,
  Users,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sparkles,
  Shield,
  LayoutDashboard,
  Globe,
  UserCheck,
  UserCog,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import { useCart } from "../context/CartContext";

export function SpotlightNavbar({
  items = [
    { label: "Home", href: "#" },
    { label: "Programs", href: "#explore-escape" },
    { label: "Supplements", href: "#preworkout-showcase" },
    { label: "3D Arena", href: "#cylinder-arena" },
    { label: "Trainers", href: "#trainers-deck" },
    { label: "Memberships", href: "#services-showcase" },
    { label: "Zones", href: "#supplements-menu" },
    { label: "Transformations", href: "#transformations" },
    { label: "Locations", href: "#locations" },
  ],
  className,
  onItemClick,
  onJoinClick,
  onLoginClick,
  user,
  onLogout,
  defaultActiveIndex = 0,
}) {
  const { cmsData } = useLandingPageCMS();
  const brandData = cmsData?.brand || {};
  const { totalItemsCount } = useCart();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenAccountTab = (tabId) => {
    setAccountDropdownOpen(false);
    navigate(`/account?tab=${tabId}`);
  };

  const handleItemClick = (item, index) => {
    setActiveIndex(index);
    if (onItemClick) onItemClick(item, index);

    if (item.href && item.href.startsWith("#")) {
      if (item.href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetId = item.href.replace("#", "");
        const targetElem = document.getElementById(targetId) || document.querySelector(item.href);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-[100] bg-[#08090D]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.75)] transition-all duration-300", className)}>
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. LEFT SIDE: BRAND LOGO + NAME */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="logo-truus flex items-center gap-3 group focus:outline-none cursor-pointer shrink-0"
        >
          {brandData.logo ? (
            <div className="w-10 h-10 rounded-xl bg-[#121217] border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform duration-300">
              <img src={brandData.logo} alt={brandData.name || 'Logo'} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform duration-300">
              <Activity size={22} className="stroke-[2.5]" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bebas text-2xl sm:text-3xl text-white tracking-wider leading-none">
              {brandData.name || 'TITAN•PULSE'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A0A0A0] font-mono leading-tight">
              {brandData.subname || '3D FITNESS SYSTEM'}
            </span>
          </div>
        </a>

        {/* 2. CENTER: TRADITIONAL HORIZONTAL NAVIGATION LINKS */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 overflow-x-auto no-scrollbar py-1">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item, idx);
              }}
              className={cn(
                "relative px-3 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 rounded-lg whitespace-nowrap cursor-pointer",
                activeIndex === idx
                  ? "text-white bg-white/10 shadow-[0_0_15px_rgba(229,9,20,0.3)] border border-[#E50914]/40"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
              {activeIndex === idx && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E50914] shadow-[0_0_8px_#E50914]" />
              )}
            </a>
          ))}
        </nav>

        {/* 3. RIGHT SIDE: CART & LOGIN / USER PROFILE */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* CART BUTTON WITH BADGE */}
          <Link
            to="/my-cart"
            className="relative p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white hover:text-[#FF1E27] transition-all flex items-center justify-center cursor-pointer shadow-sm group"
            title="View My Cart"
          >
            <ShoppingBag size={18} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full bg-[#FF1E27] text-white text-[10px] font-black font-mono flex items-center justify-center shadow-[0_0_10px_rgba(255,30,39,0.8)] animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Role-Specific Profile Pill */}
              {user.role === 'admin' ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center gap-2 bg-[#181114] hover:bg-[#23151A] border border-[#FF1E27]/50 hover:border-[#FF1E27] px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.2)] group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF1E27] to-[#B91C1C] text-white flex items-center justify-center shadow-sm">
                    <Shield size={14} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate">
                      {user.name ? user.name.split(' ')[0] : 'Admin'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#FF1E27]/20 border border-[#FF1E27]/30 text-[#FF1E27] text-[9px] font-mono font-black uppercase">
                      HQ
                    </span>
                  </div>
                  {accountDropdownOpen ? (
                    <ChevronUp size={14} className="text-[#FF1E27] transition-transform" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                  )}
                </button>
              ) : user.role === 'receptionist' ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center gap-2 bg-[#1B1710] hover:bg-[#251E14] border border-amber-500/50 hover:border-amber-400 px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-black flex items-center justify-center shadow-sm">
                    <UserCog size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">
                    {user.name ? user.name.split(' ')[0] : 'Desk'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">DESK</span>
                  {accountDropdownOpen ? <ChevronUp size={14} className="text-amber-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
              ) : user.role === 'trainer' ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center gap-2 bg-[#171120] hover:bg-[#21172E] border border-purple-500/50 hover:border-purple-400 px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-purple-800 text-white flex items-center justify-center shadow-sm">
                    <Dumbbell size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">
                    {user.name ? user.name.split(' ')[0] : 'Coach'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold">COACH</span>
                  {accountDropdownOpen ? <ChevronUp size={14} className="text-purple-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
              ) : (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center gap-2 bg-[#151722] hover:bg-[#1f2333] border border-white/15 hover:border-[#FF2E4C]/50 px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF2E4C] text-white font-extrabold text-xs flex items-center justify-center uppercase shadow-sm">
                    {(user.name || 'U').charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white max-w-[100px] sm:max-w-[130px] truncate">
                    {user.name ? user.name.split(' ')[0] : 'Athlete'}
                  </span>
                  {accountDropdownOpen ? (
                    <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                  )}
                </button>
              )}

              {/* Dropdown Floating Card */}
              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onMouseLeave={() => setAccountDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-72 bg-[#12161E] border border-white/15 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] overflow-hidden z-[110] p-3 text-xs"
                  >
                    {/* 1. ADMIN DROPDOWN VIEW */}
                    {user.role === 'admin' && (
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
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <LayoutDashboard size={16} className="text-[#FF1E27] group-hover:scale-110 transition-transform" />
                            <span>Admin Command Center</span>
                          </button>

                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <Globe size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span>Landing Pages (CMS)</span>
                          </button>

                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <UserCheck size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>Customer Management</span>
                          </button>

                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <Dumbbell size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                            <span>Trainer Management</span>
                          </button>

                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <UserCog size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Receptionist Staff</span>
                          </button>

                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <ShieldCheck size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            <span>Membership Plans</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-white/10 mt-1">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#B91C1C] text-white font-bold text-xs flex items-center justify-between hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,30,39,0.4)]"
                          >
                            <span>Launch Admin Portal</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* 2. RECEPTIONIST DROPDOWN VIEW */}
                    {user.role === 'receptionist' && (
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
                            onClick={() => { setAccountDropdownOpen(false); navigate('/receptionist'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <UserCog size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Receptionist Dashboard</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-white/10 mt-1">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/receptionist'); }}
                            className="w-full py-2 px-3 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center justify-between hover:bg-amber-400 transition-all cursor-pointer"
                          >
                            <span>Open Front Desk</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* 3. TRAINER DROPDOWN VIEW */}
                    {user.role === 'trainer' && (
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
                            onClick={() => { setAccountDropdownOpen(false); navigate('/trainer'); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <Dumbbell size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                            <span>Trainer Dashboard & Schedule</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-white/10 mt-1">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/trainer'); }}
                            className="w-full py-2 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-between hover:bg-purple-500 transition-all cursor-pointer"
                          >
                            <span>Open Trainer Hub</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* 4. CUSTOMER / MEMBER DROPDOWN VIEW */}
                    {user.role !== 'admin' && user.role !== 'receptionist' && user.role !== 'trainer' && (
                      <>
                        <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                          <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                            Athlete Account
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/40 text-[9px] font-mono font-bold">
                            MEMBER
                          </span>
                        </div>

                        <div className="py-1.5 space-y-0.5 max-h-80 overflow-y-auto no-scrollbar">
                          <button
                            onClick={() => handleOpenAccountTab('personal')}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <User size={16} className="text-[#FF2E4C] group-hover:scale-110 transition-transform" />
                            <span>Personal Information</span>
                          </button>

                          <button
                            onClick={() => handleOpenAccountTab('membership')}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <Crown size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                              <span>Membership Details</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">PRO</span>
                          </button>

                          <button
                            onClick={() => handleOpenAccountTab('trainers')}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <Users size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                            <span>Trainers</span>
                          </button>

                          <button
                            onClick={() => handleOpenAccountTab('payments')}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <CreditCard size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>Payments</span>
                          </button>

                          <button
                            onClick={() => handleOpenAccountTab('workout-diet')}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <Dumbbell size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span>Workout & Diet Plan</span>
                          </button>

                          <button
                            onClick={() => handleOpenAccountTab('feedback')}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-medium transition-colors text-left cursor-pointer group"
                          >
                            <MessageSquare size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            <span>Feedback & Support</span>
                          </button>
                        </div>
                      </>
                    )}

                    {/* Logout Footer */}
                    <div className="pt-2 border-t border-white/10 mt-1">
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-[#FF2E4C] hover:bg-[#FF2E4C]/10 font-semibold transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* TRADITIONAL HORIZONTAL LOGIN BUTTON */
            <button
              onClick={handleLoginClick}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2B35] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_25px_rgba(229,9,20,0.8)] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Login</span>
              <ArrowRight size={14} />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

export default SpotlightNavbar;
