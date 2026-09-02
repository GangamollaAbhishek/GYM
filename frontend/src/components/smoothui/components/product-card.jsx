import React, { useState } from 'react';
import { Star, ShoppingCart, Plus, Minus, Check, Sparkles } from 'lucide-react';

export default function ProductCard({
  badge,
  image,
  originalPrice,
  price,
  rating = 4.9,
  title,
  name,
  category,
  specs = [],
  onAddToCart,
  inCartQty = 0,
  onUpdateQuantity,
  className = ''
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const displayTitle = title || name || 'Titan Product';
  const formattedPrice = typeof price === 'number' ? `₹${price.toLocaleString()}` : price;
  const formattedOriginalPrice = originalPrice ? (typeof originalPrice === 'number' ? `₹${originalPrice.toLocaleString()}` : originalPrice) : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl bg-gradient-to-b from-[#161B22]/90 to-[#0D1117]/95 border border-white/[0.08] hover:border-[#FF1E27]/60 p-5 md:p-6 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl ${
        isHovered ? '-translate-y-1.5 shadow-[0_20px_40px_rgba(255,30,39,0.18)]' : ''
      } ${className}`}
    >
      {/* Top Ambient Glow */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 bg-[#FF1E27]/20 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Top Bar: Badge & Rating */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        {badge ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/40 text-[#FF1E27] text-[10px] font-mono font-black uppercase tracking-wider shadow-[0_0_10px_rgba(255,30,39,0.2)]">
            <Sparkles size={11} className="animate-pulse" />
            {badge}
          </span>
        ) : (
          <span />
        )}

        {rating && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white text-xs font-mono backdrop-blur-md">
            <Star size={12} className="fill-[#FFB800] text-[#FFB800]" />
            <span className="font-bold">{rating}</span>
          </div>
        )}
      </div>

      {/* Image Container with Smooth 3D Hover Zoom */}
      <div className="relative w-full h-[210px] rounded-2xl bg-gradient-to-b from-[#0B0E14] to-[#12161F] border border-white/5 flex items-center justify-center p-4 overflow-hidden mb-4 group-hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img
          src={image}
          alt={displayTitle}
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>

      {/* Meta Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {category && (
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              {category}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-black font-['Outfit',sans-serif] text-white uppercase tracking-tight line-clamp-1 group-hover:text-white transition-colors">
            {displayTitle}
          </h3>

          {/* Specs / Tags Chips */}
          {specs && specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {specs.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/[0.08] text-[10px] text-slate-400 font-mono"
                >
                  • {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Price & Add to Cart Controls */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">OFFICIAL PRICE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          {inCartQty > 0 ? (
            <div className="flex items-center gap-1.5 bg-black/80 border border-[#FF1E27] rounded-2xl p-1 shadow-[0_0_15px_rgba(255,30,39,0.3)]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpdateQuantity) onUpdateQuantity(-1);
                }}
                className="w-7 h-7 rounded-xl bg-white/[0.08] hover:bg-[#FF1E27] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-white min-w-[18px] text-center">
                {inCartQty}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpdateQuantity) onUpdateQuantity(1);
                }}
                className="w-7 h-7 rounded-xl bg-white/[0.08] hover:bg-[#FF1E27] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,30,39,0.35)] flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              {justAdded ? (
                <>
                  <Check size={14} className="text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
