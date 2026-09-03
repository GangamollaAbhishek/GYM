import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export const VARIANTS = {
  attendance: ["#ef4444", "#064e3b", "#047857", "#10b981", "#34d399"],
  github: ["#ef4444", "#0e4429", "#006d32", "#26a641", "#39d353"],
  titan: ["#ef4444", "#4a0404", "#7f1d1d", "#dc2626", "#ff1e27"],
  emerald: ["#ef4444", "#047857", "#059669", "#10b981", "#22c55e"],
  ocean: ["#ef4444", "#0c4a6e", "#0284c7", "#38bdf8", "#7dd3fc"],
  violet: ["#ef4444", "#4c1d95", "#7c3aed", "#a855f7", "#c084fc"],
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
export function buildContributionWeeks(contributions, yearFilter = null) {
  let valid = (contributions || [])
    .map((item) => ({ ...item, parsedDate: dateFromISO(item.date) }))
    .filter((item) => item.parsedDate !== null && Number.isFinite(item.count))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (yearFilter) {
    valid = valid.filter(
      (item) => item.parsedDate.getUTCFullYear() === Number(yearFilter),
    );
  }

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
      Number.isInteger(explicitLevel) &&
      explicitLevel >= 0 &&
      explicitLevel <= 4
        ? count === 0
          ? 0
          : explicitLevel
        : fallbackLevel(count, maxCount);

    cells.push({
      date: key,
      count,
      level,
      duration: contribution?.duration,
      workout: contribution?.workout,
      parsedDate: date,
    });
  }

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
}

function selectRecentContributions(contributions, months, year = null) {
  if (year) {
    return (contributions || []).filter((item) => {
      const d = dateFromISO(item.date);
      return d && d.getUTCFullYear() === Number(year);
    });
  }

  const parsed = (contributions || [])
    .map((contribution) => ({
      contribution,
      date: dateFromISO(contribution.date),
    }))
    .filter((item) => item.date !== null);
  const latest = parsed.reduce(
    (current, item) => (!current || item.date > current ? item.date : current),
    null,
  );

  if (!latest) return [];

  const start = new Date(latest);
  start.setUTCMonth(
    start.getUTCMonth() - Math.max(1, Math.min(12, Math.round(months))),
  );
  return parsed
    .filter((item) => item.date >= start)
    .map((item) => item.contribution);
}

