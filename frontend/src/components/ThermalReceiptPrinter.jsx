import React, { useState, useEffect, useRef } from 'react';
import './ThermalReceiptPrinter.css';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';
import {
  Printer,
  Scissors,
  Download,
  X,
  Volume2,
  VolumeX,
  Video,
  ArrowLeftRight,
  Crown,
  ShoppingBag,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function ThermalReceiptPrinter({
  orderDetails,
  onClose = () => {},
  onViewOrders = () => {}
}) {
  const { cmsData } = useLandingPageCMS();
  const [state, setState] = useState('idle'); // 'idle' | 'printing' | 'printed' | 'tearing'
  const [currentMode, setCurrentMode] = useState('smooth'); // 'smooth' | 'classic'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dockSide, setDockSide] = useState('right'); // 'right' | 'left'
  const [isVideoMode, setIsVideoMode] = useState(false);

  const audioCtxRef = useRef(null);
  const ticketCardRef = useRef(null);
  const cutterBladeFlashRef = useRef(null);
  const slitGlowRef = useRef(null);
  const hoodLedRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiAnimRef = useRef(null);
  const particlesRef = useRef([]);

  // Extract authentic transaction data
  const baseOrder = orderDetails?.orderDetails || orderDetails?.rawOrder || orderDetails || {};

  const isMembership = Boolean(
    baseOrder?.category?.toLowerCase()?.includes('member') ||
    baseOrder?.category?.toLowerCase()?.includes('pass') ||
    baseOrder?.plan ||
    baseOrder?.planDetails ||
    baseOrder?.title?.toLowerCase()?.includes('pass') ||
    baseOrder?.title?.toLowerCase()?.includes('membership')
  );

  const rawAmountNum = typeof baseOrder?.amount === 'number'
    ? baseOrder.amount
    : parseFloat(String(baseOrder?.amount || baseOrder?.rawAmount || '0').replace(/[^\d.]/g, '')) || 0;

  const discount = baseOrder?.discount || 0;
  const subtotal = baseOrder?.subtotal || (rawAmountNum + discount);
  const totalAmount = rawAmountNum || (subtotal - discount) || 0;
  const orderId = baseOrder?.id || `ORD-TP-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = baseOrder?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const paymentMethod = baseOrder?.paymentMethod || baseOrder?.paymentStatus || baseOrder?.method || 'Paid (Online)';
  const customerName = baseOrder?.customerName || orderDetails?.customerName || 'Athlete Member';

  const items = Array.isArray(baseOrder?.items) && baseOrder.items.length > 0
    ? baseOrder.items
    : isMembership
    ? [
        {
          name: `${baseOrder?.plan || baseOrder?.title || 'Annual All-Access Biometric Pass'}`,
          price: subtotal || totalAmount || 2499,
          quantity: 1
        },
        {
          name: '24/7 Smart Biometric Turnstile NFC Gate Key',
          price: 0,
          quantity: 1
        },
        {
          name: '3D Telemetry Audit & Bio-Hacking Sauna Lounge',
          price: 0,
          quantity: 1
        }
      ]
    : [
        {
          name: baseOrder?.title || baseOrder?.item || 'Nutritional Supplement & Training Gear',
          price: subtotal || totalAmount || 0,
          quantity: 1
        }
      ];

  // ==========================================
  // WEB AUDIO SYNTHESIZER
  // ==========================================
  const initAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  };

  const playPrintAudio = (mode = 'smooth', durationMs = 2500) => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const durSec = durationMs / 1000;

      if (mode === 'classic') {
        const stepCount = 16;
        const stepInterval = durSec / stepCount;
        for (let i = 0; i < stepCount; i++) {
          const t = now + i * stepInterval;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190 + (i % 4) * 18, t);

          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
        }
      } else {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(280, now + durSec);

        const bufferSize = Math.floor(ctx.sampleRate * durSec);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.05;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2400;
        filter.Q.value = 2.5;

        g.gain.setValueAtTime(0.04, now);
        g.gain.linearRampToValueAtTime(0.06, now + 0.1);
        g.gain.linearRampToValueAtTime(0.03, now + durSec - 0.2);
        g.gain.exponentialRampToValueAtTime(0.0001, now + durSec);

        osc.connect(g);
        noise.connect(filter);
        filter.connect(g);
        g.connect(ctx.destination);

        osc.start(now);
        noise.start(now);
        osc.stop(now + durSec);
        noise.stop(now + durSec);
      }
    } catch (e) {}
  };

  const playBladeCutAudio = () => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  };

  const playTearAudio = () => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.35;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch (e) {}
  };

  // ==========================================
  // CONFETTI BURST ENGINE
  // ==========================================
  const launchConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff1e27', '#e50914', '#00f0ff', '#10b981', '#fbbf24', '#ffffff', '#a855f7'];
    particlesRef.current = [];

    const createParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4.5 + Math.random() * 9.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -(6 + Math.random() * 10),
        gravity: 0.24 + Math.random() * 0.12,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'triangle',
        size: 5 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        decay: 0.012 + Math.random() * 0.008
      };
    };

    const W = canvas.width;
    const H = canvas.height;
    const burstOrigins = [
      { x: W * 0.35, y: H * 0.35, count: 50 },
      { x: W * 0.5, y: H * 0.30, count: 80 },
      { x: W * 0.65, y: H * 0.35, count: 50 }
    ];

    burstOrigins.forEach((origin) => {
      for (let i = 0; i < origin.count; i++) {
        particlesRef.current.push(createParticle(origin.x + (Math.random() - 0.5) * 40, origin.y));
      }
    });

    const drawParticle = (p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.5);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0 && p.y < canvas.height + 50);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99;
        p.opacity -= p.decay;
        drawParticle(p);
      });

      if (particlesRef.current.length > 0) {
        confettiAnimRef.current = requestAnimationFrame(render);
      }
    };

    render();
  };

  // ==========================================
  // PRINT & TEAR SEQUENCES
  // ==========================================
  const triggerBladeFlash = () => {
    const flash = cutterBladeFlashRef.current;
    if (!flash) return;
    flash.classList.remove('active');
    void flash.offsetWidth;
    flash.classList.add('active');
    setTimeout(() => {
      if (flash) flash.classList.remove('active');
    }, 380);
  };

  const startPrintSequence = () => {
    if (state === 'printing') return;
    setState('printing');

    const duration = 2500;
    const card = ticketCardRef.current;
    const glow = slitGlowRef.current;
    const led = hoodLedRef.current;

    if (led) led.classList.add('printing');
    if (glow) glow.classList.add('active');

    triggerBladeFlash();
    playPrintAudio(currentMode, duration);

    if (card) {
      card.classList.remove('retracted', 'printed', 'tearing', 'printing-smooth', 'printing-classic');
      const animClass = currentMode === 'classic' ? 'printing-classic' : 'printing-smooth';
      card.style.animationDuration = `${duration}ms`;
      card.classList.add(animClass);
    }

    setTimeout(() => {
      if (card) {
        card.classList.remove('printing-smooth', 'printing-classic');
        card.classList.add('printed');
      }
      if (glow) glow.classList.remove('active');
      if (led) led.classList.remove('printing');

      triggerBladeFlash();
      playBladeCutAudio();

      setState('printed');

      // Trigger Confetti Celebration!
      setTimeout(() => {
        launchConfetti();
      }, 120);
    }, duration);
  };

  const tearReceipt = () => {
    if (state !== 'printed') return;
    setState('tearing');

    triggerBladeFlash();
    playTearAudio();

    const card = ticketCardRef.current;
    if (card) {
      card.classList.remove('printed');
      card.classList.add('tearing');
    }

    setTimeout(() => {
      if (card) {
        card.classList.remove('tearing');
        card.classList.add('retracted');
      }
      setState('idle');
    }, 560);
  };

  // Auto trigger rollout on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startPrintSequence();
    }, 450);
    return () => {
      clearTimeout(timer);
      if (confettiAnimRef.current) cancelAnimationFrame(confettiAnimRef.current);
    };
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isVideoMode) setIsVideoMode(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoMode, onClose]);

  return (
    <div className={`thermal-receipt-modal-backdrop ${isVideoMode ? 'video-mode' : ''}`}>
      
      {/* Confetti Celebration Canvas */}
      <canvas ref={confettiCanvasRef} className="receipt-confetti-canvas" />

      {/* Ambient Red/Glow Backdrop */}
      <div className="receipt-ambient-glow" />

      <div className="receipt-app-viewport">
        
        {/* ========================================================= */}
        {/* SIDE FLOATING STRAIGHT-LINE DOCK (UNBLOCKS CENTER)        */}
        {/* ========================================================= */}
        <aside className={`controls-dock dock-${dockSide}`}>
          <div className="dock-pill-bar">
            
            {/* Primary Print / Re-Print Button */}
            <button
              onClick={() => {
                initAudio();
                if (state === 'printed') {
                  tearReceipt();
                  setTimeout(() => startPrintSequence(), 620);
                } else if (state === 'idle') {
                  startPrintSequence();
                }
              }}
              disabled={state === 'printing'}
              className={`primary-print-btn ${state === 'printing' ? 'printing' : ''}`}
              title="Print / Re-Print Ticket"
            >
              <Printer size={16} className="btn-print-icon" />
              <span className="btn-label">{state === 'printing' ? '…' : 'Print'}</span>
            </button>

            {/* Secondary Tear Action Button */}
            {state === 'printed' && (
              <button
                onClick={() => {
                  initAudio();
                  tearReceipt();
                }}
                className="secondary-tear-btn"
                title="Tear off receipt"
              >
                <Scissors size={16} />
                <span className="btn-label">Tear</span>
              </button>
            )}

            <div className="dock-divider" />

            {/* Mode Selector (Smooth / Stepper) */}
            <div className="mode-column-group">
              <button
                onClick={() => {
                  initAudio();
                  setCurrentMode('smooth');
                  if (state === 'printed') {
                    tearReceipt();
                    setTimeout(() => startPrintSequence(), 620);
                  }
                }}
                className={`mode-icon-btn ${currentMode === 'smooth' ? 'active' : ''}`}
                title="Smooth Fluid Motion"
              >
                <span className="mode-dot" />
                <span className="mode-text">Smooth</span>
              </button>
              <button
                onClick={() => {
                  initAudio();
                  setCurrentMode('classic');
                  if (state === 'printed') {
                    tearReceipt();
                    setTimeout(() => startPrintSequence(), 620);
                  }
                }}
                className={`mode-icon-btn ${currentMode === 'classic' ? 'active' : ''}`}
                title="Mechanical Stepper Pulse"
              >
                <span className="mode-dot" />
                <span className="mode-text">Stepper</span>
              </button>
            </div>

            <div className="dock-divider" />

            {/* Sound Toggle */}
            <button
              onClick={() => {
                initAudio();
                setSoundEnabled(!soundEnabled);
              }}
              className="icon-tool-btn"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Clean Video Mode Toggle */}
            <button
              onClick={() => setIsVideoMode(!isVideoMode)}
              className="icon-tool-btn"
              title="Clean Video Mode (Press Esc to exit)"
            >
              <Video size={16} />
            </button>

            {/* Dock Side Flip (Right <-> Left) */}
            <button
              onClick={() => setDockSide(dockSide === 'right' ? 'left' : 'right')}
              className="icon-tool-btn"
              title="Switch Dock Side (Left / Right)"
            >
              <ArrowLeftRight size={16} />
            </button>

            {/* PDF Invoice Print */}
            <button
              onClick={() => window.print()}
              className="icon-tool-btn"
              title="Download / Print PDF Invoice"
            >
              <Download size={16} />
            </button>

            <div className="dock-divider" />

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="icon-tool-btn close-modal-tool-btn"
              title="Close Modal"
            >
              <X size={16} />
            </button>

          </div>
        </aside>

        {/* Video Mode Exit Floating Hint */}
        {isVideoMode && (
          <div
            onClick={() => setIsVideoMode(false)}
            className="video-mode-exit-hint cursor-pointer"
          >
            Clean Video Mode Active • Click or Press <strong>Esc</strong> to restore controls
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN PRINTER STAGE (100% UNBLOCKED & PERFECTLY CENTERED)  */}
        {/* ========================================================= */}
        <main className="printer-stage">
          
          {/* Metallic 3D Dispenser Machine */}
          <div className="machine-unit">
            
            {/* Top 3D Metallic Crimson Hood */}
            <div className="machine-hood-top">
              <div className="hood-bevel-top" />
              <div className="hood-highlight" />
              <div className="hood-title">{cmsData?.brand?.name || 'TITAN PULSE'} POS 3D</div>
              <div ref={hoodLedRef} className="hood-status-led" title="Dispenser Status" />
            </div>

            {/* Dark Slit Mouth */}
            <div className="machine-slot-slit">
              <div ref={slitGlowRef} className="slit-feed-glow" />
              <div className="slit-shadow-depth" />
            </div>

            {/* Cutter Blade Laser Flash Effect */}
            <div ref={cutterBladeFlashRef} className="cutter-blade-flash">
              <div className="blade-beam" />
            </div>

            {/* Bottom Metallic Lip Base */}
            <div className="machine-hood-bottom">
              <div className="hood-shadow" />
              <div className="hood-lip-highlight" />
            </div>

            {/* Paper Viewport Container */}
            <div className="paper-viewport">
              
              {/* 3D Ticket & Receipt Card */}
              <article
                ref={ticketCardRef}
                onClick={() => {
                  initAudio();
                  if (state === 'printed') tearReceipt();
                }}
                className="ticket-card retracted"
                title="Click to tear receipt"
              >
                <div className="ticket-content">
                  
                  {/* 1. Header: Vector Badge & Gym Branding */}
                  <header className="ticket-header">
                    <div className="status-badge-wrap">
                      <div className={`status-badge ${isMembership ? 'badge-membership' : 'badge-supplements'}`}>
                        {isMembership ? <Crown size={24} /> : <ShoppingBag size={24} />}
                      </div>
                    </div>
                    <h2 className="ticket-title">{cmsData?.brand?.name || 'TITAN PULSE 3D'}</h2>
                    <p className="ticket-sub">
                      {isMembership ? (cmsData?.brand?.subname ? `${cmsData.brand.subname} • Membership Pass` : 'Official Biometric Membership Tax Invoice') : 'Official Merch & Supplement Receipt'}
                    </p>
                  </header>

                  {/* 2. Perforation Divider with Side Notches */}
                  <div className="ticket-perforation">
                    <div className="notch notch-left" />
                    <div className="dash-line" />
                    <div className="notch notch-right" />
                  </div>

                  {/* 3. Ticket Data Details */}
                  <section className="ticket-details">
                    
                    <div className="detail-row">
                      <div className="detail-col">
                        <span className="detail-label">TRANSACTION ID</span>
                        <span className="detail-val mono text-[#ff1e27] font-bold">{orderId}</span>
                      </div>
                      <div className="detail-col align-right">
                        <span className="detail-label">TOTAL PAID</span>
                        <span className="detail-val amount-val font-mono text-emerald-600">
                          ₹{Number(totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <div className="detail-col">
                        <span className="detail-label">DATE & TIME</span>
                        <span className="detail-val">{orderDate}</span>
                      </div>
                      <div className="detail-col align-right">
                        <span className="detail-label">GATE STATUS</span>
                        <span className="detail-val badge-text">✓ Confirmed</span>
                      </div>
                    </div>

                    {/* Itemized Line Items */}
                    <div className="ticket-items-box">
                      {items.map((item, idx) => (
                        <div key={idx} className="ticket-item-row">
                          <span className="item-name" title={item.name}>
                            {item.quantity || 1}X {item.name}
                          </span>
                          <span className="item-price">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                      {discount > 0 && (
                        <div className="ticket-item-row text-emerald-600">
                          <span className="item-name">Promo Discount</span>
                          <span className="item-price">-₹{Number(discount).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="ticket-item-row text-slate-500 text-[10px] pt-1 border-t border-slate-200">
                        <span>GST (18% Included)</span>
                        <span>₹{Math.round(totalAmount * 0.18).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Payment Method Pill */}
                    <div className="payment-card-pill">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <CreditCard size={14} />
                      </div>
                      <div className="payment-meta">
                        <span className="cardholder-name">{customerName.toUpperCase()}</span>
                        <span className="card-dots">{paymentMethod}</span>
                      </div>
                    </div>

                  </section>

                  {/* 4. Barcode Section */}
                  <footer className="ticket-code-section">
                    <div className="barcode-container">
                      <div className="barcode-graphic" />
                      <div className="barcode-numbers mono">{orderId} • TURNSTILE PASS</div>
                    </div>
                  </footer>

                </div>
              </article>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}
