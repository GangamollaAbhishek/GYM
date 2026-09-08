import React, { useState, useEffect, useRef } from "react";
import api from "../lib/api";

// Sound Engine using Web Audio API Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playType() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(350, t + 0.015);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      o.connect(g).connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.015);
    } catch (e) {}
  }

  playDelete() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(800, t);
      o.frequency.exponentialRampToValueAtTime(200, t + 0.018);
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
      o.connect(g).connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.018);
    } catch (e) {}
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [
        { freq: 523.25, start: 0, dur: 0.12, vol: 0.1 },
        { freq: 659.25, start: 0.08, dur: 0.12, vol: 0.12 },
        { freq: 783.99, start: 0.16, dur: 0.15, vol: 0.14 },
        { freq: 1046.5, start: 0.24, dur: 0.8, vol: 0.16 },
      ];
      notes.forEach((n) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(n.freq, t + n.start);
        g.gain.setValueAtTime(n.vol, t + n.start);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.start + n.dur);
        o.connect(g).connect(this.ctx.destination);
        o.start(t + n.start);
        o.stop(t + n.start + n.dur);
      });
    } catch (e) {}
  }

  playError() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(240, t);
      o.frequency.exponentialRampToValueAtTime(100, t + 0.18);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.18);
    } catch (e) {}
  }

  playWaterSplash() {
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(300, t);
      o.frequency.exponentialRampToValueAtTime(800, t + 0.25);
      o.frequency.exponentialRampToValueAtTime(150, t + 0.6);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.connect(g).connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.6);
    } catch (e) {}
  }
}

// Particle Engine for Canvas Confetti
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
    this.particles = [];
    this.animating = false;
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startLoop() {
    if (this.animating) return;
    this.animating = true;
    this._animate();
  }

  confetti(x, y, count = 65) {
    if (!this.canvas || !this.ctx) return;
    const colors = [
      "#00ffba",
      "#00e5ff",
      "#22c55e",
      "#4ade80",
      "#c4a265",
      "#ff5533",
      "#ffffff",
    ];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        life: 1,
        decay: 0.007 + Math.random() * 0.008,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.09,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        isRect: Math.random() > 0.3,
      });
    }
    this.startLoop();
  }

  _animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.gravity) p.vy += p.gravity;
      if (p.rotSpeed) p.rotation += p.rotSpeed;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.min(p.life, 1);
      this.ctx.fillStyle = p.color;

      if (p.isRect) {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(((p.rotation || 0) * Math.PI) / 180);
        this.ctx.fillRect(-p.size / 2, -p.size * 0.4, p.size, p.size * 0.7);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this._animate());
    } else {
      this.animating = false;
    }
  }
}

