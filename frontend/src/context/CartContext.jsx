import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

const INITIAL_DEMO_CART = [
  {
    id: 'prod-iso',
    name: 'PULSEFIT 100% HYDROLYZED WHEY ISOLATE',
    category: 'ADVANCED PROTEIN FORMULA',
    price: 4499,
    rating: 4.98,
    image: '/pulsefit-isolate.jpg',
    tag: 'ULTRA FILTERED HYDROLYZED',
    quantity: 1
  },
  {
    id: 'prod-shaker',
    name: 'PULSEFIT STAINLESS STEEL VACUUM SHAKER',
    category: 'GEAR & DRINKWARE',
    price: 1499,
    rating: 4.96,
    image: '/pulsefit-shaker.jpg',
    tag: '24HR COLD THERMAL',
    quantity: 1
  }
];

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('titan_pulse_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    return INITIAL_DEMO_CART;
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('titan_pulse_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const showCartToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
    showCartToast(`🛒 Added ${product.name} to Cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showCartToast('🗑️ Item removed from cart');
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('titan_pulse_cart');
    } catch (e) {}
  };

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        totalPrice,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
