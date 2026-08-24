import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2, Zap, Star, X, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const supplementProducts = [
  {
    id: 'prod-creatine',
    name: 'PULSEFIT CREATINE MONOHYDRATE',
    category: 'CREATINE MONOHYDRATE',
    price: 1899,
    rating: 4.98,
    image: '/pulsefit-creatine.jpg',
    tag: 'ATHLETE SERIES • 500g',
    specs: ['100% Pure Creapure®', '102 Servings', 'ATP Muscle Power']
  },
  {
    id: 'prod-preworkout',
    name: 'PULSEFIT PRE-WORKOUT ENERGY',
    category: 'PRE-WORKOUT IGNITION',
    price: 2299,
    rating: 4.96,
    image: '/pulsefit-preworkout.jpg',
    tag: 'EXPLOSIVE FORMULA',
    specs: ['350mg Caffeine', 'Berry Fusion', '30 Servings']
  },
  {
    id: 'prod-shaker',
    name: 'PULSEFIT VORTEX SMART SHAKER',
    category: 'HYDRATION & ACCESSORIES',
    price: 1499,
    rating: 4.94,
    image: '/pulsefit-shaker.jpg',
    tag: 'ELECTRIC VORTEX',
    specs: ['Electric LED Vortex', 'BPA Free 700ml', 'USB-C Rechargeable']
  },
  {
    id: 'prod-whey',
    name: 'PULSEFIT PERFORMANCE WHEY PROTEIN',
    category: 'PROTEIN & WHEY',
    price: 3499,
    rating: 4.97,
    image: '/pulsefit-whey.jpg',
    tag: 'ATHLETE SERIES • PREMIUM',
    specs: ['28g Isolate Blend', '73 Servings', 'Zero Sugar']
  },
  {
    id: 'prod-belt',
    name: 'PULSEFIT PRO LEVER LIFTING BELT',
    category: 'GEAR & GEAR ACCESSORIES',
    price: 3899,
    rating: 4.97,
    image: '/pulsefit-belt.jpg',
    tag: 'POWERLIFTING LEVER',
    specs: ['Steel Lever Buckle', '10mm Genuine Leather', 'Crimson Stitching']
  },
  {
    id: 'prod-bar',
    name: 'PULSEFIT PROTEIN BAR (DARK CHOCOLATE)',
    category: 'PROTEIN BARS & SNACKS',
    price: 1299,
    rating: 4.95,
    image: '/pulsefit-bar.jpg',
    tag: 'DARK CHOCOLATE ESPRESSO',
    specs: ['20g Protein / Bar', 'Dark Chocolate', 'Real Espresso Beans']
  }
];

