import React, { useState, useRef } from 'react';
import { Dumbbell, Shield, ChevronRight, Menu, X } from 'lucide-react';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';

// Magnetic Button Helper Component
function MagneticButton({ children, onClick, className }) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </button>
  );
}

export default function Navbar({ onOpenPassModal }) {
  const { cmsData } = useLandingPageCMS();
  const brandData = cmsData?.brand || {};

  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Zones', href: '#zones' },
    { name: 'Equipment', href: '#equipment' },
    { name: 'Transformations', href: '#transformations' },
    { name: 'Locations', href: '#locations' },
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl">
      <nav className="relative flex items-center justify-between px-6 py-3.5 rounded-full bg-[#151515]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#E50914]/40">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          {brandData.logo ? (
            <div className="w-10 h-10 rounded-full bg-[#0B0B0B] border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform duration-300">
              <img src={brandData.logo} alt={brandData.name || 'Logo'} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF2B35] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0B0B] rounded-full flex items-center justify-center group-hover:scale-95 transition-transform">
                <Dumbbell className="w-5 h-5 text-[#E50914] group-hover:rotate-45 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E50914] rounded-full animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E50914] rounded-full" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-wider text-white flex items-center gap-1">
              {brandData.name || 'TITAN•PULSE'}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#A0A0A0] -mt-1">
              {brandData.subname || 'HIGH-PERFORMANCE SYSTEM'}
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href}
                className="relative text-xs font-bold font-mono tracking-wider uppercase text-[#A0A0A0] hover:text-white transition-colors py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E50914] group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Magnetic CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <MagneticButton
            onClick={onOpenPassModal}
            className="px-6 py-2.5 rounded-full bg-[#E50914] hover:bg-[#FF2B35] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(229,9,20,0.5)] transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-white" />
            Free Trial Pass
            <ChevronRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>


        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#8A94A0] hover:text-white p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 p-6 rounded-2xl bg-[#12161A]/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-slate-200 hover:text-[#FF2E4C] transition-colors py-2 border-b border-white/10"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setMobileOpen(false); if (onOpenPassModal) onOpenPassModal(); }}
            className="w-full mt-2 py-3 rounded-xl bg-[#FF2E4C] hover:bg-[#FF526B] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
          >
            Free Trial Pass
          </button>
        </div>
      )}
    </header>
  );
}
