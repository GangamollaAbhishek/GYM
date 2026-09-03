import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Activity,
  ArrowLeft,
  Phone,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import AstroBotAuthMascot, { astroAudio } from "./AstroBotAuthMascot";
import "./AuthModal.css";

export default function AuthPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, signup } = useAuth();
  const { cmsData } = useLandingPageCMS();
  const botRef = useRef(null);

  // Determine initial mode from current path (/signup vs /login)
  const isSignUpPath =
    location.pathname === "/signup" || location.pathname === "/register";
  const [isRightPanelActive, setIsRightPanelActive] = useState(isSignUpPath);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // 3D Mascot & Customizer State
  const [modelType, setModelType] = useState("robot"); // 'robot' | 'xbot' | 'soldier'
  const [botColor, setBotColor] = useState("white");
  const [ledColor, setLedColor] = useState("cyan");
  const [isMuted, setIsMuted] = useState(false);

  // Form state
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // If already authenticated on initial page mount, redirect appropriately
  useEffect(() => {
    const isSignUp =
      location.pathname === "/signup" || location.pathname === "/register";
    setIsRightPanelActive(isSignUp);
    setErrorMsg("");

    // Only auto-redirect if already logged in on page load, NOT during active form submission/animation
    if (
      isAuthenticated &&
      user &&
      !loading &&
      !signInSuccess &&
      !signUpSuccess
    ) {
      const userRole = (user.role || "").toLowerCase().trim();
      const redirectFrom = location.state?.from?.pathname;

      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (userRole === "receptionist") {
        navigate("/receptionist", { replace: true });
      } else if (userRole === "trainer") {
        navigate("/trainer", { replace: true });
      } else if (
        redirectFrom &&
        redirectFrom !== "/login" &&
        redirectFrom !== "/signup" &&
        redirectFrom !== "/register"
      ) {
        navigate(redirectFrom, { replace: true });
      } else {
        navigate("/account?tab=personal&sub=profile", { replace: true });
      }
    }
  }, [
    location.pathname,
    isAuthenticated,
    user,
    navigate,
    location.state,
    loading,
    signInSuccess,
    signUpSuccess,
  ]);

  const switchToSignUp = () => {
    setIsRightPanelActive(true);
    setErrorMsg("");
    navigate("/signup", { replace: true });
    astroAudio.playBleep(620);
    botRef.current?.say("Beep! Let’s get you registered 📝", 2500);
  };

  const switchToSignIn = () => {
    setIsRightPanelActive(false);
    setErrorMsg("");
    navigate("/login", { replace: true });
    astroAudio.playBleep(620);
    botRef.current?.say("Welcome back! Good to see you 😊", 2500);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      setErrorMsg("Please fill in both email and password fields.");
      botRef.current?.think();
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      // Allow the spinning animation to display for at least 800ms
      const [result] = await Promise.all([
        login(signInData.email, signInData.password),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      setLoading(false);

      if (result.success && result.user) {
        // Trigger green checkmark animation
        setSignInSuccess(true);
        botRef.current?.celebrate();

        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#FF2E4C", "#E50914", "#00F2FE", "#10B981", "#F59E0B"],
        });

        // Redirect to Dashboard strictly AFTER the effect completes
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(result.user, "sign-in");

          const role = (result.user.role || "").toLowerCase().trim();
          const fromPath = location.state?.from?.pathname;

          if (role === "admin") {
            navigate("/admin", { replace: true });
          } else if (role === "receptionist") {
            navigate("/receptionist", { replace: true });
          } else if (role === "trainer") {
            navigate("/trainer", { replace: true });
          } else if (
            fromPath &&
            fromPath !== "/login" &&
            fromPath !== "/signup" &&
            fromPath !== "/register" &&
            !fromPath.startsWith("/admin")
          ) {
            navigate(fromPath, { replace: true });
          } else {
            navigate("/account?tab=personal&sub=profile", { replace: true });
          }
        }, 1800);
      } else {
        setSignInSuccess(false);
        setErrorMsg(result.message || "Invalid email or password.");
        astroAudio.playShy();
        botRef.current?.think();
      }
    } catch (err) {
      setLoading(false);
      setSignInSuccess(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
      astroAudio.playShy();
      botRef.current?.think();
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setErrorMsg("Please complete all registration fields.");
      botRef.current?.think();
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const [result] = await Promise.all([
        signup(signUpData),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      setLoading(false);

      if (result.success && result.user) {
        setSignUpSuccess(true);
        botRef.current?.celebrate();

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FF2E4C", "#E50914", "#00F2FE", "#10B981", "#F59E0B"],
        });

        // Redirect to Dashboard strictly AFTER the effect completes
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(result.user, "sign-up");
          navigate("/account?tab=personal&sub=profile", { replace: true });
        }, 1800);
      } else {
        setSignUpSuccess(false);
        setErrorMsg(result.message || "Registration failed.");
        astroAudio.playShy();
        botRef.current?.think();
      }
    } catch (err) {
      setLoading(false);
      setSignUpSuccess(false);
      setErrorMsg("An unexpected error occurred during registration.");
      astroAudio.playShy();
      botRef.current?.think();
    }
  };

  const handleSoundToggle = () => {
    const muted = astroAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) astroAudio.playBleep(600);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#E50914] selection:text-white">
      {/* Glow & Atmospheric Background Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-[380px] h-[380px] bg-[#FF2E4C]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 h-20 px-6 sm:px-12 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3 group min-w-0">
          {cmsData?.brand?.logo ? (
            <div className="w-10 h-10 rounded-xl bg-[#121217] border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform shrink-0">
              <img
                src={cmsData.brand.logo}
                alt={cmsData?.brand?.name || "Logo"}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Activity size={22} className="stroke-[2.5]" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-bebas text-2xl text-white tracking-wider leading-none truncate">
              {cmsData?.brand?.name || "TITAN•PULSE"}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A0A0A0] font-mono leading-tight truncate">
              {cmsData?.brand?.subname || "3D FITNESS SYSTEM"}
            </span>
          </div>
        </Link>

        {/* Top 3D Mascot Quick Bar */}
        <div className="hidden sm:flex items-center gap-3 bg-[#15151A]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Avatar:
          </span>
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="bg-[#090C0E] border border-white/10 text-white text-xs font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer"
          >
            <option value="robot">🤖 AstroBot</option>
            <option value="xbot">🦾 Xbot.glb</option>
            <option value="soldier">🪖 Soldier.glb</option>
          </select>

          {modelType === "robot" && (
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
              {["cyan", "emerald", "amber", "pink"].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setLedColor(col)}
                  className={`w-4 h-4 rounded-full transition-transform ${ledColor === col ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"}`}
                  style={{
                    backgroundColor:
                      col === "cyan"
                        ? "#00F2FE"
                        : col === "emerald"
                          ? "#10B981"
                          : col === "amber"
                            ? "#F59E0B"
                            : "#EC4899",
                  }}
                  title={`LED ${col}`}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleSoundToggle}
            className="ml-2 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            {isMuted ? "🔇 Off" : "🔊 Sound"}
          </button>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151515] border border-white/10 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-white hover:border-[#FF2E4C] transition-all shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Double-Slider Container Card with 3D Mascot Floating Above */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center justify-center pt-16 sm:pt-10">
        {/* Floating 3D AstroBot Mascot */}
        <div className="relative z-20 mb-[-32px]">
          <AstroBotAuthMascot
            ref={botRef}
            modelType={modelType}
            bodyColor={botColor}
            ledColor={ledColor}
          />
        </div>

        <div className="auth-wrapper">
          <div
            className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}
            id="container"
          >
            {/* SIGN UP FORM */}
            <div className="form-container sign-up-container">
              <form onSubmit={handleSignUpSubmit}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="text-[#FF2E4C]" size={24} />
                  <h2>Sign Up</h2>
                </div>
                <span>Join TITAN PULSE 3D Gym Ecosystem</span>

                <div className="social-container">
                  <button
                    type="button"
                    title="Sign up with Google"
                    onClick={() =>
                      alert("Social authentication will use OAuth provider.")
                    }
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Sign up with GitHub"
                    onClick={() =>
                      alert("Social authentication will use OAuth provider.")
                    }
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </button>
                </div>

                <span>or use your email for registration</span>

                {errorMsg && isRightPanelActive && (
                  <div className="text-red-400 text-xs mb-2 font-mono bg-red-950/60 border border-red-800 px-3 py-1.5 rounded-lg w-full">
                    {errorMsg}
                  </div>
                )}

                <div className="auth-input-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={signUpData.name}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, name: e.target.value });
                      botRef.current?.trackInput(e.target);
                    }}
                    onFocus={(e) => {
                      astroAudio.playBleep(540);
                      botRef.current?.trackInput(e.target);
                      botRef.current?.say(
                        "What is your full athlete name? ✍️",
                        2000,
                      );
                    }}
                    onBlur={() => botRef.current?.resetLook()}
                    required
                  />
                  <User className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signUpData.email}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, email: e.target.value });
                      botRef.current?.trackInput(e.target);
                    }}
                    onFocus={(e) => {
                      astroAudio.playBleep(580);
                      botRef.current?.trackInput(e.target);
                      botRef.current?.say("Enter your email address ✉️", 2000);
                    }}
                    onBlur={() => botRef.current?.resetLook()}
                    required
                  />
                  <Mail className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={signUpData.phone}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, phone: e.target.value });
                      botRef.current?.trackInput(e.target);
                    }}
                    onFocus={(e) => {
                      astroAudio.playBleep(560);
                      botRef.current?.trackInput(e.target);
                    }}
                    onBlur={() => botRef.current?.resetLook()}
                  />
                  <Phone className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    onFocus={() => {
                      if (showSignUpPassword) {
                        botRef.current?.peek();
                      } else {
                        botRef.current?.coverEyes();
                      }
                    }}
                    onBlur={() => botRef.current?.uncoverEyes()}
                    required
                  />
                  <Lock className="auth-input-icon" size={18} />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    onClick={() => {
                      const next = !showSignUpPassword;
                      setShowSignUpPassword(next);
                      if (next) {
                        botRef.current?.peek();
                      } else {
                        botRef.current?.coverEyes();
                      }
                    }}
                    title={
                      showSignUpPassword
                        ? "Hide Password"
                        : "Show Password (AstroBot Peeks!)"
                    }
                  >
                    {showSignUpPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className={`morph-auth-submit-btn ${loading ? "is-loading" : ""} ${signUpSuccess ? "is-success" : ""}`}
                  disabled={loading || signUpSuccess}
                >
                  <span className="btn-label">
                    {loading ? "" : "Register Now"}
                  </span>
                  <svg
                    className="btn-check-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                  </svg>
                </button>

                <div className="mobile-auth-switch">
                  <span>Already have an account?</span>
                  <button type="button" onClick={switchToSignIn}>
                    Sign In
                  </button>
                </div>
              </form>
            </div>

            {/* SIGN IN FORM */}
            <div className="form-container sign-in-container">
              <form onSubmit={handleSignInSubmit}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="text-[#FF2E4C]" size={24} />
                  <h2>Sign In</h2>
                </div>
                <span>Access Telemetry & Member Pass</span>

                <div className="social-container">
                  <button
                    type="button"
                    title="Sign in with Google"
                    onClick={() =>
                      alert("Social authentication will use OAuth provider.")
                    }
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Sign in with GitHub"
                    onClick={() =>
                      alert("Social authentication will use OAuth provider.")
                    }
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </button>
                </div>

                <span>or use your member credentials</span>

                {errorMsg && !isRightPanelActive && (
                  <div className="text-red-400 text-xs mb-2 font-mono bg-red-950/60 border border-red-800 px-3 py-1.5 rounded-lg w-full">
                    {errorMsg}
                  </div>
                )}

                <div className="auth-input-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signInData.email}
                    onChange={(e) => {
                      setSignInData({ ...signInData, email: e.target.value });
                      botRef.current?.trackInput(e.target);
                    }}
                    onFocus={(e) => {
                      astroAudio.playBleep(580);
                      botRef.current?.trackInput(e.target);
                      botRef.current?.say("Enter your email address ✉️", 2000);
                    }}
                    onBlur={() => botRef.current?.resetLook()}
                    required
                  />
                  <Mail className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    onFocus={() => {
                      if (showSignInPassword) {
                        botRef.current?.peek();
                      } else {
                        botRef.current?.coverEyes();
                      }
                    }}
                    onBlur={() => botRef.current?.uncoverEyes()}
                    required
                  />
                  <Lock className="auth-input-icon" size={18} />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    onClick={() => {
                      const next = !showSignInPassword;
                      setShowSignInPassword(next);
                      if (next) {
                        botRef.current?.peek();
                      } else {
                        botRef.current?.coverEyes();
                      }
                    }}
                    title={
                      showSignInPassword
                        ? "Hide Password"
                        : "Show Password (AstroBot Peeks!)"
                    }
                  >
                    {showSignInPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                <a
                  href="#forgot"
                  className="forgot-pass-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset link sent to your registered email!");
                  }}
                >
                  Forgot your password?
                </a>

                <button
                  type="submit"
                  className={`morph-auth-submit-btn ${loading ? "is-loading" : ""} ${signInSuccess ? "is-success" : ""}`}
                  disabled={loading || signInSuccess}
                >
                  <span className="btn-label">{loading ? "" : "Login"}</span>
                  <svg
                    className="btn-check-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                  </svg>
                </button>

                <div className="mobile-auth-switch">
                  <span>Don't have an account?</span>
                  <button type="button" onClick={switchToSignUp}>
                    Register
                  </button>
                </div>
              </form>
            </div>

            {/* OVERLAY SLIDER PANEL */}
            <div className="overlay-container">
              <div className="overlay">
                {/* LEFT OVERLAY PANEL */}
                <div className="overlay-panel overlay-left">
                  <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">
                    WELCOME BACK!
                  </h1>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">
                    To keep connected with your 3D biometric telemetry and gym
                    schedule, please sign in with your personal credentials.
                  </p>
                  <button
                    className="auth-btn-ghost flex items-center gap-2"
                    id="signIn"
                    onClick={switchToSignIn}
                  >
                    Sign In
                  </button>
                </div>

                {/* RIGHT OVERLAY PANEL */}
                <div className="overlay-panel overlay-right">
                  <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">
                    HELLO, ATHLETE!
                  </h1>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">
                    Enter your details and begin your transformative journey
                    with TITAN PULSE 3D Fitness Engine.
                  </p>
                  <button
                    className="auth-btn-ghost flex items-center gap-2"
                    id="signUp"
                    onClick={switchToSignUp}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Interactive Bar */}
        <div className="mt-4 flex items-center justify-center gap-2 z-20">
          <button
            type="button"
            onClick={() => botRef.current?.wave()}
            className="px-3.5 py-1.5 rounded-full bg-[#15151A] hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            👋 Wave
          </button>
          <button
            type="button"
            onClick={() => botRef.current?.think()}
            className="px-3.5 py-1.5 rounded-full bg-[#15151A] hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            🤔 Think
          </button>
          <button
            type="button"
            onClick={() => botRef.current?.coverEyes()}
            className="px-3.5 py-1.5 rounded-full bg-[#15151A] hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            🔄 Turn Back
          </button>
          <button
            type="button"
            onClick={() => botRef.current?.peek()}
            className="px-3.5 py-1.5 rounded-full bg-[#15151A] hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            🫣 Peek
          </button>
        </div>
      </div>
    </div>
  );
}