function formatContributionLabel(contribution) {
  const parsed = dateFromISO(contribution.date) ?? new Date();
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);

  if (contribution.count === 0 || contribution.level === 0) {
    return `🔴 Rest / Absent Day · ${date}`;
  }

  const durationStr = contribution.duration
    ? ` · ⏱️ ${contribution.duration}`
    : "";
  const workoutStr = contribution.workout ? ` (${contribution.workout})` : "";
  return `🟢 Present · ${date}${durationStr}${workoutStr}`;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function WorkoutStreakGraph({
  months = 6,
  year = null,
  variant = "github",
  animation = "wave",
  animationSpeed = 1,
  cellSize = 14,
  cellGap = 3.5,
  cellRadius = 3.5,
  autoFit = false,
  showLegend = true,
  showTooltips = true,
  ambientEffect = "twinkle",
  ambientIntensity = 0.5,
  data = [],
  title = "Workout Streak Matrix",
  subtitle = "Interactive contribution activity heatmap",
  className,
}) {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [hoveredContribution, setHoveredContribution] = useState(null);

  const colors = VARIANTS[variant] || VARIANTS.github;
  const resolvedCellRadius = Math.max(0, Math.min(cellRadius, cellSize / 2));

  const filteredData = useMemo(() => {
    return selectRecentContributions(data, months, year);
  }, [data, months, year]);

  const weeks = useMemo(() => {
    return buildContributionWeeks(filteredData, year);
  }, [filteredData, year]);

  // Compute Month Header Markers
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0]?.parsedDate;
      if (firstDay) {
        const monthIndex = firstDay.getUTCMonth();
        if (monthIndex !== lastMonth) {
          labels.push({
            monthName: MONTH_NAMES[monthIndex],
            weekIndex,
          });
          lastMonth = monthIndex;
        }
      }
    });

    return labels;
  }, [weeks]);

  const showTooltip = useCallback(
    (element, contribution, weekIndex, dayIndex, pointer) => {
      if (!showTooltips) return;
      const cellRect = element.getBoundingClientRect();
      const placement = cellRect.top > 56 ? "above" : "below";
      const left = Math.min(
        Math.max(cellRect.left + cellRect.width / 2, 130),
        window.innerWidth - 130,
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
    [showTooltips],
  );

  const renderContribution = (contribution, columnIndex, rowIndex) => {
    const label = formatContributionLabel(contribution);
    const entranceDelay = reducedMotion
      ? 0
      : (columnIndex * 0.02 + rowIndex * 0.01) * animationSpeed;

    return (
      <motion.button
        key={`cell-${contribution.date}-${columnIndex}-${rowIndex}`}
        type="button"
        role="gridcell"
        aria-label={label}
        className="relative outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[#FF1E27] cursor-pointer group"
        style={{
          width: cellSize,
          height: cellSize,
          borderRadius: resolvedCellRadius,
        }}
        initial={
          reducedMotion || animation === "none"
            ? false
            : { opacity: 0, scale: 0.4 }
        }
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.25, zIndex: 20 }}
        transition={{
          opacity: { duration: 0.15, delay: entranceDelay },
          scale: { type: "spring", stiffness: 600, damping: 25 },
        }}
        onMouseEnter={(event) =>
          showTooltip(
            event.currentTarget,
            contribution,
            columnIndex,
            rowIndex,
            event,
          )
        }
        onFocus={(event) =>
          showTooltip(event.currentTarget, contribution, columnIndex, rowIndex)
        }
        onBlur={() => setHoveredContribution(null)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-colors shadow-inner"
          style={{
            backgroundColor:
              contribution.level === 0
                ? "#ef4444"
                : colors[contribution.level] || colors[0],
            borderRadius: resolvedCellRadius,
            border:
              contribution.level === 0
                ? "1px solid rgba(239, 68, 68, 0.45)"
                : "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              contribution.level === 0
                ? "0 0 5px rgba(239, 68, 68, 0.25)"
                : "none",
          }}
        />
      </motion.button>
    );
  };

  return (
    <div
      ref={rootRef}
      className={cn("w-full space-y-4 font-sans select-none", className)}
    >
      {weeks.length > 0 && (
        <div className="py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-auto">
          <div className="flex flex-col min-w-max pb-2">
            {/* 1. Month Header Row */}
            <div className="flex pl-8 mb-1.5 text-[11px] font-mono text-slate-400">
              {monthLabels.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    left: `${m.weekIndex * (cellSize + cellGap)}px`,
                    width: 0,
                    whiteSpace: "nowrap",
                  }}
                  className="font-semibold"
                >
                  {m.monthName}
                </div>
              ))}
            </div>

            {/* 2. Grid Container with Weekday Labels */}
            <div className="flex items-start gap-2">
              {/* Day of Week Labels */}
              <div className="flex flex-col gap-[3.5px] pr-1 text-[9.5px] font-mono text-slate-500 font-bold select-none pt-0.5">
                {WEEKDAYS.map((day, idx) => (
                  <span
                    key={idx}
                    style={{ height: cellSize, lineHeight: `${cellSize}px` }}
                    className="h-[14px] flex items-center"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Weekly Columns */}
              <div
                className="flex"
                style={{ gap: cellGap }}
                role="grid"
                aria-label="Workout streak activity matrix"
                onMouseLeave={() => setHoveredContribution(null)}
              >
                {weeks.map((week, weekIndex) => (
                  <div
                    key={`week-${weekIndex}`}
                    className="grid grid-rows-7"
                    style={{ gap: cellGap }}
                    role="row"
                  >
                    {week.map((contribution, dayIndex) =>
                      renderContribution(contribution, weekIndex, dayIndex),
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Tooltip */}
            <AnimatePresence>
              {hoveredContribution && showTooltips && (
                <motion.div
                  role="tooltip"
                  className="pointer-events-none fixed z-[999] whitespace-nowrap rounded-2xl bg-[#090C0E] px-3.5 py-2.5 text-xs font-semibold text-white shadow-2xl border border-white/20 ring-1 ring-white/10 backdrop-blur-xl"
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
                        backgroundColor:
                          hoveredContribution.contribution.level === 0
                            ? "#ef4444"
                            : colors[hoveredContribution.contribution.level],
                        boxShadow: `0 0 8px ${hoveredContribution.contribution.level === 0 ? "#ef4444" : colors[hoveredContribution.contribution.level]}`,
                      }}
                    />
                    <span>
                      {formatContributionLabel(
                        hoveredContribution.contribution,
                      )}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Legend Bar */}
      {showLegend && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-5">
            {/* Absent Legend Indicator (Red) */}
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 13,
                  height: 13,
                  backgroundColor: "#ef4444",
                  borderRadius: 3,
                  border: "1px solid rgba(239, 68, 68, 0.6)",
                  boxShadow: "0 0 6px rgba(239, 68, 68, 0.45)",
                }}
              />
              <span className="text-rose-400 font-bold text-xs">
                🔴 Absent (Not Checked-In)
              </span>
            </div>

            {/* Present Activity Volume Scale */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Low</span>
              <div className="flex gap-1 items-center">
                {colors.slice(1).map((color, idx) => (
                  <span
                    key={color}
                    style={{
                      width: 13,
                      height: 13,
                      backgroundColor: color,
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    title={`Session Intensity Level ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-emerald-400 font-bold text-xs">
                🟢 Present (High Volume)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>✓ Verified Attendance Stream</span>
          </div>
        </div>
      )}
    </div>
  );
}
