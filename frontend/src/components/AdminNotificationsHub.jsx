import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import {
  Bell,
  CheckCircle,
  CalendarCheck,
  UserPlus,
  CreditCard,
  Dumbbell,
  Star,
  HelpCircle,
  Send,
  Trash2,
  Filter,
  CheckCheck,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink,
  X,
  MessageSquare,
  AlertTriangle,
  Zap,
  Pin,
  Search,
} from "lucide-react";
import { cn } from "../lib/utils";

// Smooth Framer Motion spring physics
const itemVariants = {
  hidden: { opacity: 0, scale: 0.97, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 22, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -3,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 24 },
  },
  exit: { opacity: 0, y: -3, transition: { duration: 0.12, ease: "easeIn" } },
};

const HubItemCard = React.forwardRef(function HubItemCard(
  {
    notif,
    pinned,
    onTogglePin,
    onDismiss,
    onSelectAction,
    getCategoryTheme,
  },
  ref
) {
  const theme = getCategoryTheme(notif.category);
  const Icon = theme.icon;

  return (
    <motion.div
      ref={ref}
      layoutId={`hub-notif-${notif.id}`}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "group relative rounded-xl p-4 transition-all duration-200 border",
        "bg-[#13141a] hover:bg-[#171822] border-white/[0.06] hover:border-white/[0.12]",
        notif.unread && "border-l-2 border-l-[#FF2E4C] bg-[#151620]",
        pinned && "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Left: Icon & Content */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
              theme.bg,
              theme.border,
              theme.text
            )}
          >
            <Icon size={18} />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            {/* Title Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-normal">
                {notif.title}
              </span>

              {notif.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] ring-2 ring-[#FF2E4C]/30" />
              )}

              {pinned && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Pin size={10} className="-rotate-45" /> Pinned
                </span>
              )}

              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-md border",
                  theme.badgeBg
                )}
              >
                {theme.badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {notif.desc}
            </p>

            {/* Meta tags */}
            <div className="flex items-center gap-2.5 pt-1 text-[11px] text-slate-400 font-normal">
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300">
                {notif.source}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                <Clock size={11} className="text-slate-500" />
                {notif.time}
              </span>
              {notif.meta && (
                <>
                  <span>•</span>
                  <span className="font-mono text-emerald-400 text-[10px] font-medium">
                    {notif.meta}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          {/* Pin Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(notif.id);
            }}
            aria-label={pinned ? `Unpin ${notif.title}` : `Pin ${notif.title}`}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer border",
              pinned
                ? "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30"
                : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
            )}
            title={pinned ? "Unpin alert" : "Pin to top"}
          >
            <Pin
              size={14}
              className={cn(
                "transition-transform duration-200",
                pinned && "-rotate-45 text-blue-400"
              )}
            />
          </button>

          {/* Action Link Button */}
          {notif.actionTab && (
            <button
              onClick={() => onSelectAction(notif)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{notif.actionLabel || "Inspect"}</span>
              <ArrowUpRight size={12} className="text-[#FF2E4C]" />
            </button>
          )}

          {/* Dismiss Alert */}
          <button
            onClick={() => onDismiss(notif.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default function AdminNotificationsHub({
  notifications = [],
  unreadCount = 0,
  onMarkAllAsRead = () => {},
  onClearAll = () => {},
  onDismissNotification = () => {},
  onSelectNotificationAction = () => {},
  onSendBroadcast = () => {},
  showToast = () => {},
}) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    target: "All Athletes & Staff",
    priority: "Normal",
  });

  // Pinned items state with localStorage persistence
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("titan_admin_pinned_notifs");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      const isPinning = !next.has(id);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("titan_admin_pinned_notifs", JSON.stringify(Array.from(next)));
      } catch {}
      showToast(isPinning ? "📌 Alert pinned to top" : "Alert unpinned");
      return next;
    });
  };

  // Filter notifications by category and search
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchCat =
        filterCategory === "all" || item.category === filterCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.desc?.toLowerCase().includes(q) ||
        item.source?.toLowerCase().includes(q) ||
        item.meta?.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [notifications, filterCategory, searchQuery]);

  const pinnedItems = useMemo(
    () => filteredNotifications.filter((i) => pinnedIds.has(i.id)),
    [filteredNotifications, pinnedIds]
  );
  const unpinnedItems = useMemo(
    () => filteredNotifications.filter((i) => !pinnedIds.has(i.id)),
    [filteredNotifications, pinnedIds]
  );

  const [showPinnedSection, setShowPinnedSection] = useState(false);
  const pinnedLengthRef = useRef(0);
  pinnedLengthRef.current = pinnedItems.length;

  const [showAllSection, setShowAllSection] = useState(true);
  const unpinnedLengthRef = useRef(unpinnedItems.length);
  unpinnedLengthRef.current = unpinnedItems.length;

  useEffect(() => {
    if (pinnedItems.length > 0) setShowPinnedSection(true);
  }, [pinnedItems.length]);

  useEffect(() => {
    if (unpinnedItems.length > 0) setShowAllSection(true);
  }, [unpinnedItems.length]);

  const categoryCounts = useMemo(() => {
    return {
      all: notifications.length,
      checkin: notifications.filter((n) => n.category === "checkin").length,
      onboarding: notifications.filter((n) => n.category === "onboarding").length,
      payment: notifications.filter((n) => n.category === "payment").length,
      trainer: notifications.filter((n) => n.category === "trainer").length,
      review: notifications.filter((n) => n.category === "review").length,
      enquiry: notifications.filter((n) => n.category === "enquiry").length,
      broadcast: notifications.filter((n) => n.category === "broadcast").length,
    };
  }, [notifications]);

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;

    onSendBroadcast({
      id: `NTF-BRD-${Date.now().toString().slice(-4)}`,
      title: broadcastForm.title,
      desc: broadcastForm.message,
      target: broadcastForm.target,
      priority: broadcastForm.priority,
      category: "broadcast",
      source: "Admin Command HQ",
      time: "Just now",
      unread: true,
    });

    setShowBroadcastModal(false);
    setBroadcastForm({
      title: "",
      message: "",
      target: "All Athletes & Staff",
      priority: "Normal",
    });
    showToast("✓ Broadcast announcement dispatched across active portals!");
  };

  const getCategoryTheme = (category) => {
    switch (category) {
      case "checkin":
        return {
          icon: CalendarCheck,
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          badge: "Turnstile Check-In",
          badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        };
      case "onboarding":
        return {
          icon: UserPlus,
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          text: "text-cyan-400",
          badge: "New Athlete",
          badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
        };
      case "payment":
        return {
          icon: CreditCard,
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          text: "text-purple-400",
          badge: "Billing",
          badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        };
      case "trainer":
        return {
          icon: Dumbbell,
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          badge: "Trainer Shift",
          badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        };
      case "review":
        return {
          icon: Star,
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          text: "text-rose-400",
          badge: "Review",
          badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/20",
        };
      case "enquiry":
        return {
          icon: HelpCircle,
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400",
          badge: "Lead Enquiry",
          badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        };
      case "broadcast":
      default:
        return {
          icon: Bell,
          bg: "bg-[#FF2E4C]/10",
          border: "border-[#FF2E4C]/20",
          text: "text-[#FF2E4C]",
          badge: "HQ Broadcast",
          badgeBg: "bg-[#FF2E4C]/10 text-[#FF2E4C] border-[#FF2E4C]/20",
        };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121318] border border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Notifications Hub
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF2E4C]/15 text-[#FF2E4C] border border-[#FF2E4C]/30">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Real-time activity across turnstile check-ins, registrations, payments, and staff shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCheck size={14} className="text-emerald-400" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear inbox</span>
            </button>
          )}

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#FF2E4C] hover:bg-[#ff1f3f] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send size={13} />
            <span>Send Broadcast</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Pills & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#121318] border border-white/[0.06]">
          {[
            { id: "all", label: "All", count: categoryCounts.all },
            { id: "checkin", label: "Check-Ins", count: categoryCounts.checkin },
            { id: "onboarding", label: "Onboarding", count: categoryCounts.onboarding },
            { id: "payment", label: "Payments", count: categoryCounts.payment },
            { id: "trainer", label: "Trainers", count: categoryCounts.trainer },
            { id: "review", label: "Reviews", count: categoryCounts.review },
            { id: "enquiry", label: "Leads", count: categoryCounts.enquiry },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                filterCategory === cat.id
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded text-[10px]",
                  filterCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.06] text-slate-400"
                )}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#121318] border border-white/[0.06] text-white text-xs outline-none focus:border-white/20 placeholder:text-slate-500"
          />
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#121318] border border-white/[0.06] text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-slate-500 flex items-center justify-center mx-auto mb-2">
            <Bell size={20} />
          </div>
          <h3 className="text-sm font-semibold text-white">No notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-normal">
            There are no activity alerts matching your selected filter.
          </p>
        </div>
      ) : (
        <LayoutGroup id="admin-hub-notifications">
          <motion.div layout className="space-y-4">
            {/* Pinned Section */}
            <AnimatePresence onExitComplete={() => setShowPinnedSection(false)}>
              {showPinnedSection && (
                <motion.div
                  key="hub-pinned-section"
                  layout
                  variants={headingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-2 rounded-2xl bg-blue-950/15 border border-blue-500/20 p-3.5"
                >
                  <motion.div
                    layout="position"
                    className="flex items-center justify-between px-1 text-xs font-semibold text-blue-400 tracking-normal"
                  >
                    <span className="flex items-center gap-1.5">
                      <Pin size={12} className="-rotate-45" /> Pinned Priority ({pinnedItems.length})
                    </span>
                  </motion.div>

                  <AnimatePresence
                    mode="popLayout"
                    onExitComplete={() => {
                      if (pinnedLengthRef.current === 0) setShowPinnedSection(false);
                    }}
                  >
                    {pinnedItems.map((item) => (
                      <HubItemCard
                        key={item.id}
                        notif={item}
                        pinned={true}
                        onTogglePin={togglePin}
                        onDismiss={onDismissNotification}
                        onSelectAction={onSelectNotificationAction}
                        getCategoryTheme={getCategoryTheme}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Regular Stream */}
            <AnimatePresence onExitComplete={() => setShowAllSection(false)}>
              {showAllSection && (
                <motion.div
                  key="hub-all-section"
                  layout
                  variants={headingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-2.5"
                >
                  {pinnedItems.length > 0 && (
                    <motion.p
                      layout="position"
                      className="px-1 text-xs font-medium text-slate-400 pt-1"
                    >
                      Recent Activity ({unpinnedItems.length})
                    </motion.p>
                  )}

                  <AnimatePresence
                    mode="popLayout"
                    onExitComplete={() => {
                      if (unpinnedLengthRef.current === 0) setShowAllSection(false);
                    }}
                  >
                    {unpinnedItems.map((item) => (
                      <HubItemCard
                        key={item.id}
                        notif={item}
                        pinned={false}
                        onTogglePin={togglePin}
                        onDismiss={onDismissNotification}
                        onSelectAction={onSelectNotificationAction}
                        getCategoryTheme={getCategoryTheme}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}

      {/* 4. Send Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[160] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121318] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] flex items-center justify-center font-bold">
                <Send size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-normal">
                  Dispatch Broadcast Alert
                </h3>
                <p className="text-xs text-slate-400">
                  Send announcements to customer and trainer dashboards.
                </p>
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium mb-1.5 block">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Powerlifting Workshop"
                  value={broadcastForm.title}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0e12] border border-white/[0.08] text-white text-xs outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium mb-1.5 block">
                  Message Content
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter details regarding schedules, upgrades, or guidelines..."
                  value={broadcastForm.message}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      message: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0e12] border border-white/[0.08] text-white text-xs outline-none focus:border-white/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium mb-1.5 block">
                    Target Audience
                  </label>
                  <select
                    value={broadcastForm.target}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        target: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#0c0e12] border border-white/[0.08] text-white text-xs outline-none focus:border-white/20"
                  >
                    <option value="All Athletes & Staff">All Athletes & Staff</option>
                    <option value="All Customers">All Customers</option>
                    <option value="Trainers & Coaches">Trainers & Coaches</option>
                    <option value="Due / Expiring Members">Due / Expiring Members</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium mb-1.5 block">
                    Priority Level
                  </label>
                  <select
                    value={broadcastForm.priority}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#0c0e12] border border-white/[0.08] text-white text-xs outline-none focus:border-white/20"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF2E4C] hover:bg-[#ff1f3f] text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
