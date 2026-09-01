import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  DollarSign,
  Smartphone,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  Package,
  Clock,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CompleteOrderButton from './CompleteOrderButton';
import ThermalReceiptPrinter from './ThermalReceiptPrinter';

export default function MyCartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItemsCount, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Payment Mode State (Same as Membership Payment)
  const [activePayMethod, setActivePayMethod] = useState('card');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(null);

  // Card Form & Real-time Validation States
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardNetwork, setCardNetwork] = useState('VISA');
  const [cardErrors, setCardErrors] = useState({});

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Promo Code Handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }
    const code = promoCode.trim().toUpperCase();
    if (code === 'TITAN10' || code === 'PULSE10') {
      const discount = Math.round(totalPrice * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
      showToast('🎉 Promo code applied! 10% discount deducted.');
    } else if (code === 'TITAN20') {
      const discount = Math.round(totalPrice * 0.2);
      setPromoDiscount(discount);
      setPromoApplied(true);
      showToast('🎉 VIP Promo code applied! 20% discount deducted.');
    } else {
      setPromoError('Invalid promo code. Try "TITAN10"');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
  };

  // Card Input Formatters & Validators
  const handleCardHolderChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardHolder(val);
    if (cardErrors.cardHolder && val.trim().length >= 3) {
      setCardErrors((prev) => ({ ...prev, cardHolder: null }));
    }
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    if (raw.startsWith('4')) setCardNetwork('VISA');
    else if (raw.startsWith('5')) setCardNetwork('MASTERCARD');
    else if (raw.startsWith('3')) setCardNetwork('AMEX');
    else if (raw.startsWith('6')) setCardNetwork('RUPAY');
    else setCardNetwork('CARD');

    if (cardErrors.cardNumber && raw.length === 16) {
      setCardErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + ' / ' + raw.slice(2, 4);
    }
    setCardExpiry(raw);
    if (cardErrors.cardExpiry && raw.length === 7) {
      setCardErrors((prev) => ({ ...prev, cardExpiry: null }));
    }
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
    if (cardErrors.cardCvv && raw.length >= 3) {
      setCardErrors((prev) => ({ ...prev, cardCvv: null }));
    }
  };

  const validateCardInputs = () => {
    const errors = {};
    if (!cardHolder.trim() || cardHolder.trim().length < 3) {
      errors.cardHolder = 'Enter full cardholder name (min 3 characters)';
    }
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (!cleanNum || cleanNum.length < 16) {
      errors.cardNumber = 'Enter a valid 16-digit card number';
    }
    const cleanExp = cardExpiry.replace(/\s/g, '');
    if (!cleanExp || cleanExp.length < 5) {
      errors.cardExpiry = 'Enter valid MM/YY expiry';
    } else {
      const parts = cleanExp.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.cardExpiry = 'Invalid month (01-12)';
      } else if (isNaN(year) || year < 26) {
        errors.cardExpiry = 'Card has expired';
      }
    }
    if (!cardCvv || cardCvv.length < 3) {
      errors.cardCvv = 'Enter 3-digit CVV';
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Grand Total Calculation
  const finalPayable = Math.max(0, totalPrice - promoDiscount);

  // Complete Order Callback executed after delivery truck micro-animation completes
  const executeOrderCompletion = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    if (activePayMethod === 'card') {
      const valid = validateCardInputs();
      if (!valid) {
        showToast('Please correct the highlighted card errors.');
        return;
      }
    }

    const orderId = `ORD-TP-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDetails = {
      id: orderId,
      items: [...cart],
      subtotal: totalPrice,
      discount: promoDiscount,
      amount: finalPayable,
      paymentMethod:
        activePayMethod === 'card'
          ? `${cardNetwork} Card ending in ${cardNumber.replace(/\s/g, '').slice(-4) || '4242'}`
          : activePayMethod === 'cash'
          ? 'Cash at Gym Front Desk'
          : activePayMethod === 'upi'
          ? 'UPI / QR Payment'
          : `Netbanking (${selectedBank})`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      customerName: cardHolder || user?.name || 'Athlete Member',
      status: activePayMethod === 'cash' ? 'Pending Front Desk Token Submission' : 'Paid & Confirmed'
    };

    // Save order to localStorage for CustomerDashboard order history
    try {
      const existingOrders = JSON.parse(localStorage.getItem('titan_pulse_orders') || '[]');
      localStorage.setItem('titan_pulse_orders', JSON.stringify([orderDetails, ...existingOrders]));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('titan_order_placed', { detail: orderDetails }));
    } catch (err) {
      console.warn('Error saving order:', err);
    }

    setOrderSuccessModal(orderDetails);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-['Outfit',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] max-w-md p-4 rounded-2xl bg-[#14141E] border border-white/20 text-white text-xs font-semibold shadow-2xl animate-fadeIn flex items-center gap-3">
          <Sparkles size={16} className="text-[#FF1E27] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Supplements & Gear</span>
              <span>/</span>
              <span className="text-[#FF1E27] font-semibold">My Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <ShoppingBag size={28} className="text-[#FF1E27]" />
              <span>Your Athlete Cart</span>
              <span className="px-3 py-1 rounded-full bg-[#FF1E27]/15 text-[#FF1E27] text-xs font-bold font-mono">
                {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}
              </span>
            </h1>
          </div>

          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="p-12 sm:p-16 rounded-3xl bg-[#101017] border border-white/[0.08] text-center space-y-6 max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-[#FF1E27]/10 border border-[#FF1E27]/20 text-[#FF1E27] flex items-center justify-center mx-auto shadow-lg">
              <ShoppingBag size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Cart is Currently Empty</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Explore our scientifically formulated whey isolates, high-stim pre-workouts, and titanium-grade powerlifting gear to power your progression.
              </p>
            </div>
            <Link
              to="/#popular-destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Zap size={16} /> Explore Supplements & Gear
            </Link>
          </div>
        ) : (
          /* Two Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Items Table (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#101017] border border-white/[0.08] shadow-xl space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ITEM DETAILS</span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} /> Clear Entire Cart
                  </button>
                </div>

                <div className="divide-y divide-white/[0.06] space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-20 h-20 rounded-2xl bg-[#090C0E] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.image || '/pulsefit-isolate.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] text-[#FF1E27] font-bold uppercase tracking-wider block font-mono">
                            {item.category || 'NUTRITION & GEAR'}
                          </span>
                          <h3 className="text-sm font-bold text-white truncate max-w-xs">{item.name}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Unit Price:</span>
                            <span className="font-mono font-bold text-white">₹{Number(item.price).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center rounded-xl bg-[#08080C] border border-white/10 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-9 text-center text-xs font-bold font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-emerald-400 block">
                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gym Turnstile Delivery Badge */}
              <div className="p-4 rounded-2xl bg-[#101017] border border-white/[0.08] flex items-center gap-3 text-xs text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="font-semibold text-white block">Express Gym Turnstile Pickup Included</span>
                  <span className="text-[11px] text-slate-400">Collect your packaged supplements & gear directly at the gym front desk upon entrance check-in.</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Customer Membership Payment Interface (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#101017] border border-white/[0.08] shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <h2 className="text-lg font-bold text-white">Order Summary</h2>
                  <span className="text-xs text-slate-400">{totalItemsCount} Total Items</span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-white font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold animate-fadeIn">
                      <span>Promo Discount ({promoCode.toUpperCase()})</span>
                      <span className="font-mono">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>Gym Pickup & Handling</span>
                    <span className="text-emerald-400 font-semibold uppercase">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>GST (18% Included)</span>
                    <span className="font-mono text-slate-400">Included</span>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline text-sm">
                    <span className="font-bold text-white">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#FF1E27]">
                      ₹{finalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  {!promoApplied ? (
                    <form onSubmit={handleApplyPromo} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter Promo Code (e.g. TITAN10)"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090C0E] border border-white/10 text-white text-xs outline-none uppercase font-mono tracking-wider focus:border-[#FF1E27] transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#FF1E27] text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle size={11} /> {promoError}
                        </span>
                      )}
                    </form>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <Check size={14} />
                        <span>Code <strong>{promoCode.toUpperCase()}</strong> applied!</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-slate-400 hover:text-rose-400 text-[11px] transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* SAME PAYMENT INTERFACE AS CUSTOMER MEMBERSHIP PAYMENT     */}
                {/* ========================================================= */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Select Payment Method
                  </span>

                  {/* Payment Mode Selector Tabs */}
                  <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#08080C] border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setActivePayMethod('card')}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                        activePayMethod === 'card'
                          ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard size={13} />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePayMethod('cash')}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                        activePayMethod === 'cash'
                          ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <DollarSign size={13} />
                      <span>Cash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePayMethod('upi')}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                        activePayMethod === 'upi'
                          ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone size={13} />
                      <span>UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePayMethod('netbanking')}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                        activePayMethod === 'netbanking'
                          ? 'bg-gradient-to-r from-[#FF1E27] to-[#E50914] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers size={13} />
                      <span>Netbank</span>
                    </button>
                  </div>

                  {/* MODE 1: CREDIT / DEBIT CARD */}
                  {activePayMethod === 'card' && (
                    <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3.5 text-left animate-fadeIn">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                          <span>Cardholder Name</span>
                          <span className="text-[10px] text-slate-500 font-normal">Full name as on card</span>
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={handleCardHolderChange}
                          placeholder="e.g. Alex Hunter"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs outline-none transition-all mt-1.5 ${
                            cardErrors.cardHolder
                              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                              : 'border-white/10 focus:border-[#FF1E27]'
                          }`}
                        />
                        {cardErrors.cardHolder && (
                          <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fadeIn">
                            <AlertCircle size={12} className="shrink-0" /> {cardErrors.cardHolder}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                          <span>Card Number</span>
                          <span className="text-[10px] text-slate-500 font-normal">16 Digits</span>
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            placeholder="4242 4242 4242 4242"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono tracking-wider outline-none transition-all ${
                              cardErrors.cardNumber
                                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                                : 'border-white/10 focus:border-[#FF1E27]'
                            }`}
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                            {cardNetwork}
                          </span>
                        </div>
                        {cardErrors.cardNumber && (
                          <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fadeIn">
                            <AlertCircle size={12} className="shrink-0" /> {cardErrors.cardNumber}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                            <span>Expiry Date</span>
                            <span className="text-[10px] text-slate-500 font-normal">MM / YY</span>
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={7}
                            placeholder="MM / YY"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono outline-none transition-all mt-1.5 ${
                              cardErrors.cardExpiry
                                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                                : 'border-white/10 focus:border-[#FF1E27]'
                            }`}
                          />
                          {cardErrors.cardExpiry && (
                            <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
                              <AlertCircle size={11} className="shrink-0" /> {cardErrors.cardExpiry}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                            <span>CVV / CVC</span>
                            <span className="text-[10px] text-slate-500 font-normal">3 Digits</span>
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            maxLength={4}
                            placeholder="•••"
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-xs font-mono outline-none transition-all mt-1.5 ${
                              cardErrors.cardCvv
                                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                                : 'border-white/10 focus:border-[#FF1E27]'
                            }`}
                          />
                          {cardErrors.cardCvv && (
                            <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
                              <AlertCircle size={11} className="shrink-0" /> {cardErrors.cardCvv}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: CASH AT GYM FRONT DESK */}
                  {activePayMethod === 'cash' && (
                    <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3.5 text-left animate-fadeIn">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                          <DollarSign size={20} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">Pay with Cash at Front Desk Counter</h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Pay cash directly to the receptionist upon pickup. Your supplements will be packaged and ready at the speed gate turnstile.
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/[0.06] flex items-center justify-between text-xs">
                        <span className="text-slate-400">Cash Order Token:</span>
                        <span className="font-mono text-amber-400 font-bold tracking-wider">
                          #CSH-ORD-{(user?._id || user?.id || '8921').slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* MODE 3: UPI / QR CODE */}
                  {activePayMethod === 'upi' && (
                    <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-4 text-center animate-fadeIn">
                      <div className="inline-block p-2.5 rounded-2xl bg-white shadow-lg">
                        <div className="w-32 h-32 bg-white p-1 rounded-xl flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                            <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                            <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                            <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                            <rect x="40" y="10" width="10" height="20" />
                            <rect x="10" y="40" width="20" height="10" />
                            <rect x="70" y="40" width="20" height="10" />
                            <rect x="40" y="70" width="10" height="20" />
                            <rect x="45" y="45" width="10" height="10" />
                            <rect x="60" y="60" width="15" height="15" />
                            <rect x="25" y="25" width="10" height="10" />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-white">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                        <div className="p-2 rounded-xl bg-[#0A0A0F] border border-white/10 text-xs flex items-center justify-between max-w-xs mx-auto">
                          <span className="text-slate-400 text-[11px]">UPI ID:</span>
                          <span className="text-[#FF1E27] font-mono font-semibold">titanpulse.gym@upi</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 4: NETBANKING */}
                  {activePayMethod === 'netbanking' && (
                    <div className="p-4 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-3 text-left animate-fadeIn">
                      <span className="text-[11px] font-semibold text-slate-300">Select Bank</span>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white">
                        {[
                          { name: 'HDFC Bank', dot: 'bg-blue-600' },
                          { name: 'State Bank of India', dot: 'bg-blue-400' },
                          { name: 'ICICI Bank', dot: 'bg-amber-500' },
                          { name: 'Axis Bank', dot: 'bg-rose-500' },
                          { name: 'Kotak Mahindra', dot: 'bg-red-600' },
                          { name: 'Punjab National Bank', dot: 'bg-yellow-500' }
                        ].map((b) => (
                          <div
                            key={b.name}
                            onClick={() => setSelectedBank(b.name)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              selectedBank === b.name
                                ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white shadow-sm'
                                : 'bg-[#0A0A0F] border-white/10 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${b.dot}`}></div>
                            <span className="truncate text-xs font-medium">{b.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Truck Micro-Interaction Order Button */}
                  <div className="pt-2">
                    <CompleteOrderButton
                      label="Complete Order"
                      amountText={`₹${finalPayable.toLocaleString('en-IN')}`}
                      disabled={cart.length === 0}
                      onComplete={executeOrderCompletion}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>256-bit Encrypted SSL & Turnstile RFID Security</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 3D THERMAL RECEIPT DISPENSER & CONFIRMATION MODAL         */}
      {/* ========================================================= */}
      {orderSuccessModal && (
        <ThermalReceiptPrinter
          orderDetails={orderSuccessModal}
          onClose={() => setOrderSuccessModal(null)}
          onViewOrders={() => {
            setOrderSuccessModal(null);
            navigate('/account?tab=personal&sub=orders');
          }}
        />
      )}
    </div>
  );
}
