'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Sparkles, Check, ChevronRight, ChevronLeft, Zap, Crown, Percent } from 'lucide-react';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';

function rr(x, px, py, w, h, r) {
  x.beginPath();
  x.moveTo(px + r, py);
  x.arcTo(px + w, py, px + w, py + h, r);
  x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r);
  x.arcTo(px, py, px + w, py, r);
  x.closePath();
}

function drawSpaced(x, text, cx, y, ls) {
  const prev = x.textAlign;
  x.textAlign = 'left';
  const chars = [...text];
  let tot = 0;
  const ws = chars.map((ch) => {
    const w = x.measureText(ch).width;
    tot += w;
    return w;
  });
  tot += ls * (chars.length - 1);
  let px = cx - tot / 2;
  chars.forEach((ch, i) => {
    x.fillText(ch, px, y);
    px += ws[i] + ls;
  });
  x.textAlign = prev;
}

// Procedural Canvas Cover Painters for Pro, Elite, and PT Training (Indian Rupees ₹)
function paintProFront(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 2499;
  const yPrice = dyn?.annualPrice || 24999;
  const priceText = isYearly ? `₹${Number(yPrice).toLocaleString()} / YEAR` : `₹${Number(mPrice).toLocaleString()} / MONTH`;
  const badgeTop = dyn?.badge || 'TITAN ALL-ACCESS PASS';
  const badgeSub = isYearly ? 'SAVE ANNUALLY' : (dyn?.subBadge || 'BIOMETRIC UNLOCKED • 24/7 ACCESS');
  const titleText = dyn?.name ? dyn.name.replace(/MEMBERSHIP/gi, '').trim() || 'PRO' : 'PRO';

  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#161b22');
  g.addColorStop(0.5, '#0f1318');
  g.addColorStop(1, '#080a0d');
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  // Carbon Tech Grid
  x.strokeStyle = 'rgba(255, 46, 76, 0.07)';
  x.lineWidth = 1;
  for (let i = 0; i < w; i += 32) {
    x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke();
  }
  for (let j = 0; j < h; j += 32) {
    x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke();
  }

  // Crimson Outer Frame
  x.strokeStyle = '#FF2E4C';
  x.lineWidth = 14;
  x.strokeRect(36, 36, w - 72, h - 72);

  x.strokeStyle = 'rgba(255,255,255,0.2)';
  x.lineWidth = 2;
  x.strokeRect(52, 52, w - 104, h - 104);

  // Header Badge
  x.fillStyle = '#FF2E4C';
  rr(x, w / 2 - 190, 120, 380, 56, 28);
  x.fill();
  x.fillStyle = '#FFFFFF';
  x.font = '900 24px Inter, sans-serif';
  x.textAlign = 'center';
  x.fillText(badgeTop, w / 2, 156);

  // Title
  x.fillStyle = '#FFFFFF';
  x.font = '900 100px Inter, sans-serif';
  x.fillText(titleText, w / 2, h * 0.42);

  x.fillStyle = '#FF2E4C';
  x.font = '800 36px Inter, sans-serif';
  x.fillText('MEMBERSHIP', w / 2, h * 0.42 + 64);

  // Stars
  x.fillStyle = '#FFD700';
  x.font = '40px sans-serif';
  x.fillText('★ ★ ★ ★ ★', w / 2, h * 0.42 + 130);

  // Price Stamp
  x.fillStyle = 'rgba(255, 46, 76, 0.15)';
  rr(x, w / 2 - 210, h - 340, 420, 110, 20);
  x.fill();
  x.strokeStyle = 'rgba(255, 46, 76, 0.5)';
  x.lineWidth = 3;
  x.stroke();

  x.fillStyle = '#FFFFFF';
  x.font = '900 48px Inter, sans-serif';
  x.fillText(priceText, w / 2, h - 268);

  x.fillStyle = '#8A94A0';
  x.font = '600 22px Inter, sans-serif';
  x.fillText(badgeSub, w / 2, h - 140);
}

function paintProBack(x, w, h, isYearly, cfg) {
  x.fillStyle = '#0f1318';
  x.fillRect(0, 0, w, h);

  x.strokeStyle = 'rgba(255, 46, 76, 0.3)';
  x.lineWidth = 6;
  x.strokeRect(40, 40, w - 80, h - 80);

  x.fillStyle = '#FFFFFF';
  x.font = '800 36px Inter, sans-serif';
  x.textAlign = 'center';
  x.fillText('TITAN PULSE 3D PROTOCOL', w / 2, 140);

  x.fillStyle = 'rgba(255, 255, 255, 0.15)';
  rr(x, 80, 200, w - 160, 360, 16);
  x.fill();

  x.fillStyle = '#FF2E4C';
  x.font = '700 24px Inter, sans-serif';
  x.fillText('TERMS & BIOMETRIC RULES', w / 2, 250);

  const perks = cfg?.chapters || [
    'All-Access Gym Floor & Cardio Zone',
    'Biometric Smart Locker Activation',
    'Automated 3D Telemetry Body Scan',
    'Hydro-Sauna Recovery Lounge'
  ];

  x.fillStyle = '#A0AEC0';
  x.font = '500 20px Inter, sans-serif';
  perks.slice(0, 4).forEach((p, idx) => {
    x.fillText(`${idx + 1}. ${p}`, w / 2, 310 + idx * 40);
  });

  // Barcode Box
  x.fillStyle = '#FFFFFF';
  rr(x, w / 2 - 220, h - 300, 440, 160, 12);
  x.fill();

  x.fillStyle = '#000000';
  let bx = w / 2 - 190;
  while (bx < w / 2 + 190) {
    const bw = 2 + Math.random() * 8;
    if (Math.random() > 0.35) x.fillRect(bx, h - 280, bw, 90);
    bx += bw + 2 + Math.random() * 5;
  }
  x.font = '700 20px monospace';
  x.fillText('PRO-2026-TITAN-8890', w / 2, h - 165);
}

function paintProSpine(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 2499;
  const yPrice = dyn?.annualPrice || 24999;
  const priceSpine = isYearly ? `₹${Number(yPrice).toLocaleString()}/YR` : `₹${Number(mPrice).toLocaleString()}/MO`;
  x.fillStyle = '#161b22';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#FF2E4C';
  x.fillRect(0, 0, 12, h);
  x.fillRect(w - 12, 0, 12, h);

  x.save();
  x.translate(w / 2, h / 2);
  x.rotate(Math.PI / 2);
  x.fillStyle = '#FFFFFF';
  x.font = '900 42px Inter, sans-serif';
  drawSpaced(x, 'TITAN PRO PASS', -h * 0.08, 14, 4);
  x.fillStyle = '#FF2E4C';
  x.font = '700 26px Inter, sans-serif';
  drawSpaced(x, priceSpine, h * 0.34, 10, 3);
  x.restore();
}

