import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function FluidBlobs({
  lightColors = ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"],
  darkColors = ["#8c0f60", "#e8227a", "#e8227a", "#ff85b3"],
  origins = [
    { x: 30, y: -20 },
    { x: 70, y: -10 },
    { x: 50, y: 10 },
    { x: 20, y: 30 },
  ],
  margin = 40,
  blur = 35,
  className,
}) {
  const colors = darkColors || lightColors;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none",
        className,
      )}
      style={{ filter: `blur(${blur}px)` }}
    >
      {origins.map((origin, idx) => {
        const color = colors[idx % colors.length];
        const animDuration = 4 + idx * 1.5;

        return (
          <motion.div
            key={idx}
            initial={{
              x: `${origin.x}%`,
              y: `${origin.y}%`,
              scale: 1,
            }}
            animate={{
              x: [
                `${origin.x}%`,
                `${origin.x + (idx % 2 === 0 ? margin * 0.4 : -margin * 0.4)}%`,
                `${origin.x - (idx % 2 === 0 ? margin * 0.3 : margin * 0.5)}%`,
                `${origin.x}%`,
              ],
              y: [
                `${origin.y}%`,
                `${origin.y + (idx % 2 === 0 ? margin * 0.3 : -margin * 0.3)}%`,
                `${origin.y - margin * 0.2}%`,
                `${origin.y}%`,
              ],
              scale: [1, 1.25, 0.85, 1],
              rotate: [0, 90, 180, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: animDuration,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle at center, ${color} 0%, transparent 75%)`,
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              position: "absolute",
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
}

export default FluidBlobs;
