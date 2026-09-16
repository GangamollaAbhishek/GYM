const express = require('express');
const router = express.Router();
const attendanceController = require('./controllers/gymAttendanceController');
const membershipController = require('./controllers/gymMembershipController');
const trainerController = require('./controllers/gymTrainerController');
const { authenticateToken, authorizeRoles } = require('../../../middleware/authMiddleware');

// -------------------------------------------------------------
// Gym Attendance & Biometric Turnstile Endpoints
// -------------------------------------------------------------
router.post('/attendance/request-otp', attendanceController.requestOtp);
router.get('/attendance/active-otp/:identifier', attendanceController.getActiveOtp);
router.post('/attendance/verify-otp', attendanceController.verifyOtp);
router.post('/attendance/quick-checkin', attendanceController.quickCheckIn);
router.get('/attendance', attendanceController.getAllAttendance);
router.get('/attendance/customer/:identifier', attendanceController.getCustomerAttendance);
router.get('/attendance/my', authenticateToken, attendanceController.getMyAttendance);
router.put('/attendance/:id/checkout', attendanceController.checkOut);

// -------------------------------------------------------------
// Gym Membership Plans & Renewals
// -------------------------------------------------------------
router.put('/users/:id/membership', authenticateToken, membershipController.updateMembership);

// -------------------------------------------------------------
// Gym Trainers, Coaching Telemetry & Shifts
// -------------------------------------------------------------
const { ROLES } = require('../../../constants/roles');

router.get('/trainers', trainerController.getAllTrainers);
router.put('/users/:id/assign-trainer', authenticateToken, trainerController.assignTrainer);
router.put(
  '/users/:id/coaching-data',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.TRAINER),
  trainerController.updateCoachingData
);
router.post('/users/:id/chat-message', authenticateToken, trainerController.sendChatMessage);
router.put(
  '/users/:id/shift',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER),
  trainerController.updateShift
);

module.exports = router;
