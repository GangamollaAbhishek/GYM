const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gym_super_secret_jwt_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'customer',
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  generateToken,
  JWT_SECRET,
};
