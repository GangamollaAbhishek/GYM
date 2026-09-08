import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
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
  Shield,
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
  RefreshCw,
  Globe,
  Save,
  RotateCcw,
  Eye,
  Layers,
  Sliders,
  Image,
  Type,
  UploadCloud,
  Camera,
  CheckCircle2,
  Heart,
  Flame,
  MoreVertical,
  MoreHorizontal,
  Droplets,
  ArrowLeft,
  Calendar,
  History,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Printer,
  Zap,
  CheckCheck,
  ExternalLink,
  ArrowUpRight,
  Pin,
  Star,
} from "lucide-react";
import { cn } from "../lib/utils";
import GooeySearch from "./GooeySearch";
import AddUserModal from "./AddUserModal";
import ThermalReceiptPrinter from "./ThermalReceiptPrinter";
import Interactive3DAnalytics from "./Interactive3DAnalytics";
import AdminNotificationsHub from "./AdminNotificationsHub";
import AgentBentoGrid from "./AgentBentoGrid";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import api from "../lib/api";

// Motion Spring Variants for Notifications
const itemVariants = {
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

const headingVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" } },
};

function NotificationHeaderCard({ item, pinned, onTogglePin, onSelect }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "checkin": return CalendarCheck;
      case "onboarding": return UserPlus;
      case "payment": return CreditCard;
      case "trainer": return Dumbbell;
      case "review": return Star;
      case "enquiry": return HelpCircle;
      default: return Bell;
    }
  };
  const Icon = getCategoryIcon(item.category);

  return (
    <motion.div
      layoutId={`header-notif-${item.id}`}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-xl p-3 transition-all cursor-pointer group relative border",
        "bg-[#13141a] hover:bg-[#171822] border-white/[0.06] hover:border-white/[0.12]",
        item.unread && "border-l-2 border-l-[#FF2E4C] bg-[#151620]",
        pinned && "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.08)]"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border",
          item.category === "checkin" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          item.category === "onboarding" && "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          item.category === "payment" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
          item.category === "trainer" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
          item.category === "review" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
          item.category === "enquiry" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
          (!item.category || item.category === "broadcast") && "bg-[#FF2E4C]/10 text-[#FF2E4C] border-[#FF2E4C]/20"
        )}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs font-semibold text-white group-hover:text-red-400 transition-colors">
            {item.title}
          </p>
          <span className="text-[10px] text-slate-400 font-normal shrink-0">
            {item.time}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-normal leading-relaxed line-clamp-2">
          {item.desc}
        </p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06] truncate max-w-[130px]">
            {item.source}
          </span>
          {item.unread && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C]" />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(item.id);
        }}
        aria-label={pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
        className={cn(
          "w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer border",
          pinned
            ? "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30"
            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
        )}
        title={pinned ? "Unpin alert" : "Pin to top"}
      >
        <Pin
          size={12}
          className={cn(
            "transition-transform duration-200",
            pinned && "-rotate-45 text-blue-400"
          )}
        />
      </button>
    </motion.div>
  );
}

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'user' | 'customer' | 'trainer' | 'plan' | 'enquiry'

  // Dynamic Toast trigger
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // State Databases for Customer, Trainer & Receptionist Management Modules (Pure Live MongoDB Data)
  const [customersList, setCustomersList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [receptionistsList, setReceptionistsList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Coach Schedule & Client Management Sub-View States
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

  // Receptionist Schedule Management Sub-View States
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [receptionistDutyTab, setReceptionistDutyTab] = useState("logs"); // 'logs' | 'calendar'
  const [receptionistShiftForm, setReceptionistShiftForm] = useState({
    shift: "Morning (06:00 AM - 02:00 PM)",
    terminal: "Gate Terminal A1",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    breakTime: "11:00 AM - 11:30 AM",
  });

  // Customer Details Page & Telemetry Management States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailsTab, setCustomerDetailsTab] = useState("overview"); // 'overview' | 'membership' | 'payments' | 'coaching' | 'telemetry' | 'attendance'
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editCustomerForm, setEditCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    height: "",
    weight: "",
    bodyFat: "",
    bloodGroup: "O+",
    street: "",
    city: "",
    state: "",
    pincode: "",
    status: "Active",
  });
  const [showCustomerPlanModal, setShowCustomerPlanModal] = useState(false);
  const [customerPlanForm, setCustomerPlanForm] = useState({
    plan: "PRO MEMBERSHIP",
    duration: "Monthly",
    amount: 2499,
    paymentMethod: "Card (Online)",
  });
  const [showCustomerAssignTrainerModal, setShowCustomerAssignTrainerModal] =
    useState(false);
  const [customerAssignTrainerForm, setCustomerAssignTrainerForm] = useState({
    trainerId: "",
    trainerName: "",
  });
  const [showCustomerDeleteModal, setShowCustomerDeleteModal] = useState(false);
  const [showEditCoachingModal, setShowEditCoachingModal] = useState(false);
  const [coachingEditForm, setCoachingEditForm] = useState({
    split: "",
    frequency: "",
    intensity: "",
    cardioProtocol: "",
    customNotes: "",
    dailyCalories: "",
    protein: "",
    carbs: "",
    fats: "",
    waterIntake: "",
    mealProtocol: "",
    supplements: "",
    benchPressPR: "",
    squatPR: "",
    deadliftPR: "",
    targetWeight: "",
    trainerNote: "",
  });

  // Handler: Select Customer & Open Dedicated Details Page
  const handleSelectCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setActiveTab("customer-details");
    setCustomerDetailsTab("overview");
    setLoadingCustomerDetails(true);

    try {
      const targetId = cust.userId || cust.id;
      if (targetId) {
        const res = await api.get(`/api/users/${targetId}`);
        if (res.data?.status === "success" && res.data?.data) {
          const fresh = res.data.data;
          setSelectedCustomer((prev) => ({
            ...prev,
            ...fresh,
            id: cust.id || `CUST-${fresh._id ? String(fresh._id).slice(-4) : "101"}`,
            userId: fresh.id || String(fresh._id),
            name: fresh.name || cust.name,
            email: fresh.email || cust.email,
            phone: fresh.phone || cust.phone,
            avatar: fresh.avatar || cust.avatar,
            plan: fresh.membershipPlan || cust.plan || "No Active Plan",
            membershipPlan: fresh.membershipPlan || cust.membershipPlan || "No Active Plan",
            membershipDuration: fresh.membershipDuration || cust.membershipDuration || "Monthly",
            membershipStartDate: fresh.membershipStartDate || cust.membershipStartDate || "",
            expiry: fresh.membershipExpiry || cust.expiry || "--",
            membershipExpiry: fresh.membershipExpiry || cust.membershipExpiry || "--",
            status: fresh.membershipStatus || cust.status || "Active",
            amountPaid: fresh.amountPaid ?? cust.amountPaid ?? 0,
            paymentMethod: fresh.paymentMethod || cust.paymentMethod || "Card (Online)",
            assignedTrainer: fresh.assignedTrainer || cust.assignedTrainer || null,
            assignedTrainerName: fresh.assignedTrainerName || cust.assignedTrainerName || null,
            dob: fresh.dob || cust.dob || "",
            gender: fresh.gender || cust.gender || "",
            address: fresh.address || cust.address || { street: "", city: "", state: "", pincode: "" },
            height: fresh.height || cust.height || "",
            weight: fresh.weight || cust.weight || "",
            bodyFat: fresh.bodyFat || cust.bodyFat || "",
            bloodGroup: fresh.bloodGroup || cust.bloodGroup || "",
            workoutPlan: fresh.workoutPlan || cust.workoutPlan || null,
            dietPlan: fresh.dietPlan || cust.dietPlan || null,
            trainerNotes: fresh.trainerNotes || cust.trainerNotes || [],
            progress: fresh.progress || cust.progress || null,
            attendanceLogs: fresh.attendanceLogs || cust.attendanceLogs || [],
            createdAt: fresh.createdAt || cust.createdAt,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch fresh user details:", err);
    } finally {
      setLoadingCustomerDetails(false);
    }
  };

  // Handler: Open Edit Customer Modal
  const handleOpenEditCustomer = (cust) => {
    const target = cust || selectedCustomer;
    if (!target) return;
    setEditCustomerForm({
      name: target.name || "",
      email: target.email || "",
      phone: target.phone === "N/A" ? "" : target.phone || "",
      gender: target.gender || "Male",
      dob: target.dob || "",
      height: target.height || "",
      weight: target.weight || "",
      bodyFat: target.bodyFat || "",
      bloodGroup: target.bloodGroup || "O+",
      street: target.address?.street || "",
      city: target.address?.city || "",
      state: target.address?.state || "",
      pincode: target.address?.pincode || "",
      status: target.status || "Active",
    });
    setShowEditCustomerModal(true);
  };

  // Handler: Save Customer Profile Updates
  const handleSaveCustomerProfile = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const targetId = selectedCustomer.userId || selectedCustomer.id;
      const payload = {
        name: editCustomerForm.name,
        email: editCustomerForm.email,
        phone: editCustomerForm.phone || "N/A",
        gender: editCustomerForm.gender,
        dob: editCustomerForm.dob,
        height: editCustomerForm.height,
        weight: editCustomerForm.weight,
        bodyFat: editCustomerForm.bodyFat,
        bloodGroup: editCustomerForm.bloodGroup,
        address: {
          street: editCustomerForm.street,
          city: editCustomerForm.city,
          state: editCustomerForm.state,
          pincode: editCustomerForm.pincode,
        },
        status: editCustomerForm.status,
      };

      await api.put(`/api/users/${targetId}`, payload);

      const updatedCust = {
        ...selectedCustomer,
        ...payload,
        status: editCustomerForm.status,
        membershipStatus: editCustomerForm.status,
      };

      setSelectedCustomer(updatedCust);
      setCustomersList((prev) =>
        prev.map((c) =>
          c.userId === targetId || c.id === targetId ? updatedCust : c,
        ),
      );

      setShowEditCustomerModal(false);
      showToast(`✓ Customer profile for "${editCustomerForm.name}" updated successfully!`);
    } catch (err) {
      console.error("Error updating customer:", err);
      showToast(err.response?.data?.message || "Failed to update customer in database");
    }
  };

  // Handler: Open Membership Plan Change Modal
  const handleOpenCustomerPlanModal = () => {
    if (!selectedCustomer) return;
    const currentPlanName =
      selectedCustomer.plan && selectedCustomer.plan !== "No Active Plan"
        ? selectedCustomer.plan
        : (plansList[0]?.name || "PRO MEMBERSHIP");
    const currentDuration = selectedCustomer.membershipDuration || "Monthly";

    const matchedPlan =
      plansList.find(
        (p) =>
          p.name?.toLowerCase() === currentPlanName.toLowerCase() ||
          p.id?.toLowerCase() === currentPlanName.toLowerCase() ||
          (p.tierKey && currentPlanName.toLowerCase().includes(p.tierKey.toLowerCase()))
      ) || plansList[0];

    let calculatedAmount = matchedPlan?.price || 2499;
    if (currentDuration === "Quarterly") {
      calculatedAmount = matchedPlan?.quarterlyPrice || (matchedPlan?.price ? matchedPlan.price * 3 - 500 : 6999);
    } else if (currentDuration === "Annual") {
      calculatedAmount = matchedPlan?.annualPrice || (matchedPlan?.price ? matchedPlan.price * 10 : 24999);
    }

    setCustomerPlanForm({
      plan: matchedPlan?.name || currentPlanName,
      duration: currentDuration,
      amount: selectedCustomer.amountPaid && selectedCustomer.plan === currentPlanName ? selectedCustomer.amountPaid : calculatedAmount,
      paymentMethod: selectedCustomer.paymentMethod || "Card (Online)",
    });
    setShowCustomerPlanModal(true);
  };

  // Handler: Save Customer Membership Plan Update
  const handleSaveCustomerMembership = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const targetId = selectedCustomer.userId || selectedCustomer.id;
      const res = await api.put(`/api/users/${targetId}/membership`, {
        plan: customerPlanForm.plan,
        duration: customerPlanForm.duration,
        amount: Number(customerPlanForm.amount) || 0,
        paymentMethod: customerPlanForm.paymentMethod,
      });

      const today = new Date().toISOString().split("T")[0];
      const expDate = new Date();
      if (customerPlanForm.duration === "Monthly") expDate.setMonth(expDate.getMonth() + 1);
      else if (customerPlanForm.duration === "Quarterly") expDate.setMonth(expDate.getMonth() + 3);
      else if (customerPlanForm.duration === "Annual") expDate.setFullYear(expDate.getFullYear() + 1);
      else expDate.setMonth(expDate.getMonth() + 1);
      const expDateStr = expDate.toISOString().split("T")[0];

      const updatedCust = {
        ...selectedCustomer,
        plan: customerPlanForm.plan,
        membershipPlan: customerPlanForm.plan,
        membershipDuration: customerPlanForm.duration,
        membershipStatus: "Active",
        status: "Active",
        membershipStartDate: today,
        membershipExpiry: expDateStr,
        expiry: expDateStr,
        amountPaid: Number(customerPlanForm.amount) || 0,
        paymentMethod: customerPlanForm.paymentMethod,
      };

      setSelectedCustomer(updatedCust);
      setCustomersList((prev) =>
        prev.map((c) =>
          c.userId === targetId || c.id === targetId ? updatedCust : c,
        ),
      );

      // Refresh payments list to include any new record
      fetchPayments();

      setShowCustomerPlanModal(false);
      showToast(`✓ Membership updated to "${customerPlanForm.plan}" (${customerPlanForm.duration}) for ${selectedCustomer.name}!`);
    } catch (err) {
      console.error("Error updating membership:", err);
      showToast(err.response?.data?.message || "Failed to update membership plan");
    }
  };

  // Handler: Save Assign / Reassign Trainer
  const handleSaveCustomerTrainer = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !customerAssignTrainerForm.trainerName) return;

    try {
      const targetId = selectedCustomer.userId || selectedCustomer.id;
      await api.put(`/api/users/${targetId}/assign-trainer`, {
        trainerId: customerAssignTrainerForm.trainerId || null,
        trainerName: customerAssignTrainerForm.trainerName,
      });

      const updatedCust = {
        ...selectedCustomer,
        assignedTrainer: customerAssignTrainerForm.trainerId || null,
        assignedTrainerName: customerAssignTrainerForm.trainerName,
      };

      setSelectedCustomer(updatedCust);
      setCustomersList((prev) =>
        prev.map((c) =>
          c.userId === targetId || c.id === targetId ? updatedCust : c,
        ),
      );

      setShowCustomerAssignTrainerModal(false);
      showToast(`✓ Master Coach "${customerAssignTrainerForm.trainerName}" assigned to ${selectedCustomer.name}!`);
    } catch (err) {
      console.error("Error assigning trainer:", err);
      showToast(err.response?.data?.message || "Failed to assign trainer");
    }
  };

  // Handler: Save Coaching & Workout/Diet Updates
  const handleSaveCustomerCoaching = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const targetId = selectedCustomer.userId || selectedCustomer.id;
      const updatedWorkout = {
        split: coachingEditForm.split,
        frequency: coachingEditForm.frequency,
        intensity: coachingEditForm.intensity,
        cardioProtocol: coachingEditForm.cardioProtocol,
        customNotes: coachingEditForm.customNotes,
        updatedAt: "Updated by Admin on " + new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      };

      const suppArray = coachingEditForm.supplements
        ? coachingEditForm.supplements.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Hydrolyzed Whey Isolate", "Creatine 5g"];

      const updatedDiet = {
        dailyCalories: coachingEditForm.dailyCalories,
        protein: coachingEditForm.protein,
        carbs: coachingEditForm.carbs,
        fats: coachingEditForm.fats,
        waterIntake: coachingEditForm.waterIntake,
        mealProtocol: coachingEditForm.mealProtocol,
        supplements: suppArray,
        updatedAt: "Updated by Admin on " + new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      };

      const updatedProgress = {
        ...(selectedCustomer.progress || {}),
        benchPressPR: coachingEditForm.benchPressPR,
        squatPR: coachingEditForm.squatPR,
        deadliftPR: coachingEditForm.deadliftPR,
        targetWeight: coachingEditForm.targetWeight,
      };

      let updatedNotes = [...(selectedCustomer.trainerNotes || [])];
      if (coachingEditForm.trainerNote.trim()) {
        updatedNotes.unshift({
          note: coachingEditForm.trainerNote.trim(),
          date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
          author: "Admin Command",
        });
      }

      await api.put(`/api/users/${targetId}/coaching-data`, {
        workoutPlan: updatedWorkout,
        dietPlan: updatedDiet,
        progress: updatedProgress,
        trainerNotes: updatedNotes,
      });

      const updatedCust = {
        ...selectedCustomer,
        workoutPlan: updatedWorkout,
        dietPlan: updatedDiet,
        progress: updatedProgress,
        trainerNotes: updatedNotes,
      };

      setSelectedCustomer(updatedCust);
      setCustomersList((prev) =>
        prev.map((c) =>
          c.userId === targetId || c.id === targetId ? updatedCust : c,
        ),
      );

      setShowEditCoachingModal(false);
      setCoachingEditForm((prev) => ({ ...prev, trainerNote: "" }));
      showToast(`✓ Training protocols & diet matrix saved for ${selectedCustomer.name}!`);
    } catch (err) {
      console.error("Error updating coaching data:", err);
      showToast(err.response?.data?.message || "Failed to update coaching data");
    }
  };

  // Handler: Delete Customer
  const handleConfirmDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const targetId = selectedCustomer.userId || selectedCustomer.id;
      await api.delete(`/api/users/${targetId}`);

      setCustomersList((prev) =>
        prev.filter((c) => c.userId !== targetId && c.id !== targetId),
      );

      setShowCustomerDeleteModal(false);
      showToast(`✓ Customer "${selectedCustomer.name}" removed from database.`);
      setSelectedCustomer(null);
      setActiveTab("customer-mgmt");
    } catch (err) {
      console.error("Error deleting customer:", err);
      showToast(err.response?.data?.message || "Failed to delete customer");
    }
  };

  // Fetch real registered records live from MongoDB Database
  const fetchUsers = async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/api/users");
      if (res.data?.status === "success" && res.data?.data) {
        const allUsers = res.data.data;

        // 1. Genuine Registered Customers (Complete Profile & Telemetry Mapping)
        const liveCustomers = allUsers
          .filter((u) => u.role === "customer")
          .map((u, idx) => {
            const hasPlan =
              u.membershipPlan && u.membershipPlan !== "No Active Plan";
            return {
              id: u.displayId || `CUST-${101 + idx}`,
              userId: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone && u.phone !== "N/A" ? u.phone : "N/A",
              avatar: u.avatar || "",
              dob: u.dob || "",
              gender: u.gender || "",
              address: u.address || {
                street: "",
                city: "",
                state: "",
                pincode: "",
              },
              height: u.height || "",
              weight: u.weight || "",
              bodyFat: u.bodyFat || "",
              bloodGroup: u.bloodGroup || "",
              plan: hasPlan ? u.membershipPlan : "No Active Plan",
              membershipPlan: u.membershipPlan || "No Active Plan",
              membershipDuration: u.membershipDuration || "Monthly",
              membershipStartDate: u.membershipStartDate || "",
              expiry: hasPlan && u.membershipExpiry ? u.membershipExpiry : "--",
              membershipExpiry: u.membershipExpiry || "--",
              status: hasPlan
                ? u.membershipStatus || "Active"
                : "No Membership",
              membershipStatus: u.membershipStatus || (hasPlan ? "Active" : "No Membership"),
              amountPaid: u.amountPaid || 0,
              paymentMethod: u.paymentMethod || "Card (Online)",
              assignedTrainer: u.assignedTrainer || null,
              assignedTrainerName: u.assignedTrainerName || null,
              workoutPlan: u.workoutPlan || null,
              dietPlan: u.dietPlan || null,
              trainerNotes: u.trainerNotes || [],
              progress: u.progress || null,
              attendanceLogs: u.attendanceLogs || [],
              chatMessages: u.chatMessages || [],
              createdAt: u.createdAt,
            };
          });
        setCustomersList(liveCustomers);

        // Update selectedCustomer if it was already selected
        if (selectedCustomer) {
          const freshSelected = liveCustomers.find(
            (c) => c.userId === selectedCustomer.userId || c.id === selectedCustomer.id
          );
          if (freshSelected) {
            setSelectedCustomer((prev) => ({ ...prev, ...freshSelected }));
          }
        }

        // 2. Genuine Registered Trainers / Coaches
        const liveTrainers = allUsers
          .filter((u) => u.role === "trainer")
          .map((u, idx) => ({
            id: u.displayId || `TRN-${501 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== "N/A" ? u.phone : "N/A",
            spec: u.spec || "Master Coach & Conditioning",
            clients: liveCustomers.filter(
              (c) =>
                (c.assignedTrainer === u.id ||
                  c.assignedTrainerName === u.name) &&
                c.plan !== "No Active Plan",
            ).length,
            shift: u.shift || "06:00 AM - 02:00 PM",
            room: u.assignedRoom || "Main Strength & Conditioning Arena",
            days: u.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            rating: "5.0 ★",
            status: "On Duty",
          }));
        setTrainersList(liveTrainers);

        // 3. Genuine Registered Receptionists / Front Desk
        const liveReceptionists = allUsers
          .filter((u) => u.role === "receptionist")
          .map((u, idx) => ({
            id: u.displayId || `REC-${201 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== "N/A" ? u.phone : "N/A",
            terminal: u.assignedRoom || "Gate Terminal A1",
            shift: u.shift || "Morning (06:00 AM - 02:00 PM)",
            days: u.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            checkinsToday: 0,
            status: "Online",
          }));
        setReceptionistsList(liveReceptionists);

        // 4. Synchronize Real Attendance Lists with MongoDB database
        try {
          const attRes = await api.get("/api/attendance");
          if (
            attRes.data?.status === "success" &&
            Array.isArray(attRes.data.data) &&
            attRes.data.data.length > 0
          ) {
            const realLogs = attRes.data.data.map((l, idx) => ({
              id: l.logId || `LOG-C${101 + idx}`,
              memberId: l.customerId || `TP-CUST-${101 + idx}`,
              name: l.name,
              email: l.email || "",
              phone: l.phone || "",
              plan: l.plan || "PRO MEMBERSHIP",
              gate: l.terminal || "Turnstile Gate Alpha-1",
              timeIn: l.timeIn,
              timeOut: l.timeOut || "--",
              duration: l.status === "Checked Out" ? "1h 15m" : "Active In Arena",
              status: l.status || "Active Inside",
              verification: l.verification || "Manual OTP Verified",
              rfid: l.otpCode ? `OTP-${l.otpCode}` : `RFID-${9000 + idx}`,
              date: l.date || new Date().toISOString().slice(0, 10),
            }));
            setCustomerAttendanceList(realLogs);
          } else {
            setCustomerAttendanceList(
              liveCustomers.map((c, idx) => ({
                id: `LOG-C${101 + idx}`,
                memberId: c.id || `TP-CUST-${101 + idx}`,
                name: c.name,
                email: c.email,
                phone: c.phone,
                plan: c.plan || c.membershipPlan || "PRO MEMBERSHIP",
                gate: idx % 2 === 0 ? "Turnstile Gate Alpha-1" : "Turnstile Gate Bravo-2",
                timeIn: idx % 2 === 0 ? "06:30 AM" : "07:15 AM",
                timeOut: idx % 3 === 0 ? "08:15 AM" : "--",
                duration: idx % 3 === 0 ? "1h 15m" : "Active In Arena",
                status: idx % 3 === 0 ? "Checked Out" : "Active Inside",
                verification: "Biometric NFC Pass",
                rfid: `RFID-${9000 + idx}`,
                date: new Date().toISOString().slice(0, 10),
              }))
            );
          }
        } catch (attErr) {
          console.warn("Error fetching attendance logs in Admin:", attErr);
          setCustomerAttendanceList(
            liveCustomers.map((c, idx) => ({
              id: `LOG-C${101 + idx}`,
              memberId: c.id || `TP-CUST-${101 + idx}`,
              name: c.name,
              email: c.email,
              phone: c.phone,
              plan: c.plan || c.membershipPlan || "PRO MEMBERSHIP",
              gate: idx % 2 === 0 ? "Turnstile Gate Alpha-1" : "Turnstile Gate Bravo-2",
              timeIn: idx % 2 === 0 ? "06:30 AM" : "07:15 AM",
              timeOut: idx % 3 === 0 ? "08:15 AM" : "--",
              duration: idx % 3 === 0 ? "1h 15m" : "Active In Arena",
              status: idx % 3 === 0 ? "Checked Out" : "Active Inside",
              verification: "Biometric NFC Pass",
              rfid: `RFID-${9000 + idx}`,
              date: new Date().toISOString().slice(0, 10),
            }))
          );
        }

        setTrainerAttendanceList(
          liveTrainers.map((t, idx) => ({
            id: `LOG-T${201 + idx}`,
            trainerId: t.id,
            name: t.name,
            spec: t.spec || "Master Coach",
            shift: t.shift || "Morning (06:00 AM - 02:00 PM)",
            timeIn: "06:00 AM",
            timeOut: "--",
            dutyHours: "4.5 hrs",
            status: t.status || "On Duty",
            zone: t.room || "Main Olympic Arena",
            clientsToday: t.clients || 0,
          }))
        );

        setReceptionistAttendanceList(
          liveReceptionists.map((r, idx) => ({
            id: `LOG-R${301 + idx}`,
            staffId: r.id,
            name: r.name,
            desk: r.terminal || "Front Desk Concierge Alpha",
            shift: r.shift || "Morning (06:00 AM - 02:00 PM)",
            timeIn: "05:45 AM",
            timeOut: "--",
            dutyHours: "6.0 hrs",
            status: r.status || "Online",
            scansProcessed: liveCustomers.length,
          }))
        );
      }
    } catch (err) {
      console.log("Error fetching data from database:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch real payment and billing records from MongoDB
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [receiptModalData, setReceiptModalData] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments");
      if (res.data?.status === "success" && Array.isArray(res.data.data)) {
        setPaymentsList(res.data.data);
      }
    } catch (err) {
      console.warn("Error fetching payments:", err);
    }
  };

  // Download official tax invoice document (HTML/PDF format)
  const handleDownloadInvoice = (pay, fallbackCustomer = null) => {
    const invId =
      pay.id ||
      pay.invoiceId ||
      (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : `INV-${Date.now().toString().slice(-6)}`);
    const dateStr =
      pay.date ||
      (pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"));
    const amount = Number(pay.amount || 0);
    const baseAmount = Math.round(amount / 1.18);
    const gstAmount = amount - baseAmount;
    const custName = pay.customer || fallbackCustomer?.name || "Titan Athlete";
    const custEmail = pay.customerEmail || fallbackCustomer?.email || "--";
    const custPhone = pay.customerPhone || fallbackCustomer?.phone || "--";
    const planName = pay.plan || pay.planOrItem || fallbackCustomer?.plan || "Titan Elite Membership";
    const method = pay.method || fallbackCustomer?.paymentMethod || "Online Payment";

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
        <div class="val-sub">${custEmail}</div>
        <div class="val-sub">${custPhone}</div>
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
      <div>Official computer-generated Tax Invoice issued by Titan Pulse Arena Controller.</div>
      <div>Support: billing@titanpulse.fit • Arena Front Desk: +91 98765 43210</div>
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

  useEffect(() => {
    fetchUsers();
    fetchPayments();
    fetchEnquiries();

    const handleSync = (e) => {
      fetchUsers();
      fetchPayments();
      fetchEnquiries();

      // Real-time toast alert when a new enquiry arrives from Reception Desk
      if (e?.detail?.type === "NEW_ENQUIRY_LEAD" || e?.key === "titan_enquiry_sync_lead") {
        try {
          const payload = e?.detail || JSON.parse(localStorage.getItem("titan_enquiry_sync_lead") || "{}");
          if (payload?.lead?.name) {
            showToast(`📥 New Lead Received: ${payload.lead.name} (${payload.lead.goal || "Enquiry"})`);
          }
        } catch {}
      }
    };

    window.addEventListener("titan_attendance_sync", handleSync);
    window.addEventListener("titan_enquiry_sync", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("titan_attendance_sync", handleSync);
      window.removeEventListener("titan_enquiry_sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [activeTab]);

  // Live synchronization of assigned active athletes for selected coach
  useEffect(() => {
    if (!selectedCoach) return;

    const coachId = String(selectedCoach.userId || selectedCoach.id || "");
    const coachName = (selectedCoach.name || "").toLowerCase().trim();

    const realAssigned = customersList
      .filter((c) => {
        // Must have a valid membership
        if (
          !c.plan ||
          c.plan === "No Active Plan" ||
          c.status === "No Membership"
        )
          return false;

        const custTrainerId = String(c.assignedTrainer || "");
        const custTrainerName = (c.assignedTrainerName || "")
          .toLowerCase()
          .trim();

        return (
          (custTrainerId &&
            (custTrainerId === coachId ||
              custTrainerId === String(selectedCoach.id) ||
              custTrainerId === String(selectedCoach.userId))) ||
          (custTrainerName &&
            (custTrainerName === coachName ||
              coachName.includes(custTrainerName) ||
              custTrainerName.includes(coachName)))
        );
      })
      .map((c, idx) => ({
        id: c.id || `ACT-${101 + idx}`,
        userId: c.userId,
        name: c.name,
        email: c.email,
        phone: c.phone || "N/A",
        program: c.plan,
        goal: "Athletic Hypertrophy & Conditioning",
        slot: `${selectedCoach.shift ? selectedCoach.shift.split("(")[0].trim() : "07:00 AM - 08:00 AM"} (Mon-Sat)`,
        status: "Active",
        progress: "35%",
      }));

    setCoachClients((prev) => ({
      ...prev,
      active: realAssigned,
    }));
  }, [selectedCoach, customersList]);

  const { cmsData, updateFullCMS, updateSection, resetToDefaults } =
    useLandingPageCMS();

  const [plansList, setPlansList] = useState(() => {
    return cmsData?.memberships && cmsData.memberships.length > 0
      ? cmsData.memberships
      : [
          {
            id: "PLN-1",
            tierKey: "pro",
            name: "PRO MEMBERSHIP",
            badge: "TITAN ALL-ACCESS PASS",
            subBadge: "BIOMETRIC UNLOCKED • 24/7 ACCESS",
            price: 2499,
            quarterlyPrice: 6999,
            annualPrice: 24999,
            duration: "Monthly",
            description:
              "All-access strength arena, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.",
            perks:
              "All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge",
            services: [
              {
                id: "srv-1",
                name: "All-Access Gym Floor & Cardio Zone",
                category: "Facility Access",
                included: true,
              },
              {
                id: "srv-2",
                name: "Biometric Smart Locker Activation",
                category: "Amenities",
                included: true,
              },
              {
                id: "srv-3",
                name: "3D Body Composition Bio-Scan",
                category: "Technology",
                included: true,
              },
              {
                id: "srv-4",
                name: "Sauna & Recovery Lounge Access",
                category: "Wellness",
                included: true,
              },
              {
                id: "srv-5",
                name: "Titan Companion Mobile App Access",
                category: "Technology",
                included: true,
              },
              {
                id: "srv-6",
                name: "Complimentary Towel Service",
                category: "Amenities",
                included: true,
              },
              {
                id: "srv-7",
                name: "Dedicated Master Coach (4 Sessions/mo)",
                category: "Coaching",
                included: false,
              },
              {
                id: "srv-8",
                name: "Unlimited Cryotherapy Chambers Access",
                category: "Wellness",
                included: false,
              },
            ],
          },
          {
            id: "PLN-2",
            tierKey: "elite",
            name: "ELITE VIP ATHLETE STATUS",
            badge: "VIP ATHLETE STATUS",
            subBadge: "CRYOTHERAPY • HYDRO SUITE • GUEST PERKS",
            price: 4999,
            quarterlyPrice: 12999,
            annualPrice: 49999,
            duration: "Monthly",
            description:
              "VIP priority access, cryotherapy chambers, hydro-massage therapy suite, custom micro-nutrient bar access, and unlimited guest privileges.",
            perks:
              "Unlimited Cryotherapy Chambers Access, Private Hydro-Massage Therapy Suite, Dedicated VIP Keycard Locker Lounge, Free Daily Micro-Nutrient Shake Bar",
            services: [
              {
                id: "srv-1",
                name: "All-Access Gym Floor & Cardio Zone",
                category: "Facility Access",
                included: true,
              },
              {
                id: "srv-2",
                name: "Biometric Smart Locker Activation",
                category: "Amenities",
                included: true,
              },
              {
                id: "srv-3",
                name: "3D Body Composition Bio-Scan",
                category: "Technology",
                included: true,
              },
              {
                id: "srv-4",
                name: "Unlimited Cryotherapy Chambers Access",
                category: "Wellness",
                included: true,
              },
              {
                id: "srv-5",
                name: "Private Hydro-Massage Therapy Suite",
                category: "Wellness",
                included: true,
              },
              {
                id: "srv-6",
                name: "Dedicated VIP Keycard Locker Lounge",
                category: "Amenities",
                included: true,
              },
              {
                id: "srv-7",
                name: "Free Daily Micro-Nutrient Shake Bar",
                category: "Nutrition",
                included: true,
              },
              {
                id: "srv-8",
                name: "Unlimited Guest Privileges (2 Passes/mo)",
                category: "Privileges",
                included: true,
              },
            ],
          },
          {
            id: "PLN-3",
            tierKey: "pt",
            name: "PT VIP COACHING MANUAL",
            badge: "1-ON-1 MASTER COACHING",
            subBadge: "DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX",
            price: 9999,
            quarterlyPrice: 26999,
            annualPrice: 99999,
            duration: "Monthly",
            description:
              "Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and 24/7 direct coach WhatsApp line.",
            perks:
              "Dedicated Master Fitness Coach, Custom Macro & Meal Matrix, Weekly 3D Muscle Bio-Scans, Live Heart-Rate Telemetry, Private 1-on-1 Training Bay",
            services: [
              {
                id: "srv-1",
                name: "Dedicated Master Personal Trainer",
                category: "Coaching",
                included: true,
              },
              {
                id: "srv-2",
                name: "Custom Macro & Meal Matrix Protocols",
                category: "Nutrition",
                included: true,
              },
              {
                id: "srv-3",
                name: "Weekly 3D Muscle Bio-Scans & Audits",
                category: "Technology",
                included: true,
              },
              {
                id: "srv-4",
                name: "Live Heart-Rate & Telemetry Sync",
                category: "Technology",
                included: true,
              },
              {
                id: "srv-5",
                name: "Private 1-on-1 Training Bay Access",
                category: "Facility Access",
                included: true,
              },
              {
                id: "srv-6",
                name: "Unlimited Cryotherapy & Hydro Suites",
                category: "Wellness",
                included: true,
              },
              {
                id: "srv-7",
                name: "24/7 Direct WhatsApp Coach Priority Line",
                category: "Coaching",
                included: true,
              },
              {
                id: "srv-8",
                name: "Complimentary Pre-Workout & Intra-Fuel Shakes",
                category: "Nutrition",
                included: true,
              },
            ],
          },
        ];
  });

  useEffect(() => {
    if (cmsData?.memberships && cmsData.memberships.length > 0) {
      setPlansList(cmsData.memberships);
    }
  }, [cmsData?.memberships]);

  // Membership Plan & Services Editor State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planEditForm, setPlanEditForm] = useState(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] =
    useState("Facility Access");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("All");

  const handleSaveEditedPlan = () => {
    if (!planEditForm) return;

    // Compile perks summary from included services
    const includedPerksSummary = (planEditForm.services || [])
      .filter((s) => s.included)
      .map((s) => s.name)
      .slice(0, 4)
      .join(", ");

    const updatedPlan = {
      ...planEditForm,
      perks: includedPerksSummary || planEditForm.perks,
    };

    const updatedPlansList = plansList.map((p) =>
      p.id === updatedPlan.id ? updatedPlan : p,
    );
    setPlansList(updatedPlansList);
    setSelectedPlan(updatedPlan);

    // Synchronize to CMS and localStorage so landing page updates live!
    if (updateSection) {
      updateSection("memberships", updatedPlansList);
    }
    setEditorData((prev) => ({
      ...prev,
      memberships: updatedPlansList,
    }));

    showToast(
      `✓ Membership Plan "${updatedPlan.name}" & services updated live on Landing Page!`,
    );
    setActiveTab("membership-mgmt");
  };

  // Restore original membership plans and services from landing page defaults
  const handleRestoreOriginalPlans = () => {
    if (
      window.confirm(
        "Reset all membership plans & services to the original landing page specifications?",
      )
    ) {
      const original =
        defaultLandingData && defaultLandingData.memberships
          ? defaultLandingData.memberships
          : [
              {
                id: "PLN-1",
                tierKey: "pro",
                name: "PRO MEMBERSHIP",
                badge: "TITAN ALL-ACCESS PASS",
                subBadge: "BIOMETRIC UNLOCKED • 24/7 ACCESS",
                price: 2499,
                quarterlyPrice: 6999,
                annualPrice: 24999,
                duration: "Monthly",
                description:
                  "All-access strength arena, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.",
                perks:
                  "All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge",
                services: [
                  {
                    id: "srv-1",
                    name: "All-Access Gym Floor & Cardio Zone",
                    category: "Facility Access",
                    included: true,
                  },
                  {
                    id: "srv-2",
                    name: "Biometric Smart Locker Activation",
                    category: "Amenities",
                    included: true,
                  },
                  {
                    id: "srv-3",
                    name: "3D Body Composition Bio-Scan",
                    category: "Technology",
                    included: true,
                  },
                  {
                    id: "srv-4",
                    name: "Sauna & Recovery Lounge Access",
                    category: "Wellness",
                    included: true,
                  },
                  {
                    id: "srv-5",
                    name: "Titan Companion Mobile App Access",
                    category: "Technology",
                    included: true,
                  },
                  {
                    id: "srv-6",
                    name: "Complimentary Towel Service",
                    category: "Amenities",
                    included: true,
                  },
                  {
                    id: "srv-7",
                    name: "Dedicated Master Coach (4 Sessions/mo)",
                    category: "Coaching",
                    included: false,
                  },
                  {
                    id: "srv-8",
                    name: "Unlimited Cryotherapy Chambers Access",
                    category: "Wellness",
                    included: false,
                  },
                ],
              },
              {
                id: "PLN-2",
                tierKey: "elite",
                name: "ELITE VIP ATHLETE STATUS",
                badge: "VIP ATHLETE STATUS",
                subBadge: "CRYOTHERAPY • HYDRO SUITE • GUEST PERKS",
                price: 4999,
                quarterlyPrice: 12999,
                annualPrice: 49999,
                duration: "Monthly",
                description:
                  "VIP priority access, cryotherapy chambers, hydro-massage therapy suite, custom micro-nutrient bar access, and unlimited guest privileges.",
                perks:
                  "Unlimited Cryotherapy Chambers Access, Private Hydro-Massage Therapy Suite, Dedicated VIP Keycard Locker Lounge, Free Daily Micro-Nutrient Shake Bar",
                services: [
                  {
                    id: "srv-1",
                    name: "All-Access Gym Floor & Cardio Zone",
                    category: "Facility Access",
                    included: true,
                  },
                  {
                    id: "srv-2",
                    name: "Biometric Smart Locker Activation",
                    category: "Amenities",
                    included: true,
                  },
                  {
                    id: "srv-3",
                    name: "3D Body Composition Bio-Scan",
                    category: "Technology",
                    included: true,
                  },
                  {
                    id: "srv-4",
                    name: "Unlimited Cryotherapy Chambers Access",
                    category: "Wellness",
                    included: true,
                  },
                  {
                    id: "srv-5",
                    name: "Private Hydro-Massage Therapy Suite",
                    category: "Wellness",
                    included: true,
                  },
                  {
                    id: "srv-6",
                    name: "Dedicated VIP Keycard Locker Lounge",
                    category: "Amenities",
                    included: true,
                  },
                  {
                    id: "srv-7",
                    name: "Free Daily Micro-Nutrient Shake Bar",
                    category: "Nutrition",
                    included: true,
                  },
                  {
                    id: "srv-8",
                    name: "Unlimited Guest Privileges (2 Passes/mo)",
                    category: "Privileges",
                    included: true,
                  },
                ],
              },
              {
                id: "PLN-3",
                tierKey: "pt",
                name: "PT VIP COACHING MANUAL",
                badge: "1-ON-1 MASTER COACHING",
                subBadge: "DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX",
                price: 9999,
                quarterlyPrice: 26999,
                annualPrice: 99999,
                duration: "Monthly",
                description:
                  "Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and 24/7 direct coach WhatsApp line.",
                perks:
                  "Dedicated Master Fitness Coach, Custom Macro & Meal Matrix, Weekly 3D Muscle Bio-Scans, Live Heart-Rate Telemetry, Private 1-on-1 Training Bay",
                services: [
                  {
                    id: "srv-1",
                    name: "Dedicated Master Personal Trainer",
                    category: "Coaching",
                    included: true,
                  },
                  {
                    id: "srv-2",
                    name: "Custom Macro & Meal Matrix Protocols",
                    category: "Nutrition",
                    included: true,
                  },
                  {
                    id: "srv-3",
                    name: "Weekly 3D Muscle Bio-Scans & Audits",
                    category: "Technology",
                    included: true,
                  },
                  {
                    id: "srv-4",
                    name: "Live Heart-Rate & Telemetry Sync",
                    category: "Technology",
                    included: true,
                  },
                  {
                    id: "srv-5",
                    name: "Private 1-on-1 Training Bay Access",
                    category: "Facility Access",
                    included: true,
                  },
                  {
                    id: "srv-6",
                    name: "Unlimited Cryotherapy & Hydro Suites",
                    category: "Wellness",
                    included: true,
                  },
                  {
                    id: "srv-7",
                    name: "24/7 Direct WhatsApp Coach Priority Line",
                    category: "Coaching",
                    included: true,
                  },
                  {
                    id: "srv-8",
                    name: "Complimentary Pre-Workout & Intra-Fuel Shakes",
                    category: "Nutrition",
                    included: true,
                  },
                ],
              },
            ];

      setPlansList(original);
      if (updateSection) {
        updateSection("memberships", original);
      }
      setEditorData((prev) => ({
        ...prev,
        memberships: original,
      }));
      showToast(
        "🔄 Membership plans restored to original landing page services data!",
      );
    }
  };

  // Multi-Tier Attendance & Biometric Gate Control States (Customer, Trainer, Receptionist)
  const [attendanceSubTab, setAttendanceSubTab] = useState("customers"); // 'customers' | 'trainers' | 'receptionists' | 'all'
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive'
  const [showManualAttendanceModal, setShowManualAttendanceModal] = useState(false);
  const [manualAttendanceForm, setManualAttendanceForm] = useState({
    category: "customer", // 'customer' | 'trainer' | 'receptionist'
    userId: "",
    name: "",
    gate: "Turnstile Gate Alpha-1",
    status: "Active Inside",
    timeIn: "08:30 AM",
    timeOut: "--",
    shift: "Morning (06:00 AM - 02:00 PM)",
    zone: "Main Strength Floor",
    desk: "Front Desk Alpha Terminal",
  });

  const [customerAttendanceList, setCustomerAttendanceList] = useState([]);
  const [trainerAttendanceList, setTrainerAttendanceList] = useState([]);
  const [receptionistAttendanceList, setReceptionistAttendanceList] = useState([]);

  // Combined legacy support for attendanceLogs
  const attendanceLogs = customerAttendanceList;

  // Toggle Customer Check-in / Check-out status
  const handleToggleCustomerAttendance = (id) => {
    setCustomerAttendanceList((prev) =>
      prev.map((c) => {
        if (c.id === id || c.memberId === id) {
          const isInside = c.status === "Active Inside";
          const now = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            ...c,
            status: isInside ? "Checked Out" : "Active Inside",
            timeOut: isInside ? now : "--",
            duration: isInside ? "Session Completed" : "Active Now",
          };
        }
        return c;
      })
    );
    showToast("✓ Turnstile access state updated for member!");
  };

  // Toggle Trainer duty status
  const handleToggleTrainerDuty = (id, newStatus) => {
    setTrainerAttendanceList((prev) =>
      prev.map((t) =>
        t.id === id || t.trainerId === id ? { ...t, status: newStatus } : t
      )
    );
    setTrainersList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    showToast(`✓ Trainer duty status updated to: ${newStatus}`);
  };

  // Toggle Receptionist duty status
  const handleToggleReceptionistDuty = (id, newStatus) => {
    setReceptionistAttendanceList((prev) =>
      prev.map((r) =>
        r.id === id || r.staffId === id ? { ...r, status: newStatus } : r
      )
    );
    setReceptionistsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`✓ Front desk staff status updated to: ${newStatus}`);
  };

  // Export Comprehensive Attendance Ledger to CSV
  const handleExportAttendanceCSV = () => {
    let headers = [];
    let rows = [];
    let filename = "";

    if (attendanceSubTab === "customers") {
      headers = [
        "Log ID",
        "Member ID",
        "Member Name",
        "Email",
        "Plan",
        "Gate Terminal",
        "Time In",
        "Time Out",
        "Duration",
        "Status",
        "Verification",
      ];
      rows = customerAttendanceList.map((c) => [
        c.id,
        c.memberId,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.plan}"`,
        `"${c.gate}"`,
        c.timeIn,
        c.timeOut,
        `"${c.duration}"`,
        c.status,
        `"${c.verification}"`,
      ]);
      filename = `Customer_Attendance_Ledger_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
    } else if (attendanceSubTab === "trainers") {
      headers = [
        "Log ID",
        "Trainer ID",
        "Coach Name",
        "Specialization",
        "Shift Timings",
        "Time In",
        "Time Out",
        "Duty Hours",
        "Status",
        "Floor Zone",
      ];
      rows = trainerAttendanceList.map((t) => [
        t.id,
        t.trainerId,
        `"${t.name}"`,
        `"${t.spec}"`,
        `"${t.shift}"`,
        t.timeIn,
        t.timeOut,
        t.dutyHours,
        t.status,
        `"${t.zone}"`,
      ]);
      filename = `Trainer_Coach_Attendance_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
    } else if (attendanceSubTab === "receptionists") {
      headers = [
        "Log ID",
        "Staff ID",
        "Receptionist Name",
        "Desk Station",
        "Shift Timings",
        "Time In",
        "Time Out",
        "Duty Hours",
        "Status",
        "Scans Processed",
      ];
      rows = receptionistAttendanceList.map((r) => [
        r.id,
        r.staffId,
        `"${r.name}"`,
        `"${r.desk}"`,
        `"${r.shift}"`,
        r.timeIn,
        r.timeOut,
        r.dutyHours,
        r.status,
        r.scansProcessed,
      ]);
      filename = `Receptionist_Staff_Attendance_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
    } else {
      headers = [
        "Category",
        "ID",
        "Name",
        "Assigned Gate / Shift",
        "Time In",
        "Time Out",
        "Status",
      ];
      rows = [
        ...customerAttendanceList.map((c) => [
          "Customer",
          c.memberId,
          `"${c.name}"`,
          `"${c.gate}"`,
          c.timeIn,
          c.timeOut,
          c.status,
        ]),
        ...trainerAttendanceList.map((t) => [
          "Trainer",
          t.trainerId,
          `"${t.name}"`,
          `"${t.shift}"`,
          t.timeIn,
          t.timeOut,
          t.status,
        ]),
        ...receptionistAttendanceList.map((r) => [
          "Receptionist",
          r.staffId,
          `"${r.name}"`,
          `"${r.desk}"`,
          r.timeIn,
          r.timeOut,
          r.status,
        ]),
      ];
      filename = `All_Gym_Attendance_Ledger_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${filename} successfully!`);
  };

  // Add / Punch Manual Attendance Record
  const handleSaveManualAttendance = (e) => {
    e.preventDefault();
    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const logId = `LOG-${Date.now().toString().slice(-4)}`;

    if (manualAttendanceForm.category === "customer") {
      const newRec = {
        id: logId,
        memberId: manualAttendanceForm.userId || `TP-CUST-${Date.now().toString().slice(-3)}`,
        name: manualAttendanceForm.name,
        email: `${manualAttendanceForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        plan: "ELITE VIP ATHLETE STATUS",
        gate: manualAttendanceForm.gate || "Turnstile Gate Alpha-1",
        timeIn: manualAttendanceForm.timeIn || nowTime,
        timeOut: manualAttendanceForm.status === "Active Inside" ? "--" : nowTime,
        duration: manualAttendanceForm.status === "Active Inside" ? "Just Checked In" : "1h 15m",
        status: manualAttendanceForm.status,
        verification: "Manual Admin Pass Punch",
        rfid: `RFID-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
      };
      setCustomerAttendanceList([newRec, ...customerAttendanceList]);
      showToast(`✓ Logged attendance entry for customer: ${manualAttendanceForm.name}`);
    } else if (manualAttendanceForm.category === "trainer") {
      const newRec = {
        id: logId,
        trainerId: manualAttendanceForm.userId || `TRN-${Date.now().toString().slice(-3)}`,
        name: manualAttendanceForm.name,
        spec: "Master Strength Coach",
        shift: manualAttendanceForm.shift || "Morning (06:00 AM - 02:00 PM)",
        timeIn: manualAttendanceForm.timeIn || nowTime,
        timeOut: manualAttendanceForm.status === "On Duty" ? "--" : nowTime,
        dutyHours: manualAttendanceForm.status === "On Duty" ? "1.0 hrs" : "0 hrs",
        status: manualAttendanceForm.status === "Active Inside" ? "On Duty" : manualAttendanceForm.status,
        zone: manualAttendanceForm.zone || "Main Olympic Floor",
        clientsToday: 1,
      };
      setTrainerAttendanceList([newRec, ...trainerAttendanceList]);
      showToast(`✓ Logged shift duty for coach: ${manualAttendanceForm.name}`);
    } else {
      const newRec = {
        id: logId,
        staffId: manualAttendanceForm.userId || `REC-${Date.now().toString().slice(-3)}`,
        name: manualAttendanceForm.name,
        desk: manualAttendanceForm.desk || "Front Desk Concierge Alpha",
        shift: manualAttendanceForm.shift || "Morning (06:00 AM - 02:00 PM)",
        timeIn: manualAttendanceForm.timeIn || nowTime,
        timeOut: manualAttendanceForm.status === "Online" ? "--" : nowTime,
        dutyHours: manualAttendanceForm.status === "Online" ? "1.0 hrs" : "0 hrs",
        status: manualAttendanceForm.status === "Active Inside" ? "Online" : manualAttendanceForm.status,
        scansProcessed: 12,
      };
      setReceptionistAttendanceList([newRec, ...receptionistAttendanceList]);
      showToast(`✓ Logged terminal duty for front desk: ${manualAttendanceForm.name}`);
    }

    setShowManualAttendanceModal(false);
    setManualAttendanceForm({
      category: "customer",
      userId: "",
      name: "",
      gate: "Turnstile Gate Alpha-1",
      status: "Active Inside",
      timeIn: "08:30 AM",
      timeOut: "--",
      shift: "Morning (06:00 AM - 02:00 PM)",
      zone: "Main Strength Floor",
      desk: "Front Desk Alpha Terminal",
    });
  };

  const [notificationsList, setNotificationsList] = useState([
    {
      id: "NTF-1",
      title: "Biometric Gate Update",
      msg: "Scanner Terminal A1 firmware updated to v3.4.",
      target: "All Staff",
      time: "10 mins ago",
    },
    {
      id: "NTF-2",
      title: "Membership Expiry Alert",
      msg: "Automated renewal notices active.",
      target: "Due Customers",
      time: "1 hour ago",
    },
    {
      id: "NTF-3",
      title: "Masterclass Workshop",
      msg: "Powerlifting clinic scheduled for Saturday at 5 PM.",
      target: "All Customers",
      time: "3 hours ago",
    },
  ]);

  const [enquiriesList, setEnquiriesList] = useState([]);
  const [showAddEnquiryModal, setShowAddEnquiryModal] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [enquirySearch, setEnquirySearch] = useState("");
  const [newEnquiryForm, setNewEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    goal: "Muscle Gain & Hypertrophy",
    source: "Walk-in Visitor",
    notes: "",
  });

  const fetchEnquiries = async () => {
    try {
      const res = await api.get("/api/enquiries");
      if (res.data?.status === "success" && Array.isArray(res.data?.data)) {
        setEnquiriesList(
          res.data.data.map((enq) => ({
            id: enq.enquiryId || (enq._id ? `ENQ-${String(enq._id).slice(-4)}` : `ENQ-${Math.floor(100 + Math.random() * 900)}`),
            _id: enq._id,
            enquiryId: enq.enquiryId,
            name: enq.name,
            email: enq.email && enq.email !== "N/A" ? enq.email : "N/A",
            phone: enq.phone,
            goal: enq.goal || "Muscle Gain & Strength",
            source: enq.source || "Walk-in Visitor",
            status: enq.status || "New Lead",
            notes: enq.notes || "",
            capturedBy: enq.capturedBy || "Front Desk Receptionist",
            date: enq.date || (enq.createdAt ? enq.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)),
            createdAt: enq.createdAt,
          }))
        );
      }
    } catch (err) {
      console.warn("Error fetching enquiries in Admin:", err);
    }
  };

  const handleUpdateEnquiryStatus = async (targetId, newStatus) => {
    try {
      await api.put(`/api/enquiries/${targetId}`, { status: newStatus });
      setEnquiriesList((prev) =>
        prev.map((e) =>
          e.id === targetId || e._id === targetId || e.enquiryId === targetId
            ? { ...e, status: newStatus }
            : e
        )
      );
      showToast(`✓ Lead status updated to "${newStatus}"!`);
    } catch (err) {
      console.error("Error updating enquiry status:", err);
      showToast("Failed to update lead status");
    }
  };

  const handleDeleteEnquiry = async (targetId, name) => {
    try {
      await api.delete(`/api/enquiries/${targetId}`);
      setEnquiriesList((prev) =>
        prev.filter(
          (e) => e.id !== targetId && e._id !== targetId && e.enquiryId !== targetId
        )
      );
      showToast(`✓ Prospect lead for ${name} removed`);
    } catch (err) {
      console.error("Error deleting lead:", err);
      showToast("Failed to delete enquiry lead");
    }
  };

  const handleCreateAdminEnquiry = async (e) => {
    e.preventDefault();
    if (!newEnquiryForm.name || !newEnquiryForm.phone) {
      showToast("Please enter prospect name and phone number");
      return;
    }
    try {
      const payload = {
        name: newEnquiryForm.name,
        phone: newEnquiryForm.phone,
        email: newEnquiryForm.email || "N/A",
        goal: newEnquiryForm.goal,
        source: newEnquiryForm.source,
        notes: newEnquiryForm.notes,
        capturedBy: "Admin Command HQ",
      };
      const res = await api.post("/api/enquiries", payload);
      if (res.data?.status === "success") {
        fetchEnquiries();
        setShowAddEnquiryModal(false);
        setNewEnquiryForm({
          name: "",
          phone: "",
          email: "",
          goal: "Muscle Gain & Hypertrophy",
          source: "Walk-in Visitor",
          notes: "",
        });
        showToast(`✓ Prospect lead created for ${payload.name}!`);
      }
    } catch (err) {
      console.error("Error creating enquiry from Admin:", err);
      showToast(err.response?.data?.message || "Failed to create prospect lead");
    }
  };

  // ========================================================
  // REAL-TIME MULTI-DASHBOARD NOTIFICATION SYNTHESIS ENGINE
  // ========================================================
  const [adminReadNotifs, setAdminReadNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_admin_read_notifs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminDismissedNotifs, setAdminDismissedNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_admin_dismissed_notifs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customBroadcasts, setCustomBroadcasts] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_admin_custom_broadcasts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [headerNotifDropdownOpen, setHeaderNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  // Close notification popover when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setHeaderNotifDropdownOpen(false);
      }
    };
    if (headerNotifDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [headerNotifDropdownOpen]);

  // Pinned notifications persistence
  const [pinnedNotifIds, setPinnedNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_admin_pinned_notifs");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const togglePinNotification = (id) => {
    setPinnedNotifIds((prev) => {
      const next = new Set(prev);
      const isPinning = !next.has(id);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("titan_admin_pinned_notifs", JSON.stringify(Array.from(next)));
      } catch {}
      showToast(isPinning ? "📌 Notification pinned to top" : "Notification unpinned");
      return next;
    });
  };

  // Live aggregated notifications from all active gym system modules
  const allAdminNotifications = useMemo(() => {
    const list = [];

    // 1. Biometric Turnstile & Gate Check-Ins (Customer Attendance)
    customerAttendanceList.forEach((att, idx) => {
      list.push({
        id: `NOTIF-CHK-${att.id || att.memberId || idx}`,
        category: "checkin",
        title: `Turnstile Check-In: ${att.name || "Titan Athlete"}`,
        desc: `${att.name || "Member"} passed through ${att.gate || "Gate Alpha-1"} (${att.timeIn || "08:00 AM"}) using ${att.verification || "Biometric NFC Pass"}. Current status: ${att.status || "Active Inside"}.`,
        source: "Customer Dashboard / Biometric Gate",
        time: att.timeIn ? `Today, ${att.timeIn}` : "Today",
        meta: `${att.gate || "Alpha-1"} • ${att.plan || "PRO"}`,
        actionLabel: "View Turnstiles",
        actionTab: "attendance-monitoring",
        priority: "Normal",
        timestamp: Date.now() - idx * 1000 * 60 * 12,
      });
    });

    // 2. New Customer Registrations & Onboardings
    customersList.forEach((cust, idx) => {
      list.push({
        id: `NOTIF-ONB-${cust.userId || cust.id || idx}`,
        category: "onboarding",
        title: `New Athlete Onboarded: ${cust.name}`,
        desc: `${cust.name} onboarded with ${cust.plan || cust.membershipPlan || "PRO MEMBERSHIP"}. Assigned Coach: ${cust.assignedTrainerName || "Unassigned"}. Telemetry profile initialized.`,
        source: "Customer Registration Portal",
        time: cust.createdAt ? new Date(cust.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Recent",
        meta: `${cust.plan || "Active"} • ${cust.status || "Active"}`,
        actionLabel: "Manage Athlete",
        actionTab: "customer-mgmt",
        priority: "Normal",
        timestamp: cust.createdAt ? new Date(cust.createdAt).getTime() : Date.now() - (idx + 5) * 1000 * 60 * 30,
      });
    });

    // 3. Billing & Payment Transactions
    paymentsList.forEach((pay, idx) => {
      const invId = pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-4)}` : `INV-${idx + 101}`);
      list.push({
        id: `NOTIF-PAY-${invId}`,
        category: "payment",
        title: `Payment Settled: ₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
        desc: `Invoice ${invId} for ${pay.customer || "Athlete"} (${pay.plan || pay.planOrItem || "Membership"}) settled successfully via ${pay.method || "Online Payment"}.`,
        source: "Billing Engine / Razorpay",
        time: pay.date || "Recent",
        meta: `₹${Number(pay.amount || 0).toLocaleString("en-IN")} • ${pay.status || "Paid"}`,
        actionLabel: "View Billing",
        actionTab: "payment-billing",
        priority: "High",
        timestamp: Date.now() - idx * 1000 * 60 * 45,
      });
    });

    // 4. Trainer Floor Shifts & Client Rosters
    trainersList.forEach((t, idx) => {
      list.push({
        id: `NOTIF-TRN-${t.userId || t.id || idx}`,
        category: "trainer",
        title: `Coach On Duty: ${t.name}`,
        desc: `Master Coach ${t.name} (${t.spec || "Strength Coach"}) active on ${t.shift || "Morning Shift"} in ${t.room || "Olympic Floor"}. Clients: ${t.clients || 0}.`,
        source: "Trainer Command / Shift Logs",
        time: "Active Duty",
        meta: `${t.shift ? t.shift.split("(")[0].trim() : "Morning"} • ${t.status || "On Duty"}`,
        actionLabel: "View Trainer",
        actionTab: "trainer-mgmt",
        priority: "Normal",
        timestamp: Date.now() - (idx + 2) * 1000 * 60 * 20,
      });
    });

    // 5. Athlete Feedbacks & 5-Star Reviews
    try {
      const rawFeedbacks = localStorage.getItem("titan_global_feedbacks");
      if (rawFeedbacks) {
        const parsed = JSON.parse(rawFeedbacks);
        if (Array.isArray(parsed)) {
          parsed.forEach((fb, idx) => {
            list.push({
              id: `NOTIF-REV-${fb.id || idx}`,
              category: "review",
              title: `Athlete Review: ${fb.rating || 5}★ Rating`,
              desc: `"${fb.comment || "Outstanding training facility and coaching staff!"}" — ${fb.author || fb.name || "Titan Athlete"}`,
              source: "Customer Feedback & Reviews",
              time: fb.date || "Recent",
              meta: `${fb.rating || 5}★ • ${fb.author || "Athlete"}`,
              actionLabel: "View Members",
              actionTab: "customer-mgmt",
              priority: "Normal",
              timestamp: Date.now() - idx * 1000 * 60 * 60,
            });
          });
        }
      }
    } catch {}

    // 6. Enquiries & Prospect Leads
    enquiriesList.forEach((enq, idx) => {
      list.push({
        id: `NOTIF-ENQ-${enq.id || enq._id || idx}`,
        category: "enquiry",
        title: `New Prospect Lead: ${enq.name}`,
        desc: `Prospect lead registered for ${enq.goal || "Fitness Training"}. Contact: ${enq.phone || enq.email || "N/A"}. Status: ${enq.status || "New Lead"}.`,
        source: enq.capturedBy || enq.source || "Reception Desk",
        time: enq.date || "Recent",
        meta: `${enq.goal || "Lead"} • ${enq.status || "New"}`,
        actionLabel: "View Enquiry",
        actionTab: "enquiry-management",
        priority: "High",
        timestamp: enq.createdAt ? new Date(enq.createdAt).getTime() : Date.now() - idx * 1000 * 60 * 50,
      });
    });

    // 7. Custom Admin Broadcasts
    customBroadcasts.forEach((brd, idx) => {
      list.push({
        ...brd,
        id: brd.id || `NOTIF-BRD-${idx}`,
        category: "broadcast",
        source: brd.source || "Admin Command HQ",
        actionLabel: "View Hub",
        actionTab: "notifications",
        timestamp: brd.timestamp || Date.now() - idx * 1000 * 60,
      });
    });

    // Sort newest first & filter out dismissed
    return list
      .filter((item) => !adminDismissedNotifs.includes(item.id))
      .map((item) => ({
        ...item,
        unread: !adminReadNotifs.includes(item.id),
      }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [
    customerAttendanceList,
    customersList,
    paymentsList,
    trainersList,
    enquiriesList,
    customBroadcasts,
    adminReadNotifs,
    adminDismissedNotifs,
  ]);

  const unreadNotifsCount = useMemo(() => {
    return allAdminNotifications.filter((n) => n.unread).length;
  }, [allAdminNotifications]);

  const handleMarkAllNotifsRead = () => {
    const allIds = allAdminNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...adminReadNotifs, ...allIds]));
    setAdminReadNotifs(updated);
    try {
      localStorage.setItem("titan_admin_read_notifs", JSON.stringify(updated));
    } catch {}
    showToast("✓ All notifications marked as read!");
  };

  const handleClearAllNotifs = () => {
    const allIds = allAdminNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...adminDismissedNotifs, ...allIds]));
    setAdminDismissedNotifs(updated);
    try {
      localStorage.setItem("titan_admin_dismissed_notifs", JSON.stringify(updated));
    } catch {}
    showToast("🗑️ All notifications cleared from inbox.");
  };

  const handleDismissNotif = (id) => {
    const updated = [...adminDismissedNotifs, id];
    setAdminDismissedNotifs(updated);
    try {
      localStorage.setItem("titan_admin_dismissed_notifs", JSON.stringify(updated));
    } catch {}
    showToast("Notification dismissed");
  };

  const handleSendAdminBroadcast = (broadcastObj) => {
    const updated = [broadcastObj, ...customBroadcasts];
    setCustomBroadcasts(updated);
    try {
      localStorage.setItem("titan_admin_custom_broadcasts", JSON.stringify(updated));
    } catch {}
  };

  const handleSelectNotificationAction = (notif) => {
    if (!adminReadNotifs.includes(notif.id)) {
      const updated = [...adminReadNotifs, notif.id];
      setAdminReadNotifs(updated);
      try {
        localStorage.setItem("titan_admin_read_notifs", JSON.stringify(updated));
      } catch {}
    }
    setHeaderNotifDropdownOpen(false);
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
    }
  };

  // Save Coach Shift & Timings with live state & MongoDB persistence
  const handleSaveCoachShift = async () => {
    if (!selectedCoach) return;

    // 1. Update local trainersList immediately so Trainer Management cards reflect new shift
    setTrainersList((prev) =>
      prev.map((t) => {
        if (t.id === selectedCoach.id || t.userId === selectedCoach.userId) {
          return {
            ...t,
            shift: coachShiftForm.shift,
            room: coachShiftForm.room,
            days: coachShiftForm.days,
          };
        }
        return t;
      }),
    );

    // 2. Update current selectedCoach state
    setSelectedCoach((prev) => ({
      ...prev,
      shift: coachShiftForm.shift,
      room: coachShiftForm.room,
      days: coachShiftForm.days,
    }));

    // 3. Persist to MongoDB database
    try {
      const targetId = selectedCoach.userId || selectedCoach.id;
      await api.put(`/api/users/${targetId}/shift`, {
        shift: coachShiftForm.shift,
        room: coachShiftForm.room,
        days: coachShiftForm.days,
      });
      showToast(
        `✓ Shift timings updated to "${coachShiftForm.shift}" for Coach ${selectedCoach.name}!`,
      );
    } catch (err) {
      console.log("Error persisting coach shift to database:", err);
      showToast(`✓ Shift timings updated to "${coachShiftForm.shift}"!`);
    }
  };

  // Save Receptionist Shift & Timings with live state & MongoDB persistence
  const handleSaveReceptionistShift = async () => {
    if (!selectedReceptionist) return;

    // 1. Update local receptionistsList state immediately so cards reflect new shift
    setReceptionistsList((prev) =>
      prev.map((r) => {
        if (
          r.id === selectedReceptionist.id ||
          r.userId === selectedReceptionist.userId
        ) {
          return {
            ...r,
            shift: receptionistShiftForm.shift,
            terminal: receptionistShiftForm.terminal,
            days: receptionistShiftForm.days,
          };
        }
        return r;
      }),
    );

    // 2. Update selectedReceptionist state
    setSelectedReceptionist((prev) => ({
      ...prev,
      shift: receptionistShiftForm.shift,
      terminal: receptionistShiftForm.terminal,
      days: receptionistShiftForm.days,
    }));

    // 3. Persist to MongoDB database
    try {
      const targetId = selectedReceptionist.userId || selectedReceptionist.id;
      await api.put(`/api/users/${targetId}/shift`, {
        shift: receptionistShiftForm.shift,
        room: receptionistShiftForm.terminal,
        days: receptionistShiftForm.days,
      });
      showToast(
        `✓ Shift timings updated to "${receptionistShiftForm.shift}" for Receptionist ${selectedReceptionist.name}!`,
      );
    } catch (err) {
      console.log("Error persisting receptionist shift to database:", err);
      showToast(`✓ Shift timings updated to "${receptionistShiftForm.shift}"!`);
    }
  };

  // ========================================================
  // EDIT & DELETE STAFF (TRAINER & RECEPTIONIST) CONTROLLERS
  // ========================================================
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const handleOpenEditStaff = (staff, role) => {
    setEditingStaff({
      ...staff,
      role: role || (staff.spec ? "trainer" : "receptionist"),
      spec:
        staff.spec ||
        (role === "trainer"
          ? "Master Coach & Conditioning"
          : "Front Desk Officer"),
      shift:
        staff.shift ||
        (role === "trainer"
          ? "06:00 AM - 02:00 PM"
          : "Morning (06:00 AM - 02:00 PM)"),
      status: staff.status || (role === "trainer" ? "On Duty" : "Online"),
      phone: staff.phone === "N/A" ? "" : staff.phone,
    });
    setShowEditStaffModal(true);
  };

  const handleSaveStaffChanges = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      const targetId = editingStaff.userId || editingStaff.id;
      const payload = {
        name: editingStaff.name,
        email: editingStaff.email,
        phone: editingStaff.phone || "N/A",
        specialization: editingStaff.spec,
        shift: editingStaff.shift,
        status: editingStaff.status,
      };

      await api.put(`/api/users/${targetId}`, payload);

      if (editingStaff.role === "trainer" || editingStaff.spec) {
        setTrainersList((prev) =>
          prev.map((t) =>
            t.userId === targetId || t.id === targetId
              ? {
                  ...t,
                  name: editingStaff.name,
                  email: editingStaff.email,
                  phone: editingStaff.phone || "N/A",
                  spec: editingStaff.spec,
                  shift: editingStaff.shift,
                  status: editingStaff.status,
                }
              : t,
          ),
        );
        showToast(
          `✓ Coach "${editingStaff.name}" details updated successfully!`,
        );
      } else {
        setReceptionistsList((prev) =>
          prev.map((r) =>
            r.userId === targetId || r.id === targetId
              ? {
                  ...r,
                  name: editingStaff.name,
                  email: editingStaff.email,
                  phone: editingStaff.phone || "N/A",
                  shift: editingStaff.shift,
                  status: editingStaff.status,
                }
              : r,
          ),
        );
        showToast(
          `✓ Front Desk "${editingStaff.name}" details updated successfully!`,
        );
      }

      setShowEditStaffModal(false);
      setEditingStaff(null);
    } catch (err) {
      console.error("Error updating staff member:", err);
      showToast(
        err.response?.data?.message || "Failed to update details in database",
      );
    }
  };

  const handleOpenDeleteStaff = (staff, role) => {
    setStaffToDelete({
      ...staff,
      role: role || (staff.spec ? "trainer" : "receptionist"),
    });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const targetId = staffToDelete.userId || staffToDelete.id;
      await api.delete(`/api/users/${targetId}`);

      if (staffToDelete.role === "trainer" || staffToDelete.spec) {
        setTrainersList((prev) =>
          prev.filter((t) => t.userId !== targetId && t.id !== targetId),
        );
        showToast(`✓ Coach "${staffToDelete.name}" removed from roster.`);
      } else {
        setReceptionistsList((prev) =>
          prev.filter((r) => r.userId !== targetId && r.id !== targetId),
        );
        showToast(
          `✓ Receptionist "${staffToDelete.name}" removed from database.`,
        );
      }

      setShowDeleteConfirmModal(false);
      setStaffToDelete(null);
    } catch (err) {
      console.error("Error deleting staff member:", err);
      showToast(err.response?.data?.message || "Failed to delete staff member");
    }
  };

  // Form input temporary states for Add Modal (Role strictly: customer | trainer | receptionist | admin)
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    plan: "Titan Elite All-Access",
    price: "",
    goal: "",
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email) {
      showToast("Please fill required name and email fields");
      return;
    }

    if (modalType === "customer") {
      try {
        const res = await api.post("/api/users", {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || "",
          role: "customer",
          password: "Customer@123",
        });
        if (res.data?.status === "success") {
          showToast(`Customer "${formInputs.name}" registered in database!`);
          fetchUsers();
        } else {
          showToast(res.data?.message || "Error registering customer");
        }
      } catch (err) {
        showToast(
          err.response?.data?.message || "Error connecting to database",
        );
      }
    } else if (modalType === "trainer") {
      try {
        const res = await api.post("/api/users", {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || "",
          role: "trainer",
          password: "Trainer@123",
        });
        if (res.data?.status === "success") {
          showToast(
            `Trainer "${formInputs.name}" added to roster in database!`,
          );
          fetchUsers();
        } else {
          showToast(res.data?.message || "Error adding trainer");
        }
      } catch (err) {
        showToast(
          err.response?.data?.message || "Error connecting to database",
        );
      }
    } else if (modalType === "receptionist") {
      try {
        const res = await api.post("/api/users", {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || "",
          role: "receptionist",
          password: "Receptionist@123",
        });
        if (res.data?.status === "success") {
          showToast(
            `Receptionist "${formInputs.name}" registered in database!`,
          );
          fetchUsers();
        } else {
          showToast(res.data?.message || "Error adding receptionist");
        }
      } catch (err) {
        showToast(
          err.response?.data?.message || "Error connecting to database",
        );
      }
    } else if (modalType === "enquiry") {
      const newEnq = {
        id: `ENQ-${Date.now().toString().slice(-3)}`,
        name: formInputs.name,
        email: formInputs.email,
        phone: formInputs.phone,
        goal: formInputs.goal || "VIP Pass",
        status: "New",
        date: "2026-08-25",
      };
      setEnquiriesList([newEnq, ...enquiriesList]);
      showToast(`Enquiry lead for "${formInputs.name}" created!`);
    }

    setShowAddModal(false);
    setFormInputs({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      plan: "Titan Elite All-Access",
      price: "",
      goal: "",
    });
  };

  // ==========================================
  // PUBLIC PAGES DYNAMIC CMS STATE & CONTROLS
  // ==========================================
  const [editorData, setEditorData] = useState(cmsData);
  const [cmsActiveTab, setCmsActiveTab] = useState("hero");

  useEffect(() => {
    if (cmsData) {
      setEditorData(cmsData);
    }
  }, [cmsData]);

  const handleSaveCMS = () => {
    updateFullCMS(editorData);
    showToast("✨ Public Landing Page published live!");
  };

  const handleResetCMS = () => {
    if (
      window.confirm(
        "Reset all public landing page values to original defaults?",
      )
    ) {
      resetToDefaults();
      showToast("🔄 Public page restored to defaults.");
    }
  };

  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleImageUploadToCloudinary = async (e, productIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    setUploadingIndex(productIndex);
    showToast("☁️ Uploading photo to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64data,
            folder: "titan_supplements",
          });

          const data = res.data;
          if (data?.url) {
            const newProds = [...editorData.supplements.products];
            newProds[productIndex].image = data.url;
            const updated = {
              ...editorData,
              supplements: { ...editorData.supplements, products: newProds },
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(
              `✅ Photo for Product #${productIndex + 1} saved to Cloudinary & published live!`,
            );
          } else {
            showToast(data?.message || "Failed to upload photo to Cloudinary.");
          }
        } catch (err) {
          const msg =
            err.response?.data?.message || "Error uploading image to server.";
          showToast(msg);
        } finally {
          setUploadingIndex(null);
        }
      };
    } catch (err) {
      showToast("Error reading image file.");
      setUploadingIndex(null);
    }
  };

  // Cloudinary Upload for Bento Programs Grid
  const [uploadingProgramIndex, setUploadingProgramIndex] = useState(null);

  const handleProgramImageUploadToCloudinary = async (e, cardIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    setUploadingProgramIndex(cardIndex);
    showToast("☁️ Uploading program photo to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64data,
            folder: "titan_programs",
          });

          const data = res.data;
          if (data?.url) {
            const newCards = [...editorData.exploreEscape.cards];
            newCards[cardIndex].image = data.url;
            const updated = {
              ...editorData,
              exploreEscape: { ...editorData.exploreEscape, cards: newCards },
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(
              `✅ Photo for Program Card #${cardIndex + 1} saved to Cloudinary & published live!`,
            );
          } else {
            showToast(data?.message || "Failed to upload photo to Cloudinary.");
          }
        } catch (err) {
          const msg =
            err.response?.data?.message ||
            "Error uploading program photo to server.";
          showToast(msg);
        } finally {
          setUploadingProgramIndex(null);
        }
      };
    } catch (err) {
      showToast("Error reading image file.");
      setUploadingProgramIndex(null);
    }
  };

  // Cloudinary Upload for Global Brand Logo
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUploadToCloudinary = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    setUploadingLogo(true);
    showToast("☁️ Uploading Brand Logo to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64data,
            folder: "titan_brand_logo",
          });

          const data = res.data;
          if (data?.url) {
            const updated = {
              ...editorData,
              brand: {
                ...editorData.brand,
                logo: data.url,
              },
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(
              "✅ Brand Logo saved to Cloudinary & published live across website!",
            );
          } else {
            showToast(data?.message || "Failed to upload logo to Cloudinary.");
          }
        } catch (err) {
          const msg =
            err.response?.data?.message || "Error uploading logo to server.";
          showToast(msg);
        } finally {
          setUploadingLogo(false);
        }
      };
    } catch (err) {
      showToast("Error reading image file.");
      setUploadingLogo(false);
    }
  };

  // Cloudinary Upload for 3D Smart Equipment Steps
  const [uploadingEquipmentIndex, setUploadingEquipmentIndex] = useState(null);

  const handleEquipmentImageUploadToCloudinary = async (e, stepIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    setUploadingEquipmentIndex(stepIndex);
    showToast("☁️ Uploading equipment step photo to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64data,
            folder: "titan_equipment",
          });

          const data = res.data;
          if (data?.url) {
            const newSteps = [...editorData.equipment.steps];
            newSteps[stepIndex].image = data.url;
            const updated = {
              ...editorData,
              equipment: {
                ...editorData.equipment,
                steps: newSteps,
              },
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(
              "✅ Equipment photo uploaded to Cloudinary & published live!",
            );
          } else {
            showToast(data?.message || "Failed to upload photo to Cloudinary.");
          }
        } catch (err) {
          const msg =
            err.response?.data?.message ||
            "Error uploading equipment photo to server.";
          showToast(msg);
        } finally {
          setUploadingEquipmentIndex(null);
        }
      };
    } catch (err) {
      showToast("Error reading image file.");
      setUploadingEquipmentIndex(null);
    }
  };

  // Add Dynamic Supplement Product Card
  const handleAddSupplement = () => {
    const currentProducts = editorData?.supplements?.products || [];
    const newIndex = currentProducts.length + 1;
    const newProduct = {
      id: Date.now(),
      title: `TITAN FORMULA 0${newIndex} ULTRA`,
      badge: `0${newIndex} • ADVANCED PERFORMANCE`,
      rating: "4.95",
      image:
        "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
      description:
        "Advanced clinical performance matrix designed for sustained muscular stamina, cellular hydration, and elite athletic output.",
      flavors: ["Crimson Heat", "Atomic Punch", "Blue Frost"],
      specs: [
        "350mg Formula",
        "Clinical Grade",
        "Zero Sugar",
        "Maximum Purity",
      ],
    };

    const newProds = [...currentProducts, newProduct];
    const updated = {
      ...editorData,
      supplements: {
        ...editorData.supplements,
        products: newProds,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added New Supplement Card #${newIndex}!`);
  };

  // Remove Dynamic Supplement Product Card
  const handleRemoveSupplement = (idxToRemove) => {
    const currentProducts = editorData?.supplements?.products || [];
    if (currentProducts.length <= 1) {
      showToast("⚠️ Keep at least 1 supplement product.");
      return;
    }
    const newProds = currentProducts.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      supplements: {
        ...editorData.supplements,
        products: newProds,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast("🗑️ Supplement card removed.");
  };

  // Add Dynamic Bento Program Card
  const handleAddProgram = () => {
    const currentCards = editorData?.exploreEscape?.cards || [];
    const newIndex = currentCards.length + 1;
    const newCard = {
      key: `custom_program_${Date.now()}`,
      title: `Tactical\nProtocol 0${newIndex}`,
      category: "TITAN ARENA",
      text: "High-intensity athletic training protocol designed for peak biomechanical performance and rapid power output.",
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      variant: "overlay",
      toast: "New custom athletic program selected!",
      accent: "#FF2E4C",
    };

    const newCards = [...currentCards, newCard];
    const updated = {
      ...editorData,
      exploreEscape: {
        ...editorData.exploreEscape,
        cards: newCards,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added New Bento Program Card #${newIndex}!`);
  };

  // Remove Dynamic Bento Program Card
  const handleRemoveProgram = (idxToRemove) => {
    const currentCards = editorData?.exploreEscape?.cards || [];
    if (currentCards.length <= 1) {
      showToast("⚠️ Keep at least 1 program card.");
      return;
    }
    const newCards = currentCards.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      exploreEscape: {
        ...editorData.exploreEscape,
        cards: newCards,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast("🗑️ Bento Program card removed.");
  };

  // Add Dynamic 3D Equipment Step
  const handleAddEquipmentStep = () => {
    const currentSteps = editorData?.equipment?.steps || [];
    const newIndex = currentSteps.length + 1;
    const stepNumStr = newIndex < 10 ? `0${newIndex}` : `${newIndex}`;
    const newStep = {
      id: Date.now(),
      step: `STEP ${stepNumStr}`,
      title: `Titan Biometric Engine 0${newIndex}`,
      subtitle: "REAL-TIME SENSING",
      desc: "Advanced neural telemetry and biometric feedback loop synchronizing with your digital workout avatar.",
      image:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    };

    const newSteps = [...currentSteps, newStep];
    const updated = {
      ...editorData,
      equipment: {
        ...editorData.equipment,
        steps: newSteps,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added Equipment Step ${stepNumStr}!`);
  };

  // Remove Dynamic 3D Equipment Step
  const handleRemoveEquipmentStep = (idxToRemove) => {
    const currentSteps = editorData?.equipment?.steps || [];
    if (currentSteps.length <= 1) {
      showToast("⚠️ Keep at least 1 equipment step.");
      return;
    }
    const newSteps = currentSteps.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      equipment: {
        ...editorData.equipment,
        steps: newSteps,
      },
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast("🗑️ Equipment step removed.");
  };

  const navMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "public-pages", label: "Public Pages (CMS)", icon: Globe },
    { id: "customer-mgmt", label: "Customer Management", icon: UserCheck },
    { id: "trainer-mgmt", label: "Trainer Management", icon: Dumbbell },
    { id: "receptionist-mgmt", label: "Receptionist Mgmt", icon: UserCog },
    { id: "membership-mgmt", label: "Membership Mgmt", icon: ShieldCheck },
    { id: "payment-billing", label: "Payment & Billing", icon: CreditCard },
    {
      id: "attendance-monitoring",
      label: "Attendance Monitor",
      icon: CalendarCheck,
    },
    {
      id: "reports-analytics",
      label: "Statistics & Reports",
      icon: TrendingUp,
    },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "enquiry-management", label: "Enquiry Management", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#0A0A0D] text-white flex selection:bg-[#FF1E27] selection:text-white font-sans">
      {/* 1. DARK SLEEK SIDEBAR MATCHING SCREENSHOT THEME */}
      <aside
        data-lenis-prevent="true"
        className={`${sidebarOpen ? "w-64 sm:w-72" : "w-20"} bg-[#121217] border-r border-[#202028] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 h-screen overflow-hidden no-scrollbar shadow-2xl`}
      >
        <div>
          {/* Brand Logo Header: Dynamic Gym Brand Logo */}
          <div className="h-24 px-5 flex items-center justify-between border-b border-[#202028]">
            <div
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-3 cursor-pointer group min-w-0"
            >
              {editorData?.brand?.logo || cmsData?.brand?.logo ? (
                <div className="w-11 h-11 rounded-2xl bg-[#0B0B0E] border border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(255,30,39,0.35)] group-hover:scale-105 transition-all">
                  <img
                    src={editorData?.brand?.logo || cmsData?.brand?.logo}
                    alt="Gym Logo"
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
                    {editorData?.brand?.name ||
                      cmsData?.brand?.name ||
                      "TITAN•PULSE"}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8E98] font-mono leading-tight truncate">
                    {editorData?.brand?.subname ||
                      cmsData?.brand?.subname ||
                      "3D FITNESS SYSTEM"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gym Brand Admin Command Badge */}
          {sidebarOpen && (
            <div className="px-5 py-3.5 flex items-center gap-3 border-b border-[#1E1E26] bg-[#0E0E12]/80">
              <div className="relative shrink-0">
                {editorData?.brand?.logo || cmsData?.brand?.logo ? (
                  <div className="w-10 h-10 rounded-xl bg-[#141419] border border-[#FF1E27]/40 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(255,30,39,0.3)]">
                    <img
                      src={editorData?.brand?.logo || cmsData?.brand?.logo}
                      alt="Gym Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E27]/20 to-[#FF1E27]/5 border border-[#FF1E27]/40 flex items-center justify-center text-[#FF1E27] shadow-[0_0_12px_rgba(255,30,39,0.25)]">
                    <Shield size={18} />
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121217] shadow-[0_0_6px_#10B981]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    Admin Command
                  </span>
                  <span className="text-[9px] font-extrabold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/20 px-1.5 py-0.5 rounded">
                    HQ
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate font-mono">
                  {editorData?.brand?.name || "TITAN•PULSE"} Portal
                </span>
              </div>
            </div>
          )}

          {/* Sidebar Nav List with Left Active Highlight Bar */}
          <nav
            data-lenis-prevent="true"
            className="p-3 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto no-scrollbar"
          >
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? "text-white font-bold bg-gradient-to-r from-[#FF1E27]/25 via-[#FF1E27]/5 to-transparent border-l-4 border-[#FF1E27] pl-3"
                      : "text-[#8E8E98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                  title={item.label}
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
                    <span className="truncate">{item.label}</span>
                  )}
                  {item.id === "notifications" && unreadNotifsCount > 0 && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        isActive
                          ? "bg-[#FF1E27] text-white shadow-[0_0_8px_rgba(255,30,39,0.5)]"
                          : "bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/30"
                      }`}
                    >
                      {unreadNotifsCount > 99 ? "99+" : unreadNotifsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Log Out */}
        <div className="p-4 border-t border-[#202028] bg-[#0C0C10]">
          {/* Log Out Link */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              navigate("/");
            }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center py-2"} text-xs text-[#8E8E98] hover:text-[#FF1E27] transition-colors cursor-pointer font-medium rounded-xl hover:bg-white/5`}
            title="Log Out"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main
        data-lenis-prevent="true"
        className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen no-scrollbar bg-[#0A0A0D]"
      >
        {/* Top Header Bar Matching Screenshot */}
        <header className="h-20 px-6 sm:px-10 border-b border-[#202028] bg-[#121217]/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-[#181820] border border-white/5 text-[#8E8E98] hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeTab === "dashboard"
                ? "Dashboard"
                : navMenuItems.find((m) => m.id === activeTab)?.label ||
                  "Admin Portal"}
            </h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/5 text-xs text-slate-200 font-medium cursor-pointer hover:border-white/15 transition-all">
              <span>Today</span>
              <span className="text-[#8E8E98] text-[10px]">▼</span>
            </div>

            {/* Notification Bell with Badge & Interactive Popover */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setHeaderNotifDropdownOpen(!headerNotifDropdownOpen)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer ${
                  headerNotifDropdownOpen
                    ? "bg-[#FF1E27]/15 border-[#FF1E27]/40 text-[#FF1E27]"
                    : "bg-[#181820] border-white/5 text-slate-300 hover:text-white hover:border-white/20"
                }`}
                title="Notifications"
              >
                <Bell size={16} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF1E27] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_#FF1E27] animate-pulse">
                    {unreadNotifsCount > 99 ? "99+" : unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Interactive Dropdown Popover with Pinned List Layout & Spring Physics */}
              <AnimatePresence>
                {headerNotifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    data-lenis-prevent="true"
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#121217] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#16161D]">
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-[#FF1E27]" />
                        <span className="text-sm font-bold text-white tracking-tight">
                          Live Notifications
                        </span>
                        {unreadNotifsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/30">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {unreadNotifsCount > 0 && (
                          <button
                            onClick={handleMarkAllNotifsRead}
                            className="text-[11px] text-[#8E8E98] hover:text-white transition-colors cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setHeaderNotifDropdownOpen(false)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Close"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                      {allAdminNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <CheckCircle size={28} className="text-slate-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-400">All caught up!</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">No new notifications across dashboards.</p>
                        </div>
                      ) : (
                        <LayoutGroup id="header-notifications">
                          <motion.div layout className="flex w-full flex-col gap-1.5">
                            {/* PINNED NOTIFICATIONS SECTION */}
                            <AnimatePresence>
                              {allAdminNotifications.filter((i) => pinnedNotifIds.has(i.id)).length > 0 && (
                                <motion.div
                                  key="header-pinned-section"
                                  layout
                                  variants={headingVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="flex flex-col gap-1 pb-1 mb-1 border-b border-white/5"
                                >
                                  <motion.div
                                    layout="position"
                                    className="flex items-center justify-between px-2 pt-1 pb-0.5 text-[11px] font-bold tracking-wider uppercase text-blue-400 font-mono"
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <Pin size={11} className="-rotate-45" /> Pinned Priority ({allAdminNotifications.filter((i) => pinnedNotifIds.has(i.id)).length})
                                    </span>
                                  </motion.div>
                                  <AnimatePresence mode="popLayout">
                                    {allAdminNotifications
                                      .filter((i) => pinnedNotifIds.has(i.id))
                                      .slice(0, 4)
                                      .map((item) => (
                                        <NotificationHeaderCard
                                          key={item.id}
                                          item={item}
                                          pinned={true}
                                          onTogglePin={togglePinNotification}
                                          onSelect={() => handleSelectNotificationAction(item)}
                                        />
                                      ))}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* ALL / RECENT ITEMS SECTION */}
                            <motion.div layout className="flex flex-col gap-1">
                              {allAdminNotifications.filter((i) => pinnedNotifIds.has(i.id)).length > 0 && (
                                <motion.p
                                  layout="position"
                                  className="px-2 pt-1 pb-0.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 font-mono"
                                >
                                  Recent Alerts
                                </motion.p>
                              )}
                              <AnimatePresence mode="popLayout">
                                {allAdminNotifications
                                  .filter((i) => !pinnedNotifIds.has(i.id))
                                  .slice(0, 6)
                                  .map((item) => (
                                    <NotificationHeaderCard
                                      key={item.id}
                                      item={item}
                                      pinned={false}
                                      onTogglePin={togglePinNotification}
                                      onSelect={() => handleSelectNotificationAction(item)}
                                    />
                                  ))}
                              </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        </LayoutGroup>
                      )}
                    </div>

                    <div className="p-2.5 bg-[#14141A] border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setHeaderNotifDropdownOpen(false);
                          setActiveTab("notifications");
                        }}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#FF2E4C] hover:text-white text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Notification Command Center</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Search & Secondary Filter Bar */}
        <div className="px-6 sm:px-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <GooeySearch
            placeholder="Search telemetry, athletes, modules..."
            buttonLabel="Search"
            items={[
              { label: "Public Pages (CMS)", tab: "public-pages" },
              { label: "Customer Management", tab: "customer-mgmt" },
              { label: "Trainer Management", tab: "trainer-mgmt" },
              { label: "Receptionist Management", tab: "receptionist-mgmt" },
              { label: "Membership Management", tab: "membership-mgmt" },
              { label: "Payment & Billing", tab: "payment-billing" },
              { label: "Attendance Monitoring", tab: "attendance-monitoring" },
              { label: "Statistics & Reports", tab: "reports-analytics" },
              { label: "Notifications Control", tab: "notifications" },
              { label: "Enquiry Management", tab: "enquiry-management" },
              { label: "System Security & Settings", tab: "settings" },
              ...customersList.map((c) => ({
                label: `${c.name} (Member)`,
                tab: "customer-mgmt",
              })),
              ...trainersList.map((t) => ({
                label: `${t.name} (Coach)`,
                tab: "trainer-mgmt",
              })),
              ...receptionistsList.map((r) => ({
                label: `${r.name} (Front Desk)`,
                tab: "receptionist-mgmt",
              })),
            ]}
            onChange={(val) => setSearchQuery(val)}
            onSelect={(item) => {
              if (item?.tab) {
                setActiveTab(item.tab);
                showToast(`Opened ${item.label}`);
              }
            }}
            bgTheme="#121217"
            textColor="#FFFFFF"
            accentColor="#FF1E27"
          />

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 hover:border-[#FF1E27] transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Staff / Coach
            </button>
          </div>
        </div>

        {/* Dynamic Main Body Content based on Active Tab */}
        <div className="p-4 sm:p-8 space-y-6 flex-1 bg-[#0A0A0D]">
          {/* TAB 1: OVERVIEW DASHBOARD - GYM BUSINESS ANALYTICS & FACILITY COMMAND */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              {/* TOP ROW: 3 METRIC CARDS (Total Customers, Monthly Revenue, Gate Check-ins) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Total Active Customers Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">👥</span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        Active Customers
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                      +12.4%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {customersList.length > 0 ? customersList.length : 0}
                    </span>
                    <span className="text-xs text-[#8E8E98] font-semibold uppercase">
                      Registered Members
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Active Gym Roster</span>
                    <span className="text-emerald-400 font-medium">
                      100% MongoDB Sync
                    </span>
                  </div>
                </div>

                {/* 2. Monthly Gross Revenue Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">💳</span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        Monthly Gross Revenue
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/30 px-2 py-0.5 rounded-full">
                      Aug 2026
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      ₹1,48,500
                    </span>
                    <span className="text-xs text-[#8E8E98] font-semibold">
                      INR
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Monthly Target: ₹2,00,000</span>
                    <span className="text-[#FF1E27] font-semibold">
                      74% Target
                    </span>
                  </div>
                </div>

                {/* 3. Daily Gate Check-ins Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">⚡</span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        Gate Check-ins Today
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded-full">
                      Live Telemetry
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      142
                    </span>
                    <span className="text-xs text-[#8E8E98] font-semibold">
                      Athletes In
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Peak Floor Hours</span>
                    <span className="text-purple-400 font-medium">
                      06:00 PM – 09:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* AI AGENT WORKSPACE & SYSTEM TELEMETRY BENTO GRID */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E4C] animate-ping" />
                    <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono flex items-center gap-2">
                      <span>AI Agent Workspace</span>
                      <span className="text-[#FF2E4C]">·</span>
                      <span className="text-slate-400 font-normal text-xs">Command & Intelligence Matrix</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      5 Nodes Synchronized
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      Real-time Telemetry
                    </span>
                  </div>
                </div>
                <AgentBentoGrid />
              </div>

              {/* MAIN 2-COLUMN GRID (Revenue & Growth Analytics + Facility Operations) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ============================================================== */}
                {/* LEFT COLUMN: GYM REVENUE & MEMBER GROWTH ANALYTICS             */}
                {/* ============================================================== */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card A: Revenue & Member Growth with Glowing Spline Curve */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Revenue & Membership Growth Analytics
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Live gym monthly revenue telemetry and new member
                          registration influx.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-3.5 py-1.5 rounded-xl bg-[#FF1E27] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,30,39,0.5)] transition-all cursor-pointer">
                          <span>Monthly</span>
                          <span className="text-[10px]">▼</span>
                        </button>
                        <button
                          onClick={() => showToast("Analytics exported.")}
                          className="text-[#8E8E98] hover:text-white transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    {/* SVG Spline Wave Chart */}
                    <div className="relative w-full h-56 pt-2 overflow-hidden">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 600 200"
                        fill="none"
                      >
                        <defs>
                          {/* Crimson Neon Line Glow Filter */}
                          <filter
                            id="crimsonGlow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="3"
                              floodColor="#FF1E27"
                              floodOpacity="0.7"
                            />
                          </filter>
                          {/* Linear Gradient under Area */}
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#FF1E27"
                              stopOpacity="0.28"
                            />
                            <stop
                              offset="100%"
                              stopColor="#FF1E27"
                              stopOpacity="0.0"
                            />
                          </linearGradient>
                        </defs>

                        {/* Grid Horizontal & Vertical Lines */}
                        {[40, 75, 110, 145, 180].map((y, i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={y}
                            x2="600"
                            y2={y}
                            stroke="#20202C"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                        ))}
                        {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570].map(
                          (x, i) => (
                            <line
                              key={i}
                              x1={x}
                              y1="10"
                              x2={x}
                              y2="180"
                              stroke="#1A1A24"
                              strokeWidth="1"
                            />
                          ),
                        )}

                        {/* Area Fill */}
                        <path
                          d="M 0,155 C 30,150 60,152 90,148 C 120,144 150,158 180,155 C 210,150 240,110 270,68 C 300,38 325,125 355,120 C 385,115 415,85 445,55 C 475,25 500,85 530,80 C 560,75 580,78 600,75 L 600,180 L 0,180 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Glowing Red Spline Curve Line */}
                        <path
                          d="M 0,155 C 30,150 60,152 90,148 C 120,144 150,158 180,155 C 210,150 240,110 270,68 C 300,38 325,125 355,120 C 385,115 415,85 445,55 C 475,25 500,85 530,80 C 560,75 580,78 600,75"
                          stroke="#FF1E27"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#crimsonGlow)"
                        />

                        {/* Peak Node Point 1 (May Revenue Peak: x=270, y=68) */}
                        <circle
                          cx="270"
                          cy="68"
                          r="5"
                          fill="#FFFFFF"
                          stroke="#FF1E27"
                          strokeWidth="2.5"
                        />
                        <line
                          x1="270"
                          y1="68"
                          x2="270"
                          y2="180"
                          stroke="#FF1E27"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />

                        {/* Tooltip Badge at Peak 1 */}
                        <g transform="translate(225, 18)">
                          <rect
                            width="90"
                            height="34"
                            rx="8"
                            fill="#121217"
                            stroke="#2A2A38"
                            strokeWidth="1"
                          />
                          <text
                            x="45"
                            y="14"
                            fill="#8E8E98"
                            fontSize="9"
                            fontWeight="600"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            Peak Revenue
                          </text>
                          <text
                            x="45"
                            y="27"
                            fill="#FFFFFF"
                            fontSize="11"
                            fontWeight="800"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            ₹1,48,500
                          </text>
                        </g>

                        {/* Secondary Peak Node (Aug: x=445, y=55) */}
                        <circle
                          cx="445"
                          cy="55"
                          r="5"
                          fill="#FFFFFF"
                          stroke="#FF1E27"
                          strokeWidth="2.5"
                        />
                        <line
                          x1="445"
                          y1="55"
                          x2="445"
                          y2="180"
                          stroke="#FF1E27"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />

                        <g transform="translate(405, 12)">
                          <rect
                            width="80"
                            height="26"
                            rx="6"
                            fill="#121217"
                            stroke="#2A2A38"
                            strokeWidth="1"
                          />
                          <text
                            x="40"
                            y="17"
                            fill="#FF1E27"
                            fontSize="10"
                            fontWeight="800"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            +38 Reg.
                          </text>
                        </g>
                      </svg>

                      {/* X-Axis Month Labels */}
                      <div className="flex justify-between text-[11px] text-[#8E8E98] font-medium pt-2 px-2">
                        {[
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                        ].map((m) => (
                          <span
                            key={m}
                            className={
                              m === "May" ? "text-white font-bold" : ""
                            }
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card B: Live Facility Operations & Gate Flow */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Facility Capacity & Zone Operations
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Real-time floor capacity, equipment utilization, and
                          terminal gate status.
                        </p>
                      </div>
                      <button
                        onClick={() => showToast("Refreshed zone operations.")}
                        className="text-[#8E8E98] hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Progress Ring & Floor Summary Sub-row */}
                    <div className="flex items-center gap-4 pb-2 border-b border-[#202028]">
                      {/* Mini Radial Ring */}
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#22222E"
                            strokeWidth="3.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#FF1E27"
                            strokeWidth="3.5"
                            strokeDasharray="78, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold text-white">
                          78%
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white block">
                          Gym Floor Active Load
                        </span>
                        <span className="text-[11px] text-[#8E8E98] font-medium">
                          Optimal Capacity • All Gate Scanners Active
                        </span>
                      </div>
                    </div>

                    {/* Facility Zone 1: Main Strength Arena */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#201416] border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                            <Dumbbell size={16} />
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">
                              Main Strength Arena
                            </span>
                            <span className="text-[10px] text-[#8E8E98]">
                              42 / 50 Active Athletes
                            </span>
                          </div>
                        </div>

                        {/* Red Progress Bar */}
                        <div className="flex-1 mx-6 h-2 rounded-full bg-[#20202A] overflow-hidden">
                          <div className="h-full w-[84%] bg-[#FF1E27] rounded-full shadow-[0_0_8px_#FF1E27]" />
                        </div>

                        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                          84% Load <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Facility Zone 2: Cardio & HIIT Deck */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#201416] border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Activity size={16} />
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">
                              Cardio & Telemetry Deck
                            </span>
                            <span className="text-[10px] text-[#8E8E98]">
                              26 / 40 Stations In Use
                            </span>
                          </div>
                        </div>

                        {/* Purple Progress Bar */}
                        <div className="flex-1 mx-6 h-2 rounded-full bg-[#20202A] overflow-hidden">
                          <div className="h-full w-[65%] bg-purple-500 rounded-full shadow-[0_0_8px_#8B5CF6]" />
                        </div>

                        <span className="text-[11px] text-purple-400 font-mono flex items-center gap-1">
                          65% Load <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Facility Zone 3: Biometric Gates & Front Desk */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#201416] border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <ShieldCheck size={16} />
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">
                              Gate Terminal A1 & B2
                            </span>
                            <span className="text-[10px] text-[#8E8E98]">
                              RFID / QR Scanner Normal
                            </span>
                          </div>
                        </div>

                        {/* Amber Progress Bar */}
                        <div className="flex-1 mx-6 h-2 rounded-full bg-[#20202A] overflow-hidden">
                          <div className="h-full w-[95%] bg-amber-500 rounded-full shadow-[0_0_8px_#F59E0B]" />
                        </div>

                        <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                          Online <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* RIGHT COLUMN: MEMBERSHIP TIER DISTRIBUTION & REVENUE STREAMS  */}
                {/* ============================================================== */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card C: Membership Tier Distribution (Big Circular Ring) */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Membership Tier Share
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Plan distribution ratio
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          showToast("Membership breakdown updated.")
                        }
                        className="text-[#8E8E98] hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Big Circular Progress Ring */}
                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        {/* Background Dark Track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#1E1E26"
                          strokeWidth="8"
                        />
                        {/* Glowing Red Progress Arc */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#FF1E27"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset="50.24"
                          strokeLinecap="round"
                          filter="drop-shadow(0 0 10px rgba(255,30,39,0.7))"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                          80%
                        </span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8E98]">
                          Premium Tiers
                        </span>
                      </div>
                    </div>

                    {/* Legend Below Ring */}
                    <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-300 pt-3 border-t border-[#202028]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] shadow-[0_0_6px_#FF1E27]" />
                          <span>Titan Elite All-Access</span>
                        </div>
                        <span className="text-white font-mono font-bold">
                          52%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8B5CF6]" />
                          <span>3D Pro Telemetry Pass</span>
                        </div>
                        <span className="text-white font-mono font-bold">
                          28%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" />
                          <span>Standard Fit Arena</span>
                        </div>
                        <span className="text-white font-mono font-bold">
                          20%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card D: Revenue Stream Breakdown with mini Spline Chart */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Weekly Revenue Streams
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Recurring revenue channels
                        </p>
                      </div>
                      <button
                        onClick={() => showToast("Weekly report synced.")}
                        className="text-[#8E8E98] hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        ₹48,250
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        +8.5% This Week
                      </span>
                    </div>

                    {/* Mini Spline Wave Chart */}
                    <div className="relative w-full h-32 pt-1 overflow-hidden">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 300 100"
                        fill="none"
                      >
                        {/* Grid lines */}
                        {[25, 55, 85].map((y, i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={y}
                            x2="300"
                            y2={y}
                            stroke="#1E1E28"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                        ))}

                        {/* Spline Path */}
                        <path
                          d="M 0,78 C 35,76 70,82 105,75 C 140,68 180,45 220,32 C 245,24 275,60 300,55"
                          stroke="#FF1E27"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                          filter="drop-shadow(0 0 6px rgba(255,30,39,0.7))"
                        />

                        {/* Peak node */}
                        <circle
                          cx="220"
                          cy="32"
                          r="4"
                          fill="#FFFFFF"
                          stroke="#FF1E27"
                          strokeWidth="2"
                        />
                        <line
                          x1="220"
                          y1="32"
                          x2="220"
                          y2="85"
                          stroke="#FF1E27"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />

                        {/* Floating Tooltip */}
                        <g transform="translate(180, 2)">
                          <rect
                            width="80"
                            height="24"
                            rx="6"
                            fill="#121217"
                            stroke="#2A2A38"
                            strokeWidth="1"
                          />
                          <text
                            x="40"
                            y="10"
                            fill="#8E8E98"
                            fontSize="7"
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            Top Revenue
                          </text>
                          <text
                            x="40"
                            y="20"
                            fill="#FFFFFF"
                            fontSize="9"
                            fontWeight="800"
                            textAnchor="middle"
                          >
                            ₹28,500
                          </text>
                        </g>
                      </svg>

                      {/* X-Axis categories */}
                      <div className="flex justify-between text-[10px] text-[#8E8E98] font-medium pt-1 px-1">
                        {[
                          "Memberships",
                          "PT Coaches",
                          "Telemetry",
                          "Recovery",
                        ].map((cat) => (
                          <span key={cat}>{cat}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PUBLIC PAGES (CMS / DYNAMIC LANDING PAGE EDITOR) */}
          {activeTab === "public-pages" && (
            <div className="space-y-8 animate-fadeIn pb-24 max-w-7xl mx-auto">
              {/* 1. Header & Global Publish Actions Card */}
              <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF1E27] to-[#FF526B] p-[1.5px] flex items-center justify-center shadow-[0_0_20px_rgba(255,30,39,0.35)] shrink-0">
                    <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center text-[#FF1E27]">
                      <Globe size={24} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                      Public Pages CMS
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 size={12} /> Live Sync Active
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                      Dynamically customize, upload photos to Cloudinary, and
                      instantly publish landing page components.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <Link
                    to="/"
                    className="px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2A2A38] hover:border-[#FF1E27] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Eye size={15} className="text-[#FF1E27]" /> Live Preview
                  </Link>

                  <button
                    onClick={handleResetCMS}
                    className="px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2A2A38] hover:border-amber-500 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <RotateCcw size={15} className="text-amber-400" /> Reset
                    Defaults
                  </button>

                  <button
                    onClick={handleSaveCMS}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#D60A13] hover:brightness-110 text-white font-extrabold text-xs flex items-center gap-2.5 shadow-[0_0_20px_rgba(255,30,39,0.45)] transition-all cursor-pointer"
                  >
                    <Save size={16} /> Save & Publish Live
                  </button>
                </div>
              </div>

              {/* 2. CMS Sub-Tab Navigator Pill Bar */}
              <div className="flex flex-wrap gap-2.5 p-2 rounded-2xl bg-[#121218] border border-[#20202C] shadow-lg">
                {[
                  { id: "hero", label: "1. Hero & Branding", icon: Sparkles },
                  { id: "words", label: "2. Kinetic Words", icon: Type },
                  {
                    id: "explore",
                    label: "3. Programs Bento Grid",
                    icon: Layers,
                  },
                  {
                    id: "supplements",
                    label: "4. Supplements Showcase",
                    icon: Dumbbell,
                    count: editorData?.supplements?.products?.length || 0,
                  },
                  {
                    id: "equipment",
                    label: "5. 3D Smart Equipment",
                    icon: Sliders,
                  },
                  {
                    id: "footer",
                    label: "6. Footer & Brand Info",
                    icon: Globe,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCmsActiveTab(tab.id)}
                    className={`px-4 sm:px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      cmsActiveTab === tab.id
                        ? "bg-[#FF1E27] text-white shadow-[0_0_16px_rgba(255,30,39,0.4)]"
                        : "text-[#8E8E98] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <tab.icon size={15} /> {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${cmsActiveTab === tab.id ? "bg-white text-[#FF1E27]" : "bg-[#22222E] text-slate-300"}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ========================================================================= */}
              {/* 1. HERO & BRANDING SECTION CMS */}
              {/* ========================================================================= */}
              {cmsActiveTab === "hero" && (
                <div className="space-y-8">
                  {/* Card 1: Brand Meta Details & Cloudinary Logo Studio */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={16} className="text-[#FF1E27]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          Global Brand Identity & Logo
                        </h3>
                      </div>
                      {editorData?.brand?.logo?.includes("cloudinary") && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Cloudinary Logo Active
                        </span>
                      )}
                    </div>

                    {/* Cloudinary Brand Logo Upload Section */}
                    <div className="p-4 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-3.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Camera size={14} className="text-[#FF1E27]" /> Brand
                        Logo Graphic (Cloudinary CDN)
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Live Logo Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-[#0E0E12] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative group p-2">
                          {editorData?.brand?.logo ? (
                            <img
                              src={editorData.brand.logo}
                              alt={editorData?.brand?.name || "Brand Logo"}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white font-black text-xl">
                              T
                            </div>
                          )}
                        </div>

                        {/* Upload Controls & Direct URL */}
                        <div className="flex-1 w-full space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <label
                              className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                                uploadingLogo
                                  ? "bg-amber-500 animate-pulse text-black"
                                  : "bg-[#FF1E27] hover:brightness-110"
                              }`}
                            >
                              {uploadingLogo ? (
                                <>
                                  <RefreshCw
                                    size={13}
                                    className="animate-spin"
                                  />{" "}
                                  Uploading Logo...
                                </>
                              ) : (
                                <>
                                  <UploadCloud size={14} /> Upload Brand Logo to
                                  Cloudinary
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingLogo}
                                onChange={handleLogoUploadToCloudinary}
                                className="hidden"
                              />
                            </label>

                            <span className="text-[10px] text-slate-400 font-medium">
                              PNG (transparent), SVG, JPG, WEBP
                            </span>
                          </div>

                          <input
                            type="text"
                            placeholder="https://res.cloudinary.com/... (Direct Logo Image URL)"
                            value={editorData?.brand?.logo || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                brand: {
                                  ...editorData.brand,
                                  logo: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg bg-[#121217] border border-[#282834] text-white text-[11px] outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand Name, Sub-Headline, and Tagline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Brand Logo Name
                        </label>
                        <input
                          type="text"
                          value={editorData?.brand?.name || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              brand: {
                                ...editorData.brand,
                                name: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Brand Sub-Headline
                        </label>
                        <input
                          type="text"
                          value={editorData?.brand?.subname || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              brand: {
                                ...editorData.brand,
                                subname: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Brand Motto / Slogan
                        </label>
                        <input
                          type="text"
                          value={editorData?.brand?.tagline || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              brand: {
                                ...editorData.brand,
                                tagline: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Main Hero Headlines & Copy */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <Type size={16} className="text-[#FF1E27]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Hero Main Headlines & Action CTA
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Headline Word 1 (Kinetic)
                        </label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlinePart1 || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              hero: {
                                ...editorData.hero,
                                headlinePart1: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Headline Word 2 (Hover Split)
                        </label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlinePart2 || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              hero: {
                                ...editorData.hero,
                                headlinePart2: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Hover Reveal Tagline
                        </label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlineHoverText || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              hero: {
                                ...editorData.hero,
                                headlineHoverText: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Hero Narrative & Description
                        </label>
                        <textarea
                          rows="3"
                          value={editorData?.hero?.description || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              hero: {
                                ...editorData.hero,
                                description: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all resize-none shadow-inner leading-relaxed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Primary CTA Button
                        </label>
                        <input
                          type="text"
                          value={editorData?.hero?.ctaButtonText || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              hero: {
                                ...editorData.hero,
                                ctaButtonText: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: 3x Hero Statistics Cards */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <TrendingUp size={16} className="text-[#FF1E27]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        3x Live Hero Statistics Metric Counters
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Stat 1 */}
                      <div className="p-5 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-4 shadow-md">
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">
                          Metric 01: Members
                        </span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Counter Number
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.membersCount || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  membersCount: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Label Description
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.membersLabel || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  membersLabel: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>

                      {/* Stat 2 */}
                      <div className="p-5 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-4 shadow-md">
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">
                          Metric 02: Results
                        </span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Counter Number
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.transformationsCount || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  transformationsCount: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Label Description
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.transformationsLabel || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  transformationsLabel: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>

                      {/* Stat 3 */}
                      <div className="p-5 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-4 shadow-md">
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">
                          Metric 03: Hours
                        </span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Counter Number
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.hoursCount || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  hoursCount: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">
                            Label Description
                          </label>
                          <input
                            type="text"
                            value={editorData?.hero?.hoursLabel || ""}
                            onChange={(e) =>
                              setEditorData({
                                ...editorData,
                                hero: {
                                  ...editorData.hero,
                                  hoursLabel: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. KINETIC HORIZONTAL WORDS CMS */}
              {/* ========================================================================= */}
              {cmsActiveTab === "words" && (
                <div className="space-y-8">
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <Type size={16} className="text-[#FF1E27]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Giant Pinned Kinetic Headline
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Sentence (Kinetic Marquee Pinned in Viewport)
                      </label>
                      <input
                        type="text"
                        value={editorData?.horizontalWords?.sentence || ""}
                        onChange={(e) =>
                          setEditorData({
                            ...editorData,
                            horizontalWords: {
                              ...editorData.horizontalWords,
                              sentence: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-sm uppercase font-bold tracking-wider outline-none focus:border-[#FF1E27] shadow-inner"
                      />
                      <p className="text-[11px] text-slate-400">
                        Default: PAIN IS TEMPORARY GLORY IS FOREVER
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Motivational Sub-paragraph & Manifesto
                      </label>
                      <textarea
                        rows="4"
                        value={editorData?.horizontalWords?.bottomText || ""}
                        onChange={(e) =>
                          setEditorData({
                            ...editorData,
                            horizontalWords: {
                              ...editorData.horizontalWords,
                              bottomText: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] resize-none leading-relaxed shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 3. PROGRAMS BENTO GRID CMS (Sleek, Clean, Modern UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === "explore" && (
                <div className="space-y-8">
                  {/* Header Card with + Add Button */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-white/[0.08] shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF1E27]/20 to-[#FF526B]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                          <Layers size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            Explore Programs
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Manage interactive cards displayed on the 3D bento
                            grid.
                          </p>
                        </div>
                      </div>

                      {/* + Add New Program Button */}
                      <button
                        onClick={handleAddProgram}
                        className="px-4 py-2 rounded-xl bg-[#FF1E27] hover:bg-[#E00F18] text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,30,39,0.35)] transition-all cursor-pointer shrink-0"
                      >
                        <Plus size={15} /> Add New Program
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Top Tagline
                        </label>
                        <input
                          type="text"
                          value={editorData?.exploreEscape?.tagline || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              exploreEscape: {
                                ...editorData.exploreEscape,
                                tagline: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Main Heading
                        </label>
                        <input
                          type="text"
                          value={editorData?.exploreEscape?.headingMain || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              exploreEscape: {
                                ...editorData.exploreEscape,
                                headingMain: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Highlighted Text
                        </label>
                        <input
                          type="text"
                          value={
                            editorData?.exploreEscape?.headingHighlight || ""
                          }
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              exploreEscape: {
                                ...editorData.exploreEscape,
                                headingHighlight: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Program Cards in 2-Column Responsive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(editorData?.exploreEscape?.cards || []).map(
                      (card, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200"
                        >
                          {/* Minimal Sleek Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                              <span className="text-xs font-bold text-white tracking-wide">
                                Program 0{idx + 1}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                {card.category || "PROGRAM"}
                              </span>
                            </div>

                            {/* Minimal Delete Icon Button */}
                            <button
                              onClick={() => handleRemoveProgram(idx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                              title="Delete Program Card"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Title & Category Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-medium text-slate-400 block">
                                Card Title
                              </label>
                              <input
                                type="text"
                                value={
                                  card.title
                                    ? card.title.replace("\n", " ")
                                    : ""
                                }
                                onChange={(e) => {
                                  const newCards = [
                                    ...editorData.exploreEscape.cards,
                                  ];
                                  newCards[idx].title = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    exploreEscape: {
                                      ...editorData.exploreEscape,
                                      cards: newCards,
                                    },
                                  });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-medium text-slate-400 block">
                                Category Tag
                              </label>
                              <input
                                type="text"
                                value={card.category}
                                onChange={(e) => {
                                  const newCards = [
                                    ...editorData.exploreEscape.cards,
                                  ];
                                  newCards[idx].category = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    exploreEscape: {
                                      ...editorData.exploreEscape,
                                      cards: newCards,
                                    },
                                  });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">
                              Program Description
                            </label>
                            <textarea
                              rows="2"
                              value={card.text}
                              onChange={(e) => {
                                const newCards = [
                                  ...editorData.exploreEscape.cards,
                                ];
                                newCards[idx].text = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  exploreEscape: {
                                    ...editorData.exploreEscape,
                                    cards: newCards,
                                  },
                                });
                              }}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none resize-none leading-relaxed transition-all"
                            />
                          </div>

                          {/* Sleek Photo Section */}
                          <div className="p-3.5 rounded-xl bg-[#0F0F14] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-3.5">
                            {/* Live Thumbnail */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#09090D] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0 relative group">
                              {card.image ? (
                                <img
                                  src={card.image}
                                  alt={card.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Image size={20} className="text-slate-600" />
                              )}
                            </div>

                            {/* Upload Actions & URL */}
                            <div className="flex-1 w-full space-y-2">
                              <div className="flex items-center justify-between">
                                <label
                                  className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                    uploadingProgramIndex === idx
                                      ? "bg-amber-500 text-black animate-pulse"
                                      : "bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent"
                                  }`}
                                >
                                  {uploadingProgramIndex === idx ? (
                                    <>
                                      <RefreshCw
                                        size={12}
                                        className="animate-spin"
                                      />{" "}
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <UploadCloud size={13} /> Upload Photo
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingProgramIndex === idx}
                                    onChange={(e) =>
                                      handleProgramImageUploadToCloudinary(
                                        e,
                                        idx,
                                      )
                                    }
                                    className="hidden"
                                  />
                                </label>

                                {card.image?.includes("cloudinary") && (
                                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Cloudinary
                                  </span>
                                )}
                              </div>

                              <input
                                type="text"
                                placeholder="Image CDN Link..."
                                value={card.image || ""}
                                onChange={(e) => {
                                  const newCards = [
                                    ...editorData.exploreEscape.cards,
                                  ];
                                  newCards[idx].image = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    exploreEscape: {
                                      ...editorData.exploreEscape,
                                      cards: newCards,
                                    },
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-slate-300 text-[11px] font-mono outline-none focus:border-[#FF1E27]"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4. SUPPLEMENTS MATRIX CMS (Sleek, Clean, Modern UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === "supplements" && (
                <div className="space-y-8">
                  {/* Header & Add Button Card */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-white/[0.08] shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF1E27]/20 to-[#FF526B]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                          <Dumbbell size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            Supplement Showcase
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Manage showcase products and formula specifications.
                          </p>
                        </div>
                      </div>

                      {/* + Add New Supplement Button */}
                      <button
                        onClick={handleAddSupplement}
                        className="px-4 py-2 rounded-xl bg-[#FF1E27] hover:bg-[#E00F18] text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,30,39,0.35)] transition-all cursor-pointer shrink-0"
                      >
                        <Plus size={15} /> Add New Supplement
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={editorData?.supplements?.title || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              supplements: {
                                ...editorData.supplements,
                                title: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={editorData?.supplements?.subtitle || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              supplements: {
                                ...editorData.supplements,
                                subtitle: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Grid for Supplement Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {(editorData?.supplements?.products || []).map(
                      (prod, idx) => (
                        <div
                          key={prod.id || idx}
                          className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200"
                        >
                          {/* Minimal Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                              <span className="text-xs font-bold text-white tracking-wide">
                                Product 0{idx + 1}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[160px]">
                                {prod.badge || "FORMULA"}
                              </span>
                            </div>

                            <button
                              onClick={() => handleRemoveSupplement(idx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Titles & Badge */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                            <div className="sm:col-span-6 space-y-1.5">
                              <label className="text-[11px] font-medium text-slate-400 block">
                                Product Title
                              </label>
                              <input
                                type="text"
                                value={prod.title}
                                onChange={(e) => {
                                  const newProds = [
                                    ...editorData.supplements.products,
                                  ];
                                  newProds[idx].title = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    supplements: {
                                      ...editorData.supplements,
                                      products: newProds,
                                    },
                                  });
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1.5">
                              <label className="text-[11px] font-medium text-slate-400 block">
                                Badge Tag
                              </label>
                              <input
                                type="text"
                                value={prod.badge}
                                onChange={(e) => {
                                  const newProds = [
                                    ...editorData.supplements.products,
                                  ];
                                  newProds[idx].badge = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    supplements: {
                                      ...editorData.supplements,
                                      products: newProds,
                                    },
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1.5">
                              <label className="text-[11px] font-medium text-slate-400 block">
                                Rating
                              </label>
                              <input
                                type="text"
                                value={prod.rating}
                                onChange={(e) => {
                                  const newProds = [
                                    ...editorData.supplements.products,
                                  ];
                                  newProds[idx].rating = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    supplements: {
                                      ...editorData.supplements,
                                      products: newProds,
                                    },
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">
                              Formula Description
                            </label>
                            <textarea
                              rows="2"
                              value={prod.description}
                              onChange={(e) => {
                                const newProds = [
                                  ...editorData.supplements.products,
                                ];
                                newProds[idx].description = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  supplements: {
                                    ...editorData.supplements,
                                    products: newProds,
                                  },
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none resize-none leading-relaxed transition-all"
                            />
                          </div>

                          {/* Sleek Photo Section */}
                          <div className="p-3.5 rounded-xl bg-[#0F0F14] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-3.5">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#09090D] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0 relative group">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Image size={20} className="text-slate-600" />
                              )}
                            </div>

                            <div className="flex-1 w-full space-y-2">
                              <div className="flex items-center justify-between">
                                <label
                                  className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                    uploadingIndex === idx
                                      ? "bg-amber-500 text-black animate-pulse"
                                      : "bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent"
                                  }`}
                                >
                                  {uploadingIndex === idx ? (
                                    <>
                                      <RefreshCw
                                        size={12}
                                        className="animate-spin"
                                      />{" "}
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <UploadCloud size={13} /> Upload Photo
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingIndex === idx}
                                    onChange={(e) =>
                                      handleImageUploadToCloudinary(e, idx)
                                    }
                                    className="hidden"
                                  />
                                </label>

                                {prod.image?.includes("cloudinary") && (
                                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Cloudinary
                                  </span>
                                )}
                              </div>

                              <input
                                type="text"
                                placeholder="Image CDN Link..."
                                value={prod.image || ""}
                                onChange={(e) => {
                                  const newProds = [
                                    ...editorData.supplements.products,
                                  ];
                                  newProds[idx].image = e.target.value;
                                  setEditorData({
                                    ...editorData,
                                    supplements: {
                                      ...editorData.supplements,
                                      products: newProds,
                                    },
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-slate-300 text-[11px] font-mono outline-none focus:border-[#FF1E27]"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 5. 3D SMART EQUIPMENT ENGINE CMS (Sleek, Clean UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === "equipment" && (
                <div className="space-y-8">
                  {/* Header Card with + Add Button */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-white/[0.08] shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF1E27]/20 to-[#FF526B]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                          <Sliders size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            3D Smart Equipment Engine
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Manage interactive steps shown on the 3D equipment
                            deck.
                          </p>
                        </div>
                      </div>

                      {/* + Add New Step Button */}
                      <button
                        onClick={handleAddEquipmentStep}
                        className="px-4 py-2 rounded-xl bg-[#FF1E27] hover:bg-[#E00F18] text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,30,39,0.35)] transition-all cursor-pointer shrink-0"
                      >
                        <Plus size={15} /> Add New Step
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Top Tagline
                        </label>
                        <input
                          type="text"
                          value={editorData?.equipment?.tagline || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              equipment: {
                                ...editorData.equipment,
                                tagline: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={editorData?.equipment?.title || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              equipment: {
                                ...editorData.equipment,
                                title: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Grid for Steps */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(editorData?.equipment?.steps || []).map((step, idx) => (
                      <div
                        key={step.id || idx}
                        className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200"
                      >
                        {/* Minimal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                            <span className="text-xs font-bold text-white tracking-wide">
                              {step.step || `STEP 0${idx + 1}`}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {step.subtitle || "STEP"}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemoveEquipmentStep(idx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete Step"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">
                              Step Title
                            </label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [
                                  ...editorData.equipment.steps,
                                ];
                                newSteps[idx].title = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: {
                                    ...editorData.equipment,
                                    steps: newSteps,
                                  },
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">
                              Step Subtitle
                            </label>
                            <input
                              type="text"
                              value={step.subtitle}
                              onChange={(e) => {
                                const newSteps = [
                                  ...editorData.equipment.steps,
                                ];
                                newSteps[idx].subtitle = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: {
                                    ...editorData.equipment,
                                    steps: newSteps,
                                  },
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-400 block">
                            Description
                          </label>
                          <textarea
                            rows="2"
                            value={step.desc}
                            onChange={(e) => {
                              const newSteps = [...editorData.equipment.steps];
                              newSteps[idx].desc = e.target.value;
                              setEditorData({
                                ...editorData,
                                equipment: {
                                  ...editorData.equipment,
                                  steps: newSteps,
                                },
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none resize-none leading-relaxed transition-all"
                          />
                        </div>

                        {/* Sleek Cloudinary Photo Section */}
                        <div className="p-3.5 rounded-xl bg-[#0F0F14] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-3.5">
                          {/* Live Thumbnail */}
                          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#09090D] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0 relative group">
                            {step.image ? (
                              <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Image size={20} className="text-slate-600" />
                            )}
                          </div>

                          {/* Upload Actions & URL */}
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <label
                                className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                  uploadingEquipmentIndex === idx
                                    ? "bg-amber-500 text-black animate-pulse"
                                    : "bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent"
                                }`}
                              >
                                {uploadingEquipmentIndex === idx ? (
                                  <>
                                    <RefreshCw
                                      size={12}
                                      className="animate-spin"
                                    />{" "}
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud size={13} /> Upload Photo
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingEquipmentIndex === idx}
                                  onChange={(e) =>
                                    handleEquipmentImageUploadToCloudinary(
                                      e,
                                      idx,
                                    )
                                  }
                                  className="hidden"
                                />
                              </label>

                              {step.image?.includes("cloudinary") && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cloudinary
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="Image CDN Link..."
                              value={step.image || ""}
                              onChange={(e) => {
                                const newSteps = [
                                  ...editorData.equipment.steps,
                                ];
                                newSteps[idx].image = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: {
                                    ...editorData.equipment,
                                    steps: newSteps,
                                  },
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-slate-300 text-[11px] font-mono outline-none focus:border-[#FF1E27]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 6. FOOTER & CONTACT CMS */}
              {/* ========================================================================= */}
              {cmsActiveTab === "footer" && (
                <div className="space-y-8">
                  {/* Brand Mission & Copyright Card */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <Globe size={16} className="text-[#FF1E27]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Footer Mission Statement & Copyright
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Brand Mission / Quote
                        </label>
                        <input
                          type="text"
                          value={editorData?.footer?.brandQuote || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                brandQuote: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Copyright Statement
                        </label>
                        <input
                          type="text"
                          value={editorData?.footer?.copyright || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                copyright: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Matrix Card */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#22222E] shadow-xl space-y-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                      <Smartphone size={16} className="text-[#FF1E27]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Public Contact Matrix
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Contact Email
                        </label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactEmail || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                contactEmail: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactPhone || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                contactPhone: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          HQ Physical Address
                        </label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactAddress || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                contactAddress: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Profiles Card */}
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-white/[0.08] shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF1E27]/20 to-[#FF526B]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                        <Globe size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          Social Media Profile Links
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Links open automatically when visitors click on the
                          footer social icons.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#E1306C] font-bold">●</span>{" "}
                          Instagram Profile URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/yourhandle"
                          value={editorData?.footer?.socials?.instagram || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                socials: {
                                  ...(editorData.footer?.socials || {}),
                                  instagram: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#FF0000] font-bold">●</span>{" "}
                          YouTube Channel URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/@yourchannel"
                          value={editorData?.footer?.socials?.youtube || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                socials: {
                                  ...(editorData.footer?.socials || {}),
                                  youtube: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-white font-bold">●</span> X /
                          Twitter URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://twitter.com/yourhandle"
                          value={editorData?.footer?.socials?.twitter || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                socials: {
                                  ...(editorData.footer?.socials || {}),
                                  twitter: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#1877F2] font-bold">●</span>{" "}
                          Facebook Page URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/yourpage"
                          value={editorData?.footer?.socials?.facebook || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                socials: {
                                  ...(editorData.footer?.socials || {}),
                                  facebook: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#0A66C2] font-bold">●</span>{" "}
                          LinkedIn URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/company/yourhandle"
                          value={editorData?.footer?.socials?.linkedin || ""}
                          onChange={(e) =>
                            setEditorData({
                              ...editorData,
                              footer: {
                                ...editorData.footer,
                                socials: {
                                  ...(editorData.footer?.socials || {}),
                                  linkedin: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CUSTOMER MANAGEMENT */}
          {activeTab === "customer-mgmt" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Customer Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click on any customer to view full profile details, active
                    membership, payment logs, and assigned coaches.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalType("customer");
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <UserPlus size={15} /> + Register New Customer
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
                        <th className="p-4">Assigned Coach</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {customersList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="p-8 text-center text-slate-400"
                          >
                            No registered customers found in database. Click
                            "Register New Customer" to add.
                          </td>
                        </tr>
                      ) : (
                        customersList
                          .filter(
                            (c) =>
                              c.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              c.email
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              c.id
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                          )
                          .map((c) => (
                            <tr
                              key={c.id || c.userId}
                              onClick={() => handleSelectCustomer(c)}
                              className="hover:bg-white/[0.06] transition-all cursor-pointer group"
                            >
                              <td className="p-4 font-mono text-[#00F0FF] text-[11px] font-semibold whitespace-nowrap">
                                <span className="group-hover:underline flex items-center gap-1.5">
                                  {c.id}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-white">
                                <div className="flex items-center gap-3">
                                  {c.avatar ? (
                                    <img
                                      src={c.avatar}
                                      alt={c.name}
                                      className="w-9 h-9 rounded-xl object-cover border border-white/10 shadow-sm"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1E27] to-[#B30D14] text-white font-black text-xs flex items-center justify-center shadow-md">
                                      {c.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-white font-bold group-hover:text-[#FF2E4C] transition-colors block">
                                      {c.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {c.gender ? c.gender : "Member"}{c.dob ? ` • ${c.dob}` : ""}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-slate-400">
                                <div className="text-slate-300">{c.email}</div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {c.phone}
                                </div>
                              </td>
                              <td className="p-4">
                                {c.plan === "No Active Plan" ? (
                                  <span className="text-slate-500 font-mono text-xs italic">
                                    No Active Plan
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] font-semibold text-xs whitespace-nowrap">
                                    {c.plan}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                                {c.expiry}
                              </td>
                              <td className="p-4">
                                {c.assignedTrainerName ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 font-semibold text-[11px] flex items-center gap-1.5 w-fit">
                                    <Dumbbell size={12} className="text-purple-400" />
                                    {c.assignedTrainerName}
                                  </span>
                                ) : (
                                  <span className="text-slate-500 font-mono text-[11px] italic">
                                    Unassigned
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                                    c.status === "Active"
                                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                                      : c.status === "Due Soon"
                                        ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                                        : "bg-slate-800/80 text-slate-400 border border-slate-700"
                                  }`}
                                >
                                  ● {c.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectCustomer(c);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#FF2E4C] hover:brightness-110 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-md shadow-[#FF2E4C]/20"
                                  title="View Full Customer Details"
                                >
                                  <Eye size={13} /> View Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(c);
                                    handleOpenCustomerPlanModal();
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 text-slate-300 text-xs font-medium hover:border-[#FF2E4C] hover:text-white transition-all"
                                >
                                  Extend Pass
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

          {/* TAB: DEDICATED CUSTOMER DETAILS PAGE */}
          {activeTab === "customer-details" && selectedCustomer && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Top Navigation & Breadcrumbs Bar */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("customer-mgmt")}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Customer Management
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                        <span>Admin Portal</span>
                        <span>/</span>
                        <span>Customer Management</span>
                        <span>/</span>
                        <span className="text-[#00F0FF] font-semibold">{selectedCustomer.id}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                        <span>{selectedCustomer.name}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-normal ${
                            selectedCustomer.status === "Active"
                              ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800"
                              : selectedCustomer.status === "Due Soon"
                                ? "bg-amber-950/70 text-amber-400 border border-amber-800"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          ● {selectedCustomer.status || "Active"}
                        </span>
                      </h2>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleOpenEditCustomer(selectedCustomer)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit size={14} className="text-blue-400" /> Edit Profile
                    </button>
                    <button
                      onClick={handleOpenCustomerPlanModal}
                      className="px-3.5 py-2 rounded-xl bg-[#FF2E4C]/15 hover:bg-[#FF2E4C]/25 border border-[#FF2E4C]/40 text-[#FF2E4C] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck size={14} /> Change Plan
                    </button>
                    <button
                      onClick={() => {
                        setCustomerAssignTrainerForm({
                          trainerId: selectedCustomer.assignedTrainer || "",
                          trainerName: selectedCustomer.assignedTrainerName || "",
                        });
                        setShowCustomerAssignTrainerModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-950/60 border border-purple-700/40 text-purple-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Dumbbell size={14} /> Assign Coach
                    </button>
                    <button
                      onClick={() => setShowCustomerDeleteModal(true)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Athlete Identity Card & 4x Summary KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-white/5">
                  {/* Left Column: Avatar & Contact Overview (5 Columns) */}
                  <div className="md:col-span-5 flex items-center gap-4 p-4 rounded-2xl bg-[#090C0E] border border-white/5">
                    {selectedCustomer.avatar ? (
                      <img
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF1E27] to-[#B30D14] text-white font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,30,39,0.4)] shrink-0">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white truncate">
                          {selectedCustomer.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-[#00F0FF]">
                          {selectedCustomer.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 truncate flex items-center gap-1.5 font-mono">
                        <Mail size={12} className="text-[#FF2E4C]" /> {selectedCustomer.email}
                      </p>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-mono">
                        <Phone size={12} className="text-emerald-400" /> {selectedCustomer.phone || "+91 98765 43210"}
                      </p>
                    </div>
                  </div>

                  {/* Right Columns: 3x Key Telemetry Cards (7 Columns) */}
                  <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                        MEMBERSHIP TIER
                      </span>
                      <h4 className="text-sm font-bold text-[#FF2E4C] truncate">
                        {selectedCustomer.plan || "No Active Plan"}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        Expires: {selectedCustomer.expiry}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                        ASSIGNED COACH
                      </span>
                      <h4 className="text-sm font-bold text-purple-400 truncate">
                        {selectedCustomer.assignedTrainerName || "No Coach Assigned"}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {selectedCustomer.assignedTrainerName ? "Active 1-on-1 Protocol" : "Self-Guided"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                        LIFETIME PAID
                      </span>
                      <h4 className="text-base font-black text-emerald-400 font-mono">
                        ₹
                        {(
                          paymentsList
                            .filter(
                              (p) =>
                                (p.customerEmail &&
                                  p.customerEmail.toLowerCase() ===
                                    selectedCustomer.email.toLowerCase()) ||
                                (p.customer &&
                                  p.customer.toLowerCase() ===
                                    selectedCustomer.name.toLowerCase())
                            )
                            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0) ||
                          Number(selectedCustomer.amountPaid || 0)
                        ).toLocaleString("en-IN")}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {selectedCustomer.paymentMethod || "Online Card"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tab Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
                {[
                  { id: "overview", label: "Overview & Bio", icon: Activity },
                  { id: "membership", label: "Membership & Perks", icon: ShieldCheck },
                  { id: "payments", label: "Billing & Invoices", icon: CreditCard },
                  { id: "coaching", label: "Assigned Coach & Plans", icon: Dumbbell },
                  { id: "attendance", label: "Attendance", icon: CalendarCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = customerDetailsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCustomerDetailsTab(tab.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#FF2E4C] text-white shadow-[0_0_15px_rgba(255,46,76,0.4)]"
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUB-VIEW 1: OVERVIEW & BIO TELEMETRY */}
              {customerDetailsTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Personal Demographics & Physical Telemetry (7 Columns) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#201416] border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                            <User size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white tracking-tight">
                              Athlete Profile & Biometric Telemetry
                            </h3>
                            <p className="text-xs text-slate-400">
                              Personal information, biometrics, and physical composition.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenEditCustomer(selectedCustomer)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                        >
                          <Edit size={13} className="text-blue-400" /> Edit Bio
                        </button>
                      </div>

                      {/* 2-Column Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">GENDER</span>
                          <span className="text-xs font-bold text-white">{selectedCustomer.gender || "--"}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">DATE OF BIRTH</span>
                          <span className="text-xs font-bold text-white">{selectedCustomer.dob || "--"}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">BLOOD GROUP</span>
                          <span className="text-xs font-bold text-[#FF2E4C]">{selectedCustomer.bloodGroup || "--"}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">HEIGHT</span>
                          <span className="text-xs font-bold text-white">{selectedCustomer.height || "--"}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">WEIGHT</span>
                          <span className="text-xs font-bold text-white">{selectedCustomer.weight || "--"}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">BODY FAT %</span>
                          <span className="text-xs font-bold text-emerald-400">{selectedCustomer.bodyFat || "--"}</span>
                        </div>
                      </div>

                      {/* Address Card */}
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-2">
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 uppercase">
                          <MapPin size={13} className="text-[#FF2E4C]" /> Registered Residential Address
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {selectedCustomer.address?.street ? (
                            <>
                              {selectedCustomer.address.street}
                              {selectedCustomer.address.city ? `, ${selectedCustomer.address.city}` : ""}
                              {selectedCustomer.address.state ? `, ${selectedCustomer.address.state}` : ""}
                              {selectedCustomer.address.pincode ? ` - ${selectedCustomer.address.pincode}` : ""}
                            </>
                          ) : (
                            <span className="text-slate-500 italic">No residential address recorded.</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Assigned Trainer & Routine Quick Snapshot */}
                    <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <Dumbbell size={18} className="text-purple-400" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Assigned Master Coach & Split
                          </h3>
                        </div>
                        <button
                          onClick={() => setCustomerDetailsTab("coaching")}
                          className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          View Full Protocol <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#090C0E] border border-purple-500/20">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center text-purple-300 font-black text-lg">
                            {selectedCustomer.assignedTrainerName ? selectedCustomer.assignedTrainerName.charAt(0) : "C"}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {selectedCustomer.assignedTrainerName || "No Dedicated Coach Assigned"}
                            </span>
                            <span className="text-[11px] text-purple-300">
                              {selectedCustomer.workoutPlan?.split || "Self-guided routine (No split assigned)"}
                            </span>
                          </div>
                        </div>

                        <span className="px-3 py-1.5 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-700/40 text-[11px] font-mono font-bold whitespace-nowrap">
                          {selectedCustomer.workoutPlan?.frequency || "--"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Membership & Security Snapshot (5 Columns) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#201416] border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white tracking-tight">
                              Membership Snapshot
                            </h3>
                            <p className="text-xs text-slate-400">
                              Current tier privileges & expiration telemetry.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleOpenCustomerPlanModal}
                          className="px-3 py-1 rounded-lg bg-[#FF2E4C] text-white font-bold text-[11px] shadow-sm hover:brightness-110"
                        >
                          Upgrade
                        </button>
                      </div>

                      {/* Glowing Membership Tier Badge */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12161A] to-[#090C0E] border border-[#FF2E4C]/40 space-y-3 shadow-[0_0_20px_rgba(255,46,76,0.15)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-[#FF2E4C] uppercase tracking-wider">
                            TITAN ACCESS PASS
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${selectedCustomer.status === "Active" ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                            ● {selectedCustomer.status || "Active"}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight">
                          {selectedCustomer.plan || "No Active Plan"}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white font-mono">
                            ₹{Number(selectedCustomer.amountPaid || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">
                            / {selectedCustomer.membershipDuration || "Monthly"}
                          </span>
                        </div>

                        {/* Progress Bar for Expiry */}
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                            <span>Valid Until: {selectedCustomer.expiry}</span>
                            <span className={selectedCustomer.status === "Active" ? "text-emerald-400 font-bold" : "text-slate-400"}>
                              {selectedCustomer.status || "Active"}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[78%] bg-gradient-to-r from-[#FF2E4C] to-emerald-400 rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Key Strength PRs Card */}
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-white block uppercase tracking-wider flex items-center gap-1.5">
                          <Award size={14} className="text-amber-400" /> Core Strength PRs
                        </span>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 rounded-xl bg-[#141419] border border-white/5">
                            <span className="text-[10px] text-slate-400 block font-mono">BENCH</span>
                            <strong className="text-xs font-bold text-white font-mono">
                              {selectedCustomer.progress?.benchPressPR || "--"}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#141419] border border-white/5">
                            <span className="text-[10px] text-slate-400 block font-mono">SQUAT</span>
                            <strong className="text-xs font-bold text-[#FF2E4C] font-mono">
                              {selectedCustomer.progress?.squatPR || "--"}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#141419] border border-white/5">
                            <span className="text-[10px] text-slate-400 block font-mono">DEADLIFT</span>
                            <strong className="text-xs font-bold text-emerald-400 font-mono">
                              {selectedCustomer.progress?.deadliftPR || "--"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: MEMBERSHIP & PERKS */}
              {customerDetailsTab === "membership" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-0.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[11px] font-bold font-mono">
                            TIER CONTRACT
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {selectedCustomer.membershipDuration || "Monthly"} Cycle
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase mt-1">
                          {selectedCustomer.plan || "No Plan Selected"}
                        </h3>
                      </div>

                      <button
                        onClick={handleOpenCustomerPlanModal}
                        className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,46,76,0.4)] transition-all cursor-pointer"
                      >
                        <ShieldCheck size={16} /> Upgrade / Change Membership Plan
                      </button>
                    </div>

                    {/* 4-Box Key Contract Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">SUBSCRIPTION RATE</span>
                        <h4 className="text-xl font-bold text-white font-mono">
                          ₹{Number(selectedCustomer.amountPaid || 0).toLocaleString("en-IN")}
                        </h4>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">BILLING CADENCE</span>
                        <h4 className="text-base font-bold text-purple-400">
                          {selectedCustomer.membershipDuration || "Monthly"}
                        </h4>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">ACTIVATION DATE</span>
                        <h4 className="text-base font-bold text-slate-200 font-mono">
                          {selectedCustomer.membershipStartDate || selectedCustomer.joined || "--"}
                        </h4>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">EXPIRATION DATE</span>
                        <h4 className="text-base font-bold text-[#FF2E4C] font-mono">
                          {selectedCustomer.expiry || "--"}
                        </h4>
                      </div>
                    </div>

                    {/* Included Services & Facility Privileges Grid */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" /> Included Services & Biometric Privileges
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { name: "All-Access Strength Arena & Cardio Decks", cat: "Facility Access", inc: true },
                          { name: "Biometric Smart Locker Key Activation", cat: "Amenities", inc: true },
                          { name: "3D Body Composition Bio-Scan & Telemetry", cat: "Technology", inc: true },
                          { name: "Sub-Zero Cryotherapy Chambers", cat: "Wellness", inc: selectedCustomer.plan?.toLowerCase().includes("elite") || selectedCustomer.plan?.toLowerCase().includes("pt") },
                          { name: "Hydro-Massage Therapy Suites", cat: "Wellness", inc: selectedCustomer.plan?.toLowerCase().includes("elite") || selectedCustomer.plan?.toLowerCase().includes("pt") },
                          { name: "Dedicated 1-on-1 Master Fitness Coach", cat: "Coaching", inc: selectedCustomer.plan?.toLowerCase().includes("pt") },
                          { name: "Custom Daily Macro & Meal Matrix", cat: "Nutrition", inc: selectedCustomer.plan?.toLowerCase().includes("pt") },
                          { name: "Complimentary Pre-Workout & Intra-Fuel Shakes", cat: "Nutrition", inc: selectedCustomer.plan?.toLowerCase().includes("pt") },
                          { name: "Unlimited Guest Privileges (2 Passes/mo)", cat: "Privileges", inc: selectedCustomer.plan?.toLowerCase().includes("elite") },
                        ].map((srv, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              srv.inc
                                ? "bg-[#090C0E] border-emerald-500/30 text-white"
                                : "bg-[#090C0E]/40 border-white/5 text-slate-500 line-through opacity-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {srv.inc ? (
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              ) : (
                                <X size={16} className="text-slate-600 shrink-0" />
                              )}
                              <div>
                                <span className="text-xs font-semibold block">{srv.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{srv.cat}</span>
                              </div>
                            </div>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold ${srv.inc ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-white/5 text-slate-600"}`}>
                              {srv.inc ? "ENABLED" : "LOCKED"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: BILLING & PAYMENT RECORDS */}
              {customerDetailsTab === "payments" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Financial Metrics Summary */}
                  {(() => {
                    const userTransactions = paymentsList.filter(
                      (p) =>
                        (p.customerEmail &&
                          selectedCustomer.email &&
                          p.customerEmail.toLowerCase() ===
                            selectedCustomer.email.toLowerCase()) ||
                        (p.customer &&
                          selectedCustomer.name &&
                          p.customer.toLowerCase() ===
                            selectedCustomer.name.toLowerCase())
                    );
                    const totalInvested =
                      userTransactions.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) ||
                      Number(selectedCustomer.amountPaid || 0);

                    return (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-5 rounded-3xl bg-[#12161A] border border-white/10 shadow-md space-y-1">
                            <span className="text-xs font-medium text-slate-400">Total Amount Invested</span>
                            <div className="text-2xl font-black text-white font-mono">
                              ₹{totalInvested.toLocaleString("en-IN")}
                            </div>
                            <span className="text-[11px] text-emerald-400 font-mono">
                              ● {userTransactions.length > 0 ? "Ledger Verified" : "Database Synchronized"}
                            </span>
                          </div>

                          <div className="p-5 rounded-3xl bg-[#12161A] border border-white/10 shadow-md space-y-1">
                            <span className="text-xs font-medium text-slate-400">Total Invoices & Transactions</span>
                            <div className="text-2xl font-black text-white font-mono">
                              {userTransactions.length} Invoices
                            </div>
                            <span className="text-[11px] text-purple-400 font-mono">
                              {userTransactions.length > 0 ? "Tax Invoices Available" : "No Invoice History"}
                            </span>
                          </div>

                          <div className="p-5 rounded-3xl bg-[#12161A] border border-white/10 shadow-md space-y-1">
                            <span className="text-xs font-medium text-slate-400">Primary Payment Mode</span>
                            <div className="text-2xl font-black text-white">
                              {selectedCustomer.paymentMethod || "--"}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">Payment Gateway Record</span>
                          </div>
                        </div>

                        {/* Payments Table */}
                        <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl">
                          <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                              <CreditCard size={18} className="text-[#FF2E4C]" /> Transaction Ledger for {selectedCustomer.name}
                            </h3>
                            <button
                              onClick={() => {
                                fetchPayments();
                                showToast("Refreshed payment records!");
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                            >
                              <RefreshCw size={12} /> Sync
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                                <tr>
                                  <th className="p-4">Invoice ID</th>
                                  <th className="p-4">Item / Plan Name</th>
                                  <th className="p-4">Amount</th>
                                  <th className="p-4">Payment Method</th>
                                  <th className="p-4">Transaction Date</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Thermal Receipt</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-slate-200">
                                {userTransactions.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                                      No transaction ledger records found for this customer.
                                    </td>
                                  </tr>
                                ) : (
                                  userTransactions.map((pay) => (
                                    <tr key={pay.id || pay.invoiceId || pay._id} className="hover:bg-white/5 transition-colors">
                                      <td className="p-4 font-mono font-semibold text-[#00F0FF] text-[11px]">
                                        {pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "--")}
                                      </td>
                                      <td className="p-4 font-bold text-white">
                                        {pay.plan || pay.planOrItem || selectedCustomer.plan || "Membership Access"}
                                      </td>
                                      <td className="p-4 font-bold text-white font-mono text-sm">
                                        ₹{Number(pay.amount || 0).toLocaleString("en-IN")}
                                      </td>
                                      <td className="p-4 text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                          <CreditCard size={12} className="text-[#FF2E4C]" />
                                          {pay.method || selectedCustomer.paymentMethod || "--"}
                                        </span>
                                      </td>
                                      <td className="p-4 text-slate-400 font-mono">
                                        {pay.date || pay.createdAt?.slice(0, 10) || "--"}
                                      </td>
                                      <td className="p-4">
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                                          ✓ {pay.status || "Paid"}
                                        </span>
                                      </td>
                                      <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() => handleDownloadInvoice(pay, selectedCustomer)}
                                            title="Download Official Tax Invoice (HTML/PDF)"
                                            className="px-2.5 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer shadow-sm"
                                          >
                                            <Download size={12} /> Download
                                          </button>
                                          <button
                                            onClick={() => {
                                              setReceiptModalData({
                                                orderId: pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "--"),
                                                id: pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "--"),
                                                date: pay.date || pay.createdAt?.slice(0, 10) || "--",
                                                time: "11:00 AM",
                                                customerName: selectedCustomer.name,
                                                customerEmail: selectedCustomer.email,
                                                customerPhone: selectedCustomer.phone || "--",
                                                paymentMethod: pay.method || selectedCustomer.paymentMethod || "--",
                                                paymentStatus: "PAID & VERIFIED",
                                                subtotal: pay.amount || 0,
                                                tax: 0,
                                                amount: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                                total: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                                items: [
                                                  {
                                                    name: pay.plan || pay.planOrItem || selectedCustomer.plan || "Membership Plan Access",
                                                    qty: 1,
                                                    price: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                                    total: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                                  },
                                                ],
                                                membershipTier: pay.plan || selectedCustomer.plan || "--",
                                                turnstileStatus: "Biometric Turnstile Active",
                                                gymBranch: "Titan Pulse HQ - High Performance Arena",
                                                cashier: "Admin Billing Controller",
                                              });
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#FF2E4C] text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                                          >
                                            <Printer size={13} /> Receipt
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* SUB-VIEW 4: ASSIGNED TRAINER & WORKOUT/DIET PLANS */}
              {customerDetailsTab === "coaching" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Master Coach Profile Card */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-lg">
                          {selectedCustomer.assignedTrainerName ? selectedCustomer.assignedTrainerName.charAt(0) : "T"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">
                              {selectedCustomer.assignedTrainerName || "No Dedicated Coach Assigned"}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                              MASTER COACH
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {selectedCustomer.assignedTrainerName ? "Supervising athletic programming, periodization, and recovery." : "Assign a coach to manage custom hypertrophy and nutrition protocols."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => {
                            setCustomerAssignTrainerForm({
                              trainerId: selectedCustomer.assignedTrainer || "",
                              trainerName: selectedCustomer.assignedTrainerName || "",
                            });
                            setShowCustomerAssignTrainerModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Dumbbell size={14} /> Reassign Coach
                        </button>
                        <button
                          onClick={() => {
                            setCoachingEditForm({
                              split: selectedCustomer.workoutPlan?.split || "",
                              frequency: selectedCustomer.workoutPlan?.frequency || "",
                              intensity: selectedCustomer.workoutPlan?.intensity || "",
                              cardioProtocol: selectedCustomer.workoutPlan?.cardioProtocol || "",
                              customNotes: selectedCustomer.workoutPlan?.customNotes || "",
                              dailyCalories: selectedCustomer.dietPlan?.dailyCalories || "",
                              protein: selectedCustomer.dietPlan?.protein || "",
                              carbs: selectedCustomer.dietPlan?.carbs || "",
                              fats: selectedCustomer.dietPlan?.fats || "",
                              waterIntake: selectedCustomer.dietPlan?.waterIntake || "",
                              mealProtocol: selectedCustomer.dietPlan?.mealProtocol || "",
                              supplements: Array.isArray(selectedCustomer.dietPlan?.supplements) ? selectedCustomer.dietPlan.supplements.join(", ") : (selectedCustomer.dietPlan?.supplements || ""),
                              benchPressPR: selectedCustomer.progress?.benchPressPR || "",
                              squatPR: selectedCustomer.progress?.squatPR || "",
                              deadliftPR: selectedCustomer.progress?.deadliftPR || "",
                              targetWeight: selectedCustomer.progress?.targetWeight || "",
                              trainerNote: "",
                            });
                            setShowEditCoachingModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Edit size={14} /> Update Workout & Diet Matrix
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Workout & Diet Protocols Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card A: Workout Protocol & Split */}
                    <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Flame size={16} className="text-[#FF2E4C]" /> Resistance & Conditioning Matrix
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {selectedCustomer.workoutPlan?.updatedAt ? new Date(selectedCustomer.workoutPlan.updatedAt).toLocaleDateString() : (selectedCustomer.workoutPlan?.split ? "Active Protocol" : "Not Configured")}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 flex justify-between items-center">
                          <span className="text-slate-400">Training Split:</span>
                          <strong className="text-white font-semibold">
                            {selectedCustomer.workoutPlan?.split || "Not Assigned"}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 flex justify-between items-center">
                          <span className="text-slate-400">Weekly Frequency:</span>
                          <strong className="text-purple-400 font-semibold">
                            {selectedCustomer.workoutPlan?.frequency || "--"}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 flex justify-between items-center">
                          <span className="text-slate-400">Target Intensity:</span>
                          <strong className="text-emerald-400 font-semibold">
                            {selectedCustomer.workoutPlan?.intensity || "--"}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 flex justify-between items-center">
                          <span className="text-slate-400">Cardio Protocol:</span>
                          <strong className="text-slate-200 font-semibold">
                            {selectedCustomer.workoutPlan?.cardioProtocol || "--"}
                          </strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Coach Cadence Notes:</span>
                          <p className="text-xs text-slate-300 italic">
                            {selectedCustomer.workoutPlan?.customNotes ? `"${selectedCustomer.workoutPlan.customNotes}"` : "No specific workout notes recorded."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card B: Nutrition & Dietary Matrix */}
                    <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Droplets size={16} className="text-emerald-400" /> Nutrition & Macronutrient Matrix
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {selectedCustomer.dietPlan?.updatedAt ? new Date(selectedCustomer.dietPlan.updatedAt).toLocaleDateString() : (selectedCustomer.dietPlan?.dailyCalories ? "Active Protocol" : "Not Configured")}
                        </span>
                      </div>

                      {/* 4 Macros Badges */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-[#090C0E] border border-white/5">
                          <span className="text-[9px] text-slate-400 block font-mono">CALORIES</span>
                          <strong className="text-xs font-bold text-white font-mono">
                            {selectedCustomer.dietPlan?.dailyCalories || "--"}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#090C0E] border border-white/5">
                          <span className="text-[9px] text-slate-400 block font-mono">PROTEIN</span>
                          <strong className="text-xs font-bold text-[#FF2E4C] font-mono">
                            {selectedCustomer.dietPlan?.protein || "--"}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#090C0E] border border-white/5">
                          <span className="text-[9px] text-slate-400 block font-mono">CARBS</span>
                          <strong className="text-xs font-bold text-amber-400 font-mono">
                            {selectedCustomer.dietPlan?.carbs || "--"}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#090C0E] border border-white/5">
                          <span className="text-[9px] text-slate-400 block font-mono">FATS</span>
                          <strong className="text-xs font-bold text-purple-400 font-mono">
                            {selectedCustomer.dietPlan?.fats || "--"}
                          </strong>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 flex justify-between items-center">
                          <span className="text-slate-400">Hydration Target:</span>
                          <strong className="text-blue-400 font-mono font-semibold">
                            {selectedCustomer.dietPlan?.waterIntake || "--"}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-slate-400 block">Meal Timing Protocol:</span>
                          <p className="text-slate-200 font-semibold">
                            {selectedCustomer.dietPlan?.mealProtocol || "No specific meal protocol assigned."}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#090C0E] border border-white/5 space-y-1.5">
                          <span className="text-slate-400 block text-[11px]">Daily Supplement Stack:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(selectedCustomer.dietPlan?.supplements) && selectedCustomer.dietPlan.supplements.length > 0) ? (
                              selectedCustomer.dietPlan.supplements.map((sup, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300">
                                  ✓ {sup}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No supplements prescribed.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coach Notes Timeline Card */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-[#FF2E4C]" /> Coach Audit Logs & Progression Notes
                    </h4>
                    <div className="space-y-3">
                      {(selectedCustomer.trainerNotes || []).length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-4 rounded-xl bg-[#090C0E] border border-white/5">
                          No notes recorded yet. Click "Update Workout & Diet Matrix" to add coach notes.
                        </p>
                      ) : (
                        selectedCustomer.trainerNotes.map((note, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <Award size={13} className="text-amber-400" /> {note.author || "Master Coach"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {note.note}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 5: ATTENDANCE LOGS */}
              {customerDetailsTab === "attendance" && (
                <div className="rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden shadow-xl animate-fadeIn">
                  <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <CalendarCheck size={18} className="text-emerald-400" /> Attendance Check-in Logs for {selectedCustomer.name}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold font-mono">
                      Gate Scanner: Online
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-4">Session Log ID</th>
                          <th className="p-4">Gate Terminal</th>
                          <th className="p-4">Scan Time In</th>
                          <th className="p-4">Scan Time Out</th>
                          <th className="p-4">Active Plan Pass</th>
                          <th className="p-4">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {(selectedCustomer.attendanceLogs || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                              No biometric turnstile check-in logs recorded for this athlete.
                            </td>
                          </tr>
                        ) : (
                          selectedCustomer.attendanceLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono font-semibold text-[#00F0FF]">{log.id}</td>
                              <td className="p-4 text-purple-400 font-medium">{log.gate || "Gate Terminal A1"}</td>
                              <td className="p-4 font-mono text-white">{log.in} {log.date ? `(${log.date})` : ""}</td>
                              <td className="p-4 font-mono text-slate-400">{log.out || "--"}</td>
                              <td className="p-4 text-[#FF2E4C] font-semibold">{selectedCustomer.plan || "Active Pass"}</td>
                              <td className="p-4">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                                  ✓ Verified Turnstile Pass
                                </span>
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
          )}

          {/* TAB 4: TRAINER MANAGEMENT */}
          {activeTab === "trainer-mgmt" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Trainer & Coach Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Roster of certified master coaches, specializations, and
                    client rosters.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Plus size={15} /> + Add Coach to Roster
                </button>
              </div>

              {trainersList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#12161A] border border-white/10 text-center space-y-3 shadow-xl">
                  <p className="text-sm text-slate-400">
                    No registered trainers/coaches found in MongoDB database.
                  </p>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Plus size={15} /> Register First Coach
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trainersList.map((t) => (
                    <div
                      key={t.id}
                      className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl hover:border-[#FF2E4C]/50 transition-all relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] text-white font-bold text-lg flex items-center justify-center shadow-md">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-medium">
                              {t.status}
                            </span>
                          </div>
                        </div>

                        {/* Trainer Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1.5 bg-[#090C0E] p-1 rounded-xl border border-white/5 shadow-inner">
                          <button
                            onClick={() => handleOpenEditStaff(t, "trainer")}
                            title={`Edit Coach ${t.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Edit size={14} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteStaff(t, "trainer")}
                            title={`Delete Coach ${t.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF2E4C] hover:bg-[#FF2E4C]/10 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} className="text-[#FF2E4C]" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {t.name}
                        </h3>
                        <span className="text-xs font-medium text-[#FF2E4C] block mt-0.5">
                          {t.spec}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono block mt-1">
                          {t.email}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1.5 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Clients Assigned:</span>{" "}
                          <strong className="text-slate-200 font-semibold">
                            {t.clients}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Shift Hours:</span>{" "}
                          <strong className="text-slate-200 font-semibold">
                            {t.shift}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Athlete Rating:</span>{" "}
                          <strong className="text-amber-400 font-semibold">
                            {t.rating}
                          </strong>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCoach(t);
                          setCoachShiftForm({
                            shift: t.shift || "06:00 AM - 02:00 PM",
                            days: t.days || [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ],
                            maxCapacity: 12,
                            breakTime: "11:00 AM - 11:30 AM",
                            room:
                              t.room || "Main Strength & Conditioning Arena",
                          });

                          // Load real active membership athletes assigned to this coach
                          const realAssigned = customersList
                            .filter(
                              (c) =>
                                (c.assignedTrainer === t.userId ||
                                  c.assignedTrainer === t.id ||
                                  c.assignedTrainerName?.toLowerCase() ===
                                    t.name.toLowerCase()) &&
                                c.plan &&
                                c.plan !== "No Active Plan" &&
                                c.status !== "No Membership",
                            )
                            .map((c) => ({
                              id: c.id,
                              userId: c.userId,
                              name: c.name,
                              email: c.email,
                              phone: c.phone,
                              program: c.plan,
                              goal: "Athletic Hypertrophy & Conditioning",
                              slot: `${t.shift ? t.shift.split("(")[0] : "07:00 AM - 08:00 AM"} (Mon-Sat)`,
                              status: "Active",
                              progress: "25%",
                            }));

                          setCoachClients({
                            active: realAssigned,
                            past: [],
                          });

                          setActiveTab("coach-schedule");
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-[#FF2E4C] text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} className="text-[#FF2E4C]" />
                        Manage Schedule
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4.5: DEDICATED COACH SCHEDULE & CLIENT MANAGEMENT VIEW */}
          {activeTab === "coach-schedule" && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Back Navigation & Coach Overview Card */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("trainer-mgmt")}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Trainers
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
                        {selectedCoach?.id || "TRN-501"} •{" "}
                        {selectedCoach?.email} •{" "}
                        {selectedCoach?.spec || "Master Coach"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAssignClientModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(255,46,76,0.4)] transition-all cursor-pointer"
                    >
                      <UserPlus size={15} /> Assign New Athlete
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ASSIGNED SHIFT
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-purple-400">
                      {coachShiftForm.shift}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ACTIVE ATHLETES
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">
                      {coachClients.active.length} Athletes
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      GRADUATED / PAST
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-amber-400">
                      {coachClients.past.length} Completed
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      COACH RATING
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-yellow-400">
                      {selectedCoach?.rating || "5.0 ★"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* 1. SHIFT & TIMINGS SCHEDULER CONFIGURATION */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
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
                        Configure weekly availability, designated training room,
                        and shift duration.
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
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
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
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
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
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
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
                                : "bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      },
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
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white"
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
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white"
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
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Calendar size={15} /> Weekly Schedule Grid
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: ACTIVE CLIENTS */}
                {coachClientTab === "active" && (
                  <div className="rounded-3xl bg-[#141419] border border-[#202028] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
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
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {coachClients.active.length === 0 ? (
                            <tr>
                              <td
                                colSpan="7"
                                className="p-8 text-center text-slate-400"
                              >
                                No active athletes assigned yet. Click "Assign
                                New Athlete" to assign a customer.
                              </td>
                            </tr>
                          ) : (
                            coachClients.active.map((client) => (
                              <tr
                                key={client.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="p-4 font-mono text-[#00F0FF] font-semibold">
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
                                <td className="p-4 font-semibold text-[#FF2E4C]">
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
                                        `✓ Logged training progress for ${client.name}`,
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-emerald-500 text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    Log Session
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Move to past
                                      setCoachClients((prev) => ({
                                        active: prev.active.filter(
                                          (c) => c.id !== client.id,
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
                                        `✓ Graduated ${client.name} to Past Clients!`,
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-amber-500 text-amber-400 text-xs font-semibold transition-all cursor-pointer"
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
                  <div className="rounded-3xl bg-[#141419] border border-[#202028] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                          <tr>
                            <th className="p-4">Record ID</th>
                            <th className="p-4">Athlete Name</th>
                            <th className="p-4">Completed Program</th>
                            <th className="p-4">Outcome & PR Transformation</th>
                            <th className="p-4">Completion Date</th>
                            <th className="p-4">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
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
                                className="hover:bg-white/5 transition-colors"
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
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
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
                          className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3"
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
                                      {client.slot.split("(")[0] ||
                                        "07:00 AM - 08:00 AM"}
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

              {/* MODAL: ASSIGN NEW ATHLETE TO COACH */}
              {showAssignClientModal && (
                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-lg rounded-3xl bg-[#141419] border border-[#202028] p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase">
                          Assign Athlete to Coach
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Assign a customer to {selectedCoach?.name || "Coach"}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAssignClientModal(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newClientAssign.name) {
                          showToast(
                            "Please select a member with active gym membership",
                          );
                          return;
                        }

                        const targetCustomer = customersList.find(
                          (c) => c.name === newClientAssign.name,
                        );
                        if (
                          !targetCustomer ||
                          !targetCustomer.plan ||
                          targetCustomer.plan === "No Active Plan" ||
                          targetCustomer.status === "No Membership"
                        ) {
                          showToast(
                            "⚠️ Cannot allocate trainer: Only customers with active gym membership can be assigned a coach.",
                          );
                          return;
                        }

                        const newEntry = {
                          id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
                          userId: targetCustomer.userId,
                          name: targetCustomer.name,
                          email: targetCustomer.email,
                          phone: targetCustomer.phone || "+91 99887 66554",
                          program:
                            targetCustomer.plan || newClientAssign.program,
                          goal: newClientAssign.goal,
                          slot: `${newClientAssign.slot} (${newClientAssign.days})`,
                          status: "Active",
                          progress: "15%",
                        };

                        // Persist to MongoDB Atlas
                        try {
                          const targetUserId =
                            targetCustomer.userId || targetCustomer.id;
                          if (targetUserId) {
                            await api.put(`/api/users/${targetUserId}`, {
                              assignedTrainer:
                                selectedCoach?.userId || selectedCoach?.id,
                              assignedTrainerName: selectedCoach?.name,
                            });
                          }
                        } catch (err) {
                          console.warn("Assign trainer to user err:", err);
                        }

                        // Update local customers state
                        setCustomersList((prev) =>
                          prev.map((c) =>
                            c.userId === targetCustomer.userId ||
                            c.name === targetCustomer.name
                              ? {
                                  ...c,
                                  assignedTrainer:
                                    selectedCoach?.userId || selectedCoach?.id,
                                  assignedTrainerName: selectedCoach?.name,
                                }
                              : c,
                          ),
                        );

                        setCoachClients((prev) => ({
                          ...prev,
                          active: [
                            newEntry,
                            ...prev.active.filter(
                              (c) => c.name !== newEntry.name,
                            ),
                          ],
                        }));

                        showToast(
                          `✓ Successfully allocated Coach ${selectedCoach?.name || "Coach"} to ${targetCustomer.name} (${targetCustomer.plan})!`,
                        );
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
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300">
                            Select Active Member
                          </label>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                            Active Membership Required
                          </span>
                        </div>
                        <select
                          value={newClientAssign.name}
                          onChange={(e) => {
                            const found = customersList.find(
                              (c) => c.name === e.target.value,
                            );
                            setNewClientAssign({
                              ...newClientAssign,
                              name: e.target.value,
                              email: found ? found.email : "",
                              phone: found ? found.phone : "",
                              program: found?.plan || newClientAssign.program,
                            });
                          }}
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          required
                        >
                          <option value="">
                            -- Choose Member with Purchased Membership --
                          </option>
                          {customersList
                            .filter(
                              (c) =>
                                c.plan &&
                                c.plan !== "No Active Plan" &&
                                c.status !== "No Membership" &&
                                c.status !== "Inactive" &&
                                c.status !== "Expired",
                            )
                            .map((c) => (
                              <option key={c.id || c.userId} value={c.name}>
                                {c.name} • {c.plan} ({c.email})
                              </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400">
                          Only customers who have purchased a membership tier
                          appear in this allocation list.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Training Program
                          </label>
                          <select
                            value={newClientAssign.program}
                            onChange={(e) =>
                              setNewClientAssign({
                                ...newClientAssign,
                                program: e.target.value,
                              })
                            }
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="Hypertrophy 5x5 Strength">
                              Hypertrophy 5x5 Strength
                            </option>
                            <option value="3D Telemetry & Conditioning">
                              3D Telemetry & Conditioning
                            </option>
                            <option value="Olympic Weightlifting">
                              Olympic Weightlifting
                            </option>
                            <option value="Fat Loss & Shred">
                              Fat Loss & Shred
                            </option>
                            <option value="Powerlifting Prep">
                              Powerlifting Prep
                            </option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Time Slot
                          </label>
                          <select
                            value={newClientAssign.slot}
                            onChange={(e) =>
                              setNewClientAssign({
                                ...newClientAssign,
                                slot: e.target.value,
                              })
                            }
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="06:00 AM - 07:00 AM">
                              06:00 AM - 07:00 AM
                            </option>
                            <option value="07:00 AM - 08:00 AM">
                              07:00 AM - 08:00 AM
                            </option>
                            <option value="08:00 AM - 09:00 AM">
                              08:00 AM - 09:00 AM
                            </option>
                            <option value="09:00 AM - 10:00 AM">
                              09:00 AM - 10:00 AM
                            </option>
                            <option value="10:00 AM - 11:00 AM">
                              10:00 AM - 11:00 AM
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Session Frequency Days
                        </label>
                        <select
                          value={newClientAssign.days}
                          onChange={(e) =>
                            setNewClientAssign({
                              ...newClientAssign,
                              days: e.target.value,
                            })
                          }
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="Mon, Wed, Fri">
                            Mon, Wed, Fri (3 days/week)
                          </option>
                          <option value="Tue, Thu, Sat">
                            Tue, Thu, Sat (3 days/week)
                          </option>
                          <option value="Daily (Mon - Sat)">
                            Daily (Mon - Sat)
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Primary Transformation Goal
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
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          placeholder="e.g. Gain 4kg Lean Mass & PR 140kg Deadlift"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setShowAssignClientModal(false)}
                          className="px-4 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white text-xs font-bold shadow-lg"
                        >
                          Confirm & Assign
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RECEPTIONIST MANAGEMENT */}
          {activeTab === "receptionist-mgmt" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Receptionist & Front Desk
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Front desk personnel, gate terminal assignments, and live
                    check-in monitoring.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Plus size={15} /> + Add Front Desk Staff
                </button>
              </div>

              {receptionistsList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#12161A] border border-white/10 text-center space-y-3 shadow-xl">
                  <p className="text-sm text-slate-400">
                    No registered front desk receptionists found in MongoDB
                    database.
                  </p>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Plus size={15} /> Register First Receptionist
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {receptionistsList.map((r) => (
                    <div
                      key={r.id}
                      className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/40 transition-all relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                            <UserCog size={19} />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white">
                              {r.name}
                            </h3>
                            <span className="text-xs text-slate-400">
                              {r.id} • {r.email}
                            </span>
                          </div>
                        </div>

                        {/* Receptionist Action Buttons: Status, Edit & Delete */}
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-medium">
                            {r.status}
                          </span>
                          <div className="flex items-center gap-1 bg-[#090C0E] p-1 rounded-xl border border-white/5 shadow-inner">
                            <button
                              onClick={() =>
                                handleOpenEditStaff(r, "receptionist")
                              }
                              title={`Edit Receptionist ${r.name}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                            >
                              <Edit size={14} className="text-amber-400" />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenDeleteStaff(r, "receptionist")
                              }
                              title={`Delete Receptionist ${r.name}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF2E4C] hover:bg-[#FF2E4C]/10 transition-all cursor-pointer"
                            >
                              <Trash2 size={14} className="text-[#FF2E4C]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Assigned Terminal:</span>{" "}
                          <strong className="text-slate-200 font-semibold">
                            {r.terminal}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Shift Timing:</span>{" "}
                          <strong className="text-white">{r.shift}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-ins Processed Today:</span>{" "}
                          <strong className="text-amber-400">
                            {r.checkinsToday}
                          </strong>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReceptionist(r);
                          setReceptionistShiftForm({
                            shift: r.shift || "Morning (06:00 AM - 02:00 PM)",
                            terminal: r.terminal || "Gate Terminal A1",
                            days: r.days || [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ],
                            breakTime: "11:00 AM - 11:30 AM",
                          });
                          setActiveTab("receptionist-schedule");
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-amber-400 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} className="text-amber-400" />
                        Manage Schedule
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5.5: DEDICATED RECEPTIONIST SCHEDULE & DESK MANAGEMENT VIEW */}
          {activeTab === "receptionist-schedule" && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Back Navigation & Receptionist Profile Overview Card */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("receptionist-mgmt")}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-amber-400 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Receptionists
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {selectedReceptionist?.name || "Front Desk Staff"}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                          ● Online
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {selectedReceptionist?.id || "REC-201"} •{" "}
                        {selectedReceptionist?.email || "santosh@gmail.com"} •{" "}
                        {selectedReceptionist?.terminal || "Gate Terminal A1"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        showToast(
                          `Exported shift report for ${selectedReceptionist?.name || "Staff"}`,
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-[#181820] border border-white/10 hover:border-amber-400 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download size={14} /> Export Shift Report
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ASSIGNED SHIFT
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-amber-400">
                      {receptionistShiftForm.shift}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ASSIGNED TERMINAL
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-purple-400">
                      {receptionistShiftForm.terminal}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      CHECK-INS TODAY
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">
                      142 Processed
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">
                      TERMINAL STATUS
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">
                      Online (Normal)
                    </h4>
                  </div>
                </div>
              </div>

              {/* 1. SHIFT & TERMINAL TIMINGS CONFIGURATION */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Front Desk Shift Timings & Gate Setup
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure weekly shift hours, assigned biometric gate
                        terminal, and break intervals.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveReceptionistShift}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Check size={14} /> Save Timings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Shift Timing Window Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Shift Timing Window
                    </label>
                    <select
                      value={receptionistShiftForm.shift}
                      onChange={(e) =>
                        setReceptionistShiftForm({
                          ...receptionistShiftForm,
                          shift: e.target.value,
                        })
                      }
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    >
                      <option value="Morning (06:00 AM - 02:00 PM)">
                        Morning Shift (06:00 AM - 02:00 PM)
                      </option>
                      <option value="Evening (02:00 PM - 10:00 PM)">
                        Evening Shift (02:00 PM - 10:00 PM)
                      </option>
                      <option value="Night (10:00 PM - 06:00 AM)">
                        Night / Overnight Shift (10:00 PM - 06:00 AM)
                      </option>
                      <option value="General (09:00 AM - 05:00 PM)">
                        General Shift (09:00 AM - 05:00 PM)
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
                      value={receptionistShiftForm.breakTime}
                      onChange={(e) =>
                        setReceptionistShiftForm({
                          ...receptionistShiftForm,
                          breakTime: e.target.value,
                        })
                      }
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
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
                        const isSelected =
                          receptionistShiftForm.days.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const newDays = isSelected
                                ? receptionistShiftForm.days.filter(
                                    (d) => d !== day,
                                  )
                                : [...receptionistShiftForm.days, day];
                              setReceptionistShiftForm({
                                ...receptionistShiftForm,
                                days: newDays,
                              });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                : "bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              {/* 2. RECEPTIONIST ACTIVITY & WEEKLY SCHEDULE TABS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReceptionistDutyTab("logs")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        receptionistDutyTab === "logs"
                          ? "bg-amber-500 text-black shadow-md"
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <CheckCircle2 size={15} /> Recent Check-in Logs
                    </button>
                    <button
                      onClick={() => setReceptionistDutyTab("calendar")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        receptionistDutyTab === "calendar"
                          ? "bg-amber-500 text-black shadow-md"
                          : "bg-[#141419] border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Calendar size={15} /> Weekly Terminal Schedule Matrix
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: RECENT CHECK-IN LOGS */}
                {receptionistDutyTab === "logs" && (
                  <div className="rounded-3xl bg-[#141419] border border-[#202028] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                          <tr>
                            <th className="p-4">Log ID</th>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Terminal Gate</th>
                            <th className="p-4">Check-in Time</th>
                            <th className="p-4">Membership Pass</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {customerAttendanceList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                                No gate check-in logs recorded yet. Real entries will appear as members check in.
                              </td>
                            </tr>
                          ) : (
                            customerAttendanceList.map((log) => (
                              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-[#00F0FF] font-semibold">
                                  {log.id}
                                </td>
                                <td className="p-4 font-bold text-white">
                                  {log.name}
                                </td>
                                <td className="p-4 text-purple-400">
                                  {log.gate || receptionistShiftForm.terminal}
                                </td>
                                <td className="p-4 font-mono text-slate-300">
                                  {log.timeIn}
                                </td>
                                <td className="p-4 text-slate-300">
                                  {log.plan}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                                      log.status === "Active Inside"
                                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                                        : "bg-slate-900 text-slate-400 border-white/10"
                                    }`}
                                  >
                                    ● {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW B: WEEKLY TERMINAL SCHEDULE MATRIX */}
                {receptionistDutyTab === "calendar" && (
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={16} className="text-amber-400" /> Weekly
                      Front Desk Duty Roster ({receptionistShiftForm.shift})
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
                          className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3"
                        >
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="font-bold text-white text-xs uppercase">
                              {day}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              Duty Active
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#141419] border border-amber-500/30 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">
                                {receptionistShiftForm.shift}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 text-[9px] font-mono">
                                On Duty
                              </span>
                            </div>
                            <span className="text-[11px] text-purple-400 block">
                              {receptionistShiftForm.terminal}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Break: {receptionistShiftForm.breakTime}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MEMBERSHIP MANAGEMENT */}
          {activeTab === "membership-mgmt" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Membership Plans & Tiers
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure access passes, monthly/annual rates, and biometric
                    privileges live synchronized with the Landing Page.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRestoreOriginalPlans}
                    className="px-4 py-2 rounded-xl bg-[#181820] border border-white/10 hover:border-[#FF2E4C] text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <RotateCcw size={14} className="text-[#FF2E4C]" />
                    <span>Restore Original Services Data</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plansList.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#FF2E4C]/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#FF2E4C] uppercase tracking-wider">
                          {p.id}
                        </span>
                        {p.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[10px] font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {p.name}
                      </h3>

                      {/* Primary Rate & Breakdown */}
                      <div className="my-3 p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-400">Monthly Pass:</span>
                          <span className="text-lg font-black text-white font-mono">
                            ₹{Number(p.price || 0).toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="text-slate-400">Quarterly (3 Mo):</span>
                          <span className="font-bold text-purple-300 font-mono">
                            ₹{Number(p.quarterlyPrice || (p.price ? p.price * 3 - 500 : 0)).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs border-t border-white/5 pt-1.5">
                          <span className="text-emerald-400 font-medium">Annual Pass (12 Mo):</span>
                          <span className="font-black text-emerald-400 font-mono">
                            ₹{Number(p.annualPrice || (p.price ? p.price * 10 : 0)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {p.description || p.perks}
                      </p>

                      {/* Services count tag */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Included Services:</span>
                        <strong className="text-emerald-400 font-mono font-semibold">
                          {(p.services || []).filter((s) => s.included).length}{" "}
                          Active Amenities
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlan(p);
                        setPlanEditForm(JSON.parse(JSON.stringify(p)));
                        setActiveTab("edit-membership-plan");
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-[#FF2E4C] text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Edit size={14} className="text-[#FF2E4C]" />
                      Edit Plan & Pricing
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6.5: DEDICATED EDIT MEMBERSHIP PLAN & SERVICES VIEW */}
          {activeTab === "edit-membership-plan" && planEditForm && (
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Header & Navigation Bar */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("membership-mgmt")}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Plans
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Edit Plan: {planEditForm.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/30 text-[11px] font-bold font-mono">
                          {planEditForm.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Modify tier pricing, membership durations, privileges,
                        and enabled service amenities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab("membership-mgmt")}
                      className="px-4 py-2 rounded-xl bg-[#090C0E] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEditedPlan}
                      className="px-5 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,46,76,0.4)] transition-all cursor-pointer"
                    >
                      <Check size={15} /> Save Plan Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* 2-Column Configuration Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* COLUMN 1: PLAN IDENTITY & PRICING (5 Columns) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#201416] border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Plan Details & Tier Pricing
                        </h3>
                        <p className="text-xs text-slate-400">
                          Configure public name, badge, and rates.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Plan Display Name
                        </label>
                        <input
                          type="text"
                          value={planEditForm.name}
                          onChange={(e) =>
                            setPlanEditForm({
                              ...planEditForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Plan Badge / Tagline
                        </label>
                        <input
                          type="text"
                          value={planEditForm.badge || ""}
                          onChange={(e) =>
                            setPlanEditForm({
                              ...planEditForm,
                              badge: e.target.value,
                            })
                          }
                          placeholder="e.g. VIP Tier, Most Popular, Essential"
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Monthly Price (₹)
                          </label>
                          <input
                            type="number"
                            value={planEditForm.price || ""}
                            onChange={(e) =>
                              setPlanEditForm({
                                ...planEditForm,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Quarterly Price (₹)
                          </label>
                          <input
                            type="number"
                            value={planEditForm.quarterlyPrice || ""}
                            onChange={(e) =>
                              setPlanEditForm({
                                ...planEditForm,
                                quarterlyPrice: Number(e.target.value),
                              })
                            }
                            placeholder="Optional rate"
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Annual Price (₹)
                        </label>
                        <input
                          type="number"
                          value={planEditForm.annualPrice || ""}
                          onChange={(e) =>
                            setPlanEditForm({
                              ...planEditForm,
                              annualPrice: Number(e.target.value),
                            })
                          }
                          placeholder="Optional rate"
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Plan Description / Pitch
                        </label>
                        <textarea
                          rows={3}
                          value={planEditForm.description || ""}
                          onChange={(e) =>
                            setPlanEditForm({
                              ...planEditForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#FF2E4C] resize-none"
                          placeholder="Detailed overview pitch for this membership tier"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: SERVICES & AMENITIES CHECKLIST (7 Columns) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Services & Amenities in this Plan
                        </h3>
                        <p className="text-xs text-slate-400">
                          Toggle privileges and add new custom services included
                          in this membership tier.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
                        {
                          (planEditForm.services || []).filter(
                            (s) => s.included,
                          ).length
                        }{" "}
                        / {(planEditForm.services || []).length} Enabled
                      </span>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        "All",
                        "Facility Access",
                        "Technology",
                        "Coaching",
                        "Wellness",
                        "Nutrition",
                        "Amenities",
                        "Privileges",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setServiceCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            serviceCategoryFilter === cat
                              ? "bg-[#FF2E4C] text-white shadow-md"
                              : "bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Services List */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {(planEditForm.services || [])
                        .filter(
                          (s) =>
                            serviceCategoryFilter === "All" ||
                            s.category === serviceCategoryFilter,
                        )
                        .map((service) => (
                          <div
                            key={service.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              service.included
                                ? "bg-[#090C0E] border-emerald-500/30"
                                : "bg-[#090C0E]/50 border-white/5 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setPlanEditForm({
                                    ...planEditForm,
                                    services: planEditForm.services.map((s) =>
                                      s.id === service.id
                                        ? { ...s, included: !s.included }
                                        : s,
                                    ),
                                  });
                                }}
                                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                                  service.included
                                    ? "bg-emerald-500 text-black"
                                    : "border border-white/20 hover:border-white/40"
                                }`}
                              >
                                {service.included && (
                                  <Check size={13} className="stroke-[3]" />
                                )}
                              </button>
                              <div>
                                <span
                                  className={`text-xs font-semibold block ${service.included ? "text-white" : "text-slate-400 line-through"}`}
                                >
                                  {service.name}
                                </span>
                                <span className="text-[10px] text-purple-400 font-mono">
                                  {service.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                  service.included
                                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                                    : "bg-white/5 text-slate-500"
                                }`}
                              >
                                {service.included ? "Included" : "Excluded"}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPlanEditForm({
                                    ...planEditForm,
                                    services: planEditForm.services.filter(
                                      (s) => s.id !== service.id,
                                    ),
                                  });
                                }}
                                className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Add Custom Service Bar */}
                    <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 space-y-3">
                      <span className="text-xs font-bold text-slate-300 block">
                        + Add New Service or Amenity
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <input
                          type="text"
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          placeholder="e.g. Hydro-Massage Beds, Sauna Access, Biometric Ring Sync"
                          className="sm:col-span-7 bg-[#141419] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                        <select
                          value={newServiceCategory}
                          onChange={(e) =>
                            setNewServiceCategory(e.target.value)
                          }
                          className="sm:col-span-3 bg-[#141419] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="Facility Access">
                            Facility Access
                          </option>
                          <option value="Technology">Technology</option>
                          <option value="Coaching">Coaching</option>
                          <option value="Wellness">Wellness</option>
                          <option value="Nutrition">Nutrition</option>
                          <option value="Amenities">Amenities</option>
                          <option value="Privileges">Privileges</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newServiceName.trim()) {
                              showToast("Please type a service name");
                              return;
                            }
                            const newServ = {
                              id: `srv-${Date.now()}`,
                              name: newServiceName.trim(),
                              category: newServiceCategory,
                              included: true,
                            };
                            setPlanEditForm({
                              ...planEditForm,
                              services: [
                                ...(planEditForm.services || []),
                                newServ,
                              ],
                            });
                            setNewServiceName("");
                            showToast(`✓ Added service "${newServ.name}"!`);
                          }}
                          className="sm:col-span-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md cursor-pointer transition-all"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE PREVIEW OF THIS MEMBERSHIP CARD */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye size={16} className="text-[#FF2E4C]" /> Live Card Preview
                  (How Athletes & Front Desk Will See It)
                </h4>

                <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#090C0E] border border-[#FF2E4C]/50 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#FF2E4C] uppercase tracking-wider">
                      {planEditForm.id}
                    </span>
                    {planEditForm.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[10px] font-bold">
                        {planEditForm.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {planEditForm.name}
                  </h3>
                  <div className="text-3xl font-black text-white">
                    ₹{Number(planEditForm.price || 0).toLocaleString()}{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      / Monthly
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {planEditForm.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Included Services:
                    </span>
                    {(planEditForm.services || [])
                      .filter((s) => s.included)
                      .map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 text-xs text-slate-200"
                        >
                          <CheckCircle2
                            size={13}
                            className="text-emerald-400 shrink-0"
                          />
                          <span>{s.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT AND BILLING */}
          {activeTab === "payment-billing" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Quick Action Hub */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF2E4C]/15 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center font-bold shadow-inner">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Financial Ledger & Payment Billing
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Real-time verified MongoDB payment records, instant GST invoices, and turnstile pass settlements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ledger Online
                  </span>

                  <button
                    onClick={() => {
                      fetchPayments();
                      showToast("✓ Synchronized latest payment ledger from database!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#090C0E] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw size={13} />
                    <span>Sync Ledger</span>
                  </button>

                  <button
                    onClick={() => {
                      if (paymentsList.length === 0) {
                        showToast("No payment records available to export.");
                        return;
                      }
                      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(paymentsList, null, 2)
                      )}`;
                      const link = document.createElement("a");
                      link.href = jsonString;
                      link.download = `Titan_Pulse_Ledger_${new Date().toISOString().slice(0, 10)}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("✓ Downloaded raw financial JSON ledger!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#090C0E] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    title="Export JSON Data"
                  >
                    <FileText size={13} className="text-amber-400" />
                    <span>JSON Dump</span>
                  </button>

                  <button
                    onClick={() => {
                      if (paymentsList.length === 0) {
                        showToast("No payment records available to export.");
                        return;
                      }
                      const headers = ["Invoice ID", "Customer Name", "Customer Email", "Customer Phone", "Plan", "Amount (INR)", "Payment Method", "Date", "Status"];
                      const rows = paymentsList.map((p) => [
                        p.id || p.invoiceId || (p._id ? `INV-${String(p._id).slice(-6).toUpperCase()}` : "INV"),
                        `"${p.customer || ""}"`,
                        `"${p.customerEmail || ""}"`,
                        `"${p.customerPhone || ""}"`,
                        `"${p.plan || ""}"`,
                        p.amount || 0,
                        `"${p.method || ""}"`,
                        `"${p.date || ""}"`,
                        `"${p.status || "Paid"}"`,
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `Titan_Pulse_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("✓ Downloaded official billing ledger (CSV)!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(255,46,76,0.35)] transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download CSV Ledger</span>
                  </button>
                </div>
              </div>

              {/* Revenue Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#141419] border border-[#202028] shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Gross Revenue
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹
                    {paymentsList
                      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
                      .toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <TrendingUp size={12} /> 100% Verified
                    </span>
                    <span>Database Sync</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#141419] border border-[#202028] shadow-lg space-y-3 relative overflow-hidden group hover:border-[#FF2E4C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Settled Invoices
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FF2E4C]/15 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center">
                      <CreditCard size={16} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {paymentsList.length}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">Transactions</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                    <span className="text-[#FF2E4C] font-semibold">
                      {paymentsList.filter((p) => (p.status || "").toLowerCase() === "paid").length} Paid
                    </span>
                    <span>Thermal Ready</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#141419] border border-[#202028] shadow-lg space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Active Subscriptions
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {
                      customersList.filter(
                        (c) =>
                          c.plan &&
                          c.plan !== "No Active Plan" &&
                          c.status !== "No Membership",
                      ).length
                    }
                    <span className="text-xs font-normal text-slate-400 ml-1.5">Athletes</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                    <span className="text-purple-400">Pass Privileges</span>
                    <span>Biometrics Active</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#141419] border border-[#202028] shadow-lg space-y-3 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Average Order Value
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                      <Activity size={16} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹
                    {paymentsList.length > 0
                      ? Math.round(
                          paymentsList.reduce(
                            (sum, p) => sum + (Number(p.amount) || 0),
                            0,
                          ) / paymentsList.length,
                        ).toLocaleString("en-IN")
                      : "0"}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                    <span className="text-blue-400">Per Member</span>
                    <span>GST Inclusive</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 rounded-3xl bg-[#141419] border border-[#202028] shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Channel Filter Chips with Counters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  {[
                    { id: "all", label: "All Records", count: paymentsList.length },
                    {
                      id: "card",
                      label: "Card Gateway",
                      count: paymentsList.filter((p) => (p.method || "").toLowerCase().includes("card")).length,
                    },
                    {
                      id: "upi",
                      label: "UPI Instant",
                      count: paymentsList.filter((p) => (p.method || "").toLowerCase().includes("upi")).length,
                    },
                    {
                      id: "cash",
                      label: "POS Cash",
                      count: paymentsList.filter((p) => (p.method || "").toLowerCase().includes("cash")).length,
                    },
                  ].map((filterItem) => {
                    const isActive = paymentFilter === filterItem.id;
                    return (
                      <button
                        key={filterItem.id}
                        onClick={() => setPaymentFilter(filterItem.id)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-[#FF2E4C] text-white shadow-[0_0_12px_rgba(255,46,76,0.35)]"
                            : "bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <span>{filterItem.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                            isActive ? "bg-black/30 text-white" : "bg-white/10 text-slate-300"
                          }`}
                        >
                          {filterItem.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Search Bar */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-3 text-slate-400"
                  />
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Search invoice, member, plan..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] transition-all placeholder:text-slate-500"
                  />
                  {paymentSearch && (
                    <button
                      onClick={() => setPaymentSearch("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Modern Glassmorphic Billing Ledger Table */}
              <div className="rounded-3xl bg-[#141419] border border-[#202028] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#090C0E] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4 pl-6">Invoice ID & Date</th>
                        <th className="p-4">Athlete / Member</th>
                        <th className="p-4">Membership Plan</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Official Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {(() => {
                        const filtered = paymentsList.filter((pay) => {
                          if (
                            paymentFilter !== "all" &&
                            !(pay.method || "")
                              .toLowerCase()
                              .includes(paymentFilter.toLowerCase())
                          ) {
                            return false;
                          }
                          if (paymentSearch.trim()) {
                            const query = paymentSearch.toLowerCase();
                            const matchId = (pay.id || pay.invoiceId || "")
                              .toLowerCase()
                              .includes(query);
                            const matchCust = (pay.customer || "")
                              .toLowerCase()
                              .includes(query);
                            const matchEmail = (pay.customerEmail || "")
                              .toLowerCase()
                              .includes(query);
                            const matchPlan = (pay.plan || "")
                              .toLowerCase()
                              .includes(query);
                            if (!matchId && !matchCust && !matchEmail && !matchPlan)
                              return false;
                          }
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="p-12 text-center text-slate-400 space-y-2">
                                <CreditCard size={28} className="mx-auto text-slate-600 opacity-60" />
                                <p className="text-sm font-semibold text-slate-300">
                                  No transaction records found matching your filters.
                                </p>
                                <p className="text-xs text-slate-500">
                                  Try adjusting the search query or channel filter tab.
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((pay) => {
                          const planName = pay.plan || pay.planOrItem || "Membership Access";
                          const isElite = planName.toLowerCase().includes("elite");
                          const isPT = planName.toLowerCase().includes("pt") || planName.toLowerCase().includes("personal");
                          const isPro = planName.toLowerCase().includes("pro");

                          return (
                            <tr
                              key={pay.id || pay.invoiceId || pay._id}
                              className="hover:bg-white/[0.03] transition-colors group"
                            >
                              {/* Invoice ID & Date */}
                              <td className="p-4 pl-6">
                                <div className="font-mono font-bold text-[#FF2E4C] text-xs">
                                  {pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "INV-2026")}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                  <Calendar size={11} className="text-slate-500" />
                                  <span>{pay.date || (pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("en-IN") : "--")}</span>
                                </div>
                              </td>

                              {/* Customer Profile */}
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E2028] to-[#0E0F14] border border-white/10 text-white font-black text-xs flex items-center justify-center shrink-0">
                                    {(pay.customer || "U").charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-bold text-white block leading-tight">
                                      {pay.customer || "Athlete"}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-mono block">
                                      {pay.customerEmail || pay.customerPhone || "--"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Plan / Item */}
                              <td className="p-4">
                                <span
                                  className={`px-3 py-1 rounded-xl text-[11px] font-bold inline-block border ${
                                    isElite
                                      ? "bg-amber-950/60 text-amber-300 border-amber-800/60"
                                      : isPT
                                      ? "bg-cyan-950/60 text-cyan-300 border-cyan-800/60"
                                      : isPro
                                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                                      : "bg-white/5 text-slate-200 border-white/10"
                                  }`}
                                >
                                  {planName}
                                </span>
                              </td>

                              {/* Amount */}
                              <td className="p-4">
                                <div className="font-black text-white font-mono text-sm">
                                  ₹{Number(pay.amount || 0).toLocaleString("en-IN")}
                                </div>
                                <span className="text-[10px] text-emerald-400 font-mono">
                                  ● Tax Included
                                </span>
                              </td>

                              {/* Payment Method */}
                              <td className="p-4 text-slate-300">
                                <span className="flex items-center gap-1.5 font-medium text-xs">
                                  <CreditCard size={13} className="text-[#FF2E4C] shrink-0" />
                                  <span>{pay.method || "Online"}</span>
                                </span>
                              </td>

                              {/* Status */}
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1 ${
                                    (pay.status || "").toLowerCase() === "paid"
                                      ? "bg-emerald-950/70 text-emerald-400 border-emerald-800"
                                      : "bg-amber-950/70 text-amber-400 border-amber-800"
                                  }`}
                                >
                                  ✓ {pay.status || "Paid"}
                                </span>
                              </td>

                              {/* Actions: Download Invoice & Thermal Receipt */}
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleDownloadInvoice(pay)}
                                    title="Download Official Tax Invoice (HTML/PDF)"
                                    className="px-3 py-1.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                  >
                                    <Download size={13} />
                                    <span>Download</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setReceiptModalData({
                                        orderId: pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "INV-2026"),
                                        id: pay.id || pay.invoiceId || (pay._id ? `INV-${String(pay._id).slice(-6).toUpperCase()}` : "INV-2026"),
                                        date: pay.date || (pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("en-IN") : "Today"),
                                        time: "11:00 AM",
                                        customerName: pay.customer || "Titan Athlete",
                                        customerEmail: pay.customerEmail || "--",
                                        customerPhone: pay.customerPhone || "--",
                                        paymentMethod: pay.method || "Online",
                                        paymentStatus: "PAID & VERIFIED",
                                        subtotal: pay.amount || 0,
                                        tax: 0,
                                        amount: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                        total: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                        items: [
                                          {
                                            name: pay.plan || "Titan Membership Access Pass",
                                            qty: 1,
                                            price: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                            total: `₹${Number(pay.amount || 0).toLocaleString("en-IN")}`,
                                          },
                                        ],
                                        membershipTier: pay.plan,
                                        turnstileStatus: "Biometric Turnstile Active",
                                        gymBranch: "Titan Pulse HQ - High Performance Arena",
                                        cashier: "System Billing Controller",
                                      });
                                    }}
                                    title="View 3D Thermal Receipt"
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF2E4C] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                  >
                                    <Printer size={13} />
                                    <span>Receipt</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ATTENDANCE & ACCESS SECURITY CONTROL */}
          {activeTab === "attendance-monitoring" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Header & Quick Action Hub */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#101217]/90 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF2E4C]/20 to-[#FF2E4C]/5 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center shadow-inner shrink-0">
                    <CalendarCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Attendance & Access Security
                    </h2>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">
                      Real-time biometric turnstile telemetry, trainer floor duty shifts, and front desk logs.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Biometrics Online
                  </div>

                  <button
                    onClick={() => {
                      fetchUsers();
                      showToast("✓ Synchronized live attendance scanner telemetry!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Sync Scanners</span>
                  </button>

                  <button
                    onClick={handleExportAttendanceCSV}
                    className="px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setShowManualAttendanceModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:bg-[#ff1f3f] text-white font-semibold text-xs flex items-center gap-2 shadow-[0_4px_16px_rgba(255,46,76,0.3)] transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Manual Check-In</span>
                  </button>
                </div>
              </div>

              {/* Attendance KPI Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Active Customers Inside */}
                <div
                  onClick={() => setAttendanceSubTab("customers")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 relative overflow-hidden group ${
                    attendanceSubTab === "customers"
                      ? "bg-gradient-to-b from-[#171a22] to-[#101217] border-[#FF2E4C]/80 ring-1 ring-[#FF2E4C]/30 shadow-[0_8px_24px_rgba(255,46,76,0.15)]"
                      : "bg-[#101217]/80 border-white/5 hover:border-white/20 hover:bg-[#13161e]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Athletes In Arena
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Users size={15} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums flex items-baseline gap-2">
                      <span>{customerAttendanceList.filter((c) => c.status === "Active Inside").length}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">
                        Inside Now
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-normal">
                      <span>Logged Today: {customerAttendanceList.length}</span>
                      <span className="text-emerald-400 font-medium">Active Pass</span>
                    </div>
                  </div>
                </div>

                {/* 2. Coaches On Duty */}
                <div
                  onClick={() => setAttendanceSubTab("trainers")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 relative overflow-hidden group ${
                    attendanceSubTab === "trainers"
                      ? "bg-gradient-to-b from-[#171a22] to-[#101217] border-[#FF2E4C]/80 ring-1 ring-[#FF2E4C]/30 shadow-[0_8px_24px_rgba(255,46,76,0.15)]"
                      : "bg-[#101217]/80 border-white/5 hover:border-white/20 hover:bg-[#13161e]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Coaches On Duty
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Dumbbell size={15} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums flex items-baseline gap-2">
                      <span>{trainerAttendanceList.filter((t) => t.status === "On Duty").length}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-sans font-medium">
                        Floor Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-normal">
                      <span>Total Registered: {trainerAttendanceList.length}</span>
                      <span className="text-cyan-400 font-medium">Floor Staff</span>
                    </div>
                  </div>
                </div>

                {/* 3. Front Desk Online */}
                <div
                  onClick={() => setAttendanceSubTab("receptionists")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 relative overflow-hidden group ${
                    attendanceSubTab === "receptionists"
                      ? "bg-gradient-to-b from-[#171a22] to-[#101217] border-[#FF2E4C]/80 ring-1 ring-[#FF2E4C]/30 shadow-[0_8px_24px_rgba(255,46,76,0.15)]"
                      : "bg-[#101217]/80 border-white/5 hover:border-white/20 hover:bg-[#13161e]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Reception Desk
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <UserCheck size={15} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums flex items-baseline gap-2">
                      <span>{receptionistAttendanceList.filter((r) => r.status === "Online").length}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans font-medium">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-normal">
                      <span>Staff Count: {receptionistAttendanceList.length}</span>
                      <span className="text-amber-400 font-medium">Concierge</span>
                    </div>
                  </div>
                </div>

                {/* 4. Total Daily Gate Scans */}
                <div
                  onClick={() => setAttendanceSubTab("all")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 relative overflow-hidden group ${
                    attendanceSubTab === "all"
                      ? "bg-gradient-to-b from-[#171a22] to-[#101217] border-[#FF2E4C]/80 ring-1 ring-[#FF2E4C]/30 shadow-[0_8px_24px_rgba(255,46,76,0.15)]"
                      : "bg-[#101217]/80 border-white/5 hover:border-white/20 hover:bg-[#13161e]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Daily Turnstile Passes
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center">
                      <Zap size={15} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums flex items-baseline gap-2">
                      <span>
                        {customerAttendanceList.length +
                          trainerAttendanceList.filter((t) => t.status === "On Duty").length +
                          receptionistAttendanceList.filter((r) => r.status === "Online").length}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF2E4C]/10 text-[#FF2E4C] border border-[#FF2E4C]/20 font-sans font-medium">
                        Today
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-normal">
                      <span>NFC & QR Verification</span>
                      <span className="text-emerald-400 font-medium">100% Synced</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tab Navigation Bar & Realtime Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-2 rounded-2xl bg-[#101217]/90 border border-white/10 backdrop-blur-md">
                {/* Segmented Category Switcher */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0c10] p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setAttendanceSubTab("customers")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      attendanceSubTab === "customers"
                        ? "bg-[#FF2E4C] text-white shadow-[0_2px_10px_rgba(255,46,76,0.3)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Users size={14} />
                    <span>Customer Attendance</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${attendanceSubTab === "customers" ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"}`}>
                      {customerAttendanceList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAttendanceSubTab("trainers")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      attendanceSubTab === "trainers"
                        ? "bg-[#FF2E4C] text-white shadow-[0_2px_10px_rgba(255,46,76,0.3)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Dumbbell size={14} />
                    <span>Trainer Attendance</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${attendanceSubTab === "trainers" ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"}`}>
                      {trainerAttendanceList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAttendanceSubTab("receptionists")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      attendanceSubTab === "receptionists"
                        ? "bg-[#FF2E4C] text-white shadow-[0_2px_10px_rgba(255,46,76,0.3)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>Receptionist Attendance</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${attendanceSubTab === "receptionists" ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"}`}>
                      {receptionistAttendanceList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAttendanceSubTab("all")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      attendanceSubTab === "all"
                        ? "bg-[#FF2E4C] text-white shadow-[0_2px_10px_rgba(255,46,76,0.3)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Zap size={14} />
                    <span>All Gate Logs</span>
                  </button>
                </div>

                {/* Search Bar and Status Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search name, ID, terminal..."
                      value={attendanceSearch}
                      onChange={(e) => setAttendanceSearch(e.target.value)}
                      className="w-full pl-9 pr-7 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] placeholder:text-slate-500"
                    />
                    {attendanceSearch && (
                      <button
                        onClick={() => setAttendanceSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <select
                    value={attendanceStatusFilter}
                    onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-slate-300 text-xs outline-none focus:border-[#FF2E4C] cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="active">Active Inside / On Duty</option>
                    <option value="inactive">Checked Out / Off Duty</option>
                  </select>
                </div>
              </div>

              {/* VIEW 1: CUSTOMER ATTENDANCE TABLE */}
              {attendanceSubTab === "customers" && (
                <div className="rounded-2xl bg-[#101217]/90 border border-white/10 overflow-hidden shadow-xl">
                  <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0a0c10]/60">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-[#FF2E4C]" />
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Customer & Athlete Turnstile Access Stream
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {customerAttendanceList.length} Registered Records
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0a0c10] text-slate-400 uppercase font-medium text-[11px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="py-3 px-4 pl-6">Athlete / Member</th>
                          <th className="py-3 px-4">Membership Plan</th>
                          <th className="py-3 px-4">Gate Terminal</th>
                          <th className="py-3 px-4">Time In</th>
                          <th className="py-3 px-4">Time Out</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Access Status</th>
                          <th className="py-3 px-4 pr-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-300">
                        {(() => {
                          const filtered = customerAttendanceList.filter((c) => {
                            const q = attendanceSearch.toLowerCase();
                            const matchSearch =
                              !q ||
                              c.name?.toLowerCase().includes(q) ||
                              c.memberId?.toLowerCase().includes(q) ||
                              c.email?.toLowerCase().includes(q) ||
                              c.gate?.toLowerCase().includes(q) ||
                              c.plan?.toLowerCase().includes(q);

                            const isInside = c.status === "Active Inside";
                            const matchStatus =
                              attendanceStatusFilter === "all" ||
                              (attendanceStatusFilter === "active" && isInside) ||
                              (attendanceStatusFilter === "inactive" && !isInside);

                            return matchSearch && matchStatus;
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="p-10 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <Users size={28} className="text-slate-600" />
                                    <span>No customer attendance records found matching your filters.</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((c) => {
                            const isInside = c.status === "Active Inside";
                            return (
                              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4 pl-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2E4C] to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                                      {c.name ? c.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white flex items-center gap-1.5">
                                        <span>{c.name}</span>
                                        {isInside && (
                                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-mono">
                                        {c.memberId} • {c.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border uppercase ${
                                      c.plan?.includes("ELITE")
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : c.plan?.includes("PT VIP")
                                        ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                    }`}
                                  >
                                    {c.plan}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-normal text-slate-300">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={12} className="text-[#FF2E4C]" />
                                    <span>{c.gate}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                                  {c.timeIn}
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-400">
                                  {c.timeOut || "--"}
                                </td>

                                <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                                  {c.duration}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${
                                      isInside
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-800/40 text-slate-400 border-white/5"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isInside ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                                      }`}
                                    />
                                    {c.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 pr-6 text-right">
                                  <button
                                    onClick={() => handleToggleCustomerAttendance(c.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1 ${
                                      isInside
                                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                    }`}
                                  >
                                    {isInside ? "Check Out" : "Check In"}
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 2: TRAINER ATTENDANCE TABLE */}
              {attendanceSubTab === "trainers" && (
                <div className="rounded-2xl bg-[#101217]/90 border border-white/10 overflow-hidden shadow-xl">
                  <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0a0c10]/60">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={15} className="text-cyan-400" />
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Master Coach & Trainer Duty Shifts
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {trainerAttendanceList.filter((t) => t.status === "On Duty").length} /{" "}
                      {trainerAttendanceList.length} Coaches On Duty
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0a0c10] text-slate-400 uppercase font-medium text-[11px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="py-3 px-4 pl-6">Master Coach</th>
                          <th className="py-3 px-4">Specialization</th>
                          <th className="py-3 px-4">Shift Timings</th>
                          <th className="py-3 px-4">Assigned Zone</th>
                          <th className="py-3 px-4">Time In</th>
                          <th className="py-3 px-4">Duty Logged</th>
                          <th className="py-3 px-4">Duty Status</th>
                          <th className="py-3 px-4 pr-6 text-right">Shift Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-300">
                        {(() => {
                          const filtered = trainerAttendanceList.filter((t) => {
                            const q = attendanceSearch.toLowerCase();
                            const matchSearch =
                              !q ||
                              t.name?.toLowerCase().includes(q) ||
                              t.trainerId?.toLowerCase().includes(q) ||
                              t.spec?.toLowerCase().includes(q) ||
                              t.shift?.toLowerCase().includes(q) ||
                              t.zone?.toLowerCase().includes(q);

                            const isOnDuty = t.status === "On Duty";
                            const matchStatus =
                              attendanceStatusFilter === "all" ||
                              (attendanceStatusFilter === "active" && isOnDuty) ||
                              (attendanceStatusFilter === "inactive" && !isOnDuty);

                            return matchSearch && matchStatus;
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="p-10 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <Dumbbell size={28} className="text-slate-600" />
                                    <span>No trainer duty records found matching your filters.</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((t) => {
                            const isOnDuty = t.status === "On Duty";
                            const isOnBreak = t.status === "On Break";
                            return (
                              <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4 pl-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                                      {t.name ? t.name.charAt(0).toUpperCase() : "T"}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white flex items-center gap-1.5">
                                        <span>{t.name}</span>
                                        {isOnDuty && (
                                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-mono">
                                        {t.trainerId}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-slate-300 font-normal">{t.spec}</td>

                                <td className="py-3.5 px-4 font-mono text-xs text-amber-300">
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-amber-400" />
                                    <span>{t.shift}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-slate-300 font-normal">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={12} className="text-cyan-400" />
                                    <span>{t.zone}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                                  {t.timeIn || "--"}
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-300">
                                  {t.dutyHours}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${
                                      isOnDuty
                                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                        : isOnBreak
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-slate-800/40 text-slate-400 border-white/5"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isOnDuty
                                          ? "bg-cyan-400 animate-pulse"
                                          : isOnBreak
                                          ? "bg-amber-400"
                                          : "bg-slate-500"
                                      }`}
                                    />
                                    {t.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 pr-6 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleToggleTrainerDuty(t.id, "On Duty")}
                                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-medium border border-cyan-500/20 transition-all cursor-pointer"
                                    >
                                      On Duty
                                    </button>
                                    <button
                                      onClick={() => handleToggleTrainerDuty(t.id, "On Break")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-medium border border-amber-500/20 transition-all cursor-pointer"
                                    >
                                      Break
                                    </button>
                                    <button
                                      onClick={() => handleToggleTrainerDuty(t.id, "Off Duty")}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-white/10 transition-all cursor-pointer"
                                    >
                                      Off
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: RECEPTIONIST ATTENDANCE TABLE */}
              {attendanceSubTab === "receptionists" && (
                <div className="rounded-2xl bg-[#101217]/90 border border-white/10 overflow-hidden shadow-xl">
                  <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0a0c10]/60">
                    <div className="flex items-center gap-2">
                      <UserCheck size={15} className="text-amber-400" />
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Front Desk & Concierge Terminal Logs
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {receptionistAttendanceList.filter((r) => r.status === "Online").length} /{" "}
                      {receptionistAttendanceList.length} Reception Staff Online
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0a0c10] text-slate-400 uppercase font-medium text-[11px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="py-3 px-4 pl-6">Staff Member</th>
                          <th className="py-3 px-4">Desk Station</th>
                          <th className="py-3 px-4">Shift Timings</th>
                          <th className="py-3 px-4">Punch In</th>
                          <th className="py-3 px-4">Duty Hours</th>
                          <th className="py-3 px-4">Scans Processed</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 pr-6 text-right">Terminal Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-300">
                        {(() => {
                          const filtered = receptionistAttendanceList.filter((r) => {
                            const q = attendanceSearch.toLowerCase();
                            const matchSearch =
                              !q ||
                              r.name?.toLowerCase().includes(q) ||
                              r.staffId?.toLowerCase().includes(q) ||
                              r.desk?.toLowerCase().includes(q) ||
                              r.shift?.toLowerCase().includes(q);

                            const isOnline = r.status === "Online";
                            const matchStatus =
                              attendanceStatusFilter === "all" ||
                              (attendanceStatusFilter === "active" && isOnline) ||
                              (attendanceStatusFilter === "inactive" && !isOnline);

                            return matchSearch && matchStatus;
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="p-10 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <UserCheck size={28} className="text-slate-600" />
                                    <span>No receptionist records found matching your filters.</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((r) => {
                            const isOnline = r.status === "Online";
                            const isOnBreak = r.status === "On Break";
                            return (
                              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4 pl-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                                      {r.name ? r.name.charAt(0).toUpperCase() : "R"}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white flex items-center gap-1.5">
                                        <span>{r.name}</span>
                                        {isOnline && (
                                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-mono">
                                        {r.staffId}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-slate-300 font-normal">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={12} className="text-amber-400" />
                                    <span>{r.desk}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-slate-400" />
                                    <span>{r.shift}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                                  {r.timeIn || "--"}
                                </td>

                                <td className="py-3.5 px-4 font-mono text-slate-300">{r.dutyHours}</td>

                                <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">
                                  {r.scansProcessed} passes
                                </td>

                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${
                                      isOnline
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : isOnBreak
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-slate-800/40 text-slate-400 border-white/5"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isOnline
                                          ? "bg-emerald-400 animate-pulse"
                                          : isOnBreak
                                          ? "bg-amber-400"
                                          : "bg-slate-500"
                                      }`}
                                    />
                                    {r.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 pr-6 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleToggleReceptionistDuty(r.id, "Online")}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-medium border border-emerald-500/20 transition-all cursor-pointer"
                                    >
                                      Online
                                    </button>
                                    <button
                                      onClick={() => handleToggleReceptionistDuty(r.id, "On Break")}
                                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-medium border border-amber-500/20 transition-all cursor-pointer"
                                    >
                                      Break
                                    </button>
                                    <button
                                      onClick={() => handleToggleReceptionistDuty(r.id, "Offline")}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-white/10 transition-all cursor-pointer"
                                    >
                                      Offline
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 4: ALL LIVE GATE LOGS (CHRONOLOGICAL STREAM) */}
              {attendanceSubTab === "all" && (
                <div className="rounded-2xl bg-[#101217]/90 border border-white/10 overflow-hidden shadow-xl">
                  <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0a0c10]/60">
                    <div className="flex items-center gap-2">
                      <Zap size={15} className="text-[#FF2E4C]" />
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Master Unified Gate Access Feed
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      All Terminals & Gates Active
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0a0c10] text-slate-400 uppercase font-medium text-[11px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="py-3 px-4 pl-6">Role / Category</th>
                          <th className="py-3 px-4">Entity ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Gate / Terminal / Floor</th>
                          <th className="py-3 px-4">Time In</th>
                          <th className="py-3 px-4">Time Out</th>
                          <th className="py-3 px-4 pr-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-300">
                        {/* Combined stream */}
                        {customerAttendanceList.map((c) => (
                          <tr key={`all-${c.id}`} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 pl-6">
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold uppercase">
                                Customer
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400">{c.memberId}</td>
                            <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                            <td className="py-3 px-4 text-slate-300">{c.gate}</td>
                            <td className="py-3 px-4 font-mono text-emerald-400">{c.timeIn}</td>
                            <td className="py-3 px-4 font-mono text-slate-400">{c.timeOut}</td>
                            <td className="py-3 px-4 pr-6 text-right">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                                  c.status === "Active Inside"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-slate-800/40 text-slate-400 border-white/5"
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {trainerAttendanceList.map((t) => (
                          <tr key={`all-${t.id}`} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 pl-6">
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-semibold uppercase">
                                Trainer Coach
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400">{t.trainerId}</td>
                            <td className="py-3 px-4 font-semibold text-white">{t.name}</td>
                            <td className="py-3 px-4 text-slate-300">{t.zone}</td>
                            <td className="py-3 px-4 font-mono text-emerald-400">{t.timeIn}</td>
                            <td className="py-3 px-4 font-mono text-slate-400">{t.timeOut}</td>
                            <td className="py-3 px-4 pr-6 text-right">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                                  t.status === "On Duty"
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                    : "bg-slate-800/40 text-slate-400 border-white/5"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {receptionistAttendanceList.map((r) => (
                          <tr key={`all-${r.id}`} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 pl-6">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold uppercase">
                                Receptionist
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400">{r.staffId}</td>
                            <td className="py-3 px-4 font-semibold text-white">{r.name}</td>
                            <td className="py-3 px-4 text-slate-300">{r.desk}</td>
                            <td className="py-3 px-4 font-mono text-emerald-400">{r.timeIn}</td>
                            <td className="py-3 px-4 font-mono text-slate-400">{r.timeOut}</td>
                            <td className="py-3 px-4 pr-6 text-right">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                                  r.status === "Online"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-slate-800/40 text-slate-400 border-white/5"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: REPORTS AND ANALYTICS */}
          {activeTab === "reports-analytics" && (
            <Interactive3DAnalytics
              customersList={customersList}
              paymentsList={paymentsList}
              customerAttendanceList={customerAttendanceList}
              trainersList={trainersList}
              showToast={showToast}
            />
          )}

          {/* TAB 10: NOTIFICATIONS HUB */}
          {activeTab === "notifications" && (
            <AdminNotificationsHub
              notifications={allAdminNotifications}
              unreadCount={unreadNotifsCount}
              onMarkAllAsRead={handleMarkAllNotifsRead}
              onClearAll={handleClearAllNotifs}
              onDismissNotification={handleDismissNotif}
              onSelectNotificationAction={handleSelectNotificationAction}
              onSendBroadcast={handleSendAdminBroadcast}
              showToast={showToast}
            />
          )}

          {/* TAB 11: ENQUIRY MANAGEMENT */}
          {activeTab === "enquiry-management" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF2E4C] animate-ping" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Lead & Enquiry Pipeline CRM
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time front desk prospect capture, website queries, and conversion pipeline.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddEnquiryModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer transition-all"
                  >
                    <Plus size={15} /> Add Prospect Lead
                  </button>
                </div>
              </div>

              {/* Bento Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#121318] border border-[#202028] relative overflow-hidden">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Total Leads
                  </span>
                  <span className="text-2xl font-black text-white font-mono">
                    {enquiriesList.length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121318] border border-[#202028] relative overflow-hidden">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                    New Inquiries
                  </span>
                  <span className="text-2xl font-black text-blue-400 font-mono">
                    {enquiriesList.filter((e) => e.status === "New Lead").length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121318] border border-[#202028] relative overflow-hidden">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                    In Follow-Up / Trial
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {enquiriesList.filter((e) => ["Followed Up", "Trial Booked"].includes(e.status)).length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121318] border border-[#202028] relative overflow-hidden">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    Converted Members
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {enquiriesList.filter((e) => e.status === "Converted").length}
                  </span>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121318] p-3 rounded-2xl border border-[#202028]">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {["all", "New Lead", "Followed Up", "Trial Booked", "Converted", "Closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setEnquiryFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        enquiryFilter === status
                          ? "bg-[#FF2E4C] text-white shadow-md"
                          : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {status === "all" ? "All Pipeline" : status}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search prospect name, phone, goal..."
                    className="w-full pl-9 pr-3 py-2 bg-[#090C0E] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              {/* Pipeline Leads Ledger */}
              <div className="rounded-2xl bg-[#121318] border border-[#202028] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c1014] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#202028]">
                      <tr>
                        <th className="p-4">Lead ID</th>
                        <th className="p-4">Prospect Name</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Fitness Goal</th>
                        <th className="p-4">Source & Desk</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Pipeline Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {enquiriesList
                        .filter((enq) => {
                          if (enquiryFilter !== "all" && enq.status !== enquiryFilter) return false;
                          if (enquirySearch) {
                            const query = enquirySearch.toLowerCase();
                            return (
                              (enq.name || "").toLowerCase().includes(query) ||
                              (enq.phone || "").toLowerCase().includes(query) ||
                              (enq.email || "").toLowerCase().includes(query) ||
                              (enq.goal || "").toLowerCase().includes(query) ||
                              (enq.id || "").toLowerCase().includes(query)
                            );
                          }
                          return true;
                        })
                        .map((enq) => (
                          <tr key={enq.id || enq._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-slate-400 text-[11px]">
                              {enq.id || enq.enquiryId}
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-white">{enq.name}</div>
                              {enq.notes && (
                                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                                  "{enq.notes}"
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="text-white font-mono text-[11px]">{enq.phone}</div>
                              <div className="text-[10px] text-slate-400">{enq.email}</div>
                            </td>
                            <td className="p-4 text-[#FF2E4C] font-semibold">
                              {enq.goal}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10px] text-slate-300">
                                {enq.source || "Walk-in Visitor"}
                              </span>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                by {enq.capturedBy || "Reception Desk"}
                              </div>
                            </td>
                            <td className="p-4 text-slate-400 font-mono text-[11px]">
                              {enq.date}
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq.id || enq._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border outline-none cursor-pointer transition-all ${
                                  enq.status === "New Lead"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    : enq.status === "Followed Up"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : enq.status === "Trial Booked"
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                    : enq.status === "Converted"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                                }`}
                              >
                                <option value="New Lead">New Lead</option>
                                <option value="Followed Up">Followed Up</option>
                                <option value="Trial Booked">Trial Booked</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {enq.status !== "Converted" && (
                                  <button
                                    onClick={() => {
                                      handleUpdateEnquiryStatus(enq.id || enq._id, "Converted");
                                      showToast(`✓ Marked ${enq.name} as Converted member!`);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
                                  >
                                    Convert
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteEnquiry(enq.id || enq._id, enq.name)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Delete lead"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {enquiriesList.length === 0 && (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-slate-400 text-xs font-mono">
                            No prospect enquiry leads found. Front desk inquiries will appear here in real time.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADMIN ADD PROSPECT LEAD MODAL */}
              {showAddEnquiryModal && (
                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#121318] border border-[#202028] rounded-2xl p-6 space-y-4 shadow-2xl animate-scaleUp relative">
                    <button
                      onClick={() => setShowAddEnquiryModal(false)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center font-bold">
                        <Users size={16} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Capture Prospect Lead
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Register an enquiry into the CRM database.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateAdminEnquiry} className="space-y-3.5 text-xs">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Prospect Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newEnquiryForm.name}
                          onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, name: e.target.value })}
                          placeholder="e.g. Ramesh Reddy"
                          className="w-full px-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newEnquiryForm.phone}
                          onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newEnquiryForm.email}
                          onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, email: e.target.value })}
                          placeholder="ramesh@gmail.com"
                          className="w-full px-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">
                            Fitness Goal
                          </label>
                          <select
                            value={newEnquiryForm.goal}
                            onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, goal: e.target.value })}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="Muscle Gain & Hypertrophy">Muscle Gain</option>
                            <option value="Fat Loss & Cardio">Fat Loss</option>
                            <option value="Personal Training (1-on-1)">1-on-1 PT</option>
                            <option value="Elite VIP Access">Elite VIP</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-300 font-semibold mb-1 block">
                            Enquiry Source
                          </label>
                          <select
                            value={newEnquiryForm.source}
                            onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, source: e.target.value })}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="Walk-in Visitor">Walk-in Visitor</option>
                            <option value="Instagram / Social">Instagram / Social</option>
                            <option value="Member Referral">Member Referral</option>
                            <option value="Website Booking">Website Booking</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Internal Notes
                        </label>
                        <textarea
                          rows="2"
                          value={newEnquiryForm.notes}
                          onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, notes: e.target.value })}
                          placeholder="e.g. Interested in morning 6am batch and personal coach"
                          className="w-full px-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C] resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setShowAddEnquiryModal(false)}
                          className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:bg-[#ff1f3f] text-white text-xs font-semibold shadow-md cursor-pointer"
                        >
                          Save Lead
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  System & Gym Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure facility parameters, biometric scanner keys, and
                  database backup.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                    Facility Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">
                        Gym Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Titan Pulse 3D Fitness System"
                        className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        defaultValue="abhigangamolla@gmail.com"
                        className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white border-b border-white/10 pb-2">
                    Biometric Scanner Security
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Gate Terminal Scanner Hardware Protocol:{" "}
                      <strong className="text-emerald-400">
                        ACTIVE (v3.4)
                      </strong>
                    </span>
                    <button
                      onClick={() => showToast("Biometric scanner re-synced!")}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FF2E4C] text-white font-semibold cursor-pointer"
                    >
                      Re-sync Scanners
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => showToast("Settings saved successfully!")}
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
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
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[#8A94A0] hover:text-white"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="text-[#FF2E4C]" size={22} />
              <h3 className="text-xl font-black font-heading text-white uppercase">
                ADD NEW {modalType.toUpperCase()}
              </h3>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="text-[#8A94A0] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={formInputs.name}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, name: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8A94A0] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={formInputs.email}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, email: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8A94A0] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 Phone"
                  value={formInputs.phone}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, phone: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                />
              </div>

              {modalType === "user" && (
                <div>
                  <label className="text-[#8A94A0] block mb-1">
                    System Role
                  </label>
                  <select
                    value={formInputs.role}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, role: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="admin">Admin</option>
                    <option value="trainer">Trainer</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              )}

              {modalType === "trainer" && (
                <div>
                  <label className="text-[#8A94A0] block mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bodybuilding & HIIT"
                    value={formInputs.goal}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, goal: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#090C0E] border border-white/10 text-white outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg"
              >
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

      {/* EDIT STAFF MODAL (TRAINER & RECEPTIONIST) */}
      {showEditStaffModal && editingStaff && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141419] border border-[#202028] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp relative">
            <button
              onClick={() => {
                setShowEditStaffModal(false);
                setEditingStaff(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  editingStaff.role === "trainer"
                    ? "bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                <Edit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Edit{" "}
                  {editingStaff.role === "trainer"
                    ? "Trainer & Coach"
                    : "Receptionist / Front Desk"}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {editingStaff.id} • Database ID:{" "}
                  {editingStaff.userId || editingStaff.id}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStaffChanges} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              {editingStaff.role === "trainer" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Specialization & Title
                  </label>
                  <input
                    type="text"
                    value={editingStaff.spec || ""}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, spec: e.target.value })
                    }
                    placeholder="e.g. Master Strength & Conditioning Coach"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Shift Timings
                  </label>
                  <select
                    value={editingStaff.shift}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        shift: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="06:00 AM - 02:00 PM">
                      Morning (06:00 AM - 02:00 PM)
                    </option>
                    <option value="02:00 PM - 10:00 PM">
                      Evening (02:00 PM - 10:00 PM)
                    </option>
                    <option value="10:00 PM - 06:00 AM">
                      Night (10:00 PM - 06:00 AM)
                    </option>
                    <option value="09:00 AM - 06:00 PM">
                      General (09:00 AM - 06:00 PM)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Duty / Account Status
                  </label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    {editingStaff.role === "trainer" ? (
                      <>
                        <option value="On Duty">On Duty</option>
                        <option value="Off Duty">Off Duty</option>
                        <option value="On Leave">On Leave</option>
                      </>
                    ) : (
                      <>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="On Break">On Break</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStaffModal(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg cursor-pointer transition-all ${
                    editingStaff.role === "trainer"
                      ? "bg-[#FF2E4C] hover:brightness-110"
                      : "bg-amber-500 hover:bg-amber-600 text-black"
                  }`}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE STAFF CONFIRMATION MODAL */}
      {showDeleteConfirmModal && staffToDelete && (
        <div className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(255,46,76,0.25)] animate-scaleUp">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Remove{" "}
                  {staffToDelete.role === "trainer" ? "Coach" : "Receptionist"}
                </h3>
                <p className="text-xs text-red-400 font-medium">
                  Permanent database deletion
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#090C0E] p-4 rounded-2xl border border-white/5">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-bold">
                {staffToDelete.name}
              </strong>{" "}
              ({staffToDelete.id}) from the database? This action cannot be
              undone and will revoke all system credentials immediately.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setStaffToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStaff}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/40 cursor-pointer transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. EDIT CUSTOMER PROFILE MODAL */}
      {showEditCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#141419] border border-[#202028] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowEditCustomerModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF2E4C]/20 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center font-bold">
                <Edit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Edit Customer Profile
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedCustomer.id} • Database ID: {selectedCustomer.userId || selectedCustomer.id}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomerProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={editCustomerForm.name}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={editCustomerForm.email}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    value={editCustomerForm.phone}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Gender</label>
                  <select
                    value={editCustomerForm.gender}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
                  <input
                    type="date"
                    value={editCustomerForm.dob}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, dob: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Height</label>
                  <input
                    type="text"
                    value={editCustomerForm.height}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, height: e.target.value })}
                    placeholder="178 cm"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Weight</label>
                  <input
                    type="text"
                    value={editCustomerForm.weight}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, weight: e.target.value })}
                    placeholder="76 kg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Body Fat %</label>
                  <input
                    type="text"
                    value={editCustomerForm.bodyFat}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, bodyFat: e.target.value })}
                    placeholder="14.2%"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Blood Group</label>
                  <select
                    value={editCustomerForm.bloodGroup}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Street Address</label>
                <input
                  type="text"
                  value={editCustomerForm.street}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, street: e.target.value })}
                  placeholder="Flat 402, Titan Heights, Road No. 36"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={editCustomerForm.city}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, city: e.target.value })}
                    placeholder="Hyderabad"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    value={editCustomerForm.state}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, state: e.target.value })}
                    placeholder="Telangana"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Account Status</label>
                  <select
                    value={editCustomerForm.status}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="Active">Active</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditCustomerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white text-xs font-bold shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHANGE MEMBERSHIP PLAN MODAL */}
      {showCustomerPlanModal && selectedCustomer && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141419] border border-[#202028] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp relative">
            <button
              onClick={() => setShowCustomerPlanModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF2E4C]/20 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Update Membership Plan
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Member: {selectedCustomer.name} ({selectedCustomer.id})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomerMembership} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Membership Tier</label>
                <select
                  value={customerPlanForm.plan}
                  onChange={(e) => {
                    const newPlanName = e.target.value;
                    const matchedPlan =
                      plansList.find(
                        (p) =>
                          p.name?.toLowerCase() === newPlanName.toLowerCase() ||
                          p.id?.toLowerCase() === newPlanName.toLowerCase()
                      ) || plansList[0];

                    let calculatedAmount = matchedPlan?.price || 2499;
                    if (customerPlanForm.duration === "Quarterly") {
                      calculatedAmount =
                        matchedPlan?.quarterlyPrice ||
                        (matchedPlan?.price ? matchedPlan.price * 3 - 500 : 6999);
                    } else if (customerPlanForm.duration === "Annual") {
                      calculatedAmount =
                        matchedPlan?.annualPrice ||
                        (matchedPlan?.price ? matchedPlan.price * 10 : 24999);
                    }

                    setCustomerPlanForm({
                      ...customerPlanForm,
                      plan: newPlanName,
                      amount: calculatedAmount,
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                >
                  {plansList.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (₹{Number(p.price || 0).toLocaleString("en-IN")}/mo | ₹{Number(p.annualPrice || (p.price * 10)).toLocaleString("en-IN")}/yr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Billing Cycle</label>
                  <select
                    value={customerPlanForm.duration}
                    onChange={(e) => {
                      const newDuration = e.target.value;
                      const matchedPlan =
                        plansList.find(
                          (p) =>
                            p.name?.toLowerCase() === customerPlanForm.plan?.toLowerCase() ||
                            p.id?.toLowerCase() === customerPlanForm.plan?.toLowerCase()
                        ) || plansList[0];

                      let calculatedAmount = matchedPlan?.price || 2499;
                      if (newDuration === "Quarterly") {
                        calculatedAmount =
                          matchedPlan?.quarterlyPrice ||
                          (matchedPlan?.price ? matchedPlan.price * 3 - 500 : 6999);
                      } else if (newDuration === "Annual") {
                        calculatedAmount =
                          matchedPlan?.annualPrice ||
                          (matchedPlan?.price ? matchedPlan.price * 10 : 24999);
                      }

                      setCustomerPlanForm({
                        ...customerPlanForm,
                        duration: newDuration,
                        amount: calculatedAmount,
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="Monthly">Monthly Cycle</option>
                    <option value="Quarterly">Quarterly Cycle (3 Months)</option>
                    <option value="Annual">Annual Cycle (12 Months)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Amount Charged (₹)</label>
                  <input
                    type="number"
                    value={customerPlanForm.amount}
                    onChange={(e) => setCustomerPlanForm({ ...customerPlanForm, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Method</label>
                <select
                  value={customerPlanForm.paymentMethod}
                  onChange={(e) => setCustomerPlanForm({ ...customerPlanForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                >
                  <option value="Card (Online)">Card (Online / Razorpay)</option>
                  <option value="UPI / Instant Transfer">UPI / Instant Transfer (GPay / PhonePe)</option>
                  <option value="Cash at Reception">Cash at Reception POS</option>
                  <option value="Bank Wire">Bank Wire Transfer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCustomerPlanModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white text-xs font-bold shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} /> Activate New Membership Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ASSIGN MASTER COACH MODAL */}
      {showCustomerAssignTrainerModal && selectedCustomer && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141419] border border-purple-800/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-scaleUp relative">
            <button
              onClick={() => setShowCustomerAssignTrainerModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 text-purple-300 flex items-center justify-center font-bold">
                <Dumbbell size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Assign Master Coach
                </h3>
                <p className="text-xs text-purple-400 font-mono">
                  Member: {selectedCustomer.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomerTrainer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Master Coach</label>
                <select
                  value={customerAssignTrainerForm.trainerName}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const matched = trainersList.find((t) => t.name === selectedName);
                    setCustomerAssignTrainerForm({
                      trainerName: selectedName,
                      trainerId: matched ? matched.userId || matched.id : "",
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose Coach from Roster --</option>
                  {trainersList.map((t) => (
                    <option key={t.id || t.userId} value={t.name}>
                      {t.name} ({t.spec || "Master Coach"}) • {t.shift}
                    </option>
                  ))}
                  <option value="Vikram Malhotra">Vikram Malhotra (Elite Strength & Conditioning)</option>
                  <option value="Marcus 'Titan' Vance">Marcus 'Titan' Vance (Hypertrophy Master)</option>
                  <option value="Elena Rostova">Elena Rostova (Olympic Weightlifting Specialist)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 block">
                  Assigning a coach grants them direct access to review telemetry, update workout splits, and log performance audits for {selectedCustomer.name}.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCustomerAssignTrainerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customerAssignTrainerForm.trainerName}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <CheckCheck size={14} /> Assign Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT COACHING PROTOCOLS & DIET MODAL */}
      {showEditCoachingModal && selectedCustomer && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#141419] border border-[#202028] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowEditCoachingModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF2E4C]/20 border border-[#FF2E4C]/30 text-[#FF2E4C] flex items-center justify-center font-bold">
                <Flame size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Update Workout & Nutrition Matrix
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Member: {selectedCustomer.name} ({selectedCustomer.id})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomerCoaching} className="space-y-5">
              {/* Section 1: Workout Split */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#FF2E4C]">
                  <Flame size={14} /> 1. Resistance & Training Split
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Training Split</label>
                    <input
                      type="text"
                      value={coachingEditForm.split}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, split: e.target.value })}
                      placeholder="e.g. Push-Pull-Legs (Hypertrophy)"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Weekly Frequency</label>
                    <input
                      type="text"
                      value={coachingEditForm.frequency}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, frequency: e.target.value })}
                      placeholder="e.g. 5 Days / Week"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Target Intensity</label>
                    <input
                      type="text"
                      value={coachingEditForm.intensity}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, intensity: e.target.value })}
                      placeholder="e.g. High Intensity RPE 8-9"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Cardio Protocol</label>
                    <input
                      type="text"
                      value={coachingEditForm.cardioProtocol}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, cardioProtocol: e.target.value })}
                      placeholder="e.g. 20 Mins Incline Treadmill Post-Lift"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Workout Coaching Notes</label>
                  <textarea
                    rows="2"
                    value={coachingEditForm.customNotes}
                    onChange={(e) => setCoachingEditForm({ ...coachingEditForm, customNotes: e.target.value })}
                    placeholder="Focus on explosive concentric cadence and 3s eccentric squats."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Nutrition & Macros */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                  <Zap size={14} /> 2. Nutrition, Macros & Hydration
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Daily Calories</label>
                    <input
                      type="text"
                      value={coachingEditForm.dailyCalories}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, dailyCalories: e.target.value })}
                      placeholder="2,800 kcal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Protein Target</label>
                    <input
                      type="text"
                      value={coachingEditForm.protein}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, protein: e.target.value })}
                      placeholder="180g"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Carbs Target</label>
                    <input
                      type="text"
                      value={coachingEditForm.carbs}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, carbs: e.target.value })}
                      placeholder="320g"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Fats Target</label>
                    <input
                      type="text"
                      value={coachingEditForm.fats}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, fats: e.target.value })}
                      placeholder="65g"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Hydration Daily</label>
                    <input
                      type="text"
                      value={coachingEditForm.waterIntake}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, waterIntake: e.target.value })}
                      placeholder="4.0 Liters Daily"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Supplements Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={coachingEditForm.supplements}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, supplements: e.target.value })}
                      placeholder="Hydrolyzed Whey, Creatine 5g, BCAA, Omega 3"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meal Structure Protocol</label>
                  <input
                    type="text"
                    value={coachingEditForm.mealProtocol}
                    onChange={(e) => setCoachingEditForm({ ...coachingEditForm, mealProtocol: e.target.value })}
                    placeholder="4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 3: Strength PRs & Goals */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-amber-400">
                  <Award size={14} /> 3. Core PR Records & Target Goal
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Bench Press PR</label>
                    <input
                      type="text"
                      value={coachingEditForm.benchPressPR}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, benchPressPR: e.target.value })}
                      placeholder="110 kg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Squat PR</label>
                    <input
                      type="text"
                      value={coachingEditForm.squatPR}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, squatPR: e.target.value })}
                      placeholder="150 kg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Deadlift PR</label>
                    <input
                      type="text"
                      value={coachingEditForm.deadliftPR}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, deadliftPR: e.target.value })}
                      placeholder="190 kg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Target Body Weight</label>
                    <input
                      type="text"
                      value={coachingEditForm.targetWeight}
                      onChange={(e) => setCoachingEditForm({ ...coachingEditForm, targetWeight: e.target.value })}
                      placeholder="80 kg Lean Mass"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Add New Audit / Coach Note */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity size={13} className="text-purple-400" /> Add New Performance Audit Note to Log
                </label>
                <textarea
                  rows="2"
                  value={coachingEditForm.trainerNote}
                  onChange={(e) => setCoachingEditForm({ ...coachingEditForm, trainerNote: e.target.value })}
                  placeholder="e.g. Excellent form progression on compound squats. Recommended moving working sets up by 5kg."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditCoachingModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E4C] hover:brightness-110 text-white text-xs font-bold shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <CheckCheck size={14} /> Save Coaching Protocols
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CUSTOMER CONFIRMATION MODAL */}
      {showCustomerDeleteModal && selectedCustomer && (
        <div className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(255,46,76,0.25)] animate-scaleUp">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Remove Customer
                </h3>
                <p className="text-xs text-red-400 font-medium">
                  Permanent member profile deletion
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#090C0E] p-4 rounded-2xl border border-white/5">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-bold">{selectedCustomer.name}</strong>{" "}
              ({selectedCustomer.id}) from the database? This action will remove all bio telemetry, active membership credentials, and coaching history.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomerDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCustomer}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/40 cursor-pointer transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ATTENDANCE & SHIFT PUNCH MODAL */}
      {showManualAttendanceModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp relative">
            <button
              onClick={() => setShowManualAttendanceModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center font-bold">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Manual Turnstile & Shift Punch
                </h3>
                <p className="text-xs text-slate-400 font-normal">
                  Log entry or exit for Athletes, Trainers, or Front Desk staff
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveManualAttendance} className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Category / Role
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#0a0c10] p-1 rounded-xl border border-white/5">
                  {[
                    { id: "customer", label: "Athlete", icon: Users },
                    { id: "trainer", label: "Coach", icon: Dumbbell },
                    { id: "receptionist", label: "Reception", icon: UserCheck },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() =>
                          setManualAttendanceForm({
                            ...manualAttendanceForm,
                            category: cat.id,
                            name: "",
                            userId: "",
                          })
                        }
                        className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          manualAttendanceForm.category === cat.id
                            ? "bg-[#FF2E4C] text-white shadow-md font-semibold"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon size={13} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Member / Staff */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Select {manualAttendanceForm.category === "customer" ? "Athlete / Member" : manualAttendanceForm.category === "trainer" ? "Trainer Coach" : "Receptionist Staff"}
                </label>
                <select
                  value={manualAttendanceForm.name}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    let foundId = "";
                    if (manualAttendanceForm.category === "customer") {
                      const found = customersList.find((c) => c.name === selectedName);
                      foundId = found ? found.id || found.userId : `TP-CUST-${Date.now().toString().slice(-3)}`;
                    } else if (manualAttendanceForm.category === "trainer") {
                      const found = trainersList.find((t) => t.name === selectedName);
                      foundId = found ? found.id || found.userId : `TRN-${Date.now().toString().slice(-3)}`;
                    } else {
                      const found = receptionistsList.find((r) => r.name === selectedName);
                      foundId = found ? found.id || found.userId : `REC-${Date.now().toString().slice(-3)}`;
                    }

                    setManualAttendanceForm({
                      ...manualAttendanceForm,
                      name: selectedName,
                      userId: foundId,
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] cursor-pointer"
                  required
                >
                  <option value="">-- Choose Name from Database --</option>
                  {manualAttendanceForm.category === "customer" && (
                    customersList.length === 0 ? (
                      <option disabled value="">No customers found in database</option>
                    ) : (
                      customersList.map((c) => (
                        <option key={c.id || c.userId} value={c.name}>
                          {c.name} ({c.id}) • {c.plan}
                        </option>
                      ))
                    )
                  )}
                  {manualAttendanceForm.category === "trainer" && (
                    trainersList.length === 0 ? (
                      <option disabled value="">No trainers found in database</option>
                    ) : (
                      trainersList.map((t) => (
                        <option key={t.id || t.userId} value={t.name}>
                          {t.name} ({t.spec || "Coach"}) • {t.shift}
                        </option>
                      ))
                    )
                  )}
                  {manualAttendanceForm.category === "receptionist" && (
                    receptionistsList.length === 0 ? (
                      <option disabled value="">No receptionists found in database</option>
                    ) : (
                      receptionistsList.map((r) => (
                        <option key={r.id || r.userId} value={r.name}>
                          {r.name} ({r.desk || "Front Desk"}) • {r.shift}
                        </option>
                      ))
                    )
                  )}
                </select>
              </div>

              {/* Gate / Desk and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    {manualAttendanceForm.category === "receptionist" ? "Desk Station" : "Gate / Zone"}
                  </label>
                  <select
                    value={
                      manualAttendanceForm.category === "receptionist"
                        ? manualAttendanceForm.desk
                        : manualAttendanceForm.gate
                    }
                    onChange={(e) =>
                      setManualAttendanceForm({
                        ...manualAttendanceForm,
                        gate: e.target.value,
                        desk: e.target.value,
                        zone: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] cursor-pointer"
                  >
                    {manualAttendanceForm.category === "customer" ? (
                      <>
                        <option value="Turnstile Gate Alpha-1">Turnstile Gate Alpha-1</option>
                        <option value="Turnstile Gate Bravo-2">Turnstile Gate Bravo-2</option>
                        <option value="VIP Express Portal">VIP Express Portal</option>
                        <option value="Biometric Scanner Main">Biometric Scanner Main</option>
                      </>
                    ) : manualAttendanceForm.category === "trainer" ? (
                      <>
                        <option value="Main Olympic Floor">Main Olympic Floor</option>
                        <option value="Calisthenics Arena">Calisthenics Arena</option>
                        <option value="Sprint & HIIT Studio">Sprint & HIIT Studio</option>
                        <option value="Recovery Lounge">Recovery Lounge</option>
                      </>
                    ) : (
                      <>
                        <option value="Front Desk Concierge Alpha">Front Desk Concierge Alpha</option>
                        <option value="VIP Concierge & Gate Portal">VIP Concierge & Gate Portal</option>
                        <option value="Front Desk Concierge Bravo">Front Desk Concierge Bravo</option>
                        <option value="Night Access & Security Hub">Night Access & Security Hub</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Status</label>
                  <select
                    value={manualAttendanceForm.status}
                    onChange={(e) =>
                      setManualAttendanceForm({
                        ...manualAttendanceForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] cursor-pointer"
                  >
                    {manualAttendanceForm.category === "customer" ? (
                      <>
                        <option value="Active Inside">Active Inside (Checked In)</option>
                        <option value="Checked Out">Checked Out</option>
                      </>
                    ) : manualAttendanceForm.category === "trainer" ? (
                      <>
                        <option value="On Duty">On Duty (Active Floor)</option>
                        <option value="On Break">On Break</option>
                        <option value="Off Duty">Off Duty</option>
                      </>
                    ) : (
                      <>
                        <option value="Online">Online (Desk Active)</option>
                        <option value="On Break">On Break</option>
                        <option value="Offline">Offline</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Time In and Shift Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Time In</label>
                  <input
                    type="text"
                    value={manualAttendanceForm.timeIn}
                    onChange={(e) =>
                      setManualAttendanceForm({
                        ...manualAttendanceForm,
                        timeIn: e.target.value,
                      })
                    }
                    placeholder="e.g. 08:30 AM"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Shift Timings</label>
                  <select
                    value={manualAttendanceForm.shift}
                    onChange={(e) =>
                      setManualAttendanceForm({
                        ...manualAttendanceForm,
                        shift: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C] cursor-pointer"
                  >
                    <option value="Morning (06:00 AM - 02:00 PM)">Morning (06:00 AM - 02:00 PM)</option>
                    <option value="Evening (02:00 PM - 10:00 PM)">Evening (02:00 PM - 10:00 PM)</option>
                    <option value="Night (10:00 PM - 06:00 AM)">Night (10:00 PM - 06:00 AM)</option>
                    <option value="General (09:00 AM - 06:00 PM)">General (09:00 AM - 06:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowManualAttendanceModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0a0c10] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:bg-[#ff1f3f] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(255,46,76,0.3)] cursor-pointer transition-all"
                >
                  Log Attendance Punch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3D THERMAL RECEIPT & OFFICIAL TAX INVOICE MODAL */}
      {receiptModalData && (
        <ThermalReceiptPrinter
          orderDetails={receiptModalData}
          onClose={() => setReceiptModalData(null)}
          onViewOrders={() => setActiveTab("payment-billing")}
        />
      )}

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
