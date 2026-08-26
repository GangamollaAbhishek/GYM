import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

export default function AdventuresGallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);

  const filters = ['All', '#Transformations', '#LiveClasses', '#PowerLifting', '#Recovery'];

  const items = [
    {
      id: 1,
      tag: '#PowerLifting',
      title: '500kg Deadlift PR Night',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: 2,
      tag: '#LiveClasses',
      title: 'Cyber Cardio Midnight Session',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: 3,
      tag: '#Transformations',
      title: '12-Week Hypertrophy Shift',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: 4,
      tag: '#Recovery',
      title: 'Cryo Chamber Decompression',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  ];

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(item => item.tag === activeFilter);

  return (
    <section className="py-24 px-4 md:px-12 bg-[#090C0E] relative">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">ACTION & MEDIA REEL</span>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-white uppercase mt-2">
              ACTION REELS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">HIGHLIGHTS</span>
            </h2>
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                  activeFilter === f
                    ? 'bg-[#FF2E4C] text-white font-bold shadow-[0_0_15px_rgba(255,46,76,0.4)]'
                    : 'bg-[#12161A] text-[#8A94A0] hover:text-white border border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="relative h-80 rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group cursor-pointer"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-black/30" />

              {/* Tag Header */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#090C0E]/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#00F0FF]">
                  {item.tag}
                </span>
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#FF2E4C] text-white flex items-center justify-center shadow-[0_0_25px_#FF2E4C] group-hover:scale-125 transition-transform duration-300">
                  <Play size={24} className="ml-1 fill-white" />
                </div>
              </div>

              {/* Title Footer */}
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-lg font-bold text-white font-heading">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-[#090C0E]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#12161A] rounded-3xl border border-white/20 p-4 shadow-2xl">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-[#8A94A0] hover:text-white p-2"
            >
              <X size={32} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <video 
                src={activeVideo.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mt-4">{activeVideo.title}</h3>
          </div>
        </div>
      )}

    </section>
  );
}
