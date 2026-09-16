const express = require('express');
const router = express.Router();
const uploadController = require('./uploadController');

// Supports POST /api/upload and POST /upload
router.post('/api/upload', uploadController.handleUpload);
router.post('/upload', uploadController.handleUpload);

module.exports = router;
