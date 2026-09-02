import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '@/components/smoothui/components/product-card';

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
  const pinRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const { cart, addToCart, updateQuantity, removeFromCart, totalItemsCount, totalPrice } = useCart();

  // GSAP Horizontal Scroll Pinning Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !targetRef.current || !pinRef.current) return;
      const totalWidth = containerRef.current.scrollWidth - window.innerWidth + 120;

      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: targetRef.current,
          pin: pinRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          }
        }
      });
    }, targetRef);

    return () => ctx.revert();
  }, []);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <section ref={targetRef} id="supplements-menu" className="relative min-h-screen bg-[#090C0E]">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-between py-8">
        
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
              <ProductCard
                key={product.id}
                title={product.name}
                badge={product.tag}
                image={product.image}
                category={product.category}
                price={product.price}
                originalPrice={product.price ? Math.round(product.price * 1.25) : null}
                rating={product.rating}
                specs={product.specs}
                inCartQty={inCartQty}
                onAddToCart={() => addToCart(product)}
                onUpdateQuantity={(delta) => updateQuantity(product.id, delta)}
                className="min-w-[340px] md:min-w-[420px] h-full shrink-0"
              />
            );
          })}
        </div>

        {/* Bottom Progress Bar & Floating Cart Trigger */}
        <div className="px-6 md:px-12 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <span className="text-xs font-mono text-[#8A94A0] uppercase">SWIPE ENGINE</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00F0FF] to-[#FF2E4C] transition-all duration-150"
                style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
              />
            </div>
          </div>

          <button 
            onClick={() => setCartOpen(true)}
            className="relative px-6 py-3 rounded-2xl bg-[#12161A] border border-[#FF2E4C]/50 hover:border-[#FF2E4C] text-white text-xs font-extrabold font-mono uppercase tracking-wider flex items-center gap-3 shadow-[0_0_25px_rgba(255,46,76,0.3)] transition-all cursor-pointer"
          >
            <ShoppingBag size={18} className="text-[#FF2E4C]" />
            <span>MY CART ({totalItemsCount})</span>
            {totalItemsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF2E4C] text-white text-[10px] font-bold">
                ₹{totalPrice.toLocaleString()}
              </span>
            )}
          </button>
        </div>

        {/* Sliding Cart Drawer Modal */}
        {cartOpen && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex justify-end">
            <div className="w-full max-w-md bg-[#12161A] border-l border-white/10 h-full p-6 flex flex-col justify-between animate-slideLeft shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-[#FF2E4C]" size={20} />
                    <h3 className="text-xl font-black font-heading text-white uppercase">YOUR SUPPLEMENT CART</h3>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="text-[#8A94A0] hover:text-white p-1">
                    <X size={22} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 text-[#8A94A0] font-mono text-sm">
                    Your cart is currently empty.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="p-4 rounded-2xl bg-[#090C0E] border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white uppercase line-clamp-1">{item.name}</h4>
                          <span className="text-xs font-mono text-[#FF2E4C]">₹{item.price.toLocaleString()} x {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-[#12161A] text-white flex items-center justify-center">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono font-bold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-[#12161A] text-white flex items-center justify-center">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-sm font-mono">
                    <span className="text-[#8A94A0]">TOTAL AMOUNT:</span>
                    <span className="text-2xl font-black text-white font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,30,39,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={15} />
                    <span>Proceed to My Cart & Checkout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
