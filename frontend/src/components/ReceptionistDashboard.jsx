import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, LogOut, UserCheck, CalendarCheck, Clock, Search, CheckCircle, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

export default function ReceptionistDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [checkins, setCheckins] = useState([
    { id: '101', name: 'Rohan Mehta', pass: 'Titan Elite Pass', gate: 'Gate A1', time: '08:15 AM', status: 'Access Granted' },
    { id: '102', name: 'Ananya Roy', pass: '3D Telemetry Pass', gate: 'Gate B2', time: '08:42 AM', status: 'Access Granted' },
    { id: '103', name: 'Sneha Kapoor', pass: 'Titan Elite Pass', gate: 'Gate A1', time: '09:05 AM', status: 'Access Granted' },
  ]);

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!search) return;
    const newEntry = {
      id: Date.now().toString().slice(-3),
      name: search,
      pass: 'Walk-In / Verified Member',
      gate: 'Front Desk Terminal A1',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Access Granted'
    };
    setCheckins([newEntry, ...checkins]);
    showToast(`Checked in: ${search}`);
    setSearch('');
  };

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
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400 font-mono">
              RECEPTIONIST FRONT DESK
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#090C0E] border border-white/10 px-4 py-2 rounded-full">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center">
              {user?.name ? user.name.charAt(0) : 'R'}
            </div>
            <span className="text-xs font-bold text-white">{user?.name || 'Receptionist'}</span>
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
            <h1 className="text-3xl font-black font-heading uppercase text-white">GATE CHECK-IN TERMINAL</h1>
            <p className="text-xs text-[#8A94A0]">Live attendance check-in counter and visitor gate scanner control.</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono">
            ● SCANNER TERMINAL A1 ONLINE
          </span>
        </div>

        {/* Manual Check-in Form */}
        <form onSubmit={handleManualCheckIn} className="p-6 rounded-3xl bg-[#12161A] border border-white/10 flex gap-4 shadow-xl">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search member name or scan barcode / RFID ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#090C0E] border border-white/10 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#FF2E4C]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          </div>
          <button type="submit" className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2">
            <UserCheck size={16} /> Process Gate Access
          </button>
        </form>

        {/* Recent Attendance Stream */}
        <div className="p-6 rounded-3xl bg-[#12161A] border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-xl font-black font-heading text-white uppercase flex items-center gap-2">
            <CalendarCheck className="text-[#FF2E4C]" size={22} /> TODAY'S CHECK-IN LOGS ({checkins.length})
          </h3>
          <div className="space-y-3">
            {checkins.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#090C0E] border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-sans">{item.name}</h4>
                    <span className="text-[#FF2E4C]">{item.pass} • {item.gate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">✓ {item.status}</span>
                  <span className="text-[#8A94A0] text-[10px]">{item.time}</span>
                </div>
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
