import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Crown,
  Users,
  UserCheck,
  UserCog,
  Dumbbell,
  Trophy,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  CreditCard,
  Building2,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  DollarSign,
  BarChart3,
  Calendar,
  Clock,
  Mail,
  Phone,
  Eye,
  Sliders,
  Bell,
  Check,
  X,
  Radio,
  Flame,
  Waves,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import api from "../../../../../lib/api";

const FACILITIES = [
  { id: "flagship", name: "PAMS Flagship Hub (Downtown Arena)", code: "PAMS-01", status: "Active", capacity: "92%", members: 1420, revenue: "₹18,45,000" },
  { id: "north", name: "PAMS North Olympic Sports Park", code: "PAMS-02", status: "Active", capacity: "78%", members: 890, revenue: "₹12,20,000" },
  { id: "east", name: "PAMS East Fitness Complex", code: "PAMS-03", status: "Active", capacity: "65%", members: 640, revenue: "₹8,75,000" },
];

export default function SuperAdminDashboard({ user: propUser, onLogout }) {
  const { user: authUser, logout } = useAuth();
  const user = propUser || authUser;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // overview, admins, facilities, security
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "success" });

  // New staff creation state
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "ADMIN",
    branchId: "all_branches",
    activities: ["Gym", "Yoga", "Zumba", "Basketball", "Badminton", "Swimming"],
  });

  // Fetch all users across platform
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get("/users");
      const list = res.data?.users || res.data || [];
      if (Array.isArray(list)) {
        setUsersList(list);
      }
    } catch (err) {
      console.warn("Could not fetch user registry:", err.message);
      // Fallback preview data
      setUsersList([
        {
          _id: "sa-1",
          name: "Super Admin Abhishek",
          email: "abhinani@gmail.com",
          phone: "+91 9876543210",
          role: "SUPER_ADMIN",
          branchId: "all_branches",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "adm-1",
          name: "Gym Admin Vikram",
          email: "gymadmin@titangym.com",
          phone: "+91 9876543219",
          role: "ADMIN",
          branchId: "main_branch",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "tr-1",
          name: "Coach Jayanth",
          email: "jayanth@titangym.com",
          phone: "+91 9876543212",
          role: "TRAINER",
          branchId: "main_branch",
          specialization: "IFBB Pro Strength Coach",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "rec-1",
          name: "Priya Sharma",
          email: "receptionist@titangym.com",
          phone: "+91 9876543213",
          role: "RECEPTIONIST",
          branchId: "main_branch",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "cust-1",
          name: "Alex Mercer",
          email: "customer@titangym.com",
          phone: "+91 9876543214",
          role: "CUSTOMER",
          membershipPlan: "TITAN DUAL PASS",
          membershipStatus: "Active",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (text, type = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: "", type: "success" }), 4000);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      showNotification("Please fill in Name, Email and Password", "error");
      return;
    }
    try {
      await api.post("/users", newStaff);
      showNotification(`Account created successfully for ${newStaff.name} as ${newStaff.role}`);
      setShowCreateModal(false);
      setNewStaff({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "ADMIN",
        branchId: "all_branches",
        activities: ["Gym", "Yoga", "Zumba", "Basketball", "Badminton", "Swimming"],
      });
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to create user account.", "error");
    }
  };

  const handleUpdateRole = async (userId, targetRole) => {
    try {
      await api.put(`/users/${userId}`, { role: targetRole });
      showNotification(`Role updated to ${targetRole} successfully.`);
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update role.", "error");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/users/${userId}`);
      showNotification(`Account ${userName} removed from system.`);
      fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to remove user.", "error");
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logout();
    navigate("/", { replace: true });
  };

  // Metrics computations
  const metrics = useMemo(() => {
    const totalUsers = usersList.length;
    const superAdmins = usersList.filter((u) => (u.role || "").toUpperCase() === "SUPER_ADMIN").length;
    const admins = usersList.filter((u) => (u.role || "").toUpperCase() === "ADMIN").length;
    const trainers = usersList.filter((u) => (u.role || "").toUpperCase() === "TRAINER").length;
    const receptionists = usersList.filter((u) => (u.role || "").toUpperCase() === "RECEPTIONIST").length;
    const customers = usersList.filter((u) => (u.role || "").toUpperCase() === "CUSTOMER" || !u.role).length;

    return {
      totalUsers,
      superAdmins,
      admins,
      trainers,
      receptionists,
      customers,
      totalRevenue: "₹39,40,000",
      activePasses: 2950,
      activeArenas: 24,
    };
  }, [usersList]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchRole = roleFilter === "ALL" || (u.role || "").toUpperCase() === roleFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);
      return matchRole && matchQuery;
    });
  }, [usersList, roleFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090C] text-neutral-200 flex flex-col selection:bg-[#FF2E4C] selection:text-white font-sans">
      {/* 1. TOP MASTER BAR */}
      <header className="sticky top-0 z-40 bg-[#0C1015]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 select-none group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2E4C] via-[#FF526B] to-[#00F0FF] p-[1.5px] shadow-[0_0_20px_rgba(255,46,76,0.35)]">
              <div className="w-full h-full bg-[#07090C] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-black text-xl text-white">P</span>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black tracking-wider text-xl text-white">PAMS</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C] text-[9px] font-mono font-black uppercase tracking-wider">
                  SUPER ADMIN HQ
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
                MASTER COMMAND CENTER
              </span>
            </div>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Jump Dropdown / Buttons */}
          <div className="hidden lg:flex items-center gap-2 bg-[#07090C] p-1 rounded-full border border-white/[0.08]">
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Launch Standard Admin Operations"
            >
              <LayoutDashboard size={13} className="text-[#FF2E4C]" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => navigate("/receptionist")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Front Desk Terminal"
            >
              <UserCog size={13} className="text-amber-400" />
              <span>Reception Desk</span>
            </button>
            <button
              onClick={() => navigate("/trainer")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Coach & Schedule Hub"
            >
              <Dumbbell size={13} className="text-purple-400" />
              <span>Trainer Hub</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#07090C] border border-white/10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF2E4C] to-purple-600 flex items-center justify-center text-white text-xs font-black">
              <Crown size={12} />
            </div>
            <span className="text-xs font-bold text-white max-w-[120px] truncate">
              {user?.name || "Super Admin"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. NOTIFICATION BANNER */}
      {feedbackMsg.text && (
        <div
          className={`px-6 py-2.5 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in duration-200 ${
            feedbackMsg.type === "error"
              ? "bg-rose-950/80 border-b border-rose-800 text-rose-300"
              : "bg-emerald-950/80 border-b border-emerald-800 text-emerald-300"
          }`}
        >
          {feedbackMsg.type === "error" ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#FF2E4C] text-white shadow-[0_0_20px_rgba(255,46,76,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Activity size={14} />
              <span>Platform Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "admins"
                  ? "bg-[#FF2E4C] text-white shadow-[0_0_20px_rgba(255,46,76,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Shield size={14} />
              <span>Staff & Role Governance ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("facilities")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "facilities"
                  ? "bg-[#FF2E4C] text-white shadow-[0_0_20px_rgba(255,46,76,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Building2 size={14} />
              <span>Arenas & Facilities (3)</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#FF2E4C] text-white shadow-[0_0_20px_rgba(255,46,76,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Lock size={14} />
              <span>Security & Audit Logs</span>
            </button>
          </div>

          {/* Create Staff Quick Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white text-xs font-bold uppercase tracking-wider hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,76,0.35)] cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus size={14} />
            <span>Create Staff / Admin</span>
          </button>
        </div>

        {/* ================= TAB 1: EXECUTIVE OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 font-mono">
                    Total Platform Revenue
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-heading font-black text-white">{metrics.totalRevenue}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp size={12} />
                    <span>+24.6% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 font-mono">
                    Total Registered Users
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-heading font-black text-white">{metrics.totalUsers}</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {metrics.superAdmins} Super Admins • {metrics.admins} Admins • {metrics.trainers} Coaches
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 font-mono">
                    Active Membership Passes
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Crown size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-heading font-black text-white">{metrics.activePasses}</div>
                  <div className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} />
                    <span>Titan Dual & Single Passes</span>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 font-mono">
                    Multi-Arena Operations
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-heading font-black text-white">{metrics.activeArenas} Arenas</div>
                  <div className="text-xs text-neutral-400 mt-1">Across 3 Mega Facilities</div>
                </div>
              </div>
            </div>

            {/* Platform Role Hierarchy Matrix */}
            <div className="rounded-3xl bg-[#0C1015] border border-white/[0.08] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-white uppercase">
                    PLATFORM ROLE & PRIVILEGE MATRIX
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Strict RBAC privilege distribution enforcing root system governance.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  ENFORCED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* SUPER_ADMIN */}
                <div className="p-4 rounded-2xl bg-[#141820] border border-[#FF2E4C]/40 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center mb-3">
                    <Crown size={16} />
                  </div>
                  <h4 className="font-heading font-black text-base text-white">SUPER_ADMIN</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Master root access. Manage platform admins, financial ledgers, facility creation, and global settings.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-[#FF2E4C] font-bold">
                    Count: {metrics.superAdmins} Active
                  </div>
                </div>

                {/* ADMIN */}
                <div className="p-4 rounded-2xl bg-[#141820] border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                    <Shield size={16} />
                  </div>
                  <h4 className="font-heading font-black text-base text-white">ADMIN</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Facility administrator. Manage customers, trainers, staff scheduling, plans, and attendance.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-cyan-400 font-bold">
                    Count: {metrics.admins} Active
                  </div>
                </div>

                {/* RECEPTIONIST */}
                <div className="p-4 rounded-2xl bg-[#141820] border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <UserCog size={16} />
                  </div>
                  <h4 className="font-heading font-black text-base text-white">RECEPTIONIST</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Front-desk terminal. Member check-in, attendance QR verification, POS billing & inquiries.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-amber-400 font-bold">
                    Count: {metrics.receptionists} Active
                  </div>
                </div>

                {/* TRAINER */}
                <div className="p-4 rounded-2xl bg-[#141820] border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Dumbbell size={16} />
                  </div>
                  <h4 className="font-heading font-black text-base text-white">TRAINER</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Coach & instructor. Oversee member diet plans, workout schedules, slots, and coaching sessions.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-purple-400 font-bold">
                    Count: {metrics.trainers} Active
                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="p-4 rounded-2xl bg-[#141820] border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <UserCheck size={16} />
                  </div>
                  <h4 className="font-heading font-black text-base text-white">CUSTOMER</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Athletes & pass holders. Book arena court slots, gym sessions, track metrics & manage profile.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-emerald-400 font-bold">
                    Count: {metrics.customers} Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: STAFF & ROLE GOVERNANCE ================= */}
        {activeTab === "admins" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0C1015] p-4 rounded-2xl border border-white/[0.08]">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#07090C] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF2E4C]"
                />
              </div>

              {/* Role filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {["ALL", "SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "TRAINER", "CUSTOMER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      roleFilter === role
                        ? "bg-white text-black font-extrabold"
                        : "bg-white/[0.04] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Registry Table */}
            <div className="rounded-3xl bg-[#0C1015] border border-white/[0.08] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                      <th className="py-4 px-6">User / Identity</th>
                      <th className="py-4 px-6">Assigned Role</th>
                      <th className="py-4 px-6">Contact / Phone</th>
                      <th className="py-4 px-6">Branch Jurisdiction</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono">
                          No users found matching current criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const rawRole = String(u.role || "CUSTOMER").toUpperCase().trim();
                        const role = rawRole === "SUPERADMIN" ? "SUPER_ADMIN" : rawRole;
                        const isPrimarySuper = u.email === "abhinani@gmail.com";

                        return (
                          <tr key={u._id || u.email} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs uppercase ${
                                    role === "SUPER_ADMIN"
                                      ? "bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C]"
                                      : role === "ADMIN"
                                        ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                                        : role === "TRAINER"
                                          ? "bg-purple-500/20 border border-purple-500/40 text-purple-400"
                                          : role === "RECEPTIONIST"
                                            ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                                            : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                  }`}
                                >
                                  {role === "SUPER_ADMIN" ? (
                                    <Crown size={16} />
                                  ) : (
                                    (u.name || "U").charAt(0)
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{u.name || "Unnamed User"}</span>
                                    {isPrimarySuper && (
                                      <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded font-mono">
                                        PRIMARY
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-neutral-400 text-[11px] font-mono">{u.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                                  role === "SUPER_ADMIN"
                                    ? "bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/40"
                                    : role === "ADMIN"
                                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                      : role === "TRAINER"
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                                        : role === "RECEPTIONIST"
                                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                }`}
                              >
                                {role}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-neutral-300 font-mono">
                              {u.phone || "—"}
                            </td>

                            <td className="py-4 px-6">
                              <span className="text-neutral-300 text-xs">
                                {u.branchId === "all_branches" ? "All Facilities" : u.branchId || "Flagship Hub"}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowEditModal(true);
                                  }}
                                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                  title="Edit Role & Permissions"
                                >
                                  <Edit size={14} />
                                </button>
                                {!isPrimarySuper && (
                                  <button
                                    onClick={() => handleDeleteUser(u._id, u.name)}
                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                    title="Delete Account"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FACILITIES & ARENAS ================= */}
        {activeTab === "facilities" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FACILITIES.map((fac) => (
                <div
                  key={fac.id}
                  className="rounded-3xl bg-[#0C1015] border border-white/[0.08] p-6 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                        {fac.code}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {fac.status}
                      </span>
                    </div>

                    <h4 className="font-heading font-black text-xl text-white">{fac.name}</h4>

                    <div className="grid grid-cols-3 gap-2 my-5 pt-4 border-t border-white/[0.06] text-center">
                      <div className="p-2 rounded-xl bg-[#07090C] border border-white/[0.04]">
                        <div className="text-[10px] text-neutral-400 font-mono">MEMBERS</div>
                        <div className="text-sm font-bold text-white mt-0.5">{fac.members}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#07090C] border border-white/[0.04]">
                        <div className="text-[10px] text-neutral-400 font-mono">CAPACITY</div>
                        <div className="text-sm font-bold text-amber-400 mt-0.5">{fac.capacity}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#07090C] border border-white/[0.04]">
                        <div className="text-[10px] text-neutral-400 font-mono">REVENUE</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">{fac.revenue}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/admin")}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Manage Facility Floor</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SECURITY & AUDIT ================= */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server Status Card */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading font-black text-lg text-white uppercase">SYSTEM HEALTH TELEMETRY</h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#07090C] border border-white/[0.04]">
                    <span className="text-neutral-400">Database Connection</span>
                    <span className="text-emerald-400 font-bold">MongoDB Atlas (Connected)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#07090C] border border-white/[0.04]">
                    <span className="text-neutral-400">JWT Token Expiry</span>
                    <span className="text-white font-bold">7 Days Rolling Session</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#07090C] border border-white/[0.04]">
                    <span className="text-neutral-400">RBAC Enforcement</span>
                    <span className="text-cyan-400 font-bold">Strict 5-Tier Hierarchy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#07090C] border border-white/[0.04]">
                    <span className="text-neutral-400">Active Super Admin User</span>
                    <span className="text-[#FF2E4C] font-bold">abhinani@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Audit Feed */}
              <div className="p-6 rounded-3xl bg-[#0C1015] border border-white/[0.08]">
                <h4 className="font-heading font-black text-lg text-white uppercase mb-4">
                  RECENT SECURITY EVENTS
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#07090C] border border-white/[0.04] flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={13} />
                    </div>
                    <div>
                      <div className="text-white font-bold">Super Admin Session Verified</div>
                      <div className="text-neutral-400 text-[11px]">User abhinani@gmail.com authenticated with full root permissions.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07090C] border border-white/[0.04] flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={13} />
                    </div>
                    <div>
                      <div className="text-white font-bold">RBAC Hierarchy Validated</div>
                      <div className="text-neutral-400 text-[11px]">SUPER_ADMIN master bypass operational across all routes.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: CREATE STAFF / ADMIN ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0C1015] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-heading font-black text-2xl text-white uppercase mb-1">
              CREATE STAFF OR ADMIN
            </h3>
            <p className="text-xs text-neutral-400 mb-6 font-light">
              Assign appropriate administrative or staff permissions to new personnel.
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Verma"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07090C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@pamsfitness.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07090C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Strong password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07090C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Assign Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#07090C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="TRAINER">TRAINER</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#07090C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,46,76,0.35)] cursor-pointer"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT ROLE & PERMISSIONS ================= */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0C1015] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-heading font-black text-xl text-white uppercase mb-1">
              MODIFY ROLE & PERMISSIONS
            </h3>
            <p className="text-xs text-neutral-400 mb-6 font-mono">
              User: <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})
            </p>

            <div className="space-y-3">
              {["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "TRAINER", "CUSTOMER"].map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => handleUpdateRole(selectedUser._id, roleOption)}
                  className={`w-full p-3 rounded-2xl border text-left font-bold text-xs uppercase flex items-center justify-between transition-all cursor-pointer ${
                    (selectedUser.role || "").toUpperCase() === roleOption
                      ? "bg-[#FF2E4C]/20 border-[#FF2E4C] text-white"
                      : "bg-[#07090C] border-white/10 text-neutral-300 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span>{roleOption}</span>
                  {(selectedUser.role || "").toUpperCase() === roleOption && (
                    <CheckCircle2 size={16} className="text-[#FF2E4C]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
