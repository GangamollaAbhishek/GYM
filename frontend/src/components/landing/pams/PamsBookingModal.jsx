import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function PamsBookingModal({ isOpen, onClose, initialActivity, onBookingSuccess }) {
  if (!isOpen) return null;

  const [activity, setActivity] = useState(initialActivity?.title || initialActivity?.name || "Gym & Strength");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(initialActivity?.time || "07:00 AM - 08:00 AM");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      activity,
      date,
      time,
      name: name || "Athlete Guest",
      contact: contact || "Direct Booking",
    };
    if (onBookingSuccess) onBookingSuccess(payload);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0C1015] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-heading font-black text-2xl text-white uppercase mb-2">
              SESSION CONFIRMED
            </h3>
            <p className="text-sm text-neutral-300 mb-6">
              Spot reserved for <strong className="text-white">{activity}</strong> on{" "}
              <span className="text-[#00F0FF]">{date}</span> at <span className="text-[#00F0FF]">{time}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF2E4C] mb-1">
                PAMS Pass Reservation
              </div>
              <h3 className="font-heading font-black text-2xl text-white uppercase">
                RESERVE YOUR SPOT
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Activity / Session
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Athlete Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Contact Phone or Email
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#FF2E4C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,46,76,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Confirm Instant Booking</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
