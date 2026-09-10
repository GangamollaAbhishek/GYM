import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  RotateCw,
  CreditCard,
  LifeBuoy,
  UserCheck,
  Dumbbell,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  HelpCircle,
  Key,
  CheckCircle2,
  Sparkles,
  Activity,
  Flame,
} from "lucide-react";
import { cn } from "../lib/utils";

export default function ReceptionistOverviewDashboard({
  activeInsideCount = 0,
  customersCount = 0,
  dueSoonCount = 0,
  invoicesCount = 0,
  ticketsCount = 0,
  onNavigateTab = () => {},
  attendanceLogs = [],
  trainers = [],
  customers = [],
  onNewCustomer = () => {},
  onNewEnquiry = () => {},
}) {
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Recent attendance stream (first 6 logs)
  const recentLogs = attendanceLogs.slice(0, 6);

  // Active trainers (first 4)
  const activeTrainers = trainers.slice(0, 4);

  // Membership tier counts
  const proCount = customers.filter(
    (c) =>
      c.plan?.toLowerCase().includes("pro") ||
      c.plan?.toLowerCase().includes("all-access")
  ).length || Math.round(customersCount * 0.55);

  const eliteCount = customers.filter(
    (c) => c.plan?.toLowerCase().includes("elite") || c.plan?.toLowerCase().includes("vip")
  ).length || Math.round(customersCount * 0.3);

  const ptCount = customers.filter(
    (c) => c.plan?.toLowerCase().includes("pt") || c.plan?.toLowerCase().includes("coach")
  ).length || Math.max(0, customersCount - proCount - eliteCount);

  return (
    <div className="space-y-6 font-['Outfit',sans-serif] animate-fadeIn text-white">
      {/* 1. Header Overview & Live Shift Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#121318] border border-white/[0.06] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Front Desk Concierge Mission Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30 font-mono">
              GATE ALPHA-1 ONLINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Real-time biometric attendance, turnstile telemetry, and member services desk.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0c0e12] border border-white/[0.06] px-4 py-2.5 rounded-xl self-start lg:self-center">
          <div className="text-right">
            <div className="font-mono text-sm sm:text-base font-bold text-white">
              {currentTime}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {todayDateFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metric KPI Cards (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Active Inside */}
        <button
          onClick={() => onNavigateTab("checkin")}
          className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-emerald-500/40 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Active Inside
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 tracking-tight font-outfit">
              {activeInsideCount}
            </h3>
            <span className="text-[11px] text-slate-500">In arena session</span>
          </div>
        </button>

        {/* Total Members */}
        <button
          onClick={() => onNavigateTab("customers")}
          className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-white/20 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Total Members
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight font-outfit">
              {customersCount}
            </h3>
            <span className="text-[11px] text-slate-500">Registered athletes</span>
          </div>
        </button>

        {/* Pending Renewals */}
        <button
          onClick={() => onNavigateTab("renewals")}
          className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-amber-500/40 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Renewals Due
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <RotateCw size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-400 tracking-tight font-outfit">
              {dueSoonCount}
            </h3>
            <span className="text-[11px] text-slate-500">Follow-up needed</span>
          </div>
        </button>

        {/* Payment & Billing */}
        <button
          onClick={() => onNavigateTab("billing")}
          className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-white/20 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Settlements
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
              <CreditCard size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#FF2E4C] tracking-tight font-outfit">
              {invoicesCount}
            </h3>
            <span className="text-[11px] text-slate-500">Invoices cleared</span>
          </div>
        </button>

        {/* Support Helpdesk */}
        <button
          onClick={() => onNavigateTab("tickets")}
          className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-cyan-500/40 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between h-28 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Support Desk</span>
              {ticketsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FF2E4C] animate-pulse" />
              )}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <LifeBuoy size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 tracking-tight font-outfit">
              {ticketsCount}
            </h3>
            <span className="text-[11px] text-slate-500">Open tickets</span>
          </div>
        </button>
      </div>

      {/* 3. Main Dashboard Body (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Turnstile Gate Activity Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.06] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CalendarCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Live Turnstile Admissions Stream
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Real-time member biometric passage and check-in logs
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab("checkin")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Full Gate Terminal</span> <ArrowRight size={12} />
              </button>
            </div>

            {/* List of Recent Check-ins */}
            <div className="divide-y divide-white/[0.04]">
              {recentLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No attendance records logged today yet.
                </div>
              ) : (
                recentLogs.map((log) => {
                  const isInside = log.status === "Active Inside";
                  return (
                    <div
                      key={log.id}
                      className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                          {log.name?.charAt(0) || "A"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-white truncate">
                              {log.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                              {log.customerId}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 truncate block">
                            {log.plan} • {log.terminal || "Gate Alpha-1"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-mono text-xs font-semibold text-white">
                            {log.timeIn}
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                              isInside
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {log.status || "Checked In"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Membership Tier Distribution Progress */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.06] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Membership Tier Breakdown
                </h3>
                <p className="text-xs text-slate-400 font-normal">
                  Distribution of active gym athlete subscriptions
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("memberships")}
                className="text-xs text-[#FF2E4C] hover:underline font-semibold cursor-pointer"
              >
                View Plans →
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">Titan Pro All-Access</span>
                  <span className="text-white font-mono">{proCount} Members</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, (proCount / (customersCount || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">Elite VIP Athlete Pass</span>
                  <span className="text-white font-mono">{eliteCount} Members</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF2E4C] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(8, (eliteCount / (customersCount || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300">1-on-1 PT Master Coaching</span>
                  <span className="text-white font-mono">{ptCount} Members</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(5, (ptCount / (customersCount || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions & Coaches On Duty */}
        <div className="space-y-6">
          {/* Quick Front Desk Actions */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.06] shadow-sm space-y-3.5">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Front Desk Fast Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <button
                onClick={() => {
                  if (onNewCustomer) onNewCustomer();
                  else onNavigateTab("customers");
                }}
                className="w-full p-3 rounded-xl bg-[#161720] hover:bg-[#1c1d28] border border-white/[0.06] hover:border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 flex items-center justify-center text-[#FF2E4C]">
                    <UserPlus size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Register Member
                    </h4>
                    <span className="text-[11px] text-slate-400">Onboard athlete</span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-white transition-colors"
                />
              </button>

              <button
                onClick={() => onNavigateTab("manual-login")}
                className="w-full p-3 rounded-xl bg-[#161720] hover:bg-[#1c1d28] border border-white/[0.06] hover:border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Key size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Manual OTP Clock-In
                    </h4>
                    <span className="text-[11px] text-slate-400">Verify member gate</span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-white transition-colors"
                />
              </button>

              <button
                onClick={() => {
                  if (onNewEnquiry) onNewEnquiry();
                  else onNavigateTab("dashboard");
                }}
                className="w-full p-3 rounded-xl bg-[#161720] hover:bg-[#1c1d28] border border-white/[0.06] hover:border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Capture Prospect Lead
                    </h4>
                    <span className="text-[11px] text-slate-400">Walk-in visitor</span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-white transition-colors"
                />
              </button>

              <button
                onClick={() => onNavigateTab("tickets")}
                className="w-full p-3 rounded-xl bg-[#161720] hover:bg-[#1c1d28] border border-white/[0.06] hover:border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <LifeBuoy size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Support Tickets Desk
                    </h4>
                    <span className="text-[11px] text-slate-400">Resolve issues</span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-white transition-colors"
                />
              </button>
            </div>
          </div>

          {/* Coaches On Floor */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.06] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Trainers On Duty ({trainers.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("trainers")}
                className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                All →
              </button>
            </div>

            <div className="space-y-2.5">
              {activeTrainers.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No coaches currently assigned.
                </div>
              ) : (
                activeTrainers.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-xl bg-[#161720] border border-white/[0.04] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {tr.name?.charAt(0) || "T"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {tr.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {tr.spec?.slice(0, 24)}...
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        tr.status === "Available"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : tr.status === "In Session"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {tr.status || "Available"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
