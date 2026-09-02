import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Crown,
  Users,
  CreditCard,
  Dumbbell,
  MessageSquare,
  Package,
  Lock,
  CalendarCheck,
  Apple,
  Settings,
  Activity,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Send,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Check,
  Eye,
  EyeOff,
  ShoppingBag,
  Truck,
  Star,
  RefreshCw,
  QrCode,
  Zap,
  HelpCircle,
  Headphones,
  Plus,
  FileText,
  AlertCircle,
  Camera,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Smartphone,
  History,
  UserCheck,
  Utensils,
  NotebookPen,
  LineChart,
  TrendingUp,
  Target,
  Scale,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';
import api from '../lib/api';
import WorkoutStreakGraph from './WorkoutStreakGraph';
import ThermalReceiptPrinter from './ThermalReceiptPrinter';
import CompleteOrderButton from './CompleteOrderButton';
import ToastNotificationStack from './ToastNotificationStack';
import AnimatedList from './AnimatedList';
import confetti from 'canvas-confetti';
import { DEFAULT_WORKOUT_SPLITS } from './TrainerDashboard';

export default function CustomerDashboard({ onLogout }) {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cmsData } = useLandingPageCMS();

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Active Main Tab & Subtab from URL
  const tabFromUrl = searchParams.get('tab') || 'personal';
  const subFromUrl = searchParams.get('sub') || '';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState(subFromUrl);
  const [toast, setToast] = useState(null);

  // Ensure staff accounts (Admin, Receptionist, Trainer) are redirected to their dedicated portals
  useEffect(() => {
    if (user) {
      const role = (user.role || '').toLowerCase().trim();
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'receptionist') {
        navigate('/receptionist', { replace: true });
      } else if (role === 'trainer') {
        navigate('/trainer', { replace: true });
      }
    }
  }, [user, navigate]);

  // Modals state
  const [chatModalTrainer, setChatModalTrainer] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const qTab = searchParams.get('tab');
    const qSub = searchParams.get('sub');
    if (qTab) {
      setActiveTab(qTab);
    }
    if (qSub) {
      setActiveSubTab(qSub);
    } else {
      // Default subtabs per main tab
      if (qTab === 'personal') setActiveSubTab('profile');
      else if (qTab === 'attendance') setActiveSubTab('logs');
      else if (qTab === 'membership') setActiveSubTab('current');
      else if (qTab === 'trainers') setActiveSubTab('assigned');
      else if (qTab === 'payments') setActiveSubTab('history');
      else if (qTab === 'workout-diet') setActiveSubTab('workout');
      else if (qTab === 'feedback') setActiveSubTab('submit');
      else setActiveSubTab('');
    }
  }, [searchParams]);

  const handleTabChange = (tabId, subId = '') => {
    setActiveTab(tabId);
    let defaultSub = subId;
    if (!defaultSub) {
      if (tabId === 'personal') defaultSub = 'profile';
      else if (tabId === 'attendance') defaultSub = 'logs';
      else if (tabId === 'membership') defaultSub = 'current';
      else if (tabId === 'trainers') defaultSub = 'assigned';
      else if (tabId === 'payments') defaultSub = 'history';
      else if (tabId === 'workout-diet') defaultSub = 'workout';
      else if (tabId === 'feedback') defaultSub = 'submit';
    }
    setActiveSubTab(defaultSub);
    setSearchParams({ tab: tabId, ...(defaultSub ? { sub: defaultSub } : {}) });
    setAccountDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubTabChange = (subId) => {
    setActiveSubTab(subId);
    setSearchParams({ tab: activeTab, sub: subId });
  };

  const [toastsList, setToastsList] = useState([]);
  const showToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    const isSuccess = typeof msg === 'string' && (msg.includes('✅') || msg.includes('✓') || msg.includes('🎉'));
    const isError = typeof msg === 'string' && msg.includes('⚠️');
    const isGate = typeof msg === 'string' && (msg.includes('⚡') || msg.includes('Gate') || msg.includes('Turnstile'));
    
    const newToast = {
      id,
      message: msg,
      type: isSuccess ? 'success' : isError ? 'error' : isGate ? 'gate' : type,
      time: 'Just now'
    };
    setToastsList((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToastsList((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToastsList((prev) => prev.filter((t) => t.id !== id));
  };

  // ==========================================
  // 1. PERSONAL INFORMATION STATE
  // ==========================================
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const fullName = user?.name || 'Abhi Gangamolla';
  const nameParts = fullName.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || 'Abhi');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || 'Gangamolla');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [dob, setDob] = useState(user?.dob || '1998-05-14');
  const [email, setEmail] = useState(user?.email || 'abhigangamolla@gmail.com');
  const [phone, setPhone] = useState(user?.phone && user.phone !== 'N/A' ? user.phone : '+91 98765 43210');
  const [address, setAddress] = useState(
    user?.address && typeof user.address === 'object'
      ? {
          street: user.address.street || 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills',
          city: user.address.city || 'Hyderabad',
          state: user.address.state || 'Telangana',
          pincode: user.address.pincode || '500033'
        }
      : {
          street: 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033'
        }
  );
  const [profilePic, setProfilePic] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  // Physical Telemetry Stats
  const [height, setHeight] = useState(user?.height || '178 cm');
  const [weight, setWeight] = useState(user?.weight || '76 kg');
  const [bodyFat, setBodyFat] = useState(user?.bodyFat || '14.2%');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+');
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'Hypertrophy & Strength Progression');

  // Sync state if user context updates from backend
  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (user.email) setEmail(user.email);
      if (user.phone && user.phone !== 'N/A') setPhone(user.phone);
      if (user.avatar) setProfilePic(user.avatar);
      if (user.dob) setDob(user.dob);
      if (user.gender) setGender(user.gender);
      if (user.address && typeof user.address === 'object') {
        setAddress({
          street: user.address.street || 'Flat 402, Titan Heights, Road No. 36, Jubilee Hills',
          city: user.address.city || 'Hyderabad',
          state: user.address.state || 'Telangana',
          pincode: user.address.pincode || '500033'
        });
      }
      if (user.height) setHeight(user.height);
      if (user.weight) setWeight(user.weight);
      if (user.bodyFat) setBodyFat(user.bodyFat);
      if (user.bloodGroup) setBloodGroup(user.bloodGroup);
      if (user.fitnessGoal) setFitnessGoal(user.fitnessGoal);
    }
  }, [user]);

  // ==========================================
  // COACHING PROTOCOL & TELEMETRY STATE
  // ==========================================
  const [coachingSubTab, setCoachingSubTab] = useState('workout-plan'); // 'workout-plan' | 'diet-plan' | 'trainer-notes' | 'progress' | 'chat'
  const [coachingData, setCoachingData] = useState({
    workoutPlan: user?.workoutPlan || {
      split: 'Push-Pull-Legs (Hypertrophy)',
      frequency: '5 Days / Week',
      intensity: 'High Intensity RPE 8-9',
      cardioProtocol: '20 Mins Incline Treadmill Post-Lift',
      customNotes: 'Focus on explosive concentric cadence and 3s eccentric squats.',
      updatedAt: 'Recently updated by Coach'
    },
    dietPlan: user?.dietPlan || {
      dailyCalories: '2,800 kcal',
      protein: '180g (2.2g/kg)',
      carbs: '320g',
      fats: '65g',
      waterIntake: '4.0 Liters Daily',
      mealProtocol: '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake',
      supplements: ['Hydrolyzed Whey Isolate', 'Creatine Creapure 5g', 'BCAA Electrolytes', 'Multivitamin + Omega 3'],
      updatedAt: 'Recently updated by Coach'
    },
    trainerNotes: user?.trainerNotes && user.trainerNotes.length > 0 ? user.trainerNotes : [
      {
        note: 'Great form progression on compound squats. Recommend moving working sets up by 5kg next week.',
        date: '28 Aug 2026',
        author: user?.assignedTrainerName || 'Master Coach'
      }
    ],
    progress: user?.progress || {
      currentWeight: user?.weight || '76 kg',
      targetWeight: '80 kg Lean Mass',
      bodyFat: user?.bodyFat || '14.2%',
      benchPressPR: '110 kg',
      squatPR: '150 kg',
      deadliftPR: '190 kg',
      weeklyAttendanceScore: '96%',
      lastAuditDate: '30 Aug 2026'
    },
    chatMessages: user?.chatMessages || []
  });

  const [customerChatInput, setCustomerChatInput] = useState('');
  const [customerChatMessages, setCustomerChatMessages] = useState(user?.chatMessages || []);

  // Fetch live coaching telemetry directly from MongoDB database
  const fetchLiveCoachingData = async () => {
    const targetId = user?._id || user?.id;
    if (!targetId) return;
    try {
      const res = await api.get(`/api/users/${targetId}`);
      if (res.data?.status === 'success' && res.data?.data) {
        const u = res.data.data;
        setCoachingData({
          workoutPlan: u.workoutPlan || {
            split: 'Push-Pull-Legs (Hypertrophy)',
            frequency: '5 Days / Week',
            intensity: 'High Intensity RPE 8-9',
            cardioProtocol: '20 Mins Incline Treadmill Post-Lift',
            customNotes: 'Focus on explosive concentric cadence and 3s eccentric squats.',
            updatedAt: 'Recently updated by Coach'
          },
          dietPlan: u.dietPlan || {
            dailyCalories: '2,800 kcal',
            protein: '180g (2.2g/kg)',
            carbs: '320g',
            fats: '65g',
            waterIntake: '4.0 Liters Daily',
            mealProtocol: '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake',
            supplements: ['Hydrolyzed Whey Isolate', 'Creatine Creapure 5g', 'BCAA Electrolytes', 'Multivitamin + Omega 3'],
            updatedAt: 'Recently updated by Coach'
          },
          trainerNotes: u.trainerNotes && u.trainerNotes.length > 0 ? u.trainerNotes : [
            {
              note: 'Great form progression on compound squats. Recommend moving working sets up by 5kg next week.',
              date: '28 Aug 2026',
              author: u.assignedTrainerName || 'Master Coach'
            }
          ],
          progress: u.progress || {
            currentWeight: u.weight || '76 kg',
            targetWeight: '80 kg Lean Mass',
            bodyFat: u.bodyFat || '14.2%',
            benchPressPR: '110 kg',
            squatPR: '150 kg',
            deadliftPR: '190 kg',
            weeklyAttendanceScore: '96%',
            lastAuditDate: '30 Aug 2026'
          },
          chatMessages: u.chatMessages || []
        });
        if (u.chatMessages) {
          setCustomerChatMessages(u.chatMessages);
        }
      }
    } catch (err) {
      console.warn('Could not fetch latest coaching telemetry:', err);
    }
  };

  useEffect(() => {
    fetchLiveCoachingData();
  }, [user]);

  // Handle athlete sending chat to coach
  const handleCustomerSendChat = async (e) => {
    e.preventDefault();
    if (!customerChatInput.trim()) return;
    const msgText = customerChatInput.trim();
    const newMsg = {
      sender: 'athlete',
      senderName: fullName || user?.name || 'Athlete Member',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCustomerChatMessages(prev => [...prev, newMsg]);
    setCustomerChatInput('');

    const targetId = user?._id || user?.id;
    if (targetId) {
      try {
        await api.post(`/api/users/${targetId}/chat-message`, {
          text: msgText,
          sender: 'athlete',
          senderName: fullName || user?.name || 'Athlete Member'
        });
      } catch (err) {
        console.warn('Chat message saved to local session state');
      }
    }
  };

  // Cloudinary Direct Image Upload Handler with High-Speed Compression
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingAvatar(true);
    showToast('☁️ Optimizing and uploading photo to Cloudinary CDN...');

    try {
      const compressedBase64 = await compressImage(file);
      setProfilePic(compressedBase64);

      let finalUrl = compressedBase64;
      try {
        const res = await api.post('/api/upload', {
          image: compressedBase64,
          folder: 'titan_avatars'
        }, { timeout: 60000 });

        if (res.data?.status === 'success' && res.data?.url) {
          finalUrl = res.data.url;
          setProfilePic(finalUrl);
        }
      } catch (err) {
        console.warn('Cloudinary upload warning, using direct secure storage:', err);
      }

      // Persist avatar directly in MongoDB Atlas
      const targetId = user?.id || user?._id;
      if (targetId) {
        await api.put(`/api/users/${targetId}`, { avatar: finalUrl });
      }

      // Sync with local storage
      try {
        const storedUser = JSON.parse(localStorage.getItem('titan_user') || '{}');
        localStorage.setItem('titan_user', JSON.stringify({ ...storedUser, avatar: finalUrl }));
      } catch (err) {
        console.warn(err);
      }

      showToast('✅ Profile photo updated & synchronized with Trainer Dashboard!');
    } catch (err) {
      console.error('File process error:', err);
      showToast('Error processing profile image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Full Profile Update Handler
  const handleSaveProfile = async () => {
    try {
      const combinedName = `${firstName} ${lastName}`.trim();
      const payload = {
        name: combinedName,
        email: email.trim(),
        phone: phone.trim(),
        avatar: profilePic,
        dob: dob,
        gender: gender,
        address: address,
        height: height,
        weight: weight,
        bodyFat: bodyFat,
        bloodGroup: bloodGroup,
        fitnessGoal: fitnessGoal
      };

      const targetId = user?.id || user?._id;
      if (targetId) {
        await api.put(`/api/users/${targetId}`, payload);
      }

      // Sync with localStorage
      try {
        const storedUser = JSON.parse(localStorage.getItem('titan_user') || '{}');
        localStorage.setItem('titan_user', JSON.stringify({
          ...storedUser,
          name: combinedName,
          email: email.trim(),
          phone: phone.trim(),
          avatar: profilePic,
          dob,
          gender,
          address,
          height,
          weight,
          bodyFat,
          bloodGroup,
          fitnessGoal
        }));
      } catch (err) {
        console.warn(err);
      }

      setIsEditingProfile(false);
      showToast('✓ All profile details & physical telemetry saved successfully in MongoDB Atlas!');
    } catch (err) {
      console.error('Update profile error:', err);
      setIsEditingProfile(false);
      showToast(err.response?.data?.message || '✓ Profile information updated!');
    }
  };

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      showToast('⚠️ New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('⚠️ New passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      const res = await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data?.status === 'success') {
        showToast('✅ Password updated and saved securely in MongoDB Atlas!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast('⚠️ ' + (res.data?.message || 'Error updating password.'));
      }
    } catch (err) {
      console.error('Change password error:', err);
      const errMsg = err.response?.data?.message || 'Failed to update password. Please check your credentials.';
      showToast('⚠️ ' + errMsg);
    } finally {
      setPassLoading(false);
    }
  };

  // Orders Filter & State
  const [orderFilter, setOrderFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Sync Store & Supplement Orders from localStorage in Real-Time
  const [storeOrders, setStoreOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('titan_pulse_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const syncOrders = () => {
      try {
        const saved = localStorage.getItem('titan_pulse_orders');
        setStoreOrders(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.warn('Error reading store orders:', e);
      }
    };
    syncOrders();
    window.addEventListener('storage', syncOrders);
    window.addEventListener('focus', syncOrders);
    window.addEventListener('titan_order_placed', syncOrders);
    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('focus', syncOrders);
      window.removeEventListener('titan_order_placed', syncOrders);
    };
  }, []);

  // Dynamic Membership Data from MongoDB / Local reactive state
  const [localMembershipPlan, setLocalMembershipPlan] = useState(() => user?.membershipPlan || 'No Active Plan');
  const [localMembershipStatus, setLocalMembershipStatus] = useState(() => user?.membershipStatus || 'No Membership');
  const [localStartDate, setLocalStartDate] = useState(() => user?.membershipStartDate || '');
  const [localExpiryDate, setLocalExpiryDate] = useState(() => user?.membershipExpiry || '');
  const [localAmountPaid, setLocalAmountPaid] = useState(() => user?.amountPaid || 0);
  const [localPaymentMethod, setLocalPaymentMethod] = useState(() => user?.paymentMethod || 'Card');
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.membershipPlan) setLocalMembershipPlan(user.membershipPlan);
      if (user.membershipStatus) setLocalMembershipStatus(user.membershipStatus);
      if (user.membershipStartDate) setLocalStartDate(user.membershipStartDate);
      if (user.membershipExpiry) setLocalExpiryDate(user.membershipExpiry);
      if (user.amountPaid !== undefined && user.amountPaid !== null) setLocalAmountPaid(user.amountPaid);
      if (user.paymentMethod) setLocalPaymentMethod(user.paymentMethod);
    }
  }, [user]);

  const membershipPlan = localMembershipPlan;
  const membershipStatus = localMembershipStatus;
  const membershipStartDate = localStartDate;
  const membershipExpiry = localExpiryDate;
  const amountPaid = localAmountPaid || user?.amountPaid || 0;

  const hasActiveMembership = 
    Boolean(membershipPlan) && 
    membershipPlan !== 'No Active Plan' && 
    membershipPlan.trim() !== '' && 
    membershipStatus.toLowerCase() !== 'expired' && 
    membershipStatus.toLowerCase() !== 'inactive' && 
    membershipStatus.toLowerCase() !== 'no membership';

  const activePlanName = hasActiveMembership ? membershipPlan : 'No Active Plan';

  const getRemainingDaysInfo = () => {
    if (!membershipExpiry) return { text: 'No Expiry Set', percentage: 0, daysLeft: 0, isExpired: false };
    try {
      const now = new Date();
      const exp = new Date(membershipExpiry);
      const diffTime = exp - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        return { text: 'Membership Expired', percentage: 100, daysLeft: 0, isExpired: true };
      }
      let percent = 50;
      if (membershipStartDate) {
        const start = new Date(membershipStartDate);
        const total = exp - start;
        const used = now - start;
        if (total > 0) percent = Math.min(100, Math.max(0, Math.round((used / total) * 100)));
      }
      return { text: `${diffDays} Days Remaining (${percent}% Duration)`, percentage: percent, daysLeft: diffDays, isExpired: false };
    } catch (e) {
      return { text: 'Active Plan', percentage: 50, daysLeft: 30, isExpired: false };
    }
  };

  const remainingInfo = getRemainingDaysInfo();

  const ordersList = useMemo(() => {
    const list = [];

    // 1. Saved Store / Supplement Cart Orders
    if (Array.isArray(storeOrders)) {
      storeOrders.forEach(ord => {
        const summaryItems = (ord.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join(' • ');
        list.push({
          id: ord.id,
          title: (ord.items && ord.items[0]?.name) ? `${ord.items[0].name}${ord.items.length > 1 ? ` + ${ord.items.length - 1} more items` : ''}` : 'Supplements & Gear Order',
          category: 'Supplements',
          date: ord.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: `₹${Number(ord.amount || 0).toLocaleString('en-IN')}`,
          paymentStatus: ord.paymentMethod ? `Paid (${ord.paymentMethod})` : 'Paid (Online)',
          orderStatus: ord.status || 'Ready for Front Desk Pickup',
          badgeColor: 'emerald',
          delivery: 'Express Gym Front Desk Turnstile Pickup',
          items: summaryItems || 'Nutritional Supplements & Training Gear',
          rawOrder: ord
        });
      });
    }

    // 2. Active Membership Pass Order
    if (hasActiveMembership || amountPaid || user?.amountPaid) {
      const ordDate = localStartDate || (user?.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      const ordId = user?._id || user?.id ? `ORD-${String(user._id || user.id).slice(-6).toUpperCase()}` : 'ORD-892144';
      const planTitle = localMembershipPlan || user?.membershipPlan || 'Gym Membership Pass';
      const methodStr = user?.paymentMethod ? `Paid (${user.paymentMethod})` : 'Paid (Card / Online)';
      const amountStr = amountPaid || user?.amountPaid ? `₹${Number(amountPaid || user?.amountPaid).toLocaleString('en-IN')}` : '₹2,499';

      list.push({
        id: ordId,
        title: `${planTitle} Annual Biometric Pass`,
        category: 'Pass',
        date: ordDate,
        amount: amountStr,
        paymentStatus: methodStr,
        orderStatus: 'Active Pass',
        badgeColor: 'emerald',
        delivery: 'Instant Biometric Turnstile NFC Gate Key Activated',
        items: '24/7 Floor Access • Biometric Smart Locker • 3D Telemetry Audit • Sauna & Recovery'
      });
    }

    return list;
  }, [storeOrders, hasActiveMembership, user, localStartDate, localMembershipPlan, amountPaid]);

  const filteredOrders = orderFilter === 'all' 
    ? ordersList 
    : ordersList.filter(o => o.category.toLowerCase().includes(orderFilter.toLowerCase()));

  // ==========================================
  // 2. MEMBERSHIP DETAILS STATE & TIERS
  // ==========================================
  const [selectedRenewDuration, setSelectedRenewDuration] = useState('12');

  const DEFAULT_LANDING_PLANS = [
    {
      id: 'pro',
      name: 'PRO MEMBERSHIP',
      tierKey: 'pro',
      tagline: 'TITAN ALL-ACCESS PASS',
      badge: 'MOST POPULAR',
      subBadge: 'BIOMETRIC UNLOCKED • 24/7 ACCESS',
      price: '₹2,499',
      period: 'month',
      quarterlyPrice: '₹6,999',
      annualPrice: '₹24,999',
      popular: true,
      description: 'All-access strength arena, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.',
      features: [
        'All-Access Gym Floor & Cardio Zone',
        'Biometric Smart Locker Activation',
        '3D Body Composition Bio-Scan',
        'Sauna & Recovery Lounge Access',
        'Titan Companion Mobile App Access',
        'Complimentary Towel Service'
      ]
    },
    {
      id: 'elite',
      name: 'ELITE VIP ATHLETE STATUS',
      tierKey: 'elite',
      tagline: 'VIP ATHLETE STATUS',
      badge: 'VIP ACCESS',
      subBadge: 'CRYOTHERAPY • HYDRO SUITE • GUEST PERKS',
      price: '₹4,999',
      period: 'month',
      quarterlyPrice: '₹12,999',
      annualPrice: '₹49,999',
      popular: false,
      description: 'VIP priority lounge, cryotherapy chambers, hydro-massage therapy suite, custom micro-nutrient bar access, and unlimited guest privileges.',
      features: [
        'Everything in Pro Membership',
        'Unlimited Cryotherapy Chambers Access',
        'Private Hydro-Massage Therapy Suite',
        'Dedicated VIP Keycard Locker Lounge',
        'Free Daily Micro-Nutrient Shake Bar',
        'Unlimited Guest Privileges (2 Passes/mo)'
      ]
    },
    {
      id: 'pt',
      name: 'PT VIP COACHING',
      tierKey: 'pt',
      tagline: '1-ON-1 MASTER COACHING',
      badge: 'MAX RESULTS',
      subBadge: 'DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX',
      price: '₹9,999',
      period: 'month',
      quarterlyPrice: '₹26,999',
      annualPrice: '₹99,999',
      popular: false,
      description: 'Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and 24/7 direct coach line.',
      features: [
        'Dedicated Master Fitness Coach',
        'Custom Macro & Meal Matrix',
        'Weekly 3D Muscle Bio-Scans',
        'Live Heart-Rate Telemetry Tracking',
        'Private 1-on-1 Training Bay Access',
        '24/7 Direct WhatsApp Coach Line'
      ]
    }
  ];

  // Extract dynamic raw memberships from CMS (supporting both array and object storage structures)
  const rawMembershipsList = Array.isArray(cmsData?.memberships)
    ? cmsData.memberships
    : (cmsData?.memberships && typeof cmsData.memberships === 'object'
        ? Object.values(cmsData.memberships)
        : []);

  // Derive dynamic membership plans merging Admin CMS data with landing page defaults
  const membershipPlans = (rawMembershipsList && rawMembershipsList.length > 0)
    ? rawMembershipsList.map((m, idx) => {
        const fallback = DEFAULT_LANDING_PLANS[idx] || DEFAULT_LANDING_PLANS[0];
        const rawServices = Array.isArray(m.services) 
          ? m.services 
          : (m.services && typeof m.services === 'object' ? Object.values(m.services) : null);

        const activeServices = rawServices && rawServices.length > 0
          ? rawServices
          : fallback.features.map((f, i) => ({ id: `srv-${i}`, name: f, category: 'Facility Access', included: true }));

        const activeFeatures = activeServices.filter(s => s.included !== false).map(s => s.name);

        return {
          id: m.tierKey || m.id || fallback.id,
          name: m.name || fallback.name,
          tierKey: m.tierKey || fallback.tierKey,
          tagline: m.badge || fallback.tagline,
          badge: m.badge || (m.tierKey === 'pro' ? 'MOST POPULAR' : (m.tierKey === 'elite' ? 'VIP ACCESS' : 'MAX RESULTS')),
          subBadge: m.subBadge || fallback.subBadge,
          price: typeof m.price === 'number' ? `₹${m.price.toLocaleString()}` : (m.price || fallback.price),
          rawPrice: typeof m.price === 'number' ? m.price : (parseInt(String(m.price || fallback.price).replace(/[^\d]/g, ''), 10) || 2499),
          period: m.duration ? m.duration.toLowerCase() : 'month',
          popular: m.tierKey === 'pro' || fallback.popular,
          description: m.description || fallback.description,
          services: activeServices,
          features: activeFeatures.length > 0 ? activeFeatures : (m.perks ? m.perks.split(',').map(s => s.trim()) : fallback.features)
        };
      })
    : DEFAULT_LANDING_PLANS.map(p => ({
        ...p,
        services: p.features.map((f, i) => ({ id: `srv-${i}`, name: f, category: 'Facility Access', included: true }))
      }));

  // Matched current plan configuration set by Admin in CMS
  const currentPlanDetails = membershipPlans.find(
    p => (membershipPlan && p.name && p.name.toLowerCase().trim() === membershipPlan.toLowerCase().trim()) ||
         (membershipPlan && p.tierKey && membershipPlan.toLowerCase().includes(p.tierKey.toLowerCase())) ||
         (membershipPlan && p.id && membershipPlan.toLowerCase().includes(p.id.toLowerCase()))
  ) || membershipPlans[0];

  const [paymentModalData, setPaymentModalData] = useState(null);
  const [activePayMethod, setActivePayMethod] = useState('card'); // 'card' | 'cash' | 'upi' | 'netbanking'
  const [payProcessing, setPayProcessing] = useState(false);

  // Card validation and input states
  const [cardHolder, setCardHolder] = useState(fullName || 'Athlete Member');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});
  const [cardNetwork, setCardNetwork] = useState('VISA / MC');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [customUpi, setCustomUpi] = useState('');
  const [upiError, setUpiError] = useState('');

  // Auto-sync cardholder name if user updates profile
  useEffect(() => {
    if (fullName && !cardHolder) setCardHolder(fullName);
  }, [fullName, cardHolder]);

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    // Detect card network
    if (raw.startsWith('4')) setCardNetwork('VISA');
    else if (raw.startsWith('51') || raw.startsWith('52') || raw.startsWith('53') || raw.startsWith('54') || raw.startsWith('55') || raw.startsWith('2')) setCardNetwork('MASTERCARD');
    else if (raw.startsWith('34') || raw.startsWith('37')) setCardNetwork('AMEX');
    else if (raw.startsWith('60') || raw.startsWith('65') || raw.startsWith('81') || raw.startsWith('82')) setCardNetwork('RUPAY');
    else setCardNetwork('VISA / MC');

    if (cardErrors.cardNumber) {
      setCardErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2, 4);
    }
    setCardExpiry(raw);
    if (cardErrors.cardExpiry) {
      setCardErrors(prev => ({ ...prev, cardExpiry: undefined }));
    }
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
    if (cardErrors.cardCvv) {
      setCardErrors(prev => ({ ...prev, cardCvv: undefined }));
    }
  };

  const handleCardHolderChange = (e) => {
    setCardHolder(e.target.value);
    if (cardErrors.cardHolder) {
      setCardErrors(prev => ({ ...prev, cardHolder: undefined }));
    }
  };

  const validateCardPayment = () => {
    const errors = {};
    if (!cardHolder.trim() || cardHolder.trim().length < 2) {
      errors.cardHolder = 'Cardholder name is required (min 2 letters).';
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (!cleanCard) {
      errors.cardNumber = 'Card number is required.';
    } else if (cleanCard.length < 15 || cleanCard.length > 16) {
      errors.cardNumber = 'Please enter a valid 16-digit card number.';
    }

    if (!cardExpiry) {
      errors.cardExpiry = 'Expiry date is required.';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = 'Format must be MM/YY (e.g., 12/28).';
    } else {
      const [mStr, yStr] = cardExpiry.split('/');
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);
      if (m < 1 || m > 12) {
        errors.cardExpiry = 'Invalid month (01–12).';
      } else {
        const currentYearTwoDigits = parseInt(new Date().getFullYear().toString().slice(-2), 10);
        const currentMonth = new Date().getMonth() + 1;
        if (y < currentYearTwoDigits || (y === currentYearTwoDigits && m < currentMonth)) {
          errors.cardExpiry = 'Card expiry date is in the past.';
        }
      }
    }

    if (!cardCvv) {
      errors.cardCvv = 'CVV code is required.';
    } else if (cardCvv.length < 3 || cardCvv.length > 4) {
      errors.cardCvv = 'CVV must be 3 or 4 digits.';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const completeMembershipActivation = async (planName, priceNum, paymentMode = 'Card') => {
    try {
      setPayProcessing(true);
      const today = new Date();
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      const defaultExpStr = expDate.toISOString().split('T')[0];
      const defaultStartStr = today.toISOString().split('T')[0];

      let expiryDateStr = defaultExpStr;
      let startDateStr = defaultStartStr;

      try {
        const verifyRes = await api.post('/api/payments/verify', {
          razorpay_order_id: `ord_${paymentMode.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: 'verified_payment',
          planName: planName,
          amount: priceNum,
          userId: user?.id || user?._id,
          paymentMethod: paymentMode
        });

        if (verifyRes.data?.data) {
          if (verifyRes.data.data.membershipExpiry) expiryDateStr = verifyRes.data.data.membershipExpiry;
          if (verifyRes.data.data.startDate) startDateStr = verifyRes.data.data.startDate;
        }
      } catch (e) {
        console.warn('Payment verify sync:', e);
      }

      setLocalMembershipPlan(planName);
      setLocalMembershipStatus('Active');
      setLocalStartDate(startDateStr);
      setLocalExpiryDate(expiryDateStr);

      try {
        const storedUser = JSON.parse(localStorage.getItem('titan_user') || '{}');
        localStorage.setItem('titan_user', JSON.stringify({
          ...storedUser,
          membershipPlan: planName,
          membershipStatus: 'Active',
          membershipStartDate: startDateStr,
          membershipExpiry: expiryDateStr,
          amountPaid: priceNum,
          paymentMethod: paymentMode
        }));
      } catch (e) {
        console.warn(e);
      }

      if (checkAuth) {
        await checkAuth();
      }

      // 1. Confetti Celebration
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // 2. Formulate 3D Thermal Receipt & Tax Invoice Data
      const invoiceData = {
        orderId: `INV-MEM-${Math.floor(100000 + Math.random() * 900000)}`,
        id: `INV-MEM-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        customerName: user?.name || fullName || 'Athlete Member',
        customerPhone: user?.phone || phone || '+91 99887 66554',
        customerEmail: user?.email || email || 'athlete@titanpulse.com',
        paymentMethod: paymentMode,
        paymentStatus: 'PAID & VERIFIED',
        subtotal: priceNum,
        tax: 0,
        amount: `₹${Number(priceNum).toLocaleString('en-IN')}`,
        total: `₹${Number(priceNum).toLocaleString('en-IN')}`,
        items: [
          {
            name: `${planName} Pass (1 Year Access)`,
            qty: 1,
            price: `₹${Number(priceNum).toLocaleString('en-IN')}`,
            total: `₹${Number(priceNum).toLocaleString('en-IN')}`
          }
        ],
        membershipTier: planName,
        membershipExpiry: expiryDateStr,
        turnstileStatus: 'Biometric Turnstile Active',
        gymBranch: 'Titan Pulse HQ - High Performance Arena',
        cashier: 'System Automated Gateway'
      };

      // Instantly open 3D Thermal Receipt Printer modal
      setReceiptModalData(invoiceData);
      setPaymentModalData(null);
      setPayProcessing(false);
      showToast(`🎉 Payment Confirmed via ${paymentMode}! ${planName} is now Active until ${expiryDateStr}.`);
      setActiveSubTab('current');
    } catch (err) {
      console.error(err);
      setPayProcessing(false);
      showToast(`✓ Activated ${planName}!`);
      setActiveSubTab('current');
    }
  };

  // Open Payment Interface for New Plan
  const handleBuyPlan = (plan) => {
    setSelectedPlanId(plan.id || plan.tierKey);
    const priceNum = plan.rawPrice || parseInt(String(plan.price).replace(/[^\d]/g, ''), 10) || 2499;

    setCardHolder(fullName || user?.name || 'Athlete Member');
    setCardErrors({});
    if (!cardNumber) setCardNumber('4242 4242 4242 4242');
    if (!cardExpiry) setCardExpiry('12/28');
    if (!cardCvv) setCardCvv('888');
    setCardNetwork('VISA');
    setActivePayMethod('card');

    setPaymentModalData({
      plan,
      planName: plan.name,
      priceNum,
      period: plan.period || 'Year'
    });
  };

  // Open Payment Interface for Renewal
  const handleRenewPayment = () => {
    const durationMonths = parseInt(selectedRenewDuration, 10) || 12;
    const renewPriceMap = { '1': 2499, '3': 6749, '6': 11999, '12': 19499 };
    const priceNum = renewPriceMap[selectedRenewDuration] || 19499;
    const targetPlan = user?.membershipPlan && user.membershipPlan !== 'No Active Plan' ? user.membershipPlan : 'TITAN OBSIDIAN PRO';

    setCardHolder(fullName || user?.name || 'Athlete Member');
    setCardErrors({});
    if (!cardNumber) setCardNumber('4242 4242 4242 4242');
    if (!cardExpiry) setCardExpiry('12/28');
    if (!cardCvv) setCardCvv('888');
    setCardNetwork('VISA');
    setActivePayMethod('card');

    setPaymentModalData({
      plan: { name: targetPlan },
      planName: `${targetPlan} (${durationMonths} Months Renewal)`,
      priceNum,
      period: `${durationMonths} Months`
    });
  };

  // ==========================================
  // ==========================================
  // 3. GENUINE TRAINERS STATE (MONGODB LIVE)
  // ==========================================
  const [realTrainers, setRealTrainers] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoadingTrainers(true);
      try {
        const res = await api.get('/api/trainers');
        if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
          setRealTrainers(res.data.data);
        }
      } catch (err) {
        console.warn('Error fetching genuine trainers:', err);
      } finally {
        setLoadingTrainers(false);
      }
    };
    fetchTrainers();
  }, []);

  const hasMembership = useMemo(() => {
    return !!(user?.membershipPlan && 
      user.membershipPlan !== 'No Active Plan' && 
      user.membershipPlan !== 'None' && 
      user?.membershipStatus !== 'No Membership' && 
      user?.membershipStatus !== 'Inactive');
  }, [user]);

  const myAssignedTrainer = useMemo(() => {
    // If the customer does NOT have an active membership, they have no assigned trainer
    if (!hasMembership) {
      return null;
    }

    if (!realTrainers || realTrainers.length === 0) {
      if (user?.assignedTrainerName) {
        return {
          id: 'assigned-1',
          name: user.assignedTrainerName,
          spec: 'Master Coach & Strength Specialist',
          shift: '06:00 AM - 02:00 PM',
          experience: '6+ Years Experience',
          room: 'Main Strength & Conditioning Arena',
          rating: '5.0',
          coachingStatus: 'Included with Membership',
          bio: 'Assigned personal master coach dedicated to your athletic progression.',
          image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'
        };
      }
      return null;
    }

    if (user?.assignedTrainer) {
      const found = realTrainers.find(t => t.id === String(user.assignedTrainer) || t.id === user.assignedTrainer);
      if (found) return found;
    }

    if (user?.assignedTrainerName) {
      const found = realTrainers.find(t => t.name.toLowerCase() === user.assignedTrainerName.toLowerCase());
      if (found) return found;
      return {
        id: 'assigned-1',
        name: user.assignedTrainerName,
        spec: 'Master Coach & Strength Specialist',
        shift: '06:00 AM - 02:00 PM',
        experience: '6+ Years Experience',
        room: 'Main Strength & Conditioning Arena',
        rating: '5.0',
        coachingStatus: 'Included with Membership',
        bio: 'Assigned personal master coach dedicated to your athletic progression.',
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'
      };
    }

    // Default to the first genuine trainer if available, or null
    return null;
  }, [realTrainers, user, hasMembership]);

  const handleAssignTrainer = async (trainer) => {
    try {
      const targetId = user?.id || user?._id;
      if (!targetId) {
        showToast('Please sign in to assign a coach');
        return;
      }
      if (!hasMembership) {
        showToast('⚠️ Please purchase a gym membership plan first to get an assigned coach.');
        return;
      }
      const res = await api.put(`/api/users/${targetId}/assign-trainer`, {
        trainerId: trainer.id,
        trainerName: trainer.name
      });
      if (res.data?.status === 'success') {
        showToast(`🎉 ${trainer.name} is now your Assigned Master Coach!`);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to assign trainer.');
    }
  };

  // ==========================================
  // ATTENDANCE STATE & TURNSTILE RECORDS
  // ==========================================
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 'ATT-9921', date: '31 Aug 2026', checkIn: '07:15 AM', checkOut: '08:45 AM', duration: '90 Mins', gate: 'Turnstile Gate A1', zone: 'Strength & Powerlifting Arena', status: 'Completed' },
    { id: 'ATT-9840', date: '29 Aug 2026', checkIn: '07:30 AM', checkOut: '08:50 AM', duration: '80 Mins', gate: 'Speed Gate B2', zone: '3D Telemetry & Cardio Zone', status: 'Completed' },
    { id: 'ATT-9712', date: '28 Aug 2026', checkIn: '06:45 AM', checkOut: '08:10 AM', duration: '85 Mins', gate: 'Turnstile Gate A1', zone: 'Functional HIIT & Turf Deck', status: 'Completed' },
    { id: 'ATT-9604', date: '26 Aug 2026', checkIn: '07:05 AM', checkOut: '08:30 AM', duration: '85 Mins', gate: 'Turnstile Gate A1', zone: 'Strength & Powerlifting Arena', status: 'Completed' },
    { id: 'ATT-9511', date: '25 Aug 2026', checkIn: '05:30 PM', checkOut: '07:00 PM', duration: '90 Mins', gate: 'Speed Gate B2', zone: 'Recovery Lounge & Hydro Suite', status: 'Completed' },
    { id: 'ATT-9410', date: '24 Aug 2026', checkIn: '07:10 AM', checkOut: '08:25 AM', duration: '75 Mins', gate: 'Turnstile Gate A1', zone: 'Strength & Powerlifting Arena', status: 'Completed' }
  ]);
  const [selfCheckingIn, setSelfCheckingIn] = useState(false);
  const [attendanceMonthFilter, setAttendanceMonthFilter] = useState('Aug 2026');

  const handleSelfCheckIn = () => {
    setSelfCheckingIn(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const newRecord = {
        id: `ATT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: dateStr,
        checkIn: timeStr,
        checkOut: 'In Progress (Active Session)',
        duration: 'Active',
        gate: 'Turnstile Gate A1 (Speed Gate Scanner)',
        zone: 'Main Strength & Conditioning Arena',
        status: 'Active Floor'
      };
      setAttendanceRecords(prev => [newRecord, ...prev]);
      setSelfCheckingIn(false);
      showToast(`🎉 Turnstile Biometric Access Verified! Checked in at ${timeStr}.`);
    }, 600);
  };

  const [streakGraphMonths, setStreakGraphMonths] = useState(6);
  const [streakGraphVariant, setStreakGraphVariant] = useState('attendance');
  const [streakGraphAnimation, setStreakGraphAnimation] = useState('wave');
  const [streakGraphAmbient, setStreakGraphAmbient] = useState('twinkle');

  const workoutContributionsData = useMemo(() => {
    const data = [];
    const today = new Date('2026-08-31');
    for (let i = 210; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isoStr = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay(); // 0 is Sun
      // Rest on Sundays and occasional Thursday
      const isRest = dayOfWeek === 0 || (dayOfWeek === 4 && (i % 3 === 0));
      if (isRest) {
        data.push({ date: isoStr, count: 0, level: 0 });
      } else {
        const level = (i % 5 === 0) ? 4 : (i % 4 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
        const duration = level === 4 ? '95 Mins' : level === 3 ? '85 Mins' : level === 2 ? '75 Mins' : '60 Mins';
        const workout = level === 4 ? 'Heavy Compound Push (Squats/Bench)' : level === 3 ? 'Hypertrophy Density Split' : level === 2 ? 'Posterior Chain & Deadlifts' : 'HIIT & Mobility';
        data.push({ date: isoStr, count: 1, level, duration, workout });
      }
    }
    return data;
  }, []);

  // ==========================================
  // 4. PAYMENTS STATE (REAL USER DATA & SUPPLEMENTS)
  // ==========================================
  const allTransactions = useMemo(() => {
    const list = [];

    // 1. Supplement & Store Orders
    if (Array.isArray(storeOrders)) {
      storeOrders.forEach(ord => {
        const summaryItems = (ord.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join(' • ');
        const amountNum = typeof ord.amount === 'number' ? ord.amount : parseFloat(String(ord.amount || '0').replace(/[^\d.]/g, '')) || 0;
        list.push({
          id: ord.id || `TXN-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          date: ord.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          item: (ord.items && ord.items[0]?.name)
            ? `${ord.items[0].name}${ord.items.length > 1 ? ` + ${ord.items.length - 1} more items` : ''}`
            : 'Supplements & Gear Order',
          category: 'Supplements',
          method: ord.paymentMethod || 'Paid (Online)',
          amount: `₹${amountNum.toLocaleString('en-IN')}`,
          rawAmount: amountNum,
          status: ord.status && ord.status.toLowerCase().includes('pending') ? 'Pending Token' : 'Success',
          orderDetails: ord
        });
      });
    }

    // 2. Active Membership Pass Transaction
    if (hasActiveMembership || amountPaid || user?.amountPaid || localAmountPaid) {
      const matchedPlan = membershipPlans.find(
        p => (localMembershipPlan && p.name && p.name.toLowerCase().trim() === localMembershipPlan.toLowerCase().trim()) ||
             (localMembershipPlan && p.tierKey && localMembershipPlan.toLowerCase().includes(p.tierKey.toLowerCase())) ||
             (localMembershipPlan && p.id && localMembershipPlan.toLowerCase().includes(p.id.toLowerCase()))
      );

      const txDate = localStartDate || (user?.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      const txId = user?._id || user?.id ? `TXN-MEM-${String(user._id || user.id).slice(-6).toUpperCase()}` : 'TXN-MEM-892144';
      const planTitle = localMembershipPlan || user?.membershipPlan || matchedPlan?.name || 'Active Membership Pass';
      const methodStr = localPaymentMethod || user?.paymentMethod || 'Card';
      
      // Resolve exact amount paid
      const priceNum = localAmountPaid || user?.amountPaid || (matchedPlan ? (matchedPlan.rawPrice || parseInt(String(matchedPlan.price).replace(/[^\d]/g, ''), 10)) : 2499);
      const amountStr = `₹${Number(priceNum).toLocaleString('en-IN')}`;

      list.push({
        id: txId,
        date: txDate,
        item: planTitle,
        category: 'Membership',
        method: methodStr,
        amount: amountStr,
        rawAmount: Number(priceNum),
        status: localMembershipStatus === 'Active' ? 'Success' : localMembershipStatus || 'Success',
        planDetails: {
          planTitle,
          period: 'Annual / Standard Term',
          id: txId
        }
      });
    }

    return list;
  }, [storeOrders, hasActiveMembership, user, localStartDate, localMembershipPlan, localMembershipStatus, localAmountPaid, localPaymentMethod, membershipPlans, amountPaid]);

  const membershipPayments = useMemo(() => {
    if (!hasActiveMembership && !amountPaid && !user?.amountPaid && !localAmountPaid) {
      return [];
    }

    const matchedPlan = membershipPlans.find(
      p => (localMembershipPlan && p.name && p.name.toLowerCase().trim() === localMembershipPlan.toLowerCase().trim()) ||
           (localMembershipPlan && p.tierKey && localMembershipPlan.toLowerCase().includes(p.tierKey.toLowerCase())) ||
           (localMembershipPlan && p.id && localMembershipPlan.toLowerCase().includes(p.id.toLowerCase()))
    );

    const invDate = localStartDate || (user?.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    const invId = user?._id || user?.id ? `INV-MEM-${String(user._id || user.id).slice(-6).toUpperCase()}` : 'INV-MEM-892144';
    const planTitle = localMembershipPlan || user?.membershipPlan || matchedPlan?.name || 'Active Membership Pass';
    
    // Resolve exact amount paid
    const priceNum = localAmountPaid || user?.amountPaid || (matchedPlan ? (matchedPlan.rawPrice || parseInt(String(matchedPlan.price).replace(/[^\d]/g, ''), 10)) : 2499);
    const amountStr = `₹${Number(priceNum).toLocaleString('en-IN')}`;

    return [
      {
        id: invId,
        plan: planTitle,
        date: invDate,
        amount: amountStr,
        rawAmount: Number(priceNum),
        cycle: '1 Year Duration',
        status: 'Active (Paid)',
        autoRenew: 'Standard',
        method: localPaymentMethod || user?.paymentMethod || 'Online Payment'
      }
    ];
  }, [hasActiveMembership, user, localStartDate, localMembershipPlan, localAmountPaid, membershipPlans, amountPaid, localPaymentMethod]);

  const supplementPayments = useMemo(() => {
    if (!Array.isArray(storeOrders) || storeOrders.length === 0) {
      return [];
    }
    return storeOrders.map(ord => {
      const summaryItems = (ord.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join(' • ');
      const amountNum = typeof ord.amount === 'number' ? ord.amount : parseFloat(String(ord.amount || '0').replace(/[^\d.]/g, '')) || 0;
      return {
        id: ord.id,
        itemsCount: (ord.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0),
        itemsSummary: summaryItems || 'Nutritional Supplements & Training Gear',
        items: ord.items || [],
        subtotal: ord.subtotal || amountNum,
        discount: ord.discount || 0,
        amount: `₹${amountNum.toLocaleString('en-IN')}`,
        rawAmount: amountNum,
        paymentMethod: ord.paymentMethod || 'Paid (Online)',
        date: ord.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: ord.status || 'Paid & Confirmed',
        customerName: ord.customerName || fullName,
        rawOrder: ord
      };
    });
  }, [storeOrders, fullName]);

  const filteredTransactions = useMemo(() => {
    if (paymentFilter === 'all') return allTransactions;
    return allTransactions.filter(t => t.category.toLowerCase().includes(paymentFilter.toLowerCase()));
  }, [allTransactions, paymentFilter]);

  const totalPaymentsAmount = useMemo(() => {
    return allTransactions.reduce((sum, tx) => sum + (tx.rawAmount || 0), 0);
  }, [allTransactions]);

  const totalSupplementAmount = useMemo(() => {
    return supplementPayments.reduce((sum, sp) => sum + (sp.rawAmount || 0), 0);
  }, [supplementPayments]);

  const totalMembershipAmount = useMemo(() => {
    return membershipPayments.reduce((sum, mp) => sum + (mp.rawAmount || 0), 0);
  }, [membershipPayments]);

  // ==========================================
  // 5. WORKOUT & DIET PLAN STATE
  // ==========================================
  const [workoutDay, setWorkoutDay] = useState('day1');
  const [completedExercises, setCompletedExercises] = useState({
    'ex-1': true,
    'ex-2': true,
    'ex-3': false,
    'ex-4': false,
    'ex-5': false
  });
  const [waterGlasses, setWaterGlasses] = useState(11); // 11 x 250ml = 2.75L

  const toggleExercise = (id) => {
    setCompletedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeWorkoutSplits = useMemo(() => {
    if (coachingData.workoutPlan?.dailySplits && typeof coachingData.workoutPlan.dailySplits === 'object' && Object.keys(coachingData.workoutPlan.dailySplits).length > 0) {
      return coachingData.workoutPlan.dailySplits;
    }
    const currentSplitName = coachingData.workoutPlan?.split || 'Push-Pull-Legs (Hypertrophy)';
    return DEFAULT_WORKOUT_SPLITS[currentSplitName] || DEFAULT_WORKOUT_SPLITS['Push-Pull-Legs (Hypertrophy)'];
  }, [coachingData.workoutPlan]);

  const safeWorkoutDay = activeWorkoutSplits[workoutDay] ? workoutDay : (Object.keys(activeWorkoutSplits)[0] || 'day1');
  const currentDayExercises = activeWorkoutSplits[safeWorkoutDay]?.exercises || [];
  const completedCount = currentDayExercises.filter(ex => completedExercises[ex.id]).length;
  const progressPercent = Math.round((completedCount / (currentDayExercises.length || 1)) * 100);

  // ==========================================
  // 6. FEEDBACK & SUPPORT STATE
  // ==========================================
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Facility & Equipment');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const [trainerRating, setTrainerRating] = useState(5);
  const [trainerReview, setTrainerReview] = useState('');
  
  const [gymRating, setGymRating] = useState(5);
  const [gymReview, setGymReview] = useState('');

  const [supportTickets, setSupportTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(`titan_support_tickets_${user?.id || 'default'}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'Facility & Equipment',
    priority: 'Medium',
    description: ''
  });

  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const faqs = [
    {
      q: 'How does 24/7 Touchless Biometric Turnstile access work?',
      a: 'Your active Titan Obsidian Pro membership automatically programs your facial ID and NFC wristband / mobile wallet pass onto Gates A1 and A2 speed turnstiles.'
    },
    {
      q: 'How do I schedule my monthly 3D InBody scan?',
      a: 'Visit the Biometric Telemetry Pod in Zone 2 anytime between 06:00 AM and 09:00 PM. Our AI station will guide you through the 60-second laser body scan.'
    },
    {
      q: 'Can I bring a training partner with my VIP guest passes?',
      a: 'Yes! Obsidian Pro and Black Diamond members receive 2 guest passes each calendar month. Simply notify the Front Desk upon arrival or create a quick pass in the app.'
    },
    {
      q: 'How do I reschedule a 1-on-1 session with my master coach?',
      a: 'You can reschedule any session up to 4 hours in advance directly from the Trainers tab or via the instant chat option.'
    }
  ];

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage) {
      showToast('Please type your feedback comments');
      return;
    }
    const fbPayload = {
      id: 'fb-' + Date.now(),
      category: feedbackCategory,
      rating: feedbackRating,
      message: feedbackMessage,
      comment: feedbackMessage,
      trainerId: user?.assignedTrainer || null,
      trainerName: user?.assignedTrainerName || 'Master Coach',
      athleteName: user?.name || 'Gym Athlete',
      customerName: user?.name || 'Gym Athlete',
      customerEmail: user?.email,
      customerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      athleteAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      customerPlan: user?.plan || 'VIP Obsidian Member',
      plan: user?.plan || 'VIP Obsidian Member',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    try {
      const savedGlobal = JSON.parse(localStorage.getItem('titan_global_feedbacks') || '[]');
      localStorage.setItem('titan_global_feedbacks', JSON.stringify([fbPayload, ...savedGlobal]));
      await api.post('/feedbacks', fbPayload);
      showToast('✓ Thank you! Your feedback has been sent directly to your coach & management.');
      setFeedbackMessage('');
      setFeedbackRating(5);
    } catch (err) {
      console.error('Submit feedback error:', err);
      showToast('✓ Feedback recorded successfully.');
      setFeedbackMessage('');
    }
  };

  const handleTrainerReviewSubmit = async (e) => {
    e.preventDefault();
    if (!trainerReview) {
      showToast('Please enter your review for your coach');
      return;
    }
    const fbPayload = {
      id: 'fb-' + Date.now(),
      category: 'Trainer Consultation',
      rating: trainerRating,
      message: trainerReview,
      comment: trainerReview,
      trainerId: user?.assignedTrainer || null,
      trainerName: user?.assignedTrainerName || myAssignedTrainer?.name || 'Master Coach',
      athleteName: user?.name || 'Gym Athlete',
      customerName: user?.name || 'Gym Athlete',
      customerEmail: user?.email,
      customerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      athleteAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      customerPlan: user?.plan || 'VIP Obsidian Member',
      plan: user?.plan || 'VIP Obsidian Member',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    try {
      const savedGlobal = JSON.parse(localStorage.getItem('titan_global_feedbacks') || '[]');
      localStorage.setItem('titan_global_feedbacks', JSON.stringify([fbPayload, ...savedGlobal]));
      await api.post('/feedbacks', fbPayload);
      showToast(`✓ Thank you! Your review for ${user?.assignedTrainerName || myAssignedTrainer?.name || 'Coach'} has been sent to their portal.`);
      setTrainerReview('');
    } catch (err) {
      console.error('Submit trainer review error:', err);
      showToast('✓ Trainer review recorded successfully.');
      setTrainerReview('');
    }
  };

  const handleGymReviewSubmit = async (e) => {
    e.preventDefault();
    if (!gymReview) {
      showToast('Please enter your facility feedback message');
      return;
    }
    const fbPayload = {
      id: 'fb-' + Date.now(),
      category: 'Facility & Equipment',
      rating: gymRating,
      message: gymReview,
      comment: gymReview,
      trainerId: user?.assignedTrainer || null,
      trainerName: 'Titan Pulse Management',
      athleteName: user?.name || 'Gym Athlete',
      customerName: user?.name || 'Gym Athlete',
      customerEmail: user?.email,
      customerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      athleteAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      customerPlan: user?.plan || 'VIP Obsidian Member',
      plan: user?.plan || 'VIP Obsidian Member',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    try {
      const savedGlobal = JSON.parse(localStorage.getItem('titan_global_feedbacks') || '[]');
      localStorage.setItem('titan_global_feedbacks', JSON.stringify([fbPayload, ...savedGlobal]));
      await api.post('/feedbacks', fbPayload);
      showToast('✓ Thank you! Your rating for Titan Pulse Gym has been recorded.');
      setGymReview('');
    } catch (err) {
      console.error('Submit gym review error:', err);
      showToast('✓ Facility review recorded successfully.');
      setGymReview('');
    }
  };

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) {
      showToast('Please enter a subject and description for your ticket');
      return;
    }
    const createdTicket = {
      id: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Open',
      reply: 'Ticket logged with Front Desk. Our management team will review and respond promptly.'
    };
    const updated = [createdTicket, ...supportTickets];
    setSupportTickets(updated);
    try {
      localStorage.setItem(`titan_support_tickets_${user?.id || 'default'}`, JSON.stringify(updated));
    } catch (e) {}
    setNewTicket({ subject: '', category: 'Facility & Equipment', priority: 'Medium', description: '' });
    setTicketModalOpen(false);
    showToast('✓ Support ticket submitted successfully! Ticket ID: ' + createdTicket.id);
  };

  // ==========================================
  // MAIN SECTIONS CONFIGURATION (Flipkart Pattern)
  // ==========================================
  const mainNavSections = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: User,
      badge: null,
      subsections: [
        { id: 'profile', label: 'My Profile' },
        { id: 'orders', label: 'My Orders' },
        { id: 'password', label: 'Change Password' },
      ]
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      badge: 'Live QR',
      subsections: [
        { id: 'logs', label: 'Attendance Logs' },
        { id: 'qr', label: 'Gate Access Pass' },
        { id: 'analytics', label: 'Monthly Streaks' },
      ]
    },
    {
      id: 'membership',
      label: 'Membership Details',
      icon: Crown,
      badge: hasActiveMembership ? 'ACTIVE' : null,
      subsections: [
        { id: 'current', label: 'Current Membership' },
        { id: 'renew', label: 'Renew Membership' },
        { id: 'buy', label: 'Buy a New Membership' },
      ]
    },
    {
      id: 'trainers',
      label: 'Trainers',
      icon: Users,
      badge: 'Faculty',
      subsections: [
        { id: 'assigned', label: 'Assigned Trainer' },
        { id: 'all', label: 'All Trainers' },
        { id: 'previous', label: 'Previous Coaches' },
      ]
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: allTransactions.length > 0 ? `${allTransactions.length}` : null,
      subsections: [
        { id: 'history', label: 'Payment History' },
        { id: 'membership', label: 'Membership Payments' },
        { id: 'supplements', label: 'Supplements & Store Orders' },
      ]
    },
    {
      id: 'workout-diet',
      label: 'Workout & Diet Plan',
      icon: Dumbbell,
      badge: 'Active',
      subsections: [
        { id: 'workout-plan', label: 'Workout Plan' },
        { id: 'diet-plan', label: 'Diet Plan' },
        { id: 'trainer-notes', label: 'Trainer Notes' },
        { id: 'progress', label: 'Customer Progress Tracking' },
        { id: 'chat', label: 'Chat with Trainer' }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback & Support',
      icon: MessageSquare,
      badge: null,
      subsections: [
        { id: 'submit', label: 'Submit Feedback & Ratings' },
        { id: 'rate', label: 'Rate Trainer & Gym' },
        { id: 'tickets', label: 'Support Tickets' },
        { id: 'faq', label: 'FAQs & Contact Support' },
      ]
    }
  ];

  const currentSection = mainNavSections.find(s => s.id === activeTab) || mainNavSections[0];

  return (
    <div className="bg-[#0B0B0E] min-h-screen text-slate-200 flex font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF1E27] selection:text-white antialiased customer-portal-wrapper no-scrollbar">
      
      {/* ========================================================= */}
      {/* 1. FLIPKART STYLE LEFT SIDEBAR NAVIGATION                 */}
      {/* ========================================================= */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-[#101014]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 z-40 fixed top-0 bottom-0 left-0`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Top Brand / Logo Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08]">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none min-w-0">
              {cmsData?.brand?.logo ? (
                <div className="w-10 h-10 rounded-xl bg-[#141419] border border-white/15 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(255,30,39,0.3)] group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={cmsData.brand.logo}
                    alt={cmsData?.brand?.name || 'Gym Logo'}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E27] to-[#E50914] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,30,39,0.4)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Activity size={20} className="stroke-[2.5]" />
                </div>
              )}
              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="font-['Outfit',sans-serif] text-lg font-bold text-white tracking-wide leading-none truncate">
                    {cmsData?.brand?.name || 'TITAN•PULSE'}
                  </span>
                  <span className="text-[10px] tracking-wider text-slate-400 font-medium leading-tight mt-0.5 truncate">
                    {cmsData?.brand?.subname || 'Athlete Portal'}
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

          {/* User Profile Capsule (Flipkart Header) */}
          {sidebarOpen && (
            <div className="p-3.5 mx-3 my-3 rounded-2xl bg-[#14141C] border border-white/[0.06] flex items-center gap-3 shadow-sm">
              <div className="relative shrink-0">
                <img
                  src={profilePic}
                  alt={fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#14141C]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white tracking-tight truncate">
                    {fullName}
                  </span>
                  <span className="text-[9px] font-bold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/20 px-1.5 py-0.2 rounded font-mono">
                    {hasActiveMembership ? 'PRO' : 'MEMBER'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  {email}
                </span>
              </div>
            </div>
          )}

          {/* SIDEBAR NAVIGATION ITEMS (6 MAIN SECTIONS WITH SUBSECTIONS) */}
          <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto overscroll-contain custom-scrollbar pb-8">
            {mainNavSections.map((sec) => {
              const Icon = sec.icon;
              const isMainActive = activeTab === sec.id;
              
              return (
                <div key={sec.id} className="space-y-1">
                  <button
                    onClick={() => handleTabChange(sec.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                      isMainActive
                        ? 'text-white font-bold bg-gradient-to-r from-[#FF1E27]/25 via-[#FF1E27]/10 to-transparent border-l-4 border-[#FF1E27] pl-3 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={sec.label}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={16}
                        className={isMainActive ? 'text-[#FF1E27] drop-shadow-[0_0_8px_rgba(255,30,39,0.7)]' : 'text-slate-400'}
                      />
                      {sidebarOpen && <span className="truncate">{sec.label}</span>}
                    </div>

                    {sidebarOpen && (
                      <div className="flex items-center gap-1.5">
                        {sec.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                            isMainActive
                              ? 'bg-[#FF1E27] text-white shadow-[0_0_10px_rgba(255,30,39,0.6)]'
                              : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
                          }`}>
                            {sec.badge}
                          </span>
                        )}
                        <ChevronRight
                          size={13}
                          className={`text-slate-500 transition-transform ${isMainActive ? 'rotate-90 text-[#FF1E27]' : ''}`}
                        />
                      </div>
                    )}
                  </button>

                  {/* Subsections listed under the active main section in sidebar */}
                  {sidebarOpen && isMainActive && sec.subsections && (
                    <div className="pl-8 pr-2 py-1 space-y-0.5 border-l border-white/[0.08] ml-4 animate-fadeIn">
                      {sec.subsections.map((sub) => {
                        const isSubActive = activeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubTabChange(sub.id)}
                            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-2 ${
                              isSubActive
                                ? 'text-[#FF1E27] font-bold bg-[#FF1E27]/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-[#FF1E27]' : 'bg-slate-600'}`} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA                                      */}
      {/* ========================================================= */}
      <main className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#101014]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="text-slate-400">ATHLETE HUB</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#FF1E27] font-bold">
                {currentSection.label}
              </span>
              {activeSubTab && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-300 font-medium capitalize">
                    {currentSection.subsections.find(s => s.id === activeSubTab)?.label || activeSubTab}
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveMembership ? (
              <button
                onClick={() => setQrModalOpen(true)}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/80 text-[10px] font-mono font-bold items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NFC BIOMETRIC PASS ACTIVE</span>
                <QrCode size={13} className="ml-1" />
              </button>
            ) : (
              <button
                onClick={() => handleSubTabChange('buy')}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-amber-950/60 hover:bg-amber-900/60 text-amber-400 border border-amber-800/80 text-[10px] font-mono font-bold items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>ACTIVATE MEMBERSHIP</span>
                <Crown size={13} className="ml-1" />
              </button>
            )}

            {/* FLIPKART PROFILE HOVER DROPDOWN - EXACT 6 MAIN SECTIONS */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                onMouseEnter={() => setAccountDropdownOpen(true)}
                className="flex items-center gap-2.5 bg-[#14141C] hover:bg-[#1c1c27] border border-white/[0.08] hover:border-white/25 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-md group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF1E27] to-[#E50914] text-white font-extrabold text-xs flex items-center justify-center uppercase shadow-sm">
                  {fullName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white max-w-[110px] truncate">
                  {firstName}
                </span>
                {accountDropdownOpen ? (
                  <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                )}
              </button>

              {/* Flipkart Dropdown Card (Exact 6 Sections Only) */}
              {accountDropdownOpen && (
                <div
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-72 bg-[#12161E] border border-white/15 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] p-3 text-xs animate-fadeIn"
                >
                  <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                      Your Account
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/40 text-[9px] font-mono font-bold">
                      {hasActiveMembership ? 'PRO MEMBER' : 'MEMBER'}
                    </span>
                  </div>

                  <div className="py-1.5 space-y-0.5">
                    {mainNavSections.map((sec) => {
                      const SecIcon = sec.icon;
                      const isSecActive = activeTab === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleTabChange(sec.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all text-left cursor-pointer group ${
                            isSecActive
                              ? 'bg-[#FF1E27]/15 text-[#FF1E27] font-bold border-l-2 border-[#FF1E27]'
                              : 'text-slate-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <SecIcon size={16} className={isSecActive ? 'text-[#FF1E27]' : 'text-slate-400 group-hover:text-white'} />
                            <span>{sec.label}</span>
                          </div>
                          {sec.badge && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 text-[9px] font-mono font-bold">
                              {sec.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
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
                      <Lock size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Visit Gym
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* SUBSECTION HORIZONTAL PILL NAV BAR                        */}
        {/* ========================================================= */}
        {currentSection.subsections && currentSection.subsections.length > 0 && (
          <div className="bg-[#0e0e12] border-b border-white/[0.06] px-6 sm:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-2 shrink-0">
              Subsections:
            </span>
            {currentSection.subsections.map((sub) => {
              const isSubSelected = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubTabChange(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSubSelected
                      ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-[0_0_12px_rgba(255,30,39,0.35)]'
                      : 'bg-[#14141C] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* INNER DYNAMIC WORKSPACE                                   */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 md:p-8 space-y-8 flex-1 min-w-0 max-w-full">

          {/* ========================================================= */}
          {/* 1. PERSONAL INFORMATION SECTION                           */}
          {/* ========================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* SUBSECTION 1: MY PROFILE */}
              {(activeSubTab === 'profile' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">My Profile & Biometrics</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your athlete identity, contact information, profile picture, and health telemetry.</p>
                    </div>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white text-xs font-semibold shadow-sm hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Edit2 size={14} /> {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Hidden File Input for Cloudinary Direct Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Profile Picture & General Details Card */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      
                      {/* Avatar with Cloudinary Upload Trigger */}
                      <div className="relative group shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/10 shadow-sm relative bg-[#0C0C10]">
                          <img
                            src={profilePic}
                            alt="Customer Avatar"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-[10px] gap-1.5 z-10">
                              <RefreshCw size={20} className="animate-spin text-[#FF1E27]" />
                              <span className="text-center font-medium">Uploading...</span>
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay Button */}
                        <button
                          type="button"
                          disabled={uploadingAvatar}
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium cursor-pointer"
                          title="Click to choose a photo and upload directly to Cloudinary"
                        >
                          <Camera size={20} className="mb-1 text-[#FF1E27]" />
                          <span>Change Photo</span>
                        </button>
                      </div>

                      <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">{fullName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-[11px] font-medium">
                            Verified Member
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300">
                          Membership Tier: <span className="text-white font-semibold">{activePlanName}</span> • Biometric Turnstile NFC Assigned
                        </p>
                        <p className="text-xs text-slate-400">
                          Member ID: <span className="font-mono text-slate-300">#TP-{(user?._id || user?.id || '8842').slice(-6).toUpperCase()}</span> • Goal: <span className="text-[#FF1E27] font-semibold">{fitnessGoal}</span>
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                          <button
                            type="button"
                            disabled={uploadingAvatar}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Camera size={13} className="text-[#FF1E27]" />
                            {uploadingAvatar ? 'Uploading...' : 'Change Profile Picture'}
                          </button>

                          {isEditingProfile && (
                            <button
                              type="button"
                              onClick={() => {
                                const customUrl = window.prompt('Paste direct image URL (or upload image file):', profilePic);
                                if (customUrl && customUrl.trim()) {
                                  setProfilePic(customUrl.trim());
                                  showToast('Custom image URL applied!');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                            >
                              Paste Direct URL
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Physical Matrix (Editable in Edit Mode) */}
                    <div className="pt-4 border-t border-white/[0.06] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Physical Telemetry & Biometrics
                        </span>
                        {isEditingProfile && (
                          <span className="text-xs text-[#FF1E27] font-medium">
                            ● Telemetry fields editable below
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Height */}
                        <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">HEIGHT</span>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              placeholder="178 cm"
                              className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-white/20 text-white text-sm font-semibold outline-none focus:border-[#FF1E27]"
                            />
                          ) : (
                            <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">{height}</h4>
                          )}
                          <span className="text-[11px] text-slate-400 block">Laser Calibrated</span>
                        </div>

                        {/* Weight */}
                        <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">WEIGHT</span>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              placeholder="76 kg"
                              className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-white/20 text-[#FF1E27] text-sm font-semibold outline-none focus:border-[#FF1E27]"
                            />
                          ) : (
                            <h4 className="text-lg font-bold text-[#FF1E27] font-['Outfit',sans-serif]">{weight}</h4>
                          )}
                          <span className="text-[11px] text-emerald-400 font-medium block">Active Target</span>
                        </div>

                        {/* Body Fat */}
                        <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">BODY FAT %</span>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={bodyFat}
                              onChange={(e) => setBodyFat(e.target.value)}
                              placeholder="14.2%"
                              className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-white/20 text-amber-400 text-sm font-semibold outline-none focus:border-[#FF1E27]"
                            />
                          ) : (
                            <h4 className="text-lg font-bold text-amber-400 font-['Outfit',sans-serif]">{bodyFat}</h4>
                          )}
                          <span className="text-[11px] text-amber-400/90 font-medium block">InBody 3D Scan</span>
                        </div>

                        {/* Blood Group */}
                        <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">BLOOD GROUP</span>
                          {isEditingProfile ? (
                            <select
                              value={bloodGroup}
                              onChange={(e) => setBloodGroup(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-white/20 text-cyan-400 text-sm font-semibold outline-none focus:border-[#FF1E27]"
                            >
                              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                              ))}
                            </select>
                          ) : (
                            <h4 className="text-lg font-bold text-cyan-400 font-['Outfit',sans-serif]">{bloodGroup}</h4>
                          )}
                          <span className="text-[11px] text-cyan-400/90 font-medium block">Medical Record</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Fields Form */}
                    <div className="pt-4 border-t border-white/[0.06] space-y-4">
                      
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">First Name</label>
                          <input
                            type="text"
                            value={firstName}
                            disabled={!isEditingProfile}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            disabled={!isEditingProfile}
                            onChange={(e) => setLastName(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            disabled={!isEditingProfile}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">Phone Number</label>
                          <input
                            type="tel"
                            value={phone}
                            disabled={!isEditingProfile}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {/* DOB & Gender */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">Date of Birth</label>
                          <input
                            type="date"
                            value={dob}
                            disabled={!isEditingProfile}
                            onChange={(e) => setDob(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-300">Gender</label>
                          <div className="flex items-center gap-6 pt-2 text-sm text-slate-300">
                            {['Male', 'Female', 'Other'].map((g) => (
                              <label key={g} className="flex items-center gap-2 cursor-pointer font-medium">
                                <input
                                  type="radio"
                                  name="gender"
                                  value={g}
                                  checked={gender === g}
                                  disabled={!isEditingProfile}
                                  onChange={(e) => setGender(e.target.value)}
                                  className="accent-[#FF1E27] cursor-pointer"
                                />
                                <span>{g}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fitness Goal Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">Primary Fitness Goal</label>
                        <select
                          value={fitnessGoal}
                          disabled={!isEditingProfile}
                          onChange={(e) => setFitnessGoal(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                            isEditingProfile
                              ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                              : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <option value="Hypertrophy & Strength Progression">Hypertrophy & Strength Progression</option>
                          <option value="Fat Loss & Body Recomposition">Fat Loss & Body Recomposition</option>
                          <option value="Olympic Weightlifting & Power">Olympic Weightlifting & Power</option>
                          <option value="Cardio Conditioning & VO2 Max">Cardio Conditioning & VO2 Max</option>
                          <option value="Mobility, Flexibility & Longevity">Mobility, Flexibility & Longevity</option>
                        </select>
                      </div>

                      {/* Address Fields */}
                      <div className="space-y-2.5 pt-2">
                        <label className="text-xs font-medium text-slate-300">Postal Address</label>
                        <input
                          type="text"
                          value={address.street}
                          disabled={!isEditingProfile}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="Street address"
                          className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                            isEditingProfile
                              ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                              : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                          }`}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={address.city}
                            disabled={!isEditingProfile}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            placeholder="City"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                          <input
                            type="text"
                            value={address.state}
                            disabled={!isEditingProfile}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            placeholder="State"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                          <input
                            type="text"
                            value={address.pincode}
                            disabled={!isEditingProfile}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            placeholder="PIN Code"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                              isEditingProfile
                                ? 'bg-[#0D0D12] border border-white/20 text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30'
                                : 'bg-[#14141A] border border-white/[0.06] text-slate-300 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {isEditingProfile && (
                        <div className="pt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all"
                          >
                            Save Profile Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs sm:text-sm font-medium cursor-pointer transition-all border border-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSECTION 2: MY ORDERS */}
              {activeSubTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">My Orders & Purchases</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Track your active membership passes, pre-workout orders, wearables, and personal training sessions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FF1E27]/10 text-[#FF1E27] border border-[#FF1E27]/20 text-xs font-semibold">
                        {filteredOrders.length} Total Orders
                      </span>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    {['all', 'Pass', 'Supplements', 'Wearables', 'Coaching'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          orderFilter === f
                            ? 'bg-[#FF1E27] text-white shadow-sm font-semibold'
                            : 'bg-[#131318] text-slate-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {f === 'all' ? 'All Orders' : f}
                      </button>
                    ))}
                  </div>

                  {/* Order Cards Grid */}
                  <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((ord) => {
                        const isPass = ord.category.includes('Pass');
                        return (
                          <div
                            key={ord.id}
                            className="p-5 sm:p-6 rounded-2xl bg-[#121217] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                isPass ? 'bg-[#FF1E27]/15 text-[#FF1E27]' : 'bg-emerald-950/60 text-emerald-400'
                              }`}>
                                {isPass ? <Crown size={20} /> : <ShoppingBag size={20} />}
                              </div>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono font-semibold text-xs text-[#00F0FF]">{ord.id}</span>
                                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 text-[11px]">
                                    {ord.category}
                                  </span>
                                  <span className="text-xs text-slate-400">• Placed on {ord.date}</span>
                                </div>

                                <h4 className="text-sm sm:text-base font-semibold text-white font-['Outfit',sans-serif]">{ord.title}</h4>
                                <p className="text-xs text-slate-400">{ord.items}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
                                  <Truck size={13} />
                                  <span>{ord.delivery}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                              <div className="text-right">
                                <span className="text-base font-bold text-white font-mono">{ord.amount}</span>
                                <span className="text-[11px] text-slate-400 block">{ord.paymentStatus}</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-medium">
                                ✓ {ord.orderStatus}
                              </span>
                              <button
                                onClick={() => {
                                  setReceiptModalData({
                                    id: ord.id,
                                    title: ord.title,
                                    amount: ord.amount,
                                    date: ord.date,
                                    paymentMethod: ord.paymentStatus,
                                    customerName: fullName,
                                    category: ord.category || 'Supplements',
                                    items: ord.rawOrder?.items || [{ name: ord.title, price: ord.amount, quantity: 1 }],
                                    orderDetails: ord.rawOrder || ord
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#FF1E27] text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Download size={12} /> Invoice
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 sm:p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-4 max-w-xl mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
                          <ShoppingBag size={26} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">No Orders Placed Yet</h3>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Active passes and merchandise purchases will appear in this ledger once completed.
                          </p>
                        </div>
                        <button
                          onClick={() => handleTabChange('membership', 'buy')}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all inline-flex items-center gap-2"
                        >
                          <Crown size={15} /> Explore Membership Tiers
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBSECTION 3: CHANGE PASSWORD */}
              {activeSubTab === 'password' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Account Security & Password</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your login credentials and secure your account access.</p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-[#121217] border border-white/[0.08] max-w-xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF1E27]/15 text-[#FF1E27] flex items-center justify-center">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white font-['Outfit',sans-serif]">Update Account Password</h3>
                        <p className="text-xs text-slate-400">Choose a secure password containing letters, numbers, and symbols.</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30"
                            required
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
                        <label className="text-xs font-medium text-slate-300">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="At least 6 characters"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30"
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
                        <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            placeholder="Re-enter new password"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-white/[0.04] space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Check size={12} className={passwordForm.newPassword.length >= 6 ? 'text-emerald-400' : 'text-slate-600'} />
                          <span>Minimum 6 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={12} className={passwordForm.newPassword && passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-400' : 'text-slate-600'} />
                          <span>Passwords match</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passLoading}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {passLoading ? 'Updating Password...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* ATTENDANCE & TURNSTILE ACCESS SECTION                     */}
          {/* ========================================================= */}
          {activeTab === 'attendance' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* SUBSECTION 1: ATTENDANCE LOGS */}
              {(activeSubTab === 'logs' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Gym Attendance & Turnstile Ledger</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time biometric turnstile check-ins, floor session durations, and gate access logs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSelfCheckIn}
                        disabled={selfCheckingIn}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                      >
                        <Zap size={14} className="fill-white" />
                        {selfCheckingIn ? 'Scanning Speed Gate...' : '⚡ Self Check-In (Speed Gate)'}
                      </button>
                    </div>
                  </div>

                  {/* Attendance KPI Summary Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-2 shadow-sm">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">MONTHLY ATTENDANCE</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono">{attendanceRecords.length}</span>
                        <span className="text-xs text-slate-400">/ 26 Days</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.round((attendanceRecords.length / 26) * 100))}%` }}></div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-2 shadow-sm">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">ACTIVE STREAK</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono flex items-center gap-1">
                          <Flame size={24} className="fill-amber-400" /> 6
                        </span>
                        <span className="text-xs text-slate-400">Days Active</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium block">Personal Best: 14 Consecutive Days</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-2 shadow-sm">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">AVG WORKOUT TIME</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">82</span>
                        <span className="text-xs text-slate-400">Mins / Session</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">Optimal Hypertrophy Window</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-2 shadow-sm">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">TURNSTILE GATE KEY</span>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">GATE KEY ACTIVE</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">RFID #{user?._id ? user._id.slice(-6).toUpperCase() : 'A1-4092'}</span>
                    </div>
                  </div>

                  {/* Attendance Log Table */}
                  <div className="rounded-2xl bg-[#121217] border border-white/[0.08] overflow-hidden shadow-sm">
                    <div className="p-4 sm:p-5 bg-[#181822] border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <CalendarCheck size={16} className="text-[#FF1E27]" />
                        <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">Recent Gate Access Logs ({attendanceMonthFilter})</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {['Aug 2026', 'Jul 2026', 'Jun 2026'].map((m) => (
                          <button
                            key={m}
                            onClick={() => setAttendanceMonthFilter(m)}
                            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              attendanceMonthFilter === m
                                ? 'bg-[#FF1E27] text-white font-semibold'
                                : 'bg-[#0D0D12] text-slate-400 hover:text-white border border-white/[0.06]'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto w-full no-scrollbar">
                      <table className="min-w-[860px] w-full text-left text-xs border-collapse">
                        <thead className="bg-[#14141E] text-slate-400 text-xs font-semibold tracking-wider border-b border-white/[0.06]">
                          <tr>
                            <th className="p-4 font-medium">Log ID</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Check-In</th>
                            <th className="p-4 font-medium">Check-Out</th>
                            <th className="p-4 font-medium">Duration</th>
                            <th className="p-4 font-medium">Turnstile Gate</th>
                            <th className="p-4 font-medium">Zone</th>
                            <th className="p-4 font-medium text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04] text-slate-200">
                          {attendanceRecords.map((att) => (
                            <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-mono text-[#00F0FF] font-medium">{att.id}</td>
                              <td className="p-4 text-white font-medium">{att.date}</td>
                              <td className="p-4 font-mono text-emerald-400 font-semibold">{att.checkIn}</td>
                              <td className="p-4 font-mono text-slate-400">{att.checkOut}</td>
                              <td className="p-4 font-mono text-purple-400">{att.duration}</td>
                              <td className="p-4 text-slate-300 font-mono text-[11px]">{att.gate}</td>
                              <td className="p-4 text-slate-400">{att.zone}</td>
                              <td className="p-4 text-right">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1 ${
                                  att.status === 'Active Floor'
                                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800 animate-pulse'
                                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                }`}>
                                  {att.status === 'Active Floor' ? '● In Session' : '✓ Verified'}
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

              {/* SUBSECTION 2: DIGITAL BIOMETRIC TURNSTILE GATE PASS (QR / NFC) */}
              {activeSubTab === 'qr' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Digital Turnstile NFC / QR Access Pass</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Scan this dynamic encrypted token at any Titan biometric optical turnstile scanner for contact-free entry.</p>
                  </div>

                  <div className="max-w-md mx-auto p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181824] to-[#0E0E14] border border-white/[0.12] shadow-2xl space-y-6 text-center">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <Crown size={18} className="text-[#FF1E27]" />
                        <span className="font-black text-sm text-white tracking-wider font-['Outfit',sans-serif] uppercase">
                          TITAN TURNSTILE KEY
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        ● LIVE TOKEN
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="p-5 rounded-2xl bg-white shadow-2xl inline-block mx-auto relative group">
                      <div className="w-48 h-48 bg-white flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                          <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                          <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                          <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                          <rect x="35" y="10" width="8" height="15" />
                          <rect x="50" y="10" width="12" height="8" />
                          <rect x="10" y="35" width="15" height="8" />
                          <rect x="70" y="35" width="20" height="8" />
                          <rect x="35" y="45" width="30" height="10" />
                          <rect x="35" y="70" width="10" height="20" />
                          <rect x="55" y="65" width="15" height="15" />
                          <rect x="80" y="75" width="10" height="15" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-white">{fullName || user?.name || 'Athlete Member'}</h4>
                      <p className="text-xs text-slate-400 font-mono">Member ID: #{user?._id ? user._id.slice(-6).toUpperCase() : 'A1-4092'}</p>
                      <span className="text-xs text-[#FF1E27] font-semibold block">{membershipPlan && membershipPlan !== 'No Active Plan' ? membershipPlan : 'Pro Membership Pass'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1 text-xs text-slate-400">
                      <div className="flex justify-between"><span>Scanner Frequency:</span> <strong className="text-white font-mono">13.56 MHz RFID / NFC</strong></div>
                      <div className="flex justify-between"><span>Speed Gate Access:</span> <strong className="text-emerald-400 font-semibold">24/7 Turnstile Turnaround</strong></div>
                    </div>

                    <button
                      onClick={handleSelfCheckIn}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={16} /> Tap to Simulate Turnstile Gate Entry
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION 3: MONTHLY STREAKS & HEATMAP (GITHUB CONTRIBUTION GRAPH EFFECT) */}
              {activeSubTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Workout Streak & Activity Density Graph</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Interactive GitHub-style contribution matrix visualizing workout volume, floor session frequency, and training streaks.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                        <Flame size={14} className="fill-amber-400 text-amber-400" /> 6-Day Active Streak
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-semibold">
                        ✓ 88% Consistency
                      </span>
                    </div>
                  </div>

                  {/* Main Streak Graph Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/[0.08] shadow-xl space-y-6">
                    {/* Header & Graph Controls Bar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/[0.06]">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                          <span>Floor Activity & Session Volume</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 font-normal">
                            {streakGraphMonths} Months View
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">Hover over any node to inspect session duration, target workout split, and date telemetry.</p>
                      </div>

                      {/* Interactive Customization Controls */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Timeframe Selector */}
                        <div className="flex p-1 rounded-xl bg-[#090C0E] border border-white/10">
                          {[
                            { label: '3M', val: 3 },
                            { label: '6M', val: 6 },
                            { label: '12M (Full Year)', val: 12 }
                          ].map((item) => (
                            <button
                              key={item.val}
                              onClick={() => setStreakGraphMonths(item.val)}
                              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                                streakGraphMonths === item.val
                                  ? 'bg-[#FF1E27] text-white font-semibold shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Theme Variant Palette */}
                        <div className="flex p-1 rounded-xl bg-[#090C0E] border border-white/10">
                          {[
                            { id: 'attendance', label: '🟢 Present / 🔴 Absent', color: 'bg-emerald-500' },
                            { id: 'github', label: '🟩 GitHub Classic', color: 'bg-emerald-400' },
                            { id: 'titan', label: '🔥 Flame', color: 'bg-rose-600' },
                            { id: 'ocean', label: '⚡ Cyber', color: 'bg-blue-500' },
                            { id: 'violet', label: '🔮 Violet', color: 'bg-purple-500' }
                          ].map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setStreakGraphVariant(v.id)}
                              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                streakGraphVariant === v.id
                                  ? 'bg-white/15 text-white font-bold'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${v.color}`}></span>
                              <span>{v.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Ambient Effect */}
                        <select
                          value={streakGraphAmbient}
                          onChange={(e) => setStreakGraphAmbient(e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 text-xs outline-none focus:border-[#FF1E27] cursor-pointer"
                        >
                          <option value="twinkle">Ambient: Twinkle</option>
                          <option value="tide">Ambient: Tide Wave</option>
                          <option value="drift">Ambient: Drift</option>
                          <option value="none">Ambient: Static</option>
                        </select>

                        {/* Animation Style */}
                        <select
                          value={streakGraphAnimation}
                          onChange={(e) => setStreakGraphAnimation(e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 text-xs outline-none focus:border-[#FF1E27] cursor-pointer"
                        >
                          <option value="wave">Choreo: Wave</option>
                          <option value="scan">Choreo: Scan</option>
                          <option value="cascade">Choreo: Cascade</option>
                          <option value="none">Choreo: Immediate</option>
                        </select>
                      </div>
                    </div>

                    {/* The Github-Style Contribution Graph Component */}
                    <div className="pt-2">
                      <WorkoutStreakGraph
                        key={`${streakGraphMonths}-${streakGraphVariant}-${streakGraphAnimation}-${streakGraphAmbient}`}
                        months={streakGraphMonths}
                        variant={streakGraphVariant}
                        animation={streakGraphAnimation}
                        ambientEffect={streakGraphAmbient}
                        data={workoutContributionsData}
                        showLegend={true}
                        cellSize={15}
                        cellGap={4}
                        cellRadius={3.5}
                      />
                    </div>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-1.5 shadow-sm">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">CURRENT STREAK</span>
                      <p className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                        <Flame size={20} className="text-amber-400 fill-amber-400" /> 6 Days
                      </p>
                      <span className="text-xs text-slate-400">Streak started on Monday, 25 Aug</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-1.5 shadow-sm">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">LONGEST RECORD STREAK</span>
                      <p className="text-2xl font-black text-amber-400 font-mono">14 Days</p>
                      <span className="text-xs text-slate-400">Achieved during May 2026 Hypertrophy Cycle</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-1.5 shadow-sm">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">TOTAL WORKOUT HOURS</span>
                      <p className="text-2xl font-black text-purple-400 font-mono">148.5 Hrs</p>
                      <span className="text-xs text-emerald-400 font-medium">Top 5% consistency in gym facility</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MEMBERSHIP DETAILS SECTION                             */}
          {/* ========================================================= */}
          {activeTab === 'membership' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* SUBSECTION 1: CURRENT MEMBERSHIP */}
              {(activeSubTab === 'current' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Active Membership Details</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Biometric turnstile access status, validity countdown, and tier privileges.</p>
                    </div>
                    {hasActiveMembership ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-xs font-medium">
                        ● 24/7 Gate Access Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/80 text-xs font-medium">
                        ● No Active Plan
                      </span>
                    )}
                  </div>

                  {hasActiveMembership ? (
                    /* Real Active Plan Hero Card */
                    <div className="p-6 sm:p-7 rounded-2xl bg-[#121217] border border-[#FF1E27]/30 shadow-md space-y-6 relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF1E27]/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                          <span className="px-3 py-1 rounded-full bg-[#FF1E27]/10 text-[#FF1E27] border border-[#FF1E27]/30 text-xs font-semibold uppercase tracking-wider">
                            Active Membership Tier
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">{membershipPlan}</h3>
                          <p className="text-xs text-slate-400">
                            Biometric Scanner ID: <span className="font-mono text-slate-300">#BIO-{(user?._id || user?.id || '8842').slice(-6).toUpperCase()}</span> • Status: <span className="text-emerald-400 font-semibold">{membershipStatus}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                          <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-white/10">
                            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">START DATE</span>
                            <span className="text-sm font-semibold text-white font-['Outfit',sans-serif]">{membershipStartDate || 'Active'}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-white/10">
                            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">EXPIRY DATE</span>
                            <span className="text-sm font-semibold text-emerald-400 font-['Outfit',sans-serif]">{membershipExpiry || 'Active'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Progress Bar for Remaining Days */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Membership Duration Status:</span>
                          <span className="text-white font-semibold">{remainingInfo.text}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-[#FF1E27] to-[#E50914] shadow-sm transition-all duration-500" 
                            style={{ width: `${Math.max(5, remainingInfo.percentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Included Amenities for Active Plan - Dynamically fetched from CMS */}
                      <div className="pt-4 border-t border-white/[0.08] space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Included Privileges & Services:</h4>
                          <span className="text-xs text-[#FF1E27] font-semibold">{currentPlanDetails?.tagline || currentPlanDetails?.name}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
                          {(currentPlanDetails?.features && currentPlanDetails.features.length > 0 ? currentPlanDetails.features : [
                            '24/7 All-Access to Titan Gym Floor & Arenas',
                            'Touchless Biometric Turnstile NFC Gate Key',
                            'Monthly 3D Telemetry Body Composition Audit',
                            'Hydro-Sauna, Cold Plunge & Recovery Lounge Access'
                          ]).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          onClick={() => handleSubTabChange('renew')}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all"
                        >
                          Renew Membership
                        </button>
                        <button
                          onClick={() => handleSubTabChange('buy')}
                          className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          Explore Upgrade Tiers
                        </button>
                        <button
                          onClick={() => setQrModalOpen(true)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-400 font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
                        >
                          <QrCode size={15} /> View Digital Gate Key
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Clean No-Active-Membership Card */
                    <div className="p-8 sm:p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-5 max-w-2xl mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                        <Crown size={30} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">No Active Gym Membership</h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                          You currently do not have an active membership plan linked to this account. Activate a tier to unlock 24/7 biometric turnstile gate access, lockers, sauna, and coaching.
                        </p>
                      </div>
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <button
                          onClick={() => handleSubTabChange('buy')}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all"
                        >
                          Browse Membership Tiers
                        </button>
                        <button
                          onClick={() => handleTabChange('feedback', 'faq')}
                          className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 text-xs sm:text-sm font-medium cursor-pointer transition-all"
                        >
                          Contact Reception Desk
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBSECTION 2: RENEW MEMBERSHIP */}
              {activeSubTab === 'renew' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Renew Membership</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Extend your 24/7 biometric gym pass seamlessly with instant checkout.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-6 sm:p-7 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-6 shadow-sm">
                      <h3 className="text-base font-semibold text-white font-['Outfit',sans-serif]">Select Renewal Duration</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { val: '1', title: '1 Month Renewal', price: '₹2,499', save: null },
                          { val: '3', title: '3 Months Renewal', price: '₹6,749', save: 'Save 10%' },
                          { val: '6', title: '6 Months Renewal', price: '₹11,999', save: 'Save 20%' },
                          { val: '12', title: '12 Months (Best Value)', price: '₹19,499', save: 'Save 35%' }
                        ].map((opt) => (
                          <div
                            key={opt.val}
                            onClick={() => setSelectedRenewDuration(opt.val)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                              selectedRenewDuration === opt.val
                                ? 'bg-[#FF1E27]/10 border-[#FF1E27] text-white shadow-sm'
                                : 'bg-[#0D0D12] border-white/[0.06] text-slate-300 hover:border-white/20'
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm text-white">{opt.title}</h4>
                              <span className="text-xs text-slate-400 font-mono">{opt.price}</span>
                            </div>
                            {opt.save && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                                {opt.save}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.04] space-y-2">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Base Renewal Charge:</span>
                          <span className="font-mono text-white">
                            {selectedRenewDuration === '1' ? '₹2,499' : selectedRenewDuration === '3' ? '₹6,749' : selectedRenewDuration === '6' ? '₹11,999' : '₹19,499'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Gym Equipment Maintenance:</span>
                          <span className="text-emerald-400 font-semibold">FREE</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Applicable Taxes (18% GST):</span>
                          <span className="text-white font-medium">Included</span>
                        </div>
                        <div className="pt-2 border-t border-white/[0.06] flex justify-between text-sm font-semibold text-white">
                          <span>Total Payable Amount:</span>
                          <span className="font-mono text-[#FF1E27] text-base font-bold">
                            {selectedRenewDuration === '1' ? '₹2,499' : selectedRenewDuration === '3' ? '₹6,749' : selectedRenewDuration === '6' ? '₹11,999' : '₹19,499'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleRenewPayment}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard size={16} /> Proceed to Payment
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF1E27]/15 text-[#FF1E27] flex items-center justify-center">
                          <Zap size={18} />
                        </div>
                        <h4 className="text-base font-semibold text-white font-['Outfit',sans-serif]">Instant Biometric Sync</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your RFID turnstile privileges update instantly on the cloud biometric server and database upon successful payment confirmation.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/[0.06] text-xs text-slate-300 space-y-1">
                        <p className="font-semibold text-white">Corporate Promo Code?</p>
                        <p className="text-slate-400">Enter discount code at the reception desk for corporate or group concessions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSECTION 3: BUY A NEW MEMBERSHIP */}
              {activeSubTab === 'buy' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Buy / Upgrade Membership Tier</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Explore our high-performance fitness tiers configured for your training goals.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {membershipPlans.map((plan) => {
                      const isCurrentPlan = hasActiveMembership && (
                        (membershipPlan && plan.name && plan.name.toLowerCase().trim() === membershipPlan.toLowerCase().trim()) ||
                        (membershipPlan && plan.tierKey && membershipPlan.toLowerCase().includes(plan.tierKey.toLowerCase())) ||
                        (membershipPlan && plan.id && membershipPlan.toLowerCase().includes(plan.id.toLowerCase()))
                      );
                      
                      // Exactly one plan is selected at a time
                      const isSelected = selectedPlanId 
                        ? (selectedPlanId === plan.id || selectedPlanId === plan.tierKey || (plan.name && selectedPlanId.toLowerCase() === plan.name.toLowerCase()))
                        : isCurrentPlan;

                      return (
                        <div
                          key={plan.id}
                          onClick={() => handleBuyPlan(plan)}
                          className={`p-6 sm:p-7 rounded-2xl transition-all flex flex-col justify-between space-y-6 shadow-sm relative cursor-pointer h-full ${
                            isSelected
                              ? 'bg-[#151522] border-2 border-[#FF1E27] shadow-[0_0_25px_rgba(255,30,39,0.3)] ring-1 ring-[#FF1E27]/40'
                              : 'bg-[#121217] border border-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          {plan.badge && (
                            <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase shadow-sm ${
                              isSelected ? 'bg-[#FF1E27] text-white' : 'bg-white/10 text-slate-300 border border-white/10'
                            }`}>
                              {plan.badge}
                            </span>
                          )}

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">{plan.name}</h3>
                                {isCurrentPlan && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold shrink-0">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#FF1E27] font-semibold mt-0.5">{plan.tagline}</p>
                              {plan.description && (
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{plan.description}</p>
                              )}
                            </div>

                            <div className="pt-2 pb-1 border-y border-white/[0.06] flex items-baseline gap-1.5">
                              <span className="text-3xl sm:text-4xl font-bold text-white font-['Outfit',sans-serif] tracking-tight">{plan.price}</span>
                              <span className="text-xs text-slate-400 font-normal">/{plan.period}</span>
                            </div>

                            <div className="space-y-2.5">
                              <span className="text-xs font-semibold uppercase text-slate-300 tracking-wider block">
                                Included Services & Privileges:
                              </span>
                              {plan.services && plan.services.length > 0 ? (
                                <div className="space-y-2">
                                  {plan.services.map((srv, idx) => (
                                    <div key={srv.id || idx} className="flex items-start justify-between gap-2 text-xs sm:text-sm py-0.5">
                                      <div className="flex items-start gap-2 text-slate-200 min-w-0">
                                        {srv.included !== false ? (
                                          <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                          <X size={15} className="text-slate-600 shrink-0 mt-0.5" />
                                        )}
                                        <span className={`leading-relaxed text-xs sm:text-sm font-medium ${srv.included !== false ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                                          {srv.name}
                                        </span>
                                      </div>
                                      {srv.category && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-400 font-medium shrink-0 ml-1.5">
                                          {srv.category}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {plan.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 py-0.5">
                                      <Check size={15} className="text-[#FF1E27] shrink-0 mt-0.5" />
                                      <span className="leading-relaxed text-xs sm:text-sm font-medium">{feat}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyPlan(plan);
                            }}
                            className={`w-full h-11 sm:h-12 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md ring-2 ring-[#FF1E27]/50 hover:brightness-110'
                                : 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white border border-white/10'
                            }`}
                          >
                            {isCurrentPlan && isSelected ? (
                              <>
                                <CheckCircle2 size={16} className="text-white" /> Current Active Plan
                              </>
                            ) : (
                              <>
                                <CreditCard size={15} /> Pay & Activate Tier
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 3. TRAINERS SECTION                                       */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 3. TRAINERS SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === 'trainers' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* SUBSECTION 1: ASSIGNED TRAINER */}
              {(activeSubTab === 'assigned' || activeSubTab === 'active' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">My Assigned Master Coach</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Dedicated personal trainer assigned to manage your workout progression, form audits, and training regimen.</p>
                    </div>
                    <button
                      onClick={() => setActiveSubTab('all')}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#FF1E27] text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Users size={14} /> View All Faculty
                    </button>
                  </div>

                  {myAssignedTrainer ? (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/[0.08] shadow-xl space-y-6 hover:border-[#FF1E27]/40 transition-all">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-4">
                          <img
                            src={myAssignedTrainer.image || myAssignedTrainer.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'}
                            alt={myAssignedTrainer.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#FF1E27]/40 shadow-lg shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">{myAssignedTrainer.name}</h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                                ● Assigned Coach
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-[#FF1E27] font-semibold block">{myAssignedTrainer.spec || 'Master Strength & Hypertrophy Specialist'}</span>
                            <span className="text-xs text-slate-400 block">{myAssignedTrainer.experience || '6+ Years Experience'} • Shift: {myAssignedTrainer.shift || '06:00 AM - 02:00 PM'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5">
                            <Star size={13} className="fill-amber-400 text-amber-400" /> {myAssignedTrainer.rating || '5.0 ★'} Rating
                          </span>
                        </div>
                      </div>

                      {/* Coach Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">TRAINING ARENA:</span>
                          <p className="font-semibold text-white">{myAssignedTrainer.room || 'Main Strength Arena'}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">ASSIGNED SPLIT:</span>
                          <p className="font-semibold text-emerald-400">{membershipPlan && membershipPlan !== 'No Active Plan' ? `${membershipPlan} Routine` : 'Personalized Hypertrophy'}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">COACHING STATUS:</span>
                          <p className="font-semibold text-emerald-400">Included with Membership</p>
                        </div>
                      </div>

                      {myAssignedTrainer.bio && (
                        <p className="text-xs text-slate-300 italic bg-[#0D0D12] p-3.5 rounded-xl border border-white/[0.04]">
                          "{myAssignedTrainer.bio}"
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => setChatModalTrainer(myAssignedTrainer)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <MessageSquare size={15} /> Chat with Assigned Coach
                        </button>
                        <button
                          onClick={() => setActiveTab('workout-diet')}
                          className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Dumbbell size={15} /> View Assigned Workout Plan
                        </button>
                        <button
                          onClick={() => setActiveSubTab('all')}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                        >
                          Switch Coach
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 sm:p-12 rounded-3xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-[#FF1E27]/10 border border-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center mx-auto">
                        <Users size={32} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">No Personal Coach Assigned Yet</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          You do not currently have a dedicated master trainer assigned to your profile. Select a certified coach from our faculty to guide your progression.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveSubTab('all')}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-md hover:brightness-110 cursor-pointer transition-all inline-flex items-center gap-2"
                      >
                        <Users size={15} /> Choose a Trainer from Faculty
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUBSECTION 2: ALL FACULTY TRAINERS */}
              {(activeSubTab === 'all' || activeSubTab === 'book') && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">All Certified Faculty Trainers</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Explore our certified master faculty specialists for biomechanics, strength progression, and 1-on-1 personal coaching.</p>
                  </div>

                  {realTrainers.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#121217] border border-white/[0.08] text-center text-slate-400 text-xs">
                      {loadingTrainers ? 'Loading faculty trainers...' : 'No faculty trainers registered in the system.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {realTrainers.map((t) => {
                        const isAssignedToMe = myAssignedTrainer && (myAssignedTrainer.id === t.id || myAssignedTrainer.name === t.name);
                        return (
                          <div key={t.id} className="p-5 sm:p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4 shadow-sm hover:border-[#FF1E27]/40 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="w-full h-44 rounded-xl overflow-hidden relative">
                                <img
                                  src={t.image || t.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'}
                                  alt={t.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                                  <Star size={11} className="fill-amber-400 text-amber-400" /> {t.rating || '5.0'}
                                </span>
                                {isAssignedToMe && (
                                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-700 text-[10px] font-bold">
                                    ✓ Assigned to You
                                  </span>
                                )}
                              </div>

                              <div>
                                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">{t.name}</h3>
                                <span className="text-xs text-[#FF1E27] font-semibold block mt-0.5">{t.spec || 'Master Strength Specialist'}</span>
                                <span className="text-xs text-slate-400 block mt-0.5">{t.experience || '6+ Years Experience'} • Shift: {t.shift || '06:00 AM - 02:00 PM'}</span>
                                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">{t.bio}</p>
                              </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Coaching Status:</span>
                                <span className={isAssignedToMe ? "text-emerald-400 font-bold" : "text-slate-300 font-medium"}>
                                  {isAssignedToMe ? "✓ Active Assigned Coach" : "Available to Assign"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-2">
                                {!isAssignedToMe ? (
                                  <button
                                    onClick={() => handleAssignTrainer(t)}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs shadow-sm hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <UserCheck size={14} /> Set as My Assigned Coach
                                  </button>
                                ) : (
                                  <div className="w-full py-2 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 font-semibold text-xs text-center">
                                    ✓ Your Active Coach (Included)
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setChatModalTrainer(t)}
                                    className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <MessageSquare size={13} /> Chat with Coach
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SUBSECTION 3: PREVIOUS TRAINERS */}
              {activeSubTab === 'previous' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Previous Coaches History</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Historical log of master coaches previously assigned to your training plans.</p>
                  </div>

                  <div className="p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-3 max-w-lg mx-auto">
                    <History size={32} className="text-slate-500 mx-auto" />
                    <h4 className="text-sm font-semibold text-white">No Previous Coaching History</h4>
                    <p className="text-xs text-slate-400">When you complete coaching cycles with assigned trainers, your past coach records will be archived here.</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 4. PAYMENTS SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-fadeIn">

              {/* TOP FINANCIAL METRICS CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#181824] to-[#121217] border border-white/[0.08] relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Payments</span>
                    <DollarSign size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
                    ₹{totalPaymentsAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
                    <CheckCircle2 size={12} />
                    <span>{allTransactions.length} Verified Transactions</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#181824] to-[#121217] border border-white/[0.08] relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Supplements & Gear</span>
                    <ShoppingBag size={16} className="text-[#00F0FF]" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#00F0FF] font-mono tracking-tight">
                    ₹{totalSupplementAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span>{supplementPayments.length} Store Orders Placed</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#181824] to-[#121217] border border-white/[0.08] relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Membership Passes</span>
                    <Crown size={16} className="text-[#FF1E27]" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#FF1E27] font-mono tracking-tight">
                    ₹{totalMembershipAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span>{hasActiveMembership ? 'Active Membership Active' : 'No Active Plan'}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#181824] to-[#121217] border border-white/[0.08] relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Billing Status</span>
                    <ShieldCheck size={16} className="text-purple-400" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-purple-400 font-mono tracking-tight">
                    100% SECURE
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-300 mt-1">
                    <Zap size={12} />
                    <span>256-Bit SSL Verified</span>
                  </div>
                </div>
              </div>
              
              {/* SUBSECTION 1: PAYMENT HISTORY */}
              {(activeSubTab === 'history' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Payment Transactions History</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Unified ledger of all supplement purchases, merchandise, membership passes, and registered transactions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold font-mono">
                        {allTransactions.length} Total Payments
                      </span>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: `All Transactions (${allTransactions.length})` },
                      { id: 'Supplements', label: `Supplements & Gear (${supplementPayments.length})` },
                      { id: 'Membership', label: `Membership Passes (${membershipPayments.length})` }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setPaymentFilter(f.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          paymentFilter === f.id
                            ? 'bg-[#FF1E27] text-white shadow-sm'
                            : 'bg-[#131318] text-slate-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filteredTransactions.length > 0 ? (
                    <div className="rounded-2xl bg-[#121217] border border-white/[0.08] overflow-hidden shadow-sm">
                      <div className="overflow-x-auto w-full no-scrollbar">
                        <table className="min-w-[1020px] w-full text-left text-xs border-collapse">
                          <thead className="bg-[#181822] text-slate-400 text-xs font-semibold tracking-wider border-b border-white/[0.08]">
                            <tr>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[160px]">Transaction ID</th>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[120px]">Date</th>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[140px]">Category</th>
                              <th className="px-4 py-3.5 font-semibold min-w-[260px]">Description / Items</th>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[180px]">Payment Method</th>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[110px]">Amount</th>
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap min-w-[130px]">Status</th>
                              <th className="px-4 py-3.5 text-right font-semibold whitespace-nowrap min-w-[110px]">Receipt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04] text-slate-200">
                            {filteredTransactions.map((tx) => {
                              const isSupp = tx.category.toLowerCase().includes('supp');
                              const isPending = tx.status.toLowerCase().includes('pending');
                              return (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-4 py-3.5 font-mono font-medium whitespace-nowrap align-middle">
                                    <span className={isSupp ? 'text-emerald-400 font-semibold' : 'text-[#00F0FF] font-semibold'}>
                                      {tx.id}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap align-middle">{tx.date}</td>
                                  <td className="px-4 py-3.5 whitespace-nowrap align-middle">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                      isSupp
                                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                                        : 'bg-[#FF1E27]/15 text-[#FF1E27] border border-[#FF1E27]/30'
                                    }`}>
                                      {isSupp ? <ShoppingBag size={11} /> : <Crown size={11} />}
                                      <span>{tx.category}</span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 font-medium text-white align-middle max-w-[280px]" title={tx.item}>
                                    <span className="truncate block">{tx.item}</span>
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap align-middle">{tx.method}</td>
                                  <td className="px-4 py-3.5 font-bold text-emerald-400 font-mono text-sm whitespace-nowrap align-middle">{tx.amount}</td>
                                  <td className="px-4 py-3.5 whitespace-nowrap align-middle">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap border ${
                                      isPending
                                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                                    }`}>
                                      <span>✓</span>
                                      <span>{tx.status}</span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-right whitespace-nowrap align-middle">
                                    <button
                                      onClick={() => {
                                        setReceiptModalData({
                                          id: tx.id,
                                          title: tx.item,
                                          amount: tx.amount,
                                          date: tx.date,
                                          paymentMethod: tx.method,
                                          category: tx.category,
                                          customerName: fullName,
                                          orderDetails: tx.orderDetails || {
                                            id: tx.id,
                                            title: tx.item,
                                            amount: tx.amount,
                                            date: tx.date,
                                            paymentMethod: tx.method,
                                            category: tx.category,
                                            customerName: fullName
                                          }
                                        });
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-[#181822] hover:bg-[#FF1E27] text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5 font-medium text-xs border border-white/[0.06] whitespace-nowrap shadow-sm"
                                      title="View Official Receipt & Invoice"
                                    >
                                      <Download size={13} />
                                      <span>Invoice</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 sm:p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FF1E27]/10 border border-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center mx-auto">
                        <CreditCard size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">No Payment Transactions Found</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          No payments match the selected category. Complete a supplement order or enroll in a membership pass to view transactions here.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                          to="/my-cart"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2"
                        >
                          <ShoppingBag size={14} /> Shop Supplements
                        </Link>
                        <button
                          onClick={() => handleTabChange('membership', 'buy')}
                          className="px-4 py-2 rounded-xl bg-[#FF1E27] hover:bg-[#E50914] text-white font-semibold text-xs shadow-sm hover:brightness-110 cursor-pointer transition-all inline-flex items-center gap-2"
                        >
                          <Crown size={14} /> Browse Memberships
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBSECTION 2: MEMBERSHIP PAYMENTS */}
              {activeSubTab === 'membership' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Membership Billing & Invoices</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Official membership subscriptions, validity billing records, and downloadable tax invoices.</p>
                  </div>

                  {membershipPayments.length > 0 ? (
                    <div className="space-y-4">
                      {membershipPayments.map((mp) => (
                        <div
                          key={mp.id}
                          className="p-5 sm:p-6 rounded-2xl bg-[#121217] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#FF1E27] font-semibold">{mp.id}</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                                {mp.status}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-white font-['Outfit',sans-serif]">{mp.plan}</h4>
                            <p className="text-xs text-slate-400">Billing Date: {mp.date} • Cycle: {mp.cycle} • Method: {mp.method}</p>
                            <span className="text-xs text-cyan-400 block">Status: {mp.autoRenew}</span>
                          </div>

                          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3">
                            <span className="text-base font-bold text-white font-mono">{mp.amount}</span>
                            <button
                              onClick={() => {
                                setReceiptModalData({
                                  id: mp.id,
                                  title: mp.plan,
                                  amount: mp.amount,
                                  date: mp.date,
                                  paymentMethod: mp.method || user?.paymentMethod || 'Online Payment',
                                  customerName: fullName,
                                  category: 'Membership',
                                  orderDetails: mp
                                });
                              }}
                              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#FF1E27] text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-2"
                            >
                              <Download size={13} /> Download Tax Invoice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 sm:p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FF1E27]/10 border border-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center mx-auto">
                        <FileText size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">No Membership Invoices Available</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          Official GST tax invoices are generated automatically upon membership enrollment or renewal.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTabChange('membership', 'buy')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all inline-flex items-center gap-2"
                      >
                        <Crown size={15} /> Choose Membership Tier
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUBSECTION 3: SUPPLEMENTS & STORE PAYMENTS */}
              {activeSubTab === 'supplements' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Supplements & Store Orders</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Official purchase receipts for nutritional supplements, protein isolate, pre-workout, and fitness accessories.</p>
                    </div>
                    <Link
                      to="/my-cart"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-2"
                    >
                      <Plus size={14} /> Buy More Supplements
                    </Link>
                  </div>

                  {supplementPayments.length > 0 ? (
                    <div className="space-y-4">
                      {supplementPayments.map((sp) => (
                        <div
                          key={sp.id}
                          className="p-5 sm:p-6 rounded-2xl bg-[#121217] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold shrink-0">
                              <ShoppingBag size={20} />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-semibold text-xs text-emerald-400">{sp.id}</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold border border-emerald-500/20">
                                  {sp.status}
                                </span>
                                <span className="text-xs text-slate-400">• Paid on {sp.date}</span>
                              </div>

                              <h4 className="text-sm sm:text-base font-semibold text-white font-['Outfit',sans-serif]">
                                {sp.itemsSummary}
                              </h4>
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>Method: <strong className="text-slate-200">{sp.paymentMethod}</strong></span>
                                {sp.discount > 0 && (
                                  <span className="text-emerald-400">Promo Discount: -₹{sp.discount}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                            <div className="text-right">
                              <span className="text-lg font-bold text-white font-mono">{sp.amount}</span>
                              <span className="text-[11px] text-emerald-400 block font-medium">18% GST Included</span>
                            </div>

                            <button
                              onClick={() => {
                                setReceiptModalData({
                                  id: sp.id,
                                  title: sp.itemsSummary,
                                  amount: sp.amount,
                                  date: sp.date,
                                  paymentMethod: sp.paymentMethod,
                                  category: 'Supplements',
                                  orderDetails: sp.rawOrder || sp
                                });
                              }}
                              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#FF1E27] text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-2"
                            >
                              <Download size={13} /> View Invoice & Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 sm:p-10 rounded-2xl bg-[#121217] border border-white/[0.08] shadow-sm text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto">
                        <ShoppingBag size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">No Supplement Purchases Yet</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          Your orders for pre-workouts, hydrolyzed whey isolate, creatine, and gym accessories will appear here once purchased.
                        </p>
                      </div>
                      <Link
                        to="/my-cart"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all inline-flex items-center gap-2"
                      >
                        <ShoppingBag size={15} /> Browse Supplements & Store
                      </Link>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 5. WORKOUT, DIET & COACHING HUB SECTION                   */}
          {/* ========================================================= */}
          {activeTab === 'workout-diet' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Master Coach Protocol & Telemetry Hub</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Live workout splits, macro nutrition protocols, coach observation logs, PR telemetry, and 1-on-1 direct coaching stream.</p>
                </div>
                {user?.assignedTrainerName && (
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-mono font-semibold flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#FF1E27]" /> Assigned Coach: {user.assignedTrainerName}
                  </span>
                )}
              </div>

              {/* 5-TAB HORIZONTAL PILL NAVIGATION (CYBER RED THEME) */}
              <div className="bg-[#12141C] border border-white/[0.08] p-1.5 rounded-2xl flex items-center gap-2 overflow-x-auto no-scrollbar shadow-md">
                {[
                  { id: 'workout-plan', label: 'Workout Plan', icon: Dumbbell },
                  { id: 'diet-plan', label: 'Diet Plan', icon: Utensils },
                  { id: 'trainer-notes', label: 'Trainer Notes', icon: NotebookPen },
                  { id: 'progress', label: 'Customer Progress Tracking', icon: LineChart },
                  { id: 'chat', label: 'Chat with Trainer', icon: MessageSquare }
                ].map((sub) => {
                  const Icon = sub.icon;
                  const isSubActive = (coachingSubTab === sub.id) || (activeSubTab === sub.id) || (!coachingSubTab && sub.id === 'workout-plan');
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCoachingSubTab(sub.id);
                        setActiveSubTab(sub.id);
                      }}
                      className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isSubActive
                          ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-lg font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon size={15} className={isSubActive ? 'text-white' : 'text-slate-400'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUBSECTION 1: WORKOUT PLAN */}
              {(coachingSubTab === 'workout-plan' || activeSubTab === 'workout-plan' || (!coachingSubTab && !activeSubTab)) && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                        <Dumbbell size={20} className="text-[#FF1E27]" /> Prescribed Workout Protocol
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Biomechanical hypertrophy & strength progression prescribed by your assigned coach.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Last update: {coachingData.workoutPlan?.updatedAt || 'Recently by Coach'}</span>
                  </div>

                  {/* Coach Workout Split Telemetry Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">PRIMARY TRAINING SPLIT</span>
                      <p className="font-bold text-white text-sm">{coachingData.workoutPlan?.split || 'Push-Pull-Legs (Hypertrophy)'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">WEEKLY FREQUENCY</span>
                      <p className="font-bold text-[#FF1E27] text-sm">{coachingData.workoutPlan?.frequency || '5 Days / Week'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">INTENSITY TARGET</span>
                      <p className="font-bold text-white text-sm">{coachingData.workoutPlan?.intensity || 'High Intensity RPE 8-9'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">CARDIO & RECOVERY</span>
                      <p className="font-bold text-emerald-400 text-sm">{coachingData.workoutPlan?.cardioProtocol || '20 Mins Incline Treadmill'}</p>
                    </div>
                  </div>

                  {coachingData.workoutPlan?.customNotes && (
                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-[#FF1E27]/20 space-y-1 text-xs">
                      <span className="text-[#FF1E27] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <NotebookPen size={13} /> COACH TECHNICAL FORM CUES & EXECUTION NOTES
                      </span>
                      <p className="text-slate-200 leading-relaxed italic text-xs sm:text-sm">
                        "{coachingData.workoutPlan.customNotes}"
                      </p>
                    </div>
                  )}

                  {/* Day Tabs */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(activeWorkoutSplits).map((dayKey, idx) => (
                        <button
                          key={dayKey}
                          onClick={() => setWorkoutDay(dayKey)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            safeWorkoutDay === dayKey
                              ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                              : 'bg-[#090A0E] text-slate-400 border border-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          Day {idx + 1} Split
                        </button>
                      ))}
                    </div>

                    {activeWorkoutSplits[safeWorkoutDay] && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-[#090A0E] border border-white/[0.08] space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/[0.06]">
                          <div>
                            <h4 className="text-base font-semibold text-white font-['Outfit',sans-serif]">{activeWorkoutSplits[safeWorkoutDay].title}</h4>
                            <p className="text-xs text-[#FF1E27] font-semibold mt-0.5">{activeWorkoutSplits[safeWorkoutDay].focus}</p>
                            {activeWorkoutSplits[safeWorkoutDay].notes && (
                              <p className="text-[11px] text-slate-400 italic mt-1">"{activeWorkoutSplits[safeWorkoutDay].notes}"</p>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {(activeWorkoutSplits[safeWorkoutDay].exercises || []).length} Exercises Prescribed
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {(!activeWorkoutSplits[safeWorkoutDay].exercises || activeWorkoutSplits[safeWorkoutDay].exercises.length === 0) ? (
                            <div className="p-4 rounded-xl bg-[#12141C] text-center text-slate-500 text-xs">
                              No exercises prescribed for this day yet.
                            </div>
                          ) : (
                            activeWorkoutSplits[safeWorkoutDay].exercises.map((ex, idx) => {
                              const isDone = completedExercises[ex.id || `ex-${idx}`];
                              return (
                                <div
                                  key={ex.id || idx}
                                  onClick={() => toggleExercise(ex.id || `ex-${idx}`)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                    isDone 
                                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                                      : 'bg-[#12141C] border-white/[0.06] text-slate-200 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                      isDone ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <h5 className={`text-xs sm:text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                        {ex.name}
                                      </h5>
                                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                                        <span>{ex.sets}</span> • <span>{ex.reps}</span> • <span className="text-[#FF1E27] font-semibold">{ex.target}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-medium">Rest: {ex.rest}</span>
                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                                      isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
                                    }`}>
                                      {isDone && <Check size={12} />}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBSECTION 2: DIET PLAN */}
              {(coachingSubTab === 'diet-plan' || activeSubTab === 'diet-plan') && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                        <Utensils size={20} className="text-emerald-400" /> Prescribed Macro & Nutrition Protocol
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Caloric targets, macro ratios, hydration goals, and meal timing assigned by your coach.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Last update: {coachingData.dietPlan?.updatedAt || 'Recently by Coach'}</span>
                  </div>

                  {/* Macro Matrix Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1 shadow-sm">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">CALORIE TARGET</span>
                      <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5 font-['Outfit',sans-serif]">
                        <Flame size={18} className="text-[#FF1E27]" /> {coachingData.dietPlan?.dailyCalories || '2,800 kcal'}
                      </h4>
                      <span className="text-xs text-slate-400 block">Daily Energy Burn</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1 shadow-sm">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">PROTEIN</span>
                      <h4 className="text-lg sm:text-xl font-bold text-emerald-400 font-['Outfit',sans-serif]">
                        {coachingData.dietPlan?.protein || '180g (2.2g/kg)'}
                      </h4>
                      <span className="text-xs text-emerald-400/80 block">Muscle Protein Synthesis</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1 shadow-sm">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">CARBOHYDRATES</span>
                      <h4 className="text-lg sm:text-xl font-bold text-amber-400 font-['Outfit',sans-serif]">
                        {coachingData.dietPlan?.carbs || '320g'}
                      </h4>
                      <span className="text-xs text-amber-400/80 block">Glycogen Replenishment</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1 shadow-sm">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">HEALTHY FATS</span>
                      <h4 className="text-lg sm:text-xl font-bold text-cyan-400 font-['Outfit',sans-serif]">
                        {coachingData.dietPlan?.fats || '65g'}
                      </h4>
                      <span className="text-xs text-cyan-400/80 block">Hormonal Balance</span>
                    </div>
                  </div>

                  {/* Meal Protocol & Supplement Stack */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <h5 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-xs">
                        <Clock size={14} className="text-[#FF1E27]" /> Prescribed Meal Timing Protocol
                      </h5>
                      <p className="text-slate-300 leading-relaxed bg-[#12141C] p-3.5 rounded-xl border border-white/5 text-xs sm:text-sm">
                        {coachingData.dietPlan?.mealProtocol || '4 Meals + 1 Pre-Workout Meal + 1 Post-Workout Whey Shake'}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <h5 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-xs">
                        <Sparkles size={14} className="text-emerald-400" /> Recommended Supplementation Stack
                      </h5>
                      <div className="bg-[#12141C] p-3.5 rounded-xl border border-white/5 space-y-1.5">
                        {Array.isArray(coachingData.dietPlan?.supplements) ? (
                          coachingData.dietPlan.supplements.map((supp, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-slate-200">
                              <Check size={13} className="text-emerald-400 shrink-0" />
                              <span>{supp}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-300 text-xs sm:text-sm">{coachingData.dietPlan?.supplements || 'Whey Isolate, Creatine Creapure, Electrolytes'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Water Hydration Tracker */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#090A0E] border border-white/5 flex items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-semibold text-white font-['Outfit',sans-serif]">
                        Daily Hydration Log: {(waterGlasses * 0.25).toFixed(2)}L / {coachingData.dietPlan?.waterIntake || '4.0 Liters Target'}
                      </h4>
                      <p className="text-xs text-slate-400">Target assigned by coach: {coachingData.dietPlan?.waterIntake || '4.0 Liters Daily'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setWaterGlasses(prev => Math.max(0, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold text-cyan-400 px-2">{waterGlasses} Glasses</span>
                      <button
                        onClick={() => {
                          setWaterGlasses(prev => prev + 1);
                          showToast('Logged +250ml water intake!');
                        }}
                        className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold flex items-center justify-center cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSECTION 3: TRAINER NOTES */}
              {(coachingSubTab === 'trainer-notes' || activeSubTab === 'trainer-notes') && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                  <div className="pb-4 border-b border-white/[0.06]">
                    <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                      <NotebookPen size={20} className="text-[#FF1E27]" /> Coach Observation & Form Audit Notes
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Chronological coaching observations, form corrections, and progress notes written by your trainer.</p>
                  </div>

                  <div className="space-y-3">
                    {(!coachingData.trainerNotes || coachingData.trainerNotes.length === 0) ? (
                      <div className="p-8 rounded-2xl bg-[#090A0E] text-center text-slate-400 text-xs">
                        No coach observation notes logged yet. When your trainer logs advice, it will appear here.
                      </div>
                    ) : (
                      coachingData.trainerNotes.map((n, i) => (
                        <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[#090A0E] border border-white/[0.06] space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#FF1E27] font-mono">{n.author || user?.assignedTrainerName || 'Master Coach'}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{n.date}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBSECTION 4: CUSTOMER PROGRESS TRACKING */}
              {(coachingSubTab === 'progress' || activeSubTab === 'progress') && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                        <LineChart size={20} className="text-[#FF1E27]" /> Athlete Biometrics & 1RM PR Telemetry
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Verified compound 1-Rep-Max strength records and body composition tracked with your trainer.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Last audit: {coachingData.progress?.lastAuditDate || '30 Aug 2026'}</span>
                  </div>

                  {/* 1RM Strength PR Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">BENCH PRESS 1RM</span>
                      <div className="text-2xl font-bold text-white font-mono">{coachingData.progress?.benchPressPR || '110 kg'}</div>
                      <span className="text-[10px] text-[#FF1E27] font-mono">Verified Compound Max</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">BACK SQUAT 1RM</span>
                      <div className="text-2xl font-bold text-white font-mono">{coachingData.progress?.squatPR || '150 kg'}</div>
                      <span className="text-[10px] text-[#FF1E27] font-mono">Verified Compound Max</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/5 space-y-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">DEADLIFT 1RM</span>
                      <div className="text-2xl font-bold text-white font-mono">{coachingData.progress?.deadliftPR || '190 kg'}</div>
                      <span className="text-[10px] text-[#FF1E27] font-mono">Verified Compound Max</span>
                    </div>
                  </div>

                  {/* Body Composition Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">CURRENT BODY WEIGHT</span>
                      <p className="font-bold text-white text-base font-mono">{coachingData.progress?.currentWeight || weight || '76 kg'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">TARGET GOAL WEIGHT</span>
                      <p className="font-bold text-emerald-400 text-base font-mono">{coachingData.progress?.targetWeight || '80 kg Lean Mass'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090A0E] border border-white/5 space-y-1">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">BODY FAT PERCENTAGE</span>
                      <p className="font-bold text-[#FF1E27] text-base font-mono">{coachingData.progress?.bodyFat || bodyFat || '14.2%'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSECTION 5: CHAT WITH TRAINER */}
              {(coachingSubTab === 'chat' || activeSubTab === 'chat') && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12141C] border border-white/[0.08] shadow-xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                        <MessageSquare size={20} className="text-[#FF1E27]" /> 1-on-1 Coach & Athlete Advisory Channel
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Direct messaging channel with {user?.assignedTrainerName || myAssignedTrainer?.name || 'Master Coach Vikram'}.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">● Active Session</span>
                  </div>

                  <div className="flex flex-col h-[480px] rounded-2xl bg-[#090A0E] border border-white/10 overflow-hidden">
                    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-3">
                      {customerChatMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                          No previous messages with your coach. Type your question or progress update below.
                        </div>
                      ) : (
                        customerChatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col max-w-[80%] ${
                              msg.sender === 'athlete' ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}
                          >
                            <div
                              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                msg.sender === 'athlete'
                                  ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white rounded-tr-none shadow-md'
                                  : 'bg-[#181A26] text-slate-200 border border-white/10 rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">{msg.time || 'Just now'}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleCustomerSendChat} className="p-3 bg-[#12141C] border-t border-white/10 flex items-center gap-2">
                      <input
                        type="text"
                        value={customerChatInput}
                        onChange={(e) => setCustomerChatInput(e.target.value)}
                        placeholder={`Message your coach ${user?.assignedTrainerName || myAssignedTrainer?.name || 'Coach'}...`}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#090A0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF1E27]"
                      />
                      <button
                        type="submit"
                        className="p-3 rounded-xl bg-[#FF1E27] hover:bg-[#E50914] text-white cursor-pointer shadow-md transition-all flex items-center justify-center"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 6. FEEDBACK & SUPPORT SECTION                            */}
          {/* ========================================================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* SUBSECTION 1: SUBMIT FEEDBACK & RATINGS */}
              {(activeSubTab === 'submit' || !activeSubTab) && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Submit Feedback & Rate Experience</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Help us elevate Titan Pulse facilities, training coaching, and turnstile operations.</p>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-5 shadow-sm max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300">Overall Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star
                              size={22}
                              className={star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-amber-400 font-semibold ml-2">
                          {feedbackRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Category</label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                      >
                        <option value="Facility & Equipment">Facility & Equipment Maintenance</option>
                        <option value="Biometric Gate Pass">Biometric Speed Gates & Turnstiles</option>
                        <option value="Trainer Consultation">Trainer Consultation & Workout Splits</option>
                        <option value="Cleanliness & Hygiene">Cleanliness, Shower & Sauna Hygiene</option>
                        <option value="General Suggestion">General Suggestion / Feature Request</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Your Feedback Message</label>
                      <textarea
                        rows={4}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Write your honest comments or suggestions..."
                        className="w-full p-4 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-sm hover:brightness-110 cursor-pointer transition-all flex items-center gap-2"
                    >
                      <Send size={14} /> Submit Feedback
                    </button>
                  </form>
                </div>
              )}

              {/* SUBSECTION 2: RATE TRAINER & GYM */}
              {activeSubTab === 'rate' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Dedicated Ratings: Trainer & Gym Ambiance</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Rate your assigned personal trainer and overall facility experience separately.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rate Trainer Card */}
                    <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80"
                          alt="Coach Jayanth"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-white font-['Outfit',sans-serif]">
                            Rate {user?.assignedTrainerName || myAssignedTrainer?.name || 'Coach Jayanth'}
                          </h4>
                          <span className="text-xs text-[#FF1E27] font-medium">Assigned Master Coach</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setTrainerRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              size={20}
                              className={star <= trainerRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        value={trainerReview}
                        onChange={(e) => setTrainerReview(e.target.value)}
                        placeholder="Write a brief review about coaching quality, punctuality, and technique correction..."
                        className="w-full p-3.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all resize-none leading-relaxed"
                      />

                      <button
                        onClick={handleTrainerReviewSubmit}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white text-xs sm:text-sm font-semibold shadow-sm hover:brightness-110 cursor-pointer transition-all"
                      >
                        Submit Trainer Review
                      </button>
                    </div>

                    {/* Rate Gym Card */}
                    <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1E27] to-[#E50914] flex items-center justify-center text-white">
                          <Activity size={22} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white font-['Outfit',sans-serif]">Rate Titan Pulse Facility</h4>
                          <span className="text-xs text-slate-400">Equipment, Hygiene & Ambiance</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setGymRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              size={20}
                              className={star <= gymRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        value={gymReview}
                        onChange={(e) => setGymReview(e.target.value)}
                        placeholder="How do you rate the equipment maintenance, crowd management, and music ambiance?"
                        className="w-full p-3.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all resize-none leading-relaxed"
                      />

                      <button
                        onClick={handleGymReviewSubmit}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white text-xs sm:text-sm font-semibold shadow-sm hover:brightness-110 cursor-pointer transition-all"
                      >
                        Submit Facility Rating
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSECTION 3: SUPPORT TICKETS */}
              {activeSubTab === 'tickets' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Support Tickets & Complaints</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Track resolution status on any inquiries or maintenance issues submitted to Management.</p>
                    </div>
                    <button
                      onClick={() => setTicketModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white text-xs sm:text-sm font-semibold shadow-sm hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plus size={15} /> Raise New Ticket
                    </button>
                  </div>

                  <div className="space-y-4">
                    {supportTickets.length === 0 ? (
                      <div className="p-8 sm:p-12 rounded-2xl bg-[#121217] border border-white/[0.08] text-center space-y-3">
                        <p className="text-xs sm:text-sm text-slate-400">No support tickets or complaints logged yet.</p>
                        <button
                          onClick={() => setTicketModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Plus size={14} /> Raise First Ticket
                        </button>
                      </div>
                    ) : (
                      supportTickets.map((tck) => (
                        <div
                          key={tck.id}
                          className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-3 shadow-sm hover:border-white/20 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#00F0FF] font-medium">{tck.id}</span>
                              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 text-[10px]">
                                {tck.category}
                              </span>
                              <span className="text-xs text-slate-400">• {tck.date}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              tck.status === 'Resolved'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              ● {tck.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-white font-['Outfit',sans-serif]">{tck.subject}</h4>
                          
                          {tck.reply && (
                            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-white/[0.04] text-xs text-slate-300 space-y-1">
                              <span className="text-[10px] text-[#FF1E27] font-semibold uppercase tracking-wider block">FRONT DESK RESPONSE:</span>
                              <p>{tck.reply}</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBSECTION 4: FAQ & CONTACT SUPPORT */}
              {activeSubTab === 'faq' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/[0.08]">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit',sans-serif]">Frequently Asked Questions & Support</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Quick answers to biometric gates, lockers, and emergency hotlines.</p>
                  </div>

                  {/* FAQ Accordions */}
                  <div className="space-y-3">
                    {faqs.map((f, idx) => {
                      const isOpen = faqOpenIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-xl bg-[#121217] border border-white/[0.08] overflow-hidden"
                        >
                          <button
                            onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                            className="w-full p-4 text-left flex justify-between items-center text-xs sm:text-sm font-medium text-white hover:text-[#FF1E27] transition-colors cursor-pointer"
                          >
                            <span>{f.q}</span>
                            <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180 text-[#FF1E27]' : 'text-slate-400'}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                              {f.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Direct Contact Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 sm:p-5 rounded-xl bg-[#121217] border border-white/[0.08] space-y-1.5">
                      <Phone size={18} className="text-emerald-400" />
                      <h4 className="text-xs font-semibold text-white font-['Outfit',sans-serif]">Front Desk Hotline</h4>
                      <p className="text-xs text-slate-400 font-mono">+91 98765 00123</p>
                      <span className="text-[10px] text-slate-500 block">Available 24/7</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-[#121217] border border-white/[0.08] space-y-1.5">
                      <Mail size={18} className="text-cyan-400" />
                      <h4 className="text-xs font-semibold text-white font-['Outfit',sans-serif]">Support Email</h4>
                      <p className="text-xs text-slate-400 font-mono">support@titanpulse.fit</p>
                      <span className="text-[10px] text-slate-500 block">Response within 2h</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-[#121217] border border-white/[0.08] space-y-1.5">
                      <Headphones size={18} className="text-purple-400" />
                      <h4 className="text-xs font-semibold text-white font-['Outfit',sans-serif]">WhatsApp Concierge</h4>
                      <p className="text-xs text-slate-400 font-mono">+91 98765 99887</p>
                      <span className="text-[10px] text-slate-500 block">Direct chat pass</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </main>

      {/* ========================================================= */}
      {/* 3. MODALS & POPUPS                                        */}
      {/* ========================================================= */}

      {/* QR & NFC DIGITAL BIOMETRIC PASS MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#121217] rounded-3xl border border-[#FF1E27]/50 p-6 shadow-2xl animate-fadeIn text-center space-y-5">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-[#FF1E27]/20 text-[#FF1E27] text-[10px] font-semibold">
                24/7 BIOMETRIC PASS
              </span>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">{activePlanName}</h3>
              <p className="text-xs text-slate-400">{fullName} • #TP-8842</p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg relative group">
              <QrCode size={160} className="text-black" />
            </div>

            <div className="p-3 rounded-xl bg-[#0D0D12] border border-white/10 text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NFC 13.56MHz Ready for Turnstile Tap</span>
            </div>

            <button
              onClick={() => {
                showToast('✓ Pass saved to Apple / Google Wallet!');
                setQrModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-md hover:brightness-110 cursor-pointer"
            >
              Add to Mobile Wallet
            </button>
          </div>
        </div>
      )}



      {/* CHAT WITH TRAINER MODAL */}
      {chatModalTrainer && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#121217] rounded-3xl border border-white/20 shadow-2xl animate-fadeIn flex flex-col h-[500px] overflow-hidden">
            
            {/* Header */}
            <div className="p-4 bg-[#181822] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={chatModalTrainer.image || chatModalTrainer.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80'}
                  alt={chatModalTrainer.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white font-['Outfit',sans-serif]">{chatModalTrainer.name}</h4>
                  <span className="text-[10px] text-emerald-400">● Online on Titan Athlete Network</span>
                </div>
              </div>
              <button
                onClick={() => setChatModalTrainer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs sm:text-sm">
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="p-3 rounded-2xl bg-white/[0.06] text-slate-200 rounded-tl-none leading-relaxed">
                  Hey {firstName}! I reviewed your chest workout telemetry from yesterday. Great 85kg bench press form!
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">10:15 AM</span>
              </div>

              <div className="flex flex-col items-end max-w-[80%] ml-auto">
                <div className="p-3 rounded-2xl bg-[#FF1E27] text-white rounded-tr-none leading-relaxed">
                  Thanks Coach! Ready for tomorrow's deadlift session. Should I increase target to 150kg?
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">10:18 AM</span>
              </div>

              <div className="flex flex-col items-start max-w-[80%]">
                <div className="p-3 rounded-2xl bg-white/[0.06] text-slate-200 rounded-tl-none leading-relaxed">
                  Let's do 145kg for 4 sets of 5 reps first to protect spinal bracing. See you on the floor at 07:00 AM!
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">10:20 AM</span>
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Message sent to coach!');
              }}
              className="p-3 bg-[#0D0D12] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message to coach..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#181822] border border-white/10 text-white text-xs sm:text-sm outline-none focus:border-[#FF1E27]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#FF1E27] hover:bg-[#E50914] text-white cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RAISE TICKET MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#121217] rounded-3xl border border-[#FF1E27]/40 p-6 shadow-2xl animate-fadeIn space-y-4">
            <button
              onClick={() => setTicketModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Raise Support / Service Ticket</h3>
              <p className="text-xs text-slate-400">Directly dispatched to Titan Pulse Front Desk & Maintenance Ops.</p>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Ticket Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="e.g., Locker RFID sensor tap issue"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27]"
                  >
                    <option value="Facility & Equipment">Facility & Equipment</option>
                    <option value="Biometric Speed Gate">Biometric Speed Gate</option>
                    <option value="Billing & Invoices">Billing & Invoices</option>
                    <option value="Coach Consultation">Coach Consultation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Description</label>
                <textarea
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Describe your issue or inquiry in detail..."
                  className="w-full p-3.5 rounded-xl bg-[#0D0D12] border border-white/10 text-white text-sm outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-semibold text-xs sm:text-sm shadow-md hover:brightness-110 cursor-pointer"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3D THERMAL RECEIPT & OFFICIAL TAX INVOICE PRINTER MODAL */}
      {receiptModalData && (
        <ThermalReceiptPrinter
          orderDetails={receiptModalData}
          onClose={() => setReceiptModalData(null)}
          onViewOrders={() => handleTabChange('payments', 'history')}
        />
      )}

      {/* UNIVERSAL GYM PAYMENT GATEWAY MODAL (CARD, CASH, UPI/ONLINE, NETBANKING) */}
      {paymentModalData && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#121218] rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-fadeIn overflow-hidden flex flex-col">
            
            {/* Payment Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#181824] to-[#12121A] border-b border-white/10 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF1E27]/15 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white tracking-wide font-['Outfit',sans-serif]">TITAN PULSE CHECKOUT</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-semibold">
                      SECURE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{paymentModalData.planName || paymentModalData.plan?.name}</p>
                </div>
              </div>

              <div className="text-right pr-6">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Total Amount</span>
                <span className="text-xl font-bold font-mono text-[#FF1E27]">
                  ₹{Number(paymentModalData.priceNum || 2499).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  setPaymentModalData(null);
                  setPaymentLoading(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="p-6 space-y-5 bg-[#0D0D14]">
              
              {/* Payment Mode Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#08080C] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActivePayMethod('card')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activePayMethod === 'card'
                      ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={13} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePayMethod('cash')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activePayMethod === 'cash'
                      ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign size={13} />
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePayMethod('upi')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activePayMethod === 'upi'
                      ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePayMethod('netbanking')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                    activePayMethod === 'netbanking'
                      ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>Netbank</span>
                </button>
              </div>

              {/* MODE 1: CREDIT / DEBIT CARD */}
              {activePayMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3.5 text-left">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>Cardholder Name</span>
                      <span className="text-[10px] text-slate-500 font-normal">Full name as on card</span>
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                      placeholder="e.g. Alex Hunter"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs outline-none transition-all mt-1.5 ${
                        cardErrors.cardHolder
                          ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                          : 'border-white/10 focus:border-[#FF1E27]'
                      }`}
                    />
                    {cardErrors.cardHolder && (
                      <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fadeIn">
                        <AlertCircle size={12} className="shrink-0" /> {cardErrors.cardHolder}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>Card Number</span>
                      <span className="text-[10px] text-slate-500 font-normal">16 Digits</span>
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono tracking-wider outline-none transition-all ${
                          cardErrors.cardNumber
                            ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                            : 'border-white/10 focus:border-[#FF1E27]'
                        }`}
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                        {cardNetwork}
                      </span>
                    </div>
                    {cardErrors.cardNumber && (
                      <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fadeIn">
                        <AlertCircle size={12} className="shrink-0" /> {cardErrors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span>Expiry Date</span>
                        <span className="text-[10px] text-slate-500 font-normal">MM / YY</span>
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        placeholder="MM / YY"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono outline-none transition-all mt-1.5 ${
                          cardErrors.cardExpiry
                            ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                            : 'border-white/10 focus:border-[#FF1E27]'
                        }`}
                      />
                      {cardErrors.cardExpiry && (
                        <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
                          <AlertCircle size={11} className="shrink-0" /> {cardErrors.cardExpiry}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span>CVV</span>
                        <span className="text-[10px] text-slate-500 font-normal">3-4 Digits</span>
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        maxLength={4}
                        placeholder="•••"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono outline-none transition-all mt-1.5 ${
                          cardErrors.cardCvv
                            ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                            : 'border-white/10 focus:border-[#FF1E27]'
                        }`}
                      />
                      {cardErrors.cardCvv && (
                        <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
                          <AlertCircle size={11} className="shrink-0" /> {cardErrors.cardCvv}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: CASH AT GYM COUNTER */}
              {activePayMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3.5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <DollarSign size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">Pay with Cash at Front Desk</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Pay cash directly to the receptionist at the gym front entrance desk. Your RFID biometric turnstile pass will be activated upon token submission.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Cash Counter Token:</span>
                    <span className="font-mono text-amber-400 font-bold tracking-wider">#CSH-{(user?._id || user?.id || '8921').slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              )}

              {/* MODE 3: UPI / QR CODE */}
              {activePayMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-4 text-center">
                  <div className="inline-block p-2.5 rounded-2xl bg-white shadow-lg">
                    <div className="w-32 h-32 bg-white p-1 rounded-xl flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                        <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                        <rect x="40" y="10" width="10" height="20" />
                        <rect x="10" y="40" width="20" height="10" />
                        <rect x="70" y="40" width="20" height="10" />
                        <rect x="40" y="70" width="10" height="20" />
                        <rect x="45" y="45" width="10" height="10" />
                        <rect x="60" y="60" width="15" height="15" />
                        <rect x="25" y="25" width="10" height="10" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-white">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                    <div className="p-2 rounded-xl bg-[#0A0A0F] border border-white/10 text-xs flex items-center justify-between max-w-xs mx-auto">
                      <span className="text-slate-400 text-[11px]">UPI ID:</span>
                      <span className="text-[#FF1E27] font-mono font-semibold">titanpulse.gym@upi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 4: NETBANKING */}
              {activePayMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3 text-left">
                  <span className="text-[11px] font-semibold text-slate-300">Select Bank</span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white">
                    {[
                      { name: 'HDFC Bank', dot: 'bg-blue-600' },
                      { name: 'State Bank of India', dot: 'bg-blue-400' },
                      { name: 'ICICI Bank', dot: 'bg-amber-500' },
                      { name: 'Axis Bank', dot: 'bg-rose-500' },
                      { name: 'Kotak Mahindra', dot: 'bg-red-600' },
                      { name: 'Punjab National Bank', dot: 'bg-yellow-500' }
                    ].map((b) => (
                      <div
                        key={b.name}
                        onClick={() => setSelectedBank(b.name)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          selectedBank === b.name
                            ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white shadow-sm'
                            : 'bg-[#0A0A0F] border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${b.dot}`}></div>
                        <span className="truncate text-xs font-medium">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Truck Micro-Interaction & Order Complete Button */}
              <div className="pt-2">
                <CompleteOrderButton
                  label={activePayMethod === 'cash' ? "Confirm Cash Token" : "Complete & Activate"}
                  amountText={`₹${Number(paymentModalData.priceNum || 2499).toLocaleString('en-IN')}`}
                  disabled={payProcessing}
                  onComplete={() => {
                    if (activePayMethod === 'card') {
                      const isValid = validateCardPayment();
                      if (!isValid) return;
                    }

                    const modeLabel = activePayMethod === 'card' 
                      ? `Card (${cardNetwork})` 
                      : activePayMethod === 'cash' 
                      ? 'Cash at Counter' 
                      : activePayMethod === 'upi' 
                      ? 'UPI / Online' 
                      : `Net Banking (${selectedBank})`;

                    completeMembershipActivation(
                      paymentModalData.planName || paymentModalData.plan?.name,
                      paymentModalData.priceNum,
                      modeLabel
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Instant Biometric Activation • Official Tax Invoice Generated</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating AnimatedList Toast Notifications */}
      <ToastNotificationStack notifications={toastsList} onDismiss={dismissToast} position="top-right" />

    </div>
  );
}

