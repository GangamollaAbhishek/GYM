import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";

export function getAnimationVariants(type = "scale") {
  switch (type) {
    case "slide":
      return {
        initial: { opacity: 0, y: -30, scale: 1 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
      };
    case "fade":
      return {
        initial: { opacity: 0, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1 },
      };
    case "bounce":
      return {
        initial: { opacity: 0, y: -25, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };
    case "scale":
    default:
      return {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };
  }
}

export function AnimatedList({
  items = [],
  renderItem,
  maxVisible = 8,
  gap = 12,
  animation = "scale",
  className = "",
}) {
  const visible = items.slice(0, maxVisible);
  const variants = getAnimationVariants(animation);

  return (
    <div className={cn("flex flex-col", className)} style={{ gap: `${gap}px` }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map((item, index) => (
          <motion.div
            key={item.id ?? index}
            layout
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
              layout: { type: "spring", stiffness: 350, damping: 28 },
            }}
          >
            {renderItem ? renderItem(item, index) : item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedList;
