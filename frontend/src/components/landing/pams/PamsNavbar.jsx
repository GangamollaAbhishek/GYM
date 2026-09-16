import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Sparkles,
  Flame,
  Activity,
  Trophy,
  Waves,
  ChevronDown,
  Menu,
  X,
  Calendar,
  ArrowRight,
  Compass,
  CheckCircle2,
} from "lucide-react";
import ProfileDropdown from "../../auth/ProfileDropdown";

export default function PamsNavbar({
  user,
  onLogout,
  onJoinClick,
  onLoginClick,
  onBookClick,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [fitnessOpen, setFitnessOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fitnessTimeout = useRef(null);
  const sportsTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setFitnessOpen(false);
    setSportsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      if (window.__lenis) {
        window.__lenis.scrollTo(element, { offset: -80, duration: 1.2 });
      } else {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const handleGymNavigate = () => {
    setMobileMenuOpen(false);
    setFitnessOpen(false);
    // Preserves existing Gym entry points
    if (user) {
      const role = (user.role || "").toLowerCase().trim();
      if (role === "super_admin") navigate("/super-admin");
      else if (role === "admin") navigate("/admin");
      else if (role === "receptionist") navigate("/receptionist");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/account");
    } else {
      navigate("/account");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07090C]/90 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.7)] py-3"
          : "bg-gradient-to-b from-[#07090C]/90 via-[#07090C]/40 to-transparent py-4.5 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="group flex items-center gap-3 select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2E4C] via-[#FF526B] to-[#00F0FF] p-[1.5px] shadow-[0_0_20px_rgba(255,46,76,0.35)] group-hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] transition-all duration-300">
            <div className="w-full h-full bg-[#090C0E] rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF2E4C]">
                P
              </span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-black tracking-wider text-xl text-white group-hover:text-[#FF2E4C] transition-colors">
              PAMS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              FITNESS & SPORTS
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* FITNESS MEGA DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(fitnessTimeout.current);
              setFitnessOpen(true);
            }}
            onMouseLeave={() => {
              fitnessTimeout.current = setTimeout(() => setFitnessOpen(false), 200);
            }}
          >
            <button
              onClick={() => scrollToSection("fitness-section")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                fitnessOpen
                  ? "text-white bg-white/[0.08]"
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Fitness</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  fitnessOpen ? "rotate-180 text-[#FF2E4C]" : "text-neutral-500"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {fitnessOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2.5 rounded-2xl bg-[#12161A]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2E4C]/90">
                  Fitness Disciplines
                </div>
                <div className="space-y-1">
                  <button
                    onClick={handleGymNavigate}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C] group-hover:scale-110 transition-transform">
                      <Dumbbell size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2E4C] transition-colors flex items-center gap-1.5">
                        Gym & Strength
                        <span className="text-[9px] bg-[#FF2E4C]/20 text-[#FF2E4C] font-semibold px-1.5 py-0.5 rounded">
                          Live
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        Weights, conditioning & open floor
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection("fitness-section")}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                        Yoga & Mobility
                      </div>
                      <div className="text-xs text-neutral-400">
                        Balance, breathwork & mindful flow
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection("fitness-section")}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Flame size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                        Zumba & Cardio
                      </div>
                      <div className="text-xs text-neutral-400">
                        High-energy dance cardio workouts
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SPORTS MEGA DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(sportsTimeout.current);
              setSportsOpen(true);
            }}
            onMouseLeave={() => {
              sportsTimeout.current = setTimeout(() => setSportsOpen(false), 200);
            }}
          >
            <button
              onClick={() => scrollToSection("sports-section")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                sportsOpen
                  ? "text-white bg-white/[0.08]"
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Sports</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  sportsOpen ? "rotate-180 text-[#00F0FF]" : "text-neutral-500"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {sportsOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2.5 rounded-2xl bg-[#12161A]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00F0FF]/90">
                  Sports Arenas
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => scrollToSection("sports-section")}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        Basketball
                      </div>
                      <div className="text-xs text-neutral-400">
                        FIBA regulation indoor courts
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection("sports-section")}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Badminton
                      </div>
                      <div className="text-xs text-neutral-400">
                        BWF standard wooden synthetic courts
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection("sports-section")}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                      <Waves size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                        Swimming
                      </div>
                      <div className="text-xs text-neutral-400">
                        Olympic-grade temperature controlled pools
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* GYM DIRECT LINK (Points to existing Gym functionality) */}
          <button
            onClick={handleGymNavigate}
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Gym</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] animate-pulse"></span>
          </button>

          {/* CLASSES */}
          <button
            onClick={() => scrollToSection("featured-activities")}
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Classes
          </button>

          {/* TRAINERS */}
          <button
            onClick={() => scrollToSection("coaches-section")}
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Trainers
          </button>

          {/* MEMBERSHIP */}
          <button
            onClick={() => scrollToSection("memberships-section")}
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Passes
          </button>

          {/* ABOUT */}
          <button
            onClick={() => scrollToSection("why-pams")}
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Why PAMS
          </button>
        </nav>

        {/* RIGHT ACTION BUTTONS & AUTH */}
        <div className="flex items-center gap-3">
          {/* BOOK SESSION QUICK CTA */}
          <button
            onClick={() => {
              if (onBookClick) onBookClick();
              else scrollToSection("book-session-section");
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2E4C] hover:bg-[#FF526B] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(255,46,76,0.35)] hover:shadow-[0_0_25px_rgba(255,46,76,0.5)] cursor-pointer"
          >
            <Calendar size={13} />
            <span>Book Session</span>
          </button>

          {/* EXISTING USER AUTH / PROFILE DROPDOWN */}
          <div className="flex items-center">
            <ProfileDropdown onLogout={onLogout} />
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-4 p-5 rounded-3xl bg-[#12161A]/98 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF2E4C] mb-2 px-2">
                Fitness
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleGymNavigate}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-[#FF2E4C]/10 transition-colors"
                >
                  <Dumbbell size={18} className="mx-auto text-[#FF2E4C] mb-1" />
                  <span className="text-xs font-bold text-white block">Gym</span>
                </button>
                <button
                  onClick={() => scrollToSection("fitness-section")}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-[#00F0FF]/10 transition-colors"
                >
                  <Sparkles size={18} className="mx-auto text-[#00F0FF] mb-1" />
                  <span className="text-xs font-bold text-white block">Yoga</span>
                </button>
                <button
                  onClick={() => scrollToSection("fitness-section")}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-purple-500/10 transition-colors"
                >
                  <Flame size={18} className="mx-auto text-purple-400 mb-1" />
                  <span className="text-xs font-bold text-white block">Zumba</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00F0FF] mb-2 px-2">
                Sports
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => scrollToSection("sports-section")}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-amber-500/10 transition-colors"
                >
                  <Activity size={18} className="mx-auto text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-white block">Basketball</span>
                </button>
                <button
                  onClick={() => scrollToSection("sports-section")}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-emerald-500/10 transition-colors"
                >
                  <Trophy size={18} className="mx-auto text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-white block">Badminton</span>
                </button>
                <button
                  onClick={() => scrollToSection("sports-section")}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center hover:bg-[#00F0FF]/10 transition-colors"
                >
                  <Waves size={18} className="mx-auto text-[#00F0FF] mb-1" />
                  <span className="text-xs font-bold text-white block">Swimming</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("featured-activities")}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              >
                Featured Classes
              </button>
              <button
                onClick={() => scrollToSection("coaches-section")}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              >
                Coaches & Trainers
              </button>
              <button
                onClick={() => scrollToSection("memberships-section")}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              >
                Membership Passes
              </button>
              <button
                onClick={() => scrollToSection("why-pams")}
                className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04]"
              >
                Why PAMS
              </button>
              <button
                onClick={() => {
                  if (onBookClick) onBookClick();
                  else scrollToSection("book-session-section");
                }}
                className="w-full mt-2 py-3 rounded-xl bg-[#FF2E4C] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,76,0.35)]"
              >
                <Calendar size={16} />
                <span>Book a Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