function paintEliteFront(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 4999;
  const yPrice = dyn?.annualPrice || 49999;
  const priceText = isYearly ? `₹${Number(yPrice).toLocaleString()} / YEAR` : `₹${Number(mPrice).toLocaleString()} / MONTH`;
  const badgeSub = isYearly ? 'SAVE ANNUALLY' : (dyn?.subBadge || 'CRYOTHERAPY • HYDRO SUITE • GUEST PERKS');
  const titleText = dyn?.name ? dyn.name.replace(/VIP ATHLETE STATUS/gi, '').trim() || 'ELITE' : 'ELITE';
  const subTitle = dyn?.badge || 'VIP ATHLETE STATUS';

  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#1a1608');
  g.addColorStop(0.5, '#0a0d18');
  g.addColorStop(1, '#05060a');
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  // Gold Double Foil Border
  x.strokeStyle = '#D4AF37';
  x.lineWidth = 12;
  x.strokeRect(36, 36, w - 72, h - 72);

  x.strokeStyle = '#FFD700';
  x.lineWidth = 3;
  x.strokeRect(54, 54, w - 108, h - 108);

  // Crest Emblem
  x.fillStyle = '#D4AF37';
  x.beginPath();
  x.arc(w / 2, 180, 50, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = '#0A0D18';
  x.font = '900 36px serif';
  x.textAlign = 'center';
  x.fillText('👑', w / 2, 192);

  // Title
  x.fillStyle = '#FFD700';
  x.font = '900 96px Inter, sans-serif';
  x.fillText(titleText, w / 2, h * 0.41);

  x.fillStyle = '#FFFFFF';
  x.font = '800 34px Inter, sans-serif';
  x.fillText(subTitle, w / 2, h * 0.41 + 60);

  x.fillStyle = '#D4AF37';
  x.font = '36px sans-serif';
  x.fillText('★ ★ ★ ★ ★', w / 2, h * 0.41 + 120);

  // Price Badge
  x.fillStyle = 'rgba(212, 175, 55, 0.18)';
  rr(x, w / 2 - 210, h - 340, 420, 110, 20);
  x.fill();
  x.strokeStyle = '#D4AF37';
  x.lineWidth = 3;
  x.stroke();

  x.fillStyle = '#FFD700';
  x.font = '900 48px Inter, sans-serif';
  x.fillText(priceText, w / 2, h - 268);

  x.fillStyle = '#E2E8F0';
  x.font = '600 22px Inter, sans-serif';
  x.fillText(badgeSub, w / 2, h - 140);
}

function paintEliteBack(x, w, h, isYearly, cfg) {
  x.fillStyle = '#0a0d18';
  x.fillRect(0, 0, w, h);

  x.strokeStyle = '#D4AF37';
  x.lineWidth = 6;
  x.strokeRect(40, 40, w - 80, h - 80);

  x.fillStyle = '#FFD700';
  x.font = '800 36px Inter, sans-serif';
  x.textAlign = 'center';
  x.fillText('TITAN ELITE PRIVILEGES', w / 2, 140);

  x.fillStyle = 'rgba(212, 175, 55, 0.12)';
  rr(x, 80, 200, w - 160, 360, 16);
  x.fill();

  x.fillStyle = '#FFFFFF';
  x.font = '700 24px Inter, sans-serif';
  x.fillText('VIP ALL-ACCESS AMENITIES', w / 2, 250);

  const perks = cfg?.chapters || [
    'Unlimited Cryotherapy Chambers Access',
    'Private Hydro-Massage Therapy Suite',
    'Dedicated VIP Keycard Locker Lounge',
    'Free Daily Micro-Nutrient Shake Bar'
  ];

  x.fillStyle = '#D4AF37';
  x.font = '500 20px Inter, sans-serif';
  perks.slice(0, 4).forEach((p, idx) => {
    x.fillText(`${idx + 1}. ${p}`, w / 2, 310 + idx * 40);
  });

  // Gold Barcode Box
  x.fillStyle = '#FFFDF5';
  rr(x, w / 2 - 220, h - 300, 440, 160, 12);
  x.fill();

  x.fillStyle = '#000000';
  let bx = w / 2 - 190;
  while (bx < w / 2 + 190) {
    const bw = 2 + Math.random() * 8;
    if (Math.random() > 0.35) x.fillRect(bx, h - 280, bw, 90);
    bx += bw + 2 + Math.random() * 5;
  }
  x.font = '700 20px monospace';
  x.fillText('ELITE-2026-VIP-0001', w / 2, h - 165);
}

function paintEliteSpine(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 4999;
  const yPrice = dyn?.annualPrice || 49999;
  const priceSpine = isYearly ? `₹${Number(yPrice).toLocaleString()}/YR` : `₹${Number(mPrice).toLocaleString()}/MO`;
  x.fillStyle = '#0a0d18';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#D4AF37';
  x.fillRect(0, 0, 12, h);
  x.fillRect(w - 12, 0, 12, h);

  x.save();
  x.translate(w / 2, h / 2);
  x.rotate(Math.PI / 2);
  x.fillStyle = '#FFD700';
  x.font = '900 42px Inter, sans-serif';
  drawSpaced(x, 'TITAN ELITE VIP', -h * 0.08, 14, 4);
  x.fillStyle = '#FFFFFF';
  x.font = '700 26px Inter, sans-serif';
  drawSpaced(x, priceSpine, h * 0.34, 10, 3);
  x.restore();
}

function paintPTFront(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 9999;
  const yPrice = dyn?.annualPrice || 99999;
  const priceText = isYearly ? `₹${Number(yPrice).toLocaleString()} / YEAR` : `₹${Number(mPrice).toLocaleString()} / MONTH`;
  const badgeTop = dyn?.badge || '1-ON-1 MASTER COACHING';
  const badgeSub = isYearly ? 'SAVE ANNUALLY' : (dyn?.subBadge || 'DEDICATED COACH • 3D BIO-SCANS • MEAL MATRIX');
  const titleText = dyn?.name ? dyn.name.replace(/COACHING MANUAL/gi, '').trim() || 'PT VIP' : 'PT VIP';

  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#041624');
  g.addColorStop(0.5, '#090e17');
  g.addColorStop(1, '#0e061a');
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  // Cyber Neon Cyan Frame
  x.strokeStyle = '#00F0FF';
  x.lineWidth = 12;
  x.strokeRect(36, 36, w - 72, h - 72);

  x.strokeStyle = '#7000FF';
  x.lineWidth = 4;
  x.strokeRect(52, 52, w - 104, h - 104);

  // Tech Badge
  x.fillStyle = 'rgba(0, 240, 255, 0.2)';
  rr(x, w / 2 - 180, 120, 360, 56, 28);
  x.fill();
  x.strokeStyle = '#00F0FF';
  x.lineWidth = 2;
  x.stroke();

  x.fillStyle = '#00F0FF';
  x.font = '900 22px Inter, sans-serif';
  x.textAlign = 'center';
  x.fillText(badgeTop, w / 2, 156);

  // Title
  x.fillStyle = '#FFFFFF';
  x.font = '900 88px Inter, sans-serif';
  x.fillText(titleText, w / 2, h * 0.39);

  x.fillStyle = '#00F0FF';
  x.font = '800 36px Inter, sans-serif';
  x.fillText('COACHING MANUAL', w / 2, h * 0.39 + 60);

  x.fillStyle = '#7000FF';
  x.font = '36px sans-serif';
  x.fillText('⚡ ⚡ ⚡ ⚡ ⚡', w / 2, h * 0.39 + 120);

  // Price Stamp
  x.fillStyle = 'rgba(112, 0, 255, 0.2)';
  rr(x, w / 2 - 210, h - 340, 420, 110, 20);
  x.fill();
  x.strokeStyle = '#00F0FF';
  x.lineWidth = 3;
  x.stroke();

  x.fillStyle = '#FFFFFF';
  x.font = '900 48px Inter, sans-serif';
  x.fillText(priceText, w / 2, h - 268);

  x.fillStyle = '#A0AEC0';
  x.font = '600 22px Inter, sans-serif';
  x.fillText(badgeSub, w / 2, h - 140);
}

function paintPTBack(x, w, h, isYearly, cfg) {
  x.fillStyle = '#090e17';
  x.fillRect(0, 0, w, h);

  x.strokeStyle = '#00F0FF';
  x.lineWidth = 6;
  x.strokeRect(40, 40, w - 80, h - 80);

  x.fillStyle = '#00F0FF';
  x.font = '800 36px Inter, sans-serif';
  x.textAlign = 'center';
  x.fillText('TITAN PT MASTER PROGRAM', w / 2, 140);

  x.fillStyle = 'rgba(0, 240, 255, 0.12)';
  rr(x, 80, 200, w - 160, 360, 16);
  x.fill();

  x.fillStyle = '#FFFFFF';
  x.font = '700 24px Inter, sans-serif';
  x.fillText('GUARANTEED TRANSFORMATION BLUEPRINT', w / 2, 250);

  const perks = cfg?.chapters || [
    'Dedicated 1-on-1 Master Fitness Coach',
    'Weekly 3D Muscle & Body Fat Scans',
    'Custom Macro & Nutrition Meal Matrix',
    'Live Heart-Rate & Metabolic Telemetry'
  ];

  x.fillStyle = '#00F0FF';
  x.font = '500 20px Inter, sans-serif';
  perks.slice(0, 4).forEach((p, idx) => {
    x.fillText(`${idx + 1}. ${p}`, w / 2, 310 + idx * 40);
  });

  // Tech Barcode Box
  x.fillStyle = '#E6FFFA';
  rr(x, w / 2 - 220, h - 300, 440, 160, 12);
  x.fill();

  x.fillStyle = '#000000';
  let bx = w / 2 - 190;
  while (bx < w / 2 + 190) {
    const bw = 2 + Math.random() * 8;
    if (Math.random() > 0.35) x.fillRect(bx, h - 280, bw, 90);
    bx += bw + 2 + Math.random() * 5;
  }
  x.font = '700 20px monospace';
  x.fillText('PT-2026-COACH-7700', w / 2, h - 165);
}

function paintPTSpine(x, w, h, isYearly, cfg) {
  const dyn = cfg?.dynamicData;
  const mPrice = dyn?.price || 9999;
  const yPrice = dyn?.annualPrice || 99999;
  const priceSpine = isYearly ? `₹${Number(yPrice).toLocaleString()}/YR` : `₹${Number(mPrice).toLocaleString()}/MO`;
  x.fillStyle = '#090e17';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#00F0FF';
  x.fillRect(0, 0, 12, h);
  x.fillRect(w - 12, 0, 12, h);

  x.save();
  x.translate(w / 2, h / 2);
  x.rotate(Math.PI / 2);
  x.fillStyle = '#00F0FF';
  x.font = '900 42px Inter, sans-serif';
  drawSpaced(x, 'TITAN PT COACHING', -h * 0.08, 14, 4);
  x.fillStyle = '#FFFFFF';
  x.font = '700 26px Inter, sans-serif';
  drawSpaced(x, priceSpine, h * 0.34, 10, 3);
  x.restore();
}

const DEFAULT_SERVICE_TIERS = [
  {
    id: 'pro-membership',
    title: 'TITAN PRO',
    author: 'ALL-ACCESS PASS',
    monthlyPrice: '₹2,499 / mo',
    yearlyPrice: '₹24,999 / yr',
    monthlySavings: null,
    yearlySavings: 'Save ₹5,000',
    stars: 5,
    badge: 'MOST POPULAR',
    ctaText: 'Claim Pro Pass',
    desc: 'Unlimited access to all strength zones, cardio amphitheater, bio-hacking sauna lounge, & automated 3D body composition telemetry tracking.',
    edge: '#FF2E4C',
    backBg: '#0f1318',
    backInk: '255, 46, 76',
    spineBg: '#161b22',
    spineInk: '#FFFFFF',
    spineFont: '800 38px Inter, Arial, sans-serif',
    chapters: [
      'All-Access Gym Floor & Cardio Zone',
      'Biometric Smart Locker Activation',
      '3D Body Composition Bio-Scan',
      'Sauna & Recovery Lounge',
      'Titan Companion App Access',
      'Complimentary Towel Service'
    ],
    front: paintProFront,
    back: paintProBack,
    spine: paintProSpine,
  },
  {
    id: 'elite-membership',
    title: 'TITAN ELITE',
    author: 'VIP ATHLETE PASS',
    monthlyPrice: '₹4,999 / mo',
    yearlyPrice: '₹49,999 / yr',
    monthlySavings: null,
    yearlySavings: 'Save ₹10,000',
    stars: 5,
    badge: 'VIP ACCESS',
    ctaText: 'Claim Elite VIP',
    desc: 'VIP priority lounge, cryotherapy chambers, hydro-massage therapy, custom micro-nutrient bar access, and unlimited guest privileges.',
    edge: '#D4AF37',
    backBg: '#0a0d18',
    backInk: '212, 175, 55',
    spineBg: '#181d2e',
    spineInk: '#FFD700',
    spineFont: '800 38px Inter, Arial, sans-serif',
    chapters: [
      'Everything in Pro Membership',
      'Unlimited Cryotherapy Access',
      'Hydro-Massage Therapy Suite',
      'Private VIP Locker Lounge',
      'Daily Micro-Nutrient Shake Bar',
      'Unlimited Guest Privileges'
    ],
    front: paintEliteFront,
    back: paintEliteBack,
    spine: paintEliteSpine,
  },
  {
    id: 'pt-training',
    title: 'PT VIP COACHING',
    author: '1-ON-1 MASTER PT',
    monthlyPrice: '₹9,999 / mo',
    yearlyPrice: '₹99,999 / yr',
    monthlySavings: null,
    yearlySavings: 'Save ₹20,000',
    stars: 5,
    badge: 'MAX RESULTS',
    ctaText: 'Book PT Coach',
    desc: 'Dedicated Master Personal Trainer, tailored meal plans, weekly 3D muscle bio-scans, dynamic heart-rate telemetry, and guaranteed target results.',
    edge: '#00F0FF',
    backBg: '#090e17',
    backInk: '0, 240, 255',
    spineBg: '#131c2e',
    spineInk: '#00F0FF',
    spineFont: '800 36px Inter, Arial, sans-serif',
    chapters: [
      'Dedicated Master Fitness Coach',
      'Custom Macro & Meal Matrix',
      'Weekly 3D Muscle Bio-Scans',
      'Live Heart-Rate Telemetry',
      'Private 1-on-1 Training Bay',
      '100% Guaranteed Target Results'
    ],
    front: paintPTFront,
    back: paintPTBack,
    spine: paintPTSpine,
  },
];

const OPEN_BTN_OFF = ['opacity-0', 'scale-[0.94]'];
const OPEN_BTN_ON = ['opacity-100', 'scale-100'];

export function ServicesSection({
  id = 'services-section',
  services: propServices,
  heroTitle = 'SERVICES',
  navTitle = 'MEMBERSHIPS & COACHING',
  showNav = true,
  showDetailPanel = true,
  showCarousel = true,
  className,
  onClaimPass,
  onBookPT,
}) {
  const { cmsData } = useLandingPageCMS();

  // Merge live cmsData.memberships with DEFAULT_SERVICE_TIERS configs
  const services = useMemo(() => {
    const cmsMemberships = cmsData?.memberships || [];
    if (cmsMemberships.length === 0) return propServices || DEFAULT_SERVICE_TIERS;

    return (propServices || DEFAULT_SERVICE_TIERS).map((tier, idx) => {
      const live = cmsMemberships[idx] || cmsMemberships.find(m => m.tierKey === tier.id.replace('-membership', '').replace('-training', ''));
      if (!live) return tier;

      const activeChapters = (live.services && live.services.length > 0)
        ? live.services.filter(s => s.included).map(s => s.name)
        : tier.chapters;

      return {
        ...tier,
        dynamicData: live,
        title: live.name || tier.title,
        badge: live.badge || tier.badge,
        subBadge: live.subBadge || tier.subBadge,
        desc: live.description || tier.desc,
        monthlyPrice: `₹${Number(live.price || 0).toLocaleString()} / mo`,
        yearlyPrice: `₹${Number(live.annualPrice || (live.price ? live.price * 10 : 0)).toLocaleString()} / yr`,
        chapters: activeChapters
      };
    });
  }, [cmsData?.memberships, propServices]);

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const openBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const dpRef = useRef(null);
  const shiftCarouselRef = useRef(() => {});

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const isYearly = billingCycle === 'yearly';

  const onClaimPassRef = useRef(onClaimPass);
  useEffect(() => {
    onClaimPassRef.current = onClaimPass;
  }, [onClaimPass]);

  const onBookPTRef = useRef(onBookPT);
  useEffect(() => {
    onBookPTRef.current = onBookPT;
  }, [onBookPT]);

  const [uiMode, setUiMode] = useState('hero');
  const [selectedCfg, setSelectedCfg] = useState(null);
  const [mounted, setMounted] = useState(false);

  const bookInstancesRef = useRef([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!root || !canvasEl || services.length === 0) return;

    let cancelled = false;
    const timeouts = [];
    const setT = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
      return id;
    };

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    class Spring {
      constructor(v, k, d) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        this.k = k || 120;
        this.d = d || 14;
      }
      set(v) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        return this;
      }
      update(dt) {
        const a = this.k * (this.t - this.v) - this.d * this.vel;
        this.vel += a * dt;
        this.v += this.vel * dt;
        return this.v;
      }
    }

    function mkCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
    } catch (err) {
      console.warn('ServicesSection: WebGL renderer creation failed', err);
      const fail = document.createElement('div');
      fail.className =
        'absolute inset-0 z-50 flex items-center justify-center p-10 text-center text-lg leading-relaxed text-[#FF2E4C]';
      fail.textContent = 'This 3D service showcase needs WebGL, which your browser blocked or does not support.';
      root.appendChild(fail);
      return () => {
        fail.remove();
      };
    }

    const dims = { w: 0, h: 0 };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const ANISO = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.1, 9.6);

    function envBlob(x, cx, cy, r, rgb, a) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, 6.2832);
      x.fill();
    }

    (function buildEnv() {
      const c = mkCanvas(512, 256),
        x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#1c080d');
      g.addColorStop(0.55, '#0b0e14');
      g.addColorStop(1, '#050608');
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 256);
      envBlob(x, 140, 66, 95, '255,46,76', 0.85);
      envBlob(x, 405, 84, 55, '212,175,55', 0.55);
      envBlob(x, 256, 150, 120, '0,240,255', 0.35);
      const tx = new THREE.CanvasTexture(c);
      tx.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(tx).texture;
      tx.dispose();
      pmrem.dispose();
    })();

    const hemi = new THREE.HemisphereLight(0xff2e4c, 0x07090e, 0.45);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3.5, 5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.35);
    fillLight.position.set(-4, 1, 4);
    scene.add(fillLight);

    const rim = new THREE.DirectionalLight(0xff2e4c, 0.45);
    rim.position.set(-2, 3, -5);
    scene.add(rim);

    const bookRoot = new THREE.Group();
    scene.add(bookRoot);

    function tex(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = ANISO;
      return t;
    }

    function loadOrPaint(material, imageURL, paintFallback) {
      material.map = tex(paintFallback());
      material.needsUpdate = true;
      if (!imageURL) return;
      new THREE.TextureLoader().setCrossOrigin('anonymous').load(
        imageURL,
        (t) => {
          if (cancelled) return;
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = ANISO;
          material.map = t;
          material.needsUpdate = true;
        },
        undefined,
        () => console.warn('Cover image failed to load, kept fallback canvas cover:', imageURL),
      );
    }

    function noiseTexture(base, amp, scratches) {
      const s = 256,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      const img = x.createImageData(s, s),
        d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = base + (Math.random() - 0.5) * 2 * amp;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      if (scratches) {
        x.strokeStyle = 'rgba(255,255,255,.18)';
        x.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          const y = Math.random() * s;
          x.moveTo(0, y);
          x.lineTo(s, y + (Math.random() - 0.5) * 22);
          x.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    }
    const laminateBump = noiseTexture(128, 10, true);
    const clothBump = (function () {
      const s = 128,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#202530';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < s; i += 2) {
        x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.35)';
        x.fillRect(i, 0, 1, s);
        x.fillRect(0, i, s, 1);
      }
      return new THREE.CanvasTexture(c);
    })();

    function striationTexture(vertical) {
      const s = 512,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#1c202a';
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4,
          tone = Math.random();
        x.fillStyle =
          tone < 0.12 ? 'rgba(255,46,76,.25)' : tone < 0.5 ? 'rgba(0,240,255,.15)' : 'rgba(255,255,255,.08)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2600; i++) {
        x.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.05).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      return tex(c);
    }
    const striV = striationTexture(true);
    const striH = striationTexture(false);

    const endpaperTex = (function () {
      const s = 512,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#12161f';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < 1400; i++) {
        x.fillStyle = 'rgba(255,46,76,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
      }
      const g = x.createLinearGradient(0, 0, s, 0);
      g.addColorStop(0, 'rgba(0,0,0,.4)');
      g.addColorStop(0.12, 'rgba(0,0,0,0)');
      g.addColorStop(0.88, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,.4)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return tex(c);
    })();

    const blobTex = (function () {
      const s = 256,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(255,46,76,.35)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    function trimToWidth(x, text, maxW) {
      if (x.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
      return t + '...';
    }

    function makeIndexPageTex(chapters) {
      const w = 1024,
        h = 1536,
        c = mkCanvas(w, h),
        x = c.getContext('2d');
      x.fillStyle = '#0f141d';
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(255,46,76,0.05)';
      for (let i = 0; i < 1600; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.1, 1.1);

      x.fillStyle = '#FFFFFF';
      x.textAlign = 'center';
      x.font = '900 76px Inter, sans-serif';
      x.fillText('INCLUDED PERKS', w / 2, 190);
      x.fillStyle = '#FF2E4C';
      x.fillRect(220, 225, w - 440, 4);

      const list = chapters && chapters.length
        ? chapters
        : ['All-Access Gym Floor', 'Biometric Smart Lockers', '3D Body Composition Bio-Scan', 'Sauna & Recovery Lounge', 'Titan Pulse App', 'Personal Fitness Plan'];
      x.textAlign = 'left';
      x.font = '700 42px Inter, sans-serif';
      let y = 320;
      for (let i = 0; i < list.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const statusText = 'INCLUDED';
        const left = n + '. ' + trimToWidth(x, list[i], 620);
        x.fillStyle = '#FFFFFF';
        x.fillText(left, 120, y);
        x.textAlign = 'right';
        x.fillStyle = '#FF2E4C';
        x.fillText(statusText, w - 120, y);
        x.textAlign = 'left';
        x.fillStyle = 'rgba(255,255,255,0.1)';
        x.fillRect(120, y + 20, w - 240, 2);
        y += 114;
      }
      return tex(c);
    }

    const N = services.length;
    const VISIBLE = Math.min(3, N);

    const W = 1.42,
      H = 2.14,
      T = 0.34,
      CT = 0.032,
      OV = 0.05;
    const PAGE_N = 12,
      PW = W - 0.02,
      PH = H - 0.02;
    const BLOCK_D = 0.245,
      BLOCK_Z = -0.0205,
      PIVOT_Z = T / 2 + CT / 2,
      BPIVOT_Z = -(T / 2 + CT / 2),
      HINGE_OVERLAP = 0.05;

    const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    const pageGeo = new THREE.PlaneGeometry(PW, PH);
    const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.2 }, o));
    }

    const paperFlat = std({ color: 0x181e29, roughness: 0.9, envMapIntensity: 0.3 });
    const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.003, roughness: 0.85, envMapIntensity: 0.3 });
    const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.003, roughness: 0.85, envMapIntensity: 0.3 });
    const endpaperMat = std({ map: endpaperTex, roughness: 0.8, envMapIntensity: 0.35 });
    const pageMats = [0x151b26, 0x1a2130, 0x121722].map((c) =>
      std({ color: c, roughness: 0.88, envMapIntensity: 0.3, side: THREE.DoubleSide }),
    );

    const bookInstances = [];
    bookInstancesRef.current = bookInstances;
    const hitMeshes = [];

    function buildBook(cfg, index) {
      const root = new THREE.Group();
      const float = new THREE.Group();
      root.add(float);
      bookRoot.add(root);

      const indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.88, envMapIntensity: 0.3, side: THREE.DoubleSide });

      const edgeColor = cfg.edge ?? '#FF2E4C';
      const mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.5, envMapIntensity: 0.4 });
      const mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.4, envMapIntensity: 0.45 });
      const mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.45, envMapIntensity: 0.4 });
      const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.6, envMapIntensity: 0.4 });

      const updateTextures = (yearlyFlag) => {
        loadOrPaint(mFront, cfg.images?.front ?? null, () => {
          const c = mkCanvas(1024, 1536);
          const ctx = c.getContext('2d');
          if (cfg.front) cfg.front(ctx, 1024, 1536, yearlyFlag, cfg);
          return c;
        });
        loadOrPaint(mBack, cfg.images?.back ?? null, () => {
          const c = mkCanvas(1024, 1536);
          const ctx = c.getContext('2d');
          if (cfg.back) cfg.back(ctx, 1024, 1536, yearlyFlag, cfg);
          return c;
        });
        loadOrPaint(mSpine, cfg.images?.spine ?? null, () => {
          const c = mkCanvas(220, 1536);
          const ctx = c.getContext('2d');
          if (cfg.spine) cfg.spine(ctx, 220, 1536, yearlyFlag, cfg);
          return c;
        });
      };

      updateTextures(isYearly);

      const backPivot = new THREE.Group();
      backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
      const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
      backMesh.position.x = (W + OV) / 2;
      backMesh.castShadow = backMesh.receiveShadow = true;
      backPivot.add(backMesh);
      float.add(backPivot);

      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
      const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
      frontMesh.position.x = (W + OV) / 2;
      frontMesh.castShadow = frontMesh.receiveShadow = true;
      pivot.add(frontMesh);
      float.add(pivot);

      const spine = new THREE.Mesh(spineGeo, mSpine);
      spine.position.set(-W / 2 - 0.013, 0, 0);
      spine.castShadow = true;
      float.add(spine);

      const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
      block.position.set(-0.0075, 0, BLOCK_Z);
      block.castShadow = block.receiveShadow = true;
      float.add(block);

      const pages = [], pageF = [];
      for (let i = 0; i < PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pages.push(pp);
        pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
      }

      const pagesB = [], pageFB = [];
      for (let i = 0; i < 6; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pagesB.push(pp);
        pageFB.push(0.3 * Math.pow(1 - i / 6, 2.6));
      }

      const blob = new THREE.Mesh(
        blobGeo,
        new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.55, depthWrite: false }),
      );
      blob.scale.set(3.4, 4.2, 1);
      blob.position.set(0.1, -0.3, -0.85);
      blob.renderOrder = -5;
      root.add(blob);

      const hit = new THREE.Mesh(hitGeo, hitMat);
      float.add(hit);

      const springs = {
        px: new Spring(0, 17, 6.8),
        py: new Spring(0, 17, 6.8),
        pz: new Spring(0, 17, 6.8),
        rx: new Spring(0, 17, 6.8),
        ry: new Spring(0, 17, 6.8),
        rz: new Spring(0, 17, 6.8),
        sc: new Spring(1, 17, 6.8),
        tiltX: new Spring(0, 120, 13),
        tiltY: new Spring(0, 120, 13),
        lift: new Spring(0, 120, 13),
        cover: new Spring(0, 90, 12),
        coverB: new Spring(0, 90, 12),
        drag: new Spring(0, 160, 16),
      };

      const b = {
        cfg,
        index,
        root,
        float,
        pivot,
        backPivot,
        frontMesh,
        spine,
        block,
        pages,
        pageF,
        pagesB,
        pageFB,
        hit,
        springs,
        phase: Math.random() * 6.28,
        slotScale: 1,
        hitEdge: null,
        scr: { x: 0, y: 0 },
        orbY: 0,
        orbYv: 0,
        orbPhase: 'idle',
        orbTarget: 0,
        orbXs: new Spring(0, 60, 12),
        exit: null,
        updateTextures,
      };
      bookInstances.push(b);
      return b;
    }
    services.forEach(buildBook);
    const bookByHit = (m) => bookInstances.find((b) => b.hit === m);

    // Floating Sparks & Embers in Detail View
    const leaves = {
      items: [],
      anchor: null,
      activate(book) {
        this.anchor = book;
        this.items.forEach((l) => {
          l.kick.set(-l.hx + (Math.random() - 0.5) * 0.6, -l.hy + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.5);
          l.s.t = l.size;
          l.mesh.visible = true;
        });
      },
      deactivate() {
        this.items.forEach((l) => {
          l.s.t = 0;
        });
      },
      push(dx, dy) {
        if (!this.anchor) return;
        this.items.forEach((l) => {
          l.kick.x += dx * 2.4 * Math.random();
          l.kick.y += -dy * 2.4 * Math.random();
        });
      },
      update(dt, t) {
        if (!this.anchor) return;
        const ap = this.anchor.root.position;
        const w = RM ? 0.15 : 1;
        this.items.forEach((l) => {
          l.kick.multiplyScalar(Math.exp(-1.15 * dt));
          l.mesh.position.set(
            ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.4 * w + l.kick.x,
            ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.3 * w + l.kick.y,
            ap.z * 0.4 + l.hz + l.kick.z,
          );
          l.mesh.rotation.x += l.rv.x * dt * (0.3 + w);
          l.mesh.rotation.y += l.rv.y * dt * (0.3 + w);
          l.mesh.rotation.z += l.rv.z * dt * (0.3 + w);
          const s = l.s.update(dt);
          l.mesh.scale.setScalar(Math.max(s, 0.0001));
          if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
        });
      },
    };

    (function buildLeaves() {
      const shape = new THREE.Shape();
      shape.moveTo(0, -0.4);
      shape.lineTo(0.25, 0);
      shape.lineTo(0, 0.5);
      shape.lineTo(-0.25, 0);
      shape.closePath();
      const geo = new THREE.ShapeGeometry(shape, 6);
      const cols = [0xff2e4c, 0xd4af37, 0x00f0ff, 0xff526b];
      for (let i = 0; i < 16; i++) {
        const mat = std({ color: cols[i % 4], roughness: 0.3, envMapIntensity: 0.8, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        bookRoot.add(mesh);
        let hx = (Math.random() - 0.5) * 4.6;
        if (i % 5 === 0) hx += 2.8 * Math.sign(hx || 1);
        leaves.items.push({
          mesh,
          hx,
          hy: (Math.random() - 0.5) * 3.2,
          hz: -0.5 + Math.random() * 1.5,
          sp: 0.25 + Math.random() * 0.5,
          ph: Math.random() * 6.28,
          rv: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
          kick: new THREE.Vector3(),
          size: 0.12 + Math.random() * 0.14,
          s: new Spring(0, 60, 10),
        });
      }
    })();

    const state = { mode: 'hero', selected: null, hovered: null, pillLock: null, kbIndex: -1 };

    const SLOTS = { hero: [], detail: null, portrait: false };

    function computeSlots() {
      const a = dims.w / Math.max(1, dims.h);
      const portrait = a < 0.85;
      const fit = portrait ? clamp(a / 1.08, 0.38, 0.74) : clamp(a / 1.62, 0.52, 1);
      bookRoot.scale.setScalar(fit);
      bookRoot.position.y = -(1 - fit) * 0.28;
      SLOTS.portrait = portrait;

      SLOTS.hero = SLOTS.portrait
        ? [
            { p: [-1.36, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.25 },
            { p: [0.2, -0.22, 0.6], r: [-0.05, -0.1, -0.035], s: 1.35 },
            { p: [1.62, -0.62, -0.34], r: [-0.045, -0.42, -0.17], s: 1.25 },
          ]
        : [
            { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
            { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
            { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 },
          ];

      if (!showDetailPanel) {
        SLOTS.detail = { p: [0, -0.05, 0.75], r: [0.02, -0.34, 0.05], s: SLOTS.portrait ? 0.94 : 1.08 };
        return;
      }

      if (SLOTS.portrait) {
        const el = dpRef.current;
        const panelH = el && el.offsetHeight > 40 ? el.offsetHeight : dims.h * 0.44;
        const gap = dims.h * 0.035,
          navB = dims.h * 0.1;
        const freeTop = navB;
        const freeBot = Math.max(dims.h - panelH - gap, freeTop + 140);
        const midPx = (freeTop + freeBot) / 2;
        const T13 = 0.23087,
          camZp = 9.9,
          zw = 0.8 * fit,
          rootY = -(1 - fit) * 0.28;
        const yw = 0.1 + (1 - (2 * midPx) / dims.h) * T13 * (camZp - zw);
        const availW = (((freeBot - freeTop) * 0.92) / dims.h) * 2 * T13 * (camZp - zw);
        const s = clamp(availW / fit / 2.65, 0.42, 0.92);
        SLOTS.detail = { p: [0, (yw - rootY) / fit, 0.8], r: [-0.02, -0.4, 0.06], s };
      } else {
        SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.06 };
      }
    }

    function setTargets(b, slot) {
      const s = b.springs;
      s.px.t = slot.p[0];
      s.py.t = slot.p[1];
      s.pz.t = slot.p[2];
      s.rx.t = slot.r[0];
      s.ry.t = slot.r[1];
      s.rz.t = slot.r[2];
      b.slotScale = slot.s;
    }

    const EASE = {
      hold: () => 1,
      outQuad: (t) => 1 - (1 - t) * (1 - t),
      outQuint: (t) => 1 - Math.pow(1 - t, 5),
      inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    };
    const LIFT = 0.38,
      CLEAR = 4.2;

    function playY(b, segs) {
      b.exit = { segs, i: 0, t: 0 };
    }
    function stepY(b, dt) {
      const ex = b.exit,
        s = b.springs;
      ex.t += dt;
      let seg = ex.segs[ex.i];
      while (seg && ex.t >= seg.d) {
        ex.t -= seg.d;
        s.py.v = seg.to;
        if (seg.end) seg.end();
        seg = ex.segs[++ex.i];
      }
      if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
      else b.exit = null;
      s.py.t = s.py.v;
      s.py.vel = 0;
    }
    function pinInPlace(b) {
      const s = b.springs;
      s.px.t = s.px.v;
      s.pz.t = s.pz.v;
      s.rx.t = s.rx.v;
      s.ry.t = s.ry.v;
      s.rz.t = s.rz.v;
    }
    function sendOut(b, i, delay) {
      const y0 = SLOTS.hero[i].p[1],
        here = b.springs.py.v,
        apex = y0 + LIFT;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
        { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } },
      ]);
    }
    function bringBack(b, i, delay) {
      const here = b.springs.py.v;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint },
      ]);
    }

    function windowIndices(start, total, count) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push((start + i) % total);
      return arr;
    }
    let carouselStart = 0;
    let currentWindow = windowIndices(0, N, VISIBLE);
    let carouselBusy = false;

    function rebuildHitMeshes() {
      hitMeshes.length = 0;
      currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
    }

    function applyMode() {
      if (state.mode === 'hero' || state.mode === 'closing') {
        currentWindow.forEach((bi, i) => {
          const slot = SLOTS.hero[i];
          if (slot) setTargets(bookInstances[bi], slot);
        });
      } else if (state.selected) {
        setTargets(state.selected, SLOTS.detail);
      }
    }

    function shiftCarousel(dir) {
      if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
      carouselBusy = true;
      const outgoing = currentWindow;
      carouselStart = (((carouselStart + dir) % N) + N) % N;
      const incoming = windowIndices(carouselStart, N, VISIBLE);

      const toHide = outgoing.filter((bi) => !incoming.includes(bi));

      toHide.forEach((bi) => {
        const oldIdx = outgoing.indexOf(bi);
        const slot = SLOTS.hero[oldIdx];
        const b = bookInstances[bi];
        if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
      });
      setT(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

      incoming.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (!slot) return;
        const b = bookInstances[bi];
        const alreadyOnScreen = outgoing.includes(bi);
        b.root.visible = true;
        if (!alreadyOnScreen) {
          b.springs.px.set(slot.p[0] + dir * 6.5);
          b.springs.py.set(slot.p[1]);
          b.springs.pz.set(slot.p[2]);
          b.springs.rx.set(slot.r[0]);
          b.springs.ry.set(slot.r[1]);
          b.springs.rz.set(slot.r[2]);
          b.springs.sc.set(slot.s * 0.92);
        }
        setTargets(b, slot);
      });

      currentWindow = incoming;
      rebuildHitMeshes();
      setT(() => { carouselBusy = false; }, 700);
    }
    shiftCarouselRef.current = shiftCarousel;

    const camX = new Spring(0, 13, 6.5),
      camY = new Spring(0.1, 13, 6.5),
      camZ = new Spring(9.6, 13, 6.5);
    const lookX = new Spring(0, 13, 6.5),
      lookY = new Spring(0, 13, 6.5);
    const parX = new Spring(0, 60, 10),
      parY = new Spring(0, 60, 10);

    function camTo(mode) {
      if (mode === 'detail') {
        camX.t = SLOTS.portrait ? 0 : -0.25;
        camZ.t = SLOTS.portrait ? 10.4 : 9.6;
        lookX.t = SLOTS.portrait ? 0 : -0.35;
        lookY.t = SLOTS.portrait ? 0 : 0.15;
      } else {
        camX.t = 0;
        camZ.t = 9.6;
        lookX.t = 0;
        lookY.t = 0;
      }
    }

    const pillX = new Spring(0, 190, 23),
      pillY = new Spring(0, 190, 23);
    let pillOn = false;
    function showPill() {
      const el = openBtnRef.current;
      if (!el) return;
      el.classList.remove(...OPEN_BTN_OFF);
      el.classList.add(...OPEN_BTN_ON);
      pillOn = true;
    }
    function hidePill() {
      const el = openBtnRef.current;
      if (el) {
        el.classList.remove(...OPEN_BTN_ON);
        el.classList.add(...OPEN_BTN_OFF);
      }
      pillOn = false;
    }

    function open(book) {
      if (state.mode !== 'hero' || !book) return;
      state.mode = 'opening';
      setUiMode('opening');
      state.selected = book;
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
      book.exit = null;
      root.classList.add('bs-transit');
      setSelectedCfg(book.cfg);
      computeSlots();

      let out = 0;
      currentWindow.forEach((bi, i) => {
        const b = bookInstances[bi];
        if (b !== book) sendOut(b, i, out++ * 0.08);
      });

      setT(() => {
        if (state.mode !== 'opening' && state.mode !== 'detail') return;
        book.orbY = RM ? 0 : -6.2832;
        book.orbYv = RM ? 0 : 3;
        book.orbPhase = 'return';
        book.orbTarget = 0;
        book.orbXs.set(0);
        applyMode();
        camTo('detail');
      }, 760);
      setT(() => leaves.activate(book), 1000);
      setT(() => {
        if (state.mode === 'opening') {
          currentWindow.forEach((bi) => {
            const sibling = bookInstances[bi];
            if (sibling !== book) {
              sibling.exit = null;
              sibling.root.visible = false;
            }
          });
          root.classList.add('bs-detail-open');
          state.mode = 'detail';
          setUiMode('detail');
        }
      }, 1400);
    }

    function close() {
      if (state.mode !== 'detail') return;
      state.mode = 'closing';
      setUiMode('closing');
      root.classList.remove('bs-detail-open');
      leaves.deactivate();
      orbit.drag = false;
      const b = state.selected;
      if (b) {
        b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
        b.orbYv = Math.max(b.orbYv, 3);
        b.orbPhase = 'return';
        b.orbXs.t = 0;
      }
      setT(() => {
        root.classList.remove('bs-transit');
        applyMode();
        camTo('hero');
        let back = 0;
        currentWindow.forEach((bi, i) => {
          const bk = bookInstances[bi];
          if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
        });
      }, 250);
      setT(() => {
        if (state.mode === 'closing') {
          state.mode = 'hero';
          setUiMode('hero');
          state.selected = null;
          setSelectedCfg(null);
        }
      }, 1600);
    }

    const onCloseClick = () => close();
    closeBtnRef.current?.addEventListener('click', onCloseClick);

    const ptr = {
      ndcX: 0,
      ndcY: 0,
      cx: 0,
      cy: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      downX: 0,
      downY: 0,
      moved: 0,
      t0: 0,
      type: 'mouse',
      seen: false,
      id: null,
    };
    const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
    let dragBook = null,
      rayBook = null;
    const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
    const ray = new THREE.Raycaster();
    const tmpV = new THREE.Vector3();

    const canvas = canvasEl;
    const onContextMenu = (e) => e.preventDefault();
    canvas.addEventListener('contextmenu', onContextMenu);

    const onPointerLeave = () => {
      rayBook = null;
      state.pillLock = null;
      state.kbIndex = -1;
    };
    canvas.addEventListener('pointerleave', onPointerLeave);

    const localXY = (e) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerMove = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      const { x: cx, y: cy } = localXY(e);
      const dxN = (cx - ptr.lastX) / dims.w;
      const dyN = (cy - ptr.lastY) / dims.h;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      if (state.mode === 'detail') leaves.push(dxN, dyN);
      if (ptr.down && dragBook) {
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
        dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
      }
      if (ptr.down && orbit.drag) {
        orbit.dxAcc += dxN;
        orbit.dyAcc += dyN;
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const onPointerDown = (e) => {
      if (ptr.id !== null) return;
      root.focus({ preventScroll: true });
      ptr.id = e.pointerId;
      const { x: cx, y: cy } = localXY(e);
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      castRay();
      if (state.mode === 'hero' && rayBook) {
        ptr.down = true;
        dragBook = rayBook;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else if (state.mode === 'detail' && rayBook === state.selected) {
        ptr.down = true;
        orbit.drag = true;
        orbit.dxAcc = 0;
        orbit.dyAcc = 0;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else {
        state.pillLock = null;
        state.kbIndex = -1;
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);

    const onPointerUp = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      orbit.drag = false;
      if (dragBook) {
        const slop = isTouch() ? 26 : 14;
        const limit = isTouch() ? 650 : 450;
        const wasDrag = ptr.moved > slop;
        dragBook.springs.drag.t = 0;
        if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
        dragBook = null;
      }
      ptr.down = false;
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointerup', onPointerUp);

    const cancelPointer = (e) => {
      if (e && ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      ptr.down = false;
      orbit.drag = false;
      if (dragBook) {
        dragBook.springs.drag.t = 0;
        dragBook = null;
      }
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointercancel', cancelPointer);
    canvas.addEventListener('lostpointercapture', cancelPointer);

    const onKeydown = (e) => {
      if (e.key === 'Escape') close();
      if (state.mode !== 'hero') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          shiftCarousel(e.key === 'ArrowRight' ? 1 : -1);
        } else {
          const d = e.key === 'ArrowRight' ? 1 : -1;
          state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
          state.pillLock = null;
        }
        e.preventDefault();
      }
      if (e.key === 'Enter' && state.hovered) open(state.hovered);
    };
    root.addEventListener('keydown', onKeydown);

    function castRay() {
      ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
      const hits = ray.intersectObjects(hitMeshes, false);
      if (hits.length) {
        rayBook = bookByHit(hits[0].object);
        const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
        rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
      } else {
        rayBook = null;
      }
    }

    let clock = new THREE.Clock();
    const idle = RM ? 0 : 1;
    const DETAIL_OPEN_ANGLE = 0.88;
    const DETAIL_OPEN_SWAY = 0.035;

    function screenPos(b) {
      b.root.getWorldPosition(tmpV).project(camera);
      b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
      b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
    }

    function tickBook(b, dt, t) {
      const s = b.springs;
      const isHov = state.hovered === b;
      const inDetail = state.mode === 'detail' && state.selected === b;
      const orbitActive = state.selected === b && state.mode !== 'hero';

      let activity = 0;
      if (orbitActive) {
        if (orbit.drag && inDetail) {
          const step = orbit.dxAcc * 6.5;
          orbit.dxAcc = 0;
          b.orbY += step;
          b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
          b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
          orbit.dyAcc = 0;
          b.orbPhase = 'drag';
        } else {
          b.orbXs.t = 0;
          if (b.orbPhase === 'drag') {
            if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
            else {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          }
          if (b.orbPhase === 'spin') {
            b.orbYv *= Math.exp(-0.9 * dt);
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbYv) < 0.5) {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          } else if (b.orbPhase === 'return') {
            const acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
            b.orbYv += acc * dt;
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
              b.orbY = b.orbTarget;
              b.orbYv = 0;
              b.orbPhase = 'idle';
            }
          }
        }
        const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
        activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
      }
      b.orbXs.update(dt);

      let coverBase = 0;
      if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
      const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
      const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
      let coverBBase = 0;
      if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

      if (isHov && ptr.seen && state.mode === 'hero') {
        const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
        const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
        s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
        s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
        s.lift.t = 0.3;
        coverBase = 0;
      } else {
        s.tiltY.t = 0;
        s.tiltX.t = 0;
        s.lift.t = 0;
      }
      s.cover.t = coverBase + fan;
      s.coverB.t = coverBBase + fanB;
      s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

      s.px.update(dt);
      if (b.exit) stepY(b, dt);
      else s.py.update(dt);
      s.pz.update(dt);
      s.rx.update(dt);
      s.ry.update(dt);
      s.rz.update(dt);
      s.sc.update(dt);
      s.tiltX.update(dt);
      s.tiltY.update(dt);
      s.lift.update(dt);
      s.cover.update(dt);
      s.coverB.update(dt);
      s.drag.update(dt);

      b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
      b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

      b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
      const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
      const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
      b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
      b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

      const ang = Math.max(0, s.cover.v + s.drag.v);
      const angB = Math.max(0, s.coverB.v);
      b.pivot.rotation.y = -ang;
      b.pivot.position.z = PIVOT_Z + ang * 0.022;
      b.backPivot.rotation.y = angB;
      b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
      b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
      b.block.scale.z = 1 - (ang + angB) * 0.05;
      b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
      for (let i = 0; i < PAGE_N; i++) {
        const fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
        b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
      }
      for (let i = 0; i < 6; i++) b.pagesB[i].rotation.y = angB * b.pageFB[i];
    }

    let rafId = 0;
    let isInViewport = true;
    function animate() {
      if (cancelled || !isInViewport || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
      let hov = null;
      if (state.mode === 'hero') {
        const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
        hov = rayBook || state.pillLock || kb || null;
      } else if (state.mode === 'detail') {
        hov = rayBook === state.selected ? rayBook : null;
      }
      state.hovered = hov;
      let cur = 'default';
      if (state.mode === 'hero' && hov) cur = 'pointer';
      else if (state.mode === 'detail' && state.selected) {
        if (orbit.drag) cur = 'grabbing';
        else if (rayBook === state.selected) cur = 'grab';
      }
      canvas.style.cursor = cur;

      bookInstances.forEach((b) => screenPos(b));
      bookInstances.forEach((b) => tickBook(b, dt, t));
      leaves.update(dt, t);

      parX.t = RM ? 0 : ptr.ndcX * 0.02;
      parY.t = RM ? 0 : -ptr.ndcY * 0.012;
      bookRoot.rotation.y = parX.update(dt);
      bookRoot.rotation.x = parY.update(dt);

      camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
      camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

      if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
        const tx = ptr.cx,
          ty = ptr.cy + 34;
        if (!pillOn) {
          pillX.set(tx);
          pillY.set(ty);
        }
        pillX.t = tx;
        pillY.t = ty;
        if (openBtnRef.current) {
          openBtnRef.current.style.left = pillX.update(dt) + 'px';
          openBtnRef.current.style.top = pillY.update(dt) + 'px';
        }
        if (!pillOn) showPill();
      } else {
        hidePill();
      }

      renderer.render(scene, camera);
    }

    function resumeAnimation() {
      if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
    }

    function relayout() {
      const r = root.getBoundingClientRect();
      dims.w = Math.max(1, Math.round(r.width));
      dims.h = Math.max(1, Math.round(r.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, dims.w < 800 ? 1.5 : 2));
      renderer.setSize(dims.w, dims.h);
      camera.aspect = dims.w / dims.h;
      camera.updateProjectionMatrix();
      computeSlots();
      applyMode();
      camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
    }

    relayout();
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      const slot = SLOTS.hero[i];
      const s = b.springs;
      s.px.set(slot.p[0]);
      s.py.set(slot.p[1] - 3.9);
      s.pz.set(slot.p[2]);
      s.rx.set(slot.r[0]);
      s.ry.set(slot.r[1]);
      s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
      s.sc.set(slot.s);
      b.slotScale = slot.s;
      setT(() => setTargets(b, slot), 240 + i * 150);
    });
    bookInstances.forEach((b, idx) => {
      if (!currentWindow.includes(idx)) b.root.visible = false;
    });
    rebuildHitMeshes();
    camTo('hero');
    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) resumeAnimation();
        else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '160px' },
    );
    visibilityObserver.observe(root);

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        resumeAnimation();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onWindowResize = () => relayout();
    let orientationTimeout = null;
    const onOrientation = () => {
      relayout();
      orientationTimeout = setT(relayout, 250);
    };
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onOrientation);
    let visualViewportHandler = null;
    if (window.visualViewport) {
      visualViewportHandler = () => relayout();
      window.visualViewport.addEventListener('resize', visualViewportHandler);
    }
    const ro = new ResizeObserver(() => relayout());
    ro.observe(root);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      timeouts.forEach((id) => clearTimeout(id));
      if (orientationTimeout) clearTimeout(orientationTimeout);

      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ro.disconnect();
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onOrientation);
      if (visualViewportHandler && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', visualViewportHandler);
      }
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancelPointer);
      root.removeEventListener('keydown', onKeydown);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('lostpointercapture', cancelPointer);
      closeBtnRef.current?.removeEventListener('click', onCloseClick);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v && v.isTexture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      scene.environment?.dispose();
      scene.environment = null;
      renderer.dispose();
    };
  }, [services, showDetailPanel]);

  // Update textures dynamically on billingCycle change
  useEffect(() => {
    if (bookInstancesRef.current.length) {
      bookInstancesRef.current.forEach((b) => {
        b.updateTextures?.(isYearly);
      });
    }
  }, [billingCycle, isYearly]);

  const panelVisible = uiMode === 'detail';
  const heroWordVisible = mounted && uiMode === 'hero';
  const canCarousel = showCarousel && services.length > 3;

  const delayMap = {
    50: 'delay-[50ms]',
    130: 'delay-[130ms]',
    210: 'delay-[210ms]',
    270: 'delay-[270ms]',
    330: 'delay-[330ms]',
  };

  const dpChild = (delayMs) =>
    panelVisible
      ? `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayMap[delayMs] || ''}`
      : 'opacity-0 translate-y-[28px] transition-[opacity,transform] duration-[280ms] ease-out';

  const handleActionClick = () => {
    if (!selectedCfg) return;
    const currentPrice = isYearly ? selectedCfg.yearlyPrice : selectedCfg.monthlyPrice;
    const fullPassTitle = `${selectedCfg.title} (${billingCycle.toUpperCase()} - ${currentPrice})`;
    if (selectedCfg.id === 'pt-training') {
      onBookPTRef.current?.(fullPassTitle);
    } else {
      onClaimPassRef.current?.(fullPassTitle);
    }
  };

  const displayPrice = selectedCfg
    ? isYearly
      ? selectedCfg.yearlyPrice
      : selectedCfg.monthlyPrice
    : '';

  const displaySavings = selectedCfg
    ? isYearly
      ? selectedCfg.yearlySavings
      : null
    : null;

  return (
    <section
      id={id || 'services-section'}
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-label="3D Gym Services & Membership Showcase"
      data-state={uiMode}
      className={cn(
        'book-showcase relative isolate h-[88vh] min-h-[660px] max-h-[980px] w-full overflow-hidden font-sans outline-none [container-type:size] [-webkit-tap-highlight-color:transparent] my-12',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF2E4C]',
        'transition-colors duration-500 ease-out bg-[#0B0B0B] text-white',
        className,
      )}
    >
      {/* Anchor for backward compatibility */}
      <span id="services-showcase" className="absolute top-0 left-0 pointer-events-none" aria-hidden="true" />
      {/* Background Section Title */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[12%] z-[1] -translate-x-1/2 select-none transition-all duration-500 ease-out ${
          heroWordVisible ? 'translate-y-0 opacity-100' : uiMode === 'hero' ? '-translate-y-0 translate-y-[60px] opacity-0' : '-translate-y-11 opacity-0'
        }`}
      >
        <span className="block whitespace-nowrap text-current text-[clamp(4.5rem,18cqw,14rem)] font-extrabold leading-[0.85] tracking-[-0.02em] opacity-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0">
          {heroTitle}
        </span>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[2] block h-full w-full touch-none" />

      {showNav && (
        <nav
          aria-hidden={uiMode !== 'hero'}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-4 z-40 flex flex-wrap items-center justify-between gap-4 px-[clamp(20px,4cqw,42px)] py-4 transition-opacity duration-300',
            uiMode === 'hero' ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="flex items-center gap-3 text-[clamp(18px,2cqw,26px)] font-black tracking-wider uppercase text-white">
            <Sparkles className="w-6 h-6 text-[#FF2E4C] animate-pulse" />
            <span>{navTitle}</span>
          </div>

          {/* Monthly / Yearly Package Selector Toggle */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#12161A]/90 p-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] text-white shadow-[0_0_15px_rgba(255,46,76,0.6)] scale-[1.03]'
                  : 'text-[#8A94A0] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-[#FF2E4C] via-[#FF526B] to-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-[1.03]'
                  : 'text-[#8A94A0] hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40">
                SAVE 20%
              </span>
            </button>
          </div>
        </nav>
      )}

      {canCarousel && (
        <>
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => shiftCarouselRef.current(-1)}
            className={`absolute left-4 top-1/2 z-30 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#12161A]/90 text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:border-[#FF2E4C] hover:text-[#FF2E4C] ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => shiftCarouselRef.current(1)}
            className={`absolute right-4 top-1/2 z-30 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#12161A]/90 text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:border-[#FF2E4C] hover:text-[#FF2E4C] ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Interactive Cursor Hover Ticket */}
      <button
        ref={openBtnRef}
        tabIndex={-1}
        aria-hidden="true"
        className={
          'absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 rotate-[-1.6deg] px-[36px] pb-[16px] pt-3.5 ' +
          'text-[14px] font-black uppercase tracking-[0.14em] text-white pointer-events-none ' +
          'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[left,top,opacity,transform] ' +
          '[clip-path:polygon(0%_0.9%,8.3%_0.8%,16.7%_6.3%,25%_3.8%,33.3%_5.5%,41.7%_2.7%,50%_5.2%,58.3%_0.4%,66.7%_5.9%,75%_6.5%,83.3%_1%,91.7%_6.4%,100%_0.7%,97.7%_20%,97%_40%,99.6%_60%,98.7%_80%,100%_96.5%,91.7%_99.8%,83.3%_95.6%,75%_94.9%,66.7%_96.6%,58.3%_93.5%,50%_97.9%,41.7%_99.5%,33.3%_93.2%,25%_93.6%,16.7%_93.2%,8.3%_93.1%,0%_93.5%,0.2%_80%,1.1%_60%,3.9%_40%,3.8%_20%)] ' +
          '[background:linear-gradient(135deg,#FF2E4C_0%,#E50914_100%)] ' +
          '[filter:drop-shadow(0_0_15px_rgba(255,46,76,0.6))] ' +
          OPEN_BTN_OFF.join(' ')
        }
      >
        EXPLORE TIER
      </button>

      {/* Close Button */}
      <button
        ref={closeBtnRef}
        aria-label="Close detail view"
        className={`absolute left-1/2 top-[24px] z-40 -translate-x-1/2 inline-flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/30 bg-[#12161A]/80 text-[18px] leading-none text-white shadow-xl transition-all duration-300 hover:border-[#FF2E4C] hover:text-[#FF2E4C] @max-[760px]:left-auto @max-[760px]:right-[18px] @max-[760px]:top-[18px] @max-[760px]:translate-x-0 ${
          uiMode === 'detail' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        &#10005;
      </button>

      {/* Detail View Panel */}
      {showDetailPanel && (
        <div
          ref={dpRef}
          aria-live="polite"
          className={`absolute right-[6%] top-1/2 z-[15] w-[min(560px,44%)] -translate-y-1/2 pointer-events-none @max-[760px]:right-auto @max-[760px]:left-1/2 @max-[760px]:top-auto @max-[760px]:bottom-[3%] @max-[760px]:w-[min(560px,92cqw)] @max-[760px]:-translate-x-1/2 @max-[760px]:translate-y-0 ${
            panelVisible ? 'visible' : 'invisible delay-[500ms]'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
              selectedCfg?.id === 'elite-membership'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFD700]'
                : selectedCfg?.id === 'pt-training'
                ? 'bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF]'
                : 'bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C]'
            } ${dpChild(50)}`}>
              <Crown size={14} />
              <span>{selectedCfg?.badge || 'TITAN TIER'}</span>
            </div>

            {displaySavings && (
              <div className={`inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold ${dpChild(50)}`}>
                <Percent size={12} />
                <span>{displaySavings}</span>
              </div>
            )}
          </div>

          <h2 className={`m-0 text-[clamp(42px,5cqw,76px)] font-black leading-[0.95] tracking-tight text-white @max-[760px]:text-[clamp(32px,8cqw,48px)] ${dpChild(50)}`}>
            {selectedCfg?.title}
          </h2>

          <p className={`mt-4 max-w-[50ch] text-[#A0AEC0] text-[clamp(15px,1.15cqw,18px)] leading-[1.6] @max-[760px]:mt-3 @max-[760px]:line-clamp-3 @max-[760px]:text-[14px] ${dpChild(130)}`}>
            {selectedCfg?.desc}
          </p>

          <div className={`mt-5 flex items-center gap-4 ${dpChild(210)}`}>
            <div className="flex gap-1 text-[#FFD700]">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 2.6l2.8 6 6.6.6-5 4.4 1.5 6.5L12 16.7 6.1 20.1l1.5-6.5-5-4.4 6.6-.6z" />
                </svg>
              ))}
            </div>
            <div className="h-5 w-px bg-white/20" />
            <div className="text-sm font-semibold text-[#8A94A0]">
              {billingCycle.toUpperCase()} PACKAGE
            </div>
            <div className="ml-auto text-2xl font-black text-white">{displayPrice}</div>
          </div>

          <div className={`mt-5 border-t border-white/10 ${dpChild(270)}`} />

          {/* Chapters / Features checklist */}
          <div className={`mt-4 grid grid-cols-1 @min-[480px]:grid-cols-2 gap-2 text-xs font-medium text-white/90 ${dpChild(270)}`}>
            {selectedCfg?.chapters?.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[#12161A]/60 border border-white/5 px-3 py-2 rounded-xl">
                <Check size={14} className="text-[#FF2E4C] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div
            className={`pointer-events-auto mt-6 flex items-center gap-3.5 @max-[760px]:mt-4 ${dpChild(330)}`}
          >
            <button
              onClick={handleActionClick}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] px-8 text-[15px] font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,46,76,0.5)] transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]"
            >
              <Zap size={18} />
              <span>{selectedCfg?.ctaText || 'Claim Pass'}</span>
            </button>

            <button
              onClick={() => close()}
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/20 bg-[#12161A] px-6 text-[14px] font-bold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              Back to Overview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ServicesSection;
