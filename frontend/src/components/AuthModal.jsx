import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, X, Activity, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import AstroBotAuthMascot, { astroAudio } from './AstroBotAuthMascot';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, initialMode = 'sign-in', onSuccess }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'sign-up');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const botRef = useRef(null);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  useEffect(() => {
    setIsRightPanelActive(initialMode === 'sign-up');
    setErrorMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      setErrorMsg('Please fill in both email and password fields.');
      botRef.current?.think();
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(signInData.email, signInData.password);
      setLoading(false);

      if (result.success && result.user) {
        botRef.current?.celebrate();

        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FF2E4C', '#E50914', '#00F2FE', '#10B981', '#F59E0B']
        });

        if (onSuccess) onSuccess(result.user, 'sign-in');

        setTimeout(() => {
          onClose();
          const role = (result.user.role || '').toLowerCase().trim();
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'receptionist') {
            navigate('/receptionist');
          } else if (role === 'trainer') {
            navigate('/trainer');
          } else {
            navigate('/account?tab=personal&sub=profile');
          }
        }, 1600);
      } else {
        setErrorMsg(result.message || 'Invalid email or password.');
        astroAudio.playShy();
        botRef.current?.think();
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('An unexpected error occurred. Please try again.');
      astroAudio.playShy();
      botRef.current?.think();
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setErrorMsg('Please complete all registration fields.');
      botRef.current?.think();
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await signup(signUpData);
      setLoading(false);

      if (result.success && result.user) {
        botRef.current?.celebrate();

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF2E4C', '#E50914', '#00F2FE', '#10B981', '#F59E0B']
        });

        if (onSuccess) onSuccess(result.user, 'sign-up');

        setTimeout(() => {
          onClose();
          navigate('/account?tab=personal&sub=profile');
        }, 1600);
      } else {
        setErrorMsg(result.message || 'Registration failed.');
        astroAudio.playShy();
        botRef.current?.think();
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('An unexpected error occurred during registration.');
      astroAudio.playShy();
      botRef.current?.think();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-wrapper" onClick={(e) => e.stopPropagation()}>
        
        {/* Floating 3D AstroBot Mascot */}
        <div className="relative z-20 mb-[-32px]">
          <AstroBotAuthMascot
            ref={botRef}
            modelType="robot"
            bodyColor="white"
            ledColor="cyan"
          />
        </div>

        {/* Modal Close Button */}
        <button 
          className="auth-close-btn" 
          onClick={onClose}
          aria-label="Close Auth Modal"
        >
          <X size={20} />
        </button>

        {/* Sliding Auth Container */}
        <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
          
          {/* SIGN UP FORM */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUpSubmit}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="text-[#FF2E4C]" size={24} />
                <h2>Sign Up</h2>
              </div>
              <span>Join TITAN PULSE 3D Gym Ecosystem</span>
              
              <div className="social-container">
                <button type="button" title="Sign up with Google" onClick={() => alert('Social authentication will use OAuth provider.')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </button>
                <button type="button" title="Sign up with GitHub" onClick={() => alert('Social authentication will use OAuth provider.')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
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
                    botRef.current?.say('What is your full athlete name? ✍️', 2000);
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
                    botRef.current?.say('Enter your email address ✉️', 2000);
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
                  type={showSignUpPassword ? 'text' : 'password'} 
                  placeholder="Create Password" 
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
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
                  title={showSignUpPassword ? 'Hide Password' : 'Show Password (AstroBot Peeks!)'}
                >
                  {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Now'}
              </button>

              <div className="mobile-auth-switch">
                <span>Already have an account?</span>
                <button type="button" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
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
                <button type="button" title="Sign in with Google" onClick={() => alert('Social authentication will use OAuth provider.')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </button>
                <button type="button" title="Sign in with GitHub" onClick={() => alert('Social authentication will use OAuth provider.')}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
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
                    botRef.current?.say('Enter your email address ✉️', 2000);
                  }}
                  onBlur={() => botRef.current?.resetLook()}
                  required
                />
                <Mail className="auth-input-icon" size={18} />
              </div>

              <div className="auth-input-group">
                <input 
                  type={showSignInPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
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
                  title={showSignInPassword ? 'Hide Password' : 'Show Password (AstroBot Peeks!)'}
                >
                  {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <a 
                href="#forgot" 
                className="forgot-pass-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link sent to your registered email!');
                }}
              >
                Forgot your password?
              </a>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login'}
              </button>

              <div className="mobile-auth-switch">
                <span>Don't have an account?</span>
                <button type="button" onClick={() => setIsRightPanelActive(true)}>Register</button>
              </div>
            </form>
          </div>

          {/* OVERLAY SLIDER PANEL */}
          <div className="overlay-container">
            <div className="overlay">
              
              {/* LEFT OVERLAY PANEL */}
              <div className="overlay-panel overlay-left">
                <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">WELCOME BACK!</h1>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  To keep connected with your 3D biometric telemetry and gym schedule, please sign in with your personal credentials.
                </p>
                <button 
                  className="auth-btn-ghost flex items-center gap-2" 
                  id="signIn"
                  onClick={() => setIsRightPanelActive(false)}
                >
                  Sign In
                </button>
              </div>

              {/* RIGHT OVERLAY PANEL */}
              <div className="overlay-panel overlay-right">
                <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">HELLO, ATHLETE!</h1>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Enter your details and begin your transformative journey with TITAN PULSE 3D Fitness Engine.
                </p>
                <button 
                  className="auth-btn-ghost flex items-center gap-2" 
                  id="signUp"
                  onClick={() => setIsRightPanelActive(true)}
                >
                  Sign Up
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
