export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "easeInOut" },
};

export const buttonTap = {
  scale: 0.95,
};
