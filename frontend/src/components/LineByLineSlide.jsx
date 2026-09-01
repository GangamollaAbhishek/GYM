import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function LineByLineSlide({
  children,
  lines,
  delay = 0,
  staggerDelay = 180,
  duration = 0.85,
  className = "",
  lineClassName = "",
  once = false,
  amount = 0.35,
  viewport,
}) {
  // Extract lines from children (split by \n) or lines prop
  let textLines = [];
  if (Array.isArray(lines) && lines.length > 0) {
    textLines = lines;
  } else if (typeof children === "string") {
    textLines = children.split("\n").filter((l) => l.trim().length > 0);
  } else if (React.isValidElement(children)) {
    textLines = [children];
  }

  if (textLines.length === 0) return null;

  const resolvedViewport = viewport || {
    once: once,
    amount: amount,
    margin: "0px 0px -40px 0px",
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: delay / 1000,
      },
    },
  };

  const lineVariants = {
    hidden: {
      y: "120%",
      opacity: 0,
      rotateX: -18,
      filter: "blur(5px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Apple-style smooth cubic-bezier
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={resolvedViewport}
      className={cn("flex flex-col", className)}
      style={{ perspective: "1000px" }}
    >
      {textLines.map((line, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]"
        >
          <motion.span
            variants={lineVariants}
            className={cn("inline-block will-change-transform", lineClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
