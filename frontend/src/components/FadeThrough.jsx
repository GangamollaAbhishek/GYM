import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function FadeThrough({
  phrases = ["Forge Power.", "Shatter Limits.", "Master Performance."],
  interval = 3000,
  className = "",
  direction = "vertical", // 'vertical' | 'fade'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!phrases || phrases.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, interval);

    return () => clearInterval(timer);
  }, [phrases, interval]);

  if (!phrases || phrases.length === 0) return null;

  return (
    <span className={cn("inline-block relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{
            opacity: 0,
            y: direction === "vertical" ? 18 : 0,
            filter: "blur(6px)",
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: direction === "vertical" ? -18 : 0,
            filter: "blur(6px)",
            scale: 1.02,
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {phrases[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
