const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');
const { authenticateToken, authorizeRoles } = require('../../middleware/authMiddleware');

const { ROLES } = require('../../constants/roles');

router.get('/razorpay-key', paymentController.getRazorpayKey);
router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/', authenticateToken, authorizeRoles(ROLES.ADMIN, ROLES.RECEPTIONIST), paymentController.getAllPayments);

module.exports = router;
