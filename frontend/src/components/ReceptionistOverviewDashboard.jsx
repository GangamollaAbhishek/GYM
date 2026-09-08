import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChatCircle,
  Brain,
  Database,
  TerminalWindow,
  FileText,
  Check,
  CircleNotch,
  Clock,
  Minus,
  Globe,
  ShieldCheck,
  Users,
  CreditCard,
} from "@phosphor-icons/react";
import { cn } from "../lib/utils";

/* ──────────────────────────────────────────────────────
   Bento Card Wrapper with Sleek Carbon Dark Aesthetics
────────────────────────────────────────────────────── */
export function FeatCard({ title, description, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-[20px] p-4.5",
        "bg-[#121318] border border-white/[0.06] hover:border-white/[0.12]",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.4)]",
        "transition-all duration-300",
        className
      )}
    >
      <div className="z-10 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-outfit font-bold text-white text-sm tracking-normal flex items-center gap-2">
            {title}
          </h3>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-slate-400 text-xs leading-relaxed max-w-[95%] font-normal">
          {description}
        </p>
      </div>
      <div className="relative mt-2 flex-1 w-full rounded-[14px] overflow-hidden border border-white/[0.06] bg-[#0c0e12]/80">
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Card 1 – Access & Routing Pipeline Graph
───────────────────────────────────────────── */
const VW = 320;
const VH = 240;

const NODES = [
  { id: 'A', x: 50, y: 120, icon: ChatCircle, label: "CHECKIN", type: 'box' },
  { id: 'Router', x: 125, y: 120, type: 'circle' },
  { id: 'C', x: 200, y: 120, icon: Brain, label: "VALIDATE", type: 'box' },
  { id: 'B', x: 280, y: 50, icon: Database, label: "MEMBERS", type: 'box' },
  { id: 'D', x: 280, y: 190, icon: TerminalWindow, label: "GATES", type: 'box' },
];

const PATHS = [
  {
    id: "a-to-router",
    d: "M 78 120 L 113 120",
    activeSteps: ["request"],
    flowDirection: "forward",
    colorClass: "text-cyan-400",
  },
  {
    id: "router-to-agent",
    d: "M 137 120 L 172 120",
    activeSteps: ["agent"],
    flowDirection: "forward",
    colorClass: "text-violet-400",
  },
  {
    id: "agent-to-memory",
    d: "M 200 92 L 200 50 L 252 50",
    activeSteps: ["memory"],
    flowDirection: "both",
    colorClass: "text-fuchsia-400",
  },
  {
    id: "agent-to-tools",
    d: "M 200 148 L 200 190 L 252 190",
    activeSteps: ["tools"],
    flowDirection: "both",
    colorClass: "text-emerald-400",
  },
  {
    id: "response-flow-1",
    d: "M 172 120 L 137 120",
    activeSteps: ["response"],
    flowDirection: "forward",
    colorClass: "text-cyan-400",
  },
  {
    id: "response-flow-2",
    d: "M 113 120 L 78 120",
    activeSteps: ["response"],
    flowDirection: "forward",
    colorClass: "text-cyan-400",
  },
];

const NODE_COLORS = {
  A: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-400/50",
    text: "text-cyan-400",
    buttonBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    buttonBorder: "border-cyan-400/60",
  },
  Router: {
    bg: "bg-amber-500/10",
    border: "border-amber-400/50",
    text: "text-amber-400",
    buttonBg: "bg-amber-500",
    buttonBorder: "border-amber-600",
  },
  C: {
    bg: "bg-violet-500/10",
    border: "border-violet-400/50",
    text: "text-violet-400",
    buttonBg: "bg-gradient-to-br from-violet-500 to-violet-700",
    buttonBorder: "border-violet-400/60",
  },
  B: {
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-400/50",
    text: "text-fuchsia-400",
    buttonBg: "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700",
    buttonBorder: "border-fuchsia-400/60",
  },
  D: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/50",
    text: "text-emerald-400",
    buttonBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    buttonBorder: "border-emerald-400/60",
  },
};

