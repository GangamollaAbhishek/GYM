import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/preloader';
import SpotlightNavbar from './components/SpotlightNavbar';
import Hero from './components/hero';
import TransitionScribble from './components/TransitionScribble';
import HorizontalWords from './components/HorizontalWords';
import KineticFlythroughGrid from './components/KineticFlythroughGrid';
import LineByLineShowcase from './components/LineByLineShowcase';
import ExpandingFrameSection from './components/ExpandingFrameSection';
import PreworkoutShowcaseSection from './components/PreworkoutShowcaseSection';
import CylinderSection from './components/CylinderSection';
import ExploreEscape from './components/explore-escape';
import ServicesSection from './components/ServicesSection';

import PopularDestinations from './components/popular-destinations';
import LetsDrive from './components/lets-drive';
import ParallaxGallery from './components/parallax-gallery';
import WhyChoose from './components/why-choose';
import PopularSpots from './components/popular-spots';
import ConstellationTestimonials from './components/constellation-testimonials';
import TravelNetwork from './components/travel-network';
import TrainerCardDeck from './components/TrainerCardDeck';
import DepthParallaxShowcase from './components/DepthParallaxShowcase';
import ParallaxFeatureZoom from './components/ParallaxFeatureZoom';
import Footer from './components/footer';
import AuthPage from './components/AuthPage';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ForbiddenPage from './components/ForbiddenPage';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import MyCartPage from './components/MyCartPage';
import ToastNotificationStack from './components/ToastNotificationStack';

import { X, Shield, Sparkles, Home, Flame, Zap, Users, Crown, Globe, MapPin } from 'lucide-react';
import { LandingPageCMSProvider } from './context/LandingPageCMSContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

gsap.registerPlugin(ScrollTrigger);

