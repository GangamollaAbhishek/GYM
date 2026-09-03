import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function KineticText({
  text = "",
  className = "",
  as = "span",
  delay = 0,
  stagger = 0.025,
  ...props
}) {
  const Component = motion[as] || motion.span;
  const letters = Array.from(text);

  const smoothEase = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.92,
      rotateX: -45,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.1,
        ease: smoothEase,
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "inline-flex flex-wrap perspective-1000 select-none",
        className,
      )}
      {...props}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          whileHover={{
            scale: 1.08,
            y: -5,
            transition: { duration: 0.25, ease: smoothEase },
          }}
          className="inline-block transform-gpu origin-bottom cursor-pointer"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </Component>
  );
}

export default KineticText;
