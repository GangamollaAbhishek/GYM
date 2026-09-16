import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Trophy, ArrowUp, MapPin, Mail, Phone, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

export default function PamsFooter({ onScrollToTop, user }) {
  const navigate = useNavigate();

  const handleGymNavigate = () => {
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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      } else {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[#050709] border-t border-white/[0.07] text-neutral-400 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & navigation columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2E4C] via-[#FF526B] to-[#00F0FF] p-[1.5px] shadow-[0_0_20px_rgba(255,46,76,0.35)]">
                <div className="w-full h-full bg-[#07090C] rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-black text-xl text-white">P</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black tracking-wider text-xl text-white">
                  PAMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
                  FITNESS & SPORTS
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-light">
              PAMS is India's next-generation unified fitness and sports ecosystem.
              Uniting Olympic-grade strength gyms, mind-body studios, and international-standard
              sports arenas into one seamless athletic experience.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-[#FF2E4C] hover:text-white flex items-center justify-center text-neutral-400 transition-all duration-200">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-[#FF2E4C] hover:text-white flex items-center justify-center text-neutral-400 transition-all duration-200">
                <Youtube size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-[#00F0FF] hover:text-black flex items-center justify-center text-neutral-400 transition-all duration-200">
                <Facebook size={15} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-[#00F0FF] hover:text-black flex items-center justify-center text-neutral-400 transition-all duration-200">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Col 3: Fitness */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              Fitness
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button onClick={handleGymNavigate} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>Gym & Hypertrophy</span>
                  <span className="text-[9px] bg-[#FF2E4C]/20 text-[#FF2E4C] font-semibold px-1.5 py-0.5 rounded">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("fitness-section")} className="hover:text-white transition-colors cursor-pointer">
                  Yoga & Mindful Flow
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("fitness-section")} className="hover:text-white transition-colors cursor-pointer">
                  Zumba Dance Cardio
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("featured-activities")} className="hover:text-white transition-colors cursor-pointer">
                  Group Class Schedule
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("coaches-section")} className="hover:text-white transition-colors cursor-pointer">
                  Strength Coaches
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Sports */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              Sports
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button onClick={() => scrollTo("sports-section")} className="hover:text-white transition-colors cursor-pointer">
                  Basketball Hardwood
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("sports-section")} className="hover:text-white transition-colors cursor-pointer">
                  Badminton Courts
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("sports-section")} className="hover:text-white transition-colors cursor-pointer">
                  Semi-Olympic Pool
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("book-session-section")} className="hover:text-white transition-colors cursor-pointer">
                  Court Slot Reservations
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("coaches-section")} className="hover:text-white transition-colors cursor-pointer">
                  Sports Mentors
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Platform & Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Supplements & Merch
                </Link>
              </li>
              <li>
                <button onClick={() => scrollTo("memberships-section")} className="hover:text-white transition-colors cursor-pointer">
                  Membership Passes
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("why-pams")} className="hover:text-white transition-colors cursor-pointer">
                  About PAMS
                </button>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with back-to-top */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} PAMS Fitness & Sports. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Safety Guidelines</span>
            <button
              onClick={onScrollToTop}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer pl-4 border-l border-white/10"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
