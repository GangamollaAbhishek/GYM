import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('titan_token') || null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate the current session token with the backend
  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('titan_token');

    if (!storedToken || storedToken === 'null' || storedToken === 'undefined') {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      const res = await api.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      if (res.data?.status === 'success' && res.data?.data?.user) {
        const verifiedUser = res.data.data.user;
        setUser(verifiedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        localStorage.setItem('titan_user', JSON.stringify(verifiedUser));
        setLoading(false);
        return true;
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (error) {
      console.warn('Session verification failed, resetting auth state:', error.response?.data?.message || error.message);
      localStorage.removeItem('titan_token');
      localStorage.removeItem('titan_user');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  }, []);

  // Validate session on initial mount / app startup
  useEffect(() => {
    checkAuth();

    // Listen for global 401 unauthorized events from Axios interceptors
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', {
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

      if (res.data?.status === 'success' && res.data?.data?.token) {
        const { user: loggedInUser, token: receivedToken } = res.data.data;
        
        localStorage.setItem('titan_token', receivedToken);
        localStorage.setItem('titan_user', JSON.stringify(loggedInUser));

        setToken(receivedToken);
        setUser(loggedInUser);
        setIsAuthenticated(true);

        return { success: true, user: loggedInUser, token: receivedToken };
      } else {
        return {
          success: false,
          message: res.data?.message || 'Login failed. Please check your credentials.',
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to connect to login server. Please try again.';
      return { success: false, message: errorMsg };
    }
  };

  // Signup / Register handler
  const signup = async (userData) => {
    try {
      const res = await api.post('/api/auth/register', {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        phone: (userData.phone || '').trim(),
        password: userData.password.trim(),
      });

      if (res.data?.status === 'success' && res.data?.data?.token) {
        const { user: registeredUser, token: receivedToken } = res.data.data;

        localStorage.setItem('titan_token', receivedToken);
        localStorage.setItem('titan_user', JSON.stringify(registeredUser));

        setToken(receivedToken);
        setUser(registeredUser);
        setIsAuthenticated(true);

        return { success: true, user: registeredUser, token: receivedToken };
      } else {
        return {
          success: false,
          message: res.data?.message || 'Registration failed.',
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration error. Please check your information.';
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem('titan_token');
      localStorage.removeItem('titan_user');
    } catch (e) {
      console.error('Error during logout:', e);
    }
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
