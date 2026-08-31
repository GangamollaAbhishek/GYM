import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { animate, motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Menu,
  X,
  ArrowRight,
  User,
  Crown,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Apple,
  Users,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { cn } from "../lib/utils";
import CreepyButton from "./CreepyButton";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import { useCart } from "../context/CartContext";


export function SpotlightNavbar({
  items = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#why-choose" },
    { label: "Programs", href: "#programs-section" },
    { label: "Zones", href: "#popular-destinations" },
    { label: "Equipment", href: "#smart-equipment" },
    { label: "Transformations", href: "#testimonials-section" },
    { label: "Locations", href: "#locations-section" },
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
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flipkart-style Account Dropdown state
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

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
    setMobileMenuOpen(false);
    navigate(`/account?tab=${tabId}`);
  };

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item, index) => {
    setActiveIndex(index);
    setMobileMenuOpen(false);
    if (onItemClick) onItemClick(item, index);

    if (item.href && item.href.startsWith("#")) {
      if (item.href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetElem = document.querySelector(item.href);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* 1. LEFT SIDE: BRAND LOGO + NAME */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="logo-truus flex items-center gap-3 group focus:outline-none cursor-pointer"
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

          {/* 2. CENTER: NAVIGATION MENU (DESKTOP) */}
          <nav
            ref={navRef}
            className="hidden lg:flex relative items-center h-12 rounded-full border border-white/10 bg-[#151515]/70 px-2 overflow-hidden"
          >
            <ul className="relative flex items-center h-full gap-1 z-[10]">
              {items.map((item, idx) => (
                <li key={idx} className="relative h-full flex items-center justify-center">
                  <a
                    href={item.href}
                    data-index={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item, idx);
                    }}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 rounded-full font-sans relative",
                      activeIndex === idx
                        ? "text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    )}
                  >
                    {item.label}
                    {activeIndex === idx && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] shadow-[0_0_10px_#E50914]"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mouse Spotlight */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
              style={{
                opacity: hoverX !== null ? 1 : 0,
                background: `
                  radial-gradient(
                    100px circle at var(--spotlight-x) 100%, 
                    rgba(229,9,20,0.28) 0%, 
                    transparent 70%
                  )
                `,
              }}
            />

            {/* Active Ambience Bar */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
              style={{
                background: `
                  radial-gradient(
                    50px circle at var(--ambience-x) 0%, 
                    rgba(229,9,20,1) 0%, 
                    transparent 100%
                  )
                `,
              }}
            />
          </nav>

          {/* 3. RIGHT SIDE: FLIPKART-STYLE USER ACTIONS */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Flipkart-style User Pill Button */}
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center gap-2.5 bg-[#151515] hover:bg-[#1f1f26] border border-white/10 hover:border-white/25 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF2E4C] text-white font-extrabold text-xs flex items-center justify-center uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  {accountDropdownOpen ? (
                    <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                  )}
                </button>

                {/* Flipkart-style Account Dropdown Floating Card */}
                <AnimatePresence>
                  {accountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onMouseLeave={() => setAccountDropdownOpen(false)}
                      className="absolute right-0 top-full mt-2 w-72 bg-[#12161E] border border-white/15 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] p-3 text-xs"
                    >
                      {/* Header */}
                      <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                        <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                          Your Account
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/40 text-[9px] font-mono font-bold">
                          {user.role ? user.role.toUpperCase() : 'MEMBER'}
                        </span>
                      </div>

                      {/* Dropdown Menu Items - Exactly 6 Main Sections */}
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

                      {/* Staff Portals if applicable */}
                      {user.role === 'admin' && (
                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/admin'); }}
                            className="w-full py-2 px-3 rounded-xl bg-[#FF2E4C]/20 border border-[#FF2E4C]/30 text-[#FF2E4C] font-bold text-xs flex items-center justify-between hover:bg-[#FF2E4C] hover:text-white transition-all cursor-pointer"
                          >
                            <span>Open Admin Portal</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                      {user.role === 'receptionist' && (
                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/receptionist'); }}
                            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-between hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                          >
                            <span>Open Front Desk</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                      {user.role === 'trainer' && (
                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={() => { setAccountDropdownOpen(false); navigate('/trainer'); }}
                            className="w-full py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold text-xs flex items-center justify-between hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                          >
                            <span>Open Trainer Hub</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
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
              <button
                onClick={() => {
                  navigate('/login');
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2B35] text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:brightness-110 transition-all cursor-pointer"
              >
                Login
              </button>
            )}

            {/* CART BUTTON WITH BADGE */}
            <Link
              to="/cart"
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
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl bg-[#151515] border border-white/10 text-white hover:text-[#E50914] transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 py-0.5 min-w-[16px] h-[16px] rounded-full bg-[#FF1E27] text-white text-[9px] font-black font-mono flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#151515] border border-white/10 text-white hover:text-[#E50914] transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* MOBILE DRAWER MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#151515] border-b border-white/10 px-6 py-6 flex flex-col gap-4 overflow-hidden"
            >
              <ul className="flex flex-col gap-2">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick(item, idx);
                      }}
                      className={cn(
                        "block py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
                        activeIndex === idx ? "text-[#E50914] font-bold" : "text-neutral-300 hover:text-white"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-xs font-bold text-white">Signed in as {user.name}</span>
                      <button onClick={onLogout} className="text-xs font-bold text-[#FF2E4C]">Logout</button>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pt-2">
                      <button
                        onClick={() => handleOpenAccountTab('personal')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <User size={14} className="text-[#FF2E4C]" /> Personal Information
                      </button>
                      <button
                        onClick={() => handleOpenAccountTab('membership')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <Crown size={14} className="text-amber-400" /> Membership Details
                      </button>
                      <button
                        onClick={() => handleOpenAccountTab('trainers')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <Users size={14} className="text-purple-400" /> Trainers
                      </button>
                      <button
                        onClick={() => handleOpenAccountTab('payments')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <CreditCard size={14} className="text-emerald-400" /> Payments
                      </button>
                      <button
                        onClick={() => handleOpenAccountTab('workout-diet')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <Dumbbell size={14} className="text-cyan-400" /> Workout & Diet Plan
                      </button>
                      <button
                        onClick={() => handleOpenAccountTab('feedback')}
                        className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 text-xs font-semibold text-left flex items-center gap-2.5"
                      >
                        <MessageSquare size={14} className="text-blue-400" /> Feedback & Support
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#E50914] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default SpotlightNavbar;
