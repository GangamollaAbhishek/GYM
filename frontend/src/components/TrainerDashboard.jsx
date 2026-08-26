import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, LogOut, Dumbbell, Users, Calendar, Award, CheckCircle, Sparkles, Plus } from 'lucide-react';

export default function TrainerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const clients = [
    { id: '1', name: 'Rohan Mehta', program: 'Hypertrophy 5x5', goal: 'Gain 4kg Lean Muscle', status: 'Scheduled 10:00 AM' },
    { id: '2', name: 'Ananya Roy', program: '3D Telemetry HIIT', goal: 'Fat Loss & Conditioning', status: 'Scheduled 02:00 PM' },
    { id: '3', name: 'Sneha Kapoor', program: 'Powerlifting Prep', goal: 'Deadlift PR 140kg', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#090C0E] text-white flex flex-col font-sans selection:bg-[#FF2E4C]">
      {/* Header */}
      <header className="h-20 px-8 bg-[#12161A] border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#FF2B35] flex items-center justify-center text-white shadow-lg">
            <Activity size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl text-white tracking-wider leading-none">
              TITAN<span className="text-[#FF2E4C]">•</span>PULSE
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-purple-400 font-mono">
              MASTER COACH PORTAL
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#090C0E] border border-white/10 px-4 py-2 rounded-full">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              {user?.name ? user.name.charAt(0) : 'T'}
            </div>
            <span className="text-xs font-bold text-white">{user?.name || 'Trainer'}</span>
          </div>
          <button onClick={() => { if (onLogout) onLogout(); navigate('/'); }} className="p-2 text-[#8A94A0] hover:text-[#FF2E4C]">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="p-8 max-w-6xl mx-auto w-full space-y-8 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-heading uppercase text-white">COACH SCHEDULE & CLIENTS</h1>
            <p className="text-xs text-[#8A94A0]">Manage personal training sessions, athlete workout plans, and physical progress.</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-purple-950/80 border border-purple-800 text-purple-400 text-xs font-mono">
            ★ MASTER COACH (24 ACTIVE CLIENTS)
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#8A94A0]">TODAY'S SESSIONS</span>
            <h3 className="text-3xl font-black font-heading text-white">6 Athletes</h3>
          </div>
          <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#8A94A0]">COACH RATING</span>
            <h3 className="text-3xl font-black font-heading text-amber-400">4.98 ★</h3>
          </div>
          <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#8A94A0]">SHIFT TIMING</span>
            <h3 className="text-2xl font-black font-heading text-purple-400">06:00 AM - 02:00 PM</h3>
          </div>
        </div>

        {/* Assigned Clients */}
        <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-xl font-black font-heading text-white uppercase flex items-center gap-2">
            <Dumbbell className="text-[#FF2E4C]" size={22} /> ASSIGNED ATHLETES & WORKOUT PLANS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clients.map(client => (
              <div key={client.id} className="p-5 rounded-2xl bg-[#090C0E] border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white text-base">{client.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-400 text-[10px] font-mono">
                      {client.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#FF2E4C] block">{client.program}</span>
                  <p className="text-xs text-[#8A94A0] mt-1">{client.goal}</p>
                </div>
                <button 
                  onClick={() => showToast(`Updated workout log for ${client.name}`)}
                  className="w-full py-2 rounded-xl bg-[#12161A] border border-white/10 hover:border-[#FF2E4C] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Log Workout Progress
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[160] px-5 py-3.5 rounded-2xl bg-[#12161A] border border-[#FF2E4C] text-white text-xs font-mono shadow-2xl flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF2E4C]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
