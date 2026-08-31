import React, { useState, useEffect, useRef } from 'react';
import './ThermalReceiptPrinter.css';
import {
  Printer,
  Scissors,
  Download,
  Package,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ThermalReceiptPrinter({
  orderDetails,
  onClose = () => {},
  onViewOrders = () => {}
}) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [isTorn, setIsTorn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stageHasPrinted, setStageHasPrinted] = useState(false);

  const audioCtxRef = useRef(null);
  const receiptPaperRef = useRef(null);
  const cutterBladeFlashRef = useRef(null);

  const items = orderDetails?.items || [];
  const subtotal = orderDetails?.subtotal || orderDetails?.amount || 0;
  const discount = orderDetails?.discount || 0;
  const totalAmount = orderDetails?.amount || subtotal;
  const orderId = orderDetails?.id || `ORD-TP-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = orderDetails?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const paymentMethod = orderDetails?.paymentMethod || 'Paid (Online / Card)';

  // Web Audio Synthesizer for Thermal Printer & Cutter Blade
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

  const playPrinterSound = (durationMs = 2200) => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = durationMs / 1000;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(3.5, now);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.04, now + 0.08);
      gainNode.gain.setValueAtTime(0.04, now + duration - 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {}
  };

  const playTearSound = () => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.35;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  };

  // Trigger Print Rollout Animation
  const triggerPrint = () => {
    if (isPrinting) return;

    const paper = receiptPaperRef.current;
    const flash = cutterBladeFlashRef.current;
    if (!paper) return;

    paper.classList.remove('tearing', 'retracted', 'printed', 'printing-smooth');
    if (flash) flash.classList.remove('active');

    void paper.offsetWidth; // force reflow

    setIsPrinting(true);
    setStageHasPrinted(true);

    const animDuration = 2200;
    playPrinterSound(animDuration);

    paper.classList.add('printing-smooth');

    setTimeout(() => {
      paper.classList.remove('printing-smooth');
      paper.classList.add('printed');
      setIsPrinting(false);
      setIsPrinted(true);
    }, animDuration);
  };

  // Trigger Hand Tear / Cut Action
  const triggerTear = () => {
    if (!isPrinted || isPrinting) return;

    const paper = receiptPaperRef.current;
    const flash = cutterBladeFlashRef.current;
    if (!paper) return;

    playTearSound();

    if (flash) flash.classList.add('active');
    paper.classList.add('tearing');
    setIsTorn(true);

    setTimeout(() => {
      paper.classList.remove('tearing', 'printed');
      paper.classList.add('retracted');
      if (flash) flash.classList.remove('active');
      setStageHasPrinted(false);
      setIsPrinted(false);
      setIsTorn(false);
    }, 550);
  };

  // Auto trigger print rollout when modal mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerPrint();
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="thermal-receipt-modal-backdrop">
      <div className="thermal-receipt-container">
        
        {/* Top Floating Control Bar */}
        <div className="w-full flex items-center justify-between px-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              RECEIPT DISPENSER
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-all cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close Modal"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D THERMAL PRINTER DISPENSER STAGE                       */}
        {/* ========================================================= */}
        <div className={`printer-stage ${stageHasPrinted ? 'has-printed' : ''}`}>
          
          {/* Metallic Crimson & Gold Dispenser Unit */}
          <div className="machine-unit">
            
            {/* Top 3D Metallic Hood */}
            <div className="machine-hood-top">
              <div className="hood-highlight"></div>
              <div className="hood-branding">TITAN PULSE POS 3D</div>
            </div>

            {/* Dark Slit Opening */}
            <div className="machine-slot-slit"></div>

            {/* Cutter Blade Flash */}
            <div ref={cutterBladeFlashRef} className="cutter-blade-flash"></div>

            {/* Bottom Metallic Lip */}
            <div className="machine-hood-bottom">
              <div className="hood-shadow"></div>
            </div>

            {/* Paper Viewport */}
            <div className="paper-viewport">
              <div ref={receiptPaperRef} className="receipt-paper-wrapper retracted">
                
                <div className="receipt-content">
                  
                  {/* Header & Gym Branding */}
                  <div className="receipt-header">
                    <div>
                      <div className="brand-company-name">TITAN PULSE GYM</div>
                      <div className="payment-title">ATHLETE MERCH & NUTRITION</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#0a0a0f] border border-black/10 flex items-center justify-center p-1 text-red-600 font-black text-xs font-mono">
                      TP3D
                    </div>
                  </div>

                  {/* Amount Section */}
                  <div className="receipt-amount-section">
                    <div className="receipt-amount">₹{Number(totalAmount).toLocaleString('en-IN')}</div>
                    <div className="receipt-meta">
                      {orderDate} | {paymentMethod.toUpperCase()}
                    </div>
                  </div>

                  <div className="receipt-divider"></div>

                  {/* Items List */}
                  <div className="receipt-items-list">
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <div key={idx} className="receipt-item-row">
                          <span className="item-name">{item.quantity || 1}X {item.name}</span>
                          <span className="item-price">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                        </div>
                      ))
                    ) : (
                      <div className="receipt-item-row">
                        <span className="item-name">1X Signature Supplement Pack</span>
                        <span className="item-price">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <div className="receipt-divider"></div>

                  {/* Subtotals & Grand Total */}
                  <div className="receipt-totals-section">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="total-row text-emerald-600 font-semibold">
                        <span>Promo Discount</span>
                        <span>-₹{Number(discount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Turnstile Pickup</span>
                      <span>FREE</span>
                    </div>
                    <div className="total-row">
                      <span>GST (18% Included)</span>
                      <span>₹{Math.round(totalAmount * 0.18).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="receipt-grand-total">
                      <span>TOTAL PAID</span>
                      <span>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Barcode & Turnstile Token */}
                  <div className="receipt-footer">
                    <div className="footer-msg">TRAIN HARD • STAY UNSTOPPABLE</div>
                    <div className="barcode-graphic">
                      <div className="barcode-lines"></div>
                      <div className="barcode-num">{orderId}</div>
                    </div>
                  </div>

                </div>

                {/* Serrated Teeth Bottom Edge */}
                <div className="serrated-edge"></div>

              </div>
            </div>

          </div>

          {/* Action Status & Centered Controls Below Machine */}
          <div className="receipt-stage-info">
            <h3 className="receipt-status-heading flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <span>Payment & Order Confirmed!</span>
            </h3>
            <p className="receipt-status-subtext">
              Your thermal order receipt has been printed. Ready for gym speed-gate pickup.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-sm">
              
              {/* Re-print Button */}
              <button
                onClick={triggerPrint}
                disabled={isPrinting}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Printer size={14} />
                <span>{isPrinting ? 'Printing...' : 'Re-print'}</span>
              </button>

              {/* Tear Receipt Button */}
              <button
                onClick={triggerTear}
                disabled={!isPrinted || isPrinting}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500 hover:text-black transition-all cursor-pointer disabled:opacity-40"
              >
                <Scissors size={14} />
                <span>Tear & Collect</span>
              </button>

              {/* Download / Print PDF */}
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>PDF Invoice</span>
              </button>

              {/* View in My Orders */}
              <button
                onClick={() => {
                  onClose();
                  onViewOrders();
                }}
                className="w-full py-2.5 mt-1 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Package size={15} />
                <span>View in My Orders Portal</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
