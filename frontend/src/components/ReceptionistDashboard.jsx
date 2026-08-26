import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ShieldCheck,
  RotateCw,
  CreditCard,
  FileText,
  CalendarCheck,
  Dumbbell,
  HelpCircle,
  Clock,
  Search,
  CheckCircle,
  AlertCircle,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Printer,
  Download,
  Plus,
  Send,
  Activity,
  ArrowRight,
  Filter,
  Check,
  X,
  RefreshCw,
  QrCode,
  DollarSign,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckSquare
} from 'lucide-react';
import GooeySearch from './GooeySearch';

export default function ReceptionistDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'customers' | 'memberships' | 'renewals' | 'payments' | 'invoices' | 'trainers' | 'enquiries' | 'expiries'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. CUSTOMERS DATABASE STATE
  // -------------------------------------------------------------
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-301',
      name: 'Rohan Mehta',
      email: 'rohan@gmail.com',
      phone: '+91 98765 43210',
      plan: 'Titan Elite All-Access',
      planDuration: 'Annual',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      status: 'Active',
      amountPaid: 49999,
      paymentMethod: 'UPI / GPay'
    },
    {
      id: 'CUST-302',
      name: 'Ananya Roy',
      email: 'ananya@gmail.com',
      phone: '+91 98123 45678',
      plan: '3D Pro Telemetry Pass',
      planDuration: 'Quarterly',
      startDate: '2026-06-15',
      expiryDate: '2026-09-15',
      status: 'Active',
      amountPaid: 9999,
      paymentMethod: 'Credit Card'
    },
    {
      id: 'CUST-303',
      name: 'Kabir Verma',
      email: 'kabir.v@gmail.com',
      phone: '+91 97654 32109',
      plan: 'Standard Fit Arena',
      planDuration: 'Monthly',
      startDate: '2026-07-30',
      expiryDate: '2026-08-30',
      status: 'Due Soon',
      amountPaid: 1999,
      paymentMethod: 'Cash'
    },
    {
      id: 'CUST-304',
      name: 'Sneha Kapoor',
      email: 'sneha.k@gmail.com',
      phone: '+91 96543 21098',
      plan: 'Titan Elite All-Access',
      planDuration: 'Half-Yearly',
      startDate: '2026-05-20',
      expiryDate: '2026-11-20',
      status: 'Active',
      amountPaid: 26999,
      paymentMethod: 'UPI'
    },
    {
      id: 'CUST-305',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@gmail.com',
      phone: '+91 95432 10987',
      plan: 'Standard Fit Arena',
      planDuration: 'Monthly',
      startDate: '2026-07-10',
      expiryDate: '2026-08-10',
      status: 'Expired',
      amountPaid: 1999,
      paymentMethod: 'Razorpay'
    }
  ]);

  // -------------------------------------------------------------
  // 2. CHECK-IN / CHECK-OUT LOGS
  // -------------------------------------------------------------
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 'LOG-101', name: 'Rohan Mehta', customerId: 'CUST-301', plan: 'Titan Elite Pass', terminal: 'Gate Terminal A1', timeIn: '08:15 AM', timeOut: '--', status: 'Active Inside' },
    { id: 'LOG-102', name: 'Ananya Roy', customerId: 'CUST-302', plan: '3D Telemetry Pass', terminal: 'Gate Terminal B2', timeIn: '08:42 AM', timeOut: '09:55 AM', status: 'Checked Out' },
    { id: 'LOG-103', name: 'Sneha Kapoor', customerId: 'CUST-304', plan: 'Titan Elite Pass', terminal: 'Gate Terminal A1', timeIn: '09:05 AM', timeOut: '--', status: 'Active Inside' },
    { id: 'LOG-104', name: 'Kabir Verma', customerId: 'CUST-303', plan: 'Standard Fit', terminal: 'Gate Terminal A2', timeIn: '09:30 AM', timeOut: '--', status: 'Active Inside' },
  ]);

  // -------------------------------------------------------------
  // 3. INVOICES & PAYMENTS DATABASE
  // -------------------------------------------------------------
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-01', customerName: 'Rohan Mehta', customerId: 'CUST-301', plan: 'Titan Elite All-Access (Annual)', amount: 49999, tax: 8999, total: 58998, date: '2026-01-01', paymentMethod: 'UPI / GPay', status: 'Paid' },
    { id: 'INV-2026-02', customerName: 'Ananya Roy', customerId: 'CUST-302', plan: '3D Pro Telemetry Pass (Quarterly)', amount: 9999, tax: 1799, total: 11798, date: '2026-06-15', paymentMethod: 'Credit Card', status: 'Paid' },
    { id: 'INV-2026-03', customerName: 'Kabir Verma', customerId: 'CUST-303', plan: 'Standard Fit Arena (Monthly)', amount: 1999, tax: 359, total: 2358, date: '2026-07-30', paymentMethod: 'Cash', status: 'Paid' },
    { id: 'INV-2026-04', customerName: 'Sneha Kapoor', customerId: 'CUST-304', plan: 'Titan Elite All-Access (Half-Yearly)', amount: 26999, tax: 4859, total: 31858, date: '2026-05-20', paymentMethod: 'UPI', status: 'Paid' },
  ]);

  // -------------------------------------------------------------
  // 4. TRAINER AVAILABILITY & SHIFTS
  // -------------------------------------------------------------
  const [trainers, setTrainers] = useState([
    { id: 'TRN-501', name: 'Vikram Singh', spec: 'Hypertrophy & Powerlifting', shift: '06:00 AM - 02:00 PM', clientsToday: 6, status: 'Available', phone: '+91 98888 11111' },
    { id: 'TRN-502', name: 'Elena Rostova', spec: 'Olympic Weightlifting', shift: '01:00 PM - 09:00 PM', clientsToday: 4, status: 'In Session', phone: '+91 98888 22222' },
    { id: 'TRN-503', name: 'Marcus Brody', spec: 'CrossFit & Conditioning', shift: '06:00 AM - 02:00 PM', clientsToday: 7, status: 'Available', phone: '+91 98888 33333' },
    { id: 'TRN-504', name: 'Aarav Patel', spec: 'Calisthenics & Mobility', shift: '02:00 PM - 10:00 PM', clientsToday: 3, status: 'Off Duty', phone: '+91 98888 44444' },
  ]);

  // -------------------------------------------------------------
  // 5. ENQUIRIES & LEADS PIPELINE
  // -------------------------------------------------------------
  const [enquiries, setEnquiries] = useState([
    { id: 'ENQ-401', name: 'Siddharth Rao', email: 'siddharth@gmail.com', phone: '+91 91112 22333', goal: 'Muscle Gain & PT', source: 'Instagram Ad', status: 'New Lead', date: '2026-08-26' },
    { id: 'ENQ-402', name: 'Pooja Hegde', email: 'pooja.h@gmail.com', phone: '+91 92223 33444', goal: 'Fat Loss & HIIT Decks', source: 'Walk-in', status: 'Contacted', date: '2026-08-25' },
    { id: 'ENQ-403', name: 'Karan Sharma', email: 'karan.s@gmail.com', phone: '+91 93334 44555', goal: 'VIP All-Access Pass', source: 'Referral', status: 'Trial Booked', date: '2026-08-24' },
    { id: 'ENQ-404', name: 'Meera Nambiar', email: 'meera.n@gmail.com', phone: '+91 94445 55666', goal: 'Strength Conditioning', source: 'Website', status: 'Converted', date: '2026-08-23' },
  ]);

  // -------------------------------------------------------------
  // MODALS STATE
  // -------------------------------------------------------------
  const [showRegModal, setShowRegModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Titan Elite All-Access',
    duration: 'Monthly',
    paymentMethod: 'UPI / GPay',
    amount: 4999
  });

  // Renewal Form State
  const [renewForm, setRenewForm] = useState({
    plan: 'Titan Elite All-Access',
    duration: 'Monthly',
    extensionMonths: 1,
    paymentMethod: 'UPI / GPay',
    amount: 4999
  });

  // New Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Muscle Gain & Strength',
    source: 'Walk-in'
  });

  // Quick Check-in input
  const [quickCheckinInput, setQuickCheckinInput] = useState('');

  // Handle Quick Check-in
  const handleQuickCheckin = (e) => {
    e.preventDefault();
    if (!quickCheckinInput.trim()) return;

    // Search in customers
    const matched = customers.find(c =>
      c.name.toLowerCase().includes(quickCheckinInput.toLowerCase()) ||
      c.id.toLowerCase() === quickCheckinInput.toLowerCase() ||
      c.phone.includes(quickCheckinInput)
    );

    const memberName = matched ? matched.name : quickCheckinInput;
    const memberId = matched ? matched.id : `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const memberPlan = matched ? matched.plan : 'Walk-in Verified Pass';

    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      name: memberName,
      customerId: memberId,
      plan: memberPlan,
      terminal: 'Gate Terminal A1',
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: '--',
      status: 'Active Inside'
    };

    setAttendanceLogs([newLog, ...attendanceLogs]);
    showToast(`✓ Access Granted: ${memberName} checked in at Gate A1!`);
    setQuickCheckinInput('');
  };

  // Handle Member Check-out
  const handleCheckoutMember = (logId, name) => {
    const timeOutStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return { ...log, timeOut: timeOutStr, status: 'Checked Out' };
      }
      return log;
    }));
    showToast(`✓ Check-out recorded: ${name} (${timeOutStr})`);
  };

  // Handle New Customer Registration
  const handleRegisterCustomer = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone) {
      showToast('Please fill all required customer details.');
      return;
    }

    const newId = `CUST-${300 + customers.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate expiry based on duration
    const expDate = new Date();
    if (regForm.duration === 'Monthly') expDate.setMonth(expDate.getMonth() + 1);
    else if (regForm.duration === 'Quarterly') expDate.setMonth(expDate.getMonth() + 3);
    else if (regForm.duration === 'Half-Yearly') expDate.setMonth(expDate.getMonth() + 6);
    else if (regForm.duration === 'Annual') expDate.setFullYear(expDate.getFullYear() + 1);

    const newCust = {
      id: newId,
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone,
      plan: regForm.plan,
      planDuration: regForm.duration,
      startDate: today,
      expiryDate: expDate.toISOString().split('T')[0],
      status: 'Active',
      amountPaid: Number(regForm.amount),
      paymentMethod: regForm.paymentMethod
    };

    setCustomers([newCust, ...customers]);

    // Create Invoice
    const taxAmt = Math.round(regForm.amount * 0.18);
    const newInv = {
      id: `INV-2026-${String(invoices.length + 1).padStart(2, '0')}`,
      customerName: regForm.name,
      customerId: newId,
      plan: `${regForm.plan} (${regForm.duration})`,
      amount: Number(regForm.amount),
      tax: taxAmt,
      total: Number(regForm.amount) + taxAmt,
      date: today,
      paymentMethod: regForm.paymentMethod,
      status: 'Paid'
    };

    setInvoices([newInv, ...invoices]);
    showToast(`✓ Registered ${regForm.name} (ID: ${newId})! Invoice generated.`);
    setShowRegModal(false);
    setRegForm({
      name: '',
      email: '',
      phone: '',
      plan: 'Titan Elite All-Access',
      duration: 'Monthly',
      paymentMethod: 'UPI / GPay',
      amount: 4999
    });
  };

  // Handle Membership Renewal
  const handleRenewSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const currentExp = new Date(selectedCustomer.expiryDate > new Date().toISOString().split('T')[0] ? selectedCustomer.expiryDate : new Date());
    currentExp.setMonth(currentExp.getMonth() + Number(renewForm.extensionMonths));
    const newExpiry = currentExp.toISOString().split('T')[0];

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          expiryDate: newExpiry,
          status: 'Active',
          plan: renewForm.plan,
          planDuration: renewForm.duration
        };
      }
      return c;
    }));

    // Create Renewal Invoice
    const taxAmt = Math.round(renewForm.amount * 0.18);
    const newInv = {
      id: `INV-2026-${String(invoices.length + 1).padStart(2, '0')}`,
      customerName: selectedCustomer.name,
      customerId: selectedCustomer.id,
      plan: `Renewal: ${renewForm.plan} (+${renewForm.extensionMonths} Months)`,
      amount: Number(renewForm.amount),
      tax: taxAmt,
      total: Number(renewForm.amount) + taxAmt,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: renewForm.paymentMethod,
      status: 'Paid'
    };

    setInvoices([newInv, ...invoices]);
    showToast(`✓ Membership renewed for ${selectedCustomer.name} until ${newExpiry}!`);
    setShowRenewModal(false);
  };

  // Handle New Enquiry Lead
  const handleCreateEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast('Please enter name and phone.');
      return;
    }

    const newEnq = {
      id: `ENQ-${400 + enquiries.length + 1}`,
      name: enquiryForm.name,
      email: enquiryForm.email || 'N/A',
      phone: enquiryForm.phone,
      goal: enquiryForm.goal,
      source: enquiryForm.source,
      status: 'New Lead',
      date: new Date().toISOString().split('T')[0]
    };

    setEnquiries([newEnq, ...enquiries]);
    showToast(`✓ Lead captured for ${enquiryForm.name}!`);
    setShowEnquiryModal(false);
    setEnquiryForm({ name: '', email: '', phone: '', goal: 'Muscle Gain & Strength', source: 'Walk-in' });
  };

  // Nav menu tabs
  const navTabs = [
    { id: 'checkin', label: 'Gate Check-in', icon: CalendarCheck, count: attendanceLogs.filter(l => l.status === 'Active Inside').length },
    { id: 'customers', label: 'Customer Management', icon: Users, count: customers.length },
    { id: 'memberships', label: 'Membership Plans', icon: ShieldCheck },
    { id: 'renewals', label: 'Membership Renewals', icon: RotateCw, count: customers.filter(c => c.status === 'Due Soon' || c.status === 'Expired').length },
    { id: 'payments', label: 'Payment Collection', icon: CreditCard },
    { id: 'invoices', label: 'Invoice & Receipts', icon: FileText, count: invoices.length },
    { id: 'trainers', label: 'Trainer Availability', icon: Dumbbell, count: trainers.filter(t => t.status === 'Available').length },
    { id: 'enquiries', label: 'Enquiry Leads', icon: HelpCircle, count: enquiries.filter(e => e.status === 'New Lead').length },
    { id: 'expiries', label: 'Expiry Tracking', icon: Clock, count: customers.filter(c => c.status === 'Due Soon').length },
  ];

  // Active inside gym count
  const activeInsideCount = attendanceLogs.filter(l => l.status === 'Active Inside').length;
  const dueSoonCount = customers.filter(c => c.status === 'Due Soon' || c.status === 'Expired').length;

  return (
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#090C0E] text-white flex selection:bg-[#FF2E4C] selection:text-white font-sans">
      
      {/* 1. RECEPTIONIST SIDEBAR NAVIGATION */}
      <aside
        data-lenis-prevent="true"
        className={`${sidebarOpen ? 'w-64 sm:w-72' : 'w-20'} bg-[#12161A] border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 h-screen overflow-hidden no-scrollbar`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Activity size={20} className="stroke-[2.5]" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white tracking-tight leading-none">
                    Titan<span className="text-amber-400">Pulse</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase leading-tight mt-0.5">
                    Receptionist Desk
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Nav List */}
          <nav
            data-lenis-prevent="true"
            className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-[0_4px_16px_rgba(245,158,11,0.35)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={tab.label}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon size={17} className={isActive ? 'text-black' : 'text-slate-400'} />
                    {sidebarOpen && <span className="truncate">{tab.label}</span>}
                  </div>
                  {sidebarOpen && tab.count !== undefined && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black/30 text-black font-bold' : 'bg-[#090C0E] text-amber-400 border border-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
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
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : 'R'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user?.name || 'Front Desk'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">Front Desk Officer</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/');
                }}
                className="text-slate-400 hover:text-amber-400 p-1.5 transition-colors"
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
              className="w-full flex justify-center text-slate-400 hover:text-amber-400 py-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEW */}
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
              <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {navTabs.find(t => t.id === activeTab)?.label || 'Receptionist Desk'}
              </h1>
              <p className="text-xs text-slate-400 font-normal">
                Terminal Gate A1 • Active Inside: <strong className="text-emerald-400">{activeInsideCount} Athletes</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: Register New Customer */}
            <button
              onClick={() => setShowRegModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 transition-all cursor-pointer"
            >
              <UserPlus size={15} /> + New Customer
            </button>

            {/* Quick Action: Capture Enquiry */}
            <button
              onClick={() => setShowEnquiryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#090C0E] border border-white/10 hover:border-amber-400 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle size={15} className="text-amber-400" /> + Enquiry
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-10 space-y-8 flex-1">

          {/* ============================================================ */}
          {/* TAB 1: GATE CHECK-IN / CHECK-OUT TERMINAL                     */}
          {/* ============================================================ */}
          {activeTab === 'checkin' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Quick Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Active Inside Gym</span>
                    <h3 className="text-3xl font-bold text-emerald-400 font-heading">{activeInsideCount}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
                    <UserCheck size={24} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Today's Total Check-ins</span>
                    <h3 className="text-3xl font-bold text-white font-heading">{attendanceLogs.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800 flex items-center justify-center text-blue-400">
                    <CalendarCheck size={24} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Trainers on Floor</span>
                    <h3 className="text-3xl font-bold text-amber-400 font-heading">
                      {trainers.filter(t => t.status === 'Available' || t.status === 'In Session').length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400">
                    <Dumbbell size={24} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Memberships Due Soon</span>
                    <h3 className="text-3xl font-bold text-[#FF2E4C] font-heading">{dueSoonCount}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center text-[#FF2E4C]">
                    <Clock size={24} />
                  </div>
                </div>
              </div>

              {/* Fast Barcode / Search Member Check-In Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1A140B] to-[#12161A] border border-amber-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <QrCode size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Biometric & RFID Gate Scanner Terminal</h3>
                      <p className="text-xs text-slate-400">Scan member card, type customer ID (e.g. CUST-301), or search name to grant instant entry.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono">
                    ● Scanner Terminal A1 Online
                  </span>
                </div>

                <form onSubmit={handleQuickCheckin} className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Scan RFID barcode or enter Customer Name / Phone / ID (e.g. Rohan Mehta, CUST-301)..."
                      value={quickCheckinInput}
                      onChange={(e) => setQuickCheckinInput(e.target.value)}
                      className="w-full bg-[#090C0E] border border-white/15 rounded-2xl px-5 py-3.5 pl-12 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shrink-0"
                  >
                    <UserCheck size={16} /> Grant Gate Access
                  </button>
                </form>
              </div>

              {/* Attendance Log Table with Instant Check-out Action */}
              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="text-amber-400" size={18} /> Live Gate Access Logs
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Today's Session</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Log ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Membership Pass</th>
                        <th className="p-4">Gate Terminal</th>
                        <th className="p-4">Time In</th>
                        <th className="p-4">Time Out</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {attendanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-slate-400">{log.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{log.name}</span>
                            <span className="text-[10px] text-amber-400 font-mono">{log.customerId}</span>
                          </td>
                          <td className="p-4 font-medium text-slate-300">{log.plan}</td>
                          <td className="p-4 text-slate-400">{log.terminal}</td>
                          <td className="p-4 text-emerald-400 font-mono">{log.timeIn}</td>
                          <td className="p-4 text-slate-400 font-mono">{log.timeOut}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              log.status === 'Active Inside' 
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                                : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                              ● {log.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {log.status === 'Active Inside' ? (
                              <button
                                onClick={() => handleCheckoutMember(log.id, log.name)}
                                className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-red-500/50 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all cursor-pointer"
                              >
                                Check Out
                              </button>
                            ) : (
                              <span className="text-slate-500 text-xs font-mono">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: CUSTOMER SEARCH AND MANAGEMENT                        */}
          {/* ============================================================ */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Customer Search & Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Search gym members, view plan status, contact athletes, and process renewals.</p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  <UserPlus size={15} /> Register New Customer
                </button>
              </div>

              {/* Search Bar Filter */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search customer by name, email, phone, or ID (e.g. CUST-301)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12161A] border border-white/10 rounded-2xl px-5 py-3.5 pl-12 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>

              {/* Customers Table */}
              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Customer ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Membership Plan</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {customers
                        .filter(c => 
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(c => (
                          <tr key={c.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-amber-400 font-bold">{c.id}</td>
                            <td className="p-4 font-bold text-white">{c.name}</td>
                            <td className="p-4 text-slate-300">
                              <span className="block">{c.phone}</span>
                              <span className="text-[11px] text-slate-500">{c.email}</span>
                            </td>
                            <td className="p-4 font-semibold text-slate-200">{c.plan}</td>
                            <td className="p-4 text-slate-400">{c.planDuration}</td>
                            <td className="p-4 font-mono text-slate-300">{c.expiryDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                c.status === 'Active' 
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                                  : c.status === 'Due Soon'
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                  : 'bg-red-950/60 text-red-400 border border-red-800'
                              }`}>
                                ● {c.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setShowRenewModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-amber-500/50 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold transition-all cursor-pointer"
                              >
                                Renew Plan
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

          {/* ============================================================ */}
          {/* TAB 3: MEMBERSHIP PLANS CATALOG                              */}
          {/* ============================================================ */}
          {activeTab === 'memberships' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Membership Plans Catalog</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Titan Pulse tier packages, pricing structures, and included perks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Plan 1 */}
                <div className="p-6 rounded-3xl bg-[#12161A] border border-amber-500/40 space-y-4 shadow-2xl relative">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                    MOST POPULAR
                  </span>
                  <h3 className="text-2xl font-black font-heading text-white">TITAN ELITE ALL-ACCESS</h3>
                  <div className="text-3xl font-black text-amber-400 font-heading">
                    ₹4,999 <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> All 4 Gym Zones & Biometric Scanner Access</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> 3D Telemetry & Body Composition Scan</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> 4x Personal Trainer Sessions / month</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Sub-Zero Cryo Chamber Access</li>
                  </ul>
                  <button 
                    onClick={() => {
                      setRegForm(prev => ({ ...prev, plan: 'Titan Elite All-Access', amount: 4999 }));
                      setShowRegModal(true);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
                  >
                    Register Member on this Plan
                  </button>
                </div>

                {/* Plan 2 */}
                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl">
                  <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-black uppercase tracking-wider">
                    ADVANCED TELEMETRY
                  </span>
                  <h3 className="text-2xl font-black font-heading text-white">3D PRO TELEMETRY PASS</h3>
                  <div className="text-3xl font-black text-blue-400 font-heading">
                    ₹3,499 <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Biometric Scanner Access</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Live Telemetry Cloud Sync</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Cardio & Strength Arena Access</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Digital Locker Access</li>
                  </ul>
                  <button 
                    onClick={() => {
                      setRegForm(prev => ({ ...prev, plan: '3D Pro Telemetry Pass', amount: 3499 }));
                      setShowRegModal(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#090C0E] border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:border-blue-400 transition-all cursor-pointer"
                  >
                    Register Member on this Plan
                  </button>
                </div>

                {/* Plan 3 */}
                <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl">
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-black uppercase tracking-wider">
                    ESSENTIALS
                  </span>
                  <h3 className="text-2xl font-black font-heading text-white">STANDARD FIT ARENA</h3>
                  <div className="text-3xl font-black text-slate-300 font-heading">
                    ₹1,999 <span className="text-xs font-normal text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Standard Strength & Free Weights Zone</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Cardio Deck Access</li>
                    <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> Standard Locker Room</li>
                  </ul>
                  <button 
                    onClick={() => {
                      setRegForm(prev => ({ ...prev, plan: 'Standard Fit Arena', amount: 1999 }));
                      setShowRegModal(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#090C0E] border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:border-white transition-all cursor-pointer"
                  >
                    Register Member on this Plan
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: MEMBERSHIP RENEWALS & EXPIRY TRACKING                 */}
          {/* ============================================================ */}
          {(activeTab === 'renewals' || activeTab === 'expiries') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Membership Expiry Tracking & Renewals</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Track upcoming expirations, dispatch WhatsApp renewal alerts, and process renewal extensions.</p>
                </div>
              </div>

              {/* Expiry Alerts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 block">Due within 7 Days</span>
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {customers.filter(c => c.status === 'Due Soon').length} Members
                    </h3>
                  </div>
                  <AlertTriangle className="text-amber-400" size={28} />
                </div>

                <div className="p-5 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-red-400 block">Expired Memberships</span>
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {customers.filter(c => c.status === 'Expired').length} Members
                    </h3>
                  </div>
                  <AlertCircle className="text-red-400" size={28} />
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 block">Active & Good Standing</span>
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {customers.filter(c => c.status === 'Active').length} Members
                    </h3>
                  </div>
                  <CheckCircle className="text-emerald-400" size={28} />
                </div>
              </div>

              {/* Renewal Action Table */}
              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Member ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone / WhatsApp</th>
                        <th className="p-4">Current Plan</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {customers
                        .filter(c => c.status === 'Due Soon' || c.status === 'Expired')
                        .map(c => (
                          <tr key={c.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-amber-400 font-bold">{c.id}</td>
                            <td className="p-4 font-bold text-white">{c.name}</td>
                            <td className="p-4 text-slate-300">{c.phone}</td>
                            <td className="p-4 text-slate-300">{c.plan}</td>
                            <td className="p-4 font-mono text-red-400 font-bold">{c.expiryDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                c.status === 'Due Soon' 
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800' 
                                  : 'bg-red-950/60 text-red-400 border border-red-800'
                              }`}>
                                ● {c.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => showToast(`📲 WhatsApp reminder sent to ${c.name} (${c.phone})`)}
                                className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-emerald-400 text-emerald-400 text-xs font-medium transition-all"
                              >
                                Send Notice
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setShowRenewModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:brightness-110 transition-all cursor-pointer"
                              >
                                Process Renewal
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

          {/* ============================================================ */}
          {/* TAB 5: PAYMENT COLLECTION & INVOICES                         */}
          {/* ============================================================ */}
          {(activeTab === 'payments' || activeTab === 'invoices') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Payment Collection & Invoices</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Collect membership fees via UPI, Card, Cash, and generate official Tax Invoices.</p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  <CreditCard size={15} /> Collect New Payment
                </button>
              </div>

              {/* Invoices List */}
              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Plan / Service</th>
                        <th className="p-4">Base Fee</th>
                        <th className="p-4">GST (18%)</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-amber-400 font-bold">{inv.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{inv.customerName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{inv.customerId}</span>
                          </td>
                          <td className="p-4 text-slate-300">{inv.plan}</td>
                          <td className="p-4 font-mono text-slate-400">₹{inv.amount.toLocaleString()}</td>
                          <td className="p-4 font-mono text-slate-400">₹{inv.tax.toLocaleString()}</td>
                          <td className="p-4 font-mono text-emerald-400 font-bold text-sm">₹{inv.total.toLocaleString()}</td>
                          <td className="p-4 text-slate-300">{inv.paymentMethod}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                              ● {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowInvoiceModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-amber-400 text-amber-400 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <FileText size={13} /> View Receipt
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

          {/* ============================================================ */}
          {/* TAB 6: TRAINER AVAILABILITY                                  */}
          {/* ============================================================ */}
          {activeTab === 'trainers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Trainer Live Availability & Shifts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time duty status of master coaches to book personal training sessions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trainers.map(t => (
                  <div key={t.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center">
                          {t.name.charAt(0)}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          t.status === 'Available' 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                            : t.status === 'In Session'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            : 'bg-slate-900 text-slate-500 border border-slate-700'
                        }`}>
                          ● {t.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                      <span className="text-xs text-amber-400 font-medium block mt-0.5">{t.spec}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Shift:</span> <strong className="text-white">{t.shift}</strong></div>
                      <div className="flex justify-between"><span>Active Clients:</span> <strong className="text-emerald-400 font-bold">{t.clientsToday}</strong></div>
                      <div className="flex justify-between"><span>Contact:</span> <strong className="text-slate-300">{t.phone}</strong></div>
                    </div>

                    <button
                      onClick={() => showToast(`Session scheduled with Coach ${t.name}`)}
                      className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-amber-400 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Assign Member to Coach
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: ENQUIRY LEADS MANAGEMENT                              */}
          {/* ============================================================ */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Visitor & Lead Enquiry Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Capture prospect inquiries, track follow-ups, and convert leads into registered gym members.</p>
                </div>
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus size={15} /> + New Enquiry
                </button>
              </div>

              <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Enquiry ID</th>
                        <th className="p-4">Lead Name</th>
                        <th className="p-4">Contact Details</th>
                        <th className="p-4">Fitness Goal</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {enquiries.map(enq => (
                        <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-amber-400 font-bold">{enq.id}</td>
                          <td className="p-4 font-bold text-white">{enq.name}</td>
                          <td className="p-4 text-slate-300">
                            <span className="block">{enq.phone}</span>
                            <span className="text-[10px] text-slate-500">{enq.email}</span>
                          </td>
                          <td className="p-4 text-slate-300">{enq.goal}</td>
                          <td className="p-4 text-slate-400">{enq.source}</td>
                          <td className="p-4 text-slate-400 font-mono">{enq.date}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              enq.status === 'Converted'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                : enq.status === 'Trial Booked'
                                ? 'bg-blue-950/60 text-blue-400 border border-blue-800'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            }`}>
                              ● {enq.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setRegForm({
                                  name: enq.name,
                                  email: enq.email !== 'N/A' ? enq.email : '',
                                  phone: enq.phone,
                                  plan: 'Titan Elite All-Access',
                                  duration: 'Monthly',
                                  paymentMethod: 'UPI / GPay',
                                  amount: 4999
                                });
                                setShowRegModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:brightness-110 transition-all cursor-pointer"
                            >
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

        </div>
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: REGISTER NEW CUSTOMER                                */}
      {/* ============================================================ */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#12161A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowRegModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="text-amber-400" size={22} />
                <h3 className="text-xl font-bold text-white">Register New Customer</h3>
              </div>
              <p className="text-xs text-slate-400">Onboard a member, assign membership pass, and record initial payment.</p>
            </div>

            <form onSubmit={handleRegisterCustomer} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  required
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="email@domain.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    required
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    required
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Membership Plan</label>
                  <select 
                    value={regForm.plan}
                    onChange={(e) => {
                      const p = e.target.value;
                      let amt = 4999;
                      if (p === '3D Pro Telemetry Pass') amt = 3499;
                      if (p === 'Standard Fit Arena') amt = 1999;
                      setRegForm({ ...regForm, plan: p, amount: amt });
                    }}
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                  >
                    <option value="Titan Elite All-Access">Titan Elite All-Access</option>
                    <option value="3D Pro Telemetry Pass">3D Pro Telemetry Pass</option>
                    <option value="Standard Fit Arena">Standard Fit Arena</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Duration</label>
                  <select 
                    value={regForm.duration}
                    onChange={(e) => setRegForm({ ...regForm, duration: e.target.value })}
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                  >
                    <option value="Monthly">1 Month (Monthly)</option>
                    <option value="Quarterly">3 Months (Quarterly)</option>
                    <option value="Half-Yearly">6 Months (Half-Yearly)</option>
                    <option value="Annual">12 Months (Annual)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Payment Method</label>
                  <select 
                    value={regForm.paymentMethod}
                    onChange={(e) => setRegForm({ ...regForm, paymentMethod: e.target.value })}
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash (Counter)</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={regForm.amount}
                    onChange={(e) => setRegForm({ ...regForm, amount: e.target.value })}
                    className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-amber-400 font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer mt-2"
              >
                Complete Registration & Issue Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: MEMBERSHIP RENEWAL                                  */}
      {/* ============================================================ */}
      {showRenewModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#12161A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowRenewModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <RotateCw className="text-amber-400" size={22} />
                <h3 className="text-xl font-bold text-white">Renew Membership</h3>
              </div>
              <p className="text-xs text-slate-400">
                Renewing for: <strong className="text-white">{selectedCustomer.name}</strong> ({selectedCustomer.id})
              </p>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Selected Plan</label>
                <select 
                  value={renewForm.plan}
                  onChange={(e) => setRenewForm({ ...renewForm, plan: e.target.value })}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="Titan Elite All-Access">Titan Elite All-Access (₹4,999/mo)</option>
                  <option value="3D Pro Telemetry Pass">3D Pro Telemetry Pass (₹3,499/mo)</option>
                  <option value="Standard Fit Arena">Standard Fit Arena (₹1,999/mo)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Extension Period</label>
                <select 
                  value={renewForm.extensionMonths}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setRenewForm({ ...renewForm, extensionMonths: m, amount: 4999 * m });
                  }}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value={1}>+1 Month Extension</option>
                  <option value={3}>+3 Months (Quarterly)</option>
                  <option value={6}>+6 Months (Half-Yearly)</option>
                  <option value={12}>+12 Months (Annual Pass)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Payment Method</label>
                <select 
                  value={renewForm.paymentMethod}
                  onChange={(e) => setRenewForm({ ...renewForm, paymentMethod: e.target.value })}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="UPI / GPay">UPI / GPay</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash (Counter)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090C0E] border border-white/10 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Renewal Fee:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">₹{renewForm.amount.toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                Confirm & Extend Membership
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: OFFICIAL TAX INVOICE & RECEIPT (PRINTABLE)           */}
      {/* ============================================================ */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#12161A] border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Printable Invoice Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-6">
              <div>
                <span className="font-bebas text-3xl text-white tracking-wider">
                  TITAN<span className="text-amber-400">•</span>PULSE
                </span>
                <p className="text-[10px] text-slate-400 font-mono">3D FITNESS SYSTEM • GSTIN: 36AAACT1234F1Z9</p>
                <p className="text-[10px] text-slate-400">Cyber Arena Complex, High-Tech City</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                  TAX INVOICE
                </span>
                <h4 className="text-sm font-mono font-bold text-amber-400 mt-2">{selectedInvoice.id}</h4>
                <span className="text-[11px] text-slate-400 font-mono">{selectedInvoice.date}</span>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Billed To:</span>
              <h4 className="text-base font-bold text-white">{selectedInvoice.customerName}</h4>
              <p className="text-slate-400 font-mono">Member ID: {selectedInvoice.customerId}</p>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/10 text-slate-400 uppercase text-[10px] font-semibold">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between py-1 text-white">
                <span>{selectedInvoice.plan}</span>
                <span className="font-mono">₹{selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Integrated GST (18%)</span>
                <span className="font-mono">₹{selectedInvoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t border-white/10 text-base font-bold text-emerald-400 font-mono">
                <span>Total Paid ({selectedInvoice.paymentMethod})</span>
                <span>₹{selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
              >
                <Printer size={15} /> Print Official Receipt
              </button>
              <button 
                onClick={() => {
                  showToast('✓ Invoice PDF downloaded!');
                  setShowInvoiceModal(false);
                }}
                className="px-5 py-3 rounded-xl bg-[#090C0E] border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:border-amber-400 transition-all cursor-pointer"
              >
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: NEW ENQUIRY LEAD CAPTURE                            */}
      {/* ============================================================ */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#12161A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="text-amber-400" size={22} />
                <h3 className="text-xl font-bold text-white">Capture Visitor Enquiry Lead</h3>
              </div>
              <p className="text-xs text-slate-400">Record prospect details and fitness goals for front desk follow-up.</p>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Prospect Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Siddharth Rao"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  required
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  required
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  placeholder="siddharth@gmail.com"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Primary Fitness Goal</label>
                <select 
                  value={enquiryForm.goal}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, goal: e.target.value })}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="Muscle Gain & Hypertrophy">Muscle Gain & Hypertrophy</option>
                  <option value="Fat Loss & Cardio Conditioning">Fat Loss & Cardio Conditioning</option>
                  <option value="Personal Trainer (1-on-1)">Personal Trainer (1-on-1)</option>
                  <option value="Cryotherapy & Recovery">Cryotherapy & Recovery</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Enquiry Source</label>
                <select 
                  value={enquiryForm.source}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, source: e.target.value })}
                  className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-400"
                >
                  <option value="Walk-in">Walk-in Visitor</option>
                  <option value="Instagram / Social">Instagram / Social</option>
                  <option value="Member Referral">Member Referral</option>
                  <option value="Website Booking">Website Booking</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                Save Enquiry Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[160] px-5 py-3.5 rounded-2xl bg-[#12161A] border border-amber-500 text-white text-xs font-mono shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-bounce flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
