import React, { useState } from "react";
import {
  Dumbbell,
  ArrowUp,
  Send,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";

// Interactive Social Media Button with Brand Glow, Shimmer & Floating Tooltip
function SocialIconButton({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Glass Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute pointer-events-none z-30 px-3 py-1.5 rounded-xl bg-[#12161E]/95 backdrop-blur-md border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-extrabold tracking-wider text-white font-mono uppercase">
              {item.name}
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#12161E] border-r border-b border-white/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.a
        href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
        target="_blank"
        rel="noopener noreferrer"
        title={item.name}
        whileHover={{ y: -5, scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative group w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300"
      >
        {/* Ambient Glow Aura */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none"
          style={{
            background: item.color,
            boxShadow: `0 0 25px ${item.shadow}`,
          }}
        />

        {/* Outer Pulsing Ping Ring on hover */}
        <span
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:animate-ping group-hover:opacity-40 pointer-events-none transition-all duration-300"
          style={{ border: `2px solid ${item.color}` }}
        />

        {/* Button Base Body */}
        <div className="relative w-full h-full rounded-2xl bg-[#12161A] border border-white/10 group-hover:border-transparent flex items-center justify-center overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {/* Active Gradient on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

          {/* Shimmer Light Reflection Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />

          {/* Icon */}
          <Icon
            size={18}
            className="relative z-10 text-[#8A94A0] group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>
      </motion.a>
    </div>
  );
}

export default function Footer({ onScrollToTop }) {
  const { cmsData } = useLandingPageCMS();
  const brandData = cmsData?.brand || {};
  const footerData = cmsData?.footer || {};

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const socials = footerData?.socials || {};
  const socialLinks = [
    {
      icon: Instagram,
      url: socials.instagram || "https://instagram.com",
      name: "Instagram",
      color: "#E1306C",
      bgGradient: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
      shadow: "rgba(225,48,108,0.7)",
    },
    {
      icon: Youtube,
      url: socials.youtube || "https://youtube.com",
      name: "YouTube",
      color: "#FF0000",
      bgGradient: "from-[#FF0000] to-[#B30000]",
      shadow: "rgba(255,0,0,0.7)",
    },
    {
      icon: Twitter,
      url: socials.twitter || "https://twitter.com",
      name: "Twitter / X",
      color: "#1DA1F2",
      bgGradient: "from-[#1DA1F2] to-[#0D8BD9]",
      shadow: "rgba(29,161,242,0.7)",
    },
    {
      icon: Facebook,
      url: socials.facebook || "https://facebook.com",
      name: "Facebook",
      color: "#1877F2",
      bgGradient: "from-[#1877F2] to-[#0D5BC6]",
      shadow: "rgba(24,119,242,0.7)",
    },
    {
      icon: Linkedin,
      url: socials.linkedin || "https://linkedin.com",
      name: "LinkedIn",
      color: "#0A66C2",
      bgGradient: "from-[#0A66C2] to-[#004182]",
      shadow: "rgba(10,102,194,0.7)",
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#090C0E] rounded-t-[40px] pt-16 pb-12 overflow-hidden border-t border-white/10 relative">
      {/* Giant Kinetic Marquee Ticker */}
      <div className="w-full overflow-hidden whitespace-nowrap py-6 mb-16 border-y border-white/10 bg-[#12161A]">
        <div className="inline-block animate-marquee font-heading font-black text-5xl md:text-8xl tracking-tighter uppercase text-[#8A94A0]/20">
          {brandData.tagline
            ? `${brandData.tagline} • ${brandData.name} • ${brandData.tagline} • `
            : "NO EXCUSES • PUSH YOUR LIMITS • JOIN THE LEGACY • TITAN PULSE • NO EXCUSES • PUSH YOUR LIMITS • JOIN THE LEGACY • TITAN PULSE •"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {brandData.logo ? (
                <div className="w-10 h-10 rounded-xl bg-[#12161A] border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,46,76,0.4)]">
                  <img
                    src={brandData.logo}
                    alt={brandData.name || "Logo"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E4C] to-[#00F0FF] p-[1px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#090C0E] rounded-full flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-[#FF2E4C]" />
                  </div>
                </div>
              )}
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                {brandData.name || "TITAN • PULSE 3D"}
              </span>
            </div>
            <p className="text-xs text-[#8A94A0] max-w-sm leading-relaxed font-mono">
              {footerData.brandQuote ||
                "Next-generation 3D fitness architecture combining biometrics, AI load programming, and hyper-performance physical spaces."}
            </p>

            {/* Dynamic Clickable Social Links with High-End Visual Effects */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-2">
              {socialLinks.map((item, i) => (
                <SocialIconButton key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Newsletter Box with Electric Crimson Border Glow */}
          <div className="md:col-span-7 bg-[#12161A] rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-[#FF2E4C]/40 transition-colors">
            <div>
              <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-1">
                WEEKLY ATHLETE DISPATCH
              </span>
              <h3 className="text-2xl font-bold font-heading text-white mb-4">
                Get Weekly Workout & Nutrition Plans
              </h3>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-[#FF2E4C]/20 border border-[#FF2E4C]/50 text-[#FF2E4C] text-xs font-mono">
                ✓ YOU ARE SUBSCRIBED TO WEEKLY WORKOUT DISPATCHES!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-[#090C0E] border border-white/10 focus:border-[#FF2E4C] focus:shadow-[0_0_20px_rgba(255,46,76,0.4)] focus:outline-none text-xs text-white font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,46,76,0.4)]"
                >
                  <Send size={14} /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A94A0]">
          <div>
            {footerData.copyright ||
              "© 2026 TITAN PULSE 3D. ALL RIGHTS RESERVED."}
          </div>

          <button
            onClick={onScrollToTop}
            className="flex items-center gap-2 text-[#8A94A0] hover:text-[#FF2E4C] transition-colors"
          >
            BACK TO TOP <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
