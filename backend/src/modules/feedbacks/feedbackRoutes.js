const express = require('express');
const router = express.Router();
const feedbackController = require('./feedbackController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.post('/', authenticateToken, feedbackController.createFeedback);
router.get('/', authenticateToken, feedbackController.getAllFeedbacks);
router.get('/trainer/:trainerId', authenticateToken, feedbackController.getTrainerFeedbacks);
router.put('/:id/reply', authenticateToken, feedbackController.replyFeedback);

module.exports = router;
