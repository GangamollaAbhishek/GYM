import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getUserCartKey = (user) => {
  if (!user) return 'titan_pulse_cart_guest';
  const id = user._id || user.id || user.email;
  return `titan_pulse_cart_${id}`;
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const prevUserRef = useRef(user);

  // Load initial cart for current user state
  const [cart, setCart] = useState(() => {
    try {
      if (user) {
        const key = getUserCartKey(user);
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load user cart:', e);
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Switch/sync cart whenever the active user changes (login, logout, switch user)
  useEffect(() => {
    prevUserRef.current = user;

    if (!user) {
      // User logged out: immediately reset cart in UI & memory
      setCart([]);
      try {
        localStorage.removeItem('titan_pulse_cart_guest');
      } catch (e) {}
      return;
    }

    // User logged in / changed: load this specific user's cart from localStorage
    try {
      const userKey = getUserCartKey(user);
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
          return;
        }
      }
      setCart([]);
    } catch (e) {
      console.warn('Failed to load user cart on auth change:', e);
      setCart([]);
    }
  }, [user]);

  // Persist current cart changes to the active user's storage key
  useEffect(() => {
    if (!user) return;
    try {
      const userKey = getUserCartKey(user);
      localStorage.setItem(userKey, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save user cart to localStorage:', e);
    }
  }, [cart, user]);

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
    if (user) {
      try {
        const userKey = getUserCartKey(user);
        localStorage.removeItem(userKey);
      } catch (e) {}
    }
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

