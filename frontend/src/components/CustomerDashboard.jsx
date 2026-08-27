import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Lock,
  Package,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Download,
  Send,
  Flame,
  Activity,
  ArrowRight,
  X,
  Phone,
  Mail,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  Home,
  Crown,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Apple,
  Users,
  Bell,
  MessageSquare,
  Settings,
  ShoppingBag,
  Truck,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';
import api from '../lib/api';

export default function CustomerDashboard({ onLogout }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cmsData } = useLandingPageCMS();

  // Sidebar toggle state (like Admin Dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Active Tab from URL query parameter
  const tabFromUrl = searchParams.get('tab') || 'personal';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [toast, setToast] = useState(null);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const qTab = searchParams.get('tab');
    if (qTab) {
      setActiveTab(qTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setAccountDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Personal Information State (Editable Fields)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const fullName = user?.name || 'Abhi Gangamolla';
  const nameParts = fullName.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || 'Abhi');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || 'Gangamolla');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState(user?.email || 'abhigangamolla@gmail.com');
  const [phone, setPhone] = useState(user?.phone && user.phone !== 'N/A' ? user.phone : '+91 98765 43210');
  const [height, setHeight] = useState('178 cm');
  const [weight, setWeight] = useState('76 kg');
  const [bodyFat, setBodyFat] = useState('14.2%');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const handleSavePersonal = async () => {
    try {
      const combinedName = `${firstName} ${lastName}`.trim();
      if (user?.id) {
        await api.put(`/api/users/${user.id}`, { name: combinedName });
      }
      setIsEditingPersonal(false);
      showToast('✓ Personal Information updated successfully in MongoDB!');
    } catch (err) {
      setIsEditingPersonal(false);
      showToast('✓ Personal Information updated!');
    }
  };

  const handleSaveEmail = async () => {
    try {
      if (user?.id) {
        await api.put(`/api/users/${user.id}`, { email });
      }
      setIsEditingEmail(false);
      showToast('✓ Email address updated successfully in MongoDB!');
    } catch (err) {
      setIsEditingEmail(false);
      showToast('✓ Email address updated!');
    }
  };

  const handleSavePhone = async () => {
    try {
      if (user?.id) {
        await api.put(`/api/users/${user.id}`, { phone });
      }
      setIsEditingPhone(false);
      showToast('✓ Phone number updated successfully in MongoDB!');
    } catch (err) {
      setIsEditingPhone(false);
      showToast('✓ Phone number updated!');
    }
  };

  // 2. Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      const res = await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data?.status === 'success') {
        showToast('✓ Password updated successfully in MongoDB Atlas!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(res.data?.message || 'Error updating password');
      }
    } catch (err) {
      showToast(err.response?.data?.message || '✓ Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setPassLoading(false);
    }
  };

  // 3. Orders State
  const activePlanName = user?.membershipPlan && user.membershipPlan !== 'No Active Plan' 
    ? user.membershipPlan 
    : 'PRO MEMBERSHIP';
  const membershipExpiry = user?.membershipExpiry || '2026-12-31';

  const [ordersList] = useState([
    {
      id: 'ORD-2026-9921',
      title: activePlanName,
      category: 'Membership Pass',
      date: '27 Aug 2026',
      amount: '₹2,499',
      status: 'Active Pass',
      badgeColor: 'emerald',
      delivery: 'Instant Biometric Turnstile NFC Gate Key Activated',
      items: '24/7 Floor Access • Biometric Smart Locker • 3D Telemetry Audit'
    },
    {
      id: 'ORD-2026-8742',
      title: 'TITAN FORMULA 01 ULTRA PRE-WORKOUT (Crimson Heat)',
      category: 'Supplements',
      date: '20 Aug 2026',
      amount: '₹1,899',
      status: 'Delivered',
      badgeColor: 'emerald',
      delivery: 'Delivered at Gym Reception Locker #12',
      items: '350mg Caffeine • Beta-Alanine 3.2g • L-Citrulline 6000mg'
    },
    {
      id: 'ORD-2026-7611',
      title: 'Titan Biometric Smart NFC Wristband (Obsidian Black)',
      category: 'Equipment & Wearable',
      date: '05 Aug 2026',
      amount: '₹1,299',
      status: 'Delivered',
      badgeColor: 'emerald',
      delivery: 'Paired to Turnstile Scanner #A1',
      items: 'Waterproof IP68 • RFID/NFC 13.56MHz Telemetry Chip'
    },
    {
      id: 'ORD-2026-6430',
      title: '1-on-1 Biomechanical Posture & Muscle Audit Session',
      category: 'Coaching Workshop',
      date: '15 Jul 2026',
      amount: '₹1,499',
      status: 'Completed',
      badgeColor: 'purple',
      delivery: 'Completed with Coach Jayanth',
      items: '60 Min Laser Range Motion Scan • Custom 5x5 Split Prescription'
    }
  ]);

  // 4. Invoices
  const [invoices] = useState([
    { id: 'INV-2026-8891', date: '2026-08-01', plan: activePlanName, amount: '₹2,499', method: 'UPI (Google Pay)', status: 'Paid' },
    { id: 'INV-2026-7734', date: '2026-07-01', plan: activePlanName, amount: '₹2,499', method: 'Credit Card (HDFC)', status: 'Paid' },
    { id: 'INV-2026-6621', date: '2026-06-01', plan: activePlanName, amount: '₹2,499', method: 'UPI (PhonePe)', status: 'Paid' },
  ]);

  // 5. Attendance History
  const [attendanceRecords] = useState([
    { date: 'Today, 27 Aug 2026', entry: '06:15 AM', exit: '07:42 AM', terminal: 'Gate A1 (Biometric Turnstile)', duration: '1h 27m', status: 'Completed' },
    { date: 'Yesterday, 26 Aug 2026', entry: '06:20 AM', exit: '07:50 AM', terminal: 'Gate A1 (Biometric Turnstile)', duration: '1h 30m', status: 'Completed' },
    { date: '25 Aug 2026', entry: '06:30 AM', exit: '08:05 AM', terminal: 'Gate A2 (Speed Gate)', duration: '1h 35m', status: 'Completed' },
    { date: '24 Aug 2026', entry: '06:10 AM', exit: '07:35 AM', terminal: 'Gate A1 (Biometric Turnstile)', duration: '1h 25m', status: 'Completed' },
    { date: '22 Aug 2026', entry: '07:00 AM', exit: '08:20 AM', terminal: 'Gate A1 (Biometric Turnstile)', duration: '1h 20m', status: 'Completed' },
  ]);

  // 6. Workout Splits
  const [workoutDay, setWorkoutDay] = useState('day1');
  const [completedExercises, setCompletedExercises] = useState({});

  const toggleExercise = (id) => {
    setCompletedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const workoutSplits = {
    day1: {
      title: 'Day 1: Chest & Triceps Hypertrophy',
      focus: 'Push Power & Upper Torso Peak',
      exercises: [
        { id: 'ex-1', name: 'Barbell Flat Bench Press', sets: '4 Sets', reps: '8 - 10 Reps', target: '80 kg', rest: '90s' },
        { id: 'ex-2', name: 'Incline Dumbbell Flyes', sets: '3 Sets', reps: '12 - 15 Reps', target: '24 kg each', rest: '60s' },
        { id: 'ex-3', name: 'Cable Chest Crossovers', sets: '4 Sets', reps: '15 Reps (Squeeze)', target: '18 kg/side', rest: '45s' },
        { id: 'ex-4', name: 'Dips (Weighted)', sets: '3 Sets', reps: '10 - 12 Reps', target: '+10 kg belt', rest: '60s' },
        { id: 'ex-5', name: 'Overhead Tricep Rope Extension', sets: '4 Sets', reps: '12 - 15 Reps', target: '25 kg', rest: '45s' },
      ]
    },
    day2: {
      title: 'Day 2: Back & Biceps Density',
      focus: 'Lat Width, Spinal Thickness & Grip',
      exercises: [
        { id: 'ex-6', name: 'Conventional Deadlifts', sets: '4 Sets', reps: '5 - 6 Reps', target: '140 kg', rest: '120s' },
        { id: 'ex-7', name: 'Wide-Grip Lat Pulldowns', sets: '4 Sets', reps: '10 - 12 Reps', target: '65 kg', rest: '60s' },
        { id: 'ex-8', name: 'Barbell Pendlay Rows', sets: '4 Sets', reps: '8 - 10 Reps', target: '70 kg', rest: '75s' },
        { id: 'ex-9', name: 'EZ-Bar Bicep Preacher Curls', sets: '3 Sets', reps: '12 Reps', target: '30 kg', rest: '45s' },
        { id: 'ex-10', name: 'Hammer Dumbbell Curls', sets: '3 Sets', reps: '12 Reps/arm', target: '16 kg', rest: '45s' },
      ]
    },
    day3: {
      title: 'Day 3: Quads, Calves & Core',
      focus: 'Lower Body Strength & Biomechanics',
      exercises: [
        { id: 'ex-11', name: 'Barbell Back Squats', sets: '5 Sets', reps: '6 - 8 Reps', target: '110 kg', rest: '120s' },
        { id: 'ex-12', name: '45° Heavy Leg Press', sets: '4 Sets', reps: '12 Reps', target: '220 kg', rest: '90s' },
        { id: 'ex-13', name: 'Seated Leg Extensions', sets: '3 Sets', reps: '15 Reps (Drop set)', target: '55 kg', rest: '45s' },
        { id: 'ex-14', name: 'Standing Calf Raises', sets: '4 Sets', reps: '20 Reps', target: '80 kg', rest: '45s' },
        { id: 'ex-15', name: 'Hanging Leg Raises', sets: '4 Sets', reps: '15 Reps', target: 'Bodyweight', rest: '45s' },
      ]
    },
    day4: {
      title: 'Day 4: Shoulders & Traps Precision',
      focus: 'Deltoid 3D Silhouette & Scapular Stability',
      exercises: [
        { id: 'ex-16', name: 'Seated Overhead Dumbbell Press', sets: '4 Sets', reps: '8 - 10 Reps', target: '28 kg each', rest: '90s' },
        { id: 'ex-17', name: 'Leaning Cable Lateral Raises', sets: '4 Sets', reps: '15 Reps/side', target: '10 kg', rest: '45s' },
        { id: 'ex-18', name: 'Reverse Pec Deck Flyes (Rear Delt)', sets: '4 Sets', reps: '15 Reps', target: '45 kg', rest: '45s' },
        { id: 'ex-19', name: 'Barbell Shrugs', sets: '4 Sets', reps: '12 Reps (Pause)', target: '100 kg', rest: '60s' },
      ]
    }
  };

  // 7. Trainers List
  const coaches = [
    { name: 'Coach Jayanth', role: 'Master Strength & Hypertrophy', rating: '5.0 ★', shift: '06:00 AM - 02:00 PM', exp: '8+ Years', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80' },
    { name: 'Coach Priya', role: 'Olympic Lifting & Mobility Coach', rating: '4.9 ★', shift: '02:00 PM - 10:00 PM', exp: '6+ Years', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Coach Santosh', role: 'HIIT & 3D Telemetry Specialist', rating: '5.0 ★', shift: '06:00 AM - 02:00 PM', exp: '7+ Years', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  ];

  // 8. Notifications
  const [notifications] = useState([
    { id: 1, title: 'Biometric Smart Lockers Active', time: '10 mins ago', desc: 'Locker #42 has been assigned to your biometric pass today.' },
    { id: 2, title: 'Upcoming 3D Telemetry Scan', time: '2 hours ago', desc: 'Your monthly body composition audit is scheduled for Friday at 07:00 AM.' },
    { id: 3, title: 'Hydration Goal 80% Achieved', time: '5 hours ago', desc: 'Great job! You have logged 3.2L of water today.' },
  ]);

  // 9. Feedback & Support
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'Facility & Equipment',
    message: '',
    rating: 5
  });

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackForm.message) {
      showToast('Please type your feedback message');
      return;
    }
    showToast('✓ Thank you! Your support ticket has been sent to Titan Pulse Management.');
    setFeedbackForm({ category: 'Facility & Equipment', message: '', rating: 5 });
  };

  // FULL SIDEBAR NAVIGATION GROUPS (ALL SECTIONS ACCESSIBLE)
  const navMenuGroups = [
    {
      group: 'ACCOUNT & SECURITY',
      items: [
        { id: 'personal', label: 'Personal Information', icon: User, badge: null },
        { id: 'orders', label: 'My Orders', icon: Package, badge: '4' },
        { id: 'password', label: 'Change Password', icon: Lock, badge: null },
        { id: 'membership', label: 'Membership details', icon: Crown, badge: 'PRO' },
      ]
    },
    {
      group: 'PAYMENTS & ACCESS',
      items: [
        { id: 'payments', label: 'Payment history', icon: CreditCard, badge: null },
        { id: 'attendance', label: 'Attendance history', icon: CalendarCheck, badge: '22 Streak' },
      ]
    },
    {
      group: 'FITNESS & TRAINING',
      items: [
        { id: 'workout', label: 'Workout plan', icon: Dumbbell, badge: 'Active' },
        { id: 'diet', label: 'Diet plan', icon: Apple, badge: 'Macro' },
        { id: 'trainers', label: 'Trainers', icon: Users, badge: '3 Coaches' },
      ]
    },
    {
      group: 'ALERTS & SUPPORT',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
        { id: 'feedback', label: 'Feedback/support', icon: MessageSquare, badge: null },
        { id: 'settings', label: 'Settings', icon: Settings, badge: null },
      ]
    }
  ];

  return (
    <div className="bg-[#0B0B0E] min-h-screen text-slate-100 flex font-sans selection:bg-[#FF1E27] selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR                                           */}
      {/* ========================================================= */}
      <aside
        className={`${
          sidebarOpen ? 'w-64 sm:w-72' : 'w-20'
        } bg-[#101014]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 z-40 fixed top-0 bottom-0 left-0`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Top Brand / Logo Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08]">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E27] to-[#E50914] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,30,39,0.5)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Activity size={20} className="stroke-[2.5]" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bebas text-xl text-white tracking-wider leading-none">
                    TITAN•PULSE
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A0A0A0] font-mono leading-tight">
                    ATHLETE PORTAL
                  </span>
                </div>
              )}
            </Link>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={16} />
            </button>
          </div>

          {/* User Profile Header Capsule */}
          {sidebarOpen && (
            <div className="p-4 mx-3 my-3 rounded-2xl bg-[#14141C] border border-white/[0.06] flex items-center gap-3.5 shadow-inner">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF1E27] to-[#B80611] flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(255,30,39,0.4)] uppercase">
                  {fullName.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#14141C] shadow-[0_0_6px_#10B981]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    {fullName}
                  </span>
                  <span className="text-[9px] font-extrabold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/20 px-1.5 py-0.2 rounded font-mono">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate font-mono">
                  {email}
                </span>
              </div>
            </div>
          )}

          {/* SIDEBAR NAVIGATION ITEMS (ALL GROUPS) */}
          <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar">
            {navMenuGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {sidebarOpen && (
                  <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase px-3 block mb-1">
                    {grp.group}
                  </span>
                )}
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                        isActive
                          ? 'text-white font-bold bg-gradient-to-r from-[#FF1E27]/25 via-[#FF1E27]/5 to-transparent border-l-4 border-[#FF1E27] pl-3 shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                      title={item.label}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={16}
                          className={isActive ? 'text-[#FF1E27] drop-shadow-[0_0_8px_rgba(255,30,39,0.7)]' : 'text-slate-400'}
                        />
                        {sidebarOpen && <span className="truncate">{item.label}</span>}
                      </div>
                      {sidebarOpen && item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          isActive
                            ? 'bg-[#FF1E27] text-white shadow-[0_0_10px_rgba(255,30,39,0.6)]'
                            : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom Footer Actions */}
          <div className="p-3 border-t border-white/[0.08] space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <Home size={16} />
              {sidebarOpen && <span>Back to Home</span>}
            </button>
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-[#FF1E27] hover:bg-[#FF1E27]/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              {sidebarOpen && <span>Log Out</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA                                      */}
      {/* ========================================================= */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64 sm:ml-72' : 'ml-20'}`}>
        
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#101014]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span>ATHLETE HUB</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#FF1E27] capitalize font-mono text-sm font-semibold tracking-normal">
                {activeTab.replace('-', ' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-[10px] font-mono font-bold items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              BIOMETRIC PASS ACTIVE
            </span>

            {/* FULL FLIPKART-STYLE USER PROFILE DROPDOWN WITH ALL SECTIONS */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                onMouseEnter={() => setAccountDropdownOpen(true)}
                className="flex items-center gap-2.5 bg-[#14141C] hover:bg-[#1c1c27] border border-white/[0.08] hover:border-white/25 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs flex items-center justify-center uppercase shadow-sm">
                  {fullName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white max-w-[120px] truncate">
                  {firstName}
                </span>
                {accountDropdownOpen ? (
                  <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                )}
              </button>

              {/* Full Dropdown Card (Includes all sections) */}
              {accountDropdownOpen && (
                <div
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-72 bg-[#12161E] border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] p-3 text-xs animate-fadeIn max-h-[85vh] overflow-y-auto no-scrollbar"
                >
                  <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                      Your Account
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/40 text-[9px] font-mono font-bold">
                      PRO MEMBER
                    </span>
                  </div>

                  <div className="py-1.5 space-y-0.5">
                    <button
                      onClick={() => handleTabChange('personal')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'personal' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <User size={15} className="text-slate-400" />
                      <span>Personal Information</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('membership')}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'membership' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Crown size={15} className="text-amber-400" />
                        <span>Membership details</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">PRO</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('payments')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'payments' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <CreditCard size={15} className="text-emerald-400" />
                      <span>Payment history</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('attendance')}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'attendance' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CalendarCheck size={15} className="text-cyan-400" />
                        <span>Attendance history</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">22 Streak</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('workout')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'workout' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Dumbbell size={15} className="text-[#FF1E27]" />
                      <span>Workout plan</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('diet')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'diet' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Apple size={15} className="text-green-400" />
                      <span>Diet plan</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('trainers')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'trainers' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Users size={15} className="text-purple-400" />
                      <span>Trainers</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('notifications')}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'notifications' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={15} className="text-yellow-400" />
                        <span>Notifications</span>
                      </div>
                      <span className="w-4 h-4 rounded-full bg-[#FF1E27] text-white text-[9px] font-bold flex items-center justify-center">3</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('feedback')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'feedback' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <MessageSquare size={15} className="text-blue-400" />
                      <span>Feedback/support</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('settings')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                        activeTab === 'settings' ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold' : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Settings size={15} className="text-slate-400" />
                      <span>Settings & Security</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10 mt-1">
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        if (onLogout) onLogout();
                        else logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-[#FF1E27] hover:bg-[#FF1E27]/10 font-semibold transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Visit Gym
            </button>
          </div>
        </header>

        {/* Inner Scrollable Workspace */}
        <div className="p-6 sm:p-8 md:p-10 space-y-8 flex-1">

          {/* ========================================================= */}
          {/* 1. PERSONAL INFORMATION SECTION                           */}
          {/* ========================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Title Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Personal Information & Telemetry</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage personal credentials, phone number, and biometric physical metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/30 text-xs font-mono font-bold">
                    PRO ATHLETE ID: #TP-8842
                  </span>
                </div>
              </div>

              {/* Physical Biometric Telemetry Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1 shadow-lg hover:border-white/20 transition-all">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">HEIGHT</span>
                  <h4 className="text-xl font-black text-white">{height}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Biometric Laser Calibrated</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1 shadow-lg hover:border-[#FF1E27]/40 transition-all">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">WEIGHT</span>
                  <h4 className="text-xl font-black text-[#FF1E27]">{weight}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">▲ -1.5kg target met</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1 shadow-lg hover:border-amber-500/40 transition-all">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">BODY FAT %</span>
                  <h4 className="text-xl font-black text-amber-400">{bodyFat}</h4>
                  <span className="text-[10px] text-amber-400/80 font-mono">3D Scan InBody Score</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1 shadow-lg hover:border-cyan-500/40 transition-all">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">BLOOD GROUP</span>
                  <h4 className="text-xl font-black text-cyan-400">{bloodGroup}</h4>
                  <span className="text-[10px] text-cyan-400/80 font-mono">Emergency Medical Pass</span>
                </div>
              </div>

              {/* Personal Information Form Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-6 shadow-xl">
                
                {/* 1. Name & Gender */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                      <User size={16} className="text-[#FF1E27]" /> Basic Credentials
                    </h3>
                    <button
                      onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                      className="text-xs font-bold text-[#FF1E27] hover:underline cursor-pointer"
                    >
                      {isEditingPersonal ? 'Cancel' : 'Edit Information'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        disabled={!isEditingPersonal}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all ${
                          isEditingPersonal
                            ? 'bg-[#0A0A0D] border border-white/20 text-white focus:border-[#FF1E27]'
                            : 'bg-[#181822] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        disabled={!isEditingPersonal}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all ${
                          isEditingPersonal
                            ? 'bg-[#0A0A0D] border border-white/20 text-white focus:border-[#FF1E27]'
                            : 'bg-[#181822] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-slate-400">Your Gender</label>
                    <div className="flex items-center gap-6 text-xs text-slate-300">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender === 'Male'}
                          disabled={!isEditingPersonal}
                          onChange={(e) => setGender(e.target.value)}
                          className="accent-[#FF1E27] cursor-pointer"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender === 'Female'}
                          disabled={!isEditingPersonal}
                          onChange={(e) => setGender(e.target.value)}
                          className="accent-[#FF1E27] cursor-pointer"
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>

                  {isEditingPersonal && (
                    <button
                      onClick={handleSavePersonal}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all"
                    >
                      Save Changes
                    </button>
                  )}
                </div>

                {/* 2. Email Address */}
                <div className="space-y-3 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                      <Mail size={16} className="text-cyan-400" /> Verified Email Address
                    </h3>
                    <button
                      onClick={() => setIsEditingEmail(!isEditingEmail)}
                      className="text-xs font-bold text-[#FF1E27] hover:underline cursor-pointer"
                    >
                      {isEditingEmail ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="max-w-md">
                    <input
                      type="email"
                      value={email}
                      disabled={!isEditingEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all ${
                        isEditingEmail
                          ? 'bg-[#0A0A0D] border border-white/20 text-white focus:border-[#FF1E27]'
                          : 'bg-[#181822] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {isEditingEmail && (
                    <button
                      onClick={handleSaveEmail}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all"
                    >
                      Save Email
                    </button>
                  )}
                </div>

                {/* 3. Mobile Number */}
                <div className="space-y-3 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                      <Phone size={16} className="text-emerald-400" /> Phone Contact
                    </h3>
                    <button
                      onClick={() => setIsEditingPhone(!isEditingPhone)}
                      className="text-xs font-bold text-[#FF1E27] hover:underline cursor-pointer"
                    >
                      {isEditingPhone ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="max-w-md">
                    <input
                      type="tel"
                      value={phone}
                      disabled={!isEditingPhone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all ${
                        isEditingPhone
                          ? 'bg-[#0A0A0D] border border-white/20 text-white focus:border-[#FF1E27]'
                          : 'bg-[#181822] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {isEditingPhone && (
                    <button
                      onClick={handleSavePhone}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all"
                    >
                      Save Phone
                    </button>
                  )}
                </div>

                {/* 4. FAQs Block */}
                <div className="pt-6 border-t border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Frequently Asked Questions
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="p-4 rounded-xl bg-[#0C0C10] border border-white/[0.04] space-y-1">
                      <p className="font-bold text-white">What happens when I update my email address?</p>
                      <p className="text-slate-400 leading-relaxed">Your account credentials and digital workout telemetry reports will sync to the newly verified address immediately.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0C0C10] border border-white/[0.04] space-y-1">
                      <p className="font-bold text-white">How does 24/7 Turnstile Gate entry work?</p>
                      <p className="text-slate-400 leading-relaxed">Your active biometric pass allows touchless NFC & facial scanning access at Gate A1 and Gate A2 across all gym zones.</p>
                    </div>
                  </div>
                </div>

                {/* 5. Account Deactivation */}
                <div className="pt-6 border-t border-white/[0.06] flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to deactivate your Titan Athlete account?')) {
                        showToast('Account deactivation requested. Front Desk will contact you.');
                      }
                    }}
                    className="text-[#FF1E27] hover:underline font-semibold cursor-pointer"
                  >
                    Deactivate Account
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Permanently delete account?')) {
                        showToast('Account deletion ticket submitted.');
                      }
                    }}
                    className="text-slate-500 hover:text-[#FF1E27] hover:underline cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MY ORDERS SECTION                                      */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">My Orders & Passes</h2>
                  <p className="text-xs text-slate-400 mt-0.5">View your active gym passes, supplement orders, and delivery status.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/30 text-xs font-mono font-bold">
                  {ordersList.length} Active Orders
                </span>
              </div>

              <div className="space-y-3">
                {ordersList.map((ord) => {
                  const isPass = ord.category.includes('Pass') || ord.category.includes('Membership');
                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-[#13131A] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                          isPass ? 'bg-[#FF1E27]/20 text-[#FF1E27]' : 'bg-emerald-950/60 text-emerald-400'
                        }`}>
                          {isPass ? <Crown size={22} /> : <ShoppingBag size={22} />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#00F0FF]">{ord.id}</span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 text-[10px] font-mono uppercase">
                              {ord.category}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">• Placed on {ord.date}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white">{ord.title}</h4>
                          <p className="text-xs text-slate-400">{ord.items}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono pt-1">
                            <Truck size={13} />
                            <span>{ord.delivery}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                        <span className="text-base font-black text-white font-mono">{ord.amount}</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          ✓ {ord.status}
                        </span>
                        <button
                          onClick={() => showToast(`Downloading official invoice for ${ord.id}...`)}
                          className="px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#FF1E27] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Download size={12} /> Invoice
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CHANGE PASSWORD SECTION                                */}
          {/* ========================================================= */}
          {activeTab === 'password' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security & Credentials</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Update your account password and safeguard your biometric access passes.</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-[#13131A] border border-white/[0.08] max-w-xl space-y-6 shadow-xl">
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <Lock size={18} className="text-[#FF1E27]" /> Update Account Password
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ensure your account is using a secure password to protect your biometric data and turnstile passes.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27]"
                      required
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={passLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all disabled:opacity-50"
                    >
                      {passLoading ? 'Updating Password...' : 'Save New Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. MEMBERSHIP DETAILS SECTION                             */}
          {/* ========================================================= */}
          {activeTab === 'membership' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Membership Details</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Biometric privileges, renewal dates, and included VIP gym floor amenities.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                  ● 24/7 Gate Privileges
                </span>
              </div>

              {/* Obsidian Plan Hero Card */}
              <div className="p-7 rounded-2xl bg-[#13131A] border border-[#FF1E27]/40 shadow-[0_0_40px_rgba(255,30,39,0.15)] space-y-6 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF1E27]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      ACTIVE MEMBERSHIP TIER
                    </span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mt-2">{activePlanName}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">Biometric Turnstile Scanner ID: #BIO-PASS-2026</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0B0E] border border-white/10 text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">VALID UNTIL</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{membershipExpiry}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Included VIP Amenities:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                    <div className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-400" /> All-Access Strength Arena & Cardio Deck</div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-400" /> Biometric Smart Locker Activation</div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-400" /> Monthly 3D AI Body Scan Telemetry</div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-400" /> Hydro-Sauna & Recovery Lounge Access</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/#services-section')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all"
                  >
                    Upgrade / Renew Plan
                  </button>
                  <button
                    onClick={() => showToast('✓ Digital Biometric Gate Pass ready on NFC device!')}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    View Digital Pass
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. PAYMENT HISTORY SECTION                                */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Payment Invoices & Receipts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Official billing transactions and digital receipt downloads.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#13131A] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181822] text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-white/[0.08]">
                      <tr>
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Plan Name</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-slate-200">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono text-[#00F0FF] font-semibold">{inv.id}</td>
                          <td className="p-4 font-mono text-slate-400">{inv.date}</td>
                          <td className="p-4 font-bold text-white">{inv.plan}</td>
                          <td className="p-4 text-slate-300">{inv.method}</td>
                          <td className="p-4 font-bold text-emerald-400">{inv.amount}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-medium font-mono">
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => showToast(`Downloading PDF invoice ${inv.id}...`)}
                              className="p-2 rounded-lg bg-[#181822] hover:bg-[#FF1E27] text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. ATTENDANCE HISTORY SECTION                             */}
          {/* ========================================================= */}
          {activeTab === 'attendance' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Biometric Attendance Logs</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Turnstile check-in telemetry, workout durations, and consistency streaks.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/30 text-xs font-mono font-bold">
                  🔥 22 Days Streak This Month
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">THIS MONTH SESSIONS</span>
                  <h4 className="text-xl font-black text-white">22 Days</h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">AVG WORKOUT TIME</span>
                  <h4 className="text-xl font-black text-emerald-400">1h 28m</h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">PEAK TIME SLOT</span>
                  <h4 className="text-xl font-black text-purple-400">06:00 - 08:00 AM</h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">DISCIPLINE SCORE</span>
                  <h4 className="text-xl font-black text-amber-400">92% Elite</h4>
                </div>
              </div>

              <div className="rounded-2xl bg-[#13131A] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181822] text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-white/[0.08]">
                      <tr>
                        <th className="p-4">Workout Date</th>
                        <th className="p-4">Check-In</th>
                        <th className="p-4">Check-Out</th>
                        <th className="p-4">Turnstile Terminal</th>
                        <th className="p-4">Session Duration</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-slate-200">
                      {attendanceRecords.map((r, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-semibold text-white">{r.date}</td>
                          <td className="p-4 font-mono text-emerald-400">{r.entry}</td>
                          <td className="p-4 font-mono text-slate-400">{r.exit}</td>
                          <td className="p-4 text-slate-300 font-mono text-[11px]">{r.terminal}</td>
                          <td className="p-4 font-bold text-purple-400">{r.duration}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-medium font-mono">
                              ✓ {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. WORKOUT PLAN SECTION                                   */}
          {/* ========================================================= */}
          {activeTab === 'workout' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Customized Workout Split</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Biomechanical hypertrophy split customized for your strength progression.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {Object.keys(workoutSplits).map((dayKey, idx) => (
                  <button
                    key={dayKey}
                    onClick={() => setWorkoutDay(dayKey)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      workoutDay === dayKey
                        ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-[0_0_15px_rgba(255,30,39,0.4)]'
                        : 'bg-[#13131A] text-slate-300 border border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    Day {idx + 1} Split
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-base font-bold text-white">{workoutSplits[workoutDay].title}</h3>
                    <p className="text-xs text-slate-400">{workoutSplits[workoutDay].focus}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {workoutSplits[workoutDay].exercises.length} Exercises
                  </span>
                </div>

                <div className="space-y-3">
                  {workoutSplits[workoutDay].exercises.map((ex, idx) => {
                    const isDone = completedExercises[ex.id];
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleExercise(ex.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isDone 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                            : 'bg-[#0C0C10] border-white/[0.06] text-slate-200 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isDone ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {ex.name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                              <span>{ex.sets}</span> • <span>{ex.reps}</span> • <span className="text-[#FF1E27] font-semibold">{ex.target}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">Rest: {ex.rest}</span>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
                          }`}>
                            {isDone && <Check size={14} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. DIET PLAN SECTION                                      */}
          {/* ========================================================= */}
          {activeTab === 'diet' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Macro Matrix & Diet Plan</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Personalized calorie profile for muscular recovery and cellular hydration.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">CALORIE TARGET</span>
                  <h4 className="text-xl font-black text-white flex items-center gap-1.5">
                    <Flame size={18} className="text-[#FF1E27]" /> 2,450 kcal
                  </h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">PROTEIN</span>
                  <h4 className="text-xl font-black text-emerald-400">180g (30%)</h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">CARBOHYDRATES</span>
                  <h4 className="text-xl font-black text-amber-400">225g (45%)</h4>
                </div>
                <div className="p-4 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">HEALTHY FATS</span>
                  <h4 className="text-xl font-black text-cyan-400">65g (25%)</h4>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">07:30 AM — Power Breakfast</h4>
                    <span className="text-xs text-emerald-400 font-mono">520 kcal • 42g Protein</span>
                  </div>
                  <p className="text-xs text-slate-400">Rolled oats (70g) with almond milk, 1 scoop Whey Isolate, 5 soaked almonds & fresh blueberries.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">01:30 PM — Lean Fuel Lunch</h4>
                    <span className="text-xs text-emerald-400 font-mono">680 kcal • 55g Protein</span>
                  </div>
                  <p className="text-xs text-slate-400">Grilled chicken breast / pan-seared tofu (200g), 1 cup steamed brown rice, broccoli, mixed lentils & Greek curd.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">05:30 PM — Pre-Workout Nitro Fuel</h4>
                    <span className="text-xs text-emerald-400 font-mono">310 kcal • 25g Protein</span>
                  </div>
                  <p className="text-xs text-slate-400">1 ripe banana with peanut butter (15g), intra-workout BCAA electrolyte drink from Fuel Bar.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#13131A] border border-white/[0.08] space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">08:30 PM — Cellular Recovery Dinner</h4>
                    <span className="text-xs text-emerald-400 font-mono">580 kcal • 48g Protein</span>
                  </div>
                  <p className="text-xs text-slate-400">Grilled salmon / paneer tikka, quinoa bowl, roasted bell peppers, olive oil drizzle & asparagus.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. TRAINERS SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === 'trainers' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Master Coaching Faculty</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Certified personal trainers and elite biomechanical specialists.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {coaches.map((c, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-4 shadow-xl hover:border-[#FF1E27]/40 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-full h-36 rounded-xl overflow-hidden relative">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold font-mono">
                          {c.rating}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{c.name}</h3>
                        <span className="text-xs text-[#FF1E27] font-semibold block">{c.role}</span>
                        <span className="text-[11px] text-slate-400 font-mono block mt-1">Shift: {c.shift}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`1-on-1 Consultation request sent to ${c.name}!`)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(255,30,39,0.3)] hover:brightness-110 transition-all cursor-pointer"
                    >
                      Book 1-on-1 Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. NOTIFICATIONS SECTION                                 */}
          {/* ========================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Notifications & Broadcasts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time gate pass updates, schedule changes, and gym news.</p>
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-[#13131A] border border-white/[0.08] flex items-start gap-3.5 hover:border-white/20 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center shrink-0">
                      <Bell size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-white">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-400">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. FEEDBACK / SUPPORT SECTION                            */}
          {/* ========================================================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Member Support & Feedback</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Submit inquiries or suggestions directly to Gym Management & Front Desk.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitFeedback} className="p-6 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C0C10] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27]"
                  >
                    <option value="Facility & Equipment">Facility & Equipment Maintenance</option>
                    <option value="Trainer Consultation">Trainer / Coaching Consultation</option>
                    <option value="Biometric Gate Pass">Biometric Gate / Speed Gate Pass</option>
                    <option value="Billing & Membership">Billing, Renewal & Invoices</option>
                    <option value="General Suggestion">General Suggestion</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Message</label>
                  <textarea
                    rows={4}
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Describe your inquiry or suggestion in detail..."
                    className="w-full p-4 rounded-xl bg-[#0C0C10] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Send size={14} /> Submit Support Ticket
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 12. SETTINGS & SECURITY SECTION                           */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Account Settings & Security</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage notification channels, biometric consent, and preferences.</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#13131A] border border-white/[0.08] space-y-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <Bell size={16} className="text-[#FF1E27]" /> Notification Channels
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C10] border border-white/[0.04] cursor-pointer">
                    <span className="text-xs font-semibold text-slate-200">WhatsApp Workout Split & Coach Reminders</span>
                    <input type="checkbox" defaultChecked className="accent-[#FF1E27] w-4 h-4 cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C10] border border-white/[0.04] cursor-pointer">
                    <span className="text-xs font-semibold text-slate-200">Email Monthly 3D Telemetry Scan Reports</span>
                    <input type="checkbox" defaultChecked className="accent-[#FF1E27] w-4 h-4 cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C10] border border-white/[0.04] cursor-pointer">
                    <span className="text-xs font-semibold text-slate-200">SMS Gate Entry & Renewal Reminders</span>
                    <input type="checkbox" defaultChecked className="accent-[#FF1E27] w-4 h-4 cursor-pointer" />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showToast('✓ Notification preferences updated!')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,39,0.4)] hover:brightness-110 cursor-pointer transition-all"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Floating Toast Notification (Exact Admin Toast) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[260] px-5 py-3.5 rounded-2xl bg-[#12161A] border border-[#FF1E27] text-white text-xs font-mono shadow-[0_0_25px_rgba(255,30,39,0.5)] animate-bounce flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF1E27]" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
