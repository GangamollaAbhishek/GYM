import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SmoothScroll from "./components/layout/SmoothScroll";
import Preloader from "./components/layout/preloader";
import SpotlightNavbar from "./components/layout/SpotlightNavbar";
import Hero from "./components/landing/sections/hero";
import TransitionScribble from "./components/landing/animations/TransitionScribble";
import HorizontalWords from "./components/landing/animations/HorizontalWords";
import KineticFlythroughGrid from "./components/landing/animations/KineticFlythroughGrid";
import LineByLineShowcase from "./components/landing/showcases/LineByLineShowcase";
import ExpandingFrameSection from "./components/landing/showcases/ExpandingFrameSection";
import PreworkoutShowcaseSection from "./components/landing/showcases/PreworkoutShowcaseSection";
import CylinderSection from "./components/landing/showcases/CylinderSection";
import ExploreEscape from "./components/landing/sections/explore-escape";
import ServicesSection from "./components/landing/sections/ServicesSection";

// PAMS Fitness & Sports Redesigned Landing Components
import PamsNavbar from "./components/landing/pams/PamsNavbar";
import PamsHero from "./components/landing/pams/PamsHero";
import PamsFitnessSportsSplit from "./components/landing/pams/PamsFitnessSportsSplit";
import PamsFitnessCategories from "./components/landing/pams/PamsFitnessCategories";
import PamsSportsCategories from "./components/landing/pams/PamsSportsCategories";
import PamsFeaturedActivities from "./components/landing/pams/PamsFeaturedActivities";
import PamsCoachesSection from "./components/landing/pams/PamsCoachesSection";
import PamsBookSession from "./components/landing/pams/PamsBookSession";
import PamsMemberships from "./components/landing/pams/PamsMemberships";
import PamsWhySection from "./components/landing/pams/PamsWhySection";
import PamsCommunity from "./components/landing/pams/PamsCommunity";
import PamsFinalCTA from "./components/landing/pams/PamsFinalCTA";
import PamsFooter from "./components/landing/pams/PamsFooter";
import PamsBookingModal from "./components/landing/pams/PamsBookingModal";

import PopularDestinations from "./components/landing/sections/popular-destinations";
import LetsDrive from "./components/landing/sections/lets-drive";
import ParallaxGallery from "./components/landing/sections/parallax-gallery";
import WhyChoose from "./components/landing/sections/why-choose";
import PopularSpots from "./components/landing/sections/popular-spots";
import ConstellationTestimonials from "./components/landing/sections/constellation-testimonials";
import TravelNetwork from "./components/landing/sections/travel-network";
import TrainerCardDeck from "./components/landing/sections/TrainerCardDeck";
import DepthParallaxShowcase from "./components/landing/showcases/DepthParallaxShowcase";
import ParallaxFeatureZoom from "./components/landing/showcases/ParallaxFeatureZoom";
import Footer from "./components/layout/footer";
import AuthPage from "./pages/AuthPage";
import AuthModal from "./components/auth/AuthModal";
import AdminDashboard from "./modules/fitness/gym/dashboards/admin/AdminDashboard";
import SuperAdminDashboard from "./modules/fitness/gym/dashboards/superadmin/SuperAdminDashboard";
import ReceptionistDashboard from "./modules/fitness/gym/dashboards/receptionist/ReceptionistDashboard";
import TrainerDashboard from "./modules/fitness/gym/dashboards/trainer/TrainerDashboard";
import CustomerDashboard from "./modules/fitness/gym/dashboards/customer/CustomerDashboard";
import ForbiddenPage from "./pages/ForbiddenPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";
import MyCartPage from "./pages/MyCartPage";
import ProductsPage from "./pages/ProductsPage";
import ToastNotificationStack from "./components/ui/ToastNotificationStack";

import {
  X,
  Shield,
  Sparkles,
  Home,
  Flame,
  Zap,
  Users,
  Crown,
  Globe,
  MapPin,
} from "lucide-react";
import { LandingPageCMSProvider } from "./context/LandingPageCMSContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

gsap.registerPlugin(ScrollTrigger);

