import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import AppleSwitch from "./ui/AppleSwitch";
import { checkShiftDutyStatus } from "../utils/shiftTiming";
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
  EyeOff,
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
  Key,
  Lock,
  ShieldAlert,
  Smartphone,
  Settings,
  Sliders,
  Volume2,
  Save,
  Monitor,
  RotateCcw,
  Camera,
  Upload,
  Trash2,
  Image,
  LifeBuoy,
  MessageSquare,
  Inbox,
  CheckCheck,
} from "lucide-react";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import api from "../lib/api";
import { cn } from "../lib/utils";
import AdminNotificationsHub from "./AdminNotificationsHub";
import ReceptionistOverviewDashboard from "./ReceptionistOverviewDashboard";
import VerifyNumberModal from "./VerifyNumberModal";
import ThermalReceiptPrinter from "./ThermalReceiptPrinter";

export default function ReceptionistDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const { cmsData } = useLandingPageCMS();
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'checkin' | 'customers' | 'memberships' | 'renewals' | 'billing' | 'trainers' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [headerNotifDropdownOpen, setHeaderNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);
  const avatarFileInputRef = useRef(null);

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
  // SETTINGS STATE: PROFILE, CHANGE PASSWORD & GENERAL SETTINGS
  // -------------------------------------------------------------
  const [settingsActiveTab, setSettingsActiveTab] = useState("profile"); // 'profile' | 'password' | 'general'
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 1. Profile Settings Form
  const [profileForm, setProfileForm] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_reception_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: user?.name || "Front Desk Concierge",
      email: user?.email || "reception@titanpulse.com",
      phone: user?.phone || "+91 98765 43210",
      badgeId: "REC-8801",
      shift: "Morning Shift (06:00 AM - 02:00 PM)",
      avatar: user?.avatar || "",
    };
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Image size must be less than 10MB");
      return;
    }

    setIsUploadingAvatar(true);
    showToast("☁️ Uploading profile photo to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64Data,
            folder: "titan-gym/receptionist",
          });

          if (res.data?.status === "success" && res.data?.url) {
            const uploadedUrl = res.data.url;
            setProfileForm((prev) => {
              const updated = { ...prev, avatar: uploadedUrl };
              localStorage.setItem("titan_reception_profile", JSON.stringify(updated));
              return updated;
            });
            showToast("✓ Profile photo uploaded to Cloudinary successfully!");
          } else {
            showToast(res.data?.message || "Failed to upload photo to Cloudinary.");
          }
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          showToast(
            uploadErr.response?.data?.message ||
            "Failed to upload photo to Cloudinary CDN."
          );
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      reader.onerror = () => {
        showToast("Error reading image file.");
        setIsUploadingAvatar(false);
      };
    } catch (err) {
      console.error("File processing error:", err);
      showToast("Failed to process photo.");
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setProfileForm((prev) => {
      const updated = { ...prev, avatar: "" };
      localStorage.setItem("titan_reception_profile", JSON.stringify(updated));
      return updated;
    });
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = "";
    }
    showToast("✓ Profile photo removed.");
  };

  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.setItem("titan_reception_profile", JSON.stringify(profileForm));
      showToast("✓ Profile information updated successfully!");
    } catch (err) {
      showToast("Failed to save profile changes.");
    }
  };

  // 2. Change Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("Please enter your current password");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match");
      return;
    }
    setPassLoading(true);
    try {
      const res = await api.post("/api/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data?.status === "success") {
        showToast("✓ Password updated and saved securely!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(res.data?.message || "Error updating password.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      showToast(
        err.response?.data?.message ||
        "Failed to update password. Please verify current password."
      );
    } finally {
      setPassLoading(false);
    }
  };

  // 3. General Settings Form
  const defaultGeneralSettings = {
    terminalName: "Front Desk Terminal 01 (Main Lobby Gate)",
    shift: "Morning Shift (06:00 AM - 02:00 PM)",
    timeFormat: "12-Hour (AM/PM)",
    audioChime: true,
    streamRefreshRate: "5s",
  };

  const [generalSettings, setGeneralSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_reception_general_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultGeneralSettings;
  });

  const handleSaveGeneralSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.setItem(
        "titan_reception_general_settings",
        JSON.stringify(generalSettings)
      );
      showToast("✓ General settings updated successfully!");
    } catch (err) {
      showToast("Failed to save general settings.");
    }
  };

  // Reception Shift Duty Timing & Live Online Status
  const [currentMinuteTicker, setCurrentMinuteTicker] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentMinuteTicker(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const receptionistShiftString =
    generalSettings.shift || user?.shift || "Morning Shift (06:00 AM - 02:00 PM)";
  const shiftDutyInfo = useMemo(() => {
    return checkShiftDutyStatus(receptionistShiftString);
  }, [receptionistShiftString, currentMinuteTicker]);

  const [isReceptionOnline, setIsReceptionOnline] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_reception_online_status");
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });

  const handleToggleReceptionOnline = (checked) => {
    if (!shiftDutyInfo.isShiftActive) {
      showToast(
        `⚠️ Duty shift has not started yet! Assigned Shift: ${shiftDutyInfo.shiftWindowText}. Online toggle unlocks when shift begins (${shiftDutyInfo.startTimeFormatted}).`
      );
      return;
    }
    setIsReceptionOnline(checked);
    try {
      localStorage.setItem("titan_reception_online_status", JSON.stringify(checked));
    } catch (e) {}
    if (checked) {
      showToast(
        `🟢 Terminal Gate Online: Front Desk active on duty (${shiftDutyInfo.shiftWindowText})`
      );
    } else {
      showToast("⚪ Terminal Gate Offline: Front Desk set to Standby / Break");
    }
  };

  // -------------------------------------------------------------
  // 1. LIVE CUSTOMERS & TRAINERS FROM MONGODB DATABASE
  // -------------------------------------------------------------
  const [customers, setCustomers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_global_support_tickets");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [ticketFilterStatus, setTicketFilterStatus] = useState("all");
  const [ticketFilterPriority, setTicketFilterPriority] = useState("all");
  const [ticketFilterCategory, setTicketFilterCategory] = useState("all");
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [ticketStatusInput, setTicketStatusInput] = useState("Resolved");
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);

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

        // Live Attendance logs fetched from MongoDB
        try {
          const attRes = await api.get("/api/attendance");
          const todayStr = new Date().toISOString().split("T")[0];
          if (attRes.data?.status === "success" && attRes.data?.data && attRes.data.data.length > 0) {
            const normalized = attRes.data.data.map((l) => ({
              ...l,
              status: (l.date && l.date < todayStr && l.status === "Active Inside") ? "Inactive" : (l.status || "Active Inside"),
            }));
            setAttendanceLogs(normalized);
          } else if (attendanceLogs.length === 0) {
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
                date: todayStr,
              }))
            );
          }
        } catch (attErr) {
          console.log("Using local attendance fallback:", attErr);
        }

        // Live Enquiries fetched from MongoDB
        try {
          const enqRes = await api.get("/api/enquiries");
          if (enqRes.data?.status === "success" && Array.isArray(enqRes.data?.data)) {
            setEnquiries(
              enqRes.data.data.map((enq) => ({
                id: enq.enquiryId || enq._id,
                _id: enq._id,
                name: enq.name,
                email: enq.email,
                phone: enq.phone,
                goal: enq.goal,
                source: enq.source,
                status: enq.status,
                notes: enq.notes,
                capturedBy: enq.capturedBy,
                date: enq.date || (enq.createdAt ? enq.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)),
                createdAt: enq.createdAt,
              }))
            );
          }
        } catch (enqErr) {
          console.log("Using local enquiries fallback:", enqErr);
        }

        // Live Trainers (Exclude dummy test seeds)
        const liveTrainers = allUsers
          .filter(
            (u) =>
              u.role === "trainer" &&
              u.email !== "trainer@titangym.com" &&
              !u.name?.toLowerCase().includes("marcus vance")
          )
          .map((u, idx) => {
            const realAssignedCount = liveCustomers.filter(
              (c) =>
                c.assignedTrainer === u.id ||
                c.assignedTrainer === u.displayId ||
                c.assignedTrainerName?.toLowerCase() === u.name?.toLowerCase()
            ).length;

            // Ensure trainer status is never a customer membership string
            let trainerStatus = "Available";
            if (u.trainerStatus) {
              trainerStatus = u.trainerStatus;
            } else if (u.status && !["No Membership", "Active", "Expired", "Due Soon"].includes(u.status)) {
              trainerStatus = u.status;
            }

            return {
              id: u.displayId || `TRN-${501 + idx}`,
              userId: u.id,
              name: u.name,
              spec: u.spec || u.specialization || "Certified Strength & Conditioning Specialist",
              shift: u.shift || "06:00 AM - 02:00 PM",
              clientsToday: realAssignedCount,
              status: trainerStatus,
              phone: u.phone && u.phone !== "N/A" ? u.phone : "N/A",
              email: u.email || "",
              room: u.room || "Main Strength & Conditioning Arena",
              rating: u.rating ? `${u.rating} ★` : "5.0 ★",
            };
          });
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

        // Live Support Tickets fetched from MongoDB / API
        try {
          const tckRes = await api.get("/api/tickets");
          if (tckRes.data?.status === "success" && Array.isArray(tckRes.data?.data)) {
            const remoteTickets = tckRes.data.data;
            const localGlobal = JSON.parse(
              localStorage.getItem("titan_global_support_tickets") || "[]"
            );
            const map = new Map();
            [...remoteTickets, ...localGlobal].forEach((t) => {
              if (t && (t.id || t.ticketId)) {
                const key = t.ticketId || t.id;
                map.set(key, { ...map.get(key), ...t, id: key, ticketId: key });
              }
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
            );
            setTickets(merged);
            localStorage.setItem("titan_global_support_tickets", JSON.stringify(merged));
          }
        } catch (tckErr) {
          console.log("Using local tickets fallback:", tckErr);
        }
      }
    } catch (err) {
      console.log("Error fetching receptionist data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for live attendance, enquiry, and ticket sync across tabs & dashboards
    const handleSync = () => {
      fetchData();
    };

    const handleTicketCreated = (e) => {
      const newTck = e.detail;
      if (newTck) {
        const ticketKey = newTck.ticketId || newTck.id;
        setTickets((prev) => [
          { ...newTck, id: ticketKey, ticketId: ticketKey },
          ...prev.filter((t) => (t.id || t.ticketId) !== ticketKey),
        ]);
        setReceptionistNotifications((prev) => [
          {
            id: `NTF-TICKET-${Date.now().toString().slice(-4)}`,
            title: `New Support Ticket: ${newTck.subject}`,
            desc: `Athlete ${newTck.customerName} (${newTck.customerDisplayId || "Member"}) reported: ${newTck.description || newTck.category}`,
            category: "ticket",
            source: "Customer Portal",
            time: "Just now",
            meta: newTck.priority || "High (Urgent)",
            unread: true,
            actionTab: "tickets",
            actionLabel: "View Ticket",
            ticketData: newTck,
          },
          ...prev,
        ]);
        showToast(
          `🎫 New Support Ticket received from ${newTck.customerName}: "${newTck.subject}"`
        );
      }
      fetchData();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("titan_attendance_sync", handleSync);
    window.addEventListener("titan_enquiry_sync", handleSync);
    window.addEventListener("titan_ticket_created", handleTicketCreated);
    window.addEventListener("titan_ticket_sync", handleSync);
    window.addEventListener("titan_ticket_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("titan_attendance_sync", handleSync);
      window.removeEventListener("titan_enquiry_sync", handleSync);
      window.removeEventListener("titan_ticket_created", handleTicketCreated);
      window.removeEventListener("titan_ticket_sync", handleSync);
      window.removeEventListener("titan_ticket_updated", handleSync);
    };
  }, []);

  // Support Ticket Action Handlers
  const handleOpenTicketModal = (tck) => {
    setSelectedTicketModal(tck);
    setTicketReplyText(
      tck.reply && !tck.reply.includes("Ticket logged with Front Desk")
        ? tck.reply
        : ""
    );
    setTicketStatusInput(
      tck.status === "Open" ? "In Progress" : tck.status || "In Progress"
    );
  };

  const handleUpdateTicket = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedTicketModal) return;

    setIsUpdatingTicket(true);
    const targetId = selectedTicketModal.ticketId || selectedTicketModal.id;
    const nowTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const nowDateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const replyAuthor = user?.name || profileForm?.name || "Front Desk Receptionist";

    const defaultReply =
      ticketStatusInput === "Resolved"
        ? "Issue verified and resolved by Front Desk operations. Please reach out if you require further assistance."
        : ticketStatusInput === "In Progress"
        ? "Front Desk is currently investigating your request. We will update you shortly."
        : "Ticket is being processed by management.";

    const updatedObj = {
      ...selectedTicketModal,
      status: ticketStatusInput,
      reply: ticketReplyText.trim() || defaultReply,
      replyBy: replyAuthor,
      replyAt: `${nowDateStr} at ${nowTimeStr}`,
      updatedAt: new Date().toISOString(),
    };

    // Update local state
    setTickets((prev) =>
      prev.map((t) => ((t.ticketId || t.id) === targetId ? updatedObj : t))
    );

    // Update global storage
    try {
      const globalKey = "titan_global_support_tickets";
      const saved = JSON.parse(localStorage.getItem(globalKey) || "[]");
      const nextSaved = [
        updatedObj,
        ...saved.filter((t) => (t.ticketId || t.id) !== targetId),
      ];
      localStorage.setItem(globalKey, JSON.stringify(nextSaved));

      // Also update customer's personal storage
      const customerUserId = updatedObj.customerId || updatedObj.userId;
      if (customerUserId) {
        const custKey = `titan_support_tickets_${customerUserId}`;
        const custSaved = JSON.parse(localStorage.getItem(custKey) || "[]");
        const nextCust = [
          updatedObj,
          ...custSaved.filter((t) => (t.ticketId || t.id) !== targetId),
        ];
        localStorage.setItem(custKey, JSON.stringify(nextCust));
      }
    } catch (err) {}

    // Dispatch sync events across tabs
    window.dispatchEvent(
      new CustomEvent("titan_ticket_updated", { detail: updatedObj })
    );
    window.dispatchEvent(
      new CustomEvent("titan_ticket_sync", { detail: updatedObj })
    );

    // Send API update
    try {
      await api.put(`/api/tickets/${targetId}`, {
        status: ticketStatusInput,
        reply: updatedObj.reply,
        replyBy: replyAuthor,
      });
    } catch (apiErr) {
      console.log("Backend ticket update notice:", apiErr);
    }

    setIsUpdatingTicket(false);
    setSelectedTicketModal(null);
    showToast(
      `✓ Ticket #${targetId} marked as [${ticketStatusInput}] and dispatched to Member Portal!`
    );
  };

  const handleQuickResolveTicket = async (tck) => {
    const targetId = tck.ticketId || tck.id;
    const nowTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const nowDateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const replyAuthor = user?.name || profileForm?.name || "Front Desk Receptionist";

    const updatedObj = {
      ...tck,
      status: "Resolved",
      reply:
        "Front Desk has verified and resolved your request. Access / facility status is active.",
      replyBy: replyAuthor,
      replyAt: `${nowDateStr} at ${nowTimeStr}`,
      updatedAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => ((t.ticketId || t.id) === targetId ? updatedObj : t))
    );

    try {
      const globalKey = "titan_global_support_tickets";
      const saved = JSON.parse(localStorage.getItem(globalKey) || "[]");
      const nextSaved = [
        updatedObj,
        ...saved.filter((t) => (t.ticketId || t.id) !== targetId),
      ];
      localStorage.setItem(globalKey, JSON.stringify(nextSaved));

      const customerUserId = updatedObj.customerId || updatedObj.userId;
      if (customerUserId) {
        const custKey = `titan_support_tickets_${customerUserId}`;
        const custSaved = JSON.parse(localStorage.getItem(custKey) || "[]");
        const nextCust = [
          updatedObj,
          ...custSaved.filter((t) => (t.ticketId || t.id) !== targetId),
        ];
        localStorage.setItem(custKey, JSON.stringify(nextCust));
      }
    } catch (err) {}

    window.dispatchEvent(
      new CustomEvent("titan_ticket_updated", { detail: updatedObj })
    );
    window.dispatchEvent(
      new CustomEvent("titan_ticket_sync", { detail: updatedObj })
    );

    try {
      await api.put(`/api/tickets/${targetId}`, {
        status: "Resolved",
        reply: updatedObj.reply,
        replyBy: replyAuthor,
      });
    } catch (apiErr) {}

    showToast(`✓ Ticket #${targetId} marked as Resolved!`);
  };

  const handleQuickInProgressTicket = async (tck) => {
    const targetId = tck.ticketId || tck.id;
    const nowTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const nowDateStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const replyAuthor = user?.name || profileForm?.name || "Front Desk Receptionist";

    const updatedObj = {
      ...tck,
      status: "In Progress",
      reply:
        "Front Desk has acknowledged your ticket and is actively attending to the issue.",
      replyBy: replyAuthor,
      replyAt: `${nowDateStr} at ${nowTimeStr}`,
      updatedAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => ((t.ticketId || t.id) === targetId ? updatedObj : t))
    );

    try {
      const globalKey = "titan_global_support_tickets";
      const saved = JSON.parse(localStorage.getItem(globalKey) || "[]");
      const nextSaved = [
        updatedObj,
        ...saved.filter((t) => (t.ticketId || t.id) !== targetId),
      ];
      localStorage.setItem(globalKey, JSON.stringify(nextSaved));

      const customerUserId = updatedObj.customerId || updatedObj.userId;
      if (customerUserId) {
        const custKey = `titan_support_tickets_${customerUserId}`;
        const custSaved = JSON.parse(localStorage.getItem(custKey) || "[]");
        const nextCust = [
          updatedObj,
          ...custSaved.filter((t) => (t.ticketId || t.id) !== targetId),
        ];
        localStorage.setItem(custKey, JSON.stringify(nextCust));
      }
    } catch (err) {}

    window.dispatchEvent(
      new CustomEvent("titan_ticket_updated", { detail: updatedObj })
    );
    window.dispatchEvent(
      new CustomEvent("titan_ticket_sync", { detail: updatedObj })
    );

    try {
      await api.put(`/api/tickets/${targetId}`, {
        status: "In Progress",
        reply: updatedObj.reply,
        replyBy: replyAuthor,
      });
    } catch (apiErr) {}

    showToast(`✓ Ticket #${targetId} marked as In Progress.`);
  };

  // -------------------------------------------------------------
  // MODALS STATE
  // -------------------------------------------------------------
  const [showRegModal, setShowRegModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Manual Check-In OTP Verification Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOtpCustomer, setSelectedOtpCustomer] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [generatedOtpDebug, setGeneratedOtpDebug] = useState("");
  const [alreadyCheckedInModalData, setAlreadyCheckedInModalData] = useState(null);

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
      actionTab: "dashboard",
      actionLabel: "View Dashboard",
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
    if (notif.ticketData) {
      handleOpenTicketModal(notif.ticketData);
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
    password: "TitanPass@2026",
    plan: "PRO MEMBERSHIP",
    duration: "Monthly",
    paymentMethod: "UPI / GPay",
    amount: 2499,
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Helper to generate secure temporary password for athlete
  const generateNewPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pass = "TP-";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRegForm((prev) => ({ ...prev, password: pass }));
    showToast(`Generated temporary password: ${pass}`);
  };

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

  // Quick Check-in & Search inputs
  const [quickCheckinInput, setQuickCheckinInput] = useState("");
  const [turnstileSearchQuery, setTurnstileSearchQuery] = useState("");

  // Live Filtered Attendance Logs for Gate Access Stream
  const filteredAttendanceLogs = useMemo(() => {
    if (!turnstileSearchQuery.trim()) return attendanceLogs;
    const q = turnstileSearchQuery.toLowerCase().trim();
    return attendanceLogs.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.customerId && l.customerId.toLowerCase().includes(q)) ||
        (l.id && l.id.toLowerCase().includes(q)) ||
        (l.plan && l.plan.toLowerCase().includes(q)) ||
        (l.terminal && l.terminal.toLowerCase().includes(q)) ||
        (l.status && l.status.toLowerCase().includes(q)) ||
        (l.timeIn && l.timeIn.toLowerCase().includes(q))
    );
  }, [attendanceLogs, turnstileSearchQuery]);

  // Live Filtered Customers Computation for Turnstile Search Bar
  const filteredCheckinCustomers = useMemo(() => {
    if (!quickCheckinInput.trim()) return [];
    const q = quickCheckinInput.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, quickCheckinInput]);

  // Handle Request Manual Login (OTP Generation & Dispatch)
  const handleRequestManualLogin = async (customer) => {
    const target = customer || filteredCheckinCustomers[0] || customers[0];
    if (!target) {
      showToast("❌ Please search and select a customer first.");
      return;
    }

    setSelectedOtpCustomer(target);
    setOtpInput("");
    setOtpError("");
    setOtpSentSuccess(false);
    setShowOtpModal(true);
    setIsRequestingOtp(true);

    try {
      const res = await api.post("/api/attendance/request-otp", {
        customerId: target.id,
        userId: target.userId,
        name: target.name,
        email: target.email,
        phone: target.phone,
        plan: target.plan,
      });

      if (res.data?.status === "success") {
        setOtpSentSuccess(true);
        if (res.data?.data?.debugOtp) {
          setGeneratedOtpDebug(res.data.data.debugOtp);
        }
        showToast(`✓ Verification OTP sent to ${target.name}'s customer portal!`);

        // Real-time broadcast to Customer Dashboard across tabs / windows
        const syncPayload = {
          customerId: target.id,
          userId: target.userId,
          name: target.name,
          email: target.email,
          otp: res.data.data?.debugOtp,
          expiresAt: res.data.data?.expiresAt,
          timestamp: Date.now(),
        };
        localStorage.setItem("titan_customer_otp_requested", JSON.stringify(syncPayload));
        window.dispatchEvent(new CustomEvent("titan_customer_otp_sync", { detail: syncPayload }));
      } else {
        setOtpError(res.data?.message || "Failed to dispatch verification OTP");
      }
    } catch (err) {
      console.error("Error requesting OTP:", err);
      if (err.response?.data?.status === "already_checked_in" && err.response.data?.data) {
        setShowOtpModal(false);
        setAlreadyCheckedInModalData(err.response.data.data);
        showToast(`⚠️ ${target.name} is already checked in. 6-hour gap required.`);
      } else {
        setOtpError(err.response?.data?.message || "Error generating OTP. Please try again.");
      }
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle Verify Manual Login (OTP Verification & MongoDB Attendance Logging)
  const handleVerifyManualLogin = async (e) => {
    if (e) e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length < 4) {
      setOtpError("Please enter the complete verification OTP provided by the athlete");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const res = await api.post("/api/attendance/verify-otp", {
        customerId: selectedOtpCustomer?.id,
        userId: selectedOtpCustomer?.userId,
        name: selectedOtpCustomer?.name,
        email: selectedOtpCustomer?.email,
        phone: selectedOtpCustomer?.phone,
        plan: selectedOtpCustomer?.plan,
        otp: otpInput.trim(),
        terminal: "Turnstile Gate Alpha-1 (Front Desk Manual)",
      });

      if (res.data?.status === "success" && res.data?.data) {
        const newRecord = res.data.data;
        setAttendanceLogs((prev) => [newRecord, ...prev.filter((l) => l.id !== newRecord.id)]);
        showToast(`✓ Access Granted: ${newRecord.name} clocked in!`);
        setShowOtpModal(false);
        setOtpInput("");
        fetchData();
      } else {
        setOtpError(res.data?.message || "Invalid OTP code");
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      if (err.response?.data?.status === "already_checked_in" && err.response.data?.data) {
        setShowOtpModal(false);
        setAlreadyCheckedInModalData(err.response.data.data);
      } else {
        setOtpError(err.response?.data?.message || "Invalid or expired OTP code.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Quick RFID / Customer Scan Check-in
  const handleQuickCheckin = async (e) => {
    if (e) e.preventDefault();
    if (!quickCheckinInput.trim()) return;

    const matched = customers.find(
      (c) =>
        c.id.toLowerCase() === quickCheckinInput.toLowerCase() ||
        c.name.toLowerCase().includes(quickCheckinInput.toLowerCase()) ||
        c.phone.includes(quickCheckinInput)
    );

    if (matched) {
      try {
        const res = await api.post("/api/attendance/quick-checkin", {
          customerId: matched.id,
          userId: matched.userId,
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          plan: matched.plan,
          terminal: "Turnstile Gate Alpha-1",
          verification: "Biometric NFC Pass",
        });

        const newLog = res.data?.data || {
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
          verification: "Biometric NFC Pass",
        };

        setAttendanceLogs((prev) => [newLog, ...prev.filter((l) => l.id !== newLog.id)]);
        showToast(`✓ Access Granted: ${matched.name} checked in!`);

        // Multi-dashboard broadcast
        const syncPayload = { ...newLog, syncTimestamp: Date.now() };
        localStorage.setItem("titan_attendance_updated", JSON.stringify(syncPayload));
        window.dispatchEvent(new CustomEvent("titan_attendance_sync", { detail: syncPayload }));

        setQuickCheckinInput("");
      } catch (err) {
        if (err.response?.data?.status === "already_checked_in" && err.response.data?.data) {
          setAlreadyCheckedInModalData(err.response.data.data);
          showToast(`⚠️ ${matched.name} is already checked in. 6-hour gap required.`);
        } else {
          showToast("Error checking in member.");
        }
      }
    } else {
      showToast("❌ No matching member found for check-in.");
    }
  };

  // Handle Member Check-out
  const handleCheckoutMember = async (logId, name) => {
    const timeOutStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId || log.logId === logId) {
          return { ...log, timeOut: timeOutStr, status: "Checked Out" };
        }
        return log;
      })
    );

    try {
      await api.put(`/api/attendance/${logId}/checkout`);
    } catch (e) {}

    const syncPayload = { logId, name, timeOut: timeOutStr, status: "Checked Out", syncTimestamp: Date.now() };
    localStorage.setItem("titan_attendance_updated", JSON.stringify(syncPayload));
    window.dispatchEvent(new CustomEvent("titan_attendance_sync", { detail: syncPayload }));

    showToast(`✓ Check-out recorded for ${name} (${timeOutStr})`);
  };

  // Download official tax invoice document (HTML/PDF format)
  const handleDownloadInvoice = (inv) => {
    const invId = inv.id || `INV-${Date.now().toString().slice(-6)}`;
    const dateStr = inv.date || new Date().toLocaleDateString("en-IN");
    const amount = Number(inv.total || inv.amount || 4999);
    const baseAmount = inv.amount || Math.round(amount / 1.18);
    const gstAmount = inv.tax || (amount - baseAmount);
    const custName = inv.customerName || "Titan Athlete";
    const custId = inv.customerId || "CUST-301";
    const planName = inv.plan || "Titan Elite Membership";
    const method = inv.paymentMethod || "UPI / Online Payment";

    const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${invId} - Titan Pulse</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0A0A0D; color: #F1F5F9; padding: 40px 20px; display: flex; justify-content: center; }
    .invoice-card { width: 100%; max-width: 680px; background: #141419; border: 1px solid #202028; border-radius: 20px; padding: 36px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #202028; padding-bottom: 24px; margin-bottom: 28px; }
    .logo-row { display: flex; align-items: center; gap: 12px; }
    .logo-badge { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #FF1E27, #B30006); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 20px; }
    .brand-name { font-size: 20px; font-weight: 900; color: #FFFFFF; letter-spacing: 0.5px; }
    .brand-tag { font-size: 11px; color: #94A3B8; margin-top: 2px; }
    .meta-box { text-align: right; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: rgba(16,185,129,0.15); color: #34D399; border: 1px solid rgba(16,185,129,0.4); text-transform: uppercase; letter-spacing: 0.5px; }
    .inv-id { font-size: 16px; font-weight: 800; color: #FFFFFF; font-family: monospace; margin-top: 8px; }
    .inv-date { font-size: 12px; color: #94A3B8; margin-top: 2px; }
    .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; background: #090C0E; border: 1px solid #1C2024; border-radius: 14px; padding: 18px; }
    .label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; margin-bottom: 6px; font-family: monospace; }
    .val-primary { font-size: 14px; font-weight: 700; color: #F8FAFC; }
    .val-sub { font-size: 12px; color: #94A3B8; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 12px; background: #090C0E; font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.5px; border-top: 1px solid #202028; border-bottom: 1px solid #202028; }
    td { padding: 16px 12px; font-size: 13px; border-bottom: 1px solid #1C2024; }
    .totals-wrapper { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-box { width: 280px; }
    .t-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; color: #94A3B8; }
    .t-row.grand { border-top: 1px solid #202028; padding-top: 12px; margin-top: 6px; font-size: 16px; font-weight: 800; color: #34D399; }
    .footer { border-top: 1px solid #202028; padding-top: 20px; text-align: center; font-size: 11px; color: #64748B; line-height: 1.6; }
    .print-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 10px 20px; background: #FF2E4C; color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0; }
      .invoice-card { border: none; box-shadow: none; max-width: 100%; padding: 20px; background: #fff !important; }
      .grid-info { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
      .brand-name, .val-primary, .inv-id, strong { color: #000 !important; }
      th { background: #f1f5f9 !important; color: #475569 !important; border-color: #cbd5e1 !important; }
      td { border-color: #e2e8f0 !important; color: #000 !important; }
      .val-sub, .inv-date, .brand-tag, .t-row { color: #475569 !important; }
      .t-row.grand { color: #059669 !important; border-color: #cbd5e1 !important; }
      .print-btn { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="logo-row">
        <div class="logo-badge">⚡</div>
        <div>
          <div class="brand-name">TITAN PULSE FITNESS</div>
          <div class="brand-tag">High Performance Arena • GSTIN: 36AAACT1114Q1Z8</div>
        </div>
      </div>
      <div class="meta-box">
        <span class="status-badge">PAID & VERIFIED</span>
        <div class="inv-id">${invId}</div>
        <div class="inv-date">${dateStr}</div>
      </div>
    </div>

    <div class="grid-info">
      <div>
        <div class="label">Billed To</div>
        <div class="val-primary">${custName}</div>
        <div class="val-sub">Member ID: #${custId}</div>
        <div class="val-sub">Billing Entity: Athlete Account</div>
      </div>
      <div>
        <div class="label">Payment Breakdown</div>
        <div class="val-primary">Gateway: ${method}</div>
        <div class="val-sub">Status: Settled & Cleared</div>
        <div class="val-sub">Turnstile Access: Biometric Enabled</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color: #F8FAFC;">${planName}</strong>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Official Arena Facility & Biometric Turnstile Pass</div>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">₹${amount.toLocaleString("en-IN")}</td>
          <td style="text-align: right; font-weight: 700; color: #F8FAFC;">₹${amount.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-wrapper">
      <div class="totals-box">
        <div class="t-row"><span>Base Amount:</span><span>₹${baseAmount.toLocaleString("en-IN")}</span></div>
        <div class="t-row"><span>GST (18% Included):</span><span>₹${gstAmount.toLocaleString("en-IN")}</span></div>
        <div class="t-row grand"><span>Total Settled:</span><span>₹${amount.toLocaleString("en-IN")}</span></div>
      </div>
    </div>

    <div class="footer">
      <div>Official computer-generated Tax Invoice issued by Titan Pulse Reception Desk.</div>
      <div>Support: reception@titanpulse.fit • Front Desk Helpline: +91 98765 43210</div>
      <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${invId}_${custName.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded Tax Invoice for ${custName} (${invId})`);
  };

  // Handle New Customer Registration & Onboarding with Membership
  const handleRegisterCustomer = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) {
      showToast("Please enter name and email");
      return;
    }

    const custPassword = (regForm.password && regForm.password.trim())
      ? regForm.password.trim()
      : `TitanPass@${Math.floor(1000 + Math.random() * 9000)}`;

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
        password: custPassword,
      });

      if (res.data?.status === "success" || res.data?.data) {
        const isEmailSent = res.data?.emailSent;
        if (isEmailSent) {
          showToast(`✓ Onboarded ${regForm.name} & credentials sent to email!`);
        } else {
          showToast(`✓ Onboarded ${regForm.name} with ${regForm.plan}!`);
        }

        setReceptionistNotifications((prev) => [
          {
            id: `NTF-REC-${Date.now().toString().slice(-4)}`,
            title: `New Athlete Onboarded`,
            desc: `${regForm.name} registered under ${regForm.plan} (${regForm.duration}). Password assigned & ${isEmailSent ? 'emailed via SMTP' : 'recorded'}.`,
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
          password: "TitanPass@2026",
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
  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast("Please enter name and phone.");
      return;
    }

    try {
      const payload = {
        name: enquiryForm.name,
        email: enquiryForm.email || "N/A",
        phone: enquiryForm.phone,
        goal: enquiryForm.goal || "Muscle Gain & Hypertrophy",
        source: enquiryForm.source || "Walk-in Visitor",
        notes: "",
        capturedBy: "Front Desk Receptionist",
      };

      const res = await api.post("/api/enquiries", payload);
      const savedLead = res.data?.data || {
        ...payload,
        id: `ENQ-${Date.now().toString().slice(-4)}`,
        status: "New Lead",
        date: new Date().toISOString().split("T")[0],
      };

      const formattedLead = {
        id: savedLead.enquiryId || savedLead._id || `ENQ-${Date.now().toString().slice(-4)}`,
        _id: savedLead._id,
        name: savedLead.name,
        email: savedLead.email,
        phone: savedLead.phone,
        goal: savedLead.goal,
        source: savedLead.source,
        status: savedLead.status || "New Lead",
        notes: savedLead.notes || "",
        capturedBy: savedLead.capturedBy || "Front Desk Receptionist",
        date: savedLead.date || new Date().toISOString().split("T")[0],
        createdAt: savedLead.createdAt || new Date().toISOString(),
      };

      setEnquiries((prev) => [formattedLead, ...prev]);

      // Cross-tab / cross-dashboard broadcast so Admin Dashboard receives real-time alert & data
      try {
        const syncData = {
          type: "NEW_ENQUIRY_LEAD",
          lead: formattedLead,
          timestamp: Date.now(),
        };
        localStorage.setItem("titan_enquiry_sync_lead", JSON.stringify(syncData));
        window.dispatchEvent(new CustomEvent("titan_enquiry_sync", { detail: syncData }));
      } catch (storageErr) {}

      setReceptionistNotifications((prev) => [
        {
          id: `NTF-REC-${Date.now().toString().slice(-4)}`,
          title: `New Enquiry Lead: ${formattedLead.name}`,
          desc: `Prospect ${formattedLead.name} (${formattedLead.phone}) registered for ${formattedLead.goal} (${formattedLead.source}). Synced to Admin HQ.`,
          category: "enquiry",
          source: "Reception Desk",
          time: "Just now",
          meta: "Admin Synced",
          unread: true,
          actionTab: "dashboard",
          actionLabel: "View Dashboard",
        },
        ...prev,
      ]);

      showToast(`✓ Lead captured for ${formattedLead.name} & dispatched to Admin Dashboard!`);
      setShowEnquiryModal(false);
      setEnquiryForm({
        name: "",
        email: "",
        phone: "",
        goal: "Muscle Gain & Hypertrophy",
        source: "Walk-in Visitor",
      });
    } catch (err) {
      console.error("Error creating enquiry lead:", err);
      showToast(err.response?.data?.message || "Failed to save lead to database");
    }
  };

  const todayDateStr = new Date().toISOString().split("T")[0];

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
      count: attendanceLogs.filter((l) => l.status === "Active Inside" && (!l.date || l.date === todayDateStr)).length,
    },
    {
      id: "manual-login",
      label: "Manual Login",
      icon: Key,
      count: customers.length,
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
      id: "tickets",
      label: "Support & Helpdesk",
      icon: LifeBuoy,
      count: tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length,
    },
    {
      id: "settings",
      label: "Station Settings",
      icon: Settings,
    },
  ];

  const activeInsideCount = attendanceLogs.filter(
    (l) => l.status === "Active Inside" && (!l.date || l.date === todayDateStr)
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
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#0A0A0D] text-white flex selection:bg-[#FF1E27] selection:text-white font-['Outfit',sans-serif] tracking-normal">
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
        {/* Top Header Bar Matching Admin Dashboard with High Stacking Context */}
        <header className="h-20 px-6 sm:px-10 border-b border-[#202028] bg-[#121217]/95 backdrop-blur-2xl flex items-center justify-between gap-4 sticky top-0 z-50">
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
            {/* Apple-Style Shift Duty Timing & Online/Offline Switch */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-4 py-1.5 rounded-2xl bg-[#181820]/90 border border-white/10 backdrop-blur-xl shadow-lg">
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !shiftDutyInfo.isShiftActive
                        ? "bg-amber-500 animate-pulse"
                        : isReceptionOnline
                        ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        : "bg-slate-500"
                    }`}
                  />
                  <span className="text-xs font-bold text-white tracking-tight">
                    {!shiftDutyInfo.isShiftActive
                      ? "Off Duty Hours"
                      : isReceptionOnline
                      ? "Online (On Duty)"
                      : "Offline (Break)"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono leading-none mt-0.5 max-w-[140px] sm:max-w-none truncate">
                  {!shiftDutyInfo.isShiftActive
                    ? shiftDutyInfo.nextShiftMessage || shiftDutyInfo.shiftWindowText
                    : shiftDutyInfo.shiftWindowText}
                </span>
              </div>

              <div
                onClick={() => {
                  if (!shiftDutyInfo.isShiftActive) {
                    showToast(
                      `⚠️ Duty shift has not started yet. Assigned Shift: ${shiftDutyInfo.shiftWindowText}. Online toggle unlocks when shift begins (${shiftDutyInfo.startTimeFormatted}).`
                    );
                  }
                }}
              >
                <AppleSwitch
                  checked={shiftDutyInfo.isShiftActive ? isReceptionOnline : false}
                  disabled={!shiftDutyInfo.isShiftActive}
                  onCheckedChange={handleToggleReceptionOnline}
                  size="sm"
                  tone="emerald"
                  aria-label="Reception Duty Online/Offline Switch"
                />
              </div>
            </div>

            {/* Notification Bell Dropdown Button & Popover */}
            <div className="relative z-50" ref={notifDropdownRef}>
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
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#121217] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-3xl z-[150] overflow-hidden"
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
          {/* TAB 0: DASHBOARD MISSION CONTROL (CLEAN GYM FRONT DESK OVERVIEW)    */}
          {/* ============================================================ */}
          {activeTab === "dashboard" && (
            <ReceptionistOverviewDashboard
              activeInsideCount={activeInsideCount}
              customersCount={customers.length}
              dueSoonCount={dueSoonCount}
              invoicesCount={invoices.length}
              ticketsCount={tickets.filter((t) => (t.status || "Open") === "Open" || t.status === "In Progress").length}
              onNavigateTab={(tab) => setActiveTab(tab)}
              attendanceLogs={attendanceLogs}
              trainers={trainers}
              customers={customers}
              onNewCustomer={() => setShowRegModal(true)}
              onNewEnquiry={() => setShowEnquiryModal(true)}
            />
          )}

          {/* ============================================================ */}
          {/* ============================================================ */}
          {/* TAB 1: GATE CHECK-IN / CHECK-OUT TERMINAL                     */}
          {/* ============================================================ */}
          {activeTab === "checkin" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
                      Turnstile Gate Access Stream
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30 font-mono">
                      GATE A1 ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time biometric attendance stream, turnstile entry logs, and gate traffic monitor.
                  </p>
                </div>
              </div>

              {/* Quick Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Active In Arena
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-outfit">
                      {activeInsideCount}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Today's Check-ins
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
                      {attendanceLogs.length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <CalendarCheck size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Coaches On Duty
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-outfit">
                      {
                        trainers.filter(
                          (t) =>
                            t.status === "Available" ||
                            t.status === "In Session"
                        ).length
                      }
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Dumbbell size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Due / Expiring
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF2E4C] tracking-tight font-outfit">
                      {dueSoonCount}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
                    <Clock size={20} />
                  </div>
                </div>
              </div>

              {/* Turnstile Access Stream Search Bar */}
              <div className="p-3.5 sm:p-4 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:flex-1">
                  <input
                    type="text"
                    placeholder="Search logs by Athlete Name, Member ID, Log ID, Plan, or Gate Terminal..."
                    value={turnstileSearchQuery}
                    onChange={(e) => setTurnstileSearchQuery(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-white/[0.08] focus:border-[#FF2E4C]/60 rounded-xl px-4 py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner font-sans"
                  />
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  {turnstileSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTurnstileSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs text-slate-400 font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 font-outfit">
                    Showing {filteredAttendanceLogs.length} of {attendanceLogs.length} logs
                  </span>
                </div>
              </div>

              {/* Attendance Log Table with Instant Check-out Action */}
              <div className="group rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#14151d]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/20 flex items-center justify-center">
                      <CalendarCheck size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 font-outfit">
                        <span>Live Turnstile Access Stream</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] opacity-70 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Real-time visitor biometric entries & exit logs
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5 font-outfit font-bold">
                    Today's Session Logs ({filteredAttendanceLogs.length})
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[880px]">
                    <thead className="bg-[#14151d] text-[#8E8E98] uppercase font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06] font-outfit">
                      <tr>
                        <th className="px-5 py-3.5 whitespace-nowrap">Log ID</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Athlete / Member</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Membership Pass</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Gate Terminal</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Clock In</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-slate-200">
                      {filteredAttendanceLogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-outfit">
                            No turnstile logs found {turnstileSearchQuery ? `matching "${turnstileSearchQuery}"` : "for today"}.
                          </td>
                        </tr>
                      ) : (
                        filteredAttendanceLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">
                              {log.id}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 font-outfit">
                                {log.name.charAt(0)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-white text-xs leading-snug font-outfit">
                                  {log.name}
                                </span>
                                <span className="text-[10px] text-[#FF2E4C] font-mono font-medium">
                                  {log.customerId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-200">
                            {log.plan}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-400">
                            {log.terminal}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-[#00ffba]">
                            {log.timeIn}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase whitespace-nowrap ${
                                log.status === "Active Inside"
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                  : log.status === "Inactive"
                                  ? "bg-rose-950/30 text-slate-400 border border-white/10"
                                  : "bg-white/[0.04] text-slate-400 border border-white/5"
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
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            {log.status === "Active Inside" ? (
                              <button
                                onClick={() =>
                                  handleCheckoutMember(log.id, log.name)
                                }
                                className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all cursor-pointer shadow-sm font-outfit"
                              >
                                Clock Out
                              </button>
                            ) : log.status === "Inactive" ? (
                              <span className="text-slate-500 text-xs font-mono font-medium">
                                Inactive
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs font-mono font-medium">
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1.5: MANUAL MEMBER LOGIN & OTP CHECK-IN CONSOLE          */}
          {/* ============================================================ */}
          {activeTab === "manual-login" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#F59E0B]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
                      Manual Member Login & Verification
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                      OTP CONSOLE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Authenticate athletes by Name, Phone, or Member ID and dispatch live OTP security pass for gate clock-in.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("checkin")}
                    className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#20202a] border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm font-outfit"
                  >
                    <CalendarCheck size={15} className="text-cyan-400" /> Scanner Terminal
                  </button>
                  <button
                    onClick={() => setShowRegModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-outfit"
                  >
                    <UserPlus size={15} /> + New Athlete
                  </button>
                </div>
              </div>

              {/* Quick Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Registered Athletes
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
                      {customers.length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Manual Logins Today
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-outfit">
                      {attendanceLogs.filter((l) => (l.verification || "").toLowerCase().includes("manual")).length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Key size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Active In Arena
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-outfit">
                      {activeInsideCount}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Gate Terminal
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
                      Alpha-1
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                </div>
              </div>

              {/* Main Manual Login Search & Action Card */}
              <div className="group p-5 sm:p-6 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-5 relative transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                      <Key size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 font-outfit">
                        <span>Front Desk Manual Login Console</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] opacity-70 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Search athlete by Name, Phone, Email or ID to generate security OTP for gate clock-in.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono font-bold w-fit flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ● Scanner Terminal Alpha-1 Online
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Athlete by Name, Phone, or Member ID (e.g. nani, rahul, CUST-301)..."
                    value={quickCheckinInput}
                    onChange={(e) => setQuickCheckinInput(e.target.value)}
                    autoFocus
                    className="w-full bg-[#0c0e12] border border-white/[0.08] focus:border-[#FF2E4C]/60 rounded-xl px-4 py-3 pl-11 pr-11 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner font-sans"
                  />
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  {quickCheckinInput && (
                    <button
                      type="button"
                      onClick={() => setQuickCheckinInput("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Filtered Matching Athletes List */}
                <div className="p-3.5 sm:p-4 rounded-[16px] bg-[#0c0e12]/80 border border-white/[0.06] shadow-inner space-y-3">
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-white/[0.04]">
                    <span className="text-[11px] font-bold text-[#FF2E4C] uppercase tracking-wider flex items-center gap-2 font-mono">
                      <Users size={13} className="text-[#FF2E4C]" />
                      <span>
                        MATCHING ATHLETES (
                        {quickCheckinInput.trim() ? filteredCheckinCustomers.length : customers.length}
                        )
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Click "Manual Login" to dispatch OTP
                    </span>
                  </div>

                  {(quickCheckinInput.trim() ? filteredCheckinCustomers : customers).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs space-y-1.5 font-outfit">
                      <AlertCircle size={22} className="mx-auto text-slate-500" />
                      <p>
                        No registered athlete found matching "<span className="text-white font-semibold">{quickCheckinInput}</span>".
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto space-y-2 no-scrollbar pr-1">
                      {(quickCheckinInput.trim() ? filteredCheckinCustomers : customers).map((cust) => (
                        <div
                          key={cust.id || cust.userId}
                          className="p-3 rounded-xl bg-[#14151d] hover:bg-[#1a1c26] border border-white/[0.04] hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/row"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2E4C]/20 to-white/5 border border-[#FF2E4C]/30 text-[#FF2E4C] font-bold text-xs flex items-center justify-center shrink-0 font-outfit">
                              {cust.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white group-hover/row:text-amber-300 transition-colors truncate font-outfit">
                                  {cust.name}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                                  {cust.id}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                <span className="text-slate-300 font-medium">{cust.name}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-semibold uppercase truncate max-w-[200px]">
                                  {cust.plan}
                                </span>
                                {cust.phone && cust.phone !== "N/A" && (
                                  <>
                                    <span>•</span>
                                    <span className="text-slate-400">{cust.phone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                            {/* Manual Login Button */}
                            <button
                              type="button"
                              onClick={() => handleRequestManualLogin(cust)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm font-outfit"
                              title="Send OTP to customer page and verify manual login"
                            >
                              <Key size={13} className="text-amber-400" />
                              <span>Manual Login</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Today's Manual Check-in Logs Table */}
              <div className="group rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#14151d]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <Key size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 font-outfit">
                        <span>Today's Manual OTP Logins Ledger</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] opacity-70 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Verified manual front-desk attendance logs & session timestamps
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-300 font-mono bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 font-outfit font-bold">
                    {attendanceLogs.filter((l) => (l.verification || "").toLowerCase().includes("manual")).length} Entries Today
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[880px]">
                    <thead className="bg-[#14151d] text-[#8E8E98] uppercase font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06] font-outfit">
                      <tr>
                        <th className="px-5 py-3.5 whitespace-nowrap">Log ID</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Athlete / Member</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Membership Pass</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Gate Terminal</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Clock In</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Clock Out</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Verification</th>
                        <th className="px-5 py-3.5 whitespace-nowrap text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-slate-200">
                      {attendanceLogs.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-10 text-center text-slate-500 font-outfit">
                            No attendance records recorded yet today.
                          </td>
                        </tr>
                      ) : (
                        attendanceLogs.map((log) => (
                          <tr
                            key={log.id || log._id}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">
                                {log.id}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 font-outfit">
                                  {log.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-white text-xs leading-snug block font-outfit">{log.name}</span>
                                  <span className="text-[10px] text-[#FF2E4C] font-mono font-medium">
                                    {log.customerId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-200">
                              {log.plan}
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                              {log.terminal}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-[#00ffba]">
                              {log.timeIn}
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap">
                              {log.timeOut || "--"}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase whitespace-nowrap ${
                                  log.status === "Active Inside"
                                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                    : log.status === "Inactive"
                                    ? "bg-rose-950/30 text-slate-400 border border-white/10"
                                    : "bg-white/[0.04] text-slate-400 border border-white/5"
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
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                                  (log.verification || "").toLowerCase().includes("manual")
                                    ? "bg-amber-950/60 text-amber-300 border-amber-800/60"
                                    : "bg-white/[0.05] text-slate-300 border-white/10"
                                }`}
                              >
                                {log.verification || "Manual OTP"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              {log.status === "Active Inside" ? (
                                <button
                                  onClick={() =>
                                    handleCheckoutMember(log.id, log.name)
                                  }
                                  className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all cursor-pointer shadow-sm font-outfit"
                                >
                                  Clock Out
                                </button>
                              ) : log.status === "Inactive" ? (
                                <span className="text-slate-500 text-xs font-mono font-medium">
                                  Inactive
                                </span>
                              ) : (
                                <span className="text-slate-500 text-xs font-mono font-medium">
                                  Completed
                                </span>
                              )}
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

          {/* ============================================================ */}
          {/* TAB 2: CUSTOMER SEARCH AND MANAGEMENT                        */}
          {/* ============================================================ */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
                    Customer Search & Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Look up member credentials, plan status, contact athletes, and process renewals.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-outfit"
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
                  <h2 className="font-outfit font-extrabold text-white tracking-tight text-xl sm:text-2xl">
                    Membership Plans Catalog
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Official packages, pricing structures, and included facility privileges.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activePlansList.map((plan, idx) => {
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const borderClass = isFirst
                    ? "border-[#FF2E4C]/40 shadow-xl"
                    : isSecond
                    ? "border-white/[0.12] shadow-lg"
                    : "border-white/[0.06] shadow-lg";
                  const badgeClass = isFirst
                    ? "bg-[#FF2E4C] text-white"
                    : "bg-white/[0.06] text-slate-200 border border-white/10";
                  const priceColorClass = isFirst
                    ? "text-[#FF2E4C]"
                    : "text-white";
                  const buttonClass = isFirst
                    ? "bg-[#FF2E4C] hover:brightness-110 text-white shadow-md shadow-[#FF2E4C]/20"
                    : "bg-[#14151D] border border-white/10 hover:border-white/20 text-white";

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
                      className={`p-6 rounded-[20px] bg-[#121318] border ${borderClass} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-4 relative flex flex-col justify-between`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-outfit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
                          >
                            {plan.badge || (isFirst ? "MOST POPULAR" : isSecond ? "VIP STATUS" : "MASTER COACHING")}
                          </span>
                          {plan.duration && (
                            <span className="font-outfit text-[10px] text-slate-400 uppercase font-semibold">
                              {plan.duration}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                            {plan.name}
                          </h3>
                          {plan.subBadge && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {plan.subBadge}
                            </p>
                          )}
                        </div>

                        <div className={`font-outfit text-3xl font-extrabold tracking-tight ${priceColorClass}`}>
                          ₹{monthlyPrice.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            / month
                          </span>
                        </div>

                        {plan.annualPrice && (
                          <div className="font-outfit text-[11px] text-slate-400 font-medium -mt-2">
                            Annual: ₹{Number(plan.annualPrice).toLocaleString()}/yr
                          </div>
                        )}

                        <ul className="space-y-2 text-xs text-slate-300 border-t border-white/[0.06] pt-4">
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
                        className={`w-full py-2.5 rounded-xl font-outfit font-semibold text-xs transition-all cursor-pointer mt-4 ${buttonClass}`}
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
                  <h2 className="font-outfit font-extrabold text-white tracking-tight text-xl sm:text-2xl flex items-center gap-2">
                    <span>Membership Renewals & Extensions</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full font-sans">
                      Front Desk Concierge
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Extend memberships for existing athletes, handle pass renewals, and dispatch WhatsApp renewal notices.
                  </p>
                </div>
                <button
                  onClick={() => openRenewalModal(customers[0] || null)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <RotateCw size={15} /> Renew Existing Client
                </button>
              </div>

              {/* Expiry Alerts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setRenewalFilter("all")}
                  className={`p-5 rounded-[20px] bg-[#121318] border transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] ${
                    renewalFilter === "all"
                      ? "border-white/30 bg-[#171821]"
                      : "border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-outfit text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1">
                        All Registered Clients
                      </span>
                      <h3 className="font-outfit font-extrabold text-white text-2xl sm:text-3xl tracking-tight">
                        {customers.length}
                      </h3>
                    </div>
                    <Users className="text-slate-400" size={24} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    Total membership holders
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("due")}
                  className={`p-5 rounded-[20px] bg-[#121318] border transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] ${
                    renewalFilter === "due"
                      ? "border-amber-500/50 bg-[#1c1810]"
                      : "border-amber-500/20 hover:border-amber-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-outfit text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        Due within 7 Days
                      </span>
                      <h3 className="font-outfit font-extrabold text-white text-2xl sm:text-3xl tracking-tight">
                        {customers.filter((c) => c.status === "Due Soon").length}
                      </h3>
                    </div>
                    <AlertTriangle className="text-amber-400" size={24} />
                  </div>
                  <span className="text-[11px] text-amber-400/80 mt-2 block">
                    Follow-up priority
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("expired")}
                  className={`p-5 rounded-[20px] bg-[#121318] border transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] ${
                    renewalFilter === "expired"
                      ? "border-[#FF2E4C]/50 bg-[#201416]"
                      : "border-[#FF2E4C]/20 hover:border-[#FF2E4C]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-outfit text-[11px] font-bold text-[#FF2E4C] uppercase tracking-wider block mb-1">
                        Expired Memberships
                      </span>
                      <h3 className="font-outfit font-extrabold text-white text-2xl sm:text-3xl tracking-tight">
                        {customers.filter((c) => c.status === "Expired").length}
                      </h3>
                    </div>
                    <AlertCircle className="text-[#FF2E4C]" size={24} />
                  </div>
                  <span className="text-[11px] text-[#FF2E4C]/80 mt-2 block">
                    Pass lapsed · Renewal required
                  </span>
                </div>

                <div
                  onClick={() => setRenewalFilter("active")}
                  className={`p-5 rounded-[20px] bg-[#121318] border transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] ${
                    renewalFilter === "active"
                      ? "border-emerald-500/50 bg-[#0d1c16]"
                      : "border-emerald-500/20 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-outfit text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        Active In Good Standing
                      </span>
                      <h3 className="font-outfit font-extrabold text-white text-2xl sm:text-3xl tracking-tight">
                        {customers.filter((c) => c.status === "Active").length}
                      </h3>
                    </div>
                    <CheckCircle className="text-emerald-400" size={24} />
                  </div>
                  <span className="text-[11px] text-emerald-400/80 mt-2 block">
                    Eligible for advance extension
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121318] p-3 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setRenewalFilter("all")}
                    className={`px-3 py-1.5 rounded-xl font-outfit text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "all"
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All Members ({customers.length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("due")}
                    className={`px-3 py-1.5 rounded-xl font-outfit text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "due"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-slate-400 hover:text-amber-400"
                    }`}
                  >
                    Expiring Soon ({customers.filter((c) => c.status === "Due Soon").length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("expired")}
                    className={`px-3 py-1.5 rounded-xl font-outfit text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "expired"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "text-slate-400 hover:text-rose-400"
                    }`}
                  >
                    Expired ({customers.filter((c) => c.status === "Expired").length})
                  </button>
                  <button
                    onClick={() => setRenewalFilter("active")}
                    className={`px-3 py-1.5 rounded-xl font-outfit text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      renewalFilter === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
              <div className="rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[920px]">
                    <thead className="bg-[#14151D] text-[#8E8E98] uppercase font-outfit font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06]">
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
                    <tbody className="divide-y divide-white/[0.06] text-slate-200">
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
                                  <span className="font-outfit font-bold text-white text-xs">
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
                                <span className="font-outfit text-slate-200 font-semibold">
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
                                className="px-3.5 py-1.5 rounded-lg bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5"
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
                  <h2 className="font-outfit font-extrabold text-white tracking-tight text-xl sm:text-2xl flex items-center gap-2">
                    <span>Payment & Billing</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full font-sans">
                      GST & Settlements
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Record membership fees via UPI, Card, Cash, manage athlete transactions, and review official tax receipts.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <CreditCard size={15} /> Collect New Payment
                </button>
              </div>

              {/* Invoices List */}
              <div className="rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[920px]">
                    <thead className="bg-[#14151D] text-[#8E8E98] uppercase font-outfit font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06]">
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
                    <tbody className="divide-y divide-white/[0.06] text-slate-200">
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
                                <span className="font-outfit font-bold text-white text-xs leading-snug">
                                  {inv.customerName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {inv.customerId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-outfit text-slate-200 font-medium">
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
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownloadInvoice(inv)}
                                title="Download Official Tax Invoice (HTML/PDF)"
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm border border-white/5"
                              >
                                <Download size={13} className="text-[#FF2E4C]" /> Download
                              </button>
                              <button
                                onClick={() => {
                                  const base = inv.amount || Math.round((inv.total || 4999) / 1.18);
                                  const tax = inv.tax || ((inv.total || 4999) - base);
                                  const total = inv.total || (base + tax);
                                  setReceiptModalData({
                                    orderId: inv.id || `INV-${Math.floor(100000 + Math.random() * 900000)}`,
                                    id: inv.id || `INV-${Math.floor(100000 + Math.random() * 900000)}`,
                                    date: inv.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                                    time: "11:30 AM",
                                    customerName: inv.customerName || "Athlete Member",
                                    customerId: inv.customerId || "CUST-301",
                                    customerPhone: inv.phone || "+91 98765 43210",
                                    paymentMethod: inv.paymentMethod || "UPI / GPay",
                                    paymentStatus: "PAID & VERIFIED (GST INVOICE)",
                                    subtotal: base,
                                    tax: tax,
                                    amount: `₹${Number(total).toLocaleString("en-IN")}`,
                                    total: `₹${Number(total).toLocaleString("en-IN")}`,
                                    items: [
                                      {
                                        name: inv.plan || "PRO ATHLETE MEMBERSHIP PASS",
                                        qty: 1,
                                        price: `₹${Number(base).toLocaleString("en-IN")}`,
                                        total: `₹${Number(base).toLocaleString("en-IN")}`,
                                      },
                                      {
                                        name: "Biometric 13.56 MHz Turnstile NFC Pass",
                                        qty: 1,
                                        price: "₹0",
                                        total: "₹0",
                                      },
                                      {
                                        name: "GST Tax Invoice (18% Integrated SGST/CGST)",
                                        qty: 1,
                                        price: `₹${Number(tax).toLocaleString("en-IN")}`,
                                        total: `₹${Number(tax).toLocaleString("en-IN")}`,
                                      },
                                    ],
                                    membershipTier: inv.plan || "PRO MEMBERSHIP",
                                    turnstileStatus: "Biometric Turnstile Active",
                                    gymBranch: "Titan Pulse HQ - High Performance Arena",
                                    cashier: "Front Desk Concierge",
                                  });
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-[#14151D] border border-white/10 hover:border-[#FF2E4C] text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <FileText size={13} /> View Receipt
                              </button>
                            </div>
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
                  <h2 className="font-outfit font-extrabold text-white tracking-tight text-xl sm:text-2xl flex items-center gap-2">
                    <span>Trainer & Coach Schedule Management</span>
                    <span className="text-xs font-normal text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full font-sans">
                      Duty Command
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Live duty shifts, certified coach specializations, client rosters, and session allocations.
                  </p>
                </div>
              </div>

              {trainers.length === 0 ? (
                <div className="p-12 rounded-[20px] bg-[#121318] border border-white/[0.06] text-center space-y-3 shadow-xl">
                  <Dumbbell className="mx-auto text-slate-500" size={32} />
                  <p className="text-sm text-slate-400 font-medium">
                    No registered trainers/coaches found in database roster.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {trainers.map((t) => (
                    <div
                      key={t.id}
                      className="group p-5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF2E4C]/25 to-white/5 border border-[#FF2E4C]/40 text-[#FF2E4C] font-bold text-base flex items-center justify-center shrink-0 shadow-sm font-outfit">
                              {t.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-outfit font-extrabold text-white text-base tracking-tight truncate">
                                {t.name}
                              </h3>
                              <span className="text-[11px] font-medium text-[#FF2E4C] block truncate font-sans">
                                {t.spec}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase whitespace-nowrap shrink-0 ${
                              t.status === "Available"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                : t.status === "In Session"
                                  ? "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                                  : "bg-white/[0.04] text-slate-400 border border-white/5"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                t.status === "Available"
                                  ? "bg-emerald-400 shadow-[0_0_6px_#10B981]"
                                  : t.status === "In Session"
                                    ? "bg-amber-400"
                                    : "bg-slate-400"
                              }`}
                            />
                            {t.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-[14px] bg-[#0c0e12]/80 border border-white/[0.06] space-y-2 text-xs text-slate-400 font-sans shadow-inner">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-400 font-medium">Assigned Shift:</span>{" "}
                            <strong className="text-slate-200 font-semibold font-mono text-xs">
                              {t.shift}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-400 font-medium">Training Arena:</span>{" "}
                            <strong className="text-slate-200 truncate max-w-[170px] text-xs font-medium">
                              {t.room || "Main Strength Arena"}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-400 font-medium">Active Athletes:</span>{" "}
                            <strong className="text-emerald-400 font-bold font-mono text-xs">
                              {t.clientsToday ?? 0} {(t.clientsToday === 1) ? 'Athlete' : 'Athletes'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-400 font-medium">Coach Rating:</span>{" "}
                            <strong className="text-amber-400 font-bold font-mono text-xs">
                              {t.rating || "5.0 ★"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleOpenCoachSchedule(t)}
                          className="w-full py-2.5 rounded-xl bg-[#14151D] hover:bg-[#FF2E4C] border border-white/[0.08] hover:border-[#FF2E4C] text-slate-200 hover:text-white text-xs font-outfit font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
              <div className="p-6 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("trainers")}
                      className="p-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-outfit font-semibold"
                    >
                      <ArrowRight className="rotate-180" size={15} /> Back to Trainers
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-white tracking-tight">
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
                      className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <UserPlus size={15} /> Assign New Athlete
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="font-outfit text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block">
                      ASSIGNED SHIFT
                    </span>
                    <h4 className="font-outfit text-base sm:text-lg font-bold text-white">
                      {coachShiftForm.shift}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="font-outfit text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block">
                      ACTIVE ATHLETES
                    </span>
                    <h4 className="font-outfit text-base sm:text-lg font-bold text-emerald-400">
                      {coachClients.active.length} Athletes
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="font-outfit text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block">
                      GRADUATED / PAST
                    </span>
                    <h4 className="font-outfit text-base sm:text-lg font-bold text-slate-300">
                      {coachClients.past.length} Completed
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0D] border border-white/5 space-y-1">
                    <span className="font-outfit text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block">
                      COACH RATING
                    </span>
                    <h4 className="font-outfit text-base sm:text-lg font-bold text-amber-400">
                      {selectedCoach?.rating || "4.9 ★"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* 1. SHIFT & TIMINGS SCHEDULER CONFIGURATION */}
              <div className="p-6 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#201416] border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-outfit font-extrabold text-white text-base tracking-tight">
                        Shift Timings & Working Hours Setup
                      </h3>
                      <p className="text-xs text-slate-400 font-normal">
                        Configure weekly availability, designated training room, and duty shift hours.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveCoachShift}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-outfit font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Check size={14} /> Save Timings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Shift Selector */}
                  <div className="space-y-2">
                    <label className="font-outfit text-xs font-semibold text-slate-300 block">
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
                    <label className="font-outfit text-xs font-semibold text-slate-300 block">
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
                    <label className="font-outfit text-xs font-semibold text-slate-300 block">
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
                  <label className="font-outfit text-xs font-semibold text-slate-300 block">
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
                            className={`px-4 py-2 rounded-xl font-outfit text-xs font-bold transition-all cursor-pointer ${
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
                      className={`px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === "active"
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-[#121318] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <UserCheck size={15} /> Active Clients (
                      {coachClients.active.length})
                    </button>
                    <button
                      onClick={() => setCoachClientTab("past")}
                      className={`px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === "past"
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-[#121318] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <History size={15} /> Past Clients (
                      {coachClients.past.length})
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: ACTIVE CLIENTS */}
                {coachClientTab === "active" && (
                  <div className="rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#14151D] text-[#8E8E98] uppercase font-outfit font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06]">
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
                        <tbody className="divide-y divide-white/[0.06] text-slate-200">
                          {coachClients.active.length === 0 ? (
                            <tr>
                              <td
                                colSpan="7"
                                className="p-8 text-center text-slate-400 font-medium"
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
                                  <span className="font-outfit font-bold text-white block text-xs">
                                    {client.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    {client.email}
                                  </span>
                                </td>
                                <td className="p-4 font-outfit font-semibold text-slate-200">
                                  {client.program}
                                </td>
                                <td className="p-4 text-slate-300">
                                  {client.goal}
                                </td>
                                <td className="p-4 text-slate-300 font-mono">
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
                  <div className="rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#14151D] text-[#8E8E98] uppercase font-outfit font-bold text-[10px] sm:text-[11px] tracking-wider border-b border-white/[0.06]">
                          <tr>
                            <th className="p-4">Record ID</th>
                            <th className="p-4">Athlete Name</th>
                            <th className="p-4">Completed Program</th>
                            <th className="p-4">Outcome & Transformation</th>
                            <th className="p-4">Completion Date</th>
                            <th className="p-4">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06] text-slate-200">
                          {coachClients.past.length === 0 ? (
                            <tr>
                              <td
                                colSpan="6"
                                className="p-8 text-center text-slate-400 font-medium"
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
                                <td className="p-4 font-outfit font-bold text-white text-xs">
                                  {client.name}
                                  <span className="text-[11px] text-slate-400 font-mono block font-normal">
                                    {client.email}
                                  </span>
                                </td>
                                <td className="p-4 font-outfit font-semibold text-slate-300">
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
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: SETTINGS (PROFILE, CHANGE PASSWORD, GENERAL SETTINGS) */}
          {/* ============================================================ */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-outfit font-extrabold text-white tracking-tight text-xl sm:text-2xl flex items-center gap-2.5">
                    <Settings className="text-[#FF2E4C]" size={24} />
                    Account & Station Settings
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Manage your receptionist profile, update login credentials, and configure front desk station preferences.
                  </p>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0D] border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSettingsActiveTab("profile")}
                    className={`px-3.5 py-2 rounded-lg font-outfit text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      settingsActiveTab === "profile"
                        ? "bg-[#FF2E4C] text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsActiveTab("password")}
                    className={`px-3.5 py-2 rounded-lg font-outfit text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      settingsActiveTab === "password"
                        ? "bg-[#FF2E4C] text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Key size={14} /> Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsActiveTab("general")}
                    className={`px-3.5 py-2 rounded-lg font-outfit text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      settingsActiveTab === "general"
                        ? "bg-[#FF2E4C] text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sliders size={14} /> General Settings
                  </button>
                </div>
              </div>

              {/* 1. PROFILE SETTINGS */}
              {settingsActiveTab === "profile" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Profile Summary Card with Avatar */}
                  <div className="p-6 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      {profileForm.avatar ? (
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FF2E4C] shadow-[0_0_15px_rgba(255,46,76,0.3)] shrink-0">
                          <img
                            src={profileForm.avatar}
                            alt={profileForm.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF2E4C] to-[#800F2F] border border-[#FF2E4C]/40 flex items-center justify-center font-outfit font-extrabold text-2xl text-white shadow-lg shrink-0">
                          {profileForm.name.charAt(0) || "R"}
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-outfit font-extrabold text-white text-lg sm:text-xl tracking-tight">
                            {profileForm.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                            ON DUTY
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          Badge: {profileForm.badgeId} • Front Desk Receptionist
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-[#0A0A0D] border border-white/5 text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-outfit block">
                        ASSIGNED SHIFT (ADMIN ONLY)
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 font-outfit">
                        {profileForm.shift || "Morning Shift (06:00 AM - 02:00 PM)"}
                      </span>
                    </div>
                  </div>

                  {/* Profile Photo Uploader Card (Cloudinary CDN) */}
                  <div className="p-6 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <div className="flex items-center gap-2.5">
                        <Camera className="text-[#FF2E4C]" size={18} />
                        <h4 className="font-outfit font-bold text-white text-sm">
                          Receptionist Profile Picture
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
                        ☁️ Cloudinary CDN Synced
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={avatarFileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
                      {/* Avatar Preview */}
                      <div className="relative group shrink-0">
                        {profileForm.avatar ? (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#FF2E4C] shadow-lg">
                            <img
                              src={profileForm.avatar}
                              alt="Receptionist Profile"
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1E202B] to-[#121318] border border-white/10 flex flex-col items-center justify-center text-slate-400 group-hover:border-[#FF2E4C]/50 transition-all">
                            <User size={32} className="text-slate-500 mb-1" />
                            <span className="text-[10px] font-semibold text-slate-500">No Photo</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                          className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#FF2E4C] text-white hover:brightness-110 shadow-lg cursor-pointer transition-all disabled:opacity-50"
                          title="Change Profile Photo"
                        >
                          <Camera size={14} />
                        </button>
                      </div>

                      {/* Instructions & Actions */}
                      <div className="space-y-3 flex-1 text-center sm:text-left">
                        <div>
                          <h5 className="font-outfit font-bold text-white text-xs sm:text-sm">
                            Upload your official concierge headshot
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Upload a clear, professional photo. Your photo is automatically optimized, compressed, and stored securely in Cloudinary CDN storage.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 disabled:opacity-50 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                          >
                            {isUploadingAvatar ? (
                              <>
                                <RotateCw className="animate-spin" size={13} />
                                Uploading to Cloudinary...
                              </>
                            ) : (
                              <>
                                <Upload size={13} />
                                Upload New Photo
                              </>
                            )}
                          </button>

                          {profileForm.avatar && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              disabled={isUploadingAvatar}
                              className="px-3.5 py-2 rounded-xl bg-[#0A0A0D] border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 font-outfit font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Edit Form */}
                  <form
                    onSubmit={handleSaveProfile}
                    className="p-6 sm:p-8 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6"
                  >
                    <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
                      <User className="text-[#FF2E4C]" size={18} />
                      <h4 className="font-outfit font-bold text-white text-sm">
                        Personal & Professional Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C] font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-outfit text-xs font-semibold text-slate-300">
                            Staff Badge ID
                          </label>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Lock size={10} className="text-[#FF2E4C]" /> Fixed (Admin Only)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={profileForm.badgeId}
                          readOnly
                          disabled
                          className="w-full bg-[#0A0A0D]/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono cursor-not-allowed select-none opacity-80"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-outfit text-xs font-semibold text-slate-300">
                            Assigned Duty Shift Timings
                          </label>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Lock size={10} className="text-[#FF2E4C]" /> Fixed (Admin Only)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={profileForm.shift || "Morning Shift (06:00 AM - 02:00 PM)"}
                          readOnly
                          disabled
                          className="w-full bg-[#0A0A0D]/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono cursor-not-allowed select-none opacity-80"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Save size={14} /> Save Profile Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. CHANGE PASSWORD */}
              {settingsActiveTab === "password" && (
                <div className="space-y-6 animate-fadeIn max-w-2xl">
                  <form
                    onSubmit={handleChangePassword}
                    className="p-6 sm:p-8 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6"
                  >
                    <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
                      <Lock className="text-[#FF2E4C]" size={18} />
                      <div>
                        <h4 className="font-outfit font-bold text-white text-sm">
                          Update Account Password
                        </h4>
                        <p className="text-[11px] text-slate-400 font-normal">
                          Ensure your front desk access remains secure by using a strong password.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="At least 6 characters"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0A0A0D] border border-white/5 space-y-1.5 text-xs text-slate-400">
                      <p className="font-outfit font-semibold text-slate-300 text-[11px]">
                        Password Requirements:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        <li>Minimum 6 characters in length</li>
                        <li>Include numbers or special characters for enhanced security</li>
                      </ul>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={passLoading}
                        className="px-6 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 disabled:opacity-50 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {passLoading ? (
                          <>
                            <RotateCw className="animate-spin" size={14} /> Updating...
                          </>
                        ) : (
                          <>
                            <Key size={14} /> Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 3. GENERAL SETTINGS */}
              {settingsActiveTab === "general" && (
                <div className="space-y-6 animate-fadeIn">
                  <form
                    onSubmit={handleSaveGeneralSettings}
                    className="p-6 sm:p-8 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6"
                  >
                    <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
                      <Sliders className="text-[#FF2E4C]" size={18} />
                      <h4 className="font-outfit font-bold text-white text-sm">
                        Station Terminal & Display Preferences
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Reception Desk Terminal Name
                        </label>
                        <input
                          type="text"
                          value={generalSettings.terminalName}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              terminalName: e.target.value,
                            })
                          }
                          required
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div>
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Clock / Time Format
                        </label>
                        <select
                          value={generalSettings.timeFormat}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              timeFormat: e.target.value,
                            })
                          }
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="12-Hour (AM/PM)">12-Hour Format (AM / PM)</option>
                          <option value="24-Hour (Military)">24-Hour Military Format</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-outfit text-xs font-semibold text-slate-300 mb-1.5 block">
                          Turnstile Live Stream Auto-Sync Rate
                        </label>
                        <select
                          value={generalSettings.streamRefreshRate}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              streamRefreshRate: e.target.value,
                            })
                          }
                          className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="3s">Every 3 Seconds (Ultra-Fast)</option>
                          <option value="5s">Every 5 Seconds (Standard)</option>
                          <option value="10s">Every 10 Seconds</option>
                        </select>
                      </div>
                    </div>

                    {/* Audio Check-in Chime Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0D] border border-white/5">
                      <div>
                        <h5 className="font-outfit font-bold text-white text-xs flex items-center gap-2">
                          <Volume2 size={15} className="text-[#FF2E4C]" />
                          Check-in Audio Chime & Verification Beep
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Play clear verification acoustic tone on successful member check-in passage.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setGeneralSettings({
                            ...generalSettings,
                            audioChime: !generalSettings.audioChime,
                          })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          generalSettings.audioChime
                            ? "bg-[#FF2E4C]"
                            : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            generalSettings.audioChime
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Save size={14} /> Save General Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: SUPPORT & HELPDESK TICKETS DISPATCH                   */}
          {/* ============================================================ */}
          {activeTab === "tickets" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E4C] animate-pulse shadow-[0_0_8px_#FF2E4C]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
                      Customer Support & Service Tickets
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30 font-mono">
                      FRONT DESK DISPATCH
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time inbound customer issue tickets, turnstile access alerts, and service requests.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      fetchData();
                      showToast("✓ Inbound tickets synced with server!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#14151D] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className="text-[#FF2E4C]" /> Refresh Feed
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Open & Pending
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF2E4C] tracking-tight font-outfit">
                      {tickets.filter((t) => (t.status || "Open") === "Open").length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
                    <AlertCircle size={20} className="animate-pulse" />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      In Progress
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-outfit">
                      {tickets.filter((t) => t.status === "In Progress").length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Resolved
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-outfit">
                      {tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="group p-4.5 rounded-[20px] bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E98] uppercase tracking-wider block mb-1 font-outfit">
                      Total Inbound
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight font-outfit">
                      {tickets.length}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <LifeBuoy size={20} />
                  </div>
                </div>
              </div>

              {/* Search & Filtering Bar */}
              <div className="p-4 rounded-[20px] bg-[#121318] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-3">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search tickets by ID, Member Name, Phone, Email, Subject, or Issue..."
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                      className="w-full bg-[#0c0e12] border border-white/[0.08] focus:border-[#FF2E4C]/60 rounded-xl px-4 py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner font-sans"
                    />
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={15}
                    />
                    {ticketSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTicketSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category Filter */}
                    <select
                      value={ticketFilterCategory}
                      onChange={(e) => setTicketFilterCategory(e.target.value)}
                      className="bg-[#0c0e12] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="all">All Categories</option>
                      <option value="Biometric Speed Gate">Biometric Speed Gate</option>
                      <option value="Facility & Equipment">Facility & Equipment</option>
                      <option value="Billing & Membership">Billing & Membership</option>
                      <option value="Locker & Amenities">Locker & Amenities</option>
                      <option value="Personal Training">Personal Training</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                      value={ticketFilterPriority}
                      onChange={(e) => setTicketFilterPriority(e.target.value)}
                      className="bg-[#0c0e12] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="all">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="High (Urgent)">High (Urgent)</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Status Filter Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.04]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Status:
                  </span>
                  {[
                    { id: "all", label: "All Tickets", count: tickets.length },
                    {
                      id: "Open",
                      label: "Open / Pending",
                      count: tickets.filter((t) => (t.status || "Open") === "Open").length,
                    },
                    {
                      id: "In Progress",
                      label: "In Progress",
                      count: tickets.filter((t) => t.status === "In Progress").length,
                    },
                    {
                      id: "Resolved",
                      label: "Resolved",
                      count: tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTicketFilterStatus(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        ticketFilterStatus === tab.id
                          ? "bg-[#FF2E4C] text-white shadow-md shadow-[#FF2E4C]/20"
                          : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          ticketFilterStatus === tab.id
                            ? "bg-black/30 text-white"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Tickets Main Table / Card List */}
              <div className="rounded-[20px] bg-[#121318] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#14151d]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/20 flex items-center justify-center">
                      <LifeBuoy size={17} />
                    </div>
                    <div>
                      <h3 className="font-outfit font-extrabold text-white text-sm">
                        Inbound Support Queue ({tickets.filter((t) => {
                          if (ticketFilterStatus !== "all" && (t.status || "Open") !== ticketFilterStatus) return false;
                          if (ticketFilterPriority !== "all" && (t.priority || "Medium") !== ticketFilterPriority) return false;
                          if (ticketFilterCategory !== "all" && (t.category || "") !== ticketFilterCategory) return false;
                          if (ticketSearchQuery.trim()) {
                            const q = ticketSearchQuery.toLowerCase();
                            return (
                              (t.ticketId || t.id || "").toLowerCase().includes(q) ||
                              (t.customerName || "").toLowerCase().includes(q) ||
                              (t.customerEmail || "").toLowerCase().includes(q) ||
                              (t.customerPhone || "").toLowerCase().includes(q) ||
                              (t.subject || "").toLowerCase().includes(q) ||
                              (t.category || "").toLowerCase().includes(q) ||
                              (t.description || "").toLowerCase().includes(q)
                            );
                          }
                          return true;
                        }).length})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Select any ticket to review description, verify biometric status, and dispatch official resolution.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ticket Items Container */}
                <div className="divide-y divide-white/[0.04]">
                  {(() => {
                    const filtered = tickets.filter((t) => {
                      if (ticketFilterStatus !== "all" && (t.status || "Open") !== ticketFilterStatus) return false;
                      if (ticketFilterPriority !== "all" && (t.priority || "Medium") !== ticketFilterPriority) return false;
                      if (ticketFilterCategory !== "all" && (t.category || "") !== ticketFilterCategory) return false;
                      if (ticketSearchQuery.trim()) {
                        const q = ticketSearchQuery.toLowerCase();
                        return (
                          (t.ticketId || t.id || "").toLowerCase().includes(q) ||
                          (t.customerName || "").toLowerCase().includes(q) ||
                          (t.customerEmail || "").toLowerCase().includes(q) ||
                          (t.customerPhone || "").toLowerCase().includes(q) ||
                          (t.subject || "").toLowerCase().includes(q) ||
                          (t.category || "").toLowerCase().includes(q) ||
                          (t.description || "").toLowerCase().includes(q)
                        );
                      }
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                            <Inbox size={26} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-outfit">
                            No Support Tickets Found
                          </h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            There are currently no customer support or maintenance tickets matching your active filter criteria.
                          </p>
                          {(ticketSearchQuery || ticketFilterStatus !== "all" || ticketFilterCategory !== "all" || ticketFilterPriority !== "all") && (
                            <button
                              onClick={() => {
                                setTicketSearchQuery("");
                                setTicketFilterStatus("all");
                                setTicketFilterCategory("all");
                                setTicketFilterPriority("all");
                              }}
                              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all cursor-pointer"
                            >
                              Reset All Filters
                            </button>
                          )}
                        </div>
                      );
                    }

                    return filtered.map((tck) => {
                      const tckId = tck.ticketId || tck.id;
                      const isResolved = tck.status === "Resolved" || tck.status === "Closed";
                      const isInProgress = tck.status === "In Progress";
                      const isOpen = !isResolved && !isInProgress;

                      const isUrgent =
                        (tck.priority || "").toLowerCase().includes("urgent") ||
                        (tck.priority || "").toLowerCase().includes("critical") ||
                        (tck.priority || "").toLowerCase().includes("high");

                      return (
                        <div
                          key={tckId}
                          className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          {/* Left: Ticket Header, Priority, Athlete, Subject */}
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Ticket ID */}
                              <span className="font-mono text-xs font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/25 px-2.5 py-0.5 rounded-lg">
                                {tckId}
                              </span>

                              {/* Priority Pill */}
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                  isUrgent
                                    ? "bg-[#FF2E4C]/15 text-[#FF2E4C] border-[#FF2E4C]/30 shadow-[0_0_8px_rgba(255,46,76,0.3)]"
                                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                }`}
                              >
                                {tck.priority || "Medium"}
                              </span>

                              {/* Category Badge */}
                              <span className="text-[11px] font-medium text-slate-300 bg-white/[0.06] px-2.5 py-0.5 rounded-lg border border-white/5">
                                {tck.category || "General"}
                              </span>

                              {/* Timestamp */}
                              <span className="text-[11px] text-slate-500 font-mono">
                                • {tck.date || "Today"} {tck.time ? `(${tck.time})` : ""}
                              </span>
                            </div>

                            {/* Customer Profile Row */}
                            <div className="flex items-center gap-2.5 pt-0.5">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF2E4C]/20 to-white/5 border border-white/10 text-white font-outfit font-bold text-xs flex items-center justify-center shrink-0">
                                {tck.customerName?.charAt(0) || "A"}
                              </div>
                              <span className="text-xs font-bold text-white font-outfit">
                                {tck.customerName || "Athlete Member"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {tck.customerDisplayId ? `[${tck.customerDisplayId}]` : ""}
                              </span>
                              {tck.customerPhone && tck.customerPhone !== "N/A" && (
                                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                  <Phone size={10} className="text-slate-500" /> {tck.customerPhone}
                                </span>
                              )}
                              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                {tck.customerPlan || "Elite All-Access"}
                              </span>
                            </div>

                            {/* Ticket Subject */}
                            <h4 className="text-sm font-bold text-white font-outfit tracking-normal">
                              {tck.subject}
                            </h4>

                            {/* Customer Description */}
                            {tck.description && (
                              <p className="text-xs text-slate-300/90 leading-relaxed bg-[#0c0e12] p-3 rounded-xl border border-white/[0.04] max-w-3xl">
                                "{tck.description}"
                              </p>
                            )}

                            {/* Current Front Desk Resolution if exists */}
                            {tck.reply && !tck.reply.includes("Ticket logged with Front Desk") && (
                              <div className="p-3 rounded-xl bg-[#15161D] border border-white/[0.08] text-xs text-slate-300 space-y-1 max-w-3xl">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                    <CheckCheck size={12} /> Front Desk Resolution Note:
                                  </span>
                                  {tck.replyAt && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {tck.replyAt}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-200 text-xs font-sans">{tck.reply}</p>
                              </div>
                            )}
                          </div>

                          {/* Right: Status & Action Buttons */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 self-stretch lg:self-center">
                            {/* Status Indicator Pill */}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                isResolved
                                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                  : isInProgress
                                  ? "bg-amber-950/70 text-amber-300 border-amber-700/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                                  : "bg-[#FF2E4C]/15 text-[#FF2E4C] border-[#FF2E4C]/40 shadow-[0_0_10px_rgba(255,46,76,0.3)]"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isResolved
                                    ? "bg-emerald-400"
                                    : isInProgress
                                    ? "bg-amber-400"
                                    : "bg-[#FF2E4C] animate-pulse"
                                }`}
                              />
                              {tck.status || "Open"}
                            </span>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {!isResolved && (
                                <>
                                  {!isInProgress && (
                                    <button
                                      onClick={() => handleQuickInProgressTicket(tck)}
                                      className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                      title="Mark In Progress"
                                    >
                                      <Clock size={13} />
                                      <span className="hidden sm:inline">In Progress</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleQuickResolveTicket(tck)}
                                    className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                    title="Quick Resolve Ticket"
                                  >
                                    <Check size={14} />
                                    <span>Resolve</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => handleOpenTicketModal(tck)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#E50914] text-white text-xs font-bold hover:brightness-110 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <MessageSquare size={13} />
                                <span>{isResolved ? "View Details" : "Respond / Manage"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
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
          <div className="relative w-full max-w-lg bg-[#121318] border border-white/[0.06] rounded-[20px] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="text-[#FF2E4C]" size={20} />
                <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                  Register New Athlete
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Onboard a member, assign membership pass, and record initial payment.
              </p>
            </div>

            <form onSubmit={handleRegisterCustomer} className="space-y-4">
              <div>
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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

              {/* Password Setting Section (Auto-dispatched to Athlete via SMTP) */}
              <div className="bg-[#15161D] border border-white/[0.08] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-outfit text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <Key size={13} className="text-[#FF2E4C]" />
                    <span>Set Login Password</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono flex items-center gap-1">
                      <Mail size={10} />
                      SMTP Auto-Sent
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={generateNewPassword}
                    className="text-[11px] font-semibold text-[#FF2E4C] hover:text-[#ff526d] flex items-center gap-1 cursor-pointer transition-colors bg-[#FF2E4C]/10 px-2 py-0.5 rounded-lg border border-[#FF2E4C]/20"
                  >
                    <Sparkles size={11} />
                    Auto-Generate
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Enter or generate customer temporary password..."
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm({ ...regForm, password: e.target.value })
                    }
                    required
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white font-mono tracking-wider outline-none focus:border-[#FF2E4C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail size={11} className="text-[#FF2E4C] shrink-0" />
                  <span>This password will be dispatched to the customer's email via SMTP upon registration.</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                className="w-full py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs transition-all cursor-pointer mt-2 shadow-md"
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
          <div className="relative w-full max-w-lg bg-[#121318] border border-white/[0.06] rounded-[20px] p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-5">
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
                  <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                    Renew Client Membership
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Extend passes for existing athletes & record subscription settlements.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              {/* Select Existing Client */}
              <div>
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF2E4C]/20 to-[#FF2E4C]/5 border border-[#FF2E4C]/30 flex items-center justify-center font-outfit font-bold text-xs text-[#FF2E4C] uppercase shrink-0">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-outfit font-bold text-white text-xs">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-outfit font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
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
          <div className="relative w-full max-w-xl bg-[#121318] border border-white/[0.06] rounded-[20px] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Printable Invoice Header */}
            <div className="flex justify-between items-start border-b border-white/[0.06] pb-6">
              <div>
                <span className="font-outfit font-extrabold text-2xl text-white tracking-wider">
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
              <h4 className="font-outfit font-bold text-white text-base">
                {selectedInvoice.customerName}
              </h4>
              <p className="text-slate-400 font-mono">
                Member ID: {selectedInvoice.customerId}
              </p>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.06] text-[#8E8E98] uppercase text-[10px] font-bold tracking-wider font-outfit">
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
              <div className="flex justify-between py-3 border-t border-white/[0.06] text-base font-bold text-emerald-400 font-mono">
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
                className="flex-1 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Printer size={15} /> Print Official Receipt
              </button>
              <button
                onClick={() => {
                  showToast("✓ Invoice receipt downloaded!");
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#14151D] border border-white/10 hover:border-white/20 text-white font-outfit font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
          <div className="relative w-full max-w-md bg-[#121318] border border-white/[0.06] rounded-[20px] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] space-y-6">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="text-[#FF2E4C]" size={20} />
                <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                  Capture Prospect Lead
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Record visitor details and fitness goals for front desk follow-up.
              </p>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                <label className="font-outfit text-xs text-slate-300 font-semibold mb-1.5 block">
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
                className="w-full py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs shadow-md transition-all cursor-pointer"
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
          <div className="w-full max-w-lg rounded-[20px] bg-[#121318] border border-white/[0.06] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)] animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                  Assign Athlete to Coach
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
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
                <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
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
                  <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
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
                  <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
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
                <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
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
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-outfit font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-outfit font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} /> Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: MANUAL CHECK-IN HYPER PROCESS ORBIT VERIFICATION   */}
      {/* ============================================================ */}
      {showOtpModal && selectedOtpCustomer && (
        <VerifyNumberModal
          customer={selectedOtpCustomer}
          onClose={() => {
            setShowOtpModal(false);
            setOtpInput("");
            setOtpError("");
          }}
          onVerifiedSuccess={(newRecord) => {
            setAttendanceLogs((prev) => [
              newRecord,
              ...prev.filter((l) => l.id !== newRecord.id),
            ]);
            showToast(
              `✓ Access Granted: ${newRecord.name} checked in at ${newRecord.timeIn}!`
            );

            setReceptionistNotifications((prev) => [
              {
                id: `NTF-REC-${Date.now().toString().slice(-4)}`,
                title: `Manual OTP Check-In Verified`,
                desc: `${newRecord.name} (${newRecord.customerId}) authenticated and clocked in at Turnstile Gate Alpha-1.`,
                category: "checkin",
                source: "Front Desk Concierge",
                time: "Just now",
                meta: newRecord.timeIn,
                unread: true,
                actionTab: "manual-login",
                actionLabel: "View Log",
              },
              ...prev,
            ]);

            // Real-time multi-dashboard broadcast
            const syncPayload = {
              ...newRecord,
              syncTimestamp: Date.now(),
            };
            localStorage.setItem(
              "titan_attendance_updated",
              JSON.stringify(syncPayload)
            );
            window.dispatchEvent(
              new CustomEvent("titan_attendance_sync", { detail: syncPayload })
            );

            fetchData();
          }}
          onResendOtp={() => handleRequestManualLogin(selectedOtpCustomer)}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 7: 6-HOUR COOLDOWN ALREADY CHECKED IN WARNING MODAL    */}
      {/* ============================================================ */}
      {alreadyCheckedInModalData && (
        <div className="fixed inset-0 z-[220] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-[20px] bg-[#121318] border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] text-center space-y-5 animate-fadeIn">
            <button
              type="button"
              onClick={() => setAlreadyCheckedInModalData(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
              <Clock size={28} className="animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                ● 6-HOUR COOLDOWN ACTIVE
              </span>
              <h3 className="font-outfit font-extrabold text-white tracking-tight text-xl">
                Athlete Already Checked In
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto font-normal">
                Gym attendance security policy requires a minimum 6-hour interval between access admissions.
              </p>
            </div>

            {/* Previous Check-In Timing & Cooldown Details Card */}
            <div className="p-4 rounded-xl bg-[#090C0E] border border-white/10 text-left space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-white/5 border border-amber-500/40 text-amber-300 font-outfit font-bold text-sm flex items-center justify-center shrink-0">
                  {alreadyCheckedInModalData.previousCheckIn?.name?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <h4 className="font-outfit font-bold text-white text-sm truncate">
                    {alreadyCheckedInModalData.previousCheckIn?.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: #{alreadyCheckedInModalData.previousCheckIn?.customerId || "CUST-001"} • {alreadyCheckedInModalData.previousCheckIn?.plan || "PRO PASS"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                    Previous Check-In
                  </span>
                  <strong className="text-amber-300 font-mono text-xs block">
                    {alreadyCheckedInModalData.previousCheckIn?.timeIn} ({alreadyCheckedInModalData.timeElapsedStr})
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                    Terminal Gate
                  </span>
                  <strong className="text-white font-mono text-xs block truncate">
                    {alreadyCheckedInModalData.previousCheckIn?.terminal || "Gate Alpha-1"}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-300 block">
                        Next Eligible Entry
                      </span>
                      <strong className="text-white font-mono text-xs">
                        {alreadyCheckedInModalData.nextEligibleTime}
                      </strong>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {alreadyCheckedInModalData.timeRemainingStr} remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAlreadyCheckedInModalData(null)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-outfit font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 8: MANAGE & RESOLVE SUPPORT TICKET                     */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* MODAL 8: MANAGE & RESOLVE SUPPORT TICKET                     */}
      {/* ============================================================ */}
      {selectedTicketModal && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTicketModal(null);
          }}
        >
          <div
            data-lenis-prevent="true"
            className="relative w-full max-w-2xl bg-[#121318] border border-white/[0.08] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed Top */}
            <div className="p-5 sm:px-7 sm:py-5 border-b border-white/[0.06] flex items-start justify-between bg-[#15161D] shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-lg">
                    {selectedTicketModal.ticketId || selectedTicketModal.id}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30">
                    {selectedTicketModal.priority || "Medium"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedTicketModal.date} {selectedTicketModal.time ? `(${selectedTicketModal.time})` : ""}
                  </span>
                </div>
                <h3 className="font-outfit font-extrabold text-white text-lg sm:text-xl tracking-tight mt-1 truncate">
                  {selectedTicketModal.subject}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTicketModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 ml-4"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div
              data-lenis-prevent="true"
              className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 overscroll-contain"
            >
              {/* Athlete Profile Information Card */}
              <div className="p-4 rounded-2xl bg-[#0c0e12] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF2E4C] to-[#E50914] text-white font-outfit font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
                    {selectedTicketModal.customerName?.charAt(0) || "A"}
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-white text-sm">
                      {selectedTicketModal.customerName || "Athlete Member"}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ID: #{selectedTicketModal.customerDisplayId || selectedTicketModal.customerId || "CUST-301"} • {selectedTicketModal.customerPlan || "Titan Obsidian Access"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {selectedTicketModal.customerPhone && selectedTicketModal.customerPhone !== "N/A" && (
                    <a
                      href={`tel:${selectedTicketModal.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all border border-white/5"
                    >
                      <Phone size={12} className="text-emerald-400" />
                      <span>{selectedTicketModal.customerPhone}</span>
                    </a>
                  )}
                  {selectedTicketModal.customerEmail && (
                    <a
                      href={`mailto:${selectedTicketModal.customerEmail}`}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all border border-white/5"
                    >
                      <Mail size={12} className="text-cyan-400" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Inbound Customer Issue Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-[#FF2E4C]" />
                  Customer Problem Statement / Issue Description:
                </label>
                <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/[0.08] text-slate-200 text-xs sm:text-sm leading-relaxed font-sans shadow-inner">
                  {selectedTicketModal.description || "No additional description provided by customer."}
                </div>
              </div>

              {/* Front Desk Response Form */}
              <form onSubmit={handleUpdateTicket} className="space-y-4 pt-2 border-t border-white/[0.06]">
                {/* Quick Preset Replies */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#FF2E4C]" />
                    Quick Action Resolution Templates:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "⚡ Turnstile gate biometric pass recalibrated. Please scan again at Gate Alpha-1.",
                      "🔒 Smart RFID locker credentials reprogrammed and assigned.",
                      "🛠️ Facility maintenance team notified; technician dispatched to equipment.",
                      "💳 Subscription & payment verified; membership status renewed.",
                      "🏋️ 1-on-1 coaching session updated on your training calendar.",
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTicketReplyText(preset)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-slate-300 border border-white/5 hover:border-white/20 transition-all text-left cursor-pointer"
                      >
                        {preset.slice(0, 48)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Selector & Resolution Reply */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
                      Update Ticket Status
                    </label>
                    <select
                      value={ticketStatusInput}
                      onChange={(e) => setTicketStatusInput(e.target.value)}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="Open">● Open / Pending</option>
                      <option value="In Progress">● In Progress</option>
                      <option value="Resolved">● Resolved (Complete)</option>
                      <option value="Closed">● Closed / Archived</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-outfit text-xs font-semibold text-slate-300 block mb-1.5">
                      Front Desk Note / Member Response
                    </label>
                    <textarea
                      rows={3}
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      placeholder="Type official response or resolution notes to show in the athlete's customer portal..."
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF2E4C] transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicketModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-outfit font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingTicket}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#E50914] hover:brightness-110 text-white font-outfit font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Check size={15} />
                    <span>{isUpdatingTicket ? "Saving..." : "Save & Dispatch to Member Portal"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3D THERMAL RECEIPT & TAX INVOICE PRINTER MODAL */}
      {receiptModalData && (
        <ThermalReceiptPrinter
          orderDetails={receiptModalData}
          onClose={() => setReceiptModalData(null)}
          onViewOrders={() => setActiveTab("billing")}
        />
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
