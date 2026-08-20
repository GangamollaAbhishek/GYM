import React, { useEffect, useRef, useState } from "react";
import { animate, motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import CreepyButton from "./CreepyButton";


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
  defaultActiveIndex = 0,
}) {
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform duration-300">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl sm:text-3xl text-white tracking-wider leading-none">
              TITAN<span className="text-[#E50914]">•</span>PULSE
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A0A0A0] font-mono leading-tight">
              3D FITNESS SYSTEM
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

        {/* 3. RIGHT SIDE: ACTIONS */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-white transition-colors px-3 py-2"
          >
            Login
          </button>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-[#151515] border border-white/10 text-white hover:text-[#E50914] transition-colors"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

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

            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLoginClick) onLoginClick();
                }}
                className="w-full py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SpotlightNavbar;
