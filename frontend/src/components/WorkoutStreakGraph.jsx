import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

const VARIANTS = {
  attendance: ["#ef4444", "#10b981", "#16a34a", "#22c55e", "#00e676"],
  titan: ["#ef4444", "#059669", "#10b981", "#22c55e", "#4ade80"],
  emerald: ["#ef4444", "#047857", "#059669", "#10b981", "#22c55e"],
  ocean: ["#ef4444", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"],
  violet: ["#ef4444", "#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa"],
  github: ["#ef4444", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

function dateFromISO(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function fallbackLevel(count, maxCount) {
  if (!Number.isFinite(count) || count <= 0 || maxCount <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4)));
}

/** Builds Sunday-first calendar columns and fills missing dates with level zero. */
export function buildContributionWeeks(contributions) {
  const valid = (contributions || [])
    .map((item) => ({ ...item, parsedDate: dateFromISO(item.date) }))
    .filter((item) => item.parsedDate !== null && Number.isFinite(item.count))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (valid.length === 0) return [];

  const maxCount = Math.max(0, ...valid.map((item) => item.count));
  const byDate = new Map(valid.map((item) => [item.date, item]));
  const firstDate = valid[0].parsedDate;
  const lastDate = valid[valid.length - 1].parsedDate;
  const startDate = addDays(firstDate, -firstDate.getUTCDay());
  const endDate = addDays(lastDate, 6 - lastDate.getUTCDay());
  const cells = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const key = isoDate(date);
    const contribution = byDate.get(key);
    const count = Math.max(0, contribution?.count ?? 0);
    const explicitLevel = contribution?.level;
    const level =
      Number.isInteger(explicitLevel) && explicitLevel >= 0 && explicitLevel <= 4
        ? count === 0
          ? 0
          : explicitLevel
        : fallbackLevel(count, maxCount);

    cells.push({ date: key, count, level, duration: contribution?.duration, workout: contribution?.workout });
  }

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7)
  );
}

function selectRecentContributions(contributions, months) {
  const parsed = (contributions || [])
    .map((contribution) => ({
      contribution,
      date: dateFromISO(contribution.date),
    }))
    .filter((item) => item.date !== null);
  const latest = parsed.reduce(
    (current, item) => (!current || item.date > current ? item.date : current),
    null
  );

  if (!latest) return [];

  const start = new Date(latest);
  start.setUTCMonth(start.getUTCMonth() - Math.max(1, Math.min(12, Math.round(months))));
  return parsed.filter((item) => item.date >= start).map((item) => item.contribution);
}

function formatContributionLabel(contribution) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(dateFromISO(contribution.date) ?? new Date());

  if (contribution.count === 0) {
    return `🔴 Not Checked-In (Absent / Rest) · ${date}`;
  }
  const durationText = contribution.duration ? ` · ${contribution.duration}` : "";
  const zoneText = contribution.workout ? ` · ${contribution.workout}` : "";
  return `🟢 Checked-In (Present${durationText}${zoneText}) · ${date}`;
}

function getCellDelay(animation, weekIndex, dayIndex, speed) {
  if (animation === "none") return 0;

  const step =
    animation === "wave"
      ? weekIndex * 0.026 + dayIndex * 0.016
      : animation === "scan"
      ? weekIndex * 0.03
      : (weekIndex + dayIndex * 2) * 0.018;
  return step / Math.max(speed, 0.1);
}

function getAmbientCellMotion(
  effect,
  intensity,
  weekIndex,
  dayIndex,
  entranceDelay,
  reducedMotion
) {
  if (reducedMotion || effect === "none") {
    return {
      animate: { opacity: 1, scale: 1 },
      transition: {
        opacity: { duration: 0.14, delay: entranceDelay },
        scale: { type: "spring", stiffness: 900, damping: 32 },
      },
    };
  }

  const strength = Math.min(1, Math.max(0, intensity));
  const seed = ((weekIndex * 17 + dayIndex * 31) % 11) / 10;
  const isTide = effect === "tide";
  const isDrift = effect === "drift";
  const duration = isTide ? 3.2 : isDrift ? 3.8 + seed : 2 + seed * 1.4;
  const delay =
    entranceDelay + (isTide ? (weekIndex + dayIndex * 1.8) * 0.055 : seed * 0.85);
  const lowOpacity = 1 - (isTide ? 0.24 : isDrift ? 0.16 : 0.34) * strength;
  const smallScale = 1 - (isTide ? 0.07 : isDrift ? 0.04 : 0.08) * strength;

  return {
    animate: {
      opacity: isDrift
        ? [1, lowOpacity, 1 - 0.06 * strength, 1]
        : [1, lowOpacity, 1],
      scale: isDrift
        ? [1, smallScale, 1 + 0.025 * strength, 1]
        : [1, smallScale, 1],
    },
    transition: {
      opacity: {
        duration,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
      },
      scale: { duration, delay, ease: "easeInOut", repeat: Infinity },
    },
  };
}