function MainAppContent() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('has_preloaded');
  });
  const [lenisInstance, setLenisInstance] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [toasts, setToasts] = useState([]);

  const triggerToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    const isSuccess = typeof msg === 'string' && (msg.includes('Welcome') || msg.includes('success') || msg.includes('Confirmed') || msg.includes('✓'));
    const newToast = {
      id,
      message: msg,
      type: isSuccess ? 'success' : type,
      time: 'Just now'
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in'); // 'sign-in' | 'sign-up'

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (location.pathname !== '/') {
      setAuthModalOpen(false);
    }
  }, [location.pathname]);

  const handleScrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReserveSpot = (zoneName) => {
    if (user) {
      const role = (user.role || '').toLowerCase().trim();
      if (role === 'admin') navigate('/admin');
      else if (role === 'receptionist') navigate('/receptionist');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/account?tab=personal&sub=profile');
      return;
    }
    navigate('/login');
  };

  const handleBookCoach = (coachName) => {
    if (user) {
      const role = (user.role || '').toLowerCase().trim();
      if (role === 'admin') navigate('/admin');
      else if (role === 'receptionist') navigate('/receptionist');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/account?tab=trainers&sub=book');
      return;
    }
    navigate('/login');
  };

  const handleAuthSuccess = (userData, mode) => {
    triggerToast(mode === 'sign-up' ? `Welcome to TITAN PULSE, ${userData.name}!` : `Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    logout();
    triggerToast('Logged out successfully.');
    navigate('/');
  };

  const openSignInModal = () => {
    if (user) {
      const role = (user.role || '').toLowerCase().trim();
      if (role === 'admin') navigate('/admin');
      else if (role === 'receptionist') navigate('/receptionist');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/account?tab=personal&sub=profile');
      return;
    }
    setAuthMode('sign-in');
    setAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    if (user) {
      const role = (user.role || '').toLowerCase().trim();
      if (role === 'admin') navigate('/admin');
      else if (role === 'receptionist') navigate('/receptionist');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/account?tab=personal&sub=profile');
      return;
    }
    setAuthMode('sign-up');
    setAuthModalOpen(true);
  };

  const navItems = [
    { label: "Home", href: "#", icon: Home, i: "#E50914", j: "#FF2E4C" },
    { label: "Programs", href: "#explore-escape", icon: Flame, i: "#E50914", j: "#FF2E4C" },
    { label: "Supplements", href: "#preworkout-showcase", icon: Zap, i: "#E50914", j: "#FF2E4C" },
    { label: "Trainers", href: "#trainers-deck", icon: Users, i: "#E50914", j: "#FF2E4C" },
    { label: "Memberships", href: "#services-section", icon: Crown, i: "#E50914", j: "#FF2E4C" },
    { label: "Locations", href: "#locations", icon: MapPin, i: "#E50914", j: "#FF2E4C" },
  ];

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white relative font-sans selection:bg-[#E50914] selection:text-white">
      {/* Global Lenis Smooth Scroll & Route ScrollToTop */}
      <SmoothScroll />
      <ScrollToTop />

      {/* 0. Curtain LightLines Preloader (Runs once on startup) */}
      {loading && (
        <Preloader
          onComplete={() => {
            sessionStorage.setItem('has_preloaded', 'true');
            setLoading(false);
          }}
        />
      )}

      {/* Main App Layout */}
      {!loading && (
        <Routes>
          {/* LANDING PAGE ROUTE */}
          <Route 
            path="/" 
            element={
              <>
                {/* GSAP Transition Scribble Reveal Effect */}
                <TransitionScribble />

                {/* Full-width Spotlight Header Navbar */}
                <SpotlightNavbar 
                  items={navItems} 
                  user={user}
                  onLogout={handleLogout}
                  onJoinClick={openSignUpModal}
                  onLoginClick={openSignInModal}
                />

                {/* Cinematic Hero Section */}
                <Hero 
                  onJoinClick={openSignUpModal}
                  onSearchSubmit={(query) => {
                    const msg = `Pass Search: "${query.goal}" scheduled for ${query.date}.`;
                    triggerToast(msg);
                    setModalMessage(msg);
                    setPassModalOpen(true);
                  }} 
                />

                {/* Kinetic Horizontal Pinning Words Section */}
                <HorizontalWords />

                {/* 3D Perspective Scroll Fly-Through Grid Showcase */}
                <KineticFlythroughGrid />

                {/* Section 3: "Explore Programs" Bento Grid */}
                <ExploreEscape onReserveSpot={handleReserveSpot} />

                {/* Section 4: Interactive 3D Pre-Workout Can Player Product Showcase */}
                <PreworkoutShowcaseSection onReserveSpot={handleReserveSpot} />

                {/* 3D 360° Cylinder Carousel Arena Section */}
                <CylinderSection />

                {/* Master Trainers 3D Stacked Card Faculty */}
                <TrainerCardDeck />

                {/* 8th Section: 3D Interactive Services & Membership Showcase */}
                <ServicesSection 
                  id="services-section"
                  onClaimPass={handleReserveSpot}
                  onBookPT={handleBookCoach}
                />

                {/* Apple-style SmoothUI Line-by-Line Architectural Reveal */}
                <LineByLineShowcase />

                {/* Parallax Zoom-Out & Blur Feature Showcase */}
                <ParallaxFeatureZoom />

                {/* Signature Workout Zones Sticky Horizontal Scroll */}
                <PopularDestinations onReserveSpot={handleReserveSpot} />

                {/* "Why We Dominate" 3D Stacking Cards Deck */}
                <WhyChoose />

                {/* Locations & Coaches Spotlight */}
                <PopularSpots onBookCoach={handleBookCoach} />

                {/* Transformation Constellation Canvas */}
                <ConstellationTestimonials />

                {/* Live Gym Network & Check-In Map */}
                <TravelNetwork />

                {/* Kinetic Typography Footer */}
                <Footer onScrollToTop={handleScrollToTop} />
              </>
            } 
          />

          {/* MY CART & CHECKOUT PAGE ROUTES (REQUIRES LOGIN) */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'CUSTOMER', 'admin', 'ADMIN', 'trainer', 'TRAINER', 'receptionist', 'RECEPTIONIST']}>
                <SpotlightNavbar user={user} onLogout={handleLogout} />
                <MyCartPage />
                <Footer onScrollToTop={handleScrollToTop} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-cart" 
            element={<Navigate to="/cart" replace />} 
          />

          {/* DEDICATED LOGIN & SIGN UP PAGE ROUTES */}
          <Route 
            path="/login" 
            element={<AuthPage onAuthSuccess={handleAuthSuccess} />} 
          />
          <Route 
            path="/signup" 
            element={<AuthPage onAuthSuccess={handleAuthSuccess} />} 
          />
          <Route 
            path="/register" 
            element={<AuthPage onAuthSuccess={handleAuthSuccess} />} 
          />

          {/* 403 FORBIDDEN ERROR ROUTE */}
          <Route 
            path="/forbidden" 
            element={<ForbiddenPage />} 
          />

          {/* PROTECTED DEDICATED ROLE-BASED DASHBOARD ROUTES */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'ADMIN']}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receptionist" 
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'RECEPTIONIST', 'admin', 'ADMIN']}>
                <ReceptionistDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer" 
            element={
              <ProtectedRoute allowedRoles={['trainer', 'TRAINER', 'admin', 'ADMIN']}>
                <TrainerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'CUSTOMER', 'admin', 'ADMIN', 'trainer', 'TRAINER', 'receptionist', 'RECEPTIONIST']}>
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'CUSTOMER', 'admin', 'ADMIN', 'trainer', 'TRAINER', 'receptionist', 'RECEPTIONIST']}>
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer-portal" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'CUSTOMER', 'admin', 'ADMIN', 'trainer', 'TRAINER', 'receptionist', 'RECEPTIONIST']}>
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {/* Floating AnimatedList Toast Notification System */}
      <ToastNotificationStack notifications={toasts} onDismiss={dismissToast} position="top-right" />

      {/* Instant Backdrop Auth Modal Overlay (Sign In & Sign Up) */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

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

export default function App() {
  return (
    <LandingPageCMSProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </LandingPageCMSProvider>
  );
}
