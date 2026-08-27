const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'gym_super_secret_jwt_key_2026';

/**
 * Middleware to authenticate requests using a Bearer JWT.
 * Returns 401 Unauthorized if token is missing, invalid, or expired.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. No authorization token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token is empty or invalid.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        status: 'error',
        message: isExpired
          ? 'Authentication session has expired. Please log in again.'
          : 'Invalid authentication token.',
      });
    }

    // Look up the user in database to ensure account is active and role is fresh
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User account not found or deactivated.',
      });
    }

    // Attach user object to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication verification.',
    });
  }
};

/**
 * Middleware to restrict access based on allowed roles.
 * Returns 403 Forbidden if user does not have permission.
 */
const authorizeRoles = (...roles) => {
  const allowed = roles.map((r) => r.toLowerCase().trim());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Authentication required.',
      });
    }

    const userRole = (req.user.role || 'customer').toLowerCase().trim();

    // Admin has master access, or match explicitly allowed roles
    if (userRole === 'admin' || allowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: `Forbidden: Access restricted. Role '${req.user.role}' does not have sufficient permissions.`,
    });
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
