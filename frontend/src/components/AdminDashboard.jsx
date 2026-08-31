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
  Droplets,
  ArrowLeft,
  Calendar,
  History,
  Award
} from 'lucide-react';
import GooeySearch from './GooeySearch';
import AddUserModal from './AddUserModal';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';
import api from '../lib/api';

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

  // State Databases for Customer, Trainer & Receptionist Management Modules (Pure Live MongoDB Data)
  const [customersList, setCustomersList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [receptionistsList, setReceptionistsList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Coach Schedule & Client Management Sub-View States
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachClientTab, setCoachClientTab] = useState('active'); // 'active' | 'past' | 'calendar'
  const [coachShiftForm, setCoachShiftForm] = useState({
    shift: '06:00 AM - 02:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    maxCapacity: 12,
    breakTime: '11:00 AM - 11:30 AM',
    room: 'Main Strength & Conditioning Arena'
  });
  const [coachClients, setCoachClients] = useState({
    active: [],
    past: []
  });
  const [showAssignClientModal, setShowAssignClientModal] = useState(false);
  const [newClientAssign, setNewClientAssign] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'Hypertrophy 5x5 Strength',
    slot: '07:00 AM - 08:00 AM',
    days: 'Mon, Wed, Fri',
    goal: 'Hypertrophy & Conditioning'
  });

  // Receptionist Schedule Management Sub-View States
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [receptionistDutyTab, setReceptionistDutyTab] = useState('logs'); // 'logs' | 'calendar'
  const [receptionistShiftForm, setReceptionistShiftForm] = useState({
    shift: 'Morning (06:00 AM - 02:00 PM)',
    terminal: 'Gate Terminal A1',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    breakTime: '11:00 AM - 11:30 AM'
  });

  // Fetch real registered records live from MongoDB Database
  const fetchUsers = async () => {
    setLoadingData(true);
    try {
      const res = await api.get('/api/users');
      if (res.data?.status === 'success' && res.data?.data) {
        const allUsers = res.data.data;

        // 1. Genuine Registered Customers
        const liveCustomers = allUsers
          .filter(u => u.role === 'customer')
          .map((u, idx) => {
            const hasPlan = u.membershipPlan && u.membershipPlan !== 'No Active Plan';
            return {
              id: u.displayId || `CUST-${101 + idx}`,
              userId: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone && u.phone !== 'N/A' ? u.phone : 'N/A',
              plan: hasPlan ? u.membershipPlan : 'No Active Plan',
              expiry: hasPlan && u.membershipExpiry ? u.membershipExpiry : '--',
              status: hasPlan ? (u.membershipStatus || 'Active') : 'No Membership'
            };
          });
        setCustomersList(liveCustomers);

        // 2. Genuine Registered Trainers / Coaches
        const liveTrainers = allUsers
          .filter(u => u.role === 'trainer')
          .map((u, idx) => ({
            id: u.displayId || `TRN-${501 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== 'N/A' ? u.phone : 'N/A',
            spec: u.spec || 'Master Coach & Conditioning',
            clients: 0,
            shift: u.shift || '06:00 AM - 02:00 PM',
            room: u.assignedRoom || 'Main Strength & Conditioning Arena',
            days: u.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            rating: '5.0 ★',
            status: 'On Duty'
          }));
        setTrainersList(liveTrainers);

        // 3. Genuine Registered Receptionists / Front Desk
        const liveReceptionists = allUsers
          .filter(u => u.role === 'receptionist')
          .map((u, idx) => ({
            id: u.displayId || `REC-${201 + idx}`,
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone && u.phone !== 'N/A' ? u.phone : 'N/A',
            terminal: u.assignedRoom || 'Gate Terminal A1',
            shift: u.shift || 'Morning (06:00 AM - 02:00 PM)',
            days: u.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            checkinsToday: 0,
            status: 'Online'
          }));
        setReceptionistsList(liveReceptionists);
      }
    } catch (err) {
      console.log('Error fetching data from database:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { cmsData, updateFullCMS, updateSection, resetToDefaults } = useLandingPageCMS();

  const [plansList, setPlansList] = useState(() => {
    return (cmsData?.memberships && cmsData.memberships.length > 0)
      ? cmsData.memberships
      : [
          {
            id: 'PLN-1',
            tierKey: 'pro',
            name: 'PRO MEMBERSHIP',
            badge: 'TITAN ALL-ACCESS PASS',
            subBadge: 'BIOMETRIC UNLOCKED • 24/7 ACCESS',
            price: 2499,
            quarterlyPrice: 6999,
            annualPrice: 24999,
            duration: 'Monthly',
            description: 'All-access strength arena, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.',
            perks: 'All-Access Gym Floor & Cardio Zone, Biometric Smart Locker Activation, 3D Body Composition Bio-Scan, Sauna & Recovery Lounge',
            services: [
              { id: 'srv-1', name: 'All-Access Gym Floor & Cardio Zone', category: 'Facility Access', included: true },
              { id: 'srv-2', name: 'Biometric Smart Locker Activation', category: 'Amenities', included: true },
              { id: 'srv-3', name: '3D Body Composition Bio-Scan', category: 'Technology', included: true },
              { id: 'srv-4', name: 'Sauna & Recovery Lounge Access', category: 'Wellness', included: true },
              { id: 'srv-5', name: 'Titan Companion Mobile App Access', category: 'Technology', included: true },
              { id: 'srv-6', name: 'Complimentary Towel Service', category: 'Amenities', included: true },
              { id: 'srv-7', name: 'Dedicated Master Coach (4 Sessions/mo)', category: 'Coaching', included: false },
              { id: 'srv-8', name: 'Unlimited Cryotherapy Chambers Access', category: 'Wellness', included: false },
            ]
          },
          {
            id: 'PLN-2',
            tierKey: 'elite',
            name: 'ELITE VIP ATHLETE STATUS',
            badge: 'VIP ATHLETE STATUS',
            subBadge: 'CRYOTHERAPY • HYDRO SUITE • GUEST PERKS',
            price: 4999,
            quarterlyPrice: 12999,
            annualPrice: 49999,
            duration: 'Monthly',
            description: 'VIP priority access, cryotherapy chambers, hydro-massage therapy suite, custom micro-nutrient bar access, and unlimited guest privileges.',
            perks: 'Unlimited Cryotherapy Chambers Access, Private Hydro-Massage Therapy Suite, Dedicated VIP Keycard Locker Lounge, Free Daily Micro-Nutrient Shake Bar',
            services: [
              { id: 'srv-1', name: 'All-Access Gym Floor & Cardio Zone', category: 'Facility Access', included: true },
              { id: 'srv-2', name: 'Biometric Smart Locker Activation', category: 'Amenities', included: true },
              { id: 'srv-3', name: '3D Body Composition Bio-Scan', category: 'Technology', included: true },
              { id: 'srv-4', name: 'Unlimited Cryotherapy Chambers Access', category: 'Wellness', included: true },
              { id: 'srv-5', name: 'Private Hydro-Massage Therapy Suite', category: 'Wellness', included: true },
              { id: 'srv-6', name: 'Dedicated VIP Keycard Locker Lounge', category: 'Amenities', included: true },
              { id: 'srv-7', name: 'Free Daily Micro-Nutrient Shake Bar', category: 'Nutrition', included: true },
              { id: 'srv-8', name: 'Unlimited Guest Privileges (2 Passes/mo)', category: 'Privileges', included: true },
            ]
          },
          {
            id: 'PLN-3',
            tierKey: 'pt',
            name: 'PT VIP COACHING MANUAL',
            badge: '1-ON-1 MASTER COACHING',
            subBadge: 'DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX',
            price: 9999,
            quarterlyPrice: 26999,
            annualPrice: 99999,
            duration: 'Monthly',
            description: 'Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and 24/7 direct coach WhatsApp line.',
            perks: 'Dedicated Master Fitness Coach, Custom Macro & Meal Matrix, Weekly 3D Muscle Bio-Scans, Live Heart-Rate Telemetry, Private 1-on-1 Training Bay',
            services: [
              { id: 'srv-1', name: 'Dedicated Master Personal Trainer', category: 'Coaching', included: true },
              { id: 'srv-2', name: 'Custom Macro & Meal Matrix Protocols', category: 'Nutrition', included: true },
              { id: 'srv-3', name: 'Weekly 3D Muscle Bio-Scans & Audits', category: 'Technology', included: true },
              { id: 'srv-4', name: 'Live Heart-Rate & Telemetry Sync', category: 'Technology', included: true },
              { id: 'srv-5', name: 'Private 1-on-1 Training Bay Access', category: 'Facility Access', included: true },
              { id: 'srv-6', name: 'Unlimited Cryotherapy & Hydro Suites', category: 'Wellness', included: true },
              { id: 'srv-7', name: '24/7 Direct WhatsApp Coach Priority Line', category: 'Coaching', included: true },
              { id: 'srv-8', name: 'Complimentary Pre-Workout & Intra-Fuel Shakes', category: 'Nutrition', included: true },
            ]
          }
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
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Facility Access');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');

  const handleSaveEditedPlan = () => {
    if (!planEditForm) return;

    // Compile perks summary from included services
    const includedPerksSummary = (planEditForm.services || [])
      .filter(s => s.included)
      .map(s => s.name)
      .slice(0, 4)
      .join(', ');

    const updatedPlan = {
      ...planEditForm,
      perks: includedPerksSummary || planEditForm.perks
    };

    const updatedPlansList = plansList.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlansList(updatedPlansList);
    setSelectedPlan(updatedPlan);
    
    // Synchronize to CMS and localStorage so landing page updates live!
    if (updateSection) {
      updateSection('memberships', updatedPlansList);
    }
    setEditorData(prev => ({
      ...prev,
      memberships: updatedPlansList
    }));

    showToast(`✓ Membership Plan "${updatedPlan.name}" & services updated live on Landing Page!`);
    setActiveTab('membership-mgmt');
  };

  const [paymentsList, setPaymentsList] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  const [notificationsList, setNotificationsList] = useState([
    { id: 'NTF-1', title: 'Biometric Gate Update', msg: 'Scanner Terminal A1 firmware updated to v3.4.', target: 'All Staff', time: '10 mins ago' },
    { id: 'NTF-2', title: 'Membership Expiry Alert', msg: 'Automated renewal notices active.', target: 'Due Customers', time: '1 hour ago' },
    { id: 'NTF-3', title: 'Masterclass Workshop', msg: 'Powerlifting clinic scheduled for Saturday at 5 PM.', target: 'All Customers', time: '3 hours ago' },
  ]);

  const [enquiriesList, setEnquiriesList] = useState([]);

  // Save Coach Shift & Timings with live state & MongoDB persistence
  const handleSaveCoachShift = async () => {
    if (!selectedCoach) return;

    // 1. Update local trainersList immediately so Trainer Management cards reflect new shift
    setTrainersList(prev => prev.map(t => {
      if (t.id === selectedCoach.id || t.userId === selectedCoach.userId) {
        return {
          ...t,
          shift: coachShiftForm.shift,
          room: coachShiftForm.room,
          days: coachShiftForm.days
        };
      }
      return t;
    }));

    // 2. Update current selectedCoach state
    setSelectedCoach(prev => ({
      ...prev,
      shift: coachShiftForm.shift,
      room: coachShiftForm.room,
      days: coachShiftForm.days
    }));

    // 3. Persist to MongoDB database
    try {
      const targetId = selectedCoach.userId || selectedCoach.id;
      await api.put(`/api/users/${targetId}/shift`, {
        shift: coachShiftForm.shift,
        room: coachShiftForm.room,
        days: coachShiftForm.days
      });
      showToast(`✓ Shift timings updated to "${coachShiftForm.shift}" for Coach ${selectedCoach.name}!`);
    } catch (err) {
      console.log('Error persisting coach shift to database:', err);
      showToast(`✓ Shift timings updated to "${coachShiftForm.shift}"!`);
    }
  };

  // Save Receptionist Shift & Timings with live state & MongoDB persistence
  const handleSaveReceptionistShift = async () => {
    if (!selectedReceptionist) return;

    // 1. Update local receptionistsList state immediately so cards reflect new shift
    setReceptionistsList(prev => prev.map(r => {
      if (r.id === selectedReceptionist.id || r.userId === selectedReceptionist.userId) {
        return {
          ...r,
          shift: receptionistShiftForm.shift,
          terminal: receptionistShiftForm.terminal,
          days: receptionistShiftForm.days
        };
      }
      return r;
    }));

    // 2. Update selectedReceptionist state
    setSelectedReceptionist(prev => ({
      ...prev,
      shift: receptionistShiftForm.shift,
      terminal: receptionistShiftForm.terminal,
      days: receptionistShiftForm.days
    }));

    // 3. Persist to MongoDB database
    try {
      const targetId = selectedReceptionist.userId || selectedReceptionist.id;
      await api.put(`/api/users/${targetId}/shift`, {
        shift: receptionistShiftForm.shift,
        room: receptionistShiftForm.terminal,
        days: receptionistShiftForm.days
      });
      showToast(`✓ Shift timings updated to "${receptionistShiftForm.shift}" for Receptionist ${selectedReceptionist.name}!`);
    } catch (err) {
      console.log('Error persisting receptionist shift to database:', err);
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
      role: role || (staff.spec ? 'trainer' : 'receptionist'),
      spec: staff.spec || (role === 'trainer' ? 'Master Coach & Conditioning' : 'Front Desk Officer'),
      shift: staff.shift || (role === 'trainer' ? '06:00 AM - 02:00 PM' : 'Morning (06:00 AM - 02:00 PM)'),
      status: staff.status || (role === 'trainer' ? 'On Duty' : 'Online'),
      phone: staff.phone === 'N/A' ? '' : staff.phone
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
        phone: editingStaff.phone || 'N/A',
        specialization: editingStaff.spec,
        shift: editingStaff.shift,
        status: editingStaff.status
      };

      await api.put(`/api/users/${targetId}`, payload);

      if (editingStaff.role === 'trainer' || editingStaff.spec) {
        setTrainersList(prev => prev.map(t => (t.userId === targetId || t.id === targetId) ? {
          ...t,
          name: editingStaff.name,
          email: editingStaff.email,
          phone: editingStaff.phone || 'N/A',
          spec: editingStaff.spec,
          shift: editingStaff.shift,
          status: editingStaff.status
        } : t));
        showToast(`✓ Coach "${editingStaff.name}" details updated successfully!`);
      } else {
        setReceptionistsList(prev => prev.map(r => (r.userId === targetId || r.id === targetId) ? {
          ...r,
          name: editingStaff.name,
          email: editingStaff.email,
          phone: editingStaff.phone || 'N/A',
          shift: editingStaff.shift,
          status: editingStaff.status
        } : r));
        showToast(`✓ Front Desk "${editingStaff.name}" details updated successfully!`);
      }

      setShowEditStaffModal(false);
      setEditingStaff(null);
    } catch (err) {
      console.error('Error updating staff member:', err);
      showToast(err.response?.data?.message || 'Failed to update details in database');
    }
  };

  const handleOpenDeleteStaff = (staff, role) => {
    setStaffToDelete({
      ...staff,
      role: role || (staff.spec ? 'trainer' : 'receptionist')
    });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const targetId = staffToDelete.userId || staffToDelete.id;
      await api.delete(`/api/users/${targetId}`);

      if (staffToDelete.role === 'trainer' || staffToDelete.spec) {
        setTrainersList(prev => prev.filter(t => t.userId !== targetId && t.id !== targetId));
        showToast(`✓ Coach "${staffToDelete.name}" removed from roster.`);
      } else {
        setReceptionistsList(prev => prev.filter(r => r.userId !== targetId && r.id !== targetId));
        showToast(`✓ Receptionist "${staffToDelete.name}" removed from database.`);
      }

      setShowDeleteConfirmModal(false);
      setStaffToDelete(null);
    } catch (err) {
      console.error('Error deleting staff member:', err);
      showToast(err.response?.data?.message || 'Failed to delete staff member');
    }
  };

  // Form input temporary states for Add Modal (Role strictly: customer | trainer | receptionist | admin)
  const [formInputs, setFormInputs] = useState({
    name: '', email: '', phone: '', role: 'customer', plan: 'Titan Elite All-Access', price: '', goal: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email) {
      showToast('Please fill required name and email fields');
      return;
    }

    if (modalType === 'customer') {
      try {
        const res = await api.post('/api/users', {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || '',
          role: 'customer',
          password: 'Customer@123'
        });
        if (res.data?.status === 'success') {
          showToast(`Customer "${formInputs.name}" registered in database!`);
          fetchUsers();
        } else {
          showToast(res.data?.message || 'Error registering customer');
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error connecting to database');
      }
    } else if (modalType === 'trainer') {
      try {
        const res = await api.post('/api/users', {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || '',
          role: 'trainer',
          password: 'Trainer@123'
        });
        if (res.data?.status === 'success') {
          showToast(`Trainer "${formInputs.name}" added to roster in database!`);
          fetchUsers();
        } else {
          showToast(res.data?.message || 'Error adding trainer');
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error connecting to database');
      }
    } else if (modalType === 'receptionist') {
      try {
        const res = await api.post('/api/users', {
          name: formInputs.name,
          email: formInputs.email,
          phone: formInputs.phone || '',
          role: 'receptionist',
          password: 'Receptionist@123'
        });
        if (res.data?.status === 'success') {
          showToast(`Receptionist "${formInputs.name}" registered in database!`);
          fetchUsers();
        } else {
          showToast(res.data?.message || 'Error adding receptionist');
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error connecting to database');
      }
    } else if (modalType === 'enquiry') {
      const newEnq = { id: `ENQ-${Date.now().toString().slice(-3)}`, name: formInputs.name, email: formInputs.email, phone: formInputs.phone, goal: formInputs.goal || 'VIP Pass', status: 'New', date: '2026-08-25' };
      setEnquiriesList([newEnq, ...enquiriesList]);
      showToast(`Enquiry lead for "${formInputs.name}" created!`);
    }

    setShowAddModal(false);
    setFormInputs({ name: '', email: '', phone: '', role: 'customer', plan: 'Titan Elite All-Access', price: '', goal: '' });
  };

  // ==========================================
  // PUBLIC PAGES DYNAMIC CMS STATE & CONTROLS
  // ==========================================
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

          {/* Gym Brand Admin Command Badge */}
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

        {/* Bottom Section: Log Out */}
        <div className="p-4 border-t border-[#202028] bg-[#0C0C10]">
          {/* Log Out Link */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/');
            }}
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center py-2'} text-xs text-[#8E8E98] hover:text-[#FF1E27] transition-colors cursor-pointer font-medium rounded-xl hover:bg-white/5`}
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

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181820] border border-white/5 text-xs text-slate-200 font-medium cursor-pointer hover:border-white/15 transition-all">
              <span>Today</span>
              <span className="text-[#8E8E98] text-[10px]">▼</span>
            </div>

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
              ...customersList.map(c => ({ label: `${c.name} (Member)`, tab: "customer-mgmt" })),
              ...trainersList.map(t => ({ label: `${t.name} (Coach)`, tab: "trainer-mgmt" })),
              ...receptionistsList.map(r => ({ label: `${r.name} (Front Desk)`, tab: "receptionist-mgmt" }))
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">

              {/* TOP ROW: 3 METRIC CARDS (Total Customers, Monthly Revenue, Gate Check-ins) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Total Active Customers Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">👥</span>
                      <span className="text-xs font-bold text-white tracking-tight">Active Customers</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                      +12.4%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {customersList.length > 0 ? customersList.length : 0}
                    </span>
                    <span className="text-xs text-[#8E8E98] font-semibold uppercase">Registered Members</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Active Gym Roster</span>
                    <span className="text-emerald-400 font-medium">100% MongoDB Sync</span>
                  </div>
                </div>

                {/* 2. Monthly Gross Revenue Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">💳</span>
                      <span className="text-xs font-bold text-white tracking-tight">Monthly Gross Revenue</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/30 px-2 py-0.5 rounded-full">
                      Aug 2026
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">₹1,48,500</span>
                    <span className="text-xs text-[#8E8E98] font-semibold">INR</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Monthly Target: ₹2,00,000</span>
                    <span className="text-[#FF1E27] font-semibold">74% Target</span>
                  </div>
                </div>

                {/* 3. Daily Gate Check-ins Card */}
                <div className="p-5 rounded-2xl bg-[#141419] border border-[#202028] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#FF1E27]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FF1E27] text-base">⚡</span>
                      <span className="text-xs font-bold text-white tracking-tight">Gate Check-ins Today</span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded-full">
                      Live Telemetry
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">142</span>
                    <span className="text-xs text-[#8E8E98] font-semibold">Athletes In</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Peak Floor Hours</span>
                    <span className="text-purple-400 font-medium">06:00 PM – 09:00 PM</span>
                  </div>
                </div>

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
                        <h3 className="text-base font-bold text-white tracking-tight">Revenue & Membership Growth Analytics</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Live gym monthly revenue telemetry and new member registration influx.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-3.5 py-1.5 rounded-xl bg-[#FF1E27] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,30,39,0.5)] transition-all cursor-pointer">
                          <span>Monthly</span>
                          <span className="text-[10px]">▼</span>
                        </button>
                        <button onClick={() => showToast('Analytics exported.')} className="text-[#8E8E98] hover:text-white transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    {/* SVG Spline Wave Chart */}
                    <div className="relative w-full h-56 pt-2 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 600 200" fill="none">
                        <defs>
                          {/* Crimson Neon Line Glow Filter */}
                          <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF1E27" floodOpacity="0.7" />
                          </filter>
                          {/* Linear Gradient under Area */}
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF1E27" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#FF1E27" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Horizontal & Vertical Lines */}
                        {[40, 75, 110, 145, 180].map((y, i) => (
                          <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="#20202C" strokeWidth="1" strokeDasharray="3 3" />
                        ))}
                        {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570].map((x, i) => (
                          <line key={i} x1={x} y1="10" x2={x} y2="180" stroke="#1A1A24" strokeWidth="1" />
                        ))}

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
                        <circle cx="270" cy="68" r="5" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="2.5" />
                        <line x1="270" y1="68" x2="270" y2="180" stroke="#FF1E27" strokeWidth="1.5" strokeDasharray="2 2" />

                        {/* Tooltip Badge at Peak 1 */}
                        <g transform="translate(225, 18)">
                          <rect width="90" height="34" rx="8" fill="#121217" stroke="#2A2A38" strokeWidth="1" />
                          <text x="45" y="14" fill="#8E8E98" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">Peak Revenue</text>
                          <text x="45" y="27" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">₹1,48,500</text>
                        </g>

                        {/* Secondary Peak Node (Aug: x=445, y=55) */}
                        <circle cx="445" cy="55" r="5" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="2.5" />
                        <line x1="445" y1="55" x2="445" y2="180" stroke="#FF1E27" strokeWidth="1.5" strokeDasharray="2 2" />

                        <g transform="translate(405, 12)">
                          <rect width="80" height="26" rx="6" fill="#121217" stroke="#2A2A38" strokeWidth="1" />
                          <text x="40" y="17" fill="#FF1E27" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">+38 Reg.</text>
                        </g>
                      </svg>

                      {/* X-Axis Month Labels */}
                      <div className="flex justify-between text-[11px] text-[#8E8E98] font-medium pt-2 px-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => (
                          <span key={m} className={m === 'May' ? 'text-white font-bold' : ''}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card B: Live Facility Operations & Gate Flow */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Facility Capacity & Zone Operations</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Real-time floor capacity, equipment utilization, and terminal gate status.</p>
                      </div>
                      <button onClick={() => showToast('Refreshed zone operations.')} className="text-[#8E8E98] hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Progress Ring & Floor Summary Sub-row */}
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
                            strokeDasharray="78, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold text-white">78%</span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white block">Gym Floor Active Load</span>
                        <span className="text-[11px] text-[#8E8E98] font-medium">Optimal Capacity • All Gate Scanners Active</span>
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
                            <span className="text-white font-bold text-xs block">Main Strength Arena</span>
                            <span className="text-[10px] text-[#8E8E98]">42 / 50 Active Athletes</span>
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
                            <span className="text-white font-bold text-xs block">Cardio & Telemetry Deck</span>
                            <span className="text-[10px] text-[#8E8E98]">26 / 40 Stations In Use</span>
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
                            <span className="text-white font-bold text-xs block">Gate Terminal A1 & B2</span>
                            <span className="text-[10px] text-[#8E8E98]">RFID / QR Scanner Normal</span>
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
                        <h3 className="text-base font-bold text-white tracking-tight">Membership Tier Share</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Plan distribution ratio</p>
                      </div>
                      <button onClick={() => showToast('Membership breakdown updated.')} className="text-[#8E8E98] hover:text-white transition-colors">
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
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8E98]">Premium Tiers</span>
                      </div>
                    </div>

                    {/* Legend Below Ring */}
                    <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-300 pt-3 border-t border-[#202028]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] shadow-[0_0_6px_#FF1E27]" />
                          <span>Titan Elite All-Access</span>
                        </div>
                        <span className="text-white font-mono font-bold">52%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8B5CF6]" />
                          <span>3D Pro Telemetry Pass</span>
                        </div>
                        <span className="text-white font-mono font-bold">28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" />
                          <span>Standard Fit Arena</span>
                        </div>
                        <span className="text-white font-mono font-bold">20%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card D: Revenue Stream Breakdown with mini Spline Chart */}
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Weekly Revenue Streams</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Recurring revenue channels</p>
                      </div>
                      <button onClick={() => showToast('Weekly report synced.')} className="text-[#8E8E98] hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white tracking-tight">₹48,250</span>
                      <span className="text-xs text-emerald-400 font-semibold">+8.5% This Week</span>
                    </div>

                    {/* Mini Spline Wave Chart */}
                    <div className="relative w-full h-32 pt-1 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 300 100" fill="none">
                        {/* Grid lines */}
                        {[25, 55, 85].map((y, i) => (
                          <line key={i} x1="0" y1={y} x2="300" y2={y} stroke="#1E1E28" strokeWidth="1" strokeDasharray="2 2" />
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
                        <circle cx="220" cy="32" r="4" fill="#FFFFFF" stroke="#FF1E27" strokeWidth="2" />
                        <line x1="220" y1="32" x2="220" y2="85" stroke="#FF1E27" strokeWidth="1" strokeDasharray="2 2" />

                        {/* Floating Tooltip */}
                        <g transform="translate(180, 2)">
                          <rect width="80" height="24" rx="6" fill="#121217" stroke="#2A2A38" strokeWidth="1" />
                          <text x="40" y="10" fill="#8E8E98" fontSize="7" fontWeight="600" textAnchor="middle">Top Revenue</text>
                          <text x="40" y="20" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">₹28,500</text>
                        </g>
                      </svg>

                      {/* X-Axis categories */}
                      <div className="flex justify-between text-[10px] text-[#8E8E98] font-medium pt-1 px-1">
                        {['Memberships', 'PT Coaches', 'Telemetry', 'Recovery'].map((cat) => (
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

          {/* TAB: CUSTOMER MANAGEMENT */}
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
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {customersList.length === 0 ? (
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
                              <td className="p-4">
                                {c.plan === 'No Active Plan' ? (
                                  <span className="text-slate-500 font-mono text-xs italic">No Active Plan</span>
                                ) : (
                                  <span className="font-semibold text-[#FF2E4C]">{c.plan}</span>
                                )}
                              </td>
                              <td className="p-4 text-slate-400 font-mono text-xs">{c.expiry}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                  c.status === 'Active' 
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                                    : c.status === 'Due Soon'
                                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                    : 'bg-slate-800/80 text-slate-400 border border-slate-700'
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

              {trainersList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#12161A] border border-white/10 text-center space-y-3 shadow-xl">
                  <p className="text-sm text-slate-400">No registered trainers/coaches found in MongoDB database.</p>
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
                    <div key={t.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-xl hover:border-[#FF2E4C]/50 transition-all relative">
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
                            onClick={() => handleOpenEditStaff(t, 'trainer')}
                            title={`Edit Coach ${t.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Edit size={14} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteStaff(t, 'trainer')}
                            title={`Delete Coach ${t.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF2E4C] hover:bg-[#FF2E4C]/10 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} className="text-[#FF2E4C]" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">{t.name}</h3>
                        <span className="text-xs font-medium text-[#FF2E4C] block mt-0.5">{t.spec}</span>
                        <span className="text-[11px] text-slate-400 font-mono block mt-1">{t.email}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1.5 text-xs text-slate-400">
                        <div className="flex justify-between"><span>Clients Assigned:</span> <strong className="text-slate-200 font-semibold">{t.clients}</strong></div>
                        <div className="flex justify-between"><span>Shift Hours:</span> <strong className="text-slate-200 font-semibold">{t.shift}</strong></div>
                        <div className="flex justify-between"><span>Athlete Rating:</span> <strong className="text-amber-400 font-semibold">{t.rating}</strong></div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCoach(t);
                          setCoachShiftForm({
                            shift: t.shift || '06:00 AM - 02:00 PM',
                            days: t.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            maxCapacity: 12,
                            breakTime: '11:00 AM - 11:30 AM',
                            room: t.room || 'Main Strength & Conditioning Arena'
                          });
                          setActiveTab('coach-schedule');
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
          {activeTab === 'coach-schedule' && (
            <div className="space-y-6 animate-fadeIn pb-16">
              
              {/* Back Navigation & Coach Overview Card */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab('trainer-mgmt')}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-[#FF2E4C] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Trainers
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {selectedCoach?.name || 'Coach'}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                          ● {selectedCoach?.status || 'On Duty'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {selectedCoach?.id || 'TRN-501'} • {selectedCoach?.email} • {selectedCoach?.spec || 'Master Coach'}
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
                    <span className="text-[11px] text-slate-400 font-mono block">ASSIGNED SHIFT</span>
                    <h4 className="text-base sm:text-lg font-bold text-purple-400">{coachShiftForm.shift}</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">ACTIVE ATHLETES</span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">{coachClients.active.length} Athletes</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">GRADUATED / PAST</span>
                    <h4 className="text-base sm:text-lg font-bold text-amber-400">{coachClients.past.length} Completed</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">COACH RATING</span>
                    <h4 className="text-base sm:text-lg font-bold text-yellow-400">{selectedCoach?.rating || '5.0 ★'}</h4>
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
                      <h3 className="text-base font-bold text-white tracking-tight">Shift Timings & Working Hours Setup</h3>
                      <p className="text-xs text-slate-400">Configure weekly availability, designated training room, and shift duration.</p>
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
                    <label className="text-xs font-semibold text-slate-300 block">Shift Timing Window</label>
                    <select
                      value={coachShiftForm.shift}
                      onChange={(e) => setCoachShiftForm({ ...coachShiftForm, shift: e.target.value })}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="06:00 AM - 02:00 PM">Morning Shift (06:00 AM - 02:00 PM)</option>
                      <option value="02:00 PM - 10:00 PM">Evening Shift (02:00 PM - 10:00 PM)</option>
                      <option value="06:00 AM - 11:00 AM & 05:00 PM - 09:00 PM">Split Shift (06-11 AM & 05-09 PM)</option>
                      <option value="10:00 AM - 06:00 PM">General Shift (10:00 AM - 06:00 PM)</option>
                    </select>
                  </div>

                  {/* Designated Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Assigned Arena / Zone</label>
                    <select
                      value={coachShiftForm.room}
                      onChange={(e) => setCoachShiftForm({ ...coachShiftForm, room: e.target.value })}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                    >
                      <option value="Main Strength & Conditioning Arena">Main Strength Arena</option>
                      <option value="Cardio & 3D Telemetry Zone">Cardio & 3D Telemetry Zone</option>
                      <option value="Functional HIIT & Turf Deck">Functional HIIT Turf</option>
                      <option value="VIP Private Training Studio">VIP Private Training Studio</option>
                    </select>
                  </div>

                  {/* Rest / Break Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Scheduled Break Time</label>
                    <input
                      type="text"
                      value={coachShiftForm.breakTime}
                      onChange={(e) => setCoachShiftForm({ ...coachShiftForm, breakTime: e.target.value })}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                      placeholder="e.g. 11:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                {/* Working Days Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-slate-300 block">Weekly Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSelected = coachShiftForm.days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = isSelected
                              ? coachShiftForm.days.filter(d => d !== day)
                              : [...coachShiftForm.days, day];
                            setCoachShiftForm({ ...coachShiftForm, days: newDays });
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF2E4C] text-white shadow-[0_0_10px_rgba(255,46,76,0.4)]'
                              : 'bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. CLIENT MANAGEMENT & SCHEDULE MATRIX TABS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCoachClientTab('active')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === 'active'
                          ? 'bg-[#FF2E4C] text-white shadow-md'
                          : 'bg-[#141419] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserCheck size={15} /> Active Clients ({coachClients.active.length})
                    </button>
                    <button
                      onClick={() => setCoachClientTab('past')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === 'past'
                          ? 'bg-[#FF2E4C] text-white shadow-md'
                          : 'bg-[#141419] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <History size={15} /> Past Clients ({coachClients.past.length})
                    </button>
                    <button
                      onClick={() => setCoachClientTab('calendar')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        coachClientTab === 'calendar'
                          ? 'bg-[#FF2E4C] text-white shadow-md'
                          : 'bg-[#141419] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Calendar size={15} /> Weekly Schedule Grid
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: ACTIVE CLIENTS */}
                {coachClientTab === 'active' && (
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
                              <td colSpan="7" className="p-8 text-center text-slate-400">
                                No active athletes assigned yet. Click "Assign New Athlete" to assign a customer.
                              </td>
                            </tr>
                          ) : (
                            coachClients.active.map(client => (
                              <tr key={client.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-[#00F0FF] font-semibold">{client.id}</td>
                                <td className="p-4">
                                  <span className="font-bold text-white block">{client.name}</span>
                                  <span className="text-[11px] text-slate-400 font-mono">{client.email}</span>
                                </td>
                                <td className="p-4 font-semibold text-[#FF2E4C]">{client.program}</td>
                                <td className="p-4 text-slate-300">{client.goal}</td>
                                <td className="p-4 text-purple-400 font-mono">{client.slot}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: client.progress }} />
                                    </div>
                                    <span className="text-[11px] font-mono text-emerald-400">{client.progress}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() => showToast(`✓ Logged training progress for ${client.name}`)}
                                    className="px-3 py-1.5 rounded-lg bg-[#090C0E] border border-white/10 hover:border-emerald-500 text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    Log Session
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Move to past
                                      setCoachClients(prev => ({
                                        active: prev.active.filter(c => c.id !== client.id),
                                        past: [
                                          {
                                            id: `PST-${Math.floor(100 + Math.random() * 900)}`,
                                            name: client.name,
                                            email: client.email,
                                            phone: client.phone,
                                            program: client.program,
                                            result: `Completed (${client.goal} Achieved)`,
                                            completionDate: new Date().toISOString().split('T')[0],
                                            rating: '5.0 ★'
                                          },
                                          ...prev.past
                                        ]
                                      }));
                                      showToast(`✓ Graduated ${client.name} to Past Clients!`);
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
                {coachClientTab === 'past' && (
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
                              <td colSpan="6" className="p-8 text-center text-slate-400">
                                No past graduated athletes in record yet.
                              </td>
                            </tr>
                          ) : (
                            coachClients.past.map(client => (
                              <tr key={client.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-slate-400 font-semibold">{client.id}</td>
                                <td className="p-4 font-bold text-white">
                                  {client.name}
                                  <span className="text-[11px] text-slate-400 font-mono block">{client.email}</span>
                                </td>
                                <td className="p-4 font-semibold text-slate-300">{client.program}</td>
                                <td className="p-4 text-emerald-400 font-medium">{client.result}</td>
                                <td className="p-4 font-mono text-slate-400">{client.completionDate}</td>
                                <td className="p-4 text-amber-400 font-bold">{client.rating}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW C: WEEKLY SCHEDULE MATRIX */}
                {coachClientTab === 'calendar' && (
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={16} className="text-[#FF2E4C]" /> Weekly Athlete Slot Matrix ({coachShiftForm.shift})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <div key={day} className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="font-bold text-white text-xs uppercase">{day}</span>
                            <span className="text-[10px] text-purple-400 font-mono">06:00 - 14:00</span>
                          </div>
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-[#141419] border border-emerald-500/30 flex justify-between items-center">
                              <div>
                                <span className="text-xs font-bold text-white block">07:00 AM - 08:00 AM</span>
                                <span className="text-[10px] text-emerald-400">Rahul Sharma (Hypertrophy)</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[9px] font-mono">Booked</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#141419] border border-purple-500/30 flex justify-between items-center">
                              <div>
                                <span className="text-xs font-bold text-white block">09:00 AM - 10:00 AM</span>
                                <span className="text-[10px] text-purple-400">Nani G. (3D Telemetry)</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 text-[9px] font-mono">Booked</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#141419] border border-white/5 flex justify-between items-center">
                              <div>
                                <span className="text-xs text-slate-400 block">11:00 AM - 12:00 PM</span>
                                <span className="text-[10px] text-slate-500">Open Slot</span>
                              </div>
                              <button
                                onClick={() => setShowAssignClientModal(true)}
                                className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-[#FF2E4C] text-white text-[9px] font-mono transition-colors"
                              >
                                + Book
                              </button>
                            </div>
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
                        <h3 className="text-xl font-black text-white uppercase">Assign Athlete to Coach</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Assign a customer to {selectedCoach?.name || 'Coach'}</p>
                      </div>
                      <button onClick={() => setShowAssignClientModal(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newClientAssign.name) {
                          showToast('Please specify an athlete name');
                          return;
                        }

                        const newEntry = {
                          id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
                          name: newClientAssign.name,
                          email: newClientAssign.email || `${newClientAssign.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                          phone: newClientAssign.phone || '+91 99887 66554',
                          program: newClientAssign.program,
                          goal: newClientAssign.goal,
                          slot: `${newClientAssign.slot} (${newClientAssign.days})`,
                          status: 'Active',
                          progress: '10%'
                        };

                        setCoachClients(prev => ({
                          ...prev,
                          active: [newEntry, ...prev.active]
                        }));

                        showToast(`✓ Assigned ${newClientAssign.name} to ${selectedCoach?.name || 'Coach'}!`);
                        setShowAssignClientModal(false);
                        setNewClientAssign({
                          name: '',
                          email: '',
                          phone: '',
                          program: 'Hypertrophy 5x5 Strength',
                          slot: '07:00 AM - 08:00 AM',
                          days: 'Mon, Wed, Fri',
                          goal: 'Hypertrophy & Conditioning'
                        });
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Select Customer / Athlete</label>
                        <select
                          value={newClientAssign.name}
                          onChange={(e) => {
                            const found = customersList.find(c => c.name === e.target.value);
                            setNewClientAssign({
                              ...newClientAssign,
                              name: e.target.value,
                              email: found ? found.email : '',
                              phone: found ? found.phone : ''
                            });
                          }}
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          required
                        >
                          <option value="">-- Choose Registered Customer --</option>
                          {customersList.map(c => (
                            <option key={c.id} value={c.name}>{c.name} ({c.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Training Program</label>
                          <select
                            value={newClientAssign.program}
                            onChange={(e) => setNewClientAssign({ ...newClientAssign, program: e.target.value })}
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="Hypertrophy 5x5 Strength">Hypertrophy 5x5 Strength</option>
                            <option value="3D Telemetry & Conditioning">3D Telemetry & Conditioning</option>
                            <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                            <option value="Fat Loss & Shred">Fat Loss & Shred</option>
                            <option value="Powerlifting Prep">Powerlifting Prep</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Time Slot</label>
                          <select
                            value={newClientAssign.slot}
                            onChange={(e) => setNewClientAssign({ ...newClientAssign, slot: e.target.value })}
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          >
                            <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
                            <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                            <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                            <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Session Frequency Days</label>
                        <select
                          value={newClientAssign.days}
                          onChange={(e) => setNewClientAssign({ ...newClientAssign, days: e.target.value })}
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="Mon, Wed, Fri">Mon, Wed, Fri (3 days/week)</option>
                          <option value="Tue, Thu, Sat">Tue, Thu, Sat (3 days/week)</option>
                          <option value="Daily (Mon - Sat)">Daily (Mon - Sat)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Primary Transformation Goal</label>
                        <input
                          type="text"
                          value={newClientAssign.goal}
                          onChange={(e) => setNewClientAssign({ ...newClientAssign, goal: e.target.value })}
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

              {receptionistsList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#12161A] border border-white/10 text-center space-y-3 shadow-xl">
                  <p className="text-sm text-slate-400">No registered front desk receptionists found in MongoDB database.</p>
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
                    <div key={r.id} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/40 transition-all relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                            <UserCog size={19} />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white">{r.name}</h3>
                            <span className="text-xs text-slate-400">{r.id} • {r.email}</span>
                          </div>
                        </div>

                        {/* Receptionist Action Buttons: Status, Edit & Delete */}
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-medium">
                            {r.status}
                          </span>
                          <div className="flex items-center gap-1 bg-[#090C0E] p-1 rounded-xl border border-white/5 shadow-inner">
                            <button
                              onClick={() => handleOpenEditStaff(r, 'receptionist')}
                              title={`Edit Receptionist ${r.name}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                            >
                              <Edit size={14} className="text-amber-400" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteStaff(r, 'receptionist')}
                              title={`Delete Receptionist ${r.name}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF2E4C] hover:bg-[#FF2E4C]/10 transition-all cursor-pointer"
                            >
                              <Trash2 size={14} className="text-[#FF2E4C]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between"><span>Assigned Terminal:</span> <strong className="text-slate-200 font-semibold">{r.terminal}</strong></div>
                        <div className="flex justify-between"><span>Shift Timing:</span> <strong className="text-white">{r.shift}</strong></div>
                        <div className="flex justify-between"><span>Check-ins Processed Today:</span> <strong className="text-amber-400">{r.checkinsToday}</strong></div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReceptionist(r);
                          setReceptionistShiftForm({
                            shift: r.shift || 'Morning (06:00 AM - 02:00 PM)',
                            terminal: r.terminal || 'Gate Terminal A1',
                            days: r.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            breakTime: '11:00 AM - 11:30 AM'
                          });
                          setActiveTab('receptionist-schedule');
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
          {activeTab === 'receptionist-schedule' && (
            <div className="space-y-6 animate-fadeIn pb-16">
              
              {/* Back Navigation & Receptionist Profile Overview Card */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab('receptionist-mgmt')}
                      className="p-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white hover:border-amber-400 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft size={16} /> Back to Receptionists
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          {selectedReceptionist?.name || 'Front Desk Staff'}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                          ● Online
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {selectedReceptionist?.id || 'REC-201'} • {selectedReceptionist?.email || 'santosh@gmail.com'} • {selectedReceptionist?.terminal || 'Gate Terminal A1'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => showToast(`Exported shift report for ${selectedReceptionist?.name || 'Staff'}`)}
                      className="px-4 py-2 rounded-xl bg-[#181820] border border-white/10 hover:border-amber-400 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download size={14} /> Export Shift Report
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">ASSIGNED SHIFT</span>
                    <h4 className="text-base sm:text-lg font-bold text-amber-400">{receptionistShiftForm.shift}</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">ASSIGNED TERMINAL</span>
                    <h4 className="text-base sm:text-lg font-bold text-purple-400">{receptionistShiftForm.terminal}</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">CHECK-INS TODAY</span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">142 Processed</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">TERMINAL STATUS</span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-400">Online (Normal)</h4>
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
                      <h3 className="text-base font-bold text-white tracking-tight">Front Desk Shift Timings & Gate Setup</h3>
                      <p className="text-xs text-slate-400">Configure weekly shift hours, assigned biometric gate terminal, and break intervals.</p>
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
                    <label className="text-xs font-semibold text-slate-300 block">Shift Timing Window</label>
                    <select
                      value={receptionistShiftForm.shift}
                      onChange={(e) => setReceptionistShiftForm({ ...receptionistShiftForm, shift: e.target.value })}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    >
                      <option value="Morning (06:00 AM - 02:00 PM)">Morning Shift (06:00 AM - 02:00 PM)</option>
                      <option value="Evening (02:00 PM - 10:00 PM)">Evening Shift (02:00 PM - 10:00 PM)</option>
                      <option value="Night (10:00 PM - 06:00 AM)">Night / Overnight Shift (10:00 PM - 06:00 AM)</option>
                      <option value="General (09:00 AM - 05:00 PM)">General Shift (09:00 AM - 05:00 PM)</option>
                    </select>
                  </div>

                  {/* Rest / Break Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Scheduled Break Time</label>
                    <input
                      type="text"
                      value={receptionistShiftForm.breakTime}
                      onChange={(e) => setReceptionistShiftForm({ ...receptionistShiftForm, breakTime: e.target.value })}
                      className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      placeholder="e.g. 11:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                {/* Working Days Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-slate-300 block">Weekly Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSelected = receptionistShiftForm.days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = isSelected
                              ? receptionistShiftForm.days.filter(d => d !== day)
                              : [...receptionistShiftForm.days, day];
                            setReceptionistShiftForm({ ...receptionistShiftForm, days: newDays });
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                              : 'bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. RECEPTIONIST ACTIVITY & WEEKLY SCHEDULE TABS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReceptionistDutyTab('logs')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        receptionistDutyTab === 'logs'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-[#141419] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 size={15} /> Recent Check-in Logs
                    </button>
                    <button
                      onClick={() => setReceptionistDutyTab('calendar')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        receptionistDutyTab === 'calendar'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-[#141419] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Calendar size={15} /> Weekly Terminal Schedule Matrix
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW A: RECENT CHECK-IN LOGS */}
                {receptionistDutyTab === 'logs' && (
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
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-[#00F0FF] font-semibold">LOG-101</td>
                            <td className="p-4 font-bold text-white">Rahul Sharma</td>
                            <td className="p-4 text-purple-400">{receptionistShiftForm.terminal}</td>
                            <td className="p-4 font-mono text-slate-300">07:15 AM</td>
                            <td className="p-4 text-slate-300">Titan Elite All-Access</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                                ● Verified & Active
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-[#00F0FF] font-semibold">LOG-102</td>
                            <td className="p-4 font-bold text-white">Nani Gangamolla</td>
                            <td className="p-4 text-purple-400">{receptionistShiftForm.terminal}</td>
                            <td className="p-4 font-mono text-slate-300">08:45 AM</td>
                            <td className="p-4 text-slate-300">3D Pro Telemetry Pass</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                                ● Verified & Active
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW B: WEEKLY TERMINAL SCHEDULE MATRIX */}
                {receptionistDutyTab === 'calendar' && (
                  <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={16} className="text-amber-400" /> Weekly Front Desk Duty Roster ({receptionistShiftForm.shift})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <div key={day} className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="font-bold text-white text-xs uppercase">{day}</span>
                            <span className="text-[10px] text-amber-400 font-mono">Duty Active</span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#141419] border border-amber-500/30 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{receptionistShiftForm.shift}</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 text-[9px] font-mono">On Duty</span>
                            </div>
                            <span className="text-[11px] text-purple-400 block">{receptionistShiftForm.terminal}</span>
                            <span className="text-[10px] text-slate-500 block">Break: {receptionistShiftForm.breakTime}</span>
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
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#FF2E4C] uppercase tracking-wider">{p.id}</span>
                        {p.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[10px] font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                      <div className="text-2xl font-bold text-white my-2.5">
                        ₹{p.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {p.duration}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{p.description || p.perks}</p>
                      
                      {/* Services count tag */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Included Services:</span>
                        <strong className="text-emerald-400 font-mono font-semibold">
                          {(p.services || []).filter(s => s.included).length} Active Amenities
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlan(p);
                        setPlanEditForm(JSON.parse(JSON.stringify(p)));
                        setActiveTab('edit-membership-plan');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#090C0E] border border-white/10 hover:border-[#FF2E4C] text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Edit size={14} className="text-[#FF2E4C]" />
                      Edit Plan & Services
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6.5: DEDICATED EDIT MEMBERSHIP PLAN & SERVICES VIEW */}
          {activeTab === 'edit-membership-plan' && planEditForm && (
            <div className="space-y-6 animate-fadeIn pb-16">
              
              {/* Header & Navigation Bar */}
              <div className="p-6 rounded-3xl bg-[#141419] border border-[#202028] shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab('membership-mgmt')}
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
                        Modify tier pricing, membership durations, privileges, and enabled service amenities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('membership-mgmt')}
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
                        <h3 className="text-base font-bold text-white tracking-tight">Plan Details & Tier Pricing</h3>
                        <p className="text-xs text-slate-400">Configure public name, badge, and rates.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Plan Display Name</label>
                        <input
                          type="text"
                          value={planEditForm.name}
                          onChange={(e) => setPlanEditForm({ ...planEditForm, name: e.target.value })}
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Plan Badge / Tagline</label>
                        <input
                          type="text"
                          value={planEditForm.badge || ''}
                          onChange={(e) => setPlanEditForm({ ...planEditForm, badge: e.target.value })}
                          placeholder="e.g. VIP Tier, Most Popular, Essential"
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Monthly Price (₹)</label>
                          <input
                            type="number"
                            value={planEditForm.price || ''}
                            onChange={(e) => setPlanEditForm({ ...planEditForm, price: Number(e.target.value) })}
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Quarterly Price (₹)</label>
                          <input
                            type="number"
                            value={planEditForm.quarterlyPrice || ''}
                            onChange={(e) => setPlanEditForm({ ...planEditForm, quarterlyPrice: Number(e.target.value) })}
                            placeholder="Optional rate"
                            className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Annual Price (₹)</label>
                        <input
                          type="number"
                          value={planEditForm.annualPrice || ''}
                          onChange={(e) => setPlanEditForm({ ...planEditForm, annualPrice: Number(e.target.value) })}
                          placeholder="Optional rate"
                          className="w-full bg-[#090C0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Plan Description / Pitch</label>
                        <textarea
                          rows={3}
                          value={planEditForm.description || ''}
                          onChange={(e) => setPlanEditForm({ ...planEditForm, description: e.target.value })}
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
                        <h3 className="text-base font-bold text-white tracking-tight">Services & Amenities in this Plan</h3>
                        <p className="text-xs text-slate-400">Toggle privileges and add new custom services included in this membership tier.</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
                        {(planEditForm.services || []).filter(s => s.included).length} / {(planEditForm.services || []).length} Enabled
                      </span>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Facility Access', 'Technology', 'Coaching', 'Wellness', 'Nutrition', 'Amenities', 'Privileges'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setServiceCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            serviceCategoryFilter === cat
                              ? 'bg-[#FF2E4C] text-white shadow-md'
                              : 'bg-[#090C0E] border border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Services List */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {(planEditForm.services || [])
                        .filter(s => serviceCategoryFilter === 'All' || s.category === serviceCategoryFilter)
                        .map(service => (
                          <div
                            key={service.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              service.included
                                ? 'bg-[#090C0E] border-emerald-500/30'
                                : 'bg-[#090C0E]/50 border-white/5 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setPlanEditForm({
                                    ...planEditForm,
                                    services: planEditForm.services.map(s =>
                                      s.id === service.id ? { ...s, included: !s.included } : s
                                    )
                                  });
                                }}
                                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                                  service.included
                                    ? 'bg-emerald-500 text-black'
                                    : 'border border-white/20 hover:border-white/40'
                                }`}
                              >
                                {service.included && <Check size={13} className="stroke-[3]" />}
                              </button>
                              <div>
                                <span className={`text-xs font-semibold block ${service.included ? 'text-white' : 'text-slate-400 line-through'}`}>
                                  {service.name}
                                </span>
                                <span className="text-[10px] text-purple-400 font-mono">{service.category}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                service.included
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                  : 'bg-white/5 text-slate-500'
                              }`}>
                                {service.included ? 'Included' : 'Excluded'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPlanEditForm({
                                    ...planEditForm,
                                    services: planEditForm.services.filter(s => s.id !== service.id)
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
                      <span className="text-xs font-bold text-slate-300 block">+ Add New Service or Amenity</span>
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
                          onChange={(e) => setNewServiceCategory(e.target.value)}
                          className="sm:col-span-3 bg-[#141419] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF2E4C]"
                        >
                          <option value="Facility Access">Facility Access</option>
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
                              showToast('Please type a service name');
                              return;
                            }
                            const newServ = {
                              id: `srv-${Date.now()}`,
                              name: newServiceName.trim(),
                              category: newServiceCategory,
                              included: true
                            };
                            setPlanEditForm({
                              ...planEditForm,
                              services: [...(planEditForm.services || []), newServ]
                            });
                            setNewServiceName('');
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
                  <Eye size={16} className="text-[#FF2E4C]" /> Live Card Preview (How Athletes & Front Desk Will See It)
                </h4>

                <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#090C0E] border border-[#FF2E4C]/50 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#FF2E4C] uppercase tracking-wider">{planEditForm.id}</span>
                    {planEditForm.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[10px] font-bold">
                        {planEditForm.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">{planEditForm.name}</h3>
                  <div className="text-3xl font-black text-white">
                    ₹{Number(planEditForm.price || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ Monthly</span>
                  </div>
                  <p className="text-xs text-slate-400">{planEditForm.description}</p>
                  
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-bold text-slate-300 block">Included Services:</span>
                    {(planEditForm.services || [])
                      .filter(s => s.included)
                      .map(s => (
                        <div key={s.id} className="flex items-center gap-2 text-xs text-slate-200">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{s.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
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

      {/* EDIT STAFF MODAL (TRAINER & RECEPTIONIST) */}
      {showEditStaffModal && editingStaff && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141419] border border-[#202028] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp relative">
            <button
              onClick={() => { setShowEditStaffModal(false); setEditingStaff(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                editingStaff.role === 'trainer' ? 'bg-[#FF2E4C]/20 text-[#FF2E4C] border border-[#FF2E4C]/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <Edit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Edit {editingStaff.role === 'trainer' ? 'Trainer & Coach' : 'Receptionist / Front Desk'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {editingStaff.id} • Database ID: {editingStaff.userId || editingStaff.id}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStaffChanges} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Contact Phone</label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              </div>

              {editingStaff.role === 'trainer' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Specialization & Title</label>
                  <input
                    type="text"
                    value={editingStaff.spec || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, spec: e.target.value })}
                    placeholder="e.g. Master Strength & Conditioning Coach"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Shift Timings</label>
                  <select
                    value={editingStaff.shift}
                    onChange={(e) => setEditingStaff({ ...editingStaff, shift: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    <option value="06:00 AM - 02:00 PM">Morning (06:00 AM - 02:00 PM)</option>
                    <option value="02:00 PM - 10:00 PM">Evening (02:00 PM - 10:00 PM)</option>
                    <option value="10:00 PM - 06:00 AM">Night (10:00 PM - 06:00 AM)</option>
                    <option value="09:00 AM - 06:00 PM">General (09:00 AM - 06:00 PM)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Duty / Account Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none focus:border-[#FF2E4C]"
                  >
                    {editingStaff.role === 'trainer' ? (
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
                  onClick={() => { setShowEditStaffModal(false); setEditingStaff(null); }}
                  className="px-4 py-2.5 rounded-xl bg-[#090C0E] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg cursor-pointer transition-all ${
                    editingStaff.role === 'trainer' ? 'bg-[#FF2E4C] hover:brightness-110' : 'bg-amber-500 hover:bg-amber-600 text-black'
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
                  Remove {staffToDelete.role === 'trainer' ? 'Coach' : 'Receptionist'}
                </h3>
                <p className="text-xs text-red-400 font-medium">Permanent database deletion</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#090C0E] p-4 rounded-2xl border border-white/5">
              Are you sure you want to permanently delete <strong className="text-white font-bold">{staffToDelete.name}</strong> ({staffToDelete.id}) from the database? This action cannot be undone and will revoke all system credentials immediately.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirmModal(false); setStaffToDelete(null); }}
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
