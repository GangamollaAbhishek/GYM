import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function GlowEffect({
  colors = ["#ff0020", "#ff4d6d", "#ff758f", "#ff0020"],
  mode = "rotate",
  blur = "strongest",
  duration = 5,
  scale = 1,
  className,
}) {
  const blurMap = {
    soft: "blur-md",
    medium: "blur-xl",
    strong: "blur-2xl",
    strongest: "blur-[36px]",
  };

  const gradientStops = colors.join(", ");

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        animate={{
          rotate: mode === "rotate" ? [0, 360] : 0,
          scale: [scale, scale * 1.05, scale],
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          },
          scale: {
            repeat: Infinity,
            duration: duration / 2,
            ease: "easeInOut",
          },
        }}
        className={cn(
          "absolute -inset-[100%] origin-center opacity-75",
          blurMap[blur] || "blur-[30px]"
        )}
        style={{
          background: `conic-gradient(from 0deg, ${gradientStops})`,
        }}
      />
    </div>
  );
}

export default GlowEffect;
