import React, { useRef, useState, useEffect } from "react";

export default function DepthParallaxWords({
  children,
  className = "",
  delay = 0,
  depth = 30,
  perspective = 1000,
  as: Component = "div",
  ...props
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container)
        container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const text = typeof children === "string" ? children : String(children || "");
  const words = text.split(" ");

  return (
    <Component
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className={`relative inline-flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-1 select-none transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {words.map((word, idx) => {
        const factor = ((idx % 3) + 1) * (depth / 2);
        const rotateX = mousePos.y * -18 * (idx % 2 === 0 ? 1 : 1.2);
        const rotateY = mousePos.x * 22 * (idx % 2 === 0 ? 1.2 : 0.9);
        const translateZ = isHovered ? factor * 1.5 : 0;
        const translateX = mousePos.x * factor * 1.4;
        const translateY = mousePos.y * factor * 1.1;

        return (
          <span
            key={idx}
            className="inline-block transition-transform duration-200 ease-out will-change-transform transform-gpu"
            style={{
              transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
              transitionDelay: `${idx * 20}ms`,
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