export default function VerifyNumberModal({
  customer,
  onClose,
  onVerifiedSuccess,
  onResendOtp,
}) {
  const [theme, setTheme] = useState("dark"); // 'light' | 'dark'
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("input"); // 'input' | 'water_splash' | 'details'
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [verifiedRecord, setVerifiedRecord] = useState(null);

  const inputRefs = useRef([]);
  const soundEngineRef = useRef(null);
  const particleEngineRef = useRef(null);
  const canvasRef = useRef(null);
  const detailsCardRef = useRef(null);

  useEffect(() => {
    soundEngineRef.current = new SoundEngine();
    if (canvasRef.current) {
      particleEngineRef.current = new ParticleEngine(canvasRef.current);
      particleEngineRef.current.resize();
    }

    const handleResize = () => {
      if (particleEngineRef.current) {
        particleEngineRef.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        setActiveIndex(0);
      }
    }, 300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    if (soundEngineRef.current) soundEngineRef.current.playType();
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleInputChange = (e, index) => {
    if (isProcessing || animationPhase !== "input") return;
    const rawVal = e.target.value.replace(/\D/g, "");
    const digit = rawVal.slice(-1);

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMessage("");

    if (digit) {
      if (soundEngineRef.current) soundEngineRef.current.playType();
      if (index < 3) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
          setActiveIndex(index + 1);
        }
      } else {
        setActiveIndex(index);
      }
    }

    // If all 4 digits are filled, automatically trigger verification
    const updatedFull = newDigits.join("");
    if (updatedFull.length === 4) {
      triggerVerification(updatedFull, newDigits);
    }
  };

  const handleKeyDown = (e, index) => {
    if (isProcessing || animationPhase !== "input") return;

    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        if (soundEngineRef.current) soundEngineRef.current.playDelete();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
          setActiveIndex(index - 1);
        }
      } else {
        if (soundEngineRef.current) soundEngineRef.current.playDelete();
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
        setActiveIndex(index - 1);
      }
    } else if (e.key === "ArrowRight" && index < 3) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
        setActiveIndex(index + 1);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isProcessing || animationPhase !== "input") return;
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    if (soundEngineRef.current) soundEngineRef.current.playType();
    const newDigits = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    const lastIdx = Math.min(pasted.length, 3);
    if (inputRefs.current[lastIdx]) {
      inputRefs.current[lastIdx].focus();
      setActiveIndex(lastIdx);
    }

    if (pasted.length === 4) {
      triggerVerification(pasted, newDigits);
    }
  };

  const triggerVerification = async (enteredOtp, digitsArray) => {
    setIsProcessing(true);
    setErrorMessage("");

    // Blur inputs
    inputRefs.current.forEach((inp) => inp && inp.blur());
    setActiveIndex(-1);

    const startTime = Date.now();

    try {
      // Direct call to verify endpoint
      const res = await api.post("/api/attendance/verify-otp", {
        customerId: customer?.id,
        userId: customer?.userId,
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        plan: customer?.plan,
        otp: enteredOtp,
        terminal: "Turnstile Gate Alpha-1 (Front Desk Manual)",
      });

      if (res.data?.status === "success" && res.data?.data) {
        const record = res.data.data;
        setVerifiedRecord(record);

        // 1. Trigger the Kinetic Water & Plunge Splash Animation Effect
        setAnimationPhase("water_splash");
        if (soundEngineRef.current) {
          soundEngineRef.current.playSuccess();
          setTimeout(() => soundEngineRef.current?.playWaterSplash(), 2000);
        }

        // 2. After kinetic water & plunge effect completes (~3.8s), reveal the Customer Details card!
        setTimeout(() => {
          setAnimationPhase("details");

          // Fire Confetti Burst
          if (particleEngineRef.current && detailsCardRef.current) {
            const rect = detailsCardRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            particleEngineRef.current.confetti(cx, cy, 75);
          }

          // Notify parent dashboard to update attendance records
          if (onVerifiedSuccess) {
            onVerifiedSuccess(record);
          }
        }, 3800);
      } else {
        throw new Error(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.warn("Verification failed:", err);
      // WRONG OTP: Instant quick rejection within ~150ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 150) {
        await new Promise((r) => setTimeout(r, 150 - elapsed));
      }

      setIsProcessing(false);
      setIsShaking(true);
      if (soundEngineRef.current) {
        soundEngineRef.current.playError();
      }

      const msg =
        err.response?.data?.message || "Invalid or expired OTP. Please try again.";
      setErrorMessage(msg);
      setOtpDigits(["", "", "", ""]);

      setTimeout(() => {
        setIsShaking(false);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          setActiveIndex(0);
        }
      }, 300);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (isResending) return;
    setIsResending(true);
    setErrorMessage("");
    if (soundEngineRef.current) soundEngineRef.current.playType();

    try {
      if (onResendOtp) {
        await onResendOtp();
      } else {
        await api.post("/api/attendance/request-otp", {
          customerId: customer?.id,
          userId: customer?.userId,
          name: customer?.name,
          email: customer?.email,
          phone: customer?.phone,
          plan: customer?.plan,
        });
      }
      setOtpDigits(["", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        setActiveIndex(0);
      }
    } catch (err) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const targetName = customer?.name || "Valued Athlete";
  const targetPhone = customer?.phone || "Live Token";

  return (
    <>
      <style>{`
        /* ============================================
           Kinetic Water, Plunge & Tremble Animation
           Theme Switcher (Light & Dark)
           ============================================ */

        .orbit-modal-root {
          --color-cyan: #00ffba;
          --color-cyan-glow: rgba(0, 255, 186, 0.4);
          --color-cyan-bg: rgba(0, 255, 186, 0.12);
        }

        /* LIGHT THEME VARIABLES */
        .orbit-modal-root.theme-light {
          --bg-page: linear-gradient(160deg, #fdf9f4 0%, #f5efe6 35%, #f0e8dc 70%, #ece3d4 100%);
          --bg-card: rgba(255, 255, 255, 0.94);
          --border-card: rgba(196, 162, 101, 0.3);
          --bg-input: rgba(255, 255, 255, 0.95);
          --border-input: #e8ddd0;
          --accent-orange: #c4a265;
          --accent-glow: rgba(196, 162, 101, 0.3);
          --success-green: #22c55e;
          --text-main: #2b1f14;
          --text-muted: #7d6e5d;
          --drag-color: #d4c5b2;
          --shadow-card: 0 35px 90px -15px rgba(139, 111, 71, 0.25);
          --toggle-bg: rgba(139, 111, 71, 0.1);
          --toggle-border: rgba(196, 162, 101, 0.35);
          --toggle-color: #8b6f47;
        }

        /* DARK THEME VARIABLES */
        .orbit-modal-root.theme-dark {
          --bg-page: #0c0c0e;
          --bg-card: #141419;
          --border-card: #282834;
          --bg-input: #1b1b24;
          --border-input: #2d2d3c;
          --accent-orange: #00ffba;
          --accent-glow: rgba(0, 255, 186, 0.35);
          --success-green: #00ffba;
          --text-main: #ffffff;
          --text-muted: #8e8e9e;
          --drag-color: #383845;
          --shadow-card: 0 40px 100px -20px rgba(0, 0, 0, 0.85);
          --toggle-bg: rgba(255, 255, 255, 0.08);
          --toggle-border: rgba(255, 255, 255, 0.15);
          --toggle-color: #ffffff;
        }

        .orbit-modal-card {
          width: 100%;
          max-width: 480px;
          padding: 24px 32px 36px;
          border-radius: 36px;
          background: var(--bg-card);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--border-card);
          position: relative;
          text-align: center;
          box-shadow: var(--shadow-card);
          transition: all 0.5s ease;
          animation: orbitModalEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }

        @keyframes orbitModalEnter {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .orbit-top-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 24px;
        }

        .orbit-drag-handle {
          width: 44px;
          height: 4px;
          background: var(--drag-color);
          border-radius: 2px;
        }

        .orbit-theme-toggle-btn {
          position: absolute;
          right: -10px;
          top: -6px;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: var(--toggle-bg);
          border: 1px solid var(--toggle-border);
          color: var(--toggle-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 20;
        }

        .orbit-close-btn {
          position: absolute;
          left: -10px;
          top: -6px;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: var(--toggle-bg);
          border: 1px solid var(--toggle-border);
          color: var(--toggle-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 20;
        }

        .orbit-header {
          margin-bottom: 24px;
        }

        .orbit-header h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 6px;
          letter-spacing: -0.4px;
        }

        .orbit-header p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 360px;
          margin: 0 auto;
        }

        /* ========================================================
           PHASE 1: 4-DIGIT INPUT CELLS & VIBRATION
           ======================================================== */
        .orbit-inputs-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        @keyframes orbitShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-9px); }
          40%, 80% { transform: translateX(9px); }
        }

        .orbit-inputs-row.has-error {
          animation: orbitShake 0.35s ease-in-out;
        }

        .orbit-inputs-row.has-error .orbit-input-cell {
          border-color: #ef4444 !important;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.45) !important;
        }

        .orbit-input-cell {
          position: relative;
          width: 70px;
          height: 78px;
          border-radius: 20px;
          background: var(--bg-input);
          border: 2px solid var(--border-input);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .orbit-input-cell.active {
          border-color: var(--accent-orange);
          box-shadow: 0 6px 20px var(--accent-glow);
          transform: translateY(-2px);
        }

        .orbit-otp-input {
          width: 100%;
          height: 100%;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          text-align: center;
          color: var(--text-main);
          background: transparent;
          outline: none;
        }

        /* ========================================================
           PHASE 2: KINETIC WATER, PLUNGE, TREMBLE & SPLASH (CYAN #00ffba)
           ======================================================== */
        .kinetic-stage-wrap {
          position: relative;
          width: 100%;
          height: 270px;
          border-radius: 24px;
          background: #07090e;
          border: 1.5px solid rgba(0, 255, 186, 0.4);
          box-shadow: inset 0 0 40px rgba(0, 255, 186, 0.15), 0 10px 30px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          margin: 10px 0 20px;
        }

        /* Number Trembling */
        .tremble {
          animation: kineticTremble 0.1s infinite;
          display: inline-block;
          font-family: 'Space Grotesk', monospace;
          font-size: 32px;
          font-weight: 900;
          color: #00ffba;
          text-shadow: 0 0 14px rgba(0, 255, 186, 0.9);
        }

        @keyframes kineticTremble {
          0% { margin-left: 0; transform: rotate(0deg); }
          50% { margin-left: 5px; transform: rotate(2deg); }
          100% { margin-left: 0; transform: rotate(0deg); }
        }

        /* Objects (Circle, Square, Diamond) */
        .kinetic-objects {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .kinetic-object {
          border: 2px solid #00ffba;
          position: absolute;
          box-shadow: 0 0 12px rgba(0, 255, 186, 0.5);
        }

        .kinetic-object.circle { border-radius: 50%; }
        .kinetic-object.diamond { transform: rotate(45deg); }

        .kinetic-object:nth-child(1) { width: 35px; height: 35px; left: 8%; animation: kineticFlyUp 850ms both 6; opacity: 0.2; }
        .kinetic-object:nth-child(2) { width: 55px; height: 55px; left: 28%; animation: kineticFlyUp 750ms both 6; opacity: 0.4; }
        .kinetic-object:nth-child(3) { width: 28px; height: 28px; left: 45%; animation: kineticFlyUp 650ms both 6; opacity: 0.6; }
        .kinetic-object:nth-child(4) { width: 60px; height: 60px; left: 68%; animation: kineticFlyUp 550ms both 6; opacity: 0.8; }
        .kinetic-object:nth-child(5) { width: 42px; height: 42px; left: 85%; animation: kineticFlyUp 500ms both 6; opacity: 0.9; }
        .kinetic-object:nth-child(6) { width: 50px; height: 50px; left: 18%; animation: kineticFlyUp 800ms both 6; opacity: 0.3; }
        .kinetic-object:nth-child(7) { width: 22px; height: 22px; left: 58%; animation: kineticFlyUp 600ms both 6; opacity: 0.7; }
        .kinetic-object:nth-child(8) { width: 68px; height: 68px; left: 78%; animation: kineticFlyUp 450ms both 6; opacity: 0.85; }

        @keyframes kineticFlyUp {
          0% { bottom: -15%; }
          100% { bottom: 125%; }
        }

        /* Letters Timeline (Fall -> Bfall -> Plonge) */
        .kinetic-letters {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .fall--1 { animation: kFall1 1.8s 0s both; left: 15%; position: absolute; }
        .fall--2 { animation: kFall2 1.8s 0.05s both; left: 26%; position: absolute; }
        .fall--3 { animation: kFall3 1.8s 0.1s both; left: 38%; position: absolute; }
        .fall--4 { animation: kFall4 1.8s 0.15s both; left: 50%; position: absolute; }
        .fall--5 { animation: kFall5 1.8s 0.2s both; left: 62%; position: absolute; }
        .fall--6 { animation: kFall6 1.8s 0.25s both; left: 74%; position: absolute; }
        .fall--7 { animation: kFall7 1.8s 0.3s both; left: 85%; position: absolute; }

        @keyframes kFall1 { 0% { top: -20%; } 100% { top: 62%; } }
        @keyframes kFall2 { 0% { top: -20%; } 100% { top: 65%; } }
        @keyframes kFall3 { 0% { top: -20%; } 100% { top: 60%; } }
        @keyframes kFall4 { 0% { top: -20%; } 100% { top: 66%; } }
        @keyframes kFall5 { 0% { top: -20%; } 100% { top: 63%; } }
        @keyframes kFall6 { 0% { top: -20%; } 100% { top: 67%; } }
        @keyframes kFall7 { 0% { top: -20%; } 100% { top: 61%; } }

        .bfall--1 { animation: kBfall 0.8s 1.6s both; position: relative; }
        .bfall--2 { animation: kBfall 0.8s 1.65s both; position: relative; }
        .bfall--3 { animation: kBfall 0.8s 1.7s both; position: relative; }
        .bfall--4 { animation: kBfall 0.8s 1.75s both; position: relative; }
        .bfall--5 { animation: kBfall 0.8s 1.8s both; position: relative; }
        .bfall--6 { animation: kBfall 0.8s 1.85s both; position: relative; }
        .bfall--7 { animation: kBfall 0.8s 1.9s both; position: relative; }

        @keyframes kBfall {
          0% { top: 0; }
          100% { top: -80px; }
        }

        .plonge--1 { animation: kPlonge 0.9s 2.2s both; position: relative; }
        .plonge--2 { animation: kPlonge 0.9s 2.25s both; position: relative; }
        .plonge--3 { animation: kPlonge 0.9s 2.3s both; position: relative; }
        .plonge--4 { animation: kPlonge 0.9s 2.35s both; position: relative; }
        .plonge--5 { animation: kPlonge 0.9s 2.4s both; position: relative; }
        .plonge--6 { animation: kPlonge 0.9s 2.45s both; position: relative; }
        .plonge--7 { animation: kPlonge 0.9s 2.5s both; position: relative; }

        @keyframes kPlonge {
          0% { top: 0; }
          100% { top: 160px; opacity: 0; }
        }

        /* Rising Water & Wobble Trampoline */
        .kinetic-full-water {
          animation: kFullRising 0.9s 3.1s both;
          height: 100%;
          left: 0;
          position: absolute;
          width: 100%;
          bottom: 0;
          pointer-events: none;
        }

        @keyframes kFullRising {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0%); }
        }

        .kinetic-water {
          animation: kRising 1.2s 1.9s both;
          background: linear-gradient(180deg, rgba(0, 255, 186, 0.85) 0%, rgba(0, 190, 140, 0.95) 100%);
          height: 100%;
          left: 0;
          position: absolute;
          width: 100%;
          box-shadow: 0 -10px 30px rgba(0, 255, 186, 0.7);
        }

        @keyframes kRising {
          0% { top: 120%; }
          100% { top: 55%; }
        }

        /* Splashes */
        .kinetic-splash {
          background-color: #00ffba;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 10px #00ffba;
        }

        .kinetic-splash--1 { width: 14px; height: 14px; left: 20%; animation: kSplash1 0.8s 2.4s both; }
        .kinetic-splash--2 { width: 20px; height: 20px; left: 35%; animation: kSplash2 0.8s 2.45s both; }
        .kinetic-splash--3 { width: 16px; height: 16px; left: 50%; animation: kSplash1 0.8s 2.5s both; }
        .kinetic-splash--4 { width: 24px; height: 24px; left: 65%; animation: kSplash2 0.8s 2.55s both; }
        .kinetic-splash--5 { width: 18px; height: 18px; left: 80%; animation: kSplash1 0.8s 2.6s both; }

        @keyframes kSplash1 {
          0% { top: 0; opacity: 1; transform: translateY(0); }
          100% { top: -60px; opacity: 0; transform: translateY(-30px); }
        }

        @keyframes kSplash2 {
          0% { top: 0; opacity: 1; transform: translateY(0); }
          100% { top: -80px; opacity: 0; transform: translateY(-45px); }
        }

        .kinetic-wobble {
          margin-top: -30px;
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
        }

        /* ========================================================
           PHASE 3: VERIFIED CUSTOMER DETAILS & CHECK-IN CONFIRMATION
           ======================================================== */
        .details-card-wrap {
          animation: detailsSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          text-align: left;
        }

        @keyframes detailsSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[250]"
        />

        {/* Modal Root Container */}
        <div className={`orbit-modal-root theme-${theme}`}>
          <div className="orbit-modal-card" id="modal-card">
            {/* Top Bar (Close & Theme Toggle) */}
            <div className="orbit-top-bar">
              <button
                type="button"
                onClick={onClose}
                className="orbit-close-btn"
                title="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="orbit-drag-handle"></div>

              <button
                type="button"
                className="orbit-theme-toggle-btn"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4.5 h-4.5 text-amber-400"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4.5 h-4.5 text-slate-700"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* ========================================================
               PHASE 1: ENTER 4-DIGIT OTP
               ======================================================== */}
            {animationPhase === "input" && (
              <>
                <div className="orbit-header">
                  <h1>Verify Check-In OTP</h1>
                  <p>
                    Enter the 4-digit code provided on the customer dashboard for{" "}
                    <strong className="text-white">{targetName}</strong>.
                  </p>
                </div>

                <div className="py-4">
                  <div
                    className={`orbit-inputs-row ${isShaking ? "has-error" : ""}`}
                    onPaste={handlePaste}
                  >
                    {[0, 1, 2, 3].map((index) => {
                      const isActive = activeIndex === index;
                      const isFilled = Boolean(otpDigits[index]);
                      return (
                        <div
                          key={index}
                          className={`orbit-input-cell ${isActive ? "active" : ""} ${isFilled ? "filled" : ""}`}
                          onClick={() => {
                            if (inputRefs.current[index]) {
                              inputRefs.current[index].focus();
                              setActiveIndex(index);
                            }
                          }}
                        >
                          <input
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="\\d*"
                            maxLength={1}
                            value={otpDigits[index]}
                            disabled={isProcessing}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={() => setActiveIndex(index)}
                            className="orbit-otp-input"
                            autoComplete="off"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-500 font-medium my-2">
                    ⚠️ {errorMessage}
                  </p>
                )}

                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                  <span>Validity: 2:00 Mins</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-[#00ffba] hover:underline font-bold"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* ========================================================
               PHASE 2: KINETIC WATER, PLUNGE & TREMBLE ANIMATION (#00ffba)
               ======================================================== */}
            {animationPhase === "water_splash" && (
              <div>
                <div className="orbit-header">
                  <h1 className="text-[#00ffba] animate-pulse">Authenticating Pass...</h1>
                  <p>Decrypting biometric turnstile token & clocking athlete in</p>
                </div>

                <div className="kinetic-stage-wrap">
                  {/* Floating Kinetic Objects */}
                  <div className="kinetic-objects">
                    <div className="kinetic-object circle"></div>
                    <div className="kinetic-object square"></div>
                    <div className="kinetic-object diamond"></div>
                    <div className="kinetic-object circle"></div>
                    <div className="kinetic-object square"></div>
                    <div className="kinetic-object diamond"></div>
                    <div className="kinetic-object circle"></div>
                    <div className="kinetic-object diamond"></div>
                  </div>

                  {/* Kinetic Trembling Letters Falling & Plunging */}
                  <div className="kinetic-letters">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <span key={num} className={`fall--${num}`}>
                        <span className={`bfall--${num}`}>
                          <span className={`plonge--${num}`}>
                            <span className="tremble">{otpDigits[num % 4] || num}</span>
                          </span>
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Rising Water, Splash & Wobble Trampoline */}
                  <div className="kinetic-full-water">
                    <div className="kinetic-water">
                      <div className="kinetic-splash kinetic-splash--1"></div>
                      <div className="kinetic-splash kinetic-splash--2"></div>
                      <div className="kinetic-splash kinetic-splash--3"></div>
                      <div className="kinetic-splash kinetic-splash--4"></div>
                      <div className="kinetic-splash kinetic-splash--5"></div>

                      <svg
                        className="kinetic-wobble"
                        viewBox="0 0 841.9 73.5"
                        preserveAspectRatio="none"
                      >
                        <path
                          id="trampoline"
                          fill="#00ffba"
                          d="M851,79.5H-8V13.4c0,0,243,0,430,0s429,0,429,0V79.5z"
                        >
                          <animate
                            attributeName="d"
                            begin="0s"
                            dur="1.2s"
                            repeatCount="indefinite"
                            keyTimes="0; 0.25; 0.65; 1"
                            values="M851,79.5H-8V13.4c0,0,243,0,430,0s429,0,429,0V79.5z; M851,79.5H-8V13.4c0,0,243,14,430,14s429-14,429-14V79.5z; M851,79.5H-8V13.4c0,0,243-6,430-6s429,6,429,6V79.5z; M851,79.5H-8V13.4c0,0,243,0,430,0s429,0,429,0V79.5z;"
                          />
                        </path>
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  ● Security Token Verified • Synchronizing Ledger
                </p>
              </div>
            )}

            {/* ========================================================
               PHASE 3: CUSTOMER NAME & CHECK-IN DETAILS DISPLAY
               ======================================================== */}
            {animationPhase === "details" && (
              <div ref={detailsCardRef} className="details-card-wrap space-y-4">
                {/* Header Confirmation Banner */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white font-['Outfit',sans-serif]">
                        CHECK-IN VERIFIED
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        Turnstile Gate Alpha-1 Admitted
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {verifiedRecord?.timeIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Athlete Member Profile Details */}
                <div className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3.5 pb-3 border-b border-white/[0.08]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00ffba]/30 to-[#00b4d8]/20 border border-[#00ffba]/50 flex items-center justify-center font-black text-lg text-white shrink-0 shadow-lg">
                      {targetName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {verifiedRecord?.name || targetName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>ID: #{verifiedRecord?.customerId || customer?.id || "CUST-001"}</span>
                        <span>•</span>
                        <span className="text-[#00ffba] font-semibold">
                          {verifiedRecord?.plan || customer?.plan || "TITAN PRO ANNUAL PASS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Log Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                        Date & Session
                      </span>
                      <strong className="text-white font-mono text-xs">
                        {verifiedRecord?.date || new Date().toISOString().split('T')[0]}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                        Gate Terminal
                      </span>
                      <strong className="text-white font-mono text-xs truncate block">
                        Gate Alpha-1
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                        Verification Type
                      </span>
                      <strong className="text-[#00ffba] font-mono text-xs">
                        Manual OTP
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                        Record ID
                      </span>
                      <strong className="text-slate-300 font-mono text-xs">
                        {verifiedRecord?.logId || "LOG-" + Date.now().toString().slice(-4)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00ffba] to-[#00b4d8] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Done / Next Member</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