export default function PopularDestinations({ onReserveSpot }) {
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [cart, setCart] = useState([
    { ...supplementProducts[0], quantity: 1 },
    { ...supplementProducts[1], quantity: 1 }
  ]);
  const [cartOpen, setCartOpen] = useState(false);

  // GSAP Horizontal Scroll Pinning Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !targetRef.current) return;
      const totalWidth = containerRef.current.scrollWidth - window.innerWidth + 120;

      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: targetRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          }
        }
      });
    }, targetRef);

    return () => ctx.revert();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const totalItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const handleCheckout = () => {
    const summary = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');
    if (onReserveSpot) {
      onReserveSpot(`Order Claimed: ${summary} • Total: ₹${totalPrice.toLocaleString()}`);
    }
    setCartOpen(false);
  };

  return (
    <section ref={targetRef} id="supplements-menu" className="relative h-screen bg-[#090C0E] overflow-hidden flex flex-col justify-between py-8">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#FF2E4C]/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 shrink-0">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase flex items-center gap-2">
            <Zap size={14} className="text-[#FF2E4C]" /> NUTRITION & GEAR ENGINE
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white uppercase tracking-tight">
            TITAN SUPPLEMENTS & GEAR <span className="text-[#8A94A0]">(06 PRODUCTS MENU)</span>
          </h2>
        </div>
      </div>

      {/* Single Line Horizontal Scroll Container */}
      <div ref={containerRef} className="flex gap-8 px-6 md:px-12 items-center h-[73vh] z-10">
        {supplementProducts.map((product) => {
          const inCartItem = cart.find(i => i.id === product.id);
          const inCartQty = inCartItem ? inCartItem.quantity : 0;

          return (
            <div 
              key={product.id}
              className="relative min-w-[340px] md:min-w-[440px] h-full rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden group flex flex-col justify-between p-6 md:p-7 hover:border-[#FF2E4C]/60 transition-all duration-500 shrink-0 shadow-2xl"
            >
              {/* Product Card Top Badges */}
              <div className="relative z-10 flex justify-between items-center mb-3">
                <span className="px-3 py-1 rounded-full bg-[#090C0E]/90 border border-[#FF2E4C]/50 text-[#FF2E4C] text-[10px] font-mono font-extrabold uppercase">
                  {product.tag}
                </span>

                <span className="px-3 py-1 rounded-full bg-[#090C0E]/90 border border-white/10 text-white text-xs font-mono flex items-center gap-1">
                  <Star size={13} className="fill-[#FFB800] text-[#FFB800]" />
                  <span>{product.rating}</span>
                </span>
              </div>

              {/* Product Image Stage - Fully visible with object-contain */}
              <div className="relative h-60 md:h-68 rounded-2xl overflow-hidden bg-gradient-to-b from-[#181D24] to-[#090C0E] border border-white/10 mb-4 group/img flex items-center justify-center p-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A]/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Product Content & Specs */}
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase block mb-1">{product.category}</span>
                <h3 className="text-xl md:text-2xl font-extrabold font-heading text-white uppercase mb-2.5 line-clamp-1 group-hover:text-[#FF2E4C] transition-colors">
                  {product.name}
                </h3>

                {/* Specs Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {product.specs.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#090C0E] border border-white/10 text-[10px] text-[#8A94A0] font-mono">
                      • {spec}
                    </span>
                  ))}
                </div>

                {/* Price & Add to Cart Action Row */}
                <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-[#8A94A0] font-mono uppercase block">PRICE</span>
                    <span className="text-2xl font-black font-heading text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>

                  {inCartQty > 0 ? (
                    <div className="flex items-center gap-2 bg-[#090C0E] border border-[#FF2E4C] rounded-2xl p-1.5">
                      <button 
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-xl bg-[#12161A] text-white flex items-center justify-center hover:bg-[#FF2E4C] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-mono font-bold text-white">{inCartQty}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-8 h-8 rounded-xl bg-[#12161A] text-white flex items-center justify-center hover:bg-[#FF2E4C] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)] active:scale-95"
                    >
                      <ShoppingBag size={16} /> ADD TO CART
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Shopping Cart Slide-Over Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[110] bg-[#090C0E]/85 backdrop-blur-xl flex justify-end">
          <div className="w-full max-w-md bg-[#12161A] h-full border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-fadeIn">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-white font-heading font-extrabold text-xl">
                  <ShoppingBag className="text-[#FF2E4C]" />
                  <span>TITAN CART ({totalItemsCount})</span>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-[#8A94A0] hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-20 text-center text-[#8A94A0] font-mono text-xs flex flex-col items-center gap-3">
                  <ShoppingCart size={36} className="text-[#FF2E4C] opacity-50" />
                  <span>Your Titan Shopping Cart is empty.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-2 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-[#181D24] p-1 border border-white/10" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-white uppercase font-heading">{item.name}</h4>
                        <span className="text-xs font-mono text-[#00F0FF]">₹{item.price.toLocaleString()}</span>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-[#12161A] rounded-lg p-1 border border-white/10">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-[#090C0E] text-white flex items-center justify-center">
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-[#090C0E] text-white flex items-center justify-center">
                              <Plus size={12} />
                            </button>
                          </div>

                          <button onClick={() => removeFromCart(item.id)} className="text-[#FF2E4C] hover:text-red-400 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-[#8A94A0] uppercase">TOTAL ORDER VALUE</span>
                  <span className="text-2xl font-black font-heading text-white">₹{totalPrice.toLocaleString()}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,46,76,0.5)] transition-all"
                >
                  <ShieldCheck size={18} /> Proceed to Order & Claim Stash Pass
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
