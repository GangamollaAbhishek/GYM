const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dffwkwxzb',
  api_key: process.env.CLOUDINARY_API_KEY || '232753235873118',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'JAFEXo7-gx6UzB67ZoTLpUKxdXA',
});

module.exports = cloudinary;
