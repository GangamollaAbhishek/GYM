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
  Droplets
} from 'lucide-react';
import GooeySearch from './GooeySearch';
import AddUserModal from './AddUserModal';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';

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

  // Fetch Users & Genuine Customers Live from MongoDB Database
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('http://localhost:5050/api/users');
      const data = await res.json();
      if (res.ok && data?.data) {
        const formatted = data.data.map((u, idx) => ({
          ...u,
          displayId: u.displayId || `USR-${101 + idx}`
        }));
        setUsersList(formatted);

        // Derive Customer Management list purely from genuine registered MongoDB customers/members
        const genuineCustomers = formatted
          .filter(u => u.role === 'customer' || u.role === 'member')
          .map((u, idx) => ({
            id: `CUST-${101 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== 'N/A' ? u.phone : 'N/A',
            plan: 'Titan Elite All-Access',
            expiry: '2027-01-01',
            status: u.status || 'Active'
          }));
        setCustomersList(genuineCustomers);
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

  // Genuine Customers list (loaded live from MongoDB database)
  const [customersList, setCustomersList] = useState([]);

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
      try {
        const res = await fetch('http://localhost:5050/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formInputs.name,
            email: formInputs.email,
            phone: formInputs.phone || '',
            role: 'customer',
            password: 'Customer@123'
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`Customer "${formInputs.name}" registered in database!`);
          fetchUsers();
        } else {
          showToast(data.message || 'Error registering customer');
        }
      } catch (err) {
        showToast('Error connecting to database');
      }
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

  // ==========================================
  // PUBLIC PAGES DYNAMIC CMS STATE & CONTROLS
  // ==========================================
  const { cmsData, updateFullCMS, resetToDefaults } = useLandingPageCMS();
  const [editorData, setEditorData] = useState(cmsData);
  const [cmsActiveTab, setCmsActiveTab] = useState('hero');

  useEffect(() => {
    if (cmsData) {
      setEditorData(cmsData);
    }
  }, [cmsData]);

  const handleSaveCMS = () => {
    updateFullCMS(editorData);
    showToast('✨ Public Landing Page published live!');
  };

  const handleResetCMS = () => {
    if (window.confirm('Reset all public landing page values to original defaults?')) {
      resetToDefaults();
      showToast('🔄 Public page restored to defaults.');
    }
  };

  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleImageUploadToCloudinary = async (e, productIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setUploadingIndex(productIndex);
    showToast('☁️ Uploading photo to Cloudinary CDN...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('http://localhost:5050/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64data,
              folder: 'titan_supplements'
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            const newProds = [...editorData.supplements.products];
            newProds[productIndex].image = data.url;
            const updated = {
              ...editorData,
              supplements: { ...editorData.supplements, products: newProds }
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(`✅ Photo for Product #${productIndex + 1} saved to Cloudinary & published live!`);
          } else {
            showToast(data.message || 'Failed to upload photo to Cloudinary.');
          }
        } catch (err) {
          showToast('Error connecting to upload server.');
        } finally {
          setUploadingIndex(null);
        }
      };
    } catch (err) {
      showToast('Error reading image file.');
      setUploadingIndex(null);
    }
  };

  // Cloudinary Upload for Bento Programs Grid
  const [uploadingProgramIndex, setUploadingProgramIndex] = useState(null);

  const handleProgramImageUploadToCloudinary = async (e, cardIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setUploadingProgramIndex(cardIndex);
    showToast('☁️ Uploading program photo to Cloudinary CDN...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('http://localhost:5050/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64data,
              folder: 'titan_programs'
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            const newCards = [...editorData.exploreEscape.cards];
            newCards[cardIndex].image = data.url;
            const updated = {
              ...editorData,
              exploreEscape: { ...editorData.exploreEscape, cards: newCards }
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast(`✅ Photo for Program Card #${cardIndex + 1} saved to Cloudinary & published live!`);
          } else {
            showToast(data.message || 'Failed to upload photo to Cloudinary.');
          }
        } catch (err) {
          showToast('Error connecting to upload server.');
        } finally {
          setUploadingProgramIndex(null);
        }
      };
    } catch (err) {
      showToast('Error reading image file.');
      setUploadingProgramIndex(null);
    }
  };

  // Cloudinary Upload for Global Brand Logo
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUploadToCloudinary = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setUploadingLogo(true);
    showToast('☁️ Uploading Brand Logo to Cloudinary CDN...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('http://localhost:5050/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64data,
              folder: 'titan_brand_logo'
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            const updated = {
              ...editorData,
              brand: {
                ...editorData.brand,
                logo: data.url
              }
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast('✅ Brand Logo saved to Cloudinary & published live across website!');
          } else {
            showToast(data.message || 'Failed to upload logo to Cloudinary.');
          }
        } catch (err) {
          showToast('Error connecting to upload server.');
        } finally {
          setUploadingLogo(false);
        }
      };
    } catch (err) {
      showToast('Error reading image file.');
      setUploadingLogo(false);
    }
  };

  // Cloudinary Upload for 3D Smart Equipment Steps
  const [uploadingEquipmentIndex, setUploadingEquipmentIndex] = useState(null);

  const handleEquipmentImageUploadToCloudinary = async (e, stepIndex) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setUploadingEquipmentIndex(stepIndex);
    showToast('☁️ Uploading equipment step photo to Cloudinary CDN...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('http://localhost:5050/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64data,
              folder: 'titan_equipment'
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            const newSteps = [...editorData.equipment.steps];
            newSteps[stepIndex].image = data.url;
            const updated = {
              ...editorData,
              equipment: {
                ...editorData.equipment,
                steps: newSteps
              }
            };
            setEditorData(updated);
            updateFullCMS(updated);
            showToast('✅ Equipment photo uploaded to Cloudinary & published live!');
          } else {
            showToast(data.message || 'Failed to upload photo to Cloudinary.');
          }
        } catch (err) {
          showToast('Error connecting to upload server.');
        } finally {
          setUploadingEquipmentIndex(null);
        }
      };
    } catch (err) {
      showToast('Error reading image file.');
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
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1000&auto=format&fit=crop",
      description: "Advanced clinical performance matrix designed for sustained muscular stamina, cellular hydration, and elite athletic output.",
      flavors: ["Crimson Heat", "Atomic Punch", "Blue Frost"],
      specs: ["350mg Formula", "Clinical Grade", "Zero Sugar", "Maximum Purity"]
    };

    const newProds = [...currentProducts, newProduct];
    const updated = {
      ...editorData,
      supplements: {
        ...editorData.supplements,
        products: newProds
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added New Supplement Card #${newIndex}!`);
  };

  // Remove Dynamic Supplement Product Card
  const handleRemoveSupplement = (idxToRemove) => {
    const currentProducts = editorData?.supplements?.products || [];
    if (currentProducts.length <= 1) {
      showToast('⚠️ Keep at least 1 supplement product.');
      return;
    }
    const newProds = currentProducts.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      supplements: {
        ...editorData.supplements,
        products: newProds
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast('🗑️ Supplement card removed.');
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
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      variant: "overlay",
      toast: "New custom athletic program selected!",
      accent: "#FF2E4C"
    };

    const newCards = [...currentCards, newCard];
    const updated = {
      ...editorData,
      exploreEscape: {
        ...editorData.exploreEscape,
        cards: newCards
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added New Bento Program Card #${newIndex}!`);
  };

  // Remove Dynamic Bento Program Card
  const handleRemoveProgram = (idxToRemove) => {
    const currentCards = editorData?.exploreEscape?.cards || [];
    if (currentCards.length <= 1) {
      showToast('⚠️ Keep at least 1 program card.');
      return;
    }
    const newCards = currentCards.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      exploreEscape: {
        ...editorData.exploreEscape,
        cards: newCards
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast('🗑️ Bento Program card removed.');
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
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
    };

    const newSteps = [...currentSteps, newStep];
    const updated = {
      ...editorData,
      equipment: {
        ...editorData.equipment,
        steps: newSteps
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast(`✨ Added Equipment Step ${stepNumStr}!`);
  };

  // Remove Dynamic 3D Equipment Step
  const handleRemoveEquipmentStep = (idxToRemove) => {
    const currentSteps = editorData?.equipment?.steps || [];
    if (currentSteps.length <= 1) {
      showToast('⚠️ Keep at least 1 equipment step.');
      return;
    }
    const newSteps = currentSteps.filter((_, idx) => idx !== idxToRemove);
    const updated = {
      ...editorData,
      equipment: {
        ...editorData.equipment,
        steps: newSteps
      }
    };
    setEditorData(updated);
    updateFullCMS(updated);
    showToast('🗑️ Equipment step removed.');
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'public-pages', label: 'Public Pages (CMS)', icon: Globe },
    { id: 'user-mgmt', label: 'User Management', icon: Users },
    { id: 'customer-mgmt', label: 'Customer Management', icon: UserCheck },
    { id: 'trainer-mgmt', label: 'Trainer Management', icon: Dumbbell },
    { id: 'receptionist-mgmt', label: 'Receptionist Mgmt', icon: UserCog },
    { id: 'membership-mgmt', label: 'Membership Mgmt', icon: ShieldCheck },
    { id: 'payment-billing', label: 'Payment & Billing', icon: CreditCard },
    { id: 'attendance-monitoring', label: 'Attendance Monitor', icon: CalendarCheck },
    { id: 'reports-analytics', label: 'Statistics & Reports', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'enquiry-management', label: 'Enquiry Management', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-portal-wrapper h-screen w-screen overflow-hidden bg-[#0A0A0D] text-white flex selection:bg-[#FF1E27] selection:text-white font-sans">

      {/* 1. DARK SLEEK SIDEBAR MATCHING SCREENSHOT THEME */}
      <aside
        data-lenis-prevent="true"
        className={`${sidebarOpen ? 'w-64 sm:w-72' : 'w-20'} bg-[#121217] border-r border-[#202028] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 h-screen overflow-hidden no-scrollbar shadow-2xl`}
      >

        <div>
          {/* Brand Logo Header: Dynamic Gym Brand Logo */}
          <div className="h-24 px-5 flex items-center justify-between border-b border-[#202028]">
            <div onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 cursor-pointer group min-w-0">
              {(editorData?.brand?.logo || cmsData?.brand?.logo) ? (
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
                    {editorData?.brand?.name || cmsData?.brand?.name || 'TITAN•PULSE'}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8E98] font-mono leading-tight truncate">
                    {editorData?.brand?.subname || cmsData?.brand?.subname || '3D FITNESS SYSTEM'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gym Brand Admin Command Badge (Replaces generic stock photo) */}
          {sidebarOpen && (
            <div className="px-5 py-3.5 flex items-center gap-3 border-b border-[#1E1E26] bg-[#0E0E12]/80">
              <div className="relative shrink-0">
                {(editorData?.brand?.logo || cmsData?.brand?.logo) ? (
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
                  {editorData?.brand?.name || 'TITAN•PULSE'} Portal
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
                    if (item.id === 'user-mgmt') fetchUsers();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-white font-bold bg-gradient-to-r from-[#FF1E27]/25 via-[#FF1E27]/5 to-transparent border-l-4 border-[#FF1E27] pl-3'
                      : 'text-[#8E8E98] hover:text-white hover:bg-white/[0.03]'
                  }`}
                  title={item.label}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-[#FF1E27] drop-shadow-[0_0_8px_rgba(255,30,39,0.7)]' : 'text-[#8E8E98]'}
                  />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: "Go Premium" Card & Log Out */}
        <div className="p-4 border-t border-[#202028] bg-[#0C0C10] space-y-3">
          {sidebarOpen && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#24171A] to-[#141419] border border-[#FF1E27]/30 shadow-lg relative overflow-hidden group">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-amber-400 text-sm">👑</span>
                <span className="text-xs font-bold text-white tracking-tight">Go Premium</span>
              </div>
              <p className="text-[10px] text-[#8E8E98] leading-tight mb-2">
                Unlock full biometric & 3D telemetry tools.
              </p>
              <button
                onClick={() => showToast('⭐ Premium Admin Tier is active.')}
                className="w-full py-1.5 rounded-xl bg-[#FF1E27] hover:brightness-110 text-white font-bold text-[10px] uppercase tracking-wider shadow-[0_0_12px_rgba(255,30,39,0.5)] transition-all cursor-pointer"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Log Out Link */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/');
            }}
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-1.5' : 'justify-center py-2'} text-xs text-[#8E8E98] hover:text-[#FF1E27] transition-colors cursor-pointer font-medium`}
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
              {activeTab === 'dashboard' ? 'Dashboard' : navMenuItems.find(m => m.id === activeTab)?.label || 'Admin Portal'}
            </h1>
          </div>

          {/* Right Header Controls: "Today ⌄", Search, Bell */}
          <div className="flex items-center gap-3">
            {/* Period Dropdown Button */}
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/5 text-xs text-slate-200 font-medium cursor-pointer hover:border-white/15 transition-all">
              <span>Today</span>
              <span className="text-[#8E8E98] text-[10px]">▼</span>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="w-9 h-9 rounded-xl bg-[#181820] border border-white/5 text-slate-300 hover:text-white flex items-center justify-center relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF1E27] rounded-full shadow-[0_0_6px_#FF1E27]" />
            </button>
          </div>
        </header>

        {/* Search & Secondary Filter Bar */}
        <div className="px-6 sm:px-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <GooeySearch
            placeholder="Search telemetry, athletes, modules..."
            buttonLabel="Search"
            items={[
              { label: "Public Pages (CMS)", tab: "public-pages" },
              { label: "User Management (MongoDB Sync)", tab: "user-mgmt" },
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
            bgTheme="#121217"
            textColor="#FFFFFF"
            accentColor="#FF1E27"
          />

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setModalType('customer'); setShowAddModal(true); }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF1E27] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,30,39,0.4)] transition-all cursor-pointer"
            >
              <UserPlus size={14} /> + Customer
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 hover:border-[#FF1E27] transition-all cursor-pointer"
            >
              <Plus size={14} /> Add User
            </button>
          </div>
        </div>

        {/* Dynamic Main Body Content based on Active Tab */}
        <div className="p-4 sm:p-8 space-y-6 flex-1 bg-[#0A0A0D]">

          {/* TAB 1: OVERVIEW DASHBOARD MATCHING REFERENCE SCREENSHOT */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">

              {/* TOP ROW: 3 METRIC CARDS (Heart Rate, Energy Burn, Running) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Heart Rate Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">❤️</span>
                      <span className="text-xs font-bold text-white tracking-tight">Heart Rate</span>
                    </div>
                    <button className="text-[#8E8E98] hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">85</span>
                    <span className="text-xs text-[#8E8E98] font-semibold uppercase">BPM</span>
                  </div>
                </div>

                {/* 2. Energy Burn Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">🔥</span>
                      <span className="text-xs font-bold text-white tracking-tight">Energy Burn</span>
                    </div>
                    <button className="text-[#8E8E98] hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">430</span>
                    <span className="text-xs text-[#8E8E98] font-semibold">Kcal</span>
                  </div>
                </div>

                {/* 3. Running Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">🏃</span>
                      <span className="text-xs font-bold text-white tracking-tight">Running</span>
                    </div>
                    <button className="text-[#8E8E98] hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">10</span>
                    <span className="text-xs text-[#8E8E98] font-semibold">min</span>
                  </div>
                </div>

              </div>

              {/* MAIN 2-COLUMN GRID (Activity Reports + Goals & Meal Stats) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ============================================================== */}
                {/* LEFT COLUMN: ACTIVITY REPORTS + TODAY'S EXERCISES CHALLENGES */}
                {/* ============================================================== */}
                <div className="lg:col-span-8 space-y-6">

                  {/* Card A: Activity Reports with Glowing Spline Curve */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">Activity Reports</h3>
                      <div className="flex items-center gap-3">
                        <button className="px-3.5 py-1.5 rounded-xl bg-[#FF1E27] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,30,39,0.5)] transition-all cursor-pointer">
                          <span>Monthly</span>
                          <span className="text-[10px]">▼</span>
                        </button>
                        <button className="text-[#8E8E98] hover:text-white transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    {/* SVG Spline Wave Chart */}
                    <div className="relative w-full h-56 pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" fill="none">
                        <defs>
                          {/* Crimson Neon Line Glow Filter */}
                          <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF1E27" floodOpacity="0.8" />
                          </filter>
                          {/* Linear Gradient under Area */}
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF1E27" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#FF1E27" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Horizontal & Vertical Lines */}
                        {[30, 70, 110, 150, 190].map((y, i) => (
                          <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="#22222E" strokeWidth="1" strokeDasharray="3 3" />
                        ))}
                        {[50, 110, 170, 230, 290, 350, 410, 470, 530, 590].map((x, i) => (
                          <line key={i} x1={x} y1="0" x2={x} y2="190" stroke="#1C1C24" strokeWidth="1" />
                        ))}

                        {/* Area Fill */}
                        <path
                          d="M 0,160 Q 60,150 110,165 T 210,160 T 270,70 T 330,170 T 410,40 T 470,170 T 540,165 T 600,160 L 600,190 L 0,190 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Glowing Red Spline Curve Line */}
                        <path
                          d="M 0,160 Q 60,150 110,165 T 210,160 T 270,70 T 330,170 T 410,40 T 470,170 T 540,165 T 600,160"
                          stroke="#FF1E27"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#crimsonGlow)"
                        />

                        {/* Peak Node Point 1 (May: x=270, y=70) */}
                        <circle cx="270" cy="70" r="5.5" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="3" />
                        <line x1="270" y1="70" x2="270" y2="190" stroke="#FF1E27" strokeWidth="1.5" strokeDasharray="2 2" />

                        {/* Tooltip Badge at Peak */}
                        <g transform="translate(235, 18)">
                          <rect width="70" height="34" rx="8" fill="#121217" stroke="#2A2A38" strokeWidth="1" />
                          <text x="35" y="14" fill="#8E8E98" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">Steps</text>
                          <text x="35" y="27" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">9,346</text>
                        </g>

                        {/* Secondary Peak Node (Aug: x=410, y=40) */}
                        <circle cx="410" cy="40" r="5" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="2.5" />
                      </svg>

                      {/* X-Axis Month Labels */}
                      <div className="flex justify-between text-[11px] text-[#8E8E98] font-medium pt-2 px-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => (
                          <span key={m} className={m === 'May' ? 'text-white font-bold' : ''}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card B: Today's Exercises Challenges */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">Today's Exercises Challenges</h3>
                      <button className="text-[#8E8E98] hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Progress Ring & Workout Summary Sub-row */}
                    <div className="flex items-center gap-4 pb-2 border-b border-[#202028]">
                      {/* Mini Radial Ring */}
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
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
                            strokeDasharray="80, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold text-white">80%</span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white block">2 Workout Day</span>
                        <span className="text-[11px] text-[#8E8E98] font-medium">Lower Body</span>
                      </div>
                    </div>

                    {/* Challenge 1: Hydration */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#201416] border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                            <span className="text-sm">💧</span>
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">Hydration</span>
                            <span className="text-[10px] text-[#8E8E98]">250ml</span>
                          </div>
                        </div>

                        {/* Red Progress Bar */}
                        <div className="flex-1 mx-6 h-2 rounded-full bg-[#20202A] overflow-hidden">
                          <div className="h-full w-[70%] bg-[#FF1E27] rounded-full shadow-[0_0_8px_#FF1E27]" />
                        </div>

                        <span className="text-[11px] text-[#8E8E98] flex items-center gap-1 hover:text-white cursor-pointer">
                          7:30 Am <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Challenge 2: Stretching */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#201416] border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27]">
                            <span className="text-sm">🧘</span>
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">Stretching</span>
                            <span className="text-[10px] text-[#8E8E98]">20min</span>
                          </div>
                        </div>

                        {/* Red Progress Bar */}
                        <div className="flex-1 mx-6 h-2 rounded-full bg-[#20202A] overflow-hidden">
                          <div className="h-full w-[85%] bg-[#FF1E27] rounded-full shadow-[0_0_8px_#FF1E27]" />
                        </div>

                        <span className="text-[11px] text-[#8E8E98] flex items-center gap-1 hover:text-white cursor-pointer">
                          7:30 Am <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ============================================================== */}
                {/* RIGHT COLUMN: YOUR DAILY EXTRA GOALS + MEAL STATISTICS       */}
                {/* ============================================================== */}
                <div className="lg:col-span-4 space-y-6">

                  {/* Card C: Your Daily Extra Goals (Big Circular Ring) */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">Your Daily Extra Goals</h3>
                      <button className="text-[#8E8E98] hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Big Circular Progress Ring */}
                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">80%</span>
                      </div>
                    </div>

                    {/* Legend Below Ring */}
                    <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-300 pt-2 border-t border-[#202028]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#FF1E27]" />
                        <span>Bicycle</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#FF1E27]" />
                        <span>Yoga</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                        <span>Exercises</span>
                      </div>
                    </div>
                  </div>

                  {/* Card D: Meal Statistics with mini Spline Chart */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">Meal Statistics</h3>
                      <button className="text-[#8E8E98] hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-white tracking-tight">269</span>
                      <span className="text-xs text-[#8E8E98] font-semibold">Kcal</span>
                    </div>

                    {/* Mini Spline Wave Chart */}
                    <div className="relative w-full h-32">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" fill="none">
                        {/* Grid lines */}
                        {[20, 50, 80].map((y, i) => (
                          <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="#1E1E28" strokeWidth="1" strokeDasharray="2 2" />
                        ))}

                        {/* Spline Path */}
                        <path
                          d="M 0,80 Q 40,75 75,80 T 150,75 T 225,25 T 300,75"
                          stroke="#FF1E27"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                          filter="drop-shadow(0 0 6px rgba(255,30,39,0.7))"
                        />

                        {/* Peak node */}
                        <circle cx="225" cy="25" r="4" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="2" />

                        {/* Floating Tooltip */}
                        <g transform="translate(195, -2)">
                          <rect width="60" height="24" rx="6" fill="#121217" stroke="#2A2A38" strokeWidth="1" />
                          <text x="30" y="10" fill="#8E8E98" fontSize="7" fontWeight="600" textAnchor="middle">Steps</text>
                          <text x="30" y="20" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">9,346</text>
                        </g>
                      </svg>

                      {/* X-Axis categories */}
                      <div className="flex justify-between text-[10px] text-[#8E8E98] font-medium pt-1 px-1">
                        {['Vegetables', 'Fruit', 'Meat', 'Water'].map((cat) => (
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
          {activeTab === 'public-pages' && (
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
                      Dynamically customize, upload photos to Cloudinary, and instantly publish landing page components.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2A2A38] hover:border-[#FF1E27] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Eye size={15} className="text-[#FF1E27]" /> Live Preview
                  </a>

                  <button
                    onClick={handleResetCMS}
                    className="px-4 py-2.5 rounded-xl bg-[#181820] border border-[#2A2A38] hover:border-amber-500 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <RotateCcw size={15} className="text-amber-400" /> Reset Defaults
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
                  { id: 'hero', label: '1. Hero & Branding', icon: Sparkles },
                  { id: 'words', label: '2. Kinetic Words', icon: Type },
                  { id: 'explore', label: '3. Programs Bento Grid', icon: Layers },
                  { id: 'supplements', label: '4. Supplements Showcase', icon: Dumbbell, count: editorData?.supplements?.products?.length || 0 },
                  { id: 'equipment', label: '5. 3D Smart Equipment', icon: Sliders },
                  { id: 'footer', label: '6. Footer & Brand Info', icon: Globe }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCmsActiveTab(tab.id)}
                    className={`px-4 sm:px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      cmsActiveTab === tab.id
                        ? 'bg-[#FF1E27] text-white shadow-[0_0_16px_rgba(255,30,39,0.4)]'
                        : 'text-[#8E8E98] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <tab.icon size={15} /> {tab.label}
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${cmsActiveTab === tab.id ? 'bg-white text-[#FF1E27]' : 'bg-[#22222E] text-slate-300'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ========================================================================= */}
              {/* 1. HERO & BRANDING SECTION CMS */}
              {/* ========================================================================= */}
              {cmsActiveTab === 'hero' && (
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
                      {editorData?.brand?.logo?.includes('cloudinary') && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Cloudinary Logo Active
                        </span>
                      )}
                    </div>

                    {/* Cloudinary Brand Logo Upload Section */}
                    <div className="p-4 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-3.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Camera size={14} className="text-[#FF1E27]" /> Brand Logo Graphic (Cloudinary CDN)
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Live Logo Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-[#0E0E12] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative group p-2">
                          {editorData?.brand?.logo ? (
                            <img
                              src={editorData.brand.logo}
                              alt={editorData?.brand?.name || 'Brand Logo'}
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
                            <label className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                              uploadingLogo
                                ? 'bg-amber-500 animate-pulse text-black' 
                                : 'bg-[#FF1E27] hover:brightness-110'
                            }`}>
                              {uploadingLogo ? (
                                <>
                                  <RefreshCw size={13} className="animate-spin" /> Uploading Logo...
                                </>
                              ) : (
                                <>
                                  <UploadCloud size={14} /> Upload Brand Logo to Cloudinary
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
                            value={editorData?.brand?.logo || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              brand: { ...editorData.brand, logo: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 rounded-lg bg-[#121217] border border-[#282834] text-white text-[11px] outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand Name, Sub-Headline, and Tagline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Brand Logo Name</label>
                        <input
                          type="text"
                          value={editorData?.brand?.name || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            brand: { ...editorData.brand, name: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Brand Sub-Headline</label>
                        <input
                          type="text"
                          value={editorData?.brand?.subname || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            brand: { ...editorData.brand, subname: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Brand Motto / Slogan</label>
                        <input
                          type="text"
                          value={editorData?.brand?.tagline || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            brand: { ...editorData.brand, tagline: e.target.value }
                          })}
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
                        <label className="text-xs font-semibold text-slate-300 block">Headline Word 1 (Kinetic)</label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlinePart1 || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            hero: { ...editorData.hero, headlinePart1: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Headline Word 2 (Hover Split)</label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlinePart2 || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            hero: { ...editorData.hero, headlinePart2: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Hover Reveal Tagline</label>
                        <input
                          type="text"
                          value={editorData?.hero?.headlineHoverText || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            hero: { ...editorData.hero, headlineHoverText: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Hero Narrative & Description</label>
                        <textarea
                          rows="3"
                          value={editorData?.hero?.description || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            hero: { ...editorData.hero, description: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] transition-all resize-none shadow-inner leading-relaxed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Primary CTA Button</label>
                        <input
                          type="text"
                          value={editorData?.hero?.ctaButtonText || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            hero: { ...editorData.hero, ctaButtonText: e.target.value }
                          })}
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
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">Metric 01: Members</span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Counter Number</label>
                          <input
                            type="text"
                            value={editorData?.hero?.membersCount || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, membersCount: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Label Description</label>
                          <input
                            type="text"
                            value={editorData?.hero?.membersLabel || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, membersLabel: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>

                      {/* Stat 2 */}
                      <div className="p-5 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-4 shadow-md">
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">Metric 02: Results</span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Counter Number</label>
                          <input
                            type="text"
                            value={editorData?.hero?.transformationsCount || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, transformationsCount: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Label Description</label>
                          <input
                            type="text"
                            value={editorData?.hero?.transformationsLabel || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, transformationsLabel: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                      </div>

                      {/* Stat 3 */}
                      <div className="p-5 rounded-2xl bg-[#181822] border border-[#2A2A38] space-y-4 shadow-md">
                        <span className="text-xs font-bold text-[#FF1E27] uppercase tracking-wide block pb-2 border-b border-white/5">Metric 03: Hours</span>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Counter Number</label>
                          <input
                            type="text"
                            value={editorData?.hero?.hoursCount || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, hoursCount: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#282834] text-white text-xs outline-none focus:border-[#FF1E27]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-400 block">Label Description</label>
                          <input
                            type="text"
                            value={editorData?.hero?.hoursLabel || ''}
                            onChange={(e) => setEditorData({
                              ...editorData,
                              hero: { ...editorData.hero, hoursLabel: e.target.value }
                            })}
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
              {cmsActiveTab === 'words' && (
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
                        value={editorData?.horizontalWords?.sentence || ''}
                        onChange={(e) => setEditorData({
                          ...editorData,
                          horizontalWords: { ...editorData.horizontalWords, sentence: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-sm uppercase font-bold tracking-wider outline-none focus:border-[#FF1E27] shadow-inner"
                      />
                      <p className="text-[11px] text-slate-400">Default: PAIN IS TEMPORARY GLORY IS FOREVER</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Motivational Sub-paragraph & Manifesto
                      </label>
                      <textarea
                        rows="4"
                        value={editorData?.horizontalWords?.bottomText || ''}
                        onChange={(e) => setEditorData({
                          ...editorData,
                          horizontalWords: { ...editorData.horizontalWords, bottomText: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27] resize-none leading-relaxed shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 3. PROGRAMS BENTO GRID CMS (Sleek, Clean, Modern UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === 'explore' && (
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
                            Manage interactive cards displayed on the 3D bento grid.
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
                        <label className="text-[11px] font-medium text-slate-400 block">Top Tagline</label>
                        <input
                          type="text"
                          value={editorData?.exploreEscape?.tagline || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            exploreEscape: { ...editorData.exploreEscape, tagline: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">Main Heading</label>
                        <input
                          type="text"
                          value={editorData?.exploreEscape?.headingMain || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            exploreEscape: { ...editorData.exploreEscape, headingMain: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">Highlighted Text</label>
                        <input
                          type="text"
                          value={editorData?.exploreEscape?.headingHighlight || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            exploreEscape: { ...editorData.exploreEscape, headingHighlight: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Program Cards in 2-Column Responsive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(editorData?.exploreEscape?.cards || []).map((card, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200">
                        
                        {/* Minimal Sleek Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                            <span className="text-xs font-bold text-white tracking-wide">
                              Program 0{idx + 1}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {card.category || 'PROGRAM'}
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
                            <label className="text-[11px] font-medium text-slate-400 block">Card Title</label>
                            <input
                              type="text"
                              value={card.title ? card.title.replace('\n', ' ') : ''}
                              onChange={(e) => {
                                const newCards = [...editorData.exploreEscape.cards];
                                newCards[idx].title = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  exploreEscape: { ...editorData.exploreEscape, cards: newCards }
                                });
                              }}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">Category Tag</label>
                            <input
                              type="text"
                              value={card.category}
                              onChange={(e) => {
                                const newCards = [...editorData.exploreEscape.cards];
                                newCards[idx].category = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  exploreEscape: { ...editorData.exploreEscape, cards: newCards }
                                });
                              }}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-400 block">Program Description</label>
                          <textarea
                            rows="2"
                            value={card.text}
                            onChange={(e) => {
                              const newCards = [...editorData.exploreEscape.cards];
                              newCards[idx].text = e.target.value;
                              setEditorData({
                                ...editorData,
                                exploreEscape: { ...editorData.exploreEscape, cards: newCards }
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
                              <label className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                uploadingProgramIndex === idx 
                                  ? 'bg-amber-500 text-black animate-pulse' 
                                  : 'bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent'
                              }`}>
                                {uploadingProgramIndex === idx ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" /> Uploading...
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
                                  onChange={(e) => handleProgramImageUploadToCloudinary(e, idx)}
                                  className="hidden"
                                />
                              </label>

                              {card.image?.includes('cloudinary') && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cloudinary
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="Image CDN Link..."
                              value={card.image || ''}
                              onChange={(e) => {
                                const newCards = [...editorData.exploreEscape.cards];
                                newCards[idx].image = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  exploreEscape: { ...editorData.exploreEscape, cards: newCards }
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
              {/* 4. SUPPLEMENTS MATRIX CMS (Sleek, Clean, Modern UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === 'supplements' && (
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
                        <label className="text-[11px] font-medium text-slate-400 block">Section Title</label>
                        <input
                          type="text"
                          value={editorData?.supplements?.title || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            supplements: { ...editorData.supplements, title: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">Section Subtitle</label>
                        <input
                          type="text"
                          value={editorData?.supplements?.subtitle || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            supplements: { ...editorData.supplements, subtitle: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Grid for Supplement Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {(editorData?.supplements?.products || []).map((prod, idx) => (
                      <div key={prod.id || idx} className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200">
                        
                        {/* Minimal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                            <span className="text-xs font-bold text-white tracking-wide">
                              Product 0{idx + 1}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[160px]">
                              {prod.badge || 'FORMULA'}
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
                            <label className="text-[11px] font-medium text-slate-400 block">Product Title</label>
                            <input
                              type="text"
                              value={prod.title}
                              onChange={(e) => {
                                const newProds = [...editorData.supplements.products];
                                newProds[idx].title = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  supplements: { ...editorData.supplements, products: newProds }
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">Badge Tag</label>
                            <input
                              type="text"
                              value={prod.badge}
                              onChange={(e) => {
                                const newProds = [...editorData.supplements.products];
                                newProds[idx].badge = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  supplements: { ...editorData.supplements, products: newProds }
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">Rating</label>
                            <input
                              type="text"
                              value={prod.rating}
                              onChange={(e) => {
                                const newProds = [...editorData.supplements.products];
                                newProds[idx].rating = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  supplements: { ...editorData.supplements, products: newProds }
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-400 block">Formula Description</label>
                          <textarea
                            rows="2"
                            value={prod.description}
                            onChange={(e) => {
                              const newProds = [...editorData.supplements.products];
                              newProds[idx].description = e.target.value;
                              setEditorData({
                                ...editorData,
                                supplements: { ...editorData.supplements, products: newProds }
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
                              <label className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                uploadingIndex === idx 
                                  ? 'bg-amber-500 text-black animate-pulse' 
                                  : 'bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent'
                              }`}>
                                {uploadingIndex === idx ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" /> Uploading...
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
                                  onChange={(e) => handleImageUploadToCloudinary(e, idx)}
                                  className="hidden"
                                />
                              </label>

                              {prod.image?.includes('cloudinary') && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cloudinary
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="Image CDN Link..."
                              value={prod.image || ''}
                              onChange={(e) => {
                                const newProds = [...editorData.supplements.products];
                                newProds[idx].image = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  supplements: { ...editorData.supplements, products: newProds }
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
              {/* 5. 3D SMART EQUIPMENT ENGINE CMS (Sleek, Clean UI) */}
              {/* ========================================================================= */}
              {cmsActiveTab === 'equipment' && (
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
                            Manage interactive steps shown on the 3D equipment deck.
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
                        <label className="text-[11px] font-medium text-slate-400 block">Top Tagline</label>
                        <input
                          type="text"
                          value={editorData?.equipment?.tagline || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            equipment: { ...editorData.equipment, tagline: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block">Section Title</label>
                        <input
                          type="text"
                          value={editorData?.equipment?.title || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            equipment: { ...editorData.equipment, title: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Grid for Steps */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(editorData?.equipment?.steps || []).map((step, idx) => (
                      <div key={step.id || idx} className="p-6 rounded-2xl bg-[#141419] border border-white/[0.07] hover:border-white/[0.15] space-y-4 shadow-xl transition-all duration-200">
                        
                        {/* Minimal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
                            <span className="text-xs font-bold text-white tracking-wide">
                              {step.step || `STEP 0${idx + 1}`}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {step.subtitle || 'STEP'}
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
                            <label className="text-[11px] font-medium text-slate-400 block">Step Title</label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...editorData.equipment.steps];
                                newSteps[idx].title = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: { ...editorData.equipment, steps: newSteps }
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-400 block">Step Subtitle</label>
                            <input
                              type="text"
                              value={step.subtitle}
                              onChange={(e) => {
                                const newSteps = [...editorData.equipment.steps];
                                newSteps[idx].subtitle = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: { ...editorData.equipment, steps: newSteps }
                                });
                              }}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-400 block">Description</label>
                          <textarea
                            rows="2"
                            value={step.desc}
                            onChange={(e) => {
                              const newSteps = [...editorData.equipment.steps];
                              newSteps[idx].desc = e.target.value;
                              setEditorData({
                                ...editorData,
                                equipment: { ...editorData.equipment, steps: newSteps }
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
                              <label className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                                uploadingEquipmentIndex === idx 
                                  ? 'bg-amber-500 text-black animate-pulse' 
                                  : 'bg-white/[0.08] hover:bg-[#FF1E27] border border-white/[0.08] hover:border-transparent'
                              }`}>
                                {uploadingEquipmentIndex === idx ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" /> Uploading...
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
                                  onChange={(e) => handleEquipmentImageUploadToCloudinary(e, idx)}
                                  className="hidden"
                                />
                              </label>

                              {step.image?.includes('cloudinary') && (
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cloudinary
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="Image CDN Link..."
                              value={step.image || ''}
                              onChange={(e) => {
                                const newSteps = [...editorData.equipment.steps];
                                newSteps[idx].image = e.target.value;
                                setEditorData({
                                  ...editorData,
                                  equipment: { ...editorData.equipment, steps: newSteps }
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
              {cmsActiveTab === 'footer' && (
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
                        <label className="text-xs font-semibold text-slate-300 block">Brand Mission / Quote</label>
                        <input
                          type="text"
                          value={editorData?.footer?.brandQuote || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: { ...editorData.footer, brandQuote: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Copyright Statement</label>
                        <input
                          type="text"
                          value={editorData?.footer?.copyright || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: { ...editorData.footer, copyright: e.target.value }
                          })}
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
                        <label className="text-xs font-semibold text-slate-300 block">Contact Email</label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactEmail || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: { ...editorData.footer, contactEmail: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Phone Number</label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactPhone || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: { ...editorData.footer, contactPhone: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2A2A38] text-white text-xs outline-none focus:border-[#FF1E27]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">HQ Physical Address</label>
                        <input
                          type="text"
                          value={editorData?.footer?.contactAddress || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: { ...editorData.footer, contactAddress: e.target.value }
                          })}
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
                          Links open automatically when visitors click on the footer social icons.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#E1306C] font-bold">●</span> Instagram Profile URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/yourhandle"
                          value={editorData?.footer?.socials?.instagram || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: {
                              ...editorData.footer,
                              socials: {
                                ...(editorData.footer?.socials || {}),
                                instagram: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#FF0000] font-bold">●</span> YouTube Channel URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/@yourchannel"
                          value={editorData?.footer?.socials?.youtube || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: {
                              ...editorData.footer,
                              socials: {
                                ...(editorData.footer?.socials || {}),
                                youtube: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-white font-bold">●</span> X / Twitter URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://twitter.com/yourhandle"
                          value={editorData?.footer?.socials?.twitter || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: {
                              ...editorData.footer,
                              socials: {
                                ...(editorData.footer?.socials || {}),
                                twitter: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#1877F2] font-bold">●</span> Facebook Page URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/yourpage"
                          value={editorData?.footer?.socials?.facebook || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: {
                              ...editorData.footer,
                              socials: {
                                ...(editorData.footer?.socials || {}),
                                facebook: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                          <span className="text-[#0A66C2] font-bold">●</span> LinkedIn URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/company/yourhandle"
                          value={editorData?.footer?.socials?.linkedin || ''}
                          onChange={(e) => setEditorData({
                            ...editorData,
                            footer: {
                              ...editorData.footer,
                              socials: {
                                ...(editorData.footer?.socials || {}),
                                linkedin: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-white/[0.08] focus:border-[#FF1E27] text-white text-xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

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
                          .map((u, index) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-[#00F0FF] font-mono text-[11px] font-semibold">{u.displayId || `USR-${101 + index}`}</td>
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
                      {loadingUsers ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-slate-400">
                            Loading registered customers from MongoDB...
                          </td>
                        </tr>
                      ) : customersList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-slate-400">
                            No registered customers found in database. Click "Register New Customer" to add.
                          </td>
                        </tr>
                      ) : (
                        customersList
                          .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((c) => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-[#00F0FF] text-[11px] font-semibold">{c.id}</td>
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
                          ))
                      )}
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
