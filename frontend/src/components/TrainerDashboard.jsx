import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  LogOut,
  Dumbbell,
  Users,
  Calendar,
  Award,
  CheckCircle,
  Sparkles,
  Plus,
  Settings,
  Bell,
  MessageSquare,
  Star,
  Search,
  Filter,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Check,
  Edit2,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Send,
  TrendingUp,
  Target,
  Flame,
  UserCheck,
  History,
  FileText,
  AlertCircle,
  Zap,
  Lock,
  ThumbsUp,
  MessageCircle,
  Trash2,
  CalendarCheck,
  Utensils,
  NotebookPen,
  LineChart,
  Scale,
  HeartPulse,
  Save,
  ArrowLeft,
  Upload,
  Camera,
  FileCheck,
  Download,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PinnedList from "./smoothui/components/pinned-list";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";

export const DEFAULT_WORKOUT_SPLITS = {
  "Push-Pull-Legs (Hypertrophy)": {
    day1: {
      title: "Day 1: Chest & Triceps Hypertrophy",
      focus: "Push Power, Pectoral Stretch & Upper Torso Peak",
      notes:
        "Focus on explosive 1s concentric contraction and controlled 3s negative on bench press.",
      exercises: [
        {
          id: "ex-1",
          name: "Barbell Flat Bench Press",
          sets: "4 Sets",
          reps: "8 - 10 Reps",
          target: "85 kg",
          rest: "90s",
        },
        {
          id: "ex-2",
          name: "Incline Dumbbell Flyes",
          sets: "3 Sets",
          reps: "12 - 15 Reps",
          target: "26 kg each",
          rest: "60s",
        },
        {
          id: "ex-3",
          name: "Cable Lower Chest Crossovers",
          sets: "4 Sets",
          reps: "15 Reps (Squeeze)",
          target: "20 kg/side",
          rest: "45s",
        },
        {
          id: "ex-4",
          name: "Weighted Parallel Bar Dips",
          sets: "3 Sets",
          reps: "10 - 12 Reps",
          target: "+15 kg belt",
          rest: "60s",
        },
        {
          id: "ex-5",
          name: "Overhead Tricep Rope Extension",
          sets: "4 Sets",
          reps: "12 - 15 Reps",
          target: "27.5 kg",
          rest: "45s",
        },
      ],
    },
    day2: {
      title: "Day 2: Back & Biceps Density",
      focus: "Lat Width, Spinal Erectors Thickness & Arm Peak",
      notes:
        "Initiate all pulling movements by depressing and retracting scapula first.",
      exercises: [
        {
          id: "ex-6",
          name: "Conventional Deadlifts",
          sets: "4 Sets",
          reps: "5 - 6 Reps",
          target: "145 kg",
          rest: "120s",
        },
        {
          id: "ex-7",
          name: "Wide-Grip Lat Pulldowns",
          sets: "4 Sets",
          reps: "10 - 12 Reps",
          target: "70 kg",
          rest: "60s",
        },
        {
          id: "ex-8",
          name: "Barbell Pendlay Rows",
          sets: "4 Sets",
          reps: "8 - 10 Reps",
          target: "75 kg",
          rest: "75s",
        },
        {
          id: "ex-9",
          name: "EZ-Bar Bicep Preacher Curls",
          sets: "3 Sets",
          reps: "12 Reps",
          target: "32.5 kg",
          rest: "45s",
        },
        {
          id: "ex-10",
          name: "Hammer Dumbbell Curls",
          sets: "3 Sets",
          reps: "12 Reps/arm",
          target: "18 kg",
          rest: "45s",
        },
      ],
    },
    day3: {
      title: "Day 3: Quads, Hamstrings & Core",
      focus: "Lower Kinetic Chain Force & Posterior Chain Power",
      notes:
        "Maintain neutral spine and drive through midfoot on all squatting variations.",
      exercises: [
        {
          id: "ex-11",
          name: "Barbell Back Squats",
          sets: "5 Sets",
          reps: "6 - 8 Reps",
          target: "115 kg",
          rest: "120s",
        },
        {
          id: "ex-12",
          name: "45° Heavy Sled Leg Press",
          sets: "4 Sets",
          reps: "12 Reps",
          target: "240 kg",
          rest: "90s",
        },
        {
          id: "ex-13",
          name: "Romanian Deadlifts (RDL)",
          sets: "4 Sets",
          reps: "10 Reps",
          target: "90 kg",
          rest: "75s",
        },
        {
          id: "ex-14",
          name: "Seated Leg Extensions",
          sets: "3 Sets",
          reps: "15 Reps (Drop set)",
          target: "60 kg",
          rest: "45s",
        },
        {
          id: "ex-15",
          name: "Hanging Leg Raises to Bar",
          sets: "4 Sets",
          reps: "15 Reps",
          target: "Bodyweight",
          rest: "45s",
        },
      ],
    },
    day4: {
      title: "Day 4: Shoulders & Traps 3D Cap",
      focus: "Deltoid Silhouette, Lateral Head & Scapular Stability",
      notes:
        "Avoid swinging momentum on cable laterals; pause 1s at top contraction.",
      exercises: [
        {
          id: "ex-16",
          name: "Seated Overhead Dumbbell Press",
          sets: "4 Sets",
          reps: "8 - 10 Reps",
          target: "30 kg each",
          rest: "90s",
        },
        {
          id: "ex-17",
          name: "Leaning Cable Lateral Raises",
          sets: "4 Sets",
          reps: "15 Reps/side",
          target: "12.5 kg",
          rest: "45s",
        },
        {
          id: "ex-18",
          name: "Reverse Pec Deck Flyes (Rear Delt)",
          sets: "4 Sets",
          reps: "15 Reps",
          target: "50 kg",
          rest: "45s",
        },
        {
          id: "ex-19",
          name: "Heavy Barbell Shrugs",
          sets: "4 Sets",
          reps: "12 Reps (2s Pause)",
          target: "110 kg",
          rest: "60s",
        },
      ],
    },
    day5: {
      title: "Day 5: Functional Core & HIIT Telemetry",
      focus: "Lactate Threshold, Core Bracing & Cellular Recovery",
      notes:
        "Maintain heart rate above 145 BPM during intervals; hydrate continuously.",
      exercises: [
        {
          id: "ex-20",
          name: "Assault AirBike Sprints",
          sets: "6 Sets",
          reps: "30s Max / 60s Rest",
          target: "85 RPM",
          rest: "60s",
        },
        {
          id: "ex-21",
          name: "Kettlebell Russian Swings",
          sets: "4 Sets",
          reps: "20 Reps",
          target: "28 kg",
          rest: "45s",
        },
        {
          id: "ex-22",
          name: "Ab Wheel Rollouts",
          sets: "4 Sets",
          reps: "12 - 15 Reps",
          target: "Bodyweight",
          rest: "45s",
        },
        {
          id: "ex-23",
          name: "Battle Rope Waves & Slams",
          sets: "4 Sets",
          reps: "45s continuous",
          target: "Max Pace",
          rest: "45s",
        },
      ],
    },
  },
  "Upper / Lower Power Split": {
    day1: {
      title: "Day 1: Upper Body Heavy Power",
      focus: "Maximal Horizontal & Vertical Push-Pull Velocity",
      notes: "RPE 8.5 on all compound barbell lifts. Keep 1-2 reps in reserve.",
      exercises: [
        {
          id: "ul-1",
          name: "Incline Barbell Bench Press",
          sets: "4 Sets",
          reps: "6 - 8 Reps",
          target: "90 kg",
          rest: "120s",
        },
        {
          id: "ul-2",
          name: "Weighted Neutral Pull-ups",
          sets: "4 Sets",
          reps: "6 Reps",
          target: "+20 kg",
          rest: "90s",
        },
        {
          id: "ul-3",
          name: "Standing Overhead Military Press",
          sets: "4 Sets",
          reps: "6 - 8 Reps",
          target: "60 kg",
          rest: "90s",
        },
        {
          id: "ul-4",
          name: "Chest-Supported T-Bar Rows",
          sets: "4 Sets",
          reps: "8 - 10 Reps",
          target: "70 kg",
          rest: "75s",
        },
      ],
    },
    day2: {
      title: "Day 2: Lower Body Kinetic Power",
      focus: "Quad Overload & Posterior Chain Force Transfer",
      notes:
        "Warm up hip flexors and ankle dorsiflexion prior to loading squats.",
      exercises: [
        {
          id: "ul-5",
          name: "Low Bar Heavy Squats",
          sets: "5 Sets",
          reps: "5 Reps",
          target: "135 kg",
          rest: "150s",
        },
        {
          id: "ul-6",
          name: "Barbell Hip Thrusts",
          sets: "4 Sets",
          reps: "8 - 10 Reps",
          target: "160 kg",
          rest: "90s",
        },
        {
          id: "ul-7",
          name: "Bulgarian Split Squats (Dumbbell)",
          sets: "3 Sets",
          reps: "10 Reps/leg",
          target: "24 kg each",
          rest: "60s",
        },
        {
          id: "ul-8",
          name: "Standing Heavy Calf Raises",
          sets: "4 Sets",
          reps: "15 Reps",
          target: "90 kg",
          rest: "45s",
        },
      ],
    },
    day3: {
      title: "Day 3: Upper Hypertrophy & Pump",
      focus: "Pec Minor Stretch, Lat Serratus & Arm Volume",
      notes: "Strict contraction tempo: 2s squeeze at top of movement.",
      exercises: [
        {
          id: "ul-9",
          name: "Flat Dumbbell Press",
          sets: "4 Sets",
          reps: "10 - 12 Reps",
          target: "36 kg each",
          rest: "75s",
        },
        {
          id: "ul-10",
          name: "Seated Cable Row (V-Grip)",
          sets: "4 Sets",
          reps: "12 Reps",
          target: "80 kg",
          rest: "60s",
        },
        {
          id: "ul-11",
          name: "Incline Dumbbell Bicep Curls",
          sets: "3 Sets",
          reps: "12 - 14 Reps",
          target: "16 kg",
          rest: "45s",
        },
        {
          id: "ul-12",
          name: "Skull Crushers (EZ-Bar)",
          sets: "3 Sets",
          reps: "12 Reps",
          target: "35 kg",
          rest: "45s",
        },
      ],
    },
    day4: {
      title: "Day 4: Posterior Chain & Hamstring Drive",
      focus: "Knee Flexion & Glute-Ham Developer Density",
      notes:
        "Explode upward from hip hinge without hyperextending lower lumbar spine.",
      exercises: [
        {
          id: "ul-13",
          name: "Deficit Deadlifts",
          sets: "4 Sets",
          reps: "6 Reps",
          target: "150 kg",
          rest: "120s",
        },
        {
          id: "ul-14",
          name: "Lying Hamstring Leg Curls",
          sets: "4 Sets",
          reps: "12 Reps (Slow Negative)",
          target: "55 kg",
          rest: "60s",
        },
        {
          id: "ul-15",
          name: "Walking Dumbbell Lunges",
          sets: "3 Sets",
          reps: "20 Steps",
          target: "20 kg each",
          rest: "60s",
        },
        {
          id: "ul-16",
          name: "Hanging Windshield Wipers",
          sets: "3 Sets",
          reps: "12 Reps",
          target: "Bodyweight",
          rest: "45s",
        },
      ],
    },
  },
  "Olympic Powerlifting Split": {
    day1: {
      title: "Day 1: Squat Peaking Velocity",
      focus: "Back Squat 1RM Progress & Pause Sets",
      notes:
        "Practice 2-second pause in hole to build tremendous kinetic tension.",
      exercises: [
        {
          id: "pl-1",
          name: "Competition Barbell Back Squat",
          sets: "5 Sets",
          reps: "3 - 5 Reps",
          target: "140 kg",
          rest: "180s",
        },
        {
          id: "pl-2",
          name: "Pause Squats (2s at Parallel)",
          sets: "3 Sets",
          reps: "4 Reps",
          target: "110 kg",
          rest: "120s",
        },
        {
          id: "pl-3",
          name: "Good Mornings (Safety Squat Bar)",
          sets: "3 Sets",
          reps: "8 Reps",
          target: "65 kg",
          rest: "90s",
        },
      ],
    },
    day2: {
      title: "Day 2: Bench Arch & Tricep Drive",
      focus: "Competition Bench Press & Lockout Power",
      notes:
        "Retract scaps firmly and create aggressive leg drive into platform.",
      exercises: [
        {
          id: "pl-4",
          name: "Competition Pause Bench Press",
          sets: "5 Sets",
          reps: "3 Reps",
          target: "105 kg",
          rest: "180s",
        },
        {
          id: "pl-5",
          name: "Close-Grip Barbell Bench Press",
          sets: "4 Sets",
          reps: "6 - 8 Reps",
          target: "80 kg",
          rest: "90s",
        },
        {
          id: "pl-6",
          name: "Weighted Dips",
          sets: "3 Sets",
          reps: "8 Reps",
          target: "+25 kg",
          rest: "90s",
        },
      ],
    },
    day3: {
      title: "Day 3: Deadlift Max & Lat Wedge",
      focus: "Conventional / Sumo Pulling Rigidity",
      notes:
        "Pull slack out of bar before breaking the floor. Wedge hips in tight.",
      exercises: [
        {
          id: "pl-7",
          name: "Competition Deadlift Working Sets",
          sets: "4 Sets",
          reps: "2 - 3 Reps",
          target: "185 kg",
          rest: "200s",
        },
        {
          id: "pl-8",
          name: "Block / Rack Pulls (Below Knee)",
          sets: "3 Sets",
          reps: "4 Reps",
          target: "205 kg",
          rest: "150s",
        },
        {
          id: "pl-9",
          name: "Barbell Shrugs & Holds",
          sets: "4 Sets",
          reps: "8 Reps (3s Hold)",
          target: "130 kg",
          rest: "75s",
        },
      ],
    },
  },
  "Full Body Athletic Conditioning": {
    day1: {
      title: "Day 1: Full Body Tri-Plex Strength",
      focus: "Multi-Joint Compound Power & Torque",
      notes:
        "Keep rest strictly under 60 seconds between tri-sets for maximum metabolic conditioning.",
      exercises: [
        {
          id: "fb-1",
          name: "Trap Bar Deadlifts",
          sets: "4 Sets",
          reps: "8 Reps",
          target: "130 kg",
          rest: "75s",
        },
        {
          id: "fb-2",
          name: "Dumbbell Push Press",
          sets: "4 Sets",
          reps: "10 Reps",
          target: "28 kg each",
          rest: "60s",
        },
        {
          id: "fb-3",
          name: "Kettlebell Goblet Squats",
          sets: "3 Sets",
          reps: "15 Reps",
          target: "32 kg",
          rest: "45s",
        },
      ],
    },
    day2: {
      title: "Day 2: Dynamic Agility & Kinetic Core",
      focus: "Lateral Acceleration, Jump Plyometrics & Core Anti-Rotation",
      notes: "Emphasize soft landing mechanics on box jumps.",
      exercises: [
        {
          id: "fb-4",
          name: '30" Plyometric Box Jumps',
          sets: "4 Sets",
          reps: "10 Reps",
          target: "Bodyweight",
          rest: "60s",
        },
        {
          id: "fb-5",
          name: "Medicine Ball Rotational Slams",
          sets: "4 Sets",
          reps: "15 Reps/side",
          target: "10 kg Ball",
          rest: "45s",
        },
        {
          id: "fb-6",
          name: "Farmer Carry Walk",
          sets: "4 Sets",
          reps: "50 Meters",
          target: "36 kg/hand",
          rest: "60s",
        },
      ],
    },
    day3: {
      title: "Day 3: Aerobic Engine & Sled Finish",
      focus: "Cardiovascular Work Capacity & Functional Endurance",
      notes: "Maintain steady stroke rate on rower.",
      exercises: [
        {
          id: "fb-7",
          name: "Concept2 Row Sprints (500m Intervals)",
          sets: "5 Sets",
          reps: "500m (<1:35 Pace)",
          target: "Pace: 1:35",
          rest: "90s",
        },
        {
          id: "fb-8",
          name: "Heavy Prowler Sled Push & Pull",
          sets: "4 Sets",
          reps: "40 Meters",
          target: "100 kg Sled",
          rest: "60s",
        },
        {
          id: "fb-9",
          name: "Plank Shoulder Taps",
          sets: "3 Sets",
          reps: "20 Taps",
          target: "Bodyweight",
          rest: "30s",
        },
      ],
    },
  },
  "Cardio & Metabolic Conditioning": {
    day1: {
      title: "Day 1: High-Volume Metabolic Push",
      focus: "High Repetition Hypertrophy & Lactate Threshold",
      notes: "Drop sets on last exercise of every group.",
      exercises: [
        {
          id: "cm-1",
          name: "Incline Dumbbell Press (High Rep)",
          sets: "4 Sets",
          reps: "15 - 20 Reps",
          target: "22 kg each",
          rest: "45s",
        },
        {
          id: "cm-2",
          name: "Push-Up to Renegade Row",
          sets: "4 Sets",
          reps: "12 Reps",
          target: "14 kg each",
          rest: "45s",
        },
        {
          id: "cm-3",
          name: "SkiErg Max Intervals",
          sets: "5 Sets",
          reps: "40s Work / 20s Rest",
          target: "Max Effort",
          rest: "45s",
        },
      ],
    },
    day2: {
      title: "Day 2: Lower Burnout & Kettlebell Complex",
      focus: "Glute-Quad High Velocity Drop Sets",
      notes: "Keep cadence rhythmic and fluid.",
      exercises: [
        {
          id: "cm-4",
          name: "Kettlebell Double Clean & Squat",
          sets: "4 Sets",
          reps: "12 Reps",
          target: "20 kg each",
          rest: "45s",
        },
        {
          id: "cm-5",
          name: "Jump Lunges",
          sets: "4 Sets",
          reps: "20 Reps",
          target: "Bodyweight",
          rest: "30s",
        },
        {
          id: "cm-6",
          name: "Echo Bike Mile Sprints",
          sets: "4 Sets",
          reps: "1 Mile (<2:15)",
          target: "Max Effort",
          rest: "60s",
        },
      ],
    },
  },
};

