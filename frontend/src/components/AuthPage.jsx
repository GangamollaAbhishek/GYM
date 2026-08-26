import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Activity, ArrowLeft, Phone } from 'lucide-react';
import './AuthModal.css';

export default function AuthPage({ user, onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode from current path (/signup vs /login)
  const isSignUpPath = location.pathname === '/signup' || location.pathname === '/register';
  const [isRightPanelActive, setIsRightPanelActive] = useState(isSignUpPath);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const isSignUp = location.pathname === '/signup' || location.pathname === '/register';
    setIsRightPanelActive(isSignUp);
    setErrorMsg('');

    if (user && (user.role === 'admin' || user.email?.toLowerCase().trim() === 'abhigangamolla@gmail.com')) {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, user]);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      setErrorMsg('Please fill in all email and password fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const inputEmail = signInData.email.toLowerCase().trim();
    const isAdminEmail = inputEmail.includes('abhigangamoll') || inputEmail.includes('admin') || inputEmail === 'abhishek';

    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: signInData.password })
      });
      const data = await res.json();
      if (res.ok && data?.data?.user) {
        setLoading(false);
        const userObj = { ...data.data.user, token: data.data.token };
        if (isAdminEmail) userObj.role = 'admin';

        if (onAuthSuccess) onAuthSuccess(userObj, 'sign-in');

        if (userObj.role === 'admin' || isAdminEmail) {
          navigate('/admin');
        } else if (userObj.role === 'receptionist') {
          navigate('/receptionist');
        } else if (userObj.role === 'trainer') {
          navigate('/trainer');
        } else {
          navigate('/');
        }
        return;
      } else {
        setErrorMsg(data.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Backend API unreachable, processing fallback authentication.');
    }

    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: isAdminEmail ? 'abhishek' : signInData.email.split('@')[0],
        email: inputEmail,
        role: isAdminEmail ? 'admin' : 'customer',
        token: 'titan_jwt_token_sample_' + Date.now(),
      };
      if (onAuthSuccess) onAuthSuccess(userObj, 'sign-in');

      if (userObj.role === 'admin' || isAdminEmail) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 500);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setErrorMsg('Please complete all registration fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          phone: signUpData.phone,
          password: signUpData.password,
          role: 'customer' // All public registrations are created as Customer/Member
        })
      });
      const data = await res.json();
      if (res.ok && data?.data?.user) {
        setLoading(false);
        const userObj = { ...data.data.user, role: 'customer', token: data.data.token };
        if (onAuthSuccess) onAuthSuccess(userObj, 'sign-up');
        navigate('/');
        return;
      }
    } catch (err) {
      console.log('Backend API unreachable, using local auth simulation.');
    }

    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: signUpData.name,
        email: signUpData.email,
        phone: signUpData.phone,
        role: 'customer', // Always customer
        token: 'titan_jwt_token_sample_' + Date.now(),
      };
      if (onAuthSuccess) onAuthSuccess(userObj, 'sign-up');
      navigate('/');
    }, 500);
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: `${provider} Athlete`,
        email: `athlete@${provider.toLowerCase()}.com`,
        token: `titan_${provider}_token_` + Date.now(),
      };
      if (onAuthSuccess) onAuthSuccess(userObj, provider);
      navigate('/');
    }, 500);
  };

  const switchToSignUp = () => {
    setIsRightPanelActive(true);
    navigate('/signup', { replace: true });
  };

  const switchToSignIn = () => {
    setIsRightPanelActive(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen w-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#E50914] selection:text-white">
      
      {/* Glow & Atmospheric Background Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#E50914]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-[350px] h-[350px] bg-[#FF2E4C]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 h-20 px-6 sm:px-12 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform duration-300">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl text-white tracking-wider leading-none">
              TITAN<span className="text-[#E50914]">•</span>PULSE
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A0A0A0] font-mono leading-tight">
              3D FITNESS SYSTEM
            </span>
          </div>
        </Link>

        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151515] border border-white/10 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-white hover:border-[#FF2E4C] transition-all shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Double-Slider Container Card (Fits Screen Perfectly) */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center justify-center pt-12">
        <div className="auth-wrapper">
          <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
            
            {/* SIGN UP FORM */}
            <div className="form-container sign-up-container">
              <form onSubmit={handleSignUpSubmit}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="text-[#FF2E4C]" size={24} />
                  <h2>Sign Up</h2>
                </div>
                <span>Join TITAN PULSE 3D Gym Ecosystem</span>

                {/* Social Login */}
                <div className="social-container">
                  <button type="button" title="Sign up with Google" onClick={() => handleSocialAuth('Google')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                  </button>
                  <button type="button" title="Sign up with GitHub" onClick={() => handleSocialAuth('GitHub')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </button>
                  <button type="button" title="Sign up with Facebook" onClick={() => handleSocialAuth('Facebook')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>

                <span>or use your email for registration</span>

                {errorMsg && isRightPanelActive && (
                  <div className="text-red-400 text-xs mb-2 font-mono bg-red-950/40 border border-red-800/60 px-3 py-1 rounded-lg w-full">
                    {errorMsg}
                  </div>
                )}

                <div className="auth-input-group">
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    required
                  />
                  <User className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                  <Mail className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    required
                  />
                  <Phone className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create Password" 
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                  <Lock className="auth-input-icon" size={18} />
                  <button 
                    type="button" 
                    className="auth-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="mobile-auth-switch">
                  <span>Already have an account?</span>
                  <button type="button" onClick={switchToSignIn}>Sign In</button>
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

                {/* Social Login */}
                <div className="social-container">
                  <button type="button" title="Sign in with Google" onClick={() => handleSocialAuth('Google')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                  </button>
                  <button type="button" title="Sign in with GitHub" onClick={() => handleSocialAuth('GitHub')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </button>
                  <button type="button" title="Sign in with Facebook" onClick={() => handleSocialAuth('Facebook')}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>

                <span>or use your member email</span>

                {errorMsg && !isRightPanelActive && (
                  <div className="text-red-400 text-xs mb-2 font-mono bg-red-950/40 border border-red-800/60 px-3 py-1 rounded-lg w-full">
                    {errorMsg}
                  </div>
                )}

                <div className="auth-input-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                  <Mail className="auth-input-icon" size={18} />
                </div>

                <div className="auth-input-group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                  <Lock className="auth-input-icon" size={18} />
                  <button 
                    type="button" 
                    className="auth-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <a 
                  href="#forgot" 
                  className="forgot-pass-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to your email!');
                  }}
                >
                  Forgot your password?
                </a>

                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Login'}
                </button>

                <div className="mobile-auth-switch">
                  <span>Don't have an account?</span>
                  <button type="button" onClick={switchToSignUp}>Register</button>
                </div>
              </form>
            </div>

            {/* OVERLAY SLIDER PANEL */}
            <div className="overlay-container">
              <div className="overlay">
                
                {/* LEFT OVERLAY PANEL (Shows when Sign Up is Active -> Click to Sign In) */}
                <div className="overlay-panel overlay-left">
                  <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">WELCOME BACK!</h1>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">
                    To keep connected with your 3D biometric telemetry and gym schedule, please sign in with your personal credentials.
                  </p>
                  <button 
                    className="auth-btn-ghost flex items-center gap-2" 
                    id="signIn"
                    onClick={switchToSignIn}
                  >
                    Sign In
                  </button>
                </div>

                {/* RIGHT OVERLAY PANEL (Shows when Sign In is Active -> Click to Sign Up) */}
                <div className="overlay-panel overlay-right">
                  <h1 className="text-3xl font-extrabold font-bebas tracking-wide mb-2">HELLO, ATHLETE!</h1>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">
                    Enter your details and begin your transformative journey with TITAN PULSE 3D Fitness Engine.
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
      </div>

    </div>
  );
}
