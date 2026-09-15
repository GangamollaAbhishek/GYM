import React, { useEffect, useRef } from "react";

const FRAME_COUNT = 60;

export default function HeroScrollCanvas({ progress = 0 }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedFramesRef = useRef(new Set());
  const animationFrameRef = useRef(null);

  // Batched Preloading Engine
  useEffect(() => {
    const images = [];

    // Sample high-quality gym imagery URLs for sequence simulation
    const sampleUrls = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    ];

    // Initialize Image Array
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      images.push(img);
    }
    imagesRef.current = images;

    // Helper to load single frame
    const loadFrame = (index) => {
      if (loadedFramesRef.current.has(index)) return;
      const img = images[index];
      img.src = sampleUrls[index % sampleUrls.length];
      img.onload = () => {
        loadedFramesRef.current.add(index);
      };
    };

    // 1. Bootstrap Phase: Load frames [0, 1, 2] immediately
    loadFrame(0);
    loadFrame(1);
    loadFrame(2);

    // 2. Phase 1 (First 20 frames): Load in small batches of 5
    let currentPhase1 = 3;
    const interval1 = setInterval(() => {
      if (currentPhase1 >= 20) {
        clearInterval(interval1);
        // 3. Phase 2 (Remaining frames): Load in batches of 10
        let currentPhase2 = 20;
        const interval2 = setInterval(() => {
          if (currentPhase2 >= FRAME_COUNT) {
            clearInterval(interval2);
            return;
          }
          for (let i = 0; i < 10 && currentPhase2 + i < FRAME_COUNT; i++) {
            loadFrame(currentPhase2 + i);
          }
          currentPhase2 += 10;
        }, 100);
      } else {
        for (let i = 0; i < 5 && currentPhase1 + i < 20; i++) {
          loadFrame(currentPhase1 + i);
        }
        currentPhase1 += 5;
      }
    }, 50);

    return () => {
      clearInterval(interval1);
    };
  }, []);

  // Nearest Frame Fallback Helper
  const getNearestLoadedImage = (targetIndex) => {
    if (loadedFramesRef.current.has(targetIndex)) {
      return imagesRef.current[targetIndex];
    }

    // Search outward for nearest loaded frame
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      if (
        targetIndex - offset >= 0 &&
        loadedFramesRef.current.has(targetIndex - offset)
      ) {
        return imagesRef.current[targetIndex - offset];
      }
      if (
        targetIndex + offset < FRAME_COUNT &&
        loadedFramesRef.current.has(targetIndex + offset)
      ) {
        return imagesRef.current[targetIndex + offset];
      }
    }
    return null;
  };

  // Canvas Render Loop with Dynamic Responsive Scaling ("Object-Fit Cover") & High-DPR Optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Compute frame index from progress (0.0 to 1.0)
      const targetIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * (FRAME_COUNT - 1))),
      );
      const img = getNearestLoadedImage(targetIndex);

      if (img && img.complete && img.naturalWidth !== 0) {
        // Compute Object-Fit Cover scaling
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = width / imgRatio;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Dark Vignette & Color Grade Overlay
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          width * 0.2,
          width / 2,
          height / 2,
          width * 0.8,
        );
        grad.addColorStop(0, "rgba(9, 12, 14, 0.3)");
        grad.addColorStop(1, "rgba(9, 12, 14, 0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // High-Quality Procedural Gym Fallback Graphic
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#090C0E");
        grad.addColorStop(0.5, "#12161A");
        grad.addColorStop(1, "#090C0E");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Motion Lines
        ctx.strokeStyle = `rgba(255, 46, 76, ${0.1 + progress * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const y = (height / 6) * (i + 1) + Math.sin(progress * 10 + i) * 20;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y + Math.cos(progress * 5) * 30);
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[40px]"
    />
  );
}
