import React, { useState } from "react";
import { Calendar, Clock, MapPin, Dumbbell, Sparkles, Flame, Activity, Trophy, Waves, CheckCircle2, ArrowRight } from "lucide-react";

const ACTIVITIES = [
  { id: "gym", name: "Gym & Strength Training", category: "Fitness", icon: Dumbbell, color: "#FF2E4C" },
  { id: "yoga", name: "Yoga & Mindful Mobility", category: "Fitness", icon: Sparkles, color: "#00F0FF" },
  { id: "zumba", name: "Zumba High-Energy Dance", category: "Fitness", icon: Flame, color: "#A855F7" },
  { id: "basketball", name: "Basketball Hardwood Arena", category: "Sports", icon: Activity, color: "#F59E0B" },
  { id: "badminton", name: "Badminton Tournament Court", category: "Sports", icon: Trophy, color: "#10B981" },
  { id: "swimming", name: "Heated Semi-Olympic Pool", category: "Sports", icon: Waves, color: "#00F0FF" },
];

const LOCATIONS = [
  "PAMS Flagship Hub (Downtown Arena)",
  "PAMS North Olympic Sports Park",
  "PAMS East Fitness Complex",
];

const TIME_SLOTS = [
  "06:30 AM - 07:30 AM",
  "08:00 AM - 09:00 AM",
  "10:30 AM - 11:30 AM",
  "04:30 PM - 05:30 PM",
  "06:00 PM - 07:00 PM",
  "07:30 PM - 08:30 PM",
];

export default function PamsBookSession({ onBookingSubmit }) {
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const activeActivityObj = ACTIVITIES.find((a) => a.id === selectedActivity) || ACTIVITIES[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      activity: activeActivityObj.name,
      category: activeActivityObj.category,
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      fullName: fullName || "Guest Athlete",
      emailOrPhone: emailOrPhone || "Provided in Profile",
    };

    if (onBookingSubmit) {
      onBookingSubmit(bookingData);
    }
    setConfirmed(true);
  };

  return (
    <section id="book-session-section" className="py-24 sm:py-32 bg-[#07090C] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FF2E4C]/5 blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-neutral-300 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="uppercase tracking-[0.2em] text-[11px] text-[#00F0FF] font-bold">Instant Access</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            READY TO <span className="text-gradient-silver">GET MOVING?</span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base font-light">
            Choose an activity. Pick your preferred time slot. Secure your spot in under 60 seconds.
          </p>
        </div>

        {/* Booking Card Form Container */}
        <div className="rounded-3xl bg-[#0C1015] border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-6 sm:p-10 lg:p-12">
          {confirmed ? (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 animate-in zoom-in-50 duration-300">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-heading font-black text-3xl text-white uppercase mb-2">
                SESSION RESERVED!
              </h3>
              <p className="text-sm text-neutral-300 mb-6">
                Your spot for <span className="text-white font-bold">{activeActivityObj.name}</span> has
                been logged for <span className="text-[#00F0FF] font-semibold">{selectedDate}</span> at{" "}
                <span className="text-[#00F0FF] font-semibold">{selectedTime}</span>.
              </p>
              <div className="p-4 rounded-2xl bg-[#07090C] border border-white/[0.07] text-xs text-neutral-400 text-left mb-6 space-y-1">
                <div><strong className="text-white">Facility:</strong> {selectedLocation}</div>
                <div><strong className="text-white">Pass Holder:</strong> {fullName || "Athlete Pass"}</div>
                <div><strong className="text-white">Confirmation ID:</strong> PAMS-{Math.floor(100000 + Math.random() * 900000)}</div>
              </div>
              <button
                onClick={() => setConfirmed(false)}
                className="px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Book Another Session
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: CHOOSE ACTIVITY */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
                  1. Choose Activity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {ACTIVITIES.map((act) => {
                    const Icon = act.icon;
                    const isSelected = selectedActivity === act.id;
                    return (
                      <button
                        type="button"
                        key={act.id}
                        onClick={() => setSelectedActivity(act.id)}
                        className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-white/[0.07] border-[#FF2E4C] shadow-[0_0_20px_rgba(255,46,76,0.25)]"
                            : "bg-[#07090C]/60 border-white/[0.06] hover:border-white/20 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform"
                          style={{
                            backgroundColor: isSelected ? act.color : "rgba(255,255,255,0.04)",
                            color: isSelected ? "#07090C" : "#9CA3AF",
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="text-xs font-bold text-white truncate max-w-full">
                          {act.name.split(" ")[0]}
                        </div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                          {act.category}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2 & 3: LOCATION & DATE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FF2E4C]" />
                    <span>2. Choose Location</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#FF2E4C] transition-colors"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#0C1015] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#00F0FF]" />
                    <span>3. Choose Date</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00F0FF] transition-colors"
                  />
                </div>
              </div>

              {/* STEP 4: TIME SLOTS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Clock size={13} className="text-purple-400" />
                  <span>4. Choose Time Slot</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#FF2E4C] border-[#FF2E4C] text-white shadow-[0_0_18px_rgba(255,46,76,0.35)]"
                            : "bg-[#07090C]/60 border-white/[0.06] text-neutral-300 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {slot.split(" - ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ATHLETE DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.06]">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Athlete Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#FF2E4C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Phone or Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="alex@example.com or +91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-[#07090C] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00F0FF] transition-colors"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#00F0FF]" />
                  <span>Free cancellation up to 2 hours before session start time.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white font-heading font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_25px_rgba(255,46,76,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Reservation</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
