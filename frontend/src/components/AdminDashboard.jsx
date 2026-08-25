import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Dumbbell,
  UserCog,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  Bell,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Send,
  CheckCircle,
  Clock,
  Activity,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Filter,
  DollarSign,
  UserPlus,
  FileText,
  Lock,
  Smartphone,
  Check,
  RefreshCw
} from 'lucide-react';
import GooeySearch from './GooeySearch';
import AddUserModal from './AddUserModal';

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'user' | 'customer' | 'trainer' | 'plan' | 'enquiry'

  // Dynamic Toast trigger
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // State Databases for Management Modules (Fetched Live from MongoDB)
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch Users Live from MongoDB Database
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('http://localhost:5050/api/users');
      const data = await res.json();
      if (res.ok && data?.data) {
        setUsersList(data.data);
      }
    } catch (err) {
      console.log('Error fetching users from database:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" from database?`)) return;
    try {
      const res = await fetch(`http://localhost:5050/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast(`User "${userName}" deleted from database.`);
        fetchUsers();
      } else {
        showToast('Failed to delete user.');
      }
    } catch (err) {
      showToast('Error connecting to backend API');
    }
  };

  const [customersList, setCustomersList] = useState([
    { id: 'CUST-301', name: 'Rohan Mehta', email: 'rohan@gmail.com', phone: '+91 9777666555', plan: 'Titan Elite All-Access', expiry: '2026-12-31', status: 'Active' },
    { id: 'CUST-302', name: 'Ananya Roy', email: 'ananya@gmail.com', phone: '+91 9666555444', plan: '3D Pro Telemetry Pass', expiry: '2026-09-15', status: 'Active' },
    { id: 'CUST-303', name: 'Kabir Verma', email: 'kabir.v@gmail.com', phone: '+91 9555444333', plan: 'Standard Fit Arena', expiry: '2026-08-30', status: 'Due Soon' },
    { id: 'CUST-304', name: 'Sneha Kapoor', email: 'sneha.k@gmail.com', phone: '+91 9444333222', plan: 'Titan Elite All-Access', expiry: '2026-11-20', status: 'Active' },
  ]);

  const [trainersList, setTrainersList] = useState([
    { id: 'TRN-501', name: 'Vikram Singh', spec: 'Hypertrophy & Powerlifting', clients: 24, shift: '06:00 AM - 02:00 PM', rating: '4.98 ★', status: 'On Duty' },
    { id: 'TRN-502', name: 'Elena Rostova', spec: 'Olympic Weightlifting', clients: 19, shift: '01:00 PM - 09:00 PM', rating: '4.95 ★', status: 'On Duty' },
    { id: 'TRN-503', name: 'Marcus Brody', spec: 'CrossFit & Conditioning', clients: 31, shift: '06:00 AM - 02:00 PM', rating: '4.99 ★', status: 'Off Duty' },
  ]);

  const [receptionistsList, setReceptionistsList] = useState([
    { id: 'REC-201', name: 'Priya Sharma', terminal: 'Gate Terminal A1', shift: 'Morning (06:00 - 14:00)', checkinsToday: 184, status: 'Online' },
    { id: 'REC-202', name: 'Amitabh Joshi', terminal: 'Gate Terminal B2', shift: 'Evening (14:00 - 22:00)', checkinsToday: 158, status: 'Online' },
  ]);

  const [plansList, setPlansList] = useState([
    { id: 'PLN-1', name: 'Titan Elite All-Access', price: 4999, duration: 'Monthly', perks: 'Biometric Access, 3D Telemetry, Personal Trainer 4x/mo, VIP Lounge' },
    { id: 'PLN-2', name: '3D Pro Telemetry Pass', price: 3499, duration: 'Monthly', perks: 'Biometric Scanner, Live Analytics, Locker Room Access' },
    { id: 'PLN-3', name: 'Standard Fit Arena', price: 1999, duration: 'Monthly', perks: 'Standard Gym Access, Cardio Zone, Locker' },
  ]);

  const [paymentsList, setPaymentsList] = useState([
    { id: 'INV-9081', customer: 'Rohan Mehta', amount: 4999, method: 'UPI / GPay', status: 'Paid', date: '2026-08-25' },
    { id: 'INV-9082', customer: 'Ananya Roy', amount: 3499, method: 'Credit Card', status: 'Paid', date: '2026-08-24' },
    { id: 'INV-9083', customer: 'Kabir Verma', amount: 1999, method: 'Razorpay', status: 'Pending', date: '2026-08-23' },
    { id: 'INV-9084', customer: 'Sneha Kapoor', amount: 4999, method: 'Cash', status: 'Paid', date: '2026-08-22' },
  ]);

  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 'LOG-701', name: 'Rohan Mehta', gate: 'Scanner A1', timeIn: '07:15 AM', timeOut: '08:45 AM', status: 'Verified' },
    { id: 'LOG-702', name: 'Ananya Roy', gate: 'Scanner B2', timeIn: '08:30 AM', timeOut: '09:50 AM', status: 'Verified' },
    { id: 'LOG-703', name: 'Kabir Verma', gate: 'Scanner A1', timeIn: '10:10 AM', timeOut: '--', status: 'Active Inside' },
    { id: 'LOG-704', name: 'Sneha Kapoor', gate: 'Scanner A2', timeIn: '11:05 AM', timeOut: '--', status: 'Active Inside' },
  ]);

  const [notificationsList, setNotificationsList] = useState([
    { id: 'NTF-1', title: 'Biometric Gate Update', msg: 'Scanner Terminal A1 firmware updated to v3.4.', target: 'All Staff', time: '10 mins ago' },
    { id: 'NTF-2', title: 'Membership Expiry Alert', msg: 'Sent 14 automated WhatsApp renewal notices.', target: 'Due Members', time: '1 hour ago' },
    { id: 'NTF-3', title: 'Masterclass Workshop', msg: 'Powerlifting clinic scheduled for Saturday at 5 PM.', target: 'All Members', time: '3 hours ago' },
  ]);

  const [enquiriesList, setEnquiriesList] = useState([
    { id: 'ENQ-401', name: 'Siddharth Rao', email: 'siddharth@gmail.com', phone: '+91 9111222333', goal: 'Muscle Gain & Personal Training', status: 'New', date: '2026-08-25' },
    { id: 'ENQ-402', name: 'Pooja Hegde', email: 'pooja.h@gmail.com', phone: '+91 9222333444', goal: 'Fat Loss & HIIT Classes', status: 'Contacted', date: '2026-08-24' },
    { id: 'ENQ-403', name: 'Karan Johar', email: 'karan@gmail.com', phone: '+91 9333444555', goal: 'VIP All-Access Pass', status: 'Trial Booked', date: '2026-08-23' },
  ]);

  // Form input temporary states for Add Modal
  const [formInputs, setFormInputs] = useState({
    name: '', email: '', phone: '', role: 'member', plan: 'Titan Elite All-Access', price: '', goal: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email) {
      showToast('Please fill required name and email fields');
      return;
    }

    if (modalType === 'user') {
      try {
        const res = await fetch('http://localhost:5050/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formInputs.name,
            email: formInputs.email,
            phone: formInputs.phone,
            role: formInputs.role,
            password: 'DefaultPass123!'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`User "${formInputs.name}" created in database as ${formInputs.role}!`);
          fetchUsers();
        } else {
          showToast(data.message || 'Error creating user');
        }
      } catch (err) {
        showToast('Error connecting to backend API');
      }
    } else if (modalType === 'customer') {
      const newCust = { id: `CUST-${Date.now().toString().slice(-3)}`, name: formInputs.name, email: formInputs.email, phone: formInputs.phone || '+91 9000000000', plan: formInputs.plan, expiry: '2027-01-01', status: 'Active' };
      setCustomersList([newCust, ...customersList]);
      showToast(`Customer "${formInputs.name}" registered!`);
    } else if (modalType === 'trainer') {
      const newTrn = { id: `TRN-${Date.now().toString().slice(-3)}`, name: formInputs.name, spec: formInputs.goal || 'General Fitness', clients: 0, shift: '06:00 AM - 02:00 PM', rating: '5.0 ★', status: 'On Duty' };
      setTrainersList([newTrn, ...trainersList]);
      showToast(`Trainer "${formInputs.name}" added to roster!`);
    } else if (modalType === 'enquiry') {
      const newEnq = { id: `ENQ-${Date.now().toString().slice(-3)}`, name: formInputs.name, email: formInputs.email, phone: formInputs.phone, goal: formInputs.goal || 'VIP Pass', status: 'New', date: '2026-08-25' };
      setEnquiriesList([newEnq, ...enquiriesList]);
      showToast(`Enquiry lead for "${formInputs.name}" created!`);
    }

    setShowAddModal(false);
    setFormInputs({ name: '', email: '', phone: '', role: 'member', plan: 'Titan Elite All-Access', price: '', goal: '' });
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'user-mgmt', label: 'User Management', icon: Users },
    { id: 'customer-mgmt', label: 'Customer Management', icon: UserCheck },
    { id: 'trainer-mgmt', label: 'Trainer Management', icon: Dumbbell },
    { id: 'receptionist-mgmt', label: 'Receptionist Mgmt', icon: UserCog },
    { id: 'membership-mgmt', label: 'Membership Mgmt', icon: ShieldCheck },
    { id: 'payment-billing', label: 'Payment & Billing', icon: CreditCard },
    { id: 'attendance-monitoring', label: 'Attendance Monitor', icon: CalendarCheck },
    { id: 'reports-analytics', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'enquiry-management', label: 'Enquiry Management', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#090C0E] text-white flex selection:bg-[#E50914] selection:text-white font-sans">

      {/* 1. SIDEBAR NAVIGATION */}
      <aside
        data-lenis-prevent="true"
        className={`${sidebarOpen ? 'w-64 sm:w-72' : 'w-20'} bg-[#12161A] border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 h-screen overflow-hidden no-scrollbar`}
      >

        <div>
          {/* Brand Logo Header */}
          <div className="h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
            <div onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                <Activity size={20} className="stroke-[2.5]" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white tracking-tight leading-none">
                    Titan<span className="text-[#FF2E4C]">Pulse</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-tight mt-0.5">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nav List */}
          <nav
            data-lenis-prevent="true"
            className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar"
          >
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'user-mgmt') fetchUsers();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${isActive
                      ? 'bg-[#FF2E4C] text-white shadow-[0_4px_16px_rgba(255,46,76,0.35)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  title={item.label}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-white/10 bg-[#090C0E]/50">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user?.name || 'abhishek'}
                  </span>
                  <span className="text-[10px] text-[#FF2E4C] font-medium">Super Admin</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/');
                }}
                className="text-slate-400 hover:text-[#FF2E4C] p-1.5 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onLogout) onLogout();
                navigate('/');
              }}
              className="w-full flex justify-center text-slate-400 hover:text-[#FF2E4C] py-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main
        data-lenis-prevent="true"
        className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen no-scrollbar"
      >

        {/* Top Header Bar */}
        <header className="h-20 px-6 sm:px-10 border-b border-white/10 bg-[#12161A]/80 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {navMenuItems.find(m => m.id === activeTab)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-xs text-slate-400 font-normal">
                Titan Pulse • Biometric Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Morphing Gooey Search */}
            <GooeySearch
              placeholder="Search telemetry, athletes, modules..."
              buttonLabel="Search"
              items={[
                { label: "User Management (MongoDB Sync)", tab: "user-mgmt" },
                { label: "Customer Management", tab: "customer-mgmt" },
                { label: "Trainer Management", tab: "trainer-mgmt" },
                { label: "Receptionist Management", tab: "receptionist-mgmt" },
                { label: "Membership Management", tab: "membership-mgmt" },
                { label: "Payment & Billing", tab: "payment-billing" },
                { label: "Attendance Monitoring", tab: "attendance-monitor" },
                { label: "Reports & Analytics", tab: "reports-analytics" },
                { label: "Notifications Control", tab: "notifications" },
                { label: "Enquiry Management", tab: "enquiry-management" },
                { label: "System Security & Settings", tab: "settings" },
                ...usersList.map(u => ({ label: `${u.name} (${u.role})`, tab: "user-mgmt" })),
                ...customersList.map(c => ({ label: `${c.name} (Member)`, tab: "customer-mgmt" })),
                ...trainersList.map(t => ({ label: `${t.name} (Coach)`, tab: "trainer-mgmt" }))
              ]}
              onChange={(val) => setSearchQuery(val)}
              onSelect={(item) => {
                if (item?.tab) {
                  setActiveTab(item.tab);
                  if (item.tab === 'user-mgmt') fetchUsers();
                  showToast(`Opened ${item.label}`);
                }
              }}
              bgTheme="#090C0E"
              textColor="#FFFFFF"
              accentColor="#FF2E4C"
            />
          </div>
        </header>

        {/* Dynamic Main Body Content based on Active Tab */}
        <div className="p-6 sm:p-10 space-y-8 flex-1">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">

              {/* Top KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 relative overflow-hidden shadow-xl group hover:border-[#FF2E4C]/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Total Revenue</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">₹24,85,900</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                      <DollarSign size={22} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp size={14} /> +18.4% vs last month
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 relative overflow-hidden shadow-xl group hover:border-[#FF2E4C]/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Registered Users</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{usersList.length}</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                      <Users size={22} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Live MongoDB Sync
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 relative overflow-hidden shadow-xl group hover:border-[#FF2E4C]/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Trainers on Duty</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">18 Coaches</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Dumbbell size={22} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-purple-400 flex items-center gap-1.5">
                    <Clock size={14} /> All 4 Zones Covered
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 relative overflow-hidden shadow-xl group hover:border-[#FF2E4C]/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Today's Check-ins</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">342</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <CalendarCheck size={22} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                    <Activity size={14} /> Peak Time: 06:00 PM
                  </span>
                </div>

              </div>

              {/* Quick Action Shortcuts Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1A0B10] to-[#12161A] border border-[#FF2E4C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-[#FF2E4C]" size={18} /> Quick Admin Actions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage members, add system staff, and register leads directly into database.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setModalType('customer'); setShowAddModal(true); }}
                    className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <UserPlus size={15} /> + New Customer
                  </button>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/20 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#FF2E4C] transition-all cursor-pointer"
                  >
                    <Plus size={15} /> Add User
                  </button>
                  <button
                    onClick={() => { setModalType('enquiry'); setShowAddModal(true); }}
                    className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/20 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#FF2E4C] transition-all cursor-pointer"
                  >
                    <HelpCircle size={15} /> + Lead Enquiry
                  </button>
                </div>
              </div>

              {/* Recent Biometric Stream & Financial Chart Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Live Biometric Scanner Stream */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Activity className="text-[#FF2E4C]" size={18} /> Live Check-in Stream
                    </h3>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                      Terminal A1 Active
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto no-scrollbar">
                    {attendanceLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-2xl bg-[#090C0E] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center font-bold text-xs">
                            {log.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-xs">{log.name}</span>
                            <span className="text-[11px] text-slate-400">{log.gate} • In: {log.timeIn}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications & System Alerts */}
                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Bell className="text-[#FF2E4C]" size={18} /> Notifications
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {notificationsList.map((ntf) => (
                      <div key={ntf.id} className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-white">{ntf.title}</span>
                          <span className="text-[10px] text-slate-400">{ntf.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{ntf.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: USER MANAGEMENT (LIVE MONGODB DATABASE DATA) */}
          {activeTab === 'user-mgmt' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                    User Management
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-0.5 rounded-full">
                      MongoDB Live ({usersList.length} Users)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">All registered users saved in MongoDB database.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchUsers}
                    className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white hover:border-[#FF2E4C] transition-all"
                    title="Refresh Users List"
                  >
                    <RefreshCw size={15} className={loadingUsers ? 'animate-spin text-[#FF2E4C]' : ''} />
                  </button>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Plus size={15} /> + Add User
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">User ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-slate-400">
                            Fetching live users from MongoDB...
                          </td>
                        </tr>
                      ) : usersList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-slate-400">
                            No registered users found in MongoDB database.
                          </td>
                        </tr>
                      ) : (
                        usersList
                          .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-slate-400 font-mono text-[11px] truncate max-w-[120px]">{u.id}</td>
                              <td className="p-4 font-semibold text-white">{u.name}</td>
                              <td className="p-4 text-slate-400">{u.email}</td>
                              <td className="p-4 text-slate-400">{u.phone}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${u.role === 'admin' ? 'bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/40' :
                                    u.role === 'trainer' ? 'bg-purple-950/60 text-purple-400 border border-purple-800' :
                                      u.role === 'receptionist' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                                        'bg-blue-950/60 text-blue-400 border border-blue-800'
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-emerald-400 text-xs font-medium">● {u.status || 'Active'}</span>
                              </td>
                              <td className="p-4 text-right space-x-1">
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="p-1.5 text-slate-400 hover:text-[#FF2E4C] transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER MANAGEMENT */}
          {activeTab === 'customer-mgmt' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Customer Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Database of registered gym members, active plans, and expiration tracking.</p>
                </div>
                <button
                  onClick={() => { setModalType('customer'); setShowAddModal(true); }}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <UserPlus size={15} /> Register New Customer
                </button>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Customer ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Membership Plan</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {customersList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-slate-400 text-[11px]">{c.id}</td>
                          <td className="p-4 font-semibold text-white">{c.name}</td>
                          <td className="p-4 text-slate-400">{c.email}<br />{c.phone}</td>
                          <td className="p-4 font-medium text-[#FF2E4C]">{c.plan}</td>
                          <td className="p-4 text-slate-400">{c.expiry}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${c.status === 'Active' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                              }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => showToast(`Extended pass for ${c.name}`)} className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 text-slate-300 text-xs font-medium hover:border-[#FF2E4C] transition-all">
                              Extend Pass
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

          {/* TAB 4: TRAINER MANAGEMENT */}
          {activeTab === 'trainer-mgmt' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Trainer & Coach Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Roster of certified master coaches, specializations, and client rosters.</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Plus size={15} /> + Add Coach to Roster
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trainersList.map((t) => (
                  <div key={t.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl hover:border-[#FF2E4C]/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] text-white font-bold text-lg flex items-center justify-center">
                        {t.name.charAt(0)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                        {t.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                      <span className="text-xs font-medium text-[#FF2E4C] block mt-0.5">{t.spec}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Clients Assigned:</span> <strong className="text-slate-200 font-semibold">{t.clients}</strong></div>
                      <div className="flex justify-between"><span>Shift Hours:</span> <strong className="text-slate-200 font-semibold">{t.shift}</strong></div>
                      <div className="flex justify-between"><span>Athlete Rating:</span> <strong className="text-amber-400 font-semibold">{t.rating}</strong></div>
                    </div>

                    <button
                      onClick={() => showToast(`Schedule updated for Coach ${t.name}`)}
                      className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-[#FF2E4C] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Manage Schedule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECEPTIONIST MANAGEMENT */}
          {activeTab === 'receptionist-mgmt' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Receptionist & Front Desk</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Front desk personnel, gate terminal assignments, and live check-in monitoring.</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Plus size={15} /> + Add Front Desk Staff
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {receptionistsList.map((r) => (
                  <div key={r.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                          <UserCog size={19} />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{r.name}</h3>
                          <span className="text-xs text-slate-400">{r.id}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                        {r.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Assigned Terminal:</span> <strong className="text-slate-200 font-semibold">{r.terminal}</strong></div>
                      <div className="flex justify-between"><span>Shift Timing:</span> <strong className="text-white">{r.shift}</strong></div>
                      <div className="flex justify-between"><span>Check-ins Processed Today:</span> <strong className="text-amber-400">{r.checkinsToday}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEMBERSHIP MANAGEMENT */}
          {activeTab === 'membership-mgmt' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Membership Plans & Tiers</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Configure access passes, monthly/annual rates, and biometric privileges.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plansList.map((p) => (
                  <div key={p.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#FF2E4C]/50 transition-all">
                    <div>
                      <span className="text-[11px] font-semibold text-[#FF2E4C] uppercase tracking-wider">{p.id}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                      <div className="text-2xl font-bold text-white my-2.5">
                        ₹{p.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {p.duration}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.perks}</p>
                    </div>

                    <button onClick={() => showToast(`Plan ${p.name} updated`)} className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-[#FF2E4C] text-slate-200 text-xs font-semibold transition-all cursor-pointer">
                      Edit Plan Perks
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT AND BILLING */}
          {activeTab === 'payment-billing' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Payment & Billing Logs</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Track membership transactions, digital invoices, and revenue methods.</p>
                </div>
                <button onClick={() => showToast('Generated monthly billing statement!')} className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all">
                  <Download size={15} /> Export Invoices
                </button>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {paymentsList.map((pay) => (
                        <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-[#FF2E4C] text-[11px]">{pay.id}</td>
                          <td className="p-4 font-semibold text-white">{pay.customer}</td>
                          <td className="p-4 font-bold text-white">₹{pay.amount.toLocaleString()}</td>
                          <td className="p-4 text-slate-400">{pay.method}</td>
                          <td className="p-4 text-slate-400">{pay.date}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${pay.status === 'Paid' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                              }`}>
                              {pay.status}
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

          {/* TAB 8: ATTENDANCE MONITORING */}
          {activeTab === 'attendance-monitoring' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Attendance Monitoring</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live gate scanner feeds, time-in / time-out logs, and access security.</p>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Log ID</th>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Gate Terminal</th>
                        <th className="p-4">Time In</th>
                        <th className="p-4">Time Out</th>
                        <th className="p-4">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {attendanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-slate-400 text-[11px]">{log.id}</td>
                          <td className="p-4 font-semibold text-white">{log.name}</td>
                          <td className="p-4 text-[#FF2E4C] font-medium">{log.gate}</td>
                          <td className="p-4 text-slate-300 font-mono">{log.timeIn}</td>
                          <td className="p-4 text-slate-400 font-mono">{log.timeOut}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                              {log.status}
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

          {/* TAB 9: REPORTS AND ANALYTICS */}
          {activeTab === 'reports-analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Reports & Analytics</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Business intelligence data on revenue, member retention, and workout metrics.</p>
                </div>
                <button onClick={() => showToast('Report PDF downloaded successfully!')} className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all">
                  <Download size={15} /> Export PDF Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white">Revenue Growth Performance</h3>
                  <div className="h-40 bg-[#090C0E] rounded-2xl border border-white/5 flex items-end p-4 gap-4 justify-between">
                    <div className="flex-1 bg-[#FF2E4C]/40 hover:bg-[#FF2E4C] h-[40%] rounded-t-lg transition-all text-center text-xs font-medium text-slate-300 pt-1">May</div>
                    <div className="flex-1 bg-[#FF2E4C]/60 hover:bg-[#FF2E4C] h-[65%] rounded-t-lg transition-all text-center text-xs font-medium text-slate-300 pt-1">Jun</div>
                    <div className="flex-1 bg-[#FF2E4C]/80 hover:bg-[#FF2E4C] h-[80%] rounded-t-lg transition-all text-center text-xs font-medium text-slate-300 pt-1">Jul</div>
                    <div className="flex-1 bg-[#FF2E4C] h-[95%] rounded-t-lg transition-all text-center text-xs font-semibold text-white pt-1">Aug</div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white">Retention & Renewal Metrics</h3>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-medium"><span>Titan Elite Renewals</span><strong className="text-white">96%</strong></div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="w-[96%] h-full bg-[#FF2E4C]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1.5 font-medium"><span>3D Telemetry Pass</span><strong className="text-white">92%</strong></div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="w-[92%] h-full bg-[#00F0FF]" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Broadcast Notifications</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Send instant push notifications and SMS broadcasts to members and staff.</p>
                </div>
                <button onClick={() => showToast('Broadcast notification sent to all active members!')} className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all">
                  <Send size={15} /> Send Broadcast
                </button>
              </div>

              <div className="space-y-3">
                {notificationsList.map(n => (
                  <div key={n.id} className="p-5 rounded-2xl bg-[#12161A] border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                    </div>
                    <span className="text-[11px] font-medium text-[#FF2E4C] bg-[#FF2E4C]/10 px-3 py-1 rounded-full border border-[#FF2E4C]/30">
                      {n.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: ENQUIRY MANAGEMENT */}
          {activeTab === 'enquiry-management' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Lead & Enquiry Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Follow up on prospective athlete leads and website membership enquiries.</p>
                </div>
                <button onClick={() => { setModalType('enquiry'); setShowAddModal(true); }} className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all">
                  <Plus size={15} /> Add New Enquiry
                </button>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Lead ID</th>
                        <th className="p-4">Prospect Name</th>
                        <th className="p-4">Contact Details</th>
                        <th className="p-4">Fitness Goal</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Pipeline Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {enquiriesList.map((enq) => (
                        <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-slate-400 text-[11px]">{enq.id}</td>
                          <td className="p-4 font-semibold text-white">{enq.name}</td>
                          <td className="p-4 text-slate-400">{enq.email}<br />{enq.phone}</td>
                          <td className="p-4 text-[#FF2E4C] font-medium">{enq.goal}</td>
                          <td className="p-4 text-slate-400">{enq.date}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800 text-[11px] font-medium">
                              {enq.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => showToast(`Converted ${enq.name} to member!`)} className="px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium hover:brightness-120 transition-all cursor-pointer">
                              Convert to Member
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

          {/* TAB 12: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">System & Gym Configuration</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure facility parameters, biometric scanner keys, and database backup.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">Facility Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Gym Name</label>
                      <input type="text" defaultValue="Titan Pulse 3D Fitness System" className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]" />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Admin Email</label>
                      <input type="email" defaultValue="abhigangamolla@gmail.com" className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">Biometric Scanner Security</h3>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Gate Terminal Scanner Hardware Protocol: <strong className="text-emerald-400">ACTIVE (v3.4)</strong></span>
                    <button onClick={() => showToast('Biometric scanner re-synced!')} className="px-3.5 py-1.5 rounded-lg bg-[#FF2E4C] text-white font-semibold cursor-pointer">
                      Re-sync Scanners
                    </button>
                  </div>
                </div>

                <button onClick={() => showToast('Settings saved successfully!')} className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all cursor-pointer">
                  Save All Configurations
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* DYNAMIC ADD MODAL FOR ENTITIES */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12161A] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[#8A94A0] hover:text-white">
              <X size={22} />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="text-[#FF2E4C]" size={22} />
              <h3 className="text-xl font-black font-heading text-white uppercase">
                ADD NEW {modalType.toUpperCase()}
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#8A94A0] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={formInputs.name}
                  onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8A94A0] block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={formInputs.email}
                  onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8A94A0] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 Phone"
                  value={formInputs.phone}
                  onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              {modalType === 'user' && (
                <div>
                  <label className="text-[#8A94A0] block mb-1">System Role</label>
                  <select
                    value={formInputs.role}
                    onChange={(e) => setFormInputs({ ...formInputs, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="admin">Admin</option>
                    <option value="trainer">Trainer</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              )}

              {modalType === 'trainer' && (
                <div>
                  <label className="text-[#8A94A0] block mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Bodybuilding & HIIT"
                    value={formInputs.goal}
                    onChange={(e) => setFormInputs({ ...formInputs, goal: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              )}

              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                Create & Save Entity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOUBLE SLIDING 3D MODAL TO ADD TRAINER & RECEPTIONIST */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={(newUser, role) => {
          fetchUsers();
          showToast(`Successfully added ${role}: ${newUser.name} to database!`);
        }}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[160] px-5 py-3.5 rounded-2xl bg-[#12161A] border border-[#FF2E4C] text-white text-xs font-mono shadow-[0_0_25px_rgba(255,46,76,0.4)] animate-bounce flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF2E4C]" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
