import React, { useState } from "react";
import { Star, ArrowRight, Check, ShieldCheck, Zap, Flame, Trophy, Waves, Dumbbell, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PACKAGES = [
  {
    id: "pams-pro",
    brand: "PAMS PASS",
    tier: "PRO",
    starColor: "text-zinc-300",
    starBg: "bg-zinc-700/60",
    badgeColor: "border-zinc-500/40 text-zinc-300",
    glowColor: "hover:border-zinc-400/50 hover:shadow-[0_10px_40px_rgba(255,255,255,0.08)]",
    headline: "Unlimited access to all Gym facilities in your city",
    tagline: "Dedicated gym strength, conditioning & workout tracking floor.",
    price: "₹679",
    period: "/mo*",
    billedInfo: "Starting at ₹679/mo billed annually or monthly plans",
    categories: ["GYM ONLY", "FREE WEIGHTS", "LOCKERS"],
    perks: [
      "Unlimited access to all PAMS Gym & Strength zones",
      "Free weight stations, Eleiko Olympic bars & dumbells up to 60kg",
      "PAMS mobile check-in & biometric attendance",
      "Locker room & shower access",
      "Standard fitness progress tracking",
    ],
    popular: false,
    recommendedFor: "Lifters & daily gym conditioning",
  },
  {
    id: "pams-elite",
    brand: "PAMS PASS",
    tier: "ELITE",
    starColor: "text-amber-400",
    starBg: "bg-amber-500/20",
    badgeColor: "border-amber-400/50 text-amber-400",
    glowColor: "border-amber-400/60 shadow-[0_10px_40px_rgba(251,191,36,0.18)] hover:shadow-[0_15px_50px_rgba(251,191,36,0.3)]",
    headline: "Unlimited access to all Group classes and Elite Gyms in your city",
    tagline: "Full Gym access + daily coach-led Yoga and high-energy Zumba classes.",
    price: "₹1,162",
    period: "/mo*",
    billedInfo: "Starting at ₹1,162/mo billed annually or flexible tiers",
    categories: ["GYM + FITNESS", "YOGA", "ZUMBA", "ELITE GYMS"],
    perks: [
      "Everything in PAMS PRO pass",
      "Unlimited daily Yoga & Mobility group classes",
      "Unlimited high-tempo Zumba dance cardio workouts",
      "Access to all Elite + Pro Gym locations across the network",
      "Complimentary body composition bio-assessment every quarter",
      "2 free guest passes per month",
    ],
    popular: true,
    recommendedFor: "Gym lifters who also want studio fitness & yoga",
  },
  {
    id: "pams-titan",
    brand: "PAMS PASS",
    tier: "TITAN DUAL",
    starColor: "text-[#00F0FF]",
    starBg: "bg-[#00F0FF]/20",
    badgeColor: "border-[#00F0FF]/50 text-[#00F0FF]",
    glowColor: "border-[#00F0FF]/60 shadow-[0_10px_40px_rgba(0,240,255,0.2)] hover:shadow-[0_15px_50px_rgba(0,240,255,0.35)]",
    headline: "The Ultimate Combination: All Gyms + Fitness Classes + All Sports Arenas",
    tagline: "Total freedom across Gym, Yoga, Zumba, Basketball, Badminton, and Swimming.",
    price: "₹1,899",
    period: "/mo*",
    billedInfo: "Starting at ₹1,899/mo for complete Gym + Sports ecosystem",
    categories: ["GYM + SPORTS", "BASKETBALL", "BADMINTON", "SWIMMING", "CLASSES"],
    perks: [
      "Everything in PAMS ELITE pass",
      "Unlimited Basketball hardwood court reservation slots",
      "Unlimited Badminton tournament-grade synthetic court bookings",
      "Heated Semi-Olympic Swimming Pool lane bookings",
      "2 monthly 1-on-1 sports skills & conditioning coaching clinics",
      "Priority prime-time peak hour slot bookings (6 AM - 10 PM)",
    ],
    popular: false,
    featuredCombo: true,
    recommendedFor: "Athletes wanting both Gym lifting and Sports competition",
  },
  {
    id: "pams-sports",
    brand: "PAMS PASS",
    tier: "SPORTS PRO",
    starColor: "text-emerald-400",
    starBg: "bg-emerald-500/20",
    badgeColor: "border-emerald-400/50 text-emerald-400",
    glowColor: "hover:border-emerald-400/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]",
    headline: "Dedicated access to all Sports arenas, courts & aquatic centers",
    tagline: "Hardwood basketball courts, badminton halls, and heated swimming pools.",
    price: "₹1,349",
    period: "/mo*",
    billedInfo: "Starting at ₹1,349/mo for complete racquet, court & pool access",
    categories: ["SPORTS ONLY", "COURTS", "POOL", "LEAGUES"],
    perks: [
      "Access to all PAMS Basketball arenas (FIBA standard)",
      "Access to all Badminton halls (BWF tournament vinyl)",
      "Daily heated lap swimming pool lanes",
      "Weekend community tournament & scrimmage entry",
      "Locker room, gear rental discounts & shower access",
    ],
    popular: false,
    recommendedFor: "Court players & swimmers focused on sport",
  },
];

export default function PamsMemberships({ onSelectPlan, user }) {
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
  const navigate = useNavigate();

  const handlePlanClick = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
      return;
    }
    if (user) {
      navigate("/account?tab=payments");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="memberships-section" className="py-24 bg-[#090C0E] relative overflow-hidden border-t border-white/[0.04]">
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#FF2E4C]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#00F0FF]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-[#00F0FF] mb-3">
            <Zap size={13} />
            <span>PAMS Membership Passes</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            CHOOSE YOUR PASS. MOVE YOUR WAY.
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Flexible passes tailored for every lifestyle. Choose dedicated <strong>Gym access</strong>,
            level up to <strong>Group Classes</strong>, or unlock the unified <strong>Gym + Sports combination</strong>.
          </p>
        </div>

        {/* 4-Card Cultpass-Inspired Grid (PRO, ELITE, TITAN DUAL COMBO, SPORTS PRO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-7 bg-[#0C1015]/95 backdrop-blur-2xl border flex flex-col justify-between transition-all duration-500 relative group hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
                pkg.featuredCombo
                  ? "border-[#00F0FF]/50 shadow-[0_15px_45px_rgba(0,240,255,0.18)] hover:shadow-[0_25px_60px_rgba(0,240,255,0.32)]"
                  : pkg.popular
                  ? "border-amber-400/50 shadow-[0_15px_45px_rgba(251,191,36,0.15)] hover:shadow-[0_25px_60px_rgba(251,191,36,0.28)]"
                  : "border-white/[0.08] hover:border-white/25"
              }`}
            >
              {/* Top combo highlight badge if applicable */}
              {pkg.featuredCombo && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#00F0FF] to-[#38BDF8] text-black font-heading font-black text-[10px] uppercase tracking-widest shadow-md">
                  ★ Flagship Gym + Sports
                </div>
              )}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-heading font-black text-[10px] uppercase tracking-widest shadow-md">
                  ★ Most Popular Pass
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                      {pkg.brand}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${pkg.starBg} flex items-center justify-center border border-white/10`}>
                        <Star size={13} fill="currentColor" className={pkg.starColor} />
                      </div>
                      <h3 className={`font-heading font-black text-2xl uppercase tracking-wider text-white`}>
                        {pkg.tier}
                      </h3>
                    </div>
                  </div>

                  {/* Cult-like symbol watermark */}
                  <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                    <span className="text-xs font-mono font-bold">P</span>
                  </div>
                </div>

                {/* Main Headline description (matching user's reference card format) */}
                <div className="min-h-[54px] mb-4">
                  <p className="text-sm font-semibold text-neutral-200 leading-snug">
                    {pkg.headline}
                  </p>
                </div>

                {/* Category tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {pkg.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[9px] font-mono font-bold tracking-wider text-neutral-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/[0.08] mb-5" />

                {/* Included Perks List */}
                <div className="space-y-2 mb-6">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
                    Pass Includes:
                  </div>
                  {pkg.perks.slice(0, 4).map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="line-clamp-2 leading-tight">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Price & CTA Area */}
              <div className="pt-4 border-t border-white/[0.07] flex items-end justify-between gap-2">
                <div>
                  <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    STARTING AT
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                      {pkg.price}
                    </span>
                    <span className="text-neutral-400 text-xs font-semibold">
                      {pkg.period}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPackageDetails(pkg)}
                  className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 cursor-pointer shrink-0 ${
                    pkg.featuredCombo
                      ? "bg-[#00F0FF] text-black hover:bg-[#70f7ff]"
                      : pkg.popular
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  KNOW MORE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COMBINATION PROMO BANNER */}
        <div className="mt-14 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#0E131A] via-[#101722] to-[#0E131A] border border-[#00F0FF]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#00F0FF]/10 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF2E4C] via-[#FF526B] to-[#00F0FF] p-[1.5px] shrink-0 shadow-[0_0_25px_rgba(255,46,76,0.3)]">
              <div className="w-full h-full bg-[#080A0E] rounded-[14px] flex items-center justify-center text-white">
                <Dumbbell size={22} className="text-[#FF2E4C]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[10px] font-bold uppercase tracking-wider text-[#00F0FF]">
                  Flexible Combination Pass
                </span>
                <span className="text-xs text-neutral-400">• Gym + Court + Pool</span>
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white mt-1.5 tracking-tight uppercase">
                BUILD YOUR OWN CUSTOM COMBO PASS
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1 leading-relaxed">
                Want 3 days of Gym strength conditioning and 2 days of Badminton or Swimming per week?
                Our hybrid plans let you combine any fitness discipline with any sports arena at exclusive bundle rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => handlePlanClick({ name: "Custom Gym + Sports Combo" })}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF2E4C] via-[#FF2E4C] to-[#00F0FF] text-white font-heading font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(0,240,255,0.25)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              Configure Combo Pass
            </button>
          </div>
        </div>

        {/* DETAILS MODAL ("KNOW MORE") */}
        {selectedPackageDetails && (
          <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#12161A] border border-white/15 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setSelectedPackageDetails(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full ${selectedPackageDetails.starBg} flex items-center justify-center`}>
                  <Star size={15} fill="currentColor" className={selectedPackageDetails.starColor} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  {selectedPackageDetails.brand}
                </span>
              </div>

              <h3 className="font-heading font-black text-3xl text-white uppercase mb-2">
                {selectedPackageDetails.tier}
              </h3>

              <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
                {selectedPackageDetails.tagline}
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Pricing & Terms:
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-black text-3xl text-white">
                    {selectedPackageDetails.price}
                  </span>
                  <span className="text-xs text-neutral-400">{selectedPackageDetails.period}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {selectedPackageDetails.billedInfo}
                </div>
              </div>

              <div className="space-y-2.5 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  Full Pass Entitlements:
                </div>
                {selectedPackageDetails.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const chosen = selectedPackageDetails;
                    setSelectedPackageDetails(null);
                    handlePlanClick(chosen);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select {selectedPackageDetails.tier} Pass</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
