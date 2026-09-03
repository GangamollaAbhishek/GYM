"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 20, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

function ItemCard({ item, pinned, onToggle, onItemClick }) {
  return (
    <motion.div
      layoutId={item.id}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onItemClick && onItemClick(item)}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors cursor-pointer group",
        "bg-[#13151F] text-slate-300 hover:bg-[#181B28]",
        "border border-white/[0.06] hover:border-purple-500/30",
        pinned &&
          "bg-purple-950/30 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.12)]",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
          "bg-[#0A0B10] border border-white/10",
          "text-purple-400 group-hover:scale-105 transition-transform",
          pinned && "border-purple-500/40 text-purple-300",
        )}
      >
        {item.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs sm:text-sm font-semibold leading-tight text-white font-['Outfit',sans-serif]">
            {item.name}
          </p>
          {item.unread && (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 animate-pulse" />
          )}
        </div>
        <p className="truncate text-[11px] text-slate-400 mt-0.5 leading-snug">
          {item.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
          "transition-all duration-200 cursor-pointer",
          pinned
            ? "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white",
        )}
      >
        <Pin
          size={14}
          className={cn(
            "transition-transform duration-200",
            pinned && "-rotate-45",
          )}
        />
      </button>
    </motion.div>
  );
}

const headingVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" } },
};

export function PinnedList({ items, className, onItemClick }) {
  const [pinnedIds, setPinnedIds] = React.useState(new Set());
  const [showPinnedSection, setShowPinnedSection] = React.useState(false);
  const pinnedLengthRef = React.useRef(0);

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const pinned = items.filter((i) => pinnedIds.has(i.id));
  const unpinned = items.filter((i) => !pinnedIds.has(i.id));

  pinnedLengthRef.current = pinned.length;

  const [showAllSection, setShowAllSection] = React.useState(true);
  const unpinnedLengthRef = React.useRef(unpinned.length);
  unpinnedLengthRef.current = unpinned.length;

  React.useEffect(() => {
    if (pinned.length > 0) setShowPinnedSection(true);
  }, [pinned.length]);

  React.useEffect(() => {
    if (unpinned.length > 0) setShowAllSection(true);
  }, [unpinned.length]);

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={cn("flex w-full flex-col gap-1.5", className)}
      >
        <AnimatePresence onExitComplete={() => setShowPinnedSection(false)}>
          {showPinnedSection && (
            <motion.div
              key="pinned-section"
              layout
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-1.5"
            >
              <motion.p
                layout="position"
                className="px-1 pb-0.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono flex items-center justify-between"
              >
                <span>📌 Pinned Alerts</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {pinned.length}
                </span>
              </motion.p>
              <AnimatePresence
                mode="popLayout"
                onExitComplete={() => {
                  if (pinnedLengthRef.current === 0)
                    setShowPinnedSection(false);
                }}
              >
                {pinned.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    pinned
                    onToggle={() => togglePin(item.id)}
                    onItemClick={onItemClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence onExitComplete={() => setShowAllSection(false)}>
          {showAllSection && (
            <motion.div
              key="all-section"
              layout
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-1.5"
            >
              <motion.p
                layout="position"
                className={cn(
                  "px-1 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between",
                  pinned.length > 0
                    ? "pt-3 border-t border-white/[0.06]"
                    : "pt-1",
                )}
              >
                <span>Recent Notifications</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {unpinned.length}
                </span>
              </motion.p>
              <AnimatePresence
                mode="popLayout"
                onExitComplete={() => {
                  if (unpinnedLengthRef.current === 0) setShowAllSection(false);
                }}
              >
                {unpinned.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    pinned={false}
                    onToggle={() => togglePin(item.id)}
                    onItemClick={onItemClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}

export default PinnedList;