export default function WorkoutStreakGraph({
  months = 6,
  variant = "titan",
  animation = "wave",
  animationSpeed = 1,
  cellSize = 16,
  cellGap = 4,
  cellRadius = 4,
  autoFit = false,
  showLegend = true,
  showAccount = false,
  ambientEffect = "twinkle",
  ambientIntensity = 0.65,
  data = [],
  title = "Workout Streak Matrix",
  subtitle = "Interactive gym floor check-in density & volume heatmap",
  className,
}) {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [availableWidth, setAvailableWidth] = useState(0);
  const [hoveredContribution, setHoveredContribution] = useState(null);

  const colors = VARIANTS[variant] || VARIANTS.titan;
  const resolvedCellRadius = Math.max(0, Math.min(cellRadius, Math.max(0, cellSize) / 2));
  const autoFitColumns = Math.max(
    1,
    Math.floor((availableWidth + Math.max(0, cellGap)) / Math.max(1, cellSize + cellGap))
  );

  useLayoutEffect(() => {
    if (!autoFit || !rootRef.current) return;

    const root = rootRef.current;
    const updateWidth = () => setAvailableWidth(root.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(root);
    return () => observer.disconnect();
  }, [autoFit]);

  const weeks = useMemo(() => {
    return buildContributionWeeks(selectRecentContributions(data, months));
  }, [data, months]);

  const animationKey = `workout-${months}-${variant}-${animation}-${cellSize}-${cellGap}-${autoFit}`;

  const showTooltip = useCallback(
    (element, contribution, weekIndex, dayIndex, pointer) => {
      const cellRect = element.getBoundingClientRect();
      const placement = cellRect.top > 56 ? "above" : "below";
      const left = Math.min(
        Math.max(cellRect.left + cellRect.width / 2, 120),
        window.innerWidth - 120
      );
      setHoveredContribution({
        contribution,
        left,
        top: placement === "above" ? cellRect.top - 10 : cellRect.bottom + 10,
        originLeft: pointer?.clientX ?? left,
        originTop: pointer?.clientY ?? cellRect.top + cellRect.height / 2,
        placement,
        weekIndex,
        dayIndex,
      });
    },
    []
  );

  const renderContribution = (contribution, columnIndex, rowIndex) => {
    const label = formatContributionLabel(contribution);
    const entranceDelay = reducedMotion
      ? 0
      : getCellDelay(animation, columnIndex, rowIndex, animationSpeed);
    const ambientMotion = getAmbientCellMotion(
      ambientEffect,
      ambientIntensity,
      columnIndex,
      rowIndex,
      entranceDelay,
      reducedMotion
    );
    const distance = hoveredContribution
      ? Math.hypot(
          columnIndex - hoveredContribution.weekIndex,
          rowIndex - hoveredContribution.dayIndex
        )
      : Infinity;
    const waveStrength = Math.max(0, 1 - distance / 3);
    const filter = `brightness(${1 + waveStrength * 0.45}) saturate(${1 + waveStrength * 0.2})`;

    return (
      <motion.button
        key={`${animationKey}-${contribution.date}`}
        type="button"
        role="gridcell"
        aria-label={label}
        className="relative outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[#FF1E27] cursor-pointer"
        style={{
          width: cellSize,
          height: cellSize,
          borderRadius: resolvedCellRadius,
        }}
        initial={
          reducedMotion || animation === "none"
            ? false
            : { opacity: 0, scale: 0.35, y: 4 }
        }
        animate={{ opacity: 1, scale: 1, y: 0, filter }}
        transition={{
          opacity: { duration: 0.14, delay: entranceDelay },
          y: {
            type: "spring",
            stiffness: 520,
            damping: 28,
            delay: entranceDelay,
          },
          scale: { type: "spring", stiffness: 900, damping: 32 },
          filter: { duration: 0.08, ease: "easeOut" },
        }}
        onMouseEnter={(event) =>
          showTooltip(
            event.currentTarget,
            contribution,
            columnIndex,
            rowIndex,
            event
          )
        }
        onFocus={(event) =>
          showTooltip(event.currentTarget, contribution, columnIndex, rowIndex)
        }
        onBlur={() => setHoveredContribution(null)}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shadow-sm border border-white/5"
          style={{
            backgroundColor: colors[contribution.level],
            borderRadius: resolvedCellRadius,
          }}
          animate={ambientMotion.animate}
          transition={ambientMotion.transition}
        />
      </motion.button>
    );
  };

  return (
    <div
      ref={rootRef}
      className={cn("w-full space-y-4", className)}
    >
      {weeks.length > 0 && (
        <div
          className={cn(
            "py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-auto",
            autoFit ? "w-full overflow-hidden" : ""
          )}
        >
          <div
            className={cn(
              "relative pb-2",
              autoFit ? "grid w-full" : "flex min-w-max"
            )}
            style={
              autoFit
                ? {
                    gridTemplateColumns: `repeat(${autoFitColumns}, ${cellSize}px)`,
                    gap: cellGap,
                    justifyContent: "space-between",
                  }
                : { gap: cellGap }
            }
            role="grid"
            aria-label="Workout streak activity graph"
            onMouseLeave={() => setHoveredContribution(null)}
          >
            {autoFit
              ? weeks
                  .flat()
                  .map((contribution, index) =>
                    renderContribution(
                      contribution,
                      index % autoFitColumns,
                      Math.floor(index / autoFitColumns)
                    )
                  )
              : weeks.map((week, weekIndex) => (
                  <div
                    key={`${animationKey}-${weekIndex}`}
                    className="grid grid-rows-7"
                    style={{ gap: cellGap }}
                    role="row"
                  >
                    {week.map((contribution, dayIndex) =>
                      renderContribution(contribution, weekIndex, dayIndex)
                    )}
                  </div>
                ))}

            <AnimatePresence>
              {hoveredContribution && (
                <motion.div
                  role="tooltip"
                  className="pointer-events-none fixed z-[999] whitespace-nowrap rounded-2xl bg-[#090C0E] px-3.5 py-2 text-xs font-semibold text-white shadow-2xl border border-white/20 ring-1 ring-white/10 backdrop-blur-xl"
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    left: hoveredContribution.originLeft,
                    top: hoveredContribution.originTop,
                    x: "-50%",
                    y:
                      hoveredContribution.placement === "above"
                        ? "-100%"
                        : "0%",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: hoveredContribution.left,
                    top: hoveredContribution.top,
                    x: "-50%",
                    y:
                      hoveredContribution.placement === "above"
                        ? "-100%"
                        : "0%",
                  }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{
                    opacity: { duration: 0.12 },
                    scale: { duration: 0.12 },
                    left: { type: "spring", stiffness: 620, damping: 42 },
                    top: { type: "spring", stiffness: 620, damping: 42 },
                    y: { duration: 0.12 },
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: colors[hoveredContribution.contribution.level],
                        boxShadow: `0 0 8px ${colors[hoveredContribution.contribution.level]}`
                      }}
                    />
                    <span>{formatContributionLabel(hoveredContribution.contribution)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {showLegend && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: '#ef4444',
                  borderRadius: 3.5,
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.4)'
                }}
              />
              <span className="text-rose-300 font-medium">🔴 Not Checked-In (Absent / Rest)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 items-center">
                {colors.slice(1).map((color, idx) => (
                  <span
                    key={color}
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: color,
                      borderRadius: 3.5,
                      boxShadow: '0 0 6px rgba(34, 197, 94, 0.3)'
                    }}
                    title={`Session Intensity Level ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-emerald-300 font-medium">🟢 Checked-In (Gym Present)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>● 13.56 MHz RFID Sensor Sync</span>
          </div>
        </div>
      )}
    </div>
  );
}
