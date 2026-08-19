import React, { useEffect, useState } from 'react';
import { Globe, Users, Dumbbell, Activity, Radio } from 'lucide-react';

export default function TravelNetwork() {
  const [liveCheckIns, setLiveCheckIns] = useState(1420);
  const [liftedKg, setLiftedKg] = useState(24500);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCheckIns((prev) => prev + Math.floor(Math.random() * 3) - 1);
      setLiftedKg((prev) => prev + Math.floor(Math.random() * 25));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const pingLocations = [
    { name: 'Downtown Metro', top: '35%', left: '28%' },
    { name: 'Westside Hub', top: '48%', left: '42%' },
    { name: 'Uptown Elite', top: '25%', left: '68%' },
    { name: 'Tokyo Pulse', top: '42%', left: '85%' },
    { name: 'London Arena', top: '30%', left: '52%' }
  ];

  return (
    <section id="network" className="py-24 px-4 md:px-12 bg-[#090C0E] relative">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase flex items-center justify-center gap-2">
            <Radio size={14} className="animate-pulse text-[#FF2E4C]" /> LIVE TELEMETRY RADAR
          </span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            LIVE GYM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">NETWORK</span>
          </h2>
        </div>

        {/* Live Active Check-Ins Ticker Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#12161A] rounded-3xl p-6 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8A94A0] block uppercase">LIVE TICKER</span>
                <span className="text-3xl font-extrabold font-heading text-white">
                  {liveCheckIns.toLocaleString()} Members Training Right Now
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#FF2E4C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E4C] animate-ping" /> LIVE
            </span>
          </div>

          <div className="bg-[#12161A] rounded-3xl p-6 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Dumbbell size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8A94A0] block uppercase">DAILY TONNAGE MOVED</span>
                <span className="text-3xl font-extrabold font-heading text-[#00F0FF]">
                  {liftedKg.toLocaleString()} KG
                </span>
              </div>
            </div>
            <Activity size={20} className="text-[#FF2E4C] animate-pulse" />
          </div>

        </div>

        {/* Interactive Dotted World Map with Radar Ping Dots */}
        <div className="relative h-96 md:h-[450px] bg-[#12161A] rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Pulsing Radar Ping Dots on Map */}
          {pingLocations.map((loc, idx) => (
            <div 
              key={idx} 
              style={{ top: loc.top, left: loc.left }}
              className="absolute z-20 group"
            >
              <div className="relative w-4 h-4 rounded-full bg-[#FF2E4C] border border-white flex items-center justify-center cursor-pointer">
                <span className="absolute inset-0 rounded-full bg-[#FF2E4C] animate-ping opacity-75" />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#090C0E] border border-white/10 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {loc.name}
              </div>
            </div>
          ))}

          <div className="relative z-10 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF2E4C] to-[#00F0FF] p-[1px]">
              <div className="w-full h-full bg-[#090C0E] rounded-full flex items-center justify-center">
                <Globe size={32} className="text-[#FF2E4C] animate-spin-slow" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold font-heading text-white">GLOBAL NETWORK SYNCED ACROSS 12 CITIES</h3>
            <p className="text-xs text-[#8A94A0] max-w-md font-mono">
              Seamless access to any TITAN PULSE facility worldwide with single-pass biometric authentication.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