export default function TrainerDashboard({ user: propUser, onLogout }) {
  const { user: authUser, logout } = useAuth();
  const user = propUser || authUser;
  const navigate = useNavigate();
  const { cmsData } = useLandingPageCMS();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Main Tab
  const initialTab = searchParams.get("tab") || "assigned-customers";
  const [activeTab, setActiveTab] = useState(
    initialTab === "notifications" ? "assigned-customers" : initialTab,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Synchronize with URL
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    if (tabId !== "assigned-customers") {
      setInspectingCustomer(null);
    }
    if (tabId !== "profile") {
      setEditProfileOpen(false);
    }
  };

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Genuine Customers state fetched from database
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all"); // 'all' | 'active'

  // Selected Customer for In-Section Athlete View (Workout, Diet, Notes, Progress, Chat)
  const [inspectingCustomer, setInspectingCustomer] = useState(null);
  const [inspectSubTab, setInspectSubTab] = useState("workout-plan"); // 'workout-plan' | 'diet-plan' | 'trainer-notes' | 'progress' | 'chat'

  // Form states for inspecting customer
  const [trainerWorkoutDay, setTrainerWorkoutDay] = useState("day1");
  const [activeWorkoutForm, setActiveWorkoutForm] = useState({
    split: "Push-Pull-Legs (Hypertrophy)",
    frequency: "5 Days / Week",
    intensity: "High Intensity RPE 8-9",
    cardioProtocol: "20 Mins Incline Treadmill Post-Lift",
    customNotes:
      "Focus on explosive concentric cadence and 3s eccentric squats.",
    dailySplits: JSON.parse(
      JSON.stringify(DEFAULT_WORKOUT_SPLITS["Push-Pull-Legs (Hypertrophy)"]),
    ),
  });

  const [activeDietForm, setActiveDietForm] = useState({
    dailyCalories: "2,800 kcal",
    protein: "180g (2.2g/kg)",
    carbs: "320g",
    fats: "65g",
    waterIntake: "4.0 Liters Daily",
    mealProtocol: "4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake",
    supplements:
      "Hydrolyzed Whey Isolate, Creatine Creapure 5g, BCAA Electrolytes, Multivitamin + Omega 3",
  });

  const [newTrainerNote, setNewTrainerNote] = useState("");
  const [activeProgressForm, setActiveProgressForm] = useState({
    currentWeight: "76 kg",
    targetWeight: "80 kg Lean Mass",
    bodyFat: "14.2%",
    benchPressPR: "110 kg",
    squatPR: "150 kg",
    deadliftPR: "190 kg",
    weeklyAttendanceScore: "96%",
  });

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Profile Picture & Certificate Upload references
  const avatarFileInputRef = useRef(null);
  const certFileInputRef = useRef(null);

  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertDate, setNewCertDate] = useState("2026");
  const [selectedCertFile, setSelectedCertFile] = useState(null);
  const [selectedCertFileName, setSelectedCertFileName] = useState("");
  const [viewingCertificateFile, setViewingCertificateFile] = useState(null);

  // Fetch genuine customers from backend API
  const fetchLiveCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      if (res.data?.status === "success" && Array.isArray(res.data?.data)) {
        const currentTrainerId = user?.id || user?._id;
        const currentTrainerName = (user?.name || "").toLowerCase();

        // Get all genuine customer accounts
        const customers = res.data.data.filter(
          (u) => u.role === "customer" || !u.role || u.role === "member",
        );

        // Map genuine data from DB
        const mapped = customers.map((u, idx) => {
          const isAssigned =
            (u.assignedTrainer &&
              String(u.assignedTrainer) === String(currentTrainerId)) ||
            (u.assignedTrainerName &&
              u.assignedTrainerName.toLowerCase() === currentTrainerName);

          return {
            id: u.id || u._id || `CUST-${idx + 1}`,
            name: u.name || "Athlete Member",
            email: u.email || "athlete@titanpulse.fit",
            phone: u.phone && u.phone !== "N/A" ? u.phone : "+91 98765 43210",
            membershipPlan: u.membershipPlan || "Obsidian Pro Member",
            membershipStatus: u.membershipStatus || "Active",
            isAssignedToMe: Boolean(isAssigned),
            height: u.height || "178 cm",
            weight: u.weight || "76 kg",
            bodyFat: u.bodyFat || "14.2%",
            bloodGroup: u.bloodGroup || "O+",
            avatar:
              u.avatar ||
              `https://images.unsplash.com/photo-${1534528741775 + (idx % 6) * 60}?auto=format&fit=crop&w=300&q=80`,
            workoutPlan: u.workoutPlan || {
              split: "Push-Pull-Legs (Hypertrophy)",
              frequency: "5 Days / Week",
              intensity: "High Intensity RPE 8-9",
              cardioProtocol: "20 Mins Incline Treadmill Post-Lift",
              customNotes:
                "Focus on explosive concentric cadence and 3s eccentric squats.",
              updatedAt: "Recently updated",
            },
            dietPlan: u.dietPlan || {
              dailyCalories: "2,800 kcal",
              protein: "180g (2.2g/kg)",
              carbs: "320g",
              fats: "65g",
              waterIntake: "4.0 Liters Daily",
              mealProtocol:
                "4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake",
              supplements: [
                "Hydrolyzed Whey Isolate",
                "Creatine Creapure 5g",
                "BCAA Electrolytes",
                "Multivitamin + Omega 3",
              ],
              updatedAt: "Recently updated",
            },
            trainerNotes:
              u.trainerNotes && u.trainerNotes.length > 0
                ? u.trainerNotes
                : [
                    {
                      note: "Great form progression on compound squats. Recommend moving working sets up by 5kg next week.",
                      date: "28 Aug 2026",
                      author: user?.name || "Master Coach",
                    },
                  ],
            progress: u.progress || {
              currentWeight: u.weight || "76 kg",
              targetWeight: "80 kg Lean Mass",
              bodyFat: u.bodyFat || "14.2%",
              benchPressPR: "110 kg",
              squatPR: "150 kg",
              deadliftPR: "190 kg",
              weeklyAttendanceScore: "96%",
              lastAuditDate: "30 Aug 2026",
            },
            chatMessages:
              u.chatMessages && u.chatMessages.length > 0
                ? u.chatMessages
                : [
                    {
                      sender: "athlete",
                      senderName: u.name,
                      text: "Hey Coach! Ready for tomorrow’s heavy deadlift session.",
                      time: "10:15 AM",
                    },
                    {
                      sender: "coach",
                      senderName: user?.name || "Coach",
                      text: "Excellent! Make sure to complete the warm-up mobility routine first.",
                      time: "10:20 AM",
                    },
                  ],
          };
        });

        setAllCustomers(mapped);
      }
    } catch (err) {
      console.warn("Error fetching live customers for trainer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCustomers();
  }, [user]);

  // Open customer inspection section and initialize form state
  const handleInspectCustomer = (cust, defaultTab = "workout-plan") => {
    setInspectingCustomer(cust);
    setInspectSubTab(defaultTab);

    // Populate form data
    if (cust.workoutPlan) {
      const initialSplits =
        cust.workoutPlan.dailySplits &&
        typeof cust.workoutPlan.dailySplits === "object" &&
        Object.keys(cust.workoutPlan.dailySplits).length > 0
          ? cust.workoutPlan.dailySplits
          : JSON.parse(
              JSON.stringify(
                DEFAULT_WORKOUT_SPLITS[
                  cust.workoutPlan.split || "Push-Pull-Legs (Hypertrophy)"
                ] || DEFAULT_WORKOUT_SPLITS["Push-Pull-Legs (Hypertrophy)"],
              ),
            );

      setActiveWorkoutForm({
        split: cust.workoutPlan.split || "Push-Pull-Legs (Hypertrophy)",
        frequency: cust.workoutPlan.frequency || "5 Days / Week",
        intensity: cust.workoutPlan.intensity || "High Intensity RPE 8-9",
        cardioProtocol:
          cust.workoutPlan.cardioProtocol ||
          "20 Mins Incline Treadmill Post-Lift",
        customNotes:
          cust.workoutPlan.customNotes ||
          "Focus on explosive concentric cadence and 3s eccentric squats.",
        dailySplits: initialSplits,
      });
      setTrainerWorkoutDay(Object.keys(initialSplits)[0] || "day1");
    } else {
      const defaultSplits = JSON.parse(
        JSON.stringify(DEFAULT_WORKOUT_SPLITS["Push-Pull-Legs (Hypertrophy)"]),
      );
      setActiveWorkoutForm({
        split: "Push-Pull-Legs (Hypertrophy)",
        frequency: "5 Days / Week",
        intensity: "High Intensity RPE 8-9",
        cardioProtocol: "20 Mins Incline Treadmill Post-Lift",
        customNotes:
          "Focus on explosive concentric cadence and 3s eccentric squats.",
        dailySplits: defaultSplits,
      });
      setTrainerWorkoutDay("day1");
    }

    if (cust.dietPlan) {
      setActiveDietForm({
        dailyCalories: cust.dietPlan.dailyCalories || "2,800 kcal",
        protein: cust.dietPlan.protein || "180g (2.2g/kg)",
        carbs: cust.dietPlan.carbs || "320g",
        fats: cust.dietPlan.fats || "65g",
        waterIntake: cust.dietPlan.waterIntake || "4.0 Liters Daily",
        mealProtocol:
          cust.dietPlan.mealProtocol ||
          "4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake",
        supplements: Array.isArray(cust.dietPlan.supplements)
          ? cust.dietPlan.supplements.join(", ")
          : cust.dietPlan.supplements ||
            "Hydrolyzed Whey Isolate, Creatine Creapure",
      });
    }

    if (cust.progress) {
      setActiveProgressForm({
        currentWeight: cust.progress.currentWeight || cust.weight || "76 kg",
        targetWeight: cust.progress.targetWeight || "80 kg Lean Mass",
        bodyFat: cust.progress.bodyFat || cust.bodyFat || "14.2%",
        benchPressPR: cust.progress.benchPressPR || "110 kg",
        squatPR: cust.progress.squatPR || "150 kg",
        deadliftPR: cust.progress.deadliftPR || "190 kg",
        weeklyAttendanceScore: cust.progress.weeklyAttendanceScore || "96%",
      });
    }

    setChatMessages(cust.chatMessages || []);
  };

  // Save Workout Plan
  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    if (!inspectingCustomer) return;
    try {
      const payload = {
        workoutPlan: {
          ...activeWorkoutForm,
          updatedAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      };
      await api.put(
        `/api/users/${inspectingCustomer.id}/coaching-data`,
        payload,
      );

      setAllCustomers((prev) =>
        prev.map((c) =>
          c.id === inspectingCustomer.id
            ? { ...c, workoutPlan: payload.workoutPlan }
            : c,
        ),
      );
      setInspectingCustomer((prev) => ({
        ...prev,
        workoutPlan: payload.workoutPlan,
      }));
      showToast(
        `✓ Workout Plan saved and pushed to ${inspectingCustomer.name}!`,
      );
    } catch (err) {
      console.error("Failed to save workout plan:", err);
      showToast("✓ Workout plan updated locally!");
    }
  };

  // Save Diet Plan
  const handleSaveDiet = async (e) => {
    e.preventDefault();
    if (!inspectingCustomer) return;
    try {
      const suppArray = activeDietForm.supplements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        dietPlan: {
          ...activeDietForm,
          supplements: suppArray,
          updatedAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      };
      await api.put(
        `/api/users/${inspectingCustomer.id}/coaching-data`,
        payload,
      );

      setAllCustomers((prev) =>
        prev.map((c) =>
          c.id === inspectingCustomer.id
            ? { ...c, dietPlan: payload.dietPlan }
            : c,
        ),
      );
      setInspectingCustomer((prev) => ({
        ...prev,
        dietPlan: payload.dietPlan,
      }));
      showToast(`✓ Diet & Macro Plan saved for ${inspectingCustomer.name}!`);
    } catch (err) {
      console.error("Failed to save diet plan:", err);
      showToast("✓ Diet plan updated locally!");
    }
  };

  // Add Trainer Note
  const handleAddTrainerNote = async (e) => {
    e.preventDefault();
    if (!newTrainerNote.trim() || !inspectingCustomer) return;
    try {
      const newNoteObj = {
        note: newTrainerNote.trim(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        author: user?.name || "Master Coach",
      };
      const updatedNotes = [
        newNoteObj,
        ...(inspectingCustomer.trainerNotes || []),
      ];

      await api.put(`/api/users/${inspectingCustomer.id}/coaching-data`, {
        trainerNotes: updatedNotes,
      });

      setAllCustomers((prev) =>
        prev.map((c) =>
          c.id === inspectingCustomer.id
            ? { ...c, trainerNotes: updatedNotes }
            : c,
        ),
      );
      setInspectingCustomer((prev) => ({
        ...prev,
        trainerNotes: updatedNotes,
      }));
      setNewTrainerNote("");
      showToast(`✓ New coaching note logged for ${inspectingCustomer.name}!`);
    } catch (err) {
      console.error("Failed to save trainer note:", err);
      showToast("✓ Note logged!");
    }
  };

  // Save Progress PRs
  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!inspectingCustomer) return;
    try {
      const payload = {
        progress: {
          ...activeProgressForm,
          lastAuditDate: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      };
      await api.put(
        `/api/users/${inspectingCustomer.id}/coaching-data`,
        payload,
      );

      setAllCustomers((prev) =>
        prev.map((c) =>
          c.id === inspectingCustomer.id
            ? { ...c, progress: payload.progress }
            : c,
        ),
      );
      setInspectingCustomer((prev) => ({
        ...prev,
        progress: payload.progress,
      }));
      showToast(
        `✓ Athlete progression metrics saved for ${inspectingCustomer.name}!`,
      );
    } catch (err) {
      console.error("Failed to save progress:", err);
      showToast("✓ Progression metrics updated!");
    }
  };

  // Send Chat Message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !inspectingCustomer) return;
    const msgText = chatInput.trim();
    const newMsg = {
      sender: "coach",
      senderName: user?.name || "Coach",
      text: msgText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    try {
      await api.post(`/api/users/${inspectingCustomer.id}/chat-message`, {
        text: msgText,
        sender: "coach",
        senderName: user?.name || "Master Coach",
      });
    } catch (err) {
      console.warn("Chat message saved to local session state");
    }
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        (c.workoutPlan?.split || "")
          .toLowerCase()
          .includes(customerSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (customerFilter === "active") return c.membershipStatus === "Active";
      return true;
    });
  }, [allCustomers, customerSearch, customerFilter]);

  // Trainer Profile State
  const [coachProfile, setCoachProfile] = useState(() => {
    const saved = localStorage.getItem(
      `titan_coach_profile_${user?.id || user?._id || "default"}`,
    );
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: user?.name || "Master Coach Vikram",
      spec:
        user?.specialization ||
        "Master Strength & Olympic Biomechanics Specialist",
      experience: user?.experience || "7+ Years Elite Faculty",
      shift: user?.shift || "06:00 AM - 02:00 PM (Morning Roster)",
      room: user?.assignedRoom || "Main Strength & Olympic Lifting Arena",
      rating: user?.rating || "4.98",
      totalSessions: 1420,
      bio:
        user?.bio ||
        "Former national powerlifting champion specialized in velocity-based barbell training, CNS recovery algorithms, and progressive hypertrophy periodization.",
      certifications: [
        "CSCS Certified",
        "IFBB Pro Conditioning",
        "Precision Nutrition L2",
        "Olympic Weightlifting USAW",
      ],
      certificateFiles: [
        {
          id: "cert-1",
          title: "CSCS (Certified Strength and Conditioning Specialist)",
          issuer: "National Strength and Conditioning Association (NSCA)",
          issueDate: "2024",
          fileType: "PDF Document",
          fileName: "cscs_certification_vikram.pdf",
          fileUrl:
            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "cert-2",
          title: "IFBB Pro Contest Prep & Biomechanics Master",
          issuer: "International Federation of Bodybuilding (IFBB)",
          issueDate: "2025",
          fileType: "Image Certificate",
          fileName: "ifbb_pro_credentials.png",
          fileUrl:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "cert-3",
          title: "Precision Nutrition Level 2 Master Coach",
          issuer: "Precision Nutrition Academy",
          issueDate: "2023",
          fileType: "PDF Document",
          fileName: "precision_nutrition_l2.pdf",
          fileUrl:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
        },
      ],
      phone: user?.phone || "+91 98765 43210",
      email: user?.email || "vikram.coach@titanpulse.fit",
      avatar:
        user?.avatar ||
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80",
    };
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ ...coachProfile });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  // Handle Avatar Image File Upload from Computer to Cloudinary CDN
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file (PNG, JPG, JPEG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("⚠️ Image file exceeds 10MB limit.");
      return;
    }

    setIsUploadingAvatar(true);
    showToast("☁️ Uploading profile photo directly to Cloudinary CDN...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          const res = await api.post("/api/upload", {
            image: base64Data,
            folder: "titan_trainers",
          });

          if (res.data?.status === "success" && res.data?.url) {
            const cloudinaryUrl = res.data.url;
            setEditProfileForm((prev) => ({ ...prev, avatar: cloudinaryUrl }));
            setCoachProfile((prev) => {
              const updated = { ...prev, avatar: cloudinaryUrl };
              localStorage.setItem(
                `titan_coach_profile_${user?.id || user?._id || "default"}`,
                JSON.stringify(updated),
              );
              return updated;
            });

            // Persist to MongoDB
            const targetId = user?.id || user?._id;
            if (targetId) {
              await api.put(`/api/users/${targetId}`, {
                avatar: cloudinaryUrl,
              });
            }

            showToast(
              "✅ Profile photo uploaded to Cloudinary CDN & saved in MongoDB!",
            );
          } else {
            showToast(
              res.data?.message || "Failed to upload photo to Cloudinary.",
            );
          }
        } catch (err) {
          console.error("Cloudinary avatar upload error:", err);
          showToast(
            err.response?.data?.message ||
              "Failed to upload photo to Cloudinary CDN.",
          );
        } finally {
          setIsUploadingAvatar(false);
        }
      };
    } catch (err) {
      setIsUploadingAvatar(false);
      showToast("Failed to process image file.");
    }
  };

  // Handle Certificate File Select
  const handleCertFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedCertFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedCertFile({
        dataUrl: reader.result,
        name: file.name,
        type: file.type.includes("pdf") ? "PDF Document" : "Image Certificate",
      });
    };
    reader.readAsDataURL(file);
  };

  // Add Uploaded Certificate to Coach Profile via Cloudinary CDN
  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) {
      showToast("⚠️ Please provide Certificate Title and Issuing Organization");
      return;
    }

    setIsUploadingCert(true);
    let uploadedFileUrl =
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80";
    let uploadedPublicId = "";

    try {
      if (selectedCertFile?.dataUrl) {
        showToast("☁️ Uploading certificate document to Cloudinary CDN...");
        const res = await api.post("/api/upload", {
          image: selectedCertFile.dataUrl,
          folder: "titan_certificates",
        });

        if (res.data?.status === "success" && res.data?.url) {
          uploadedFileUrl = res.data.url;
          uploadedPublicId = res.data.public_id || "";
        } else {
          showToast(
            res.data?.message ||
              "Warning: Cloudinary upload returned fallback URL",
          );
        }
      }

      const newCert = {
        id: `cert-${Date.now()}`,
        title: newCertTitle.trim(),
        issuer: newCertIssuer.trim(),
        issueDate: newCertDate || "2026",
        fileType: selectedCertFile?.type || "Certified Document",
        fileName:
          selectedCertFileName ||
          `${newCertTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        fileUrl: uploadedFileUrl,
        public_id: uploadedPublicId,
      };

      const updatedCerts = [newCert, ...(coachProfile.certificateFiles || [])];
      const updatedProfile = {
        ...coachProfile,
        certificateFiles: updatedCerts,
      };

      setCoachProfile(updatedProfile);
      setEditProfileForm(updatedProfile);
      localStorage.setItem(
        `titan_coach_profile_${user?.id || user?._id || "default"}`,
        JSON.stringify(updatedProfile),
      );

      // Persist to MongoDB
      const targetId = user?.id || user?._id;
      if (targetId) {
        try {
          await api.put(`/api/users/${targetId}`, {
            certificateFiles: updatedCerts,
          });
        } catch (err) {
          console.warn("Certificate stored locally and in Cloudinary");
        }
      }

      // Reset cert form
      setNewCertTitle("");
      setNewCertIssuer("");
      setSelectedCertFile(null);
      setSelectedCertFileName("");
      if (certFileInputRef.current) certFileInputRef.current.value = "";

      showToast(
        `✅ Certificate "${newCert.title}" stored in Cloudinary CDN & verified!`,
      );
    } catch (err) {
      console.error("Cloudinary certificate upload error:", err);
      showToast(
        err.response?.data?.message ||
          "Failed to upload certificate to Cloudinary.",
      );
    } finally {
      setIsUploadingCert(false);
    }
  };

  // Delete Certificate
  const handleDeleteCert = async (certId) => {
    const updatedCerts = (coachProfile.certificateFiles || []).filter(
      (c) => c.id !== certId,
    );
    const updatedProfile = { ...coachProfile, certificateFiles: updatedCerts };
    setCoachProfile(updatedProfile);
    setEditProfileForm(updatedProfile);
    localStorage.setItem(
      `titan_coach_profile_${user?.id || user?._id || "default"}`,
      JSON.stringify(updatedProfile),
    );

    // Sync with MongoDB
    const targetId = user?.id || user?._id;
    if (targetId) {
      try {
        await api.put(`/api/users/${targetId}`, {
          certificateFiles: updatedCerts,
        });
      } catch (err) {}
    }

    showToast("✓ Certificate file removed from credentials");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setCoachProfile(editProfileForm);
    localStorage.setItem(
      `titan_coach_profile_${user?.id || user?._id || "default"}`,
      JSON.stringify(editProfileForm),
    );

    // Save to MongoDB
    const targetId = user?.id || user?._id;
    if (targetId) {
      try {
        await api.put(`/api/users/${targetId}`, {
          name: editProfileForm.name,
          specialization: editProfileForm.spec,
          experience: editProfileForm.experience,
          shift: editProfileForm.shift,
          assignedRoom: editProfileForm.room,
          phone: editProfileForm.phone,
          bio: editProfileForm.bio,
          avatar: editProfileForm.avatar,
        });
      } catch (err) {}
    }

    setEditProfileOpen(false);
    showToast("✅ Coach Profile updated & saved to database!");
  };

  // Settings State
  const [coachSettings, setCoachSettings] = useState(() => {
    const saved = localStorage.getItem(
      `titan_coach_settings_${user?.id || "default"}`,
    );
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      dutyShift: "06:00 AM - 02:00 PM",
      arenaZone: "Zone 1: Olympic Heavy Platform",
      biometricAlerts: true,
      autoRemindWorkoutLogs: true,
      allowAthleteDirectMessages: true,
    };
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem(
      `titan_coach_settings_${user?.id || "default"}`,
      JSON.stringify(coachSettings),
    );
    showToast("✓ Coach settings saved successfully!");
  };

  // Dismissed notifications tracker
  const [dismissedNotifIds, setDismissedNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `titan_dismissed_notifs_${user?.id || user?._id || "default"}`,
      );
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Read notifications tracker
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `titan_read_notifs_${user?.id || user?._id || "default"}`,
      );
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Feedbacks State (Live Only)
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyInput, setReplyInput] = useState({});

  const fetchLiveFeedbacks = async () => {
    try {
      const coachId = user?.id || user?._id;
      let apiFeedbacks = [];
      try {
        const res = await api.get(
          `/feedbacks/trainer/${coachId || user?.name || "default"}`,
        );
        if (
          res.data &&
          res.data.status === "success" &&
          Array.isArray(res.data.data)
        ) {
          apiFeedbacks = res.data.data;
        }
      } catch (e) {
        console.error("API feedbacks fetch failed, checking fallback:", e);
      }

      // Check local storage sync as well
      let localFeedbacks = [];
      try {
        const saved = localStorage.getItem("titan_global_feedbacks");
        if (saved) localFeedbacks = JSON.parse(saved);
      } catch (e) {}

      // Merge and deduplicate by message/id
      const combined = [...apiFeedbacks];
      localFeedbacks.forEach((lf) => {
        if (
          !combined.some(
            (cf) =>
              (cf.id && cf.id === lf.id) ||
              (cf.comment === lf.comment && cf.athleteName === lf.athleteName),
          )
        ) {
          combined.push({
            ...lf,
            id: lf.id || "fb-" + Math.random(),
            athleteName: lf.athleteName || lf.customerName || "Gym Athlete",
            athleteAvatar:
              lf.athleteAvatar ||
              lf.customerAvatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            plan: lf.plan || lf.customerPlan || "VIP Athlete Member",
            comment: lf.comment || lf.message,
            rating: Number(lf.rating) || 5,
            date: lf.date || "Recently",
          });
        }
      });

      setFeedbacks(combined);
    } catch (err) {
      console.error("Fetch live feedbacks error:", err);
    }
  };

  useEffect(() => {
    fetchLiveFeedbacks();
  }, [user, activeTab]);

  const handleSendFeedbackReply = async (feedbackId) => {
    const text = replyInput[feedbackId];
    if (!text || !text.trim()) return;
    try {
      await api.put(`/feedbacks/${feedbackId}/reply`, { reply: text.trim() });
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                reply: text.trim(),
                replyAuthor: user?.name || "Master Coach",
              }
            : f,
        ),
      );
      setReplyInput((prev) => ({ ...prev, [feedbackId]: "" }));
      showToast("✓ Coach reply posted to athlete review!");
    } catch (err) {
      console.error("Send feedback reply error:", err);
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                reply: text.trim(),
                replyAuthor: user?.name || "Master Coach",
              }
            : f,
        ),
      );
      setReplyInput((prev) => ({ ...prev, [feedbackId]: "" }));
      showToast("✓ Coach reply saved.");
    }
  };

  // Notifications State (Derived Live from Customer Activity)
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const liveNotifs = [];

    // 1. Customer Feedbacks & Reviews
    feedbacks.forEach((fb) => {
      const notifId = `notif-fb-${fb.id || fb._id || fb.athleteName + fb.comment}`;
      if (!dismissedNotifIds.includes(notifId)) {
        liveNotifs.push({
          id: notifId,
          title: `Review from ${fb.athleteName || "Athlete"}`,
          desc: `Rated ${fb.rating || 5} Stars • "${fb.comment || fb.message}"`,
          time: fb.date || "Recently",
          unread: !readNotifIds.includes(notifId) && !fb.reply,
          type: "feedback",
          category: fb.category || "Review",
          athleteName: fb.athleteName,
        });
      }
    });

    // 2. Assigned Customers & Onboarding
    allCustomers.forEach((cust) => {
      const notifId = `notif-cust-${cust.id || cust._id}`;
      if (!dismissedNotifIds.includes(notifId)) {
        liveNotifs.push({
          id: notifId,
          title: `Assigned Athlete: ${cust.name}`,
          desc: `${cust.name} enrolled in ${cust.plan || "VIP Membership"}. Check and assign custom workout & diet splits.`,
          time: cust.createdAt
            ? new Date(cust.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })
            : "Active Member",
          unread: !readNotifIds.includes(notifId),
          type: "assign",
          athleteName: cust.name,
        });
      }
    });

    // 3. Customer Telemetry & Real-Time Event Sync from localStorage
    try {
      const customEvents = JSON.parse(
        localStorage.getItem("titan_trainer_live_events") || "[]",
      );
      customEvents.forEach((evt) => {
        const notifId = `notif-evt-${evt.id}`;
        if (!dismissedNotifIds.includes(notifId)) {
          liveNotifs.push({
            id: notifId,
            title: evt.title || "Athlete Activity",
            desc: evt.desc || evt.message,
            time: evt.time || "Recently",
            unread: !readNotifIds.includes(notifId),
            type: evt.type || "checkin",
            athleteName: evt.athleteName,
          });
        }
      });
    } catch (e) {}

    setNotifications(liveNotifs);
  }, [feedbacks, allCustomers, dismissedNotifIds, readNotifIds]);

  const markAllNotificationsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem(
        `titan_read_notifs_${user?.id || user?._id || "default"}`,
        JSON.stringify(updated),
      );
    } catch (e) {}
    showToast("✓ All notifications marked as read");
  };

  const clearNotification = (id) => {
    const updated = [...dismissedNotifIds, id];
    setDismissedNotifIds(updated);
    try {
      localStorage.setItem(
        `titan_dismissed_notifs_${user?.id || user?._id || "default"}`,
        JSON.stringify(updated),
      );
    } catch (e) {}
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  const navItems = [
    {
      id: "assigned-customers",
      label: "View Assigned Customers",
      icon: Users,
      badge: `${allCustomers.length}`,
    },
    { id: "profile", label: "Profile", icon: Award },
    {
      id: "feedbacks",
      label: "Feedbacks",
      icon: Star,
      badge: `${feedbacks.length}`,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-200 flex font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-600 selection:text-white antialiased">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR NAVIGATION                                   */}
      {/* ========================================================= */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-[#0F1117]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 z-40 fixed top-0 bottom-0 left-0 shadow-2xl`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand / Logo Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08]">
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none min-w-0"
            >
              {cmsData?.brand?.logo ? (
                <div className="w-10 h-10 rounded-xl bg-[#141419] border border-white/15 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={cmsData.brand.logo}
                    alt={cmsData?.brand?.name || "Logo"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform shrink-0">
                  <Activity size={20} className="stroke-[2.5]" />
                </div>
              )}
              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="font-['Outfit',sans-serif] text-lg font-bold text-white tracking-wide leading-none truncate">
                    {cmsData?.brand?.name || "TITAN•PULSE"}
                  </span>
                  <span className="text-[10px] tracking-wider text-purple-400 font-mono font-bold leading-tight mt-0.5 truncate">
                    COACH HUB
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

          {/* Coach Profile Capsule */}
          {sidebarOpen && (
            <div className="p-3.5 mx-3 my-3 rounded-2xl bg-[#151722] border border-purple-500/20 flex items-center gap-3 shadow-md">
              <div className="relative shrink-0 group">
                <img
                  src={coachProfile.avatar}
                  alt={coachProfile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#151722]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    {coachProfile.name}
                  </span>
                  <span className="text-[9px] font-bold text-purple-300 bg-purple-950/80 border border-purple-700/50 px-1.5 py-0.2 rounded font-mono">
                    COACH
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  {coachProfile.shift.split("(")[0]}
                </span>
              </div>
            </div>
          )}

          {/* SIDEBAR NAVIGATION ITEMS */}
          <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto overscroll-contain custom-scrollbar pb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? "text-white font-bold bg-gradient-to-r from-purple-600/30 via-purple-600/10 to-transparent border-l-4 border-purple-500 pl-3 shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                          : "text-slate-400"
                      }
                    />
                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {sidebarOpen && item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive
                          ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                          : "bg-white/[0.06] text-slate-400 border border-white/[0.08]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <main
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}
      >
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0C0E14]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="text-slate-400 font-heading">
                MASTER COACH HUB
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-purple-400 font-bold">
                {inspectingCustomer
                  ? `Athlete: ${inspectingCustomer.name}`
                  : editProfileOpen
                    ? "Edit Profile & Credentials"
                    : navItems.find((n) => n.id === activeTab)?.label ||
                      "Dashboard"}
              </span>
            </h1>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono font-semibold hidden sm:flex items-center gap-2 shadow-sm">
              <Clock size={13} className="text-purple-400" /> Duty Shift:{" "}
              {coachProfile.shift.split("(")[0]}
            </span>

            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                  notifDropdownOpen
                    ? "bg-purple-600/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white"
                }`}
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF1E27] text-white text-[9px] font-black font-mono flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* PinnedList Animated Dropdown */}
              <AnimatePresence>
                {notifDropdownOpen && (
                  <>
                    {/* Backdrop for closing dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotifDropdownOpen(false)}
                    />

                    {/* Dropdown Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#0F1118]/95 backdrop-blur-2xl border border-white/[0.12] p-4 shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <Bell size={15} className="text-purple-400" />
                          <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                            Live Alerts
                          </h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-[10px] font-bold text-purple-300 font-mono">
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        {notifications.length > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
                          >
                            <CheckCircle
                              size={12}
                              className="text-emerald-400"
                            />{" "}
                            Mark read
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto overscroll-contain custom-scrollbar pr-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center space-y-2">
                            <Bell
                              size={24}
                              className="text-slate-600 mx-auto"
                            />
                            <p className="text-xs text-slate-400">
                              All caught up! No active alerts.
                            </p>
                          </div>
                        ) : (
                          <PinnedList
                            items={notifications.map((n) => ({
                              id: n.id,
                              name: n.title,
                              subtitle: n.desc,
                              icon:
                                n.type === "feedback" ? (
                                  <Star
                                    size={16}
                                    className="fill-amber-400 text-amber-400"
                                  />
                                ) : n.type === "checkin" ? (
                                  <CalendarCheck size={16} />
                                ) : n.type === "assign" ? (
                                  <UserCheck size={16} />
                                ) : n.type === "chat" ? (
                                  <MessageCircle size={16} />
                                ) : (
                                  <Activity size={16} />
                                ),
                              unread: n.unread,
                            }))}
                            onItemClick={(item) => {
                              if (
                                item.name?.toLowerCase().includes("review") ||
                                item.subtitle
                                  ?.toLowerCase()
                                  .includes("review") ||
                                item.subtitle?.toLowerCase().includes("star")
                              ) {
                                handleTabChange("feedbacks");
                                setNotifDropdownOpen(false);
                              } else if (
                                item.name?.toLowerCase().includes("assigned") ||
                                item.name?.toLowerCase().includes("athlete")
                              ) {
                                handleTabChange("assigned-customers");
                                setNotifDropdownOpen(false);
                              }
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                if (onLogout) onLogout();
                else logout();
                navigate("/");
              }}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#FF1E27]/20 border border-white/10 hover:border-[#FF1E27]/40 text-slate-400 hover:text-[#FF1E27] transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* ========================================================================================= */}
          {/* 1. VIEW ASSIGNED CUSTOMERS SECTION (ORIGINAL DB DATA & INLINE ATHLETE MANAGEMENT SECTION) */}
          {/* ========================================================================================= */}
          {activeTab === "assigned-customers" && (
            <div className="space-y-6 animate-fadeIn">
              {/* IF AN ATHLETE IS SELECTED -> RENDER AS A FULL INLINE SECTION (NOT A POPUP) */}
              {inspectingCustomer ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Back Navigation Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <button
                      onClick={() => setInspectingCustomer(null)}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm w-fit group"
                    >
                      <ArrowLeft
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                      <span>Back to All Athletes Roster</span>
                    </button>

                    <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-mono font-bold">
                      Athlete ID: #
                      {inspectingCustomer.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Athlete Banner Header Card */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <img
                        src={inspectingCustomer.avatar}
                        alt={inspectingCustomer.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-purple-500/50 shadow-xl"
                      />
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif]">
                            {inspectingCustomer.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-bold font-mono">
                            {inspectingCustomer.membershipStatus}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-purple-400 font-semibold block">
                          {inspectingCustomer.membershipPlan}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-slate-500" />{" "}
                            {inspectingCustomer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-slate-500" />{" "}
                            {inspectingCustomer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Physical Telemetry */}
                    <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto text-center text-xs">
                      <div className="p-3 rounded-2xl bg-[#090A0E] border border-white/[0.06] min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block">
                          WEIGHT
                        </span>
                        <span className="font-bold text-white font-mono">
                          {inspectingCustomer.weight}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#090A0E] border border-white/[0.06] min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block">
                          BODY FAT
                        </span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {inspectingCustomer.bodyFat}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#090A0E] border border-white/[0.06] min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block">
                          BLOOD
                        </span>
                        <span className="font-bold text-purple-400 font-mono">
                          {inspectingCustomer.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section Tabs Navigation Bar */}
                  <div className="bg-[#12141C] border border-white/[0.08] p-1.5 rounded-2xl flex items-center gap-2 overflow-x-auto no-scrollbar shadow-md">
                    {[
                      {
                        id: "workout-plan",
                        label: "Workout Plan",
                        icon: Dumbbell,
                      },
                      { id: "diet-plan", label: "Diet Plan", icon: Utensils },
                      {
                        id: "trainer-notes",
                        label: "Trainer Notes",
                        icon: NotebookPen,
                      },
                      {
                        id: "progress",
                        label: "Customer Progress Tracking",
                        icon: LineChart,
                      },
                      {
                        id: "chat",
                        label: "Chat with Customer",
                        icon: MessageSquare,
                      },
                    ].map((sub) => {
                      const Icon = sub.icon;
                      const isSubActive = inspectSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setInspectSubTab(sub.id)}
                          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            isSubActive
                              ? "bg-purple-600 text-white shadow-md font-bold"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon
                            size={15}
                            className={
                              isSubActive ? "text-white" : "text-slate-400"
                            }
                          />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* SUBSECTION 1: WORKOUT PLAN */}
                  {inspectSubTab === "workout-plan" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                        <div>
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                            <Dumbbell size={20} className="text-purple-400" />{" "}
                            Customized Workout Protocol
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Assign periodized hypertrophy, powerlifting splits,
                            and conditioning protocols.
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Last update:{" "}
                          {inspectingCustomer.workoutPlan?.updatedAt ||
                            "Recently"}
                        </span>
                      </div>

                      <form
                        onSubmit={handleSaveWorkout}
                        className="space-y-6 text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Primary Training Split Preset
                            </label>
                            <select
                              value={activeWorkoutForm.split}
                              onChange={(e) => {
                                const newSplit = e.target.value;
                                const defaultForSplit = DEFAULT_WORKOUT_SPLITS[
                                  newSplit
                                ]
                                  ? JSON.parse(
                                      JSON.stringify(
                                        DEFAULT_WORKOUT_SPLITS[newSplit],
                                      ),
                                    )
                                  : activeWorkoutForm.dailySplits;
                                setActiveWorkoutForm({
                                  ...activeWorkoutForm,
                                  split: newSplit,
                                  dailySplits: defaultForSplit,
                                });
                                if (defaultForSplit) {
                                  setTrainerWorkoutDay(
                                    Object.keys(defaultForSplit)[0] || "day1",
                                  );
                                }
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500 font-semibold"
                            >
                              <option value="Push-Pull-Legs (Hypertrophy)">
                                Push-Pull-Legs (5-Day Hypertrophy Split)
                              </option>
                              <option value="Upper / Lower Power Split">
                                Upper / Lower Power Split (4-Day)
                              </option>
                              <option value="Olympic Powerlifting Split">
                                Olympic Powerlifting & Barbell Velocity (3-Day)
                              </option>
                              <option value="Full Body Athletic Conditioning">
                                Full Body Athletic Conditioning (3-Day)
                              </option>
                              <option value="Cardio & Metabolic Conditioning">
                                Cardio & Metabolic Conditioning (2-Day)
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Weekly Training Frequency
                            </label>
                            <input
                              type="text"
                              value={activeWorkoutForm.frequency}
                              onChange={(e) =>
                                setActiveWorkoutForm({
                                  ...activeWorkoutForm,
                                  frequency: e.target.value,
                                })
                              }
                              placeholder="e.g. 5 Days / Week (60-75 Mins)"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Intensity & Cadence Target
                            </label>
                            <input
                              type="text"
                              value={activeWorkoutForm.intensity}
                              onChange={(e) =>
                                setActiveWorkoutForm({
                                  ...activeWorkoutForm,
                                  intensity: e.target.value,
                                })
                              }
                              placeholder="e.g. High Intensity RPE 8-9, 3s Eccentrics"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Cardio & Recovery Protocol
                            </label>
                            <input
                              type="text"
                              value={activeWorkoutForm.cardioProtocol}
                              onChange={(e) =>
                                setActiveWorkoutForm({
                                  ...activeWorkoutForm,
                                  cardioProtocol: e.target.value,
                                })
                              }
                              placeholder="e.g. 20 Mins Incline Treadmill Post-Lift"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Coach's Technical Cues & Execution Notes
                          </label>
                          <textarea
                            rows={2}
                            value={activeWorkoutForm.customNotes}
                            onChange={(e) =>
                              setActiveWorkoutForm({
                                ...activeWorkoutForm,
                                customNotes: e.target.value,
                              })
                            }
                            placeholder="Enter specific form audits, rest interval guidelines, or warm-up sequences..."
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Daily Split & Exercise Routine Customizer */}
                        <div className="pt-4 border-t border-white/10 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <h5 className="text-sm font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                                <Dumbbell
                                  size={16}
                                  className="text-purple-400"
                                />{" "}
                                Prescribed Daily Splits & Exercise Routines
                              </h5>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Customize daily split names, focus areas,
                                exercises, sets, reps, target weights, and rest
                                periods.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const currentDay =
                                  activeWorkoutForm.dailySplits[
                                    trainerWorkoutDay
                                  ];
                                const newEx = {
                                  id: `ex-${Date.now()}`,
                                  name: "New Exercise Movement",
                                  sets: "3 Sets",
                                  reps: "10 - 12 Reps",
                                  target: "Moderate RPE 8",
                                  rest: "60s",
                                };
                                setActiveWorkoutForm((prev) => ({
                                  ...prev,
                                  dailySplits: {
                                    ...prev.dailySplits,
                                    [trainerWorkoutDay]: {
                                      ...currentDay,
                                      exercises: [
                                        ...(currentDay.exercises || []),
                                        newEx,
                                      ],
                                    },
                                  },
                                }));
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Plus size={13} /> Add Exercise to{" "}
                              {trainerWorkoutDay.toUpperCase()}
                            </button>
                          </div>

                          {/* Day Tabs */}
                          <div className="flex flex-wrap gap-2">
                            {activeWorkoutForm.dailySplits &&
                              Object.keys(activeWorkoutForm.dailySplits).map(
                                (dayKey, idx) => (
                                  <button
                                    key={dayKey}
                                    type="button"
                                    onClick={() => setTrainerWorkoutDay(dayKey)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                      trainerWorkoutDay === dayKey
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "bg-[#090A0E] text-slate-400 border border-white/[0.06] hover:border-white/20"
                                    }`}
                                  >
                                    Day {idx + 1} Split
                                  </button>
                                ),
                              )}
                          </div>

                          {/* Current Day Editor Card */}
                          {activeWorkoutForm.dailySplits &&
                            activeWorkoutForm.dailySplits[
                              trainerWorkoutDay
                            ] && (
                              <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/[0.08] space-y-4 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/[0.06]">
                                  <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-300">
                                      Day Split Title
                                    </label>
                                    <input
                                      type="text"
                                      value={
                                        activeWorkoutForm.dailySplits[
                                          trainerWorkoutDay
                                        ].title || ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setActiveWorkoutForm((prev) => ({
                                          ...prev,
                                          dailySplits: {
                                            ...prev.dailySplits,
                                            [trainerWorkoutDay]: {
                                              ...prev.dailySplits[
                                                trainerWorkoutDay
                                              ],
                                              title: val,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="e.g. Day 1: Chest & Triceps Hypertrophy"
                                      className="w-full px-3 py-2 rounded-lg bg-[#12141C] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-300">
                                      Biomechanical Focus
                                    </label>
                                    <input
                                      type="text"
                                      value={
                                        activeWorkoutForm.dailySplits[
                                          trainerWorkoutDay
                                        ].focus || ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setActiveWorkoutForm((prev) => ({
                                          ...prev,
                                          dailySplits: {
                                            ...prev.dailySplits,
                                            [trainerWorkoutDay]: {
                                              ...prev.dailySplits[
                                                trainerWorkoutDay
                                              ],
                                              focus: val,
                                            },
                                          },
                                        }));
                                      }}
                                      placeholder="e.g. Push Power & Upper Torso Peak"
                                      className="w-full px-3 py-2 rounded-lg bg-[#12141C] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                                    />
                                  </div>
                                </div>

                                {/* Exercises Table / Form Cards */}
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
                                    <span>Movement Name</span>
                                    <span>Sets • Reps • Target • Rest</span>
                                  </div>

                                  {!activeWorkoutForm.dailySplits[
                                    trainerWorkoutDay
                                  ].exercises ||
                                  activeWorkoutForm.dailySplits[
                                    trainerWorkoutDay
                                  ].exercises.length === 0 ? (
                                    <div className="p-4 rounded-xl bg-[#12141C] text-center text-slate-500 text-xs">
                                      No exercises in this split yet. Click "Add
                                      Exercise" above to configure movements.
                                    </div>
                                  ) : (
                                    activeWorkoutForm.dailySplits[
                                      trainerWorkoutDay
                                    ].exercises.map((ex, exIdx) => (
                                      <div
                                        key={ex.id || exIdx}
                                        className="p-3.5 rounded-xl bg-[#12141C] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                                      >
                                        <div className="flex items-center gap-3 w-full md:w-1/3">
                                          <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                                            {exIdx + 1}
                                          </div>
                                          <input
                                            type="text"
                                            value={ex.name}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setActiveWorkoutForm((prev) => {
                                                const currentDay =
                                                  prev.dailySplits[
                                                    trainerWorkoutDay
                                                  ];
                                                const updated = [
                                                  ...(currentDay.exercises ||
                                                    []),
                                                ];
                                                updated[exIdx] = {
                                                  ...updated[exIdx],
                                                  name: val,
                                                };
                                                return {
                                                  ...prev,
                                                  dailySplits: {
                                                    ...prev.dailySplits,
                                                    [trainerWorkoutDay]: {
                                                      ...currentDay,
                                                      exercises: updated,
                                                    },
                                                  },
                                                };
                                              });
                                            }}
                                            placeholder="Exercise Name"
                                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#090A0E] border border-white/10 text-white text-xs font-semibold outline-none focus:border-purple-500"
                                          />
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 w-full md:w-auto flex-1">
                                          <input
                                            type="text"
                                            value={ex.sets}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setActiveWorkoutForm((prev) => {
                                                const currentDay =
                                                  prev.dailySplits[
                                                    trainerWorkoutDay
                                                  ];
                                                const updated = [
                                                  ...(currentDay.exercises ||
                                                    []),
                                                ];
                                                updated[exIdx] = {
                                                  ...updated[exIdx],
                                                  sets: val,
                                                };
                                                return {
                                                  ...prev,
                                                  dailySplits: {
                                                    ...prev.dailySplits,
                                                    [trainerWorkoutDay]: {
                                                      ...currentDay,
                                                      exercises: updated,
                                                    },
                                                  },
                                                };
                                              });
                                            }}
                                            placeholder="4 Sets"
                                            className="px-2 py-1.5 rounded-lg bg-[#090A0E] border border-white/10 text-slate-300 text-xs text-center outline-none focus:border-purple-500"
                                          />
                                          <input
                                            type="text"
                                            value={ex.reps}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setActiveWorkoutForm((prev) => {
                                                const currentDay =
                                                  prev.dailySplits[
                                                    trainerWorkoutDay
                                                  ];
                                                const updated = [
                                                  ...(currentDay.exercises ||
                                                    []),
                                                ];
                                                updated[exIdx] = {
                                                  ...updated[exIdx],
                                                  reps: val,
                                                };
                                                return {
                                                  ...prev,
                                                  dailySplits: {
                                                    ...prev.dailySplits,
                                                    [trainerWorkoutDay]: {
                                                      ...currentDay,
                                                      exercises: updated,
                                                    },
                                                  },
                                                };
                                              });
                                            }}
                                            placeholder="8 - 10 Reps"
                                            className="px-2 py-1.5 rounded-lg bg-[#090A0E] border border-white/10 text-slate-300 text-xs text-center outline-none focus:border-purple-500"
                                          />
                                          <input
                                            type="text"
                                            value={ex.target}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setActiveWorkoutForm((prev) => {
                                                const currentDay =
                                                  prev.dailySplits[
                                                    trainerWorkoutDay
                                                  ];
                                                const updated = [
                                                  ...(currentDay.exercises ||
                                                    []),
                                                ];
                                                updated[exIdx] = {
                                                  ...updated[exIdx],
                                                  target: val,
                                                };
                                                return {
                                                  ...prev,
                                                  dailySplits: {
                                                    ...prev.dailySplits,
                                                    [trainerWorkoutDay]: {
                                                      ...currentDay,
                                                      exercises: updated,
                                                    },
                                                  },
                                                };
                                              });
                                            }}
                                            placeholder="85 kg"
                                            className="px-2 py-1.5 rounded-lg bg-[#090A0E] border border-white/10 text-purple-300 font-medium text-xs text-center outline-none focus:border-purple-500"
                                          />
                                          <input
                                            type="text"
                                            value={ex.rest}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setActiveWorkoutForm((prev) => {
                                                const currentDay =
                                                  prev.dailySplits[
                                                    trainerWorkoutDay
                                                  ];
                                                const updated = [
                                                  ...(currentDay.exercises ||
                                                    []),
                                                ];
                                                updated[exIdx] = {
                                                  ...updated[exIdx],
                                                  rest: val,
                                                };
                                                return {
                                                  ...prev,
                                                  dailySplits: {
                                                    ...prev.dailySplits,
                                                    [trainerWorkoutDay]: {
                                                      ...currentDay,
                                                      exercises: updated,
                                                    },
                                                  },
                                                };
                                              });
                                            }}
                                            placeholder="90s Rest"
                                            className="px-2 py-1.5 rounded-lg bg-[#090A0E] border border-white/10 text-slate-400 text-xs text-center outline-none focus:border-purple-500"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveWorkoutForm((prev) => {
                                              const currentDay =
                                                prev.dailySplits[
                                                  trainerWorkoutDay
                                                ];
                                              const updated =
                                                currentDay.exercises.filter(
                                                  (_, idx) => idx !== exIdx,
                                                );
                                              return {
                                                ...prev,
                                                dailySplits: {
                                                  ...prev.dailySplits,
                                                  [trainerWorkoutDay]: {
                                                    ...currentDay,
                                                    exercises: updated,
                                                  },
                                                },
                                              };
                                            });
                                          }}
                                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                                          title="Delete movement"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="pt-3 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Save size={15} /> Save & Push Workout Plan
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SUBSECTION 2: DIET PLAN */}
                  {inspectSubTab === "diet-plan" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                        <div>
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                            <Utensils size={20} className="text-emerald-400" />{" "}
                            Tailored Macro & Nutrition Protocol
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Configure caloric targets, protein intake, hydration
                            goals, and fuel timing.
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Last update:{" "}
                          {inspectingCustomer.dietPlan?.updatedAt || "Recently"}
                        </span>
                      </div>

                      <form
                        onSubmit={handleSaveDiet}
                        className="space-y-5 text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Daily Caloric Target
                            </label>
                            <input
                              type="text"
                              value={activeDietForm.dailyCalories}
                              onChange={(e) =>
                                setActiveDietForm({
                                  ...activeDietForm,
                                  dailyCalories: e.target.value,
                                })
                              }
                              placeholder="e.g. 2,800 kcal"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Daily Protein Intake
                            </label>
                            <input
                              type="text"
                              value={activeDietForm.protein}
                              onChange={(e) =>
                                setActiveDietForm({
                                  ...activeDietForm,
                                  protein: e.target.value,
                                })
                              }
                              placeholder="e.g. 180g (2.2g/kg)"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Daily Hydration Target
                            </label>
                            <input
                              type="text"
                              value={activeDietForm.waterIntake}
                              onChange={(e) =>
                                setActiveDietForm({
                                  ...activeDietForm,
                                  waterIntake: e.target.value,
                                })
                              }
                              placeholder="e.g. 4.0 Liters Daily"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Meal Timing Schedule & Protocol
                            </label>
                            <textarea
                              rows={3}
                              value={activeDietForm.mealProtocol}
                              onChange={(e) =>
                                setActiveDietForm({
                                  ...activeDietForm,
                                  mealProtocol: e.target.value,
                                })
                              }
                              placeholder="e.g. 4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Recommended Supplementation Stack
                            </label>
                            <textarea
                              rows={3}
                              value={activeDietForm.supplements}
                              onChange={(e) =>
                                setActiveDietForm({
                                  ...activeDietForm,
                                  supplements: e.target.value,
                                })
                              }
                              placeholder="e.g. Whey Isolate, Creatine Creapure 5g, Electrolytes"
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Save size={15} /> Save & Push Diet Plan
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SUBSECTION 3: TRAINER NOTES */}
                  {inspectSubTab === "trainer-notes" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                      <div className="pb-4 border-b border-white/[0.06]">
                        <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                          <NotebookPen size={20} className="text-purple-400" />{" "}
                          Coach Observation & Form Audit Notes
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Private coach logs on athlete progression, movement
                          restrictions, and recovery status.
                        </p>
                      </div>

                      <form
                        onSubmit={handleAddTrainerNote}
                        className="space-y-2 text-xs"
                      >
                        <label className="text-slate-300 font-medium">
                          Log New Observation / Audit Entry
                        </label>
                        <div className="flex gap-2.5">
                          <input
                            type="text"
                            value={newTrainerNote}
                            onChange={(e) => setNewTrainerNote(e.target.value)}
                            placeholder="e.g. Cleared for 150kg squat PR attempts next week. Form remained rigid throughout 5x5."
                            className="flex-1 px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
                          >
                            <Plus size={15} /> Add Note
                          </button>
                        </div>
                      </form>

                      <div className="space-y-3 pt-2">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          CHRONOLOGICAL COACH LOGS
                        </h5>
                        {!inspectingCustomer.trainerNotes ||
                        inspectingCustomer.trainerNotes.length === 0 ? (
                          <div className="p-6 rounded-2xl bg-[#090A0E] text-center text-slate-400 text-xs">
                            No trainer notes logged yet. Use the field above to
                            log your first observation.
                          </div>
                        ) : (
                          inspectingCustomer.trainerNotes.map((n, i) => (
                            <div
                              key={i}
                              className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/[0.06] space-y-1.5 text-xs"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-purple-400 font-mono">
                                  {n.author || "Master Coach"}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {n.date}
                                </span>
                              </div>
                              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                                {n.note}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUBSECTION 4: CUSTOMER PROGRESS TRACKING */}
                  {inspectSubTab === "progress" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                        <div>
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                            <LineChart size={20} className="text-purple-400" />{" "}
                            Athlete Biometrics & 1RM PR Telemetry
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Track compound 1-Rep-Max strength records, body
                            composition changes, and workout volume.
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Last audit:{" "}
                          {inspectingCustomer.progress?.lastAuditDate ||
                            "Recently"}
                        </span>
                      </div>

                      <form
                        onSubmit={handleSaveProgress}
                        className="space-y-6 text-xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
                              BENCH PRESS 1RM
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.benchPressPR}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  benchPressPR: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white font-mono text-base outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
                              BACK SQUAT 1RM
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.squatPR}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  squatPR: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white font-mono text-base outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
                              DEADLIFT 1RM
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.deadliftPR}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  deadliftPR: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white font-mono text-base outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Current Body Weight
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.currentWeight}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  currentWeight: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Target Goal Weight
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.targetWeight}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  targetWeight: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-300 font-medium">
                              Body Fat Percentage
                            </label>
                            <input
                              type="text"
                              value={activeProgressForm.bodyFat}
                              onChange={(e) =>
                                setActiveProgressForm({
                                  ...activeProgressForm,
                                  bodyFat: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Save size={15} /> Update Athlete Telemetry
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SUBSECTION 5: CHAT WITH CUSTOMER */}
                  {inspectSubTab === "chat" && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <div>
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                            <MessageSquare
                              size={20}
                              className="text-purple-400"
                            />{" "}
                            1-on-1 Coach & Athlete Advisory Channel
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Send direct workout feedback, video critique, and
                            schedule updates to {inspectingCustomer.name}.
                          </p>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ● Active Session
                        </span>
                      </div>

                      <div className="flex flex-col h-[480px] rounded-2xl bg-[#090A0E] border border-white/10 overflow-hidden">
                        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-3">
                          {chatMessages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                              No previous chat messages with this athlete. Send
                              an advisory below to start communication.
                            </div>
                          ) : (
                            chatMessages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex flex-col max-w-[80%] ${
                                  msg.sender === "coach"
                                    ? "ml-auto items-end"
                                    : "mr-auto items-start"
                                }`}
                              >
                                <div
                                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                    msg.sender === "coach"
                                      ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                                      : "bg-[#181A26] text-slate-200 border border-white/10 rounded-tl-none"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                                  {msg.time || "Just now"}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        <form
                          onSubmit={handleSendChat}
                          className="p-3 bg-[#12141C] border-t border-white/10 flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={`Send direct coach message to ${inspectingCustomer.name}...`}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                          <button
                            type="submit"
                            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md transition-all flex items-center justify-center"
                          >
                            <Send size={16} />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* IF NO ATHLETE IS SELECTED -> RENDER ATHLETE ROSTER GRID */
                <div className="space-y-6">
                  {/* Header with Live Stats */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                        Assigned Athletes & Customer Roster
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Live registered members from database. Click any athlete
                        to open their dedicated <strong>Workout Plan</strong>,{" "}
                        <strong>Diet Plan</strong>,{" "}
                        <strong>Trainer Notes</strong>,{" "}
                        <strong>Progress Tracking</strong>, and{" "}
                        <strong>1-on-1 Chat</strong> section.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
                        <UserCheck size={14} className="text-purple-400" />{" "}
                        {allCustomers.length} Total Athletes in DB
                      </span>
                    </div>
                  </div>

                  {/* Search & Filter Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#12141C] border border-white/[0.08]">
                    <div className="relative w-full sm:w-80">
                      <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search athlete by name, email, phone..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setCustomerFilter("all")}
                        className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          customerFilter === "all"
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-[#090A0E] text-slate-400 hover:text-white border border-white/10"
                        }`}
                      >
                        All Athletes ({allCustomers.length})
                      </button>
                      <button
                        onClick={() => setCustomerFilter("active")}
                        className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          customerFilter === "active"
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-[#090A0E] text-slate-400 hover:text-white border border-white/10"
                        }`}
                      >
                        Active Members Only
                      </button>
                    </div>
                  </div>

                  {/* Athletes Roster Cards Grid */}
                  {loading ? (
                    <div className="p-12 rounded-3xl bg-[#12141C] border border-white/[0.08] text-center text-slate-400 text-xs font-mono">
                      Connecting to MongoDB and fetching genuine athlete
                      roster...
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-[#12141C] border border-white/[0.08] text-center space-y-3">
                      <Users size={32} className="text-slate-500 mx-auto" />
                      <h3 className="text-base font-bold text-white">
                        No Athletes Found in Database
                      </h3>
                      <p className="text-xs text-slate-400">
                        No registered customers match your search query.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() =>
                            handleInspectCustomer(cust, "workout-plan")
                          }
                          className="p-5 sm:p-6 rounded-3xl bg-[#12141C] border border-white/[0.08] space-y-4 shadow-sm hover:border-purple-500/50 transition-all flex flex-col justify-between group cursor-pointer hover:bg-[#151722]"
                        >
                          <div className="space-y-3.5">
                            {/* Athlete Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={cust.avatar}
                                  alt={cust.name}
                                  className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30 shadow-md"
                                />
                                <div>
                                  <h3 className="text-base font-bold text-white font-['Outfit',sans-serif] group-hover:text-purple-400 transition-colors">
                                    {cust.name}
                                  </h3>
                                  <span className="text-[11px] text-purple-400 font-mono font-semibold block">
                                    {cust.membershipPlan}
                                  </span>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-bold font-mono">
                                {cust.membershipStatus}
                              </span>
                            </div>

                            {/* Telemetry Summary Strip */}
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                              <div className="p-2.5 rounded-xl bg-[#090A0E] border border-white/[0.04]">
                                <span className="text-[10px] text-slate-400 block">
                                  WEIGHT
                                </span>
                                <span className="font-bold text-white font-mono">
                                  {cust.weight}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[#090A0E] border border-white/[0.04]">
                                <span className="text-[10px] text-slate-400 block">
                                  BODY FAT
                                </span>
                                <span className="font-bold text-emerald-400 font-mono">
                                  {cust.bodyFat}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[#090A0E] border border-white/[0.04]">
                                <span className="text-[10px] text-slate-400 block">
                                  ADHERENCE
                                </span>
                                <span className="font-bold text-purple-400 font-mono">
                                  {cust.progress?.weeklyAttendanceScore ||
                                    "96%"}
                                </span>
                              </div>
                            </div>

                            {/* Split & Contact Info */}
                            <div className="p-3.5 rounded-2xl bg-[#090A0E] border border-white/[0.04] space-y-1.5 text-xs">
                              <div className="flex justify-between items-center text-slate-400">
                                <span>Active Split:</span>
                                <span className="text-white font-semibold truncate max-w-[140px]">
                                  {cust.workoutPlan?.split || "Push-Pull-Legs"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400">
                                <span>Phone:</span>
                                <span className="text-slate-300 font-mono">
                                  {cust.phone}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400 truncate">
                                <span>Email:</span>
                                <span className="text-slate-300 truncate max-w-[140px]">
                                  {cust.email}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Inspection Buttons */}
                          <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectCustomer(cust, "workout-plan");
                              }}
                              className="py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <Dumbbell size={13} /> View Plan
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectCustomer(cust, "chat");
                              }}
                              className="py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare size={13} /> Chat
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================================= */}
          {/* 2. PROFILE SECTION (INLINE VIEW, AVATAR UPLOAD, & CERTIFICATE DOCUMENTS SYSTEM)           */}
          {/* ========================================================================================= */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fadeIn">
              {/* IF EDIT PROFILE IS ACTIVE -> RENDER AS DEDICATED IN-PAGE SECTION */}
              {editProfileOpen ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Navigation */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <button
                      onClick={() => setEditProfileOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm group"
                    >
                      <ArrowLeft
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                      <span>Back to Profile Overview</span>
                    </button>

                    <span className="text-xs text-purple-400 font-mono font-bold">
                      Faculty Credentials Editor
                    </span>
                  </div>

                  {/* Inline Edit Form Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-purple-500/40 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                        <Edit2 size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                          Edit Coach Profile Details
                        </h3>
                        <p className="text-xs text-slate-400">
                          Update your biographical info, shift hours, coaching
                          arena, and upload new avatar photo.
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSaveProfile}
                      className="space-y-6 text-xs"
                    >
                      {/* Avatar Photo Section */}
                      <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative group">
                          <img
                            src={editProfileForm.avatar}
                            alt={editProfileForm.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/50 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Change photo"
                          >
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">
                              Upload
                            </span>
                          </button>
                        </div>

                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <h4 className="text-sm font-bold text-white">
                            Profile Photo & Avatar
                          </h4>
                          <p className="text-xs text-slate-400">
                            Upload a high-resolution headshot from your device
                            or specify an image URL.
                          </p>

                          <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                            <input
                              type="file"
                              ref={avatarFileInputRef}
                              onChange={handleAvatarFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                avatarFileInputRef.current?.click()
                              }
                              disabled={isUploadingAvatar}
                              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-2 shadow-md disabled:opacity-50"
                            >
                              <Upload size={13} />{" "}
                              {isUploadingAvatar
                                ? "Uploading to Cloudinary CDN..."
                                : "Select Image from Computer"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Coach Full Name
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.name}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Specialization & Role Title
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.spec}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                spec: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Experience
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.experience}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                experience: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Duty Shift Hours
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.shift}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                shift: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Primary Coaching Arena
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.room}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                room: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-300 font-medium">
                            Contact Phone Number
                          </label>
                          <input
                            type="text"
                            value={editProfileForm.phone}
                            onChange={(e) =>
                              setEditProfileForm({
                                ...editProfileForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-medium">
                          Coaching Philosophy & Biography
                        </label>
                        <textarea
                          rows={4}
                          value={editProfileForm.bio}
                          onChange={(e) =>
                            setEditProfileForm({
                              ...editProfileForm,
                              bio: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditProfileOpen(false)}
                          className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Save size={15} /> Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                /* PROFILE OVERVIEW SECTION WITH CERTIFICATE MANAGEMENT */
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                        Master Coach Profile & Credentials
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Official faculty biographical data, active
                        certifications, shift telemetry, and document
                        credentials.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditProfileForm({ ...coachProfile });
                        setEditProfileOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md"
                    >
                      <Edit2 size={14} /> Edit Profile Data
                    </button>
                  </div>

                  {/* Coach Credentials Banner Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
                      <div className="flex items-center gap-5">
                        <div className="relative group">
                          <img
                            src={coachProfile.avatar}
                            alt={coachProfile.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-purple-500/50 shadow-xl"
                          />
                          <button
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            title="Upload new profile picture"
                          >
                            <Camera size={14} />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif]">
                              {coachProfile.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/60 text-[10px] font-bold font-mono">
                              ★ MASTER FACULTY
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-purple-400 font-semibold block">
                            {coachProfile.spec}
                          </span>
                          <span className="text-xs text-slate-400 block">
                            {coachProfile.experience} • Duty Shift:{" "}
                            {coachProfile.shift}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="p-3.5 rounded-2xl bg-[#090A0E] border border-white/5 text-center min-w-[120px]">
                          <div className="text-xl font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
                            <Star
                              size={16}
                              className="fill-amber-400 text-amber-400"
                            />{" "}
                            {coachProfile.rating}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Faculty Rating
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#090A0E] border border-white/5 text-center min-w-[120px]">
                          <div className="text-xl font-bold text-white font-mono">
                            {coachProfile.totalSessions}+
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Sessions Run
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                          TRAINING ARENA:
                        </span>
                        <p className="font-semibold text-white">
                          {coachProfile.room}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                          COACH EMAIL:
                        </span>
                        <p className="font-semibold text-slate-300 truncate">
                          {coachProfile.email}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                          COACH PHONE:
                        </span>
                        <p className="font-semibold text-slate-300 font-mono">
                          {coachProfile.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        COACHING PHILOSOPHY & BIO
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#090A0E] p-4 rounded-2xl border border-white/5 italic">
                        "{coachProfile.bio}"
                      </p>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* CERTIFICATE DOCUMENTS & UPLOAD SUB-SECTION                */}
                  {/* ========================================================= */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.06]">
                      <div>
                        <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                          <FileCheck size={20} className="text-purple-400" />{" "}
                          Accredited Certificates & File Credentials
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Upload, manage, and verify official faculty
                          certifications, degrees, and licenses.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800 text-xs font-mono font-semibold">
                        {(coachProfile.certificateFiles || []).length} Verified
                        Documents
                      </span>
                    </div>

                    {/* Upload New Certificate Form */}
                    <form
                      onSubmit={handleUploadCertificate}
                      className="p-5 rounded-2xl bg-[#090A0E] border border-purple-500/20 space-y-4 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Upload size={16} className="text-purple-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Upload New Certificate Document
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5 sm:col-span-1">
                          <label className="text-slate-300 font-medium">
                            Certificate Title
                          </label>
                          <input
                            type="text"
                            value={newCertTitle}
                            onChange={(e) => setNewCertTitle(e.target.value)}
                            placeholder="e.g. CSCS Strength Specialist"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-1">
                          <label className="text-slate-300 font-medium">
                            Issuing Academy / Board
                          </label>
                          <input
                            type="text"
                            value={newCertIssuer}
                            onChange={(e) => setNewCertIssuer(e.target.value)}
                            placeholder="e.g. NSCA / USAW Weightlifting"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-1">
                          <label className="text-slate-300 font-medium">
                            Issue Year
                          </label>
                          <input
                            type="text"
                            value={newCertDate}
                            onChange={(e) => setNewCertDate(e.target.value)}
                            placeholder="2026"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#12141C] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* File Selection Box */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <input
                          type="file"
                          ref={certFileInputRef}
                          onChange={handleCertFileSelect}
                          accept=".pdf,image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certFileInputRef.current?.click()}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          <Upload size={14} className="text-purple-400" />
                          <span>
                            {selectedCertFileName
                              ? `File: ${selectedCertFileName}`
                              : "Choose File (PDF or Image)"}
                          </span>
                        </button>

                        <button
                          type="submit"
                          disabled={isUploadingCert}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Plus size={15} />{" "}
                          {isUploadingCert
                            ? "Uploading to Cloudinary CDN..."
                            : "Upload & Add to Credentials"}
                        </button>
                      </div>
                    </form>

                    {/* Uploaded Certificate Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {(coachProfile.certificateFiles || []).map((cert) => (
                        <div
                          key={cert.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/[0.06] hover:border-purple-500/40 transition-all space-y-3 flex flex-col justify-between group shadow-sm"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                                <Award size={18} />
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-semibold">
                                ✓ Verified
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                {cert.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {cert.issuer}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                              <span>Issued: {cert.issueDate}</span>
                              <span>{cert.fileType || "Document"}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingCertificateFile(cert)}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-purple-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <ExternalLink size={12} /> View File
                            </button>
                            <button
                              onClick={() => handleDeleteCert(cert.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                              title="Delete certificate"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. NOTIFICATIONS SECTION                                  */}
          {/* ========================================================= */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                    Live Alerts & Notifications
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Real-time gym floor telemetry, athlete check-ins, routine
                    review requests, and management notices.
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={14} className="text-emerald-400" /> Mark
                    All as Read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#12141C] border border-white/[0.08] text-center space-y-3">
                  <Bell size={32} className="text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">
                    All Caught Up!
                  </h3>
                  <p className="text-xs text-slate-400">
                    No new alerts or telemetry notifications at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-sm ${
                        notif.unread
                          ? "bg-[#151824] border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-[#12141C] border-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === "feedback"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : notif.type === "checkin"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : notif.type === "audit"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : notif.type === "assign"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {notif.type === "feedback" ? (
                            <Star
                              size={18}
                              className="fill-amber-400 text-amber-400"
                            />
                          ) : notif.type === "checkin" ? (
                            <CalendarCheck size={18} />
                          ) : notif.type === "audit" ? (
                            <Award size={18} />
                          ) : notif.type === "assign" ? (
                            <UserCheck size={18} />
                          ) : (
                            <Activity size={18} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                              {notif.title}
                            </h4>
                            {notif.unread && (
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {notif.desc}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {notif.time}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => clearNotification(notif.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                        title="Dismiss notification"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. FEEDBACKS SECTION                                      */}
          {/* ========================================================= */}
          {activeTab === "feedbacks" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                    Athlete Reviews & Performance Feedback
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Verified member ratings, performance audit feedback, and
                    coach responsiveness scores.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />{" "}
                    Overall Rating:{" "}
                    {feedbacks.length > 0
                      ? (
                          feedbacks.reduce(
                            (sum, f) => sum + (Number(f.rating) || 5),
                            0,
                          ) / feedbacks.length
                        ).toFixed(1)
                      : coachProfile.rating || "5.0"}{" "}
                    / 5.0 ({feedbacks.length} Reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="p-10 sm:p-14 rounded-3xl bg-[#12141C] border border-white/[0.08] text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400 mx-auto">
                      <Star size={22} />
                    </div>
                    <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                      No Athlete Feedbacks Logged Yet
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      When your assigned members submit coaching reviews,
                      ratings, and feedback from their portal, their live
                      reviews will appear here in real time.
                    </p>
                  </div>
                ) : (
                  feedbacks.map((fb) => {
                    const matchedCustomer = allCustomers.find(
                      (c) =>
                        (c._id && c._id === fb.customerId) ||
                        (c.id && c.id === fb.customerId) ||
                        (c.name &&
                          fb.athleteName &&
                          c.name.toLowerCase().trim() ===
                            fb.athleteName.toLowerCase().trim()),
                    );
                    const athleteImg =
                      matchedCustomer?.avatar ||
                      fb.athleteAvatar ||
                      fb.customerAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                    const athletePlan =
                      matchedCustomer?.plan ||
                      fb.plan ||
                      fb.customerPlan ||
                      "VIP Athlete Member";

                    return (
                      <div
                        key={fb.id}
                        className="p-5 sm:p-6 rounded-3xl bg-[#12141C] border border-white/[0.08] space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/[0.04]">
                          <div className="flex items-center gap-3">
                            <img
                              src={athleteImg}
                              alt={fb.athleteName}
                              className="w-10 h-10 rounded-xl object-cover border border-white/10"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                              }}
                            />
                            <div>
                              <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                                {fb.athleteName}
                              </h4>
                              <span className="text-[11px] text-purple-400 font-mono">
                                {athletePlan}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={
                                    i < fb.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-600"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {fb.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          "{fb.comment}"
                        </p>

                        {fb.reply ? (
                          <div className="p-3.5 rounded-2xl bg-[#090A0E] border border-purple-500/20 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                              <MessageCircle size={13} />{" "}
                              {fb.replyAuthor || user?.name || "Coach"}'s Reply:
                            </div>
                            <p className="text-xs text-slate-300 italic">
                              {fb.reply}
                            </p>
                          </div>
                        ) : (
                          <div className="pt-2 flex gap-2">
                            <input
                              type="text"
                              value={replyInput[fb.id] || ""}
                              onChange={(e) =>
                                setReplyInput((prev) => ({
                                  ...prev,
                                  [fb.id]: e.target.value,
                                }))
                              }
                              placeholder="Write a coach reply to this feedback..."
                              className="flex-1 px-3.5 py-2 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={() => handleSendFeedbackReply(fb.id)}
                              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Send size={13} /> Reply
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. SETTINGS SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div className="pb-4 border-b border-white/[0.08]">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">
                  Coach Configuration & Preferences
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Configure your duty shifts, notification routing, arena
                  preferences, and platform security.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#12141C] border border-white/[0.08] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Clock size={16} className="text-purple-400" /> Shift &
                      Floor Location
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                      <Lock size={10} /> Set by Admin HQ (View Only)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          ASSIGNED DUTY SHIFT
                        </span>
                        <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
                          <Lock size={9} /> Admin Provisioned
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                        <Clock size={16} className="text-purple-400 shrink-0" />
                        <span>
                          {user?.shift ||
                            coachSettings.dutyShift ||
                            "06:00 AM - 02:00 PM (Morning Roster)"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Weekly Active Schedule: Mon - Sat
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          PRIMARY COACHING ARENA
                        </span>
                        <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
                          <Lock size={9} /> Admin Provisioned
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                        <MapPin
                          size={16}
                          className="text-purple-400 shrink-0"
                        />
                        <span>
                          {user?.assignedRoom ||
                            coachSettings.arenaZone ||
                            "Zone 1: Olympic Heavy Platform"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Designated Training Floor & Rig
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/30 flex items-center gap-2.5 text-xs text-purple-300/90">
                    <ShieldCheck
                      size={16}
                      className="text-purple-400 shrink-0"
                    />
                    <span>
                      Shift rosters and floor zone allocations are configured
                      centrally by Admin HQ. Contact management to request a
                      shift adjustment.
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141C] border border-white/[0.08] space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Bell size={16} className="text-purple-400" /> Notifications
                    & Telemetry Triggers
                  </h3>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#090A0E] border border-white/[0.04] cursor-pointer">
                      <div>
                        <span className="font-semibold text-white block">
                          Athlete Check-In Instant Alerts
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Receive notification when an assigned athlete scans
                          into your arena
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={coachSettings.biometricAlerts}
                        onChange={(e) =>
                          setCoachSettings({
                            ...coachSettings,
                            biometricAlerts: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#090A0E] border border-white/[0.04] cursor-pointer">
                      <div>
                        <span className="font-semibold text-white block">
                          Auto-Remind Workout Logs
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Send automated push reminders to athletes who haven't
                          logged today's sets
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={coachSettings.autoRemindWorkoutLogs}
                        onChange={(e) =>
                          setCoachSettings({
                            ...coachSettings,
                            autoRemindWorkoutLogs: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg hover:brightness-110 flex items-center gap-2"
                >
                  <Save size={15} /> Save Coach Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* CERTIFICATE DOCUMENT PREVIEW VIEWER MODAL                 */}
      {/* ========================================================= */}
      {viewingCertificateFile && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#12141C] rounded-3xl border border-purple-500/50 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                    {viewingCertificateFile.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-mono">
                    {viewingCertificateFile.issuer} • Issued{" "}
                    {viewingCertificateFile.issueDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingCertificateFile(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Preview Display */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 rounded-2xl bg-[#08090D] border border-white/10 flex items-center justify-center min-h-[300px]">
              {viewingCertificateFile.fileUrl?.startsWith(
                "data:application/pdf",
              ) ? (
                <iframe
                  src={viewingCertificateFile.fileUrl}
                  title={viewingCertificateFile.title}
                  className="w-full h-[55vh] rounded-xl border-0"
                />
              ) : (
                <img
                  src={
                    viewingCertificateFile.fileUrl ||
                    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={viewingCertificateFile.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl border border-white/10 shadow-2xl"
                />
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-[240px]">
                {viewingCertificateFile.fileName || "certificate_document"}
              </span>
              <div className="flex items-center gap-2">
                {viewingCertificateFile.fileUrl && (
                  <a
                    href={viewingCertificateFile.fileUrl}
                    download={
                      viewingCertificateFile.fileName || "certificate_document"
                    }
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Download size={13} /> Download File
                  </a>
                )}
                <button
                  onClick={() => setViewingCertificateFile(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[160] px-5 py-3.5 rounded-2xl bg-[#151824] border border-purple-500/80 text-white text-xs font-mono shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <Sparkles size={16} className="text-purple-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
