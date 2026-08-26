import React, { useState } from 'react';
import { Dumbbell, ArrowUp, Send, Instagram, Youtube, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useLandingPageCMS } from '../context/LandingPageCMSContext';

export default function Footer({ onScrollToTop }) {
  const { cmsData } = useLandingPageCMS();
  const brandData = cmsData?.brand || {};
  const footerData = cmsData?.footer || {};

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const socials = footerData?.socials || {};
  const socialLinks = [
    { icon: Instagram, url: socials.instagram || 'https://instagram.com', name: 'Instagram' },
    { icon: Youtube, url: socials.youtube || 'https://youtube.com', name: 'YouTube' },
    { icon: Twitter, url: socials.twitter || 'https://twitter.com', name: 'Twitter' },
    { icon: Facebook, url: socials.facebook || 'https://facebook.com', name: 'Facebook' },
    { icon: Linkedin, url: socials.linkedin || 'https://linkedin.com', name: 'LinkedIn' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#090C0E] rounded-t-[40px] pt-16 pb-12 overflow-hidden border-t border-white/10 relative">
      
      {/* Giant Kinetic Marquee Ticker */}
      <div className="w-full overflow-hidden whitespace-nowrap py-6 mb-16 border-y border-white/10 bg-[#12161A]">
        <div className="inline-block animate-marquee font-heading font-black text-5xl md:text-8xl tracking-tighter uppercase text-[#8A94A0]/20">
          {brandData.tagline ? `${brandData.tagline} • ${brandData.name} • ${brandData.tagline} • ` : 'NO EXCUSES • PUSH YOUR LIMITS • JOIN THE LEGACY • TITAN PULSE • NO EXCUSES • PUSH YOUR LIMITS • JOIN THE LEGACY • TITAN PULSE •'}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {brandData.logo ? (
                <div className="w-10 h-10 rounded-xl bg-[#12161A] border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,46,76,0.4)]">
                  <img src={brandData.logo} alt={brandData.name || 'Logo'} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E4C] to-[#00F0FF] p-[1px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#090C0E] rounded-full flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-[#FF2E4C]" />
                  </div>
                </div>
              )}
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                {brandData.name || 'TITAN • PULSE 3D'}
              </span>
            </div>
            <p className="text-xs text-[#8A94A0] max-w-sm leading-relaxed font-mono">
              {footerData.brandQuote || 'Next-generation 3D fitness architecture combining biometrics, AI load programming, and hyper-performance physical spaces.'}
            </p>

            {/* Dynamic Clickable Social Links */}
            <div className="flex flex-wrap gap-2.5 mt-2">
              {socialLinks.map((item, i) => (
                <a 
                  key={i}
                  href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  className="w-10 h-10 rounded-full bg-[#12161A] border border-white/10 hover:border-[#FF2E4C] hover:text-[#FF2E4C] hover:shadow-[0_0_15px_rgba(255,46,76,0.4)] flex items-center justify-center text-[#8A94A0] transition-all hover:scale-110 cursor-pointer"
                >
                  <item.icon size={17} />
                </a>
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
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
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
          <div>{footerData.copyright || '© 2026 TITAN PULSE 3D. ALL RIGHTS RESERVED.'}</div>
          
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
