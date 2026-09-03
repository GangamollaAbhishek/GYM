import React, { useEffect, useState } from "react";
import {
  Globe,
  Users,
  Dumbbell,
  Activity,
  Radio,
  MapPin,
  Zap,
  Pause,
  Play,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/utils";

/**
 * ============================================================================
 * TITAN PULSE INDIA BRANCHES ORBIT CONFIGURATION
 * 3D Solar System style orbit layers representing gym hubs across India.
 * ============================================================================
 */

const DEFAULT_INDIA_ORBITS = [
  {
    id: "inner",
    name: "Tier 1 Metro Core",
    radiusClass: "var(--radius-inner)",
    speed: 22,
    items: [
      {
        id: "mumbai",
        label: "Mumbai",
        branchName: "BKC Titan Flagship",
        region: "Maharashtra • West Zone",
        members: "4,820 Active",
        color: "#FF2E4C",
        badge: "FLAGSHIP",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "delhi",
        label: "Delhi NCR",
        branchName: "Cyber City Powerhouse",
        region: "NCR • North Zone",
        members: "5,150 Active",
        color: "#00F0FF",
        badge: "MEGA HUB",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "bengaluru",
        label: "Bengaluru",
        branchName: "Indiranagar TechFit",
        region: "Karnataka • South Zone",
        members: "6,200 Active",
        color: "#FFB800",
        badge: "TECH HUB",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "hyderabad",
        label: "Hyderabad",
        branchName: "HITEC City CyberGym",
        region: "Telangana • South Zone",
        members: "3,940 Active",
        color: "#A855F7",
        badge: "24/7 SYNC",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
  {
    id: "mid",
    name: "Expansion Hubs",
    radiusClass: "var(--radius-mid)",
    speed: 34,
    items: [
      {
        id: "chennai",
        label: "Chennai",
        branchName: "ECR Seaside Arena",
        region: "Tamil Nadu • South Zone",
        members: "3,410 Active",
        color: "#3B82F6",
        badge: "OCEAN FIT",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "kolkata",
        label: "Kolkata",
        branchName: "Salt Lake Velocity",
        region: "West Bengal • East Zone",
        members: "2,980 Active",
        color: "#EC4899",
        badge: "EAST HQ",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "pune",
        label: "Pune",
        branchName: "Koregaon Park Iron",
        region: "Maharashtra • West Zone",
        members: "3,120 Active",
        color: "#00F5D4",
        badge: "HIGH ALT",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
  {
    id: "outer",
    name: "Regional Arenas",
    radiusClass: "var(--radius-outer)",
    speed: 48,
    items: [
      {
        id: "ahmedabad",
        label: "Ahmedabad",
        branchName: "SG Highway Arena",
        region: "Gujarat • West Zone",
        members: "2,450 Active",
        color: "#EAB308",
        badge: "POWER ZONE",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "jaipur",
        label: "Jaipur",
        branchName: "Pink City Titan",
        region: "Rajasthan • North Zone",
        members: "2,100 Active",
        color: "#FF6F30",
        badge: "ROYAL FIT",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "chandigarh",
        label: "Chandigarh",
        branchName: "Sector 17 Velocity",
        region: "Punjab • North Zone",
        members: "2,630 Active",
        color: "#10B981",
        badge: "CROSSFIT",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: "kochi",
        label: "Kochi",
        branchName: "Marine Drive Hub",
        region: "Kerala • South Zone",
        members: "1,980 Active",
        color: "#06B6D4",
        badge: "HYDRO FIT",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
];

/**
 * 3D Solar System Orbit Component customized for India Gym Branches
 */
function IndiaBranchesSolarSystem({
  orbits = DEFAULT_INDIA_ORBITS,
  isPaused = false,
  speedMultiplier = 1,
  onSelectBranch,
  selectedBranch,
  className,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  // Cosmic telemetry dust particles
  const dustItems = [
    { delay: "-4s", radius: "165px", color: "#FF2E4C" },
    { delay: "-11s", radius: "260px", color: "#00F0FF" },
    { delay: "-19s", radius: "340px", color: "#FFB800" },
    { delay: "-28s", radius: "395px", color: "#00F5D4" },
    { delay: "-7s", radius: "200px", color: "#A855F7" },
    { delay: "-15s", radius: "365px", color: "#EC4899" },
    { delay: "-23s", radius: "430px", color: "#FF6F30" },
  ];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full max-w-[940px] h-[360px] md:h-[480px] perspective-[1200px] select-none overflow-visible",
        className,
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --radius-inner: 165px;
          --radius-mid: 275px;
          --radius-outer: 385px;
        }

        @media (max-width: 768px) {
          :root {
            --radius-inner: 105px;
            --radius-mid: 170px;
            --radius-outer: 235px;
          }
        }

        @media (max-width: 480px) {
          :root {
            --radius-inner: 75px;
            --radius-mid: 120px;
            --radius-outer: 165px;
          }
        }

        @keyframes india-orbitMove {
          0% {
            transform: translate(-50%, -50%) rotateZ(0deg) translateX(var(--orbit-radius));
          }
          100% {
            transform: translate(-50%, -50%) rotateZ(-360deg) translateX(var(--orbit-radius));
          }
        }

        @keyframes india-billboardCancel {
          0% {
            transform: translate(-50%, -50%) rotateZ(0deg) rotateY(10deg) rotateX(-65deg);
          }
          100% {
            transform: translate(-50%, -50%) rotateZ(360deg) rotateY(10deg) rotateX(-65deg);
          }
        }

        @keyframes india-sun-pulse {
          0% { transform: scale(0.92); opacity: 0.75; }
          100% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes india-spin-cw {
          0% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(360deg); }
        }
        @keyframes india-spin-ccw {
          0% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(-360deg); }
        }

        .animate-india-orbit {
          animation: india-orbitMove var(--orbit-duration) linear infinite;
          animation-play-state: var(--orbit-play-state);
        }
        .animate-india-billboard {
          animation: india-billboardCancel var(--orbit-duration) linear infinite;
          animation-play-state: var(--orbit-play-state);
        }
        .animate-india-sun-pulse {
          animation: india-sun-pulse 3.5s ease-in-out infinite alternate;
        }
        .animate-india-spin-cw {
          animation: india-spin-cw 20s linear infinite;
        }
        .animate-india-spin-ccw {
          animation: india-spin-ccw 30s linear infinite;
        }

        .orbit-branch-card {
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.4rem 0.85rem;
          background: rgba(12, 16, 20, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          user-select: none;
          cursor: pointer;
          pointer-events: auto;
          transition: border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s, scale 0.3s;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .orbit-branch-card:hover {
          background: rgba(18, 24, 30, 0.95);
        }
      `,
        }}
      />

      {/* Tiltable Orbit Container */}
      <div
        className="absolute w-[360px] h-[360px] md:w-[940px] md:h-[940px] flex items-center justify-center"
        style={{
          transform: "rotateX(65deg) rotateY(-10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Central Core Sun Node - TITAN INDIA HQ */}
        <div
          className="absolute w-[110px] h-[110px] md:w-[140px] md:h-[140px] flex items-center justify-center z-20 pointer-events-none"
          style={{
            transform: "rotateY(10deg) rotateX(-65deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glowing Aura */}
          <div className="absolute w-[95px] h-[95px] md:w-[125px] md:h-[125px] rounded-full filter blur-lg animate-india-sun-pulse z-10 bg-gradient-to-r from-[#FF2E4C]/30 to-[#00F0FF]/30" />

          {/* Central India HQ Core */}
          <div className="w-16 h-16 md:w-22 md:h-22 rounded-full border-2 border-[#FF2E4C]/60 shadow-[0_0_35px_rgba(255,46,76,0.4)] z-20 bg-[#090C0E] flex flex-col items-center justify-center p-2 relative">
            <Globe className="w-7 h-7 md:w-9 md:h-9 text-[#FF2E4C] animate-spin-slow" />
            <span className="text-[9px] md:text-[10px] font-mono font-extrabold text-[#00F0FF] tracking-wider uppercase mt-0.5">
              INDIA HQ
            </span>
          </div>

          {/* Sun Core Outer Dashed Orbit Rings */}
          <div className="absolute w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full border border-dashed border-[#FF2E4C]/30 animate-india-spin-cw pointer-events-none" />
          <div className="absolute w-[160px] h-[160px] md:w-[195px] md:h-[195px] rounded-full border border-dashed border-[#00F0FF]/20 animate-india-spin-ccw pointer-events-none" />
        </div>

        {/* Cosmic Dust Particles */}
        {dustItems.map((dust, idx) => (
          <div
            key={idx}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full opacity-50 pointer-events-none animate-india-orbit"
            style={{
              background: dust.color,
              boxShadow: `0 0 8px ${dust.color}`,
              animationDelay: dust.delay,
              animationPlayState: isPaused ? "paused" : "running",
              animationDuration: `${24 / speedMultiplier}s`,
              ["--orbit-radius"]: dust.radius,
              ["--orbit-duration"]: `${24 / speedMultiplier}s`,
              ["--orbit-play-state"]: isPaused ? "paused" : "running",
            }}
          />
        ))}

        {/* Orbit Rings and Indian City Nodes */}
        {orbits.map((orbit) => {
          return (
            <React.Fragment key={orbit.id}>
              {/* Visual Dashed Ring Line */}
              <div
                className="absolute rounded-full border border-dashed border-zinc-700/50 pointer-events-none"
                style={{
                  width: `calc(2 * ${orbit.radiusClass})`,
                  height: `calc(2 * ${orbit.radiusClass})`,
                  boxShadow:
                    "inset 0 0 30px rgba(255, 46, 76, 0.03), 0 0 30px rgba(0, 240, 255, 0.03)",
                  ["--orbit-radius"]: orbit.radiusClass,
                }}
              />

              {/* Orbit Branch Nodes */}
              {orbit.items.map((item, idx, arr) => {
                const delayValue = -(orbit.speed / arr.length) * idx;
                const durationValue = orbit.speed / speedMultiplier;
                const isHovered = hoveredId === item.id;
                const isSelected = selectedBranch?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none animate-india-orbit"
                    style={{
                      animationDelay: `${delayValue}s`,
                      animationDuration: `${durationValue}s`,
                      animationPlayState: isPaused ? "paused" : "running",
                      ["--orbit-radius"]: orbit.radiusClass,
                      ["--orbit-duration"]: `${durationValue}s`,
                      ["--orbit-play-state"]: isPaused ? "paused" : "running",
                      zIndex: isHovered || isSelected ? 30 : 10,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Laser Telemetry Beam from India HQ to Branch Node */}
                    <div
                      className="absolute right-0 top-1/2 h-[1.5px] origin-right -translate-y-1/2 pointer-events-none transition-opacity duration-300 z-0"
                      style={{
                        width: orbit.radiusClass,
                        opacity: isHovered || isSelected ? 1 : 0,
                        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 20%, ${item.color} 80%, ${item.color} 100%)`,
                        boxShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}50`,
                      }}
                    />

                    {/* Planet Card (Billboarded to face user directly) */}
                    <div
                      onMouseEnter={() => {
                        setHoveredId(item.id);
                        if (onSelectBranch) onSelectBranch(item);
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => {
                        if (onSelectBranch) onSelectBranch(item);
                      }}
                      className="orbit-branch-card animate-india-billboard"
                      style={{
                        animationDelay: `${delayValue}s`,
                        animationDuration: `${durationValue}s`,
                        animationPlayState: isPaused ? "paused" : "running",
                        borderColor:
                          isHovered || isSelected ? item.color : undefined,
                        boxShadow:
                          isHovered || isSelected
                            ? `0 0 25px rgba(0, 0, 0, 0.8), 0 0 18px ${item.color}50`
                            : undefined,
                        scale: isHovered || isSelected ? 1.12 : 1,
                        ["--orbit-duration"]: `${durationValue}s`,
                        ["--orbit-play-state"]: isPaused ? "paused" : "running",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="transition-transform duration-300 flex items-center justify-center"
                        style={{
                          transform:
                            isHovered || isSelected ? "scale(1.2)" : "scale(1)",
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* City Name */}
                      <span className="text-[11px] md:text-[13px] tracking-tight font-sans">
                        {item.label}
                      </span>

                      {/* Badge */}
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase text-white/90"
                        style={{
                          backgroundColor: `${item.color}25`,
                          border: `1px solid ${item.color}50`,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main TravelNetwork Component
 */
export default function TravelNetwork() {
  const [liveCheckIns, setLiveCheckIns] = useState(1420);
  const [liftedKg, setLiftedKg] = useState(24500);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(
    DEFAULT_INDIA_ORBITS[0].items[0],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCheckIns((prev) => prev + Math.floor(Math.random() * 3) - 1);
      setLiftedKg((prev) => prev + Math.floor(Math.random() * 25));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="locations"
      className="py-24 px-4 md:px-12 bg-[#090C0E] relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#FF2E4C]/10 via-[#00F0FF]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase flex items-center justify-center gap-2">
            <Radio size={14} className="animate-pulse text-[#FF2E4C]" /> INDIA
            TELEMETRY RADAR
          </span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            INDIA NETWORK{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] via-[#FFB800] to-[#00F0FF]">
              SYNCED ACROSS 12+ METROS
            </span>
          </h2>
          <p className="text-xs md:text-sm text-[#8A94A0] font-mono mt-3 max-w-xl mx-auto">
            Seamless access to any TITAN PULSE facility across India with
            single-pass biometric authentication. Hover over any branch orbit
            node to inspect live telemetry.
          </p>
        </div>

        {/* Live Active Check-Ins Ticker Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#12161A]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8A94A0] block uppercase">
                  LIVE INDIA MEMBERS TRAINING
                </span>
                <span className="text-2xl md:text-3xl font-extrabold font-heading text-white">
                  {liveCheckIns.toLocaleString()} Active Right Now
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#FF2E4C] bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 px-3 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E4C] animate-ping" />{" "}
              LIVE
            </span>
          </div>

          <div className="bg-[#12161A]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Dumbbell size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8A94A0] block uppercase">
                  DAILY TONNAGE MOVED IN INDIA
                </span>
                <span className="text-2xl md:text-3xl font-extrabold font-heading text-[#00F0FF]">
                  {liftedKg.toLocaleString()} KG
                </span>
              </div>
            </div>
            <Activity size={20} className="text-[#FF2E4C] animate-pulse" />
          </div>
        </div>

        {/* Interactive 3D Solar System Orbit Arena for Indian Cities */}
        <div className="relative bg-[#12161A]/90 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Controls Bar (Play/Pause & Speed Multiplier) */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-[#090C0E]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[#8A94A0] hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono uppercase"
            >
              {isPaused ? (
                <Play size={14} className="text-[#00F0FF]" />
              ) : (
                <Pause size={14} className="text-[#FF2E4C]" />
              )}
              <span>{isPaused ? "Resume Orbit" : "Pause Orbit"}</span>
            </button>

            <span className="w-px h-4 bg-white/20" />

            <button
              onClick={() =>
                setSpeedMultiplier((prev) =>
                  prev === 1 ? 1.75 : prev === 1.75 ? 0.5 : 1,
                )
              }
              className="text-[#8A94A0] hover:text-white transition-colors text-[11px] font-mono uppercase"
            >
              Speed: <span className="text-[#FFB800]">{speedMultiplier}x</span>
            </button>
          </div>

          {/* 3D Solar System Orbit Display */}
          <IndiaBranchesSolarSystem
            orbits={DEFAULT_INDIA_ORBITS}
            isPaused={isPaused}
            speedMultiplier={speedMultiplier}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
          />

          {/* Active Hovered / Selected Branch Info Banner */}
          {selectedBranch && (
            <div className="relative z-20 mt-4 md:mt-6 w-full max-w-xl bg-[#090C0E]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: `${selectedBranch.color}20`,
                    border: `1px solid ${selectedBranch.color}`,
                  }}
                >
                  <MapPin size={20} style={{ color: selectedBranch.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-extrabold font-heading text-lg">
                      {selectedBranch.branchName}
                    </h4>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold text-white"
                      style={{ backgroundColor: selectedBranch.color }}
                    >
                      {selectedBranch.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A94A0] font-mono">
                    {selectedBranch.region}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold font-mono text-white block">
                  {selectedBranch.members}
                </span>
                <span className="text-[10px] font-mono text-[#00F0FF] flex items-center justify-end gap-1">
                  <ShieldCheck size={12} /> Biometric Synced
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