function MainAppContent() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("has_preloaded");
  });
  const [lenisInstance, setLenisInstance] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [toasts, setToasts] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalActivity, setBookingModalActivity] = useState(null);

  const triggerToast = (msg, type = "info") => {
    const id = Date.now() + Math.random();
    const isSuccess =
      typeof msg === "string" &&
      (msg.includes("Welcome") ||
        msg.includes("success") ||
        msg.includes("Confirmed") ||
        msg.includes("Reserved") ||
        msg.includes("✓"));
    const newToast = {
      id,
      message: msg,
      type: isSuccess ? "success" : type,
      time: "Just now",
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openBookingModalWithActivity = (act) => {
    setBookingModalActivity(act || { name: "PAMS All-Access Session" });
    setBookingModalOpen(true);
  };

  // Auth Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("sign-in"); // 'sign-in' | 'sign-up'

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (location.pathname !== "/") {
      setAuthModalOpen(false);
    }
  }, [location.pathname]);

  const handleScrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReserveSpot = (zoneName) => {
    if (user) {
      const role = String(user.role || "").toUpperCase().trim();
      if (role === "SUPER_ADMIN") navigate("/super-admin");
      else if (role === "ADMIN") navigate("/admin");
      else if (role === "RECEPTIONIST") navigate("/receptionist");
      else if (role === "TRAINER") navigate("/trainer");
      else navigate("/account?tab=personal&sub=profile");
      return;
    }
    navigate("/login");
  };

  const handleBookCoach = (coachName) => {
    if (user) {
      const role = String(user.role || "").toUpperCase().trim();
      if (role === "SUPER_ADMIN") navigate("/super-admin");
      else if (role === "ADMIN") navigate("/admin");
      else if (role === "RECEPTIONIST") navigate("/receptionist");
      else if (role === "TRAINER") navigate("/trainer");
      else navigate("/account?tab=trainers&sub=book");
      return;
    }
    navigate("/login");
  };

  const handleAuthSuccess = (userData, mode) => {
    triggerToast(
      mode === "sign-up"
        ? `Welcome to PAMS, ${userData.name}!`
        : `Welcome back, ${userData.name}!`,
    );
  };

  const handleLogout = () => {
    logout();
    triggerToast("Logged out successfully.");
    navigate("/", { replace: true });
  };

  const openSignInModal = () => {
    if (user) {
      const role = String(user.role || "").toUpperCase().trim();
      if (role === "SUPER_ADMIN") navigate("/super-admin");
      else if (role === "ADMIN") navigate("/admin");
      else if (role === "RECEPTIONIST") navigate("/receptionist");
      else if (role === "TRAINER") navigate("/trainer");
      else navigate("/account?tab=personal&sub=profile");
      return;
    }
    setAuthMode("sign-in");
    setAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    if (user) {
      const role = String(user.role || "").toUpperCase().trim();
      if (role === "SUPER_ADMIN") navigate("/super-admin");
      else if (role === "ADMIN") navigate("/admin");
      else if (role === "RECEPTIONIST") navigate("/receptionist");
      else if (role === "TRAINER") navigate("/trainer");
      else navigate("/account?tab=personal&sub=profile");
      return;
    }
    setAuthMode("sign-up");
    setAuthModalOpen(true);
  };

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "Pricing", href: "#pricing" },
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
            sessionStorage.setItem("has_preloaded", "true");
            setLoading(false);
          }}
        />
      )}

      {/* Main App Layout */}
      {!loading && (
        <Routes>
          {/* REDESIGNED PAMS FITNESS & SPORTS LANDING PAGE */}
          <Route
            path="/"
            element={
              <>
                {/* 1. PAMS Sticky Modern Navbar with Fitness & Sports Megamenus */}
                <PamsNavbar
                  user={user}
                  onLogout={handleLogout}
                  onJoinClick={openSignUpModal}
                  onLoginClick={openSignInModal}
                  onBookClick={() => openBookingModalWithActivity({ name: "General Activity Session" })}
                />

                {/* 2. Hero Section */}
                <PamsHero
                  onExploreFitness={() => {
                    const el = document.getElementById("fitness-section");
                    if (el) {
                      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                      else el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onExploreSports={() => {
                    const el = document.getElementById("sports-section");
                    if (el) {
                      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                      else el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onBookSession={() => openBookingModalWithActivity({ name: "Custom Fitness or Sports Session" })}
                />

                {/* 3. Fitness vs Sports Major Split Section */}
                <PamsFitnessSportsSplit
                  onSelectFitness={() => {
                    const el = document.getElementById("fitness-section");
                    if (el) {
                      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                      else el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onSelectSports={() => {
                    const el = document.getElementById("sports-section");
                    if (el) {
                      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                      else el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />

                {/* 4. Fitness Categories (Gym - connected to existing module, Yoga, Zumba) */}
                <PamsFitnessCategories
                  user={user}
                  onBookActivity={(activity) => openBookingModalWithActivity({ title: `${activity} Session` })}
                />

                {/* 5. Sports Categories (Basketball, Badminton, Swimming) */}
                <PamsSportsCategories
                  onBookSport={(sport) => openBookingModalWithActivity({ title: `${sport} Arena Session` })}
                />

                {/* 6. Featured Activities Schedule */}
                <PamsFeaturedActivities
                  onBookSession={(session) => openBookingModalWithActivity(session)}
                />

                {/* 7. Trainers & Coaches Section */}
                <PamsCoachesSection
                  onBookCoach={(coach) => openBookingModalWithActivity({ title: `1-on-1 with Coach ${coach.name}` })}
                />

                {/* 8. Interactive Book a Session Widget */}
                <PamsBookSession
                  onBookingSubmit={(bookingData) => {
                    triggerToast(`Spot Confirmed: ${bookingData.activity} on ${bookingData.date} at ${bookingData.time}!`);
                  }}
                />

                {/* 9. Membership Passes */}
                <PamsMemberships
                  user={user}
                  onSelectPlan={(plan) => {
                    triggerToast(`Selected ${plan.name}. Navigating to member portal...`);
                    if (user) {
                      navigate("/account?tab=payments");
                    } else {
                      openSignInModal();
                    }
                  }}
                />

                {/* 10. Why PAMS Bento Section */}
                <PamsWhySection />

                {/* 11. Athlete Community & Voices */}
                <PamsCommunity />

                {/* 12. High-Energy Final CTA Banner */}
                <PamsFinalCTA
                  onGetStarted={() => {
                    const el = document.getElementById("memberships-section");
                    if (el) {
                      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                      else el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onExploreSports={() => openBookingModalWithActivity({ name: "Sports Arena Pass" })}
                />

                {/* 13. Rich PAMS Footer */}
                <PamsFooter onScrollToTop={handleScrollToTop} user={user} />
              </>
            }
          />

          {/* DEDICATED GYM DIRECT SHORTCUT ROUTES (PRESERVES EXISTING GYM FUNCTIONALITY) */}
          <Route path="/gym" element={<Navigate to="/account" replace />} />
          <Route path="/fitness/gym" element={<Navigate to="/account" replace />} />

          {/* OFFICIAL SUPPLEMENTS & PRODUCTS STORE ROUTE (NO NAVBAR) */}
          <Route
            path="/products"
            element={
              <>
                <ProductsPage />
                <Footer onScrollToTop={handleScrollToTop} />
              </>
            }
          />
          <Route path="/supplements" element={<Navigate to="/products" replace />} />
          <Route path="/store" element={<Navigate to="/products" replace />} />

          {/* MY CART & CHECKOUT PAGE ROUTES (REQUIRES LOGIN - NO NAVBAR) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                  "CUSTOMER",
                  "admin",
                  "ADMIN",
                  "trainer",
                  "TRAINER",
                  "receptionist",
                  "RECEPTIONIST",
                ]}
              >
                <MyCartPage />
                <Footer onScrollToTop={handleScrollToTop} />
              </ProtectedRoute>
            }
          />
          <Route path="/my-cart" element={<Navigate to="/cart" replace />} />

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
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* PROTECTED DEDICATED ROLE-BASED DASHBOARD ROUTES */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "admin"]}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "RECEPTIONIST",
                  "receptionist",
                  "SUPER_ADMIN",
                  "ADMIN",
                  "admin",
                ]}
              >
                <ReceptionistDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "TRAINER",
                  "trainer",
                  "SUPER_ADMIN",
                  "ADMIN",
                  "admin",
                ]}
              >
                <TrainerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "CUSTOMER",
                  "customer",
                  "TRAINER",
                  "trainer",
                  "RECEPTIONIST",
                  "receptionist",
                  "ADMIN",
                  "admin",
                  "SUPER_ADMIN",
                ]}
              >
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "CUSTOMER",
                  "customer",
                  "TRAINER",
                  "trainer",
                  "RECEPTIONIST",
                  "receptionist",
                  "ADMIN",
                  "admin",
                  "SUPER_ADMIN",
                ]}
              >
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                  "CUSTOMER",
                  "admin",
                  "ADMIN",
                  "trainer",
                  "TRAINER",
                  "receptionist",
                  "RECEPTIONIST",
                ]}
              >
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-portal"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                  "CUSTOMER",
                  "admin",
                  "ADMIN",
                  "trainer",
                  "TRAINER",
                  "receptionist",
                  "RECEPTIONIST",
                ]}
              >
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {/* Floating AnimatedList Toast Notification System */}
      <ToastNotificationStack
        notifications={toasts}
        onDismiss={dismissToast}
        position="top-right"
      />

      {/* Instant Backdrop Auth Modal Overlay (Sign In & Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* PAMS Quick Booking Modal */}
      <PamsBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialActivity={bookingModalActivity}
        onBookingSuccess={(booking) => {
          triggerToast(`Reservation Confirmed for ${booking.activity}!`);
        }}
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

            <h3 className="text-2xl font-extrabold font-heading text-white mb-2">
              TITAN PULSE 3D PASS
            </h3>

            <p className="text-xs text-[#8A94A0] mb-6">
              {modalMessage ||
                "Claim your complimentary All-Access Pass with biometric scanner access!"}
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
