import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Dumbbell, 
  Clock, 
  Terminal, 
  Sparkles, 
  ShieldCheck,
  Award,
  UserCheck
} from 'lucide-react';
import './AuthModal.css';

export default function AddUserModal({ isOpen, onClose, onUserCreated }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Trainer Form State
  const [trainerData, setTrainerData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    spec: 'Hypertrophy & Powerlifting',
    shift: '06:00 AM - 02:00 PM'
  });

  // Receptionist Form State
  const [receptionistData, setReceptionistData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terminal: 'Gate Terminal A1',
    shift: 'Morning (06:00 - 14:00)'
  });

  if (!isOpen) return null;

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    if (!trainerData.name || !trainerData.email) {
      setErrorMsg('Please provide name and email for the trainer.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5050/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trainerData.name,
          email: trainerData.email,
          phone: trainerData.phone,
          password: trainerData.password || 'Trainer@123',
          role: 'trainer'
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data?.data) {
        if (onUserCreated) onUserCreated(data.data, 'trainer');
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to create trainer.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Backend connection error. Please try again.');
    }
  };

  const handleAddReceptionist = async (e) => {
    e.preventDefault();
    if (!receptionistData.name || !receptionistData.email) {
      setErrorMsg('Please provide name and email for the receptionist.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5050/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: receptionistData.name,
          email: receptionistData.email,
          phone: receptionistData.phone,
          password: receptionistData.password || 'Receptionist@123',
          role: 'receptionist'
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data?.data) {
        if (onUserCreated) onUserCreated(data.data, 'receptionist');
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to create receptionist.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Backend connection error. Please try again.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div 
        className="auth-wrapper" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="auth-close-btn"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Double Sliding Container */}
        <div 
          className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}
          style={{ height: '520px', maxHeight: '85vh' }}
        >
          
          {/* PANEL 1: ADD TRAINER (Sign In Slot) */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleAddTrainer} className="p-6 text-left">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-purple-400 bg-purple-950/80 border border-purple-800 px-3 py-0.5 rounded-full uppercase">
                  Master Coach
                </span>
                <Dumbbell className="text-purple-400" size={18} />
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Add New <span className="text-[#FF2E4C]">Trainer</span>
              </h2>
              <span className="text-xs text-slate-400 mb-3 block">
                Register a certified fitness coach for workout programming.
              </span>

              {errorMsg && !isRightPanelActive && (
                <div className="w-full p-2 mb-2 rounded-lg bg-red-950/70 border border-red-800 text-[#FF526B] text-xs text-center">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="text" 
                  placeholder="Trainer Full Name" 
                  value={trainerData.name}
                  onChange={(e) => setTrainerData({ ...trainerData, name: e.target.value })}
                  required
                />
                <User className="auth-input-icon" size={15} />
              </div>

              {/* Email */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="email" 
                  placeholder="Coach Email (trainer@...)" 
                  value={trainerData.email}
                  onChange={(e) => setTrainerData({ ...trainerData, email: e.target.value })}
                  required
                />
                <Mail className="auth-input-icon" size={15} />
              </div>

              {/* Phone */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="tel" 
                  placeholder="Phone (+91 98765 43210)" 
                  value={trainerData.phone}
                  onChange={(e) => setTrainerData({ ...trainerData, phone: e.target.value })}
                />
                <Phone className="auth-input-icon" size={15} />
              </div>

              {/* Password */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="password" 
                  placeholder="Temporary Password (e.g. Trainer@123)" 
                  value={trainerData.password}
                  onChange={(e) => setTrainerData({ ...trainerData, password: e.target.value })}
                />
                <Lock className="auth-input-icon" size={15} />
              </div>

              {/* Specialization */}
              <div className="auth-input-group !mb-3">
                <input 
                  type="text" 
                  placeholder="Specialization (e.g. Hypertrophy, CrossFit)" 
                  value={trainerData.spec}
                  onChange={(e) => setTrainerData({ ...trainerData, spec: e.target.value })}
                />
                <Award className="auth-input-icon text-purple-400" size={15} />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="auth-btn-primary w-full flex items-center justify-center gap-2 !py-2.5 font-semibold text-xs rounded-xl"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', borderColor: '#8B5CF6' }}
              >
                <UserCheck size={16} />
                {loading ? 'Saving to Database...' : 'Register Trainer'}
              </button>

              <div className="mobile-auth-switch">
                <span>Need to add receptionist?</span>
                <button type="button" onClick={() => setIsRightPanelActive(true)}>
                  Add Receptionist
                </button>
              </div>
            </form>
          </div>

          {/* PANEL 2: ADD RECEPTIONIST (Sign Up Slot) */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleAddReceptionist} className="p-6 text-left">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-0.5 rounded-full uppercase">
                  Front Desk
                </span>
                <Terminal className="text-amber-400" size={18} />
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Add <span className="text-amber-400">Receptionist</span>
              </h2>
              <span className="text-xs text-slate-400 mb-3 block">
                Register front desk staff for biometric gate attendance control.
              </span>

              {errorMsg && isRightPanelActive && (
                <div className="w-full p-2 mb-2 rounded-lg bg-red-950/70 border border-red-800 text-[#FF526B] text-xs text-center">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="text" 
                  placeholder="Receptionist Name" 
                  value={receptionistData.name}
                  onChange={(e) => setReceptionistData({ ...receptionistData, name: e.target.value })}
                  required
                />
                <User className="auth-input-icon" size={15} />
              </div>

              {/* Email */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="email" 
                  placeholder="Desk Email (receptionist@...)" 
                  value={receptionistData.email}
                  onChange={(e) => setReceptionistData({ ...receptionistData, email: e.target.value })}
                  required
                />
                <Mail className="auth-input-icon" size={15} />
              </div>

              {/* Phone */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="tel" 
                  placeholder="Contact Phone" 
                  value={receptionistData.phone}
                  onChange={(e) => setReceptionistData({ ...receptionistData, phone: e.target.value })}
                />
                <Phone className="auth-input-icon" size={15} />
              </div>

              {/* Password */}
              <div className="auth-input-group !mb-2">
                <input 
                  type="password" 
                  placeholder="Temporary Password (e.g. Desk@123)" 
                  value={receptionistData.password}
                  onChange={(e) => setReceptionistData({ ...receptionistData, password: e.target.value })}
                />
                <Lock className="auth-input-icon" size={15} />
              </div>

              {/* Terminal Slot */}
              <div className="auth-input-group !mb-3">
                <input 
                  type="text" 
                  placeholder="Assigned Gate (e.g. Gate Terminal A1)" 
                  value={receptionistData.terminal}
                  onChange={(e) => setReceptionistData({ ...receptionistData, terminal: e.target.value })}
                />
                <Terminal className="auth-input-icon text-amber-400" size={15} />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="auth-btn-primary w-full flex items-center justify-center gap-2 !py-2.5 font-semibold text-xs rounded-xl"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderColor: '#F59E0B' }}
              >
                <ShieldCheck size={16} />
                {loading ? 'Saving to Database...' : 'Register Receptionist'}
              </button>

              <div className="mobile-auth-switch">
                <span>Need to add trainer?</span>
                <button type="button" onClick={() => setIsRightPanelActive(false)}>
                  Add Trainer
                </button>
              </div>
            </form>
          </div>

          {/* SLIDING OVERLAY CONTAINER */}
          <div className="overlay-container">
            <div className="overlay" style={{ background: 'linear-gradient(135deg, #E50914 0%, #7F1D1D 50%, #090C0E 100%)' }}>
              
              {/* Overlay Left (Shown when adding Receptionist) */}
              <div className="overlay-panel overlay-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  Fitness Coach Registration
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Need a <span className="text-[#FF2E4C]">Trainer?</span>
                </h2>
                <p className="text-xs text-slate-200 leading-relaxed mb-4 max-w-[260px]">
                  Switch to coach onboarding to assign athletes, specialization tags, and training programs.
                </p>
                <button 
                  onClick={() => setIsRightPanelActive(false)} 
                  className="auth-btn-ghost flex items-center gap-2 font-semibold text-xs rounded-xl"
                >
                  <Dumbbell size={15} />
                  <span>Add Trainer</span>
                </button>
              </div>

              {/* Overlay Right (Shown when adding Trainer) */}
              <div className="overlay-panel overlay-right">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  Biometric Gate Staff
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Add <span className="text-amber-400">Receptionist?</span>
                </h2>
                <p className="text-xs text-slate-200 leading-relaxed mb-4 max-w-[260px]">
                  Assign front desk personnel for visitor badges, RFID gate control, and attendance logging.
                </p>
                <button 
                  onClick={() => setIsRightPanelActive(true)} 
                  className="auth-btn-ghost flex items-center gap-2 font-semibold text-xs rounded-xl"
                >
                  <Terminal size={15} />
                  <span>Add Receptionist</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
