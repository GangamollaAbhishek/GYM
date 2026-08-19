import React, { useState } from 'react';
import { Target, MapPin, Clock, Search, Sparkles } from 'lucide-react';

export default function SearchWidget({ onSearch }) {
  const [goal, setGoal] = useState('Muscle Building');
  const [location, setLocation] = useState('Downtown Metro');
  const [time, setTime] = useState('Evening (6 PM - 9 PM)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ goal, location, time });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#111111] rounded-3xl p-4 md:p-6 border border-[#292929] shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Goal Selector */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#050505] border border-[#292929] hover:border-[#F5C400]/50 transition-colors">
          <label className="text-[10px] font-mono tracking-widest text-[#F5C400] uppercase flex items-center gap-1.5">
            <Target size={12} /> Select Goal
          </label>
          <select 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#F2F2F0] focus:outline-none cursor-pointer [&>option]:bg-[#111111] [&>option]:text-[#F2F2F0]"
          >
            <option value="Muscle Building">Hypertrophy & Power</option>
            <option value="Fat Loss">Fat Loss & HIIT</option>
            <option value="Athletic Recovery">Athletic Mobility</option>
            <option value="Boxing">Combat Conditioning</option>
          </select>
        </div>

        {/* Location Selector */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#050505] border border-[#292929] hover:border-[#F5C400]/50 transition-colors">
          <label className="text-[10px] font-mono tracking-widest text-[#FFD21F] uppercase flex items-center gap-1.5">
            <MapPin size={12} /> Gym Branch
          </label>
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#F2F2F0] focus:outline-none cursor-pointer [&>option]:bg-[#111111] [&>option]:text-[#F2F2F0]"
          >
            <option value="Downtown Metro">Downtown Metro Arena</option>
            <option value="Westside Hub">Westside Power Lab</option>
            <option value="Uptown Studio">Uptown Elite Studio</option>
          </select>
        </div>

        {/* Time Selector */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#050505] border border-[#292929] hover:border-[#F5C400]/50 transition-colors">
          <label className="text-[10px] font-mono tracking-widest text-[#A6A6A6] uppercase flex items-center gap-1.5">
            <Clock size={12} /> Preferred Slot
          </label>
          <select 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#F2F2F0] focus:outline-none cursor-pointer [&>option]:bg-[#111111] [&>option]:text-[#F2F2F0]"
          >
            <option value="Morning">Morning (6 AM - 10 AM)</option>
            <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
            <option value="Evening">Evening (6 PM - 10 PM)</option>
            <option value="Night">Late Night (24/7 Access)</option>
          </select>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="h-full py-4 px-6 rounded-2xl bg-[#F5C400] hover:bg-[#FFD21F] font-heading font-extrabold text-sm uppercase tracking-wider text-[#050505] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,196,0,0.4)] transition-all duration-300 hover:scale-[1.02]"
        >
          <Search size={16} />
          Find Session
          <Sparkles size={14} />
        </button>

      </form>
    </div>
  );
}
