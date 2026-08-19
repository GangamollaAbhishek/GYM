import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/preloader';
import SpotlightNavbar from './components/SpotlightNavbar';
import Hero from './components/hero';
import CylinderSection from './components/CylinderSection';
import ExploreEscape from './components/explore-escape';

import PopularDestinations from './components/popular-destinations';
import LetsDrive from './components/lets-drive';
import AdventuresGallery from './components/adventures-gallery';
import ParallaxGallery from './components/parallax-gallery';
import WhyChoose from './components/why-choose';
import PopularSpots from './components/popular-spots';
import ConstellationTestimonials from './components/constellation-testimonials';
import TravelNetwork from './components/travel-network';
import Footer from './components/footer';

import { X, Shield, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lenisInstance, setLenisInstance] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  // Multi-layer Parallax Scroll for Landing Page & Next Section
  useEffect(() => {
    function parallax() {
      const layers = document.querySelectorAll('.layer');
      const y = window.scrollY;
      for (let i = 1; i < layers.length; i++) {
        if (layers[layers.length - i]) {
          layers[layers.length - i].style.transform = `translateY(${(i * 0.1) * y}px)`;
        }
      }
    }

    window.addEventListener('scroll', parallax, false);
    return () => {
      window.removeEventListener('scroll', parallax, false);
    };
  }, []);


  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleScrollToTop = () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReserveSpot = (zoneName) => {
    const msg = `Spot Reserved: "${zoneName}". QR Pass ready in app!`;
    triggerToast(msg);
    setModalMessage(msg);
    setPassModalOpen(true);
  };

  const handleBookCoach = (coachName) => {
    const msg = `Session Requested: ${coachName}. Manager will call to confirm.`;
    triggerToast(msg);
    setModalMessage(msg);
    setPassModalOpen(true);
  };

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Programs", href: "#programs-section" },
    { label: "Zones", href: "#popular-destinations" },
    { label: "Equipment", href: "#smart-equipment" },
    { label: "Transformations", href: "#testimonials-section" },
    { label: "Locations", href: "#locations-section" },
  ];

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white relative font-sans selection:bg-[#E50914] selection:text-white">
      
      {/* 0. Curtain LightLines Preloader (Runs once on startup) */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Main App Layout */}
      {!loading && (
        <>
          {/* Full-width Spotlight Header Navbar fixed at top */}
          <SpotlightNavbar 
            items={navItems} 
            onJoinClick={() => {
              setModalMessage("Claim your complimentary All-Access Pass with biometric scanner access!");
              setPassModalOpen(true);
            }}
            onLoginClick={() => {
              setModalMessage("Enter your member credentials to access 3D Gym Telemetry.");
              setPassModalOpen(true);
            }}
          />


          {/* Cinematic Hero Section */}
          <Hero 
            onJoinClick={() => {
              setModalMessage("Claim your complimentary All-Access Pass with biometric scanner access!");
              setPassModalOpen(true);
            }}
            onSearchSubmit={(query) => {
              const msg = `Pass Search: "${query.goal}" scheduled for ${query.date}.`;
              triggerToast(msg);
              setModalMessage(msg);
              setPassModalOpen(true);
            }} 
          />

          {/* B2. 3D 360° Cylinder Carousel Arena Section */}
          <CylinderSection />

          {/* C. "Explore Programs" Bento Grid */}
          <ExploreEscape />


          {/* D. Signature Workout Zones Sticky Horizontal Scroll */}
          <PopularDestinations onReserveSpot={handleReserveSpot} />

          {/* E. 3D Smart Gym Equipment Engine */}
          <LetsDrive />

          {/* F. Action Reels & Highlights Gallery */}
          <AdventuresGallery />

          {/* G. Multi-Column Velocity Parallax Gallery */}
          <ParallaxGallery onClaimTrial={() => {
            triggerToast("7-Day Free Trial Pass Claimed!");
            setModalMessage("Your 7-Day All-Access Pass is active! Present code TITAN-7DAY at entrance.");
            setPassModalOpen(true);
          }} />

          {/* H. "Why We Dominate" Bento Matrix */}
          <WhyChoose />

          {/* Locations & Coaches Spotlight */}
          <PopularSpots onBookCoach={handleBookCoach} />

          {/* I. Transformation Constellation Canvas */}
          <ConstellationTestimonials />

          {/* J. Live Gym Network & Check-In Map */}
          <TravelNetwork />

          {/* K. Kinetic Typography Footer */}
          <Footer onScrollToTop={handleScrollToTop} />
        </>
      )}

      {/* Floating Toast Notification System */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] px-5 py-3.5 rounded-2xl bg-[#12161A] border border-[#FF2E4C] text-white text-xs font-mono shadow-[0_0_25px_rgba(255,46,76,0.4)] animate-bounce flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF2E4C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIP Pass Modal */}
      {passModalOpen && (
        <div className="fixed inset-0 z-[110] bg-[#090C0E]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#12161A] rounded-3xl border border-[#FF2E4C]/50 p-8 shadow-2xl animate-fadeIn text-center">
            
            <button 
              onClick={() => setPassModalOpen(false)}
              className="absolute top-4 right-4 text-[#8A94A0] hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/40 flex items-center justify-center text-[#FF2E4C] mx-auto mb-4">
              <Shield size={32} />
            </div>

            <h3 className="text-2xl font-extrabold font-heading text-white mb-2">TITAN PULSE 3D PASS</h3>
            
            <p className="text-xs text-[#8A94A0] mb-6">
              {modalMessage || "Claim your complimentary All-Access Pass with biometric scanner access!"}
            </p>

            <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 text-xs font-mono text-[#FF2E4C] mb-6 flex items-center justify-center gap-2">
              <Sparkles size={16} /> PASS CODE: TITAN-2026-CRIMSON
            </div>

            <button 
              onClick={() => setPassModalOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,46,76,0.4)] transition-all"
            >
              Confirm & Download Pass
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
