const express = require('express');
const router = express.Router();
const ticketController = require('./ticketController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.get('/my', authenticateToken, ticketController.getMyTickets);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
