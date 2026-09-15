import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./CylinderDrag3D.css";

export default function CylinderDrag3D() {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const draggerRef = useRef(null);

  const images = [
    { src: "/arena1.jpg", title: "IRON TEMPLE" },
    { src: "/arena2.jpg", title: "METABOLIC ROPES" },
    { src: "/wrathx-preworkout.jpg", title: "WRATHX PRE-WORKOUT" },
    {
      src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80",
      title: "POWERLIFTING ARENA",
    },
    {
      src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80",
      title: "HYPERTROPHY LAB",
    },
    {
      src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80",
      title: "HIIT BLAST DECK",
    },
    {
      src: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=700&q=80",
      title: "COMBAT STRIKE",
    },
    {
      src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80",
      title: "ARMORY BENCH",
    },
    {
      src: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=700&q=80",
      title: "CALISTHENICS RACK",
    },
    {
      src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=700&q=80",
      title: "OLYMPIC PLATFORM",
    },
  ];

  useEffect(() => {
    const ring = ringRef.current;
    const dragger = draggerRef.current;
    if (!ring || !dragger) return;

    const imgElements = ring.querySelectorAll(".ring-img");

    function getBgPos(i) {
      const currentRotY = gsap.getProperty(ring, "rotationY") || 180;
      const wrappedAngle = gsap.utils.wrap(0, 360, currentRotY - 180 - i * 36);
      return (-wrappedAngle / 360) * 400 + "px 0px";
    }

    function updateAllBgPos() {
      imgElements.forEach((img, i) => {
        const imgInner = img.querySelector("img");
        if (imgInner) {
          const rotY = gsap.getProperty(ring, "rotationY") || 0;
          const shiftX = (rotY % 360) * 0.4;
          gsap.set(imgInner, { x: shiftX * 0.2 });
        }
      });
    }

    // Set initial 3D transform positions for each image ring node
    gsap.set(ring, { rotationY: 180 });
    imgElements.forEach((img, i) => {
      gsap.set(img, {
        rotateY: i * -36,
        transformOrigin: "50% 50% 520px",
        z: -520,
        backfaceVisibility: "hidden",
      });
    });

    // Entrance stagger animation
    gsap.fromTo(
      imgElements,
      {
        y: 180,
        opacity: 0,
      },
      {
        duration: 1.4,
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "expo.out",
      },
    );

    // Drag Interaction Handlers
    let isDragging = false;
    let xPos = 0;
    let currentRotationY = 180;
    let autoRotateTween;

    function startAutoRotate() {
      if (autoRotateTween) autoRotateTween.kill();
      autoRotateTween = gsap.to(ring, {
        rotationY: "+=360",
        duration: 35,
        ease: "none",
        repeat: -1,
        onUpdate: updateAllBgPos,
      });
    }

    startAutoRotate();

    function handlePointerDown(e) {
      isDragging = true;
      if (autoRotateTween) autoRotateTween.pause();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      xPos = Math.round(clientX);
      currentRotationY = gsap.getProperty(ring, "rotationY");
    }

    function handlePointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = Math.round(clientX) - xPos;
      xPos = Math.round(clientX);

      currentRotationY -= deltaX * 0.65;
      gsap.to(ring, {
        rotationY: currentRotationY,
        duration: 0.15,
        ease: "power1.out",
        onUpdate: updateAllBgPos,
      });
    }

    function handlePointerUp() {
      if (!isDragging) return;
      isDragging = false;
      // Snap rotation smoothly to nearest card angle
      const snappedRot = Math.round(currentRotationY / 36) * 36;
      gsap.to(ring, {
        rotationY: snappedRot,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: updateAllBgPos,
        onComplete: () => {
          if (autoRotateTween) autoRotateTween.resume();
        },
      });
    }

    dragger.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    dragger.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      if (autoRotateTween) autoRotateTween.kill();
      dragger.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);

      dragger.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="cylinder-drag-container">
      <div className="cylinder-perspective">
        <div id="ring" ref={ringRef}>
          {images.map((item, i) => (
            <div key={i} className="ring-img">
              <img src={item.src} alt={item.title} />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent text-left pointer-events-none">
                <span className="font-bebas text-lg text-white tracking-wider block">
                  {item.title}
                </span>
                <span className="text-[10px] uppercase font-mono text-[#E50914] tracking-widest block">
                  ZONE 0{i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vignette-overlay" />
      <div id="dragger" ref={draggerRef} />

      <div className="drag-instruction-badge">
        <span>DRAG HORIZONTALLY TO SPIN 360° ARENA RING</span>
      </div>
    </div>
  );
}
