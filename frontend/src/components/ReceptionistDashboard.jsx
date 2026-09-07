import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  CheckSquare,
  Shield,
  Menu,
  ArrowUpRight,
  TrendingUp,
  User,
  CheckCircle2,
  Bell,
  Calendar,
  History,
  Award,
  Star,
  Pin,
} from "lucide-react";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import api from "../lib/api";
import { cn } from "../lib/utils";
import AdminNotificationsHub from "./AdminNotificationsHub";
import ReceptionistOverviewDashboard from "./ReceptionistOverviewDashboard";

export default function ReceptionistDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const { cmsData } = useLandingPageCMS();
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'checkin' | 'customers' | 'memberships' | 'renewals' | 'billing' | 'trainers' | 'enquiries'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [headerNotifDropdownOpen, setHeaderNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target)
      ) {
        setHeaderNotifDropdownOpen(false);
      }
    };
    if (headerNotifDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerNotifDropdownOpen]);

  const [pinnedNotifIds, setPinnedNotifIds] = useState(() => new Set(["NTF-REC-101", "NTF-REC-105"]));

  const togglePinNotif = (id) => {
    setPinnedNotifIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. LIVE CUSTOMERS & TRAINERS FROM MONGODB DATABASE
  // -------------------------------------------------------------
  const [customers, setCustomers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/users");
      if (res.data?.status === "success" && res.data?.data) {
        const allUsers = res.data.data;

        // Live Customers
        const liveCustomers = allUsers
          .filter((u) => u.role === "customer")
          .map((u, idx) => ({
            id: u.displayId || `CUST-${301 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== "N/A" ? u.phone : "N/A",
            plan: u.membershipPlan || "Titan Elite All-Access",
            planDuration: u.membershipDuration || "Monthly",
            startDate: u.membershipStartDate || "2026-08-01",
            expiryDate: u.membershipExpiry || "2027-01-01",
            status: u.membershipStatus || u.status || "Active",
            amountPaid: u.amountPaid || 4999,
            paymentMethod: u.paymentMethod || "UPI / GPay",
          }));
        setCustomers(liveCustomers);

        // Attendance logs initialized from customers
        if (attendanceLogs.length === 0) {
          setAttendanceLogs(
            liveCustomers.slice(0, 8).map((c, idx) => ({
              id: `LOG-${101 + idx}`,
              name: c.name,
              customerId: c.id,
              plan: c.plan,
              terminal: idx % 2 === 0 ? "Turnstile Gate Alpha-1" : "Turnstile Gate Bravo-2",
              timeIn: idx % 2 === 0 ? "06:30 AM" : "07:15 AM",
              timeOut: idx % 3 === 0 ? "08:15 AM" : "--",
              status: idx % 3 === 0 ? "Checked Out" : "Active Inside",
              verification: "Biometric NFC Pass",
            }))
          );
        }

        // Live Trainers
        const liveTrainers = allUsers
          .filter((u) => u.role === "trainer")
          .map((u, idx) => ({
            id: u.displayId || `TRN-${501 + idx}`,
            userId: u.id,
            name: u.name,
            spec: u.spec || "Master Coach",
            shift: u.shift || "06:00 AM - 02:00 PM",
            clientsToday: liveCustomers.filter(c => c.assignedTrainer === u.id).length || idx * 2,
            status: u.status || (idx % 3 === 0 ? "In Session" : "Available"),
            phone: u.phone && u.phone !== "N/A" ? u.phone : "+91 98765 43210",
          }));
        setTrainers(liveTrainers);

        // Generate clean invoices
        setInvoices(
          liveCustomers.map((c, idx) => {
            const amt = c.amountPaid || 4999;
            const base = Math.round(amt / 1.18);
            const tax = amt - base;
            return {
              id: `INV-2026-${1001 + idx}`,
              customerName: c.name,
              customerId: c.id,
              plan: c.plan,
              amount: base,
              tax: tax,
              total: amt,
              paymentMethod: c.paymentMethod || "UPI / GPay",
              status: "Paid",
              date: "2026-08-25",
            };
          })
        );
      }
    } catch (err) {
      console.log("Error fetching receptionist data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------------------------------------------
  // MODALS STATE
  // -------------------------------------------------------------
  const [showRegModal, setShowRegModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // -------------------------------------------------------------
  // LIVE NOTIFICATIONS STATE & HANDLERS (Same style as Admin Hub)
  // -------------------------------------------------------------
  const [receptionistNotifications, setReceptionistNotifications] = useState([
    {
      id: "NTF-REC-101",
      title: "Gate Alpha-1 Turnstile Check-In",
      desc: "Athlete Rahul Sharma (CUST-301) authenticated via Biometric Pass at Turnstile Gate Alpha-1.",
      category: "checkin",
      source: "Gate Alpha-1",
      time: "2 mins ago",
      meta: "Turnstile Active",
      unread: true,
      actionTab: "checkin",
      actionLabel: "View Gate Log",
    },
    {
      id: "NTF-REC-102",
      title: "New Athlete Registration",
      desc: "Siddharth Verma onboarded with Elite VIP Athlete Status (Quarterly). Welcome kit issued.",
      category: "onboarding",
      source: "Front Desk Concierge",
      time: "15 mins ago",
      meta: "₹14,999 Paid",
      unread: true,
      actionTab: "customers",
      actionLabel: "View Profile",
    },
    {
      id: "NTF-REC-103",
      title: "Tax Invoice Settlement #1004",
      desc: "Instant UPI settlement received for 6-month Pro Membership renewal by Priya Patel.",
      category: "payment",
      source: "Billing Gateway",
      time: "42 mins ago",
      meta: "₹14,994 Settled",
      unread: false,
      actionTab: "billing",
      actionLabel: "Print Receipt",
    },
    {
      id: "NTF-REC-104",
      title: "Coach Vikram Singh Shift Check-in",
      desc: "Head Strength Coach Vikram clocked in for Morning Masterclass Shift (06:00 AM - 02:00 PM).",
      category: "trainer",
      source: "Trainer Biometric",
      time: "1 hour ago",
      meta: "In Arena",
      unread: false,
      actionTab: "trainers",
      actionLabel: "View Trainers",
    },
    {
      id: "NTF-REC-105",
      title: "Urgent: 3 Membership Renewals Due Today",
      desc: "Passes for Ananya Roy, Deepak Chopra, and Meera Nair are due for renewal. Follow up for renewal discount.",
      category: "review",
      source: "Renewal Watchdog",
      time: "2 hours ago",
      meta: "Due Today",
      unread: true,
      actionTab: "renewals",
      actionLabel: "Renew Now",
    },
    {
      id: "NTF-REC-106",
      title: "New Walk-in Enquiry Captured",
      desc: "Prospect Ankit Joshi interested in 1-on-1 Personal Training protocol and trial pass.",
      category: "enquiry",
      source: "Walk-in Desk",
      time: "3 hours ago",
      meta: "Prospect Lead",
      unread: false,
      actionTab: "enquiries",
      actionLabel: "Follow Up",
    },
    {
      id: "NTF-REC-107",
      title: "HQ Command Broadcast: Evening Power Hour",
      desc: "High-intensity functional conditioning arena opens at 6:30 PM. All reception desks ensure turnstiles are clear.",
      category: "broadcast",
      source: "Admin Command HQ",
      time: "4 hours ago",
      meta: "Priority HQ Alert",
      unread: false,
    },
  ]);

  const unreadNotifsCount = receptionistNotifications.filter((n) => n.unread).length;

  const handleMarkAllNotifsRead = () => {
    setReceptionistNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
    showToast("✓ All notifications marked as read");
  };

  const handleClearAllNotifs = () => {
    setReceptionistNotifications([]);
    showToast("✓ Notifications inbox cleared");
  };

  const handleDismissNotif = (id) => {
    setReceptionistNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectNotificationAction = (notif) => {
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
    }
  };

  const handleSendReceptionistBroadcast = (broadcast) => {
    setReceptionistNotifications((prev) => [broadcast, ...prev]);
  };

  // Live Dynamic Membership Plans directly from Landing Page CMS / MongoDB
  const activePlansList = useMemo(() => {
    if (
      cmsData?.memberships &&
      Array.isArray(cmsData.memberships) &&
      cmsData.memberships.length > 0
    ) {
      return cmsData.memberships;
    }
    return [
      {
        id: "PLN-1",
        tierKey: "pro",
        name: "PRO MEMBERSHIP",
        price: 2499,
        quarterlyPrice: 6999,
        annualPrice: 24999,
        duration: "Monthly",
        badge: "TITAN ALL-ACCESS PASS",
        perks:
          "All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge",
      },
      {
        id: "PLN-2",
        tierKey: "elite",
        name: "ELITE VIP ATHLETE STATUS",
        price: 4999,
        quarterlyPrice: 12999,
        annualPrice: 49999,
        duration: "Monthly",
        badge: "VIP ATHLETE STATUS",
        perks:
          "Unlimited Cryotherapy Chambers Access, Private Hydro-Massage Therapy Suite, Dedicated VIP Keycard Locker Lounge, Free Daily Micro-Nutrient Shake Bar",
      },
      {
        id: "PLN-3",
        tierKey: "pt",
        name: "PT VIP COACHING PROTOCOL",
        price: 9999,
        quarterlyPrice: 26999,
        annualPrice: 99999,
        duration: "Monthly",
        badge: "1-ON-1 MASTER COACHING",
        perks:
          "Dedicated Master Fitness Coach, Custom Macro & Meal Matrix, Weekly 3D Muscle Bio-Scans, Live Heart-Rate Telemetry",
      },
    ];
  }, [cmsData?.memberships]);

  // Helper: Retrieve accurate pricing for any plan & duration directly from Landing CMS
  const getPlanPrice = (planNameOrId, duration = "Monthly") => {
    const matched =
      activePlansList.find(
        (p) =>
          p.name?.toLowerCase() === (planNameOrId || "").toLowerCase() ||
          p.id?.toLowerCase() === (planNameOrId || "").toLowerCase() ||
          (p.tierKey &&
            (planNameOrId || "").toLowerCase().includes(p.tierKey.toLowerCase()))
      ) || activePlansList[0];

    if (!matched) return 2499;

    const monthlyPrice = Number(matched.price) || 2499;
    const normDuration = String(duration || "").toLowerCase();

    if (
      normDuration.includes("quarter") ||
      normDuration === "3" ||
      normDuration === 3
    ) {
      return matched.quarterlyPrice
        ? Number(matched.quarterlyPrice)
        : Math.round(monthlyPrice * 3 * 0.92);
    }
    if (
      normDuration.includes("half") ||
      normDuration.includes("6") ||
      normDuration === "6" ||
      normDuration === 6
    ) {
      return Math.round(monthlyPrice * 6 * 0.88);
    }
    if (
      normDuration.includes("annual") ||
      normDuration.includes("year") ||
      normDuration.includes("12") ||
      normDuration === "12" ||
      normDuration === 12
    ) {
      return matched.annualPrice
        ? Number(matched.annualPrice)
        : Math.round(monthlyPrice * 10);
    }
    return monthlyPrice;
  };

  const calculateRenewalPrice = (plan, durationMonths) => {
    return getPlanPrice(plan, durationMonths);
  };

  // New Registration Form State (Defaults to First Active Plan in CMS)
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "PRO MEMBERSHIP",
    duration: "Monthly",
    paymentMethod: "UPI / GPay",
    amount: 2499,
  });

  // Renewal Form State
  const [renewForm, setRenewForm] = useState({
    plan: "PRO MEMBERSHIP",
    duration: "Monthly",
    extensionMonths: 1,
    paymentMethod: "UPI / GPay",
    amount: 2499,
  });
  const [renewalFilter, setRenewalFilter] = useState("all");
  const [renewalSearch, setRenewalSearch] = useState("");

  // Sync default form amounts when CMS data arrives
  useEffect(() => {
    if (activePlansList && activePlansList.length > 0) {
      setRegForm((prev) => {
        const currentPlan = prev.plan || activePlansList[0].name;
        const currentAmount = getPlanPrice(currentPlan, prev.duration);
        return {
          ...prev,
          plan: currentPlan,
          amount: currentAmount,
        };
      });
      setRenewForm((prev) => {
        const currentPlan = prev.plan || activePlansList[0].name;
        const currentAmount = getPlanPrice(currentPlan, prev.extensionMonths);
        return {
          ...prev,
          plan: currentPlan,
          amount: currentAmount,
        };
      });
    }
  }, [activePlansList]);

  const getProjectedExpiry = (currentExpiry, extensionMonths) => {
    try {
      let base = new Date();
      if (currentExpiry && !isNaN(new Date(currentExpiry).getTime())) {
        const exp = new Date(currentExpiry);
        if (exp > base) {
          base = exp;
        }
      }
      const projected = new Date(base);
      projected.setMonth(projected.getMonth() + Number(extensionMonths || 1));
      return projected.toISOString().split("T")[0];
    } catch (e) {
      return "N/A";
    }
  };

  const openRenewalModal = (customer) => {
    const targetCustomer = customer || customers[0] || null;
    setSelectedCustomer(targetCustomer);
    if (targetCustomer) {
      const basePlan = targetCustomer.plan || activePlansList[0]?.name || "PRO MEMBERSHIP";
      const duration = targetCustomer.planDuration || "Monthly";
      const months =
        duration === "Quarterly"
          ? 3
          : duration === "Half-Yearly"
          ? 6
          : duration === "Annual"
          ? 12
          : 1;
      const calculatedAmt = getPlanPrice(basePlan, months);

      setRenewForm({
        plan: basePlan,
        duration: duration,
        extensionMonths: months,
        paymentMethod: targetCustomer.paymentMethod || "UPI / GPay",
        amount: calculatedAmt,
      });
    }
    setShowRenewModal(true);
  };

  // Coach Schedule & Client Management Sub-View States (Receptionist Desk Command)
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachClientTab, setCoachClientTab] = useState("active"); // 'active' | 'past' | 'calendar'
  const [coachShiftForm, setCoachShiftForm] = useState({
    shift: "06:00 AM - 02:00 PM",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    maxCapacity: 12,
    breakTime: "11:00 AM - 11:30 AM",
    room: "Main Strength & Conditioning Arena",
  });
  const [coachClients, setCoachClients] = useState({
    active: [],
    past: [],
  });
  const [showAssignClientModal, setShowAssignClientModal] = useState(false);
  const [newClientAssign, setNewClientAssign] = useState({
    name: "",
    email: "",
    phone: "",
    program: "Hypertrophy 5x5 Strength",
    slot: "07:00 AM - 08:00 AM",
    days: "Mon, Wed, Fri",
    goal: "Hypertrophy & Conditioning",
  });

  // Save Coach Shift & Timings with live state & MongoDB persistence
  const handleSaveCoachShift = async () => {
    if (!selectedCoach) return;

    // 1. Update local trainers state immediately
    setTrainers((prev) =>
      prev.map((t) => {
        if (t.id === selectedCoach.id || t.userId === selectedCoach.userId) {
          return {
            ...t,
            shift: coachShiftForm.shift,
            room: coachShiftForm.room,
            days: coachShiftForm.days,
            breakTime: coachShiftForm.breakTime,
          };
        }
        return t;
      })
    );

    // 2. Update current selectedCoach state
    setSelectedCoach((prev) => ({
      ...prev,
      shift: coachShiftForm.shift,
      room: coachShiftForm.room,
      days: coachShiftForm.days,
      breakTime: coachShiftForm.breakTime,
    }));

    // 3. Persist to MongoDB database
    try {
      const targetId = selectedCoach.userId || selectedCoach.id;
      await api.put(`/api/users/${targetId}/shift`, {
        shift: coachShiftForm.shift,
        room: coachShiftForm.room,
        days: coachShiftForm.days,
        breakTime: coachShiftForm.breakTime,
      });

      // Synchronize in real-time across tabs/windows
      try {
        const syncPayload = {
          trainerId: String(targetId),
          trainerName: selectedCoach.name,
          shift: coachShiftForm.shift,
          room: coachShiftForm.room,
          days: coachShiftForm.days,
          breakTime: coachShiftForm.breakTime,
          timestamp: Date.now(),
        };
        localStorage.setItem("titan_trainer_shift_updated", JSON.stringify(syncPayload));
        localStorage.setItem(
          `titan_coach_profile_${targetId}`,
          JSON.stringify({
            ...selectedCoach,
            shift: coachShiftForm.shift,
            room: coachShiftForm.room,
            days: coachShiftForm.days,
            breakTime: coachShiftForm.breakTime,
          })
        );
        window.dispatchEvent(new CustomEvent("titan_trainer_shift_sync", { detail: syncPayload }));
      } catch (e) {}

      showToast(
        `✓ Shift timings updated to "${coachShiftForm.shift}" for Coach ${selectedCoach.name}!`
      );
      setReceptionistNotifications((prev) => [
        {
          id: `NTF-REC-${Date.now().toString().slice(-4)}`,
          title: `Coach Schedule Updated`,
          desc: `Updated duty shift for ${selectedCoach.name} to ${coachShiftForm.shift} (${coachShiftForm.room}).`,
          category: "trainer",
          source: "Front Desk Duty Roster",
          time: "Just now",
          meta: coachShiftForm.shift,
          unread: true,
          actionTab: "trainers",
          actionLabel: "View Schedule",
        },
        ...prev,
      ]);
    } catch (err) {
      console.log("Error persisting coach shift to database:", err);
      showToast(`✓ Shift timings updated to "${coachShiftForm.shift}"!`);
    }
  };

  // Open Coach Schedule View
  const handleOpenCoachSchedule = (coach) => {
    setSelectedCoach(coach);
    setCoachShiftForm({
      shift: coach.shift || "06:00 AM - 02:00 PM",
      days: coach.days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      maxCapacity: 12,
      breakTime: coach.breakTime || "11:00 AM - 11:30 AM",
      room: coach.room || "Main Strength & Conditioning Arena",
    });

    // Load real active membership athletes assigned to this coach
    const realAssigned = customers
      .filter(
        (c) =>
          (c.assignedTrainer === coach.userId ||
            c.assignedTrainer === coach.id ||
            c.assignedTrainerName?.toLowerCase() === coach.name.toLowerCase()) &&
          c.plan &&
          c.plan !== "No Active Plan" &&
          c.status !== "No Membership"
      )
      .map((c) => ({
        id: c.id,
        userId: c.userId,
        name: c.name,
        email: c.email,
        phone: c.phone,
        program: c.plan,
        goal: "Athletic Hypertrophy & Conditioning",
        slot: `${coach.shift ? coach.shift.split("(")[0] : "07:00 AM - 08:00 AM"} (Mon-Sat)`,
        status: "Active",
        progress: "45%",
      }));

    setCoachClients({
      active:
        realAssigned.length > 0
          ? realAssigned
          : [
              {
                id: "CUST-301",
                userId: "301",
                name: "Rahul Verma",
                email: "rahul.v@titan.io",
                phone: "+91 98765 43210",
                program: "PRO MEMBERSHIP",
                goal: "Hypertrophy 5x5 Strength",
                slot: "07:00 AM - 08:00 AM (Mon, Wed, Fri)",
                status: "Active",
                progress: "60%",
              },
              {
                id: "CUST-302",
                userId: "302",
                name: "Priya Sharma",
                email: "priya.s@titan.io",
                phone: "+91 98765 43211",
                program: "ELITE VIP ATHLETE STATUS",
                goal: "Fat Loss & Metabolic Conditioning",
                slot: "08:30 AM - 09:30 AM (Tue, Thu, Sat)",
                status: "Active",
                progress: "75%",
              },
            ],
      past: [
        {
          id: "PST-101",
          name: "Vikram Malhotra",
          email: "vikram.m@titan.io",
          program: "ELITE VIP ATHLETE STATUS",
          result: "Completed (+14kg Lean Muscle Gain)",
          completionDate: "2026-07-15",
          rating: "5.0 ★",
        },
      ],
    });

    setActiveTab("coach-schedule");
  };

  // New Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    goal: "Muscle Gain & Strength",
    source: "Walk-in",
  });

  // Quick Check-in input
  const [quickCheckinInput, setQuickCheckinInput] = useState("");

  // Handle Quick RFID / Customer Scan Check-in
  const handleQuickCheckin = (e) => {
    e.preventDefault();
    if (!quickCheckinInput.trim()) return;

    const matched = customers.find(
      (c) =>
        c.id.toLowerCase() === quickCheckinInput.toLowerCase() ||
        c.name.toLowerCase().includes(quickCheckinInput.toLowerCase()) ||
        c.phone.includes(quickCheckinInput)
    );

    if (matched) {
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        name: matched.name,
        customerId: matched.id,
        plan: matched.plan,
        terminal: "Turnstile Gate Alpha-1",
        timeIn: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeOut: "--",
        status: "Active Inside",
        verification: "Live Biometric Pass",
      };
      setAttendanceLogs([newLog, ...attendanceLogs]);
      showToast(`✓ Access Granted: ${matched.name} checked in!`);
      setReceptionistNotifications((prev) => [
        {
          id: `NTF-REC-${Date.now().toString().slice(-4)}`,
          title: `Athlete Check-In`,
          desc: `${matched.name} checked in at Gate Terminal Alpha-1. NFC verification pass confirmed.`,
          category: "checkin",
          source: "Turnstile Sensor A1",
          time: "Just now",
          meta: matched.plan,
          unread: true,
          actionTab: "checkin",
          actionLabel: "View Turnstile",
        },
        ...prev,
      ]);
      setQuickCheckinInput("");
    } else {
      showToast("❌ No matching member found for check-in.");
    }
  };

  // Handle Member Check-out
  const handleCheckoutMember = (logId, name) => {
    const timeOutStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return { ...log, timeOut: timeOutStr, status: "Checked Out" };
        }
        return log;
      })
    );
    showToast(`✓ Check-out recorded for ${name} (${timeOutStr})`);
  };

  // Handle New Customer Registration & Onboarding with Membership
  const handleRegisterCustomer = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) {
      showToast("Please enter name and email");
      return;
    }

    try {
      const res = await api.post("/api/users", {
        name: regForm.name,
        email: regForm.email,
        phone: regForm.phone,
        role: "customer",
        plan: regForm.plan,
        duration: regForm.duration,
        amount: Number(regForm.amount),
        paymentMethod: regForm.paymentMethod,
        password: "Customer@123",
      });

      if (res.data?.status === "success" || res.data?.data) {
        showToast(`✓ Onboarded ${regForm.name} with ${regForm.plan}!`);
        setReceptionistNotifications((prev) => [
          {
            id: `NTF-REC-${Date.now().toString().slice(-4)}`,
            title: `New Athlete Onboarded`,
            desc: `${regForm.name} registered under ${regForm.plan} (${regForm.duration}). Initial payment recorded.`,
            category: "onboarding",
            source: "Front Desk Concierge",
            time: "Just now",
            meta: `₹${regForm.amount.toLocaleString()} Settled`,
            unread: true,
            actionTab: "customers",
            actionLabel: "View Profile",
          },
          ...prev,
        ]);
        fetchData();
        setShowRegModal(false);
        setRegForm({
          name: "",
          email: "",
          phone: "",
          plan: "PRO MEMBERSHIP",
          duration: "Monthly",
          paymentMethod: "UPI / GPay",
          amount: 2499,
        });
      } else {
        showToast(res.data?.message || "Error registering customer");
      }
    } catch (err) {
      console.error("Registration error:", err);
      showToast(
        err.response?.data?.message || "Error saving customer to database"
      );
    }
  };

  const handleRegSubmit = handleRegisterCustomer;

  // Handle Membership Renewal
  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast("Please select a client to renew.");
      return;
    }

    try {
      const targetUserId = selectedCustomer.userId || selectedCustomer.id;
      const durationLabel =
        renewForm.extensionMonths === 1
          ? "Monthly"
          : renewForm.extensionMonths === 3
          ? "Quarterly"
          : renewForm.extensionMonths === 6
          ? "Half-Yearly"
          : "Annual";

      const res = await api.put(`/api/users/${targetUserId}/membership`, {
        plan: renewForm.plan,
        duration: durationLabel,
        amount: Number(renewForm.amount) || 0,
        paymentMethod: renewForm.paymentMethod,
      });

      if (res.data?.status === "success") {
        showToast(
          `✓ Renewed ${selectedCustomer.name}'s pass to ${renewForm.plan} (${durationLabel})!`
        );
        setReceptionistNotifications((prev) => [
          {
            id: `NTF-REC-${Date.now().toString().slice(-4)}`,
            title: `Membership Renewed`,
            desc: `${selectedCustomer.name} renewed ${renewForm.plan} pass (${durationLabel}) for ₹${Number(renewForm.amount).toLocaleString()}.`,
            category: "payment",
            source: "Front Desk Billing",
            time: "Just now",
            meta: `₹${Number(renewForm.amount).toLocaleString()} Settled`,
            unread: true,
            actionTab: "billing",
            actionLabel: "View Invoice",
          },
          ...prev,
        ]);
        fetchData();
        setShowRenewModal(false);
      } else {
        showToast(res.data?.message || "Error renewing membership");
      }
    } catch (err) {
      console.log("Error updating membership renewal:", err);
      showToast("Error updating renewal in database.");
    }
  };

  // Handle New Enquiry Lead
  const handleCreateEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast("Please enter name and phone.");
      return;
    }

    const newEnq = {
      id: `ENQ-${400 + enquiries.length + 1}`,
      name: enquiryForm.name,
      email: enquiryForm.email || "N/A",
      phone: enquiryForm.phone,
      goal: enquiryForm.goal,
      source: enquiryForm.source,
      status: "New Lead",
      date: new Date().toISOString().split("T")[0],
    };

    setEnquiries([newEnq, ...enquiries]);
    setReceptionistNotifications((prev) => [
      {
        id: `NTF-REC-${Date.now().toString().slice(-4)}`,
        title: `New Enquiry Lead`,
        desc: `Prospect ${enquiryForm.name} inquired for ${enquiryForm.goal} (${enquiryForm.source}).`,
        category: "enquiry",
        source: "Reception Desk",
        time: "Just now",
        meta: "New Lead",
        unread: true,
        actionTab: "enquiries",
        actionLabel: "Follow Up",
      },
      ...prev,
    ]);
    showToast(`✓ Lead captured for ${enquiryForm.name}!`);
    setShowEnquiryModal(false);
    setEnquiryForm({
      name: "",
      email: "",
      phone: "",
      goal: "Muscle Gain & Strength",
      source: "Walk-in",
    });
  };

  // Nav menu tabs matching Admin Dashboard taxonomy
  const navTabs = [
    {
      id: "dashboard",
      label: "Mission Control",
      icon: LayoutDashboard,
    },
    {
      id: "checkin",
      label: "Turnstile Gate Access",
      icon: CalendarCheck,
      count: attendanceLogs.filter((l) => l.status === "Active Inside").length,
    },
    {
      id: "customers",
      label: "Customer Management",
      icon: Users,
      count: customers.length,
    },
    { id: "memberships", label: "Membership Plans", icon: ShieldCheck },
    {
      id: "renewals",
      label: "Membership Renewals",
      icon: RotateCw,
      count: customers.filter(
        (c) => c.status === "Due Soon" || c.status === "Expired"
      ).length,
    },
    {
      id: "billing",
      label: "Payment & Billing",
      icon: CreditCard,
      count: invoices.length,
    },
    {
      id: "trainers",
      label: "Trainer Availability",
      icon: Dumbbell,
      count: trainers.filter((t) => t.status === "Available").length,
    },
    {
      id: "enquiries",
      label: "Enquiry Management",
      icon: HelpCircle,
      count: enquiries.filter((e) => e.status === "New Lead").length,
    },
  ];

  const activeInsideCount = attendanceLogs.filter(
    (l) => l.status === "Active Inside"
  ).length;

  const dueSoonCount = customers.filter(
    (c) => c.status === "Due Soon" || c.status === "Expired"
  ).length;

  const pinnedNotifs = receptionistNotifications.filter((i) => pinnedNotifIds.has(i.id));
  const unpinnedNotifs = receptionistNotifications.filter((i) => !pinnedNotifIds.has(i.id));

  const notifCardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: -6 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 380, damping: 20, mass: 0.8 },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -4,
      transition: { duration: 0.18, ease: "easeIn" },
    },
  };

  const notifSectionVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 22 },
    },
    exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" } },
  };

  const renderNotifCard = (ntf, isPinned) => (
    <motion.div
      key={ntf.id}
      layoutId={ntf.id}
      layout
      variants={notifCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "p-3 rounded-xl transition-all border",
        isPinned
          ? "bg-[#FF2E4C]/5 border-[#FF2E4C]/25 shadow-sm"
          : ntf.unread
          ? "bg-white/[0.03] border-white/5 hover:border-white/10"
          : "bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isPinned
                ? "bg-[#FF2E4C]"
                : ntf.unread
                ? "bg-amber-400"
                : "bg-transparent border border-white/20"
            }`}
          />
          <span className="font-semibold text-xs text-white truncate">
            {ntf.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-slate-500">
            {ntf.time}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePinNotif(ntf.id);
            }}
            aria-label={isPinned ? `Unpin ${ntf.title}` : `Pin ${ntf.title}`}
            className={cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all cursor-pointer",
              isPinned
                ? "bg-[#FF2E4C] text-white hover:bg-[#E50914]"
                : "bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white"
            )}
            title={isPinned ? "Unpin priority" : "Pin to top"}
          >
            <Pin
              size={10}
              className={cn(
                "transition-transform duration-200",
                isPinned && "-rotate-45 text-white"
              )}
            />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 pl-4 mb-2 leading-relaxed">
        {ntf.desc}
      </p>

      <div className="flex items-center justify-between pl-4 pt-1">
        <span className="text-[10px] font-mono text-slate-500">
          {ntf.source || ntf.meta || "Front Desk"}
        </span>

        <div className="flex items-center gap-2">
          {ntf.actionTab && (
            <button
              onClick={() => {
                handleSelectNotificationAction(ntf);
                setHeaderNotifDropdownOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#FF2E4C]/15 hover:bg-[#FF2E4C]/25 text-[#FF2E4C] text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              {ntf.actionLabel || "View"} <ArrowRight size={10} />
            </button>
          )}
          <button
            onClick={() => handleDismissNotif(ntf.id)}
            className="text-slate-500 hover:text-slate-300 text-[10px] p-1 cursor-pointer"
            title="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#0A0A0D] text-white flex selection:bg-[#FF1E27] selection:text-white font-sans">
      {/* 1. DARK SLEEK SIDEBAR MATCHING ADMIN DASHBOARD THEME */}
      <aside
        data-lenis-prevent="true"
        className={`${sidebarOpen ? "w-64 sm:w-72" : "w-20"} bg-[#121217] border-r border-[#202028] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 h-screen overflow-hidden no-scrollbar shadow-2xl`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-24 px-5 flex items-center justify-between border-b border-[#202028]">
            <Link
              to="/"
              className="flex items-center gap-3 cursor-pointer group min-w-0"
            >
              {cmsData?.brand?.logo ? (
                <div className="w-11 h-11 rounded-2xl bg-[#0B0B0E] border border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(255,30,39,0.35)] group-hover:scale-105 transition-all">
                  <img
                    src={cmsData.brand.logo}
                    alt={cmsData?.brand?.name || "Logo"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF1E27] to-[#B30D14] flex items-center justify-center text-white shadow-[0_0_18px_rgba(255,30,39,0.5)] shrink-0 group-hover:scale-105 transition-all">
                  <Activity size={22} className="stroke-[2.5]" />
                </div>
              )}
              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bebas text-2xl text-white tracking-wider leading-none truncate group-hover:text-[#FF1E27] transition-colors">
                    {cmsData?.brand?.name || "TITAN•PULSE"}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8E98] font-mono leading-tight truncate">
                    {cmsData?.brand?.subname || "RECEPTIONIST DESK"}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Concierge Desk Command Badge */}
          {sidebarOpen && (
            <div className="px-5 py-3.5 flex items-center gap-3 border-b border-[#1E1E26] bg-[#0E0E12]/80">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E27]/20 to-[#FF1E27]/5 border border-[#FF1E27]/40 flex items-center justify-center text-[#FF1E27] shadow-[0_0_12px_rgba(255,30,39,0.25)]">
                  <Shield size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121217] shadow-[0_0_6px_#10B981]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    Front Desk Concierge
                  </span>
                  <span className="text-[9px] font-extrabold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/20 px-1.5 py-0.5 rounded">
                    GATE A1
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate font-mono">
                  Biometric Terminal Online
                </span>
              </div>
            </div>
          )}

          {/* Sidebar Nav List with Left Active Crimson Highlight Bar */}
          <nav
            data-lenis-prevent="true"
            className="p-3 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto no-scrollbar"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? "text-white font-bold bg-gradient-to-r from-[#FF1E27]/25 via-[#FF1E27]/5 to-transparent border-l-4 border-[#FF1E27] pl-3"
                      : "text-[#8E8E98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                  title={tab.label}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-[#FF1E27] drop-shadow-[0_0_8px_rgba(255,30,39,0.7)]"
                        : "text-[#8E8E98]"
                    }
                  />
                  {sidebarOpen && (
                    <span className="truncate flex-1 text-left">{tab.label}</span>
                  )}
                  {sidebarOpen && tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? "bg-[#FF1E27] text-white shadow-[0_0_8px_rgba(255,30,39,0.5)]"
                          : "bg-[#181820] text-slate-300 border border-white/5"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Info & Log Out */}
        <div className="p-4 border-t border-[#202028] bg-[#0C0C10]">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              navigate("/");
            }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center py-2"} text-xs text-[#8E8E98] hover:text-[#FF1E27] transition-colors cursor-pointer font-medium rounded-xl hover:bg-white/5`}
            title="Log Out"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Log out ({user?.name || "Front Desk"})</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main
        data-lenis-prevent="true"
        className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen no-scrollbar bg-[#0A0A0D]"
      >
        {/* Top Header Bar Matching Admin Dashboard */}
        <header className="h-20 px-6 sm:px-10 border-b border-[#202028] bg-[#121217]/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-[#181820] border border-white/5 text-[#8E8E98] hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {navTabs.find((t) => t.id === activeTab)?.label || "Receptionist Portal"}
              </h1>
              <p className="text-xs text-slate-400 font-normal">
                Terminal Gate A1 • Active in Arena:{" "}
                <strong className="text-emerald-400 font-bold">
                  {activeInsideCount} Athletes
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown Button & Popover */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setHeaderNotifDropdownOpen(!headerNotifDropdownOpen)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                  headerNotifDropdownOpen
                    ? "bg-[#FF2E4C]/15 border-[#FF2E4C]/40 text-[#FF2E4C] shadow-[0_0_12px_rgba(255,46,76,0.3)]"
                    : "bg-[#181820] border-white/5 text-slate-300 hover:text-white hover:border-white/20"
                }`}
                title="Notifications"
              >
                <Bell size={17} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF2E4C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#121217] shadow-[0_0_8px_#FF2E4C]">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Interactive Dropdown Popover */}
              <AnimatePresence>
                {headerNotifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#121217] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-3.5 border-b border-white/5 flex items-center justify-between bg-[#16161D]">
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-[#FF2E4C]" />
                        <span className="text-sm font-bold text-white tracking-tight">
                          Notifications
                        </span>
                        {unreadNotifsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/30">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        {unreadNotifsCount > 0 && (
                          <button
                            onClick={handleMarkAllNotifsRead}
                            className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setHeaderNotifDropdownOpen(false)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Notification List with Pinned vs Feed Motion Spring Physics */}
                    <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                      {receptionistNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <CheckCircle2 size={26} className="text-slate-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-400">All caught up!</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">No notifications at the moment.</p>
                        </div>
                      ) : (
                        <LayoutGroup id="receptionist-notifs-group">
                          <motion.div layout className="flex w-full flex-col gap-1">
                            <AnimatePresence>
                              {pinnedNotifs.length > 0 && (
                                <motion.div
                                  key="pinned-section"
                                  layout
                                  variants={notifSectionVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="flex flex-col gap-1"
                                >
                                  <motion.p
                                    layout="position"
                                    className="px-1.5 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#FF2E4C] flex items-center gap-1"
                                  >
                                    <Pin size={10} className="-rotate-45" /> Pinned Items ({pinnedNotifs.length})
                                  </motion.p>
                                  <AnimatePresence mode="popLayout">
                                    {pinnedNotifs.map((item) => renderNotifCard(item, true))}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <AnimatePresence>
                              {unpinnedNotifs.length > 0 && (
                                <motion.div
                                  key="all-section"
                                  layout
                                  variants={notifSectionVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="flex flex-col gap-1"
                                >
                                  <motion.p
                                    layout="position"
                                    className={cn(
                                      "px-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400",
                                      pinnedNotifs.length > 0 ? "pt-2.5 border-t border-white/5 mt-1" : "pt-1"
                                    )}
                                  >
                                    All Notifications ({unpinnedNotifs.length})
                                  </motion.p>
                                  <AnimatePresence mode="popLayout">
                                    {unpinnedNotifs.map((item) => renderNotifCard(item, false))}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </LayoutGroup>
                      )}
                    </div>

                    {/* Footer */}
                    {receptionistNotifications.length > 0 && (
                      <div className="p-2.5 border-t border-white/5 bg-[#16161D] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {receptionistNotifications.length} total notifications
                        </span>
                        <button
                          onClick={handleClearAllNotifs}
                          className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/5 text-xs text-slate-200 font-medium cursor-pointer hover:border-white/15 transition-all">
              <span>Today</span>
              <span className="text-[#8E8E98] text-[10px]">▼</span>
            </div>

            {/* Quick Action: Register New Customer */}
            <button
              onClick={() => setShowRegModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <UserPlus size={15} /> + New Customer
            </button>

            {/* Quick Action: Capture Enquiry */}
            <button
              onClick={() => setShowEnquiryModal(true)}
              className="hidden sm:flex px-3.5 py-2.5 rounded-xl bg-[#181820] border border-white/5 hover:border-white/20 text-slate-200 hover:text-white text-xs font-semibold items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle size={15} className="text-[#FF2E4C]" /> + Enquiry
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-10 space-y-8 flex-1">
          {/* ============================================================ */}
          {/* TAB 0: DASHBOARD MISSION CONTROL (INTERACTIVE BENTO GRID)    */}
          {/* ============================================================ */}
          {activeTab === "dashboard" && (
            <ReceptionistOverviewDashboard
              activeInsideCount={activeInsideCount}
              customersCount={customers.length}
              dueSoonCount={dueSoonCount}
              invoicesCount={invoices.length}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ============================================================ */}
          {/* TAB 1: GATE CHECK-IN / CHECK-OUT TERMINAL                     */}
          {/* ============================================================ */}
          {activeTab === "checkin" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Quick Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl flex items-center justify-between hover:border-white/10 transition-all">
                  <div>
                    <span className="text-xs font-semibold text-[#8E8E98] uppercase tracking-wider block mb-1">
                      Active In Arena
                    </span>
                    <h3 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                      {activeInsideCount}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck size={22} />
                  </div>
                </div>

                <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl flex items-center justify-between hover:border-white/10 transition-all">
                  <div>
                    <span className="text-xs font-semibold text-[#8E8E98] uppercase tracking-wider block mb-1">
                      Today's Check-ins
                    </span>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                      {attendanceLogs.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <CalendarCheck size={22} />
                  </div>
                </div>

                <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl flex items-center justify-between hover:border-white/10 transition-all">
                  <div>
                    <span className="text-xs font-semibold text-[#8E8E98] uppercase tracking-wider block mb-1">
                      Coaches On Floor
                    </span>
                    <h3 className="text-3xl font-extrabold text-amber-400 tracking-tight">
                      {
                        trainers.filter(
                          (t) =>
                            t.status === "Available" ||
                            t.status === "In Session"
                        ).length
                      }
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Dumbbell size={22} />
                  </div>
                </div>

                <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl flex items-center justify-between hover:border-white/10 transition-all">
                  <div>
                    <span className="text-xs font-semibold text-[#8E8E98] uppercase tracking-wider block mb-1">
                      Due / Expiring
                    </span>
                    <h3 className="text-3xl font-extrabold text-[#FF2E4C] tracking-tight">
                      {dueSoonCount}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
                    <Clock size={22} />
                  </div>
                </div>
              </div>

              {/* Fast Barcode / Search Member Check-In Box */}
              <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/20 flex items-center justify-center shrink-0">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Biometric & Turnstile Gate Scanner Terminal
                      </h3>
                      <p className="text-xs text-slate-400">
                        Scan RFID pass or enter Customer Name / Phone / ID (e.g. CUST-301).
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono w-fit">
                    ● Scanner Gate Terminal A1 Online
                  </span>
                </div>

                <form onSubmit={handleQuickCheckin} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Scan RFID badge or enter Customer Name / Phone / ID..."
                      value={quickCheckinInput}
                      onChange={(e) => setQuickCheckinInput(e.target.value)}
                      className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF2E4C] transition-colors"
                    />
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <UserCheck size={15} /> Grant Gate Entry
                  </button>
                </form>
              </div>

              {/* Attendance Log Table with Instant Check-out Action */}
              <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="px-6 py-4.5 border-b border-[#202028] flex items-center justify-between bg-[#16161D]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/20 flex items-center justify-center">
                      <CalendarCheck size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-normal">
                        Live Turnstile Access Stream
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Real-time visitor biometric entries & exit logs
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5">
                    Today's Session Logs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[880px]">
                    <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="px-6 py-3.5 whitespace-nowrap">Log ID</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Athlete / Member</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Membership Pass</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Gate Terminal</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Clock In</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Clock Out</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202028] text-slate-200">
                      {attendanceLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                              {log.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                                {log.name.charAt(0)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-white text-xs leading-snug">
                                  {log.name}
                                </span>
                                <span className="text-[10px] text-[#FF2E4C] font-mono font-medium">
                                  {log.customerId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">
                            {log.plan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                            {log.terminal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-emerald-400">
                            {log.timeIn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400">
                            {log.timeOut}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                log.status === "Active Inside"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-white/[0.05] text-slate-400 border border-white/10"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  log.status === "Active Inside"
                                    ? "bg-emerald-400 shadow-[0_0_6px_#10B981]"
                                    : "bg-slate-500"
                                }`}
                              />
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {log.status === "Active Inside" ? (
                              <button
                                onClick={() =>
                                  handleCheckoutMember(log.id, log.name)
                                }
                                className="px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                              >
                                Clock Out
                              </button>
                            ) : (
                              <span className="text-slate-500 text-xs font-mono font-medium">
                                Completed
                              </span>
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
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Customer Search & Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Look up member credentials, plan status, contact athletes, and process renewals.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
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
                  className="w-full bg-[#121217] border border-[#202028] rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF2E4C]"
                />
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>

              {/* Customers Table */}
              <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                    <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="px-6 py-3.5 whitespace-nowrap">Customer ID</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Athlete Name</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Contact Info</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Membership Plan</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Duration</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Expiry Date</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202028] text-slate-200">
                      {customers
                        .filter(
                          (c) =>
                            c.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            c.email
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            c.phone.includes(searchQuery) ||
                            c.id
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((c) => (
                          <tr
                            key={c.id}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-[#FF2E4C] bg-[#FF2E4C]/10 px-2.5 py-1 rounded-md border border-[#FF2E4C]/20">
                                {c.id}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                                  {c.name.charAt(0)}
                                </div>
                                <span className="font-bold text-white text-xs">
                                  {c.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                              <span className="block font-medium">{c.phone}</span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {c.email}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">
                              {c.plan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                              {c.planDuration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-300">
                              {c.expiryDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                  c.status === "Active"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : c.status === "Due Soon"
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    c.status === "Active"
                                      ? "bg-emerald-400"
                                      : c.status === "Due Soon"
                                        ? "bg-amber-400"
                                        : "bg-rose-400"
                                  }`}
                                />
                                {c.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setShowRenewModal(true);
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-[#181820] border border-white/10 hover:border-[#FF2E4C] text-slate-200 hover:text-white font-medium text-xs transition-all cursor-pointer shadow-sm"
                              >
                                {c.plan === "No Active Plan" ? "Assign Plan" : "Renew Plan"}
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
          {activeTab === "memberships" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Membership Plans Catalog
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official packages, pricing structures, and included facility privileges.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activePlansList.map((plan, idx) => {
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const borderClass = isFirst
                    ? "border-[#FF2E4C]/40 shadow-2xl"
                    : isSecond
                    ? "border-cyan-500/30 shadow-xl"
                    : "border-purple-500/30 shadow-xl";
                  const badgeClass = isFirst
                    ? "bg-[#FF2E4C] text-white"
                    : isSecond
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                  const priceColorClass = isFirst
                    ? "text-[#FF2E4C]"
                    : isSecond
                    ? "text-cyan-400"
                    : "text-purple-400";
                  const buttonClass = isFirst
                    ? "bg-[#FF2E4C] hover:brightness-110 text-white shadow-lg shadow-[#FF2E4C]/20"
                    : "bg-[#181820] border border-white/10 hover:border-white/20 text-white";

                  // Extract perks / services
                  const perksList = Array.isArray(plan.services) && plan.services.length > 0
                    ? plan.services.filter((s) => s.included !== false).map((s) => s.name)
                    : plan.perks
                    ? plan.perks.split(",").map((s) => s.trim())
                    : [
                        "All-Access Gym Floor & Cardio Zone",
                        "Biometric Smart Locker Activation",
                        "3D Body Composition Bio-Scan",
                        "Sauna & Recovery Lounge Access",
                      ];

                  const monthlyPrice = Number(plan.price) || 2499;

                  return (
                    <div
                      key={plan.id || plan.name || idx}
                      className={`p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border ${borderClass} space-y-4 relative flex flex-col justify-between`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeClass}`}
                          >
                            {plan.badge || (isFirst ? "MOST POPULAR" : isSecond ? "VIP STATUS" : "MASTER COACHING")}
                          </span>
                          {plan.duration && (
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              {plan.duration}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {plan.name}
                          </h3>
                          {plan.subBadge && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {plan.subBadge}
                            </p>
                          )}
                        </div>

                        <div className={`text-3xl font-extrabold tracking-tight ${priceColorClass}`}>
                          ₹{monthlyPrice.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            / month
                          </span>
                        </div>

                        {plan.annualPrice && (
                          <div className="text-[11px] text-slate-400 font-mono -mt-2">
                            Annual: ₹{Number(plan.annualPrice).toLocaleString()}/yr
                          </div>
                        )}

                        <ul className="space-y-2 text-xs text-slate-300 border-t border-[#202028] pt-4">
                          {perksList.slice(0, 5).map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2">
                              <Check size={15} className="text-emerald-400 shrink-0" />
                              <span className="line-clamp-1">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setRegForm((prev) => ({
                            ...prev,
                            plan: plan.name,
                            amount: monthlyPrice,
                          }));
                          setShowRegModal(true);
                        }}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer mt-4 ${buttonClass}`}
                      >
                        Register Member on this Plan
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: MEMBERSHIP RENEWALS                                   */}
          {/* ============================================================ */}
          {activeTab === "renewals" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Quick Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Membership Renewals & Extensions</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      Front Desk Concierge
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Extend memberships for existing athletes, handle pass renewals, and dispatch WhatsApp renewal notices.
                  </p>
                </div>
                <button
                  onClick={() => openRenewalModal(customers[0] || null)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <RotateCw size={15} /> Renew Existing Client
                </button>
              </div>

              {/* Expiry Alerts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setRenewalFilter("all")}
                  className={`p-5 rounded-2xl bg-[#121217] border transition-all cursor-pointer shadow-xl ${
                    renewalFilter === "all"
                      ? "border-blue-500/50 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        All Registered Clients
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {customers.length} Members
                      </h3>
                    </div>
                    <Users className="text-blue-400" size={24} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Total membership holders
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("due")}
                  className={`p-5 rounded-2xl bg-[#121217] border transition-all cursor-pointer shadow-xl ${
                    renewalFilter === "due"
                      ? "border-amber-500/50 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "border-amber-500/30 hover:border-amber-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 block mb-1">
                        Due within 7 Days
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {customers.filter((c) => c.status === "Due Soon").length} Members
                      </h3>
                    </div>
                    <AlertTriangle className="text-amber-400" size={24} />
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-2 block">
                    Follow-up priority
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("expired")}
                  className={`p-5 rounded-2xl bg-[#121217] border transition-all cursor-pointer shadow-xl ${
                    renewalFilter === "expired"
                      ? "border-[#FF2E4C]/50 bg-rose-950/20 shadow-[0_0_15px_rgba(255,46,76,0.15)]"
                      : "border-[#FF2E4C]/30 hover:border-[#FF2E4C]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#FF2E4C] block mb-1">
                        Expired Memberships
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {customers.filter((c) => c.status === "Expired").length} Members
                      </h3>
                    </div>
                    <AlertCircle className="text-[#FF2E4C]" size={24} />
                  </div>
                  <span className="text-[10px] text-[#FF2E4C]/80 mt-2 block">
                    Pass lapsed · Renewal required
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("active")}
                  className={`p-5 rounded-2xl bg-[#121217] border transition-all cursor-pointer shadow-xl ${
                    renewalFilter === "active"
                      ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "border-emerald-500/30 hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 block mb-1">
                        Active In Good Standing
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {customers.filter((c) => c.status === "Active").length} Members
                      </h3>
                    </div>
                    <CheckCircle className="text-emerald-400" size={24} />
                  </div>
                  <span className="text-[10px] text-emerald-400/80 mt-2 block">
                    Eligible for advance extension
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121217] p-3 rounded-2xl border border-[#202028]">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setRenewalFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "all"
                        ? "bg-white/10 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All Members ({customers.length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("due")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "due"
                        ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                        : "text-slate-400 hover:text-amber-400"
                    }`}
                  >
                    Expiring Soon ({customers.filter((c) => c.status === "Due Soon").length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("expired")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "expired"
                        ? "bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30"
                        : "text-slate-400 hover:text-rose-400"
                    }`}
                  >
                    Expired ({customers.filter((c) => c.status === "Expired").length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("active")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "active"
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                        : "text-slate-400 hover:text-emerald-400"
                    }`}
                  >
                    Active ({customers.filter((c) => c.status === "Active").length})
                  </button>
                </div>

                <div className="relative min-w-[240px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={renewalSearch}
                    onChange={(e) => setRenewalSearch(e.target.value)}
                    placeholder="Search by name, ID, phone, plan..."
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF2E4C]"
                  />
                  {renewalSearch && (
                    <button
                      onClick={() => setRenewalSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Renewal Action Table */}
              <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[920px]">
                    <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="px-6 py-3.5 whitespace-nowrap">Member ID</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Athlete Name</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Phone / WhatsApp</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Current Plan</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Expiry Date</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 text-right whitespace-nowrap">Renewal Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202028] text-slate-200">
                      {customers
                        .filter((c) => {
                          const q = renewalSearch.toLowerCase();
                          const matchesSearch =
                            !q ||
                            c.name.toLowerCase().includes(q) ||
                            c.id.toLowerCase().includes(q) ||
                            (c.phone && c.phone.includes(q)) ||
                            (c.plan && c.plan.toLowerCase().includes(q));

                          if (!matchesSearch) return false;

                          if (renewalFilter === "due") return c.status === "Due Soon";
                          if (renewalFilter === "expired") return c.status === "Expired";
                          if (renewalFilter === "active") return c.status === "Active";
                          return true;
                        })
                        .map((c) => (
                          <tr
                            key={c.id}
                            className="hover:bg-white/[0.02] transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-[#FF2E4C] bg-[#FF2E4C]/10 px-2.5 py-1 rounded-md border border-[#FF2E4C]/20">
                                {c.id}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                                  {c.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-xs">
                                    {c.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal truncate max-w-[150px]">
                                    {c.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-mono">
                              {c.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-slate-200 font-medium">
                                  {c.plan}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {c.planDuration || "Monthly"} · ₹{(c.amountPaid || 2499).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-mono text-white font-semibold">
                                  {c.expiryDate}
                                </span>
                                <span className={`text-[10px] font-mono ${
                                  c.status === "Expired"
                                    ? "text-rose-400 font-semibold"
                                    : c.status === "Due Soon"
                                    ? "text-amber-400"
                                    : "text-slate-400"
                                }`}>
                                  {c.status === "Expired"
                                    ? "Pass Lapsed"
                                    : c.status === "Due Soon"
                                    ? "Expires within 7d"
                                    : "Active Pass"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                  c.status === "Due Soon"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : c.status === "Expired"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    c.status === "Due Soon"
                                      ? "bg-amber-400 animate-pulse"
                                      : c.status === "Expired"
                                      ? "bg-rose-400"
                                      : "bg-emerald-400"
                                  }`}
                                />
                                {c.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  showToast(
                                    `📲 WhatsApp reminder sent to ${c.name} (${c.phone})`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#0A0A0D] border border-white/10 hover:border-emerald-400 text-emerald-400 text-xs font-medium transition-all cursor-pointer shadow-sm"
                                title="Send reminder notice"
                              >
                                Send Notice
                              </button>
                              <button
                                onClick={() => openRenewalModal(c)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                              >
                                <RotateCw size={12} />
                                <span>Process Renewal</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {customers.filter((c) => {
                    const q = renewalSearch.toLowerCase();
                    const matchesSearch =
                      !q ||
                      c.name.toLowerCase().includes(q) ||
                      c.id.toLowerCase().includes(q) ||
                      (c.phone && c.phone.includes(q)) ||
                      (c.plan && c.plan.toLowerCase().includes(q));
                    if (!matchesSearch) return false;
                    if (renewalFilter === "due") return c.status === "Due Soon";
                    if (renewalFilter === "expired") return c.status === "Expired";
                    if (renewalFilter === "active") return c.status === "Active";
                    return true;
                  }).length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      <RotateCw className="mx-auto mb-2 opacity-40 text-slate-500" size={28} />
                      <p className="text-sm font-semibold text-white">No matching members found</p>
                      <p className="text-xs text-slate-500 mt-1">Try changing your search term or filter selection.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: PAYMENT & BILLING                                     */}
          {/* ============================================================ */}
          {(activeTab === "billing" || activeTab === "payments" || activeTab === "invoices") && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Payment & Billing</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      GST & Settlements
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Record membership fees via UPI, Card, Cash, manage athlete transactions, and review official tax receipts.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <CreditCard size={15} /> Collect New Payment
                </button>
              </div>

              {/* Invoices List */}
              <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[920px]">
                    <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="px-6 py-3.5 whitespace-nowrap">Invoice #</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Athlete / Customer</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Plan / Service</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Base Fee</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">GST (18%)</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Total Settled</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Method</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202028] text-slate-200">
                      {invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-[#FF2E4C] bg-[#FF2E4C]/10 px-2.5 py-1 rounded-md border border-[#FF2E4C]/20">
                              {inv.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                                {inv.customerName.charAt(0)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-white text-xs leading-snug">
                                  {inv.customerName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {inv.customerId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-200 font-medium">
                            {inv.plan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400">
                            ₹{inv.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400">
                            ₹{inv.tax.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-emerald-400 font-bold text-sm">
                            ₹{inv.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                            {inv.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowInvoiceModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#181820] border border-white/10 hover:border-[#FF2E4C] text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
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
          {/* TAB 6: TRAINER & COACH SCHEDULE MANAGEMENT                   */}
          {/* ============================================================ */}
          {activeTab === "trainers" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Trainer & Coach Schedule Management</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      Duty Command
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live duty shifts, certified coach specializations, client rosters, and session allocations.
                  </p>
                </div>
              </div>

              {trainers.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#121217] border border-[#202028] text-center space-y-3 shadow-xl">
                  <Dumbbell className="mx-auto text-slate-500" size={32} />
                  <p className="text-sm text-slate-400">
                    No registered trainers/coaches found in database roster.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainers.map((t) => (
                    <div
                      key={t.id}
                      className="p-6 rounded-3xl bg-[#121217] border border-[#202028] space-y-4 shadow-xl hover:border-[#FF2E4C]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF2E4C] to-[#E50914] text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0">
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white">
                                {t.name}
                              </h3>
                              <span className="text-xs font-medium text-[#FF2E4C] block">
                                {t.spec}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                              t.status === "Available"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : t.status === "In Session"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-[#181820] text-slate-400 border border-white/5"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                t.status === "Available"
                                  ? "bg-emerald-400"
                                  : t.status === "In Session"
                                    ? "bg-amber-400"
                                    : "bg-slate-400"
                              }`}
                            />
                            {t.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-2 text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span>Assigned Shift:</span>{" "}
                            <strong className="text-purple-400 font-semibold">
                              {t.shift}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Training Arena:</span>{" "}
                            <strong className="text-slate-200 truncate max-w-[170px]">
                              {t.room || "Main Strength Arena"}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Athletes:</span>{" "}
                            <strong className="text-emerald-400 font-bold">
                              {t.clientsToday || 2} Athletes
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Coach Rating:</span>{" "}
                            <strong className="text-amber-400 font-semibold">
                              {t.rating || "4.9 ★"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenCoachSchedule(t)}
                          className="w-full py-2.5 rounded-xl bg-[#181820] border border-white/10 hover:border-[#FF2E4C] text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:bg-[#FF2E4C]"
                        >
                          <Calendar size={14} />
                          Manage Schedule & Clients
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6.5: DEDICATED COACH SCHEDULE & CLIENT MANAGEMENT VIEW   */}
          {/* ============================================================ */}
          {activeTab === "coach-schedule" && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Back Navigation & Coach Overview Card */}
              <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("trainers")}
                      className="p-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowRight className="rotate-180" size={15} /> Back to Trainers
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {selectedCoach?.name || "Coach"}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                          ● {selectedCoach?.status || "On Duty"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {selectedCoach?.id || "TRN-501"} • {selectedCoach?.spec || "Master Coach"} • {selectedCoach?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAssignClientModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(255,46,76,0.4)] transition-all cursor-pointer"
                    >
                      <UserPlus size={15} /> Assign New Athlete
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ASSIGNED SHIFT
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-purple-400">
                      {coachShiftForm.shift}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ACTIVE ATHLETES
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">
                      {coachClients.active.length} Athletes
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      GRADUATED / PAST
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-amber-400">
                      {coachClients.past.length} Completed
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      COACH RATING
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-yellow-400">
                      {selectedCoach?.rating || "4.9 ★"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* 1. SHIFT & TIMINGS SCHEDULER CONFIGURATION */}
              <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#201416] border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Shift Timings & Working Hours Setup
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure weekly availability, designated training room, and duty shift hours.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveCoachShift}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Check size={14} /> Save Timings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Shift Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Shift Timing Window
                    </label>
                    <select
                      value={coachShiftForm.shift}
                      onChange={(e) =>
                        setCoachShiftForm({
                          ...coachShiftForm,
                          shift: e.target.value,
                        })
                      }
                      className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="06:00 AM - 02:00 PM">
                        Morning Shift (06:00 AM - 02:00 PM)
                      </option>
                      <option value="02:00 PM - 10:00 PM">
                        Evening Shift (02:00 PM - 10:00 PM)
                      </option>
                      <option value="06:00 AM - 11:00 AM & 05:00 PM - 09:00 PM">
                        Split Shift (06-11 AM & 05-09 PM)
                      </option>
                      <option value="10:00 AM - 06:00 PM">
                        General Shift (10:00 AM - 06:00 PM)
                      </option>
                    </select>
                  </div>

                  {/* Designated Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Assigned Arena / Zone
                    </label>
                    <select
                      value={coachShiftForm.room}
                      onChange={(e) =>
                        setCoachShiftForm({
                          ...coachShiftForm,
                          room: e.target.value,
                        })
                      }
                      className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="Main Strength & Conditioning Arena">
                        Main Strength Arena
                      </option>
                      <option value="Cardio & 3D Telemetry Zone">
                        Cardio & 3D Telemetry Zone
                      </option>
                      <option value="Functional HIIT & Turf Deck">
                        Functional HIIT Turf
                      </option>
                      <option value="VIP Private Training Studio">
                        VIP Private Training Studio
                      </option>
                    </select>
                  </div>

                  {/* Rest / Break Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Scheduled Break Time
                    </label>
                    <input
                      type="text"
                      value={coachShiftForm.breakTime}
                      onChange={(e) =>
                        setCoachShiftForm({
                          ...coachShiftForm,
                          breakTime: e.target.value,
                        })
                      }
                      className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                      placeholder="e.g. 11:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                {/* Working Days Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Weekly Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => {
                        const isSelected = coachShiftForm.days.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const newDays = isSelected
                                ? coachShiftForm.days.filter((d) => d !== day)
                                : [...coachShiftForm.days, day];
                              setCoachShiftForm({
                                ...coachShiftForm,
                                days: newDays,
                              });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#FF2E4C] text-white shadow-[0_0_10px_rgba(255,46,76,0.4)]"
                                : "bg-[#0A0A0D] border border-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* 2. CLIENT MANAGEMENT & SCHEDULE MATRIX TABS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCoachClientTab("active")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === "active"
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-[#121217] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <UserCheck size={15} /> Active Clients (
                      {coachClients.active.length})
                    </button>
                    <button
                      onClick={() => setCoachClientTab("past")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === "past"
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-[#121217] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <History size={15} /> Past Clients (
                      {coachClients.past.length})
                    </button>
                    <button
                      onClick={() => setCoachClientTab("calendar")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === "calendar"
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-[#121217] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Calendar size={15} /> Weekly Schedule Grid
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: ACTIVE CLIENTS */}
                {coachClientTab === "active" && (
                  <div className="rounded-3xl bg-[#121217] border border-[#202028] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                          <tr>
                            <th className="p-4">Athlete ID</th>
                            <th className="p-4">Athlete Name</th>
                            <th className="p-4">Training Program</th>
                            <th className="p-4">Target Goal</th>
                            <th className="p-4">Session Slot Timing</th>
                            <th className="p-4">Progress</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#202028] text-slate-200">
                          {coachClients.active.length === 0 ? (
                            <tr>
                              <td
                                colSpan="7"
                                className="p-8 text-center text-slate-400"
                              >
                                No active athletes assigned yet. Click "Assign New Athlete" to assign a member.
                              </td>
                            </tr>
                          ) : (
                            coachClients.active.map((client) => (
                              <tr
                                key={client.id}
                                className="hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="p-4 font-mono text-[#FF2E4C] font-semibold">
                                  {client.id}
                                </td>
                                <td className="p-4">
                                  <span className="font-bold text-white block">
                                    {client.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    {client.email}
                                  </span>
                                </td>
                                <td className="p-4 font-semibold text-slate-200">
                                  {client.program}
                                </td>
                                <td className="p-4 text-slate-300">
                                  {client.goal}
                                </td>
                                <td className="p-4 text-purple-400 font-mono">
                                  {client.slot}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                                      <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: client.progress }}
                                      />
                                    </div>
                                    <span className="text-[11px] font-mono text-emerald-400">
                                      {client.progress}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() =>
                                      showToast(
                                        `✓ Logged training progress for ${client.name}`
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-[#0A0A0D] border border-white/10 hover:border-emerald-500 text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    Log Session
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCoachClients((prev) => ({
                                        active: prev.active.filter(
                                          (c) => c.id !== client.id
                                        ),
                                        past: [
                                          {
                                            id: `PST-${Math.floor(100 + Math.random() * 900)}`,
                                            name: client.name,
                                            email: client.email,
                                            phone: client.phone,
                                            program: client.program,
                                            result: `Completed (${client.goal} Achieved)`,
                                            completionDate: new Date()
                                              .toISOString()
                                              .split("T")[0],
                                            rating: "5.0 ★",
                                          },
                                          ...prev.past,
                                        ],
                                      }));
                                      showToast(
                                        `✓ Graduated ${client.name} to Past Clients!`
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#0A0A0D] border border-white/10 hover:border-amber-500 text-amber-400 text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    Graduate
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW B: PAST CLIENTS */}
                {coachClientTab === "past" && (
                  <div className="rounded-3xl bg-[#121217] border border-[#202028] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                          <tr>
                            <th className="p-4">Record ID</th>
                            <th className="p-4">Athlete Name</th>
                            <th className="p-4">Completed Program</th>
                            <th className="p-4">Outcome & PR Transformation</th>
                            <th className="p-4">Completion Date</th>
                            <th className="p-4">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#202028] text-slate-200">
                          {coachClients.past.length === 0 ? (
                            <tr>
                              <td
                                colSpan="6"
                                className="p-8 text-center text-slate-400"
                              >
                                No past graduated athletes in record yet.
                              </td>
                            </tr>
                          ) : (
                            coachClients.past.map((client) => (
                              <tr
                                key={client.id}
                                className="hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="p-4 font-mono text-slate-400 font-semibold">
                                  {client.id}
                                </td>
                                <td className="p-4 font-bold text-white">
                                  {client.name}
                                  <span className="text-[11px] text-slate-400 font-mono block">
                                    {client.email}
                                  </span>
                                </td>
                                <td className="p-4 font-semibold text-slate-300">
                                  {client.program}
                                </td>
                                <td className="p-4 text-emerald-400 font-medium">
                                  {client.result}
                                </td>
                                <td className="p-4 font-mono text-slate-400">
                                  {client.completionDate}
                                </td>
                                <td className="p-4 text-amber-400 font-bold">
                                  {client.rating}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW C: WEEKLY SCHEDULE MATRIX */}
                {coachClientTab === "calendar" && (
                  <div className="p-6 rounded-3xl bg-[#121217] border border-[#202028] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={16} className="text-[#FF2E4C]" /> Weekly
                      Athlete Slot Matrix ({coachShiftForm.shift})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-3"
                        >
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="font-bold text-white text-xs uppercase">
                              {day}
                            </span>
                            <span className="text-[10px] text-purple-400 font-mono">
                              06:00 - 14:00
                            </span>
                          </div>
                          <div className="space-y-2">
                            {coachClients.active.length > 0 ? (
                              coachClients.active.map((client, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-2.5 rounded-xl bg-[#141419] border border-emerald-500/30 flex justify-between items-center"
                                >
                                  <div>
                                    <span className="text-xs font-bold text-white block">
                                      {client.slot.split("(")[0] || "07:00 AM - 08:00 AM"}
                                    </span>
                                    <span className="text-[10px] text-emerald-400">
                                      {client.name} ({client.program})
                                    </span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[9px] font-mono">
                                    Booked
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="p-2.5 rounded-xl bg-[#141419] border border-white/5 flex justify-between items-center">
                                <div>
                                  <span className="text-xs text-slate-400 block">
                                    Available Slot
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    Open for Active Members
                                  </span>
                                </div>
                                <button
                                  onClick={() => setShowAssignClientModal(true)}
                                  className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-[#FF2E4C] text-white text-[9px] font-mono transition-colors cursor-pointer"
                                >
                                  + Book
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: ENQUIRY LEADS MANAGEMENT                              */}
          {/* ============================================================ */}
          {activeTab === "enquiries" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Visitor & Lead Enquiry Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Capture prospect inquiries, track follow-ups, and convert leads into gym members.
                  </p>
                </div>
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus size={15} /> + New Enquiry
                </button>
              </div>

              <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[880px]">
                    <thead className="bg-[#181820] text-[#8E8E98] uppercase font-bold text-[11px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="px-6 py-3.5 whitespace-nowrap">Enquiry ID</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Lead Name</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Contact Details</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Fitness Goal</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Source</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Date</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#202028] text-slate-200">
                      {enquiries.map((enq) => (
                        <tr
                          key={enq.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-[#FF2E4C] bg-[#FF2E4C]/10 px-2.5 py-1 rounded-md border border-[#FF2E4C]/20">
                              {enq.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                                {enq.name.charAt(0)}
                              </div>
                              <span className="font-bold text-white text-xs">
                                {enq.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                            <span className="block font-medium font-mono">{enq.phone}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {enq.email}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-200 font-medium">{enq.goal}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-400">{enq.source}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono">
                            {enq.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                enq.status === "Converted"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : enq.status === "Trial Booked"
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  enq.status === "Converted"
                                    ? "bg-emerald-400"
                                    : enq.status === "Trial Booked"
                                      ? "bg-cyan-400"
                                      : "bg-amber-400"
                                }`}
                              />
                              {enq.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setRegForm({
                                  name: enq.name,
                                  email: enq.email !== "N/A" ? enq.email : "",
                                  phone: enq.phone,
                                  plan: "PRO MEMBERSHIP",
                                  duration: "Monthly",
                                  paymentMethod: "UPI / GPay",
                                  amount: 2499,
                                });
                                setShowRegModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs transition-all cursor-pointer whitespace-nowrap shadow-sm"
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
          <div className="relative w-full max-w-lg bg-[#121217] border border-[#202028] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="text-[#FF2E4C]" size={20} />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Register New Athlete
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Onboard a member, assign membership pass, and record initial payment.
              </p>
            </div>

            <form onSubmit={handleRegisterCustomer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={regForm.name}
                  onChange={(e) =>
                    setRegForm({ ...regForm, name: e.target.value })
                  }
                  required
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="athlete@domain.com"
                    value={regForm.email}
                    onChange={(e) =>
                      setRegForm({ ...regForm, email: e.target.value })
                    }
                    required
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={(e) =>
                      setRegForm({ ...regForm, phone: e.target.value })
                    }
                    required
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Membership Plan
                  </label>
                  <select
                    value={regForm.plan}
                    onChange={(e) => {
                      const p = e.target.value;
                      const amt = getPlanPrice(p, regForm.duration);
                      setRegForm({ ...regForm, plan: p, amount: amt });
                    }}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    {activePlansList.map((plan) => (
                      <option key={plan.id || plan.name} value={plan.name}>
                        {plan.name} (₹{(Number(plan.price) || 0).toLocaleString()}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Duration
                  </label>
                  <select
                    value={regForm.duration}
                    onChange={(e) => {
                      const dur = e.target.value;
                      const amt = getPlanPrice(regForm.plan, dur);
                      setRegForm({ ...regForm, duration: dur, amount: amt });
                    }}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="Monthly">1 Month (Monthly)</option>
                    <option value="Quarterly">3 Months (Quarterly)</option>
                    <option value="Half-Yearly">6 Months (Half-Yearly)</option>
                    <option value="Annual">12 Months (Annual)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Payment Method
                  </label>
                  <select
                    value={regForm.paymentMethod}
                    onChange={(e) =>
                      setRegForm({ ...regForm, paymentMethod: e.target.value })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash (Counter)</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Amount Settled (₹)
                  </label>
                  <input
                    type="number"
                    value={regForm.amount}
                    onChange={(e) =>
                      setRegForm({ ...regForm, amount: Number(e.target.value) })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-bold outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs transition-all cursor-pointer mt-2 shadow-md"
              >
                Complete Registration & Issue Biometric Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: MEMBERSHIP RENEWAL                                  */}
      {/* ============================================================ */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#121217] border border-[#202028] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setShowRenewModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
                  <RotateCw size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Renew Client Membership
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extend passes for existing athletes & record subscription settlements.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              {/* Select Existing Client */}
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Select Registered Client / Member
                </label>
                <select
                  value={selectedCustomer ? (selectedCustomer.userId || selectedCustomer.id) : ""}
                  onChange={(e) => {
                    const found = customers.find(
                      (c) => (c.userId === e.target.value || c.id === e.target.value)
                    );
                    if (found) {
                      setSelectedCustomer(found);
                      const basePlan = found.plan || "PRO MEMBERSHIP";
                      const months = renewForm.extensionMonths || 1;
                      setRenewForm((prev) => ({
                        ...prev,
                        plan: basePlan,
                        amount: calculateRenewalPrice(basePlan, months),
                        paymentMethod: found.paymentMethod || prev.paymentMethod || "UPI / GPay",
                      }));
                    }
                  }}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.userId || c.id}>
                      {c.name} ({c.id}) — {c.plan} [{c.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Member Mini Card */}
              {selectedCustomer && (
                <div className="p-3.5 rounded-xl bg-[#0A0A0D] border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF2E4C]/20 to-[#FF2E4C]/5 border border-[#FF2E4C]/30 flex items-center justify-center font-bold text-xs text-[#FF2E4C] uppercase shrink-0">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">
                          {selectedCustomer.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#FF2E4C] bg-[#FF2E4C]/10 px-1.5 py-0.2 rounded border border-[#FF2E4C]/20">
                          {selectedCustomer.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {selectedCustomer.phone} · Current: <span className="text-slate-200">{selectedCustomer.plan}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Current Expiry</span>
                    <span className="font-mono text-xs text-amber-400 font-semibold">
                      {selectedCustomer.expiryDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Plan & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Renewal Plan Tier
                  </label>
                  <select
                    value={renewForm.plan}
                    onChange={(e) => {
                      const newPlan = e.target.value;
                      const months = renewForm.extensionMonths || 1;
                      setRenewForm({
                        ...renewForm,
                        plan: newPlan,
                        amount: getPlanPrice(newPlan, months),
                      });
                    }}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    {activePlansList.map((plan) => (
                      <option key={plan.id || plan.name} value={plan.name}>
                        {plan.name} (₹{(Number(plan.price) || 0).toLocaleString()}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Extension Term
                  </label>
                  <select
                    value={renewForm.extensionMonths}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setRenewForm({
                        ...renewForm,
                        extensionMonths: m,
                        amount: calculateRenewalPrice(renewForm.plan, m),
                      });
                    }}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value={1}>+1 Month (Monthly Pass)</option>
                    <option value={3}>+3 Months (Quarterly Pass - 8% Off)</option>
                    <option value={6}>+6 Months (Half-Yearly - 12% Off)</option>
                    <option value={12}>+12 Months (Annual VIP - 2 Mo Free)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method & Amount Settled */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Payment Method
                  </label>
                  <select
                    value={renewForm.paymentMethod}
                    onChange={(e) =>
                      setRenewForm({
                        ...renewForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="UPI / GPay">UPI / Google Pay</option>
                    <option value="Credit Card">Credit / Debit Card (POS)</option>
                    <option value="Cash">Cash (Reception Desk)</option>
                    <option value="Net Banking">Net Banking / Direct Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={renewForm.amount}
                    onChange={(e) =>
                      setRenewForm({ ...renewForm, amount: Number(e.target.value) })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-bold font-mono outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              {/* Extension Preview Banner */}
              {selectedCustomer && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={15} />
                    <span>Projected New Expiry:</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    {getProjectedExpiry(selectedCustomer.expiryDate, renewForm.extensionMonths)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCw size={14} />
                  <span>Confirm & Extend Membership</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: OFFICIAL TAX INVOICE & RECEIPT (PRINTABLE)           */}
      {/* ============================================================ */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#121217] border border-[#202028] rounded-2xl p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Printable Invoice Header */}
            <div className="flex justify-between items-start border-b border-[#202028] pb-6">
              <div>
                <span className="font-bebas text-3xl text-white tracking-wider">
                  {cmsData?.brand?.name || "TITAN•PULSE"}
                </span>
                <p className="text-[10px] text-slate-400 font-mono">
                  {cmsData?.brand?.subname || "3D FITNESS SYSTEM"} • GSTIN:
                  36AAACT1234F1Z9
                </p>
                <p className="text-[10px] text-slate-400">
                  Cyber Arena Complex, High-Tech City
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                  TAX INVOICE
                </span>
                <h4 className="text-sm font-mono font-bold text-[#FF2E4C] mt-2">
                  {selectedInvoice.id}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedInvoice.date}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-4 rounded-xl bg-[#0A0A0D] border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Billed To:
              </span>
              <h4 className="text-base font-bold text-white">
                {selectedInvoice.customerName}
              </h4>
              <p className="text-slate-400 font-mono">
                Member ID: {selectedInvoice.customerId}
              </p>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-[#202028] text-[#8E8E98] uppercase text-[10px] font-bold tracking-wider">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between py-1 text-white">
                <span>{selectedInvoice.plan}</span>
                <span className="font-mono">
                  ₹{selectedInvoice.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Integrated GST (18%)</span>
                <span className="font-mono">
                  ₹{selectedInvoice.tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t border-[#202028] text-base font-bold text-emerald-400 font-mono">
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
                className="flex-1 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Printer size={15} /> Print Official Receipt
              </button>
              <button
                onClick={() => {
                  showToast("✓ Invoice receipt downloaded!");
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 hover:border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
          <div className="relative w-full max-w-md bg-[#121217] border border-[#202028] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="text-[#FF2E4C]" size={20} />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Capture Prospect Lead
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Record visitor details and fitness goals for front desk follow-up.
              </p>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Prospect Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Rao"
                  value={enquiryForm.name}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, name: e.target.value })
                  }
                  required
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={enquiryForm.phone}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, phone: e.target.value })
                  }
                  required
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="siddharth@gmail.com"
                  value={enquiryForm.email}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, email: e.target.value })
                  }
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Primary Fitness Goal
                </label>
                <select
                  value={enquiryForm.goal}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, goal: e.target.value })
                  }
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                >
                  <option value="Muscle Gain & Hypertrophy">
                    Muscle Gain & Hypertrophy
                  </option>
                  <option value="Fat Loss & Cardio Conditioning">
                    Fat Loss & Cardio Conditioning
                  </option>
                  <option value="Personal Trainer (1-on-1)">
                    Personal Trainer (1-on-1)
                  </option>
                  <option value="Cryotherapy & Recovery">
                    Cryotherapy & Recovery
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Enquiry Source
                </label>
                <select
                  value={enquiryForm.source}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, source: e.target.value })
                  }
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                >
                  <option value="Walk-in">Walk-in Visitor</option>
                  <option value="Instagram / Social">Instagram / Social</option>
                  <option value="Member Referral">Member Referral</option>
                  <option value="Website Booking">Website Booking</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Prospect Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: ASSIGN NEW ATHLETE TO COACH                         */}
      {/* ============================================================ */}
      {showAssignClientModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#121217] border border-[#202028] p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Assign Athlete to Coach
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allocate a registered member to {selectedCoach?.name || "Coach"}
                </p>
              </div>
              <button
                onClick={() => setShowAssignClientModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newClientAssign.name) {
                  showToast(
                    "Please select a member with active gym membership"
                  );
                  return;
                }

                const targetCustomer = customers.find(
                  (c) => c.name === newClientAssign.name || c.id === newClientAssign.name || c.userId === newClientAssign.name
                );
                if (
                  !targetCustomer ||
                  !targetCustomer.plan ||
                  targetCustomer.plan === "No Active Plan" ||
                  targetCustomer.status === "No Membership"
                ) {
                  showToast(
                    "⚠️ Cannot allocate coach: Only athletes with active gym membership can be assigned."
                  );
                  return;
                }

                const newEntry = {
                  id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
                  userId: targetCustomer.userId,
                  name: targetCustomer.name,
                  email: targetCustomer.email,
                  phone: targetCustomer.phone || "+91 99887 66554",
                  program: targetCustomer.plan || newClientAssign.program,
                  goal: newClientAssign.goal,
                  slot: `${newClientAssign.slot} (${newClientAssign.days})`,
                  status: "Active",
                  progress: "15%",
                };

                // Persist to MongoDB Atlas
                try {
                  const targetUserId = targetCustomer.userId || targetCustomer.id;
                  if (targetUserId) {
                    await api.put(`/api/users/${targetUserId}`, {
                      assignedTrainer: selectedCoach?.userId || selectedCoach?.id,
                      assignedTrainerName: selectedCoach?.name,
                    });
                  }
                } catch (err) {
                  console.warn("Assign trainer to user err:", err);
                }

                // Update local customers state
                setCustomers((prev) =>
                  prev.map((c) =>
                    c.userId === targetCustomer.userId || c.name === targetCustomer.name
                      ? {
                          ...c,
                          assignedTrainer: selectedCoach?.userId || selectedCoach?.id,
                          assignedTrainerName: selectedCoach?.name,
                        }
                      : c
                  )
                );

                setCoachClients((prev) => ({
                  ...prev,
                  active: [newEntry, ...prev.active],
                }));

                showToast(
                  `✓ Successfully assigned ${targetCustomer.name} to Coach ${selectedCoach?.name || ""}!`
                );
                setReceptionistNotifications((prev) => [
                  {
                    id: `NTF-REC-${Date.now().toString().slice(-4)}`,
                    title: `Athlete Assigned to Coach`,
                    desc: `${targetCustomer.name} booked with Coach ${selectedCoach?.name || ""} (${newClientAssign.slot}).`,
                    category: "trainer",
                    source: "Front Desk Duty Roster",
                    time: "Just now",
                    meta: newClientAssign.slot,
                    unread: true,
                    actionTab: "trainers",
                    actionLabel: "View Roster",
                  },
                  ...prev,
                ]);

                setShowAssignClientModal(false);
                setNewClientAssign({
                  name: "",
                  email: "",
                  phone: "",
                  program: "Hypertrophy 5x5 Strength",
                  slot: "07:00 AM - 08:00 AM",
                  days: "Mon, Wed, Fri",
                  goal: "Hypertrophy & Conditioning",
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Active Gym Member
                </label>
                <select
                  value={newClientAssign.name}
                  onChange={(e) => {
                    const sel = customers.find(
                      (c) => c.name === e.target.value
                    );
                    setNewClientAssign({
                      ...newClientAssign,
                      name: e.target.value,
                      email: sel?.email || "",
                      phone: sel?.phone || "",
                      program: sel?.plan || "PRO MEMBERSHIP",
                    });
                  }}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                >
                  <option value="">-- Choose Member with Active Pass --</option>
                  {customers
                    .filter(
                      (c) =>
                        c.plan &&
                        c.plan !== "No Active Plan" &&
                        c.status !== "No Membership"
                    )
                    .map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.id}) — {c.plan} [{c.status}]
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Session Slot Timing
                  </label>
                  <select
                    value={newClientAssign.slot}
                    onChange={(e) =>
                      setNewClientAssign({
                        ...newClientAssign,
                        slot: e.target.value,
                      })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM (Early Slot)</option>
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM (Peak Morning)</option>
                    <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM (Evening Power)</option>
                    <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM (Peak Prime)</option>
                    <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Training Days
                  </label>
                  <select
                    value={newClientAssign.days}
                    onChange={(e) =>
                      setNewClientAssign({
                        ...newClientAssign,
                        days: e.target.value,
                      })
                    }
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="Mon, Wed, Fri">Mon, Wed, Fri (3x/Week)</option>
                    <option value="Tue, Thu, Sat">Tue, Thu, Sat (3x/Week)</option>
                    <option value="Mon - Sat">Mon - Sat (6x/Week Intensive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Target Coaching Goal & Focus
                </label>
                <input
                  type="text"
                  value={newClientAssign.goal}
                  onChange={(e) =>
                    setNewClientAssign({
                      ...newClientAssign,
                      goal: e.target.value,
                    })
                  }
                  placeholder="e.g. Hypertrophy, Deadlift PR, 10% Body Fat"
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAssignClientModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} /> Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[160] px-5 py-3 rounded-2xl bg-[#121217] border border-[#FF2E4C] text-white text-xs shadow-2xl flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF2E4C]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