export function Card1() {
  const [step, setStep] = useState("request");

  useEffect(() => {
    const steps = ["request", "router", "agent", "memory", "tools", "response"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setStep(steps[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isNodeActive = (nodeId) => {
    switch (step) {
      case 'request':
        return nodeId === 'A';
      case 'router':
        return nodeId === 'Router';
      case 'agent':
        return nodeId === 'C';
      case 'memory':
        return nodeId === 'C' || nodeId === 'B';
      case 'tools':
        return nodeId === 'C' || nodeId === 'D';
      case 'response':
        return nodeId === 'C' || nodeId === 'Router' || nodeId === 'A';
      default:
        return false;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#090A0E] rounded-xl flex items-center justify-center p-2">
      {/* Background Dotted Grid */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <pattern id="clean-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="currentColor" className="text-zinc-800/60" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#clean-grid)" />
      </svg>

      {/* Connection Paths & Nodes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path d="M 78 120 L 113 120" fill="none" stroke="currentColor" className="text-zinc-800" strokeWidth="1" />
        <path d="M 137 120 L 172 120" fill="none" stroke="currentColor" className="text-zinc-800" strokeWidth="1" />
        <path d="M 200 92 L 200 50 L 252 50" fill="none" stroke="currentColor" className="text-zinc-800" strokeWidth="1" />
        <path d="M 200 148 L 200 190 L 252 190" fill="none" stroke="currentColor" className="text-zinc-800" strokeWidth="1" />

        {PATHS.map((p) => {
          const isActive = p.activeSteps.includes(step);
          if (!isActive) return null;

          return (
            <g key={p.id}>
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="3.5"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {NODES.map((node) => {
          const isBox = node.type === 'box';
          const w = isBox ? 56 : 24;
          const h = isBox ? 56 : 24;
          const isActive = isNodeActive(node.id);
          const colorStyles = NODE_COLORS[node.id];

          return (
            <foreignObject
              key={node.id}
              x={node.x - w / 2}
              y={node.y - h / 2}
              width={w}
              height={h}
              className="overflow-visible"
            >
              <div className="w-full h-full flex items-center justify-center">
                {isBox && node.icon ? (
                  <div
                    className={`w-full h-full rounded-[14px] border flex flex-col items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_2px_6px_rgba(0,0,0,0.5)] text-white ${colorStyles.buttonBg} ${colorStyles.buttonBorder} transition-all duration-300 ${
                      isActive ? "scale-105 ring-2 ring-white/20" : "opacity-80"
                    }`}
                  >
                    <div className="mb-0.5 flex items-center justify-center">
                      <node.icon className="w-5 h-5" weight="fill" />
                    </div>
                    <span className="text-[8px] font-mono font-bold tracking-wider select-none">
                      {node.label}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-300 ${
                      isActive
                        ? "bg-amber-500/20 border-amber-400"
                        : "bg-neutral-900 border-zinc-700"
                    }`}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full border border-dashed ${
                        isActive ? "border-amber-400" : "border-zinc-500"
                      }`}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 2 – Live Gate Traffic & Capacity Monitor
───────────────────────────────────────────── */
export function Card2() {
  const bars = [45, 78, 52, 88, 64, 96, 70];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-between p-2.5">
      {/* Offset Sliding Stat Cards */}
      <div className="flex gap-3 pt-1">
        {[
          { label: "Turnstile Rate", value: "148/hr", trend: "+12%" },
          { label: "Scan Latency", value: "24ms", trend: "-8%" },
        ].map((s, i) => {
          const isActive = i === activeIdx || hoveredIdx === i;

          return (
            <div key={i} className="flex-1 h-[68px] relative select-none">
              {/* Scale Background */}
              <div
                className="absolute inset-0 rounded-xl border border-white/[0.04] bg-white/[0.02]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 7px)",
                }}
              />

              {/* Sliding Foreground Card */}
              <motion.div
                className="absolute inset-0 w-full h-full rounded-xl bg-[#14161F] border border-white/[0.08] shadow-md p-2.5 hover:border-white/20 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                animate={{
                  x: isActive ? "0.35rem" : "0rem",
                  y: isActive ? "-0.35rem" : "0rem",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] text-slate-400 font-mono uppercase tracking-widest leading-none">
                    {s.label}
                  </span>
                  <span className="text-sm font-bold font-mono text-white leading-none mt-1.5 tracking-tight">
                    {s.value}
                  </span>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span
                      className={`text-[8px] font-mono font-bold ${
                        s.trend.startsWith("+") ? "text-emerald-400" : "text-cyan-400"
                      }`}
                    >
                      {s.trend}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">optimal</span>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="w-10 h-5 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 48 24">
                    <motion.path
                      d={
                        i === 0
                          ? "M 0 18 L 16 10 L 32 14 L 48 4"
                          : "M 0 6 L 16 14 L 32 8 L 48 16"
                      }
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-500"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                    />
                    {[
                      { x: 0, y: i === 0 ? 18 : 6 },
                      { x: 16, y: i === 0 ? 10 : 14 },
                      { x: 32, y: i === 0 ? 14 : 8 },
                      { x: 48, y: i === 0 ? 4 : 16 },
                    ].map((pt, idx) => (
                      <motion.circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="1.5"
                        className="fill-[#FF2E4C] stroke-white/40"
                        strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.08, duration: 0.2 }}
                      />
                    ))}
                  </svg>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Peak Hour Vertical Bar Chart */}
      <div className="flex-1 flex items-end gap-2 px-1 min-h-[75px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 h-full rounded-xl bg-[#0a0b10] border border-white/[0.06] relative overflow-hidden"
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FF1E27] to-[#FF2E4C] border-t border-white/40 shadow-[0_0_10px_rgba(255,46,76,0.3)] rounded-t-[8px]"
              initial={{ height: "0%" }}
              animate={{
                height: [
                  `${h}%`,
                  `${Math.min(95, h + 12)}%`,
                  `${Math.max(15, h - 18)}%`,
                  `${Math.min(90, h + 6)}%`,
                  `${h}%`,
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + (i % 3) * 0.7,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          </div>
        ))}
      </div>

      {/* X Labels */}
      <div className="flex gap-2 px-1">
        {days.map((d, i) => (
          <p
            key={i}
            className="flex-1 text-center text-[7.5px] text-slate-500 font-mono font-medium"
          >
            {d}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 3 – Stacked Front Desk Live Activity Feed
───────────────────────────────────────────── */
const STATUS_ICONS = {
  done: {
    icon: Check,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    gradient: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    border: "border-emerald-600",
  },
  running: {
    icon: CircleNotch,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    gradient: "bg-gradient-to-b from-cyan-400 to-cyan-600",
    border: "border-cyan-600",
  },
  waiting: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    gradient: "bg-gradient-to-b from-amber-400 to-amber-600",
    border: "border-amber-600",
  },
  idle: {
    icon: Minus,
    color: "text-slate-400",
    bg: "bg-white/10",
    gradient: "bg-gradient-to-b from-slate-500 to-slate-700",
    border: "border-slate-600",
  },
};

export function Card3() {
  const logs = [
    { agent: "Turnstile Gate A1", action: "Rahul Sharma (CUST-301) NFC Clock-in", status: "done", t: "0.2s" },
    { agent: "Billing Concierge", action: "Priya Patel 6-mo Pro Renewal settled", status: "done", t: "1.4s" },
    { agent: "Biometric Scanner", action: "Verifying NFC pass token…", status: "running", t: "2.8s" },
    { agent: "Coach Shift Sync", action: "Coach Vikram checked in for Session 1", status: "waiting", t: "—" },
    { agent: "Station Gateway", action: "Turnstile Gate Alpha auto-released", status: "idle", t: "—" },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % logs.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [logs.length]);

  const getSlot = (i) => {
    const N = logs.length;
    let rel = i - activeIdx;
    if (rel > Math.floor(N / 2)) rel -= N;
    if (rel < -Math.floor(N / 2)) rel += N;
    return rel;
  };

  const Y = { "-2": -64, "-1": -34, "0": 0, "1": 34, "2": 64 };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden p-2">
      {logs.map((l, i) => {
        const slot = getSlot(i);
        const si = STATUS_ICONS[l.status] || STATUS_ICONS.idle;
        const abs = Math.abs(slot);
        const isActive = slot === 0;
        const isVisible = abs <= 2;

        const yOffset = Y[String(slot)] ?? (slot < 0 ? -120 : 120);
        const scale = isActive ? 1 : abs === 1 ? 0.93 : 0.86;
        const opacity = isActive ? 1 : abs === 1 ? 0.65 : 0.35;
        const zIndex = isActive ? 30 : abs === 1 ? 20 : 10;

        return (
          <motion.div
            key={l.agent}
            className="absolute left-0 right-0 mx-auto px-2"
            style={{ zIndex }}
            animate={{
              y: isVisible ? yOffset : slot < 0 ? -140 : 140,
              scale,
              opacity: isVisible ? opacity : 0,
            }}
            transition={{
              y: { type: "spring", stiffness: 480, damping: 34 },
              scale: { type: "spring", stiffness: 480, damping: 34 },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <div
              className={`w-full rounded-2xl border flex items-center gap-2.5 transition-all ${
                isActive
                  ? "px-3 py-2.5 bg-[#161822] border-white/[0.15] shadow-lg"
                  : "px-2.5 py-1.5 bg-[#101117] border-white/[0.05]"
              }`}
            >
              {/* 3D Icon Badge */}
              <div
                className={`shrink-0 rounded-[8px] flex items-center justify-center font-bold text-white transition-all duration-300 ${
                  si.gradient
                } border ${si.border} shadow-sm ${isActive ? "w-8 h-8" : "w-5 h-5"}`}
              >
                <si.icon
                  weight="bold"
                  className={`${isActive ? "w-4 h-4" : "w-2.5 h-2.5"} ${
                    l.status === "running" ? "animate-spin" : ""
                  }`}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-semibold text-white leading-none ${
                      isActive ? "text-[10px]" : "text-[9px]"
                    }`}
                  >
                    {l.agent}
                  </span>
                  <span
                    className={`font-mono uppercase tracking-wide rounded px-1 py-0.5 ${
                      si.bg
                    } ${si.color} ${isActive ? "text-[7px]" : "text-[6px]"}`}
                  >
                    {l.status}
                  </span>
                </div>
                {isActive && (
                  <p className="text-[9px] text-slate-300 truncate mt-0.5 leading-tight">
                    {l.action}
                  </p>
                )}
              </div>

              {isActive && (
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  {l.t}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Progress Dots */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
        {logs.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-white/30"
            animate={{
              width: i === activeIdx ? 14 : 4,
              opacity: i === activeIdx ? 0.8 : 0.2,
            }}
            style={{ height: 3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 4 – Member & Policy Knowledge Base
───────────────────────────────────────────── */
const NS_ICONS = {
  members: Users,
  plans: ShieldCheck,
  invoices: CreditCard,
  policies: FileText,
};

const NS_COLORS = {
  members: {
    bar: "from-violet-500 to-violet-400",
    dot: "bg-violet-400",
    badge: "bg-violet-500/15 text-violet-300",
    buttonBg: "bg-violet-600",
    buttonBorder: "border-violet-500",
  },
  plans: {
    bar: "from-sky-500 to-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-500/15 text-sky-300",
    buttonBg: "bg-sky-600",
    buttonBorder: "border-sky-500",
  },
  invoices: {
    bar: "from-emerald-500 to-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
    buttonBg: "bg-emerald-600",
    buttonBorder: "border-emerald-500",
  },
  policies: {
    bar: "from-amber-500 to-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
    buttonBg: "bg-amber-600",
    buttonBorder: "border-amber-500",
  },
};

const RETRIEVAL_QUERIES = [
  { ns: "members", q: "Active VIP pass credentials Rahul S.", t: "0.2s" },
  { ns: "plans", q: "Quarterly pass renewal grace period rule", t: "0.8s" },
  { ns: "invoices", q: "GST tax invoice #1004 reconciliation", t: "1.6s" },
  { ns: "policies", q: "Biometric NFC turnstile gate access rules", t: "2.9s" },
  { ns: "members", q: "Assigned Personal Coach shift timetable", t: "4.1s" },
  { ns: "plans", q: "Elite VIP guest lounge pass entitlement", t: "5.4s" },
];

export function Card4() {
  const namespaces = [
    { name: "members", hits: 342, fill: 88 },
    { name: "plans", hits: 218, fill: 56 },
    { name: "invoices", hits: 97, fill: 25 },
    { name: "policies", hits: 54, fill: 14 },
  ];

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % RETRIEVAL_QUERIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeNs = RETRIEVAL_QUERIES[tick].ns;
  const recentQueries = [0, 1, 2, 3].map(
    (offset) =>
      RETRIEVAL_QUERIES[(tick - offset + RETRIEVAL_QUERIES.length) % RETRIEVAL_QUERIES.length]
  );

  return (
    <div className="w-full h-full flex flex-col sm:flex-row gap-4 py-2 px-3">
      {/* Left Panel: Namespaces */}
      <div className="flex-1 flex flex-col gap-0 min-w-0 pr-1">
        <p className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2.5">
          Directory Namespaces
        </p>

        <div className="flex flex-col gap-2.5 flex-1">
          {namespaces.map((ns, i) => {
            const c = NS_COLORS[ns.name];
            const isActive = ns.name === activeNs;
            const Icon = NS_ICONS[ns.name] || Database;

            return (
              <div key={ns.name} className="flex items-center gap-2.5 group relative">
                {/* 3D Icon Container */}
                <div
                  className={`relative flex shrink-0 items-center justify-center w-[32px] h-[32px] rounded-[10px] border transition-all duration-300 ${
                    isActive
                      ? `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.5)] text-white ${c.buttonBg} ${c.buttonBorder} scale-105`
                      : "bg-[#14161F] border-white/5 text-slate-400"
                  }`}
                >
                  <Icon size={15} weight={isActive ? "fill" : "regular"} />
                </div>

                {/* Name */}
                <span
                  className={`text-[9.5px] font-mono w-14 shrink-0 transition-colors ${
                    isActive ? "text-white font-semibold" : "text-slate-400"
                  }`}
                >
                  {ns.name}
                </span>

                {/* Progress Bar with Scanning Beam */}
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden relative shadow-inner">
                  <motion.div
                    className={`absolute left-0 top-0 bottom-0 rounded-full overflow-hidden bg-gradient-to-r ${c.bar}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${ns.fill}%`, opacity: isActive ? 1 : 0.3 }}
                    transition={{
                      width: { duration: 1, delay: i * 0.1, type: "spring", bounce: 0.2 },
                      opacity: { duration: 0.3 },
                    }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Hit count */}
                <div className="flex items-center gap-1 w-9 justify-end">
                  <span
                    className={`text-[8.5px] font-mono font-medium ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {ns.hits}
                  </span>
                  {isActive && (
                    <motion.div
                      className={`w-1 h-1 rounded-full ${c.dot}`}
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 pt-2 mt-auto border-t border-white/[0.04]">
          <div className="relative flex items-center justify-center w-2 h-2">
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400/40"
              animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[7.5px] font-mono text-slate-400 font-medium tracking-wide">
            Live directory indexed
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-white/[0.06] self-stretch shrink-0" />

      {/* Right Panel: Retrieval Log */}
      <div className="w-full sm:w-[170px] shrink-0 flex flex-col gap-0">
        <p className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">
          Retrieval Queries
        </p>

        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {recentQueries.map((q, qi) => {
            const c = NS_COLORS[q.ns] || NS_COLORS.members;
            return (
              <motion.div
                key={`${q.ns}-${q.q}-${qi}`}
                className="rounded-xl border border-white/[0.06] bg-[#12141C] px-2.5 py-1.5"
                initial={{ opacity: 0, y: -6 }}
                animate={{
                  opacity: qi === 0 ? 1 : qi === 1 ? 0.75 : qi === 2 ? 0.45 : 0.2,
                  y: 0,
                }}
                transition={{ type: "spring", stiffness: 450, damping: 30, delay: qi * 0.05 }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className={`text-[6.5px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${c.badge}`}
                  >
                    {q.ns}
                  </span>
                  <span className="text-[7px] font-mono text-slate-500 ml-auto">
                    {q.t}
                  </span>
                </div>
                <p className="text-[7.5px] text-slate-300 leading-tight font-mono truncate">
                  {q.q}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card 5 – Hardware & Terminal Tool Inspector
───────────────────────────────────────────── */
export function Card5() {
  const tools = [
    {
      name: "nfc_turnstile",
      calls: 142,
      icon: Globe,
      latency: "18ms",
      color: "bg-gradient-to-b from-sky-400 to-sky-600",
      borderColor: "border-sky-600",
    },
    {
      name: "rfid_validator",
      calls: 84,
      icon: TerminalWindow,
      latency: "42ms",
      color: "bg-gradient-to-b from-emerald-400 to-emerald-600",
      borderColor: "border-emerald-600",
    },
    {
      name: "tax_invoice_gen",
      calls: 29,
      icon: FileText,
      latency: "120ms",
      color: "bg-gradient-to-b from-amber-400 to-amber-600",
      borderColor: "border-amber-600",
    },
    {
      name: "expiry_watchdog",
      calls: 68,
      icon: Brain,
      latency: "95ms",
      color: "bg-gradient-to-b from-violet-400 to-violet-600",
      borderColor: "border-violet-600",
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-2.5">
      <div className="grid grid-cols-2 gap-2 w-full">
        {tools.map((t, i) => (
          <motion.div
            key={i}
            className="relative rounded-[14px] border border-white/[0.06] bg-[#12141D] hover:border-white/15 transition-all flex flex-col justify-between p-2.5 group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Top Row: 3D Icon + Calls */}
            <div className="flex items-start justify-between">
              <div
                className={`w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-white ${t.color} border ${t.borderColor} shadow-sm group-hover:scale-105 transition-transform`}
              >
                <t.icon weight="fill" className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[11px] font-mono font-bold text-white leading-none">
                  {t.calls}
                </span>
                <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                  Scans
                </span>
              </div>
            </div>

            {/* Bottom Row: Name + Latency + Gauge */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-mono font-medium text-slate-200 truncate max-w-[70px]">
                  {t.name}
                </span>
                <span className="text-[7.5px] font-mono text-slate-400">
                  {t.latency}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden relative">
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 rounded-full ${t.color}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(t.calls / 142) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Bento Grid Configuration & Dashboard Section
───────────────────────────────────────────── */
const CARDS = [
  {
    title: "Access Pipeline & Gate Router",
    description: "Real-time task flow across turnstile gates, biometric passes, and membership validator.",
    visual: <Card1 />,
    colSpan: "lg:col-span-1",
    height: "h-[270px]",
  },
  {
    title: "Gate Traffic & Peak Load Monitor",
    description: "Real-time turnstile throughput and hourly scan latency across peak training hours.",
    visual: <Card2 />,
    colSpan: "lg:col-span-1",
    height: "h-[270px]",
  },
  {
    title: "Live Turnstile Activity Stream",
    description: "3D stacked real-time stream of turnstile access, renewals, and coach check-ins.",
    visual: <Card3 />,
    colSpan: "lg:col-span-1",
    height: "h-[270px]",
  },
  {
    title: "Member & Pass Directory Index",
    description: "Live semantic namespace lookup across athletes, pricing tiers, and tax invoices.",
    visual: <Card4 />,
    colSpan: "lg:col-span-2",
    height: "h-[270px]",
  },
  {
    title: "Hardware & Terminal Scanner Inspector",
    description: "Monitor hardware device scan latency, pass recognition rates, and status health.",
    visual: <Card5 />,
    colSpan: "lg:col-span-1",
    height: "h-[270px]",
  },
];

export default function ReceptionistOverviewDashboard({
  activeInsideCount = 0,
  customersCount = 0,
  dueSoonCount = 0,
  invoicesCount = 0,
  onNavigateTab = () => {},
}) {
  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* 1. Header Overview & Live Stats Banner */}
      <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#121217] border border-[#202028] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-outfit">
              Front Desk Concierge Mission Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30 font-mono">
              GATE A1 ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time biometric validation, turnstile traffic monitor, and front desk operations grid.
          </p>
        </div>

        {/* Quick Summary Pill Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab("checkin")}
            className="p-3 rounded-xl bg-[#181820] border border-white/5 hover:border-emerald-500/40 transition-all text-left group cursor-pointer"
          >
            <span className="text-[10px] text-[#8E8E98] uppercase font-bold tracking-wider block font-outfit">
              Active Inside
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-outfit tracking-tight group-hover:scale-105 inline-block transition-transform">
              {activeInsideCount} Athletes
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("customers")}
            className="p-3 rounded-xl bg-[#181820] border border-white/5 hover:border-white/20 transition-all text-left group cursor-pointer"
          >
            <span className="text-[10px] text-[#8E8E98] uppercase font-bold tracking-wider block font-outfit">
              Total Members
            </span>
            <span className="text-lg font-extrabold text-white font-outfit tracking-tight group-hover:scale-105 inline-block transition-transform">
              {customersCount} Total
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("renewals")}
            className="p-3 rounded-xl bg-[#181820] border border-white/5 hover:border-amber-500/40 transition-all text-left group cursor-pointer"
          >
            <span className="text-[10px] text-[#8E8E98] uppercase font-bold tracking-wider block font-outfit">
              Pending Renewals
            </span>
            <span className="text-lg font-extrabold text-amber-400 font-outfit tracking-tight group-hover:scale-105 inline-block transition-transform">
              {dueSoonCount} Due Soon
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("billing")}
            className="p-3 rounded-xl bg-[#181820] border border-white/5 hover:border-white/20 transition-all text-left group cursor-pointer"
          >
            <span className="text-[10px] text-[#8E8E98] uppercase font-bold tracking-wider block font-outfit">
              Payment & Billing
            </span>
            <span className="text-lg font-extrabold text-[#FF2E4C] font-outfit tracking-tight group-hover:scale-105 inline-block transition-transform">
              {invoicesCount} Settled
            </span>
          </button>
        </div>
      </div>

      {/* 2. Interactive 5-Card Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
        {CARDS.map((card, idx) => (
          <FeatCard
            key={idx}
            title={card.title}
            description={card.description}
            className={cn(card.colSpan, card.height)}
          >
            {card.visual}
          </FeatCard>
        ))}
      </div>
    </div>
  );
}
