import React from "react";
import AnimatedList from "./AnimatedList";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Bell,
  X,
  Zap,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function ToastNotificationStack({
  notifications = [],
  onDismiss = () => {},
  position = "top-right", // 'top-right' | 'top-center' | 'bottom-right'
}) {
  if (!notifications || notifications.length === 0) return null;

  const positionClasses = {
    "top-right":
      "fixed top-6 right-6 z-[9999] max-w-sm w-full pointer-events-none",
    "top-center":
      "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full pointer-events-none",
    "bottom-right":
      "fixed bottom-6 right-6 z-[9999] max-w-sm w-full pointer-events-none",
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle size={18} className="text-rose-400 shrink-0" />;
      case "gate":
      case "zap":
        return (
          <Zap size={18} className="text-[#FF1E27] shrink-0 fill-[#FF1E27]" />
        );
      case "streak":
        return (
          <Flame size={18} className="text-amber-400 shrink-0 fill-amber-400" />
        );
      case "security":
        return <ShieldCheck size={18} className="text-cyan-400 shrink-0" />;
      case "info":
      default:
        return <Bell size={18} className="text-[#FF2B35] shrink-0" />;
    }
  };

  return (
    <div className={positionClasses[position] || positionClasses["top-right"]}>
      <AnimatedList
        items={notifications}
        maxVisible={5}
        gap={10}
        animation="bounce"
        renderItem={(item) => (
          <div className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#12151F]/95 border border-white/15 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-white group relative overflow-hidden">
            {/* Ambient left accent line */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF1E27] to-[#E50914]" />

            <div className="mt-0.5">{getIcon(item.type)}</div>

            <div className="flex-1 min-w-0 pr-2">
              {item.title && (
                <h4 className="text-xs font-bold font-['Outfit',sans-serif] uppercase tracking-wider text-slate-200">
                  {item.title}
                </h4>
              )}
              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
                {item.message || item.text || item}
              </p>
              {item.time && (
                <span className="text-[10px] text-slate-500 font-mono block mt-1">
                  {item.time}
                </span>
              )}
            </div>

            <button
              onClick={() => onDismiss(item.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
