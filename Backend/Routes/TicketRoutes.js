const express = require('express');
const router = express.Router();
const ticketController = require('../Controllers/TicketController');

// Create a new ticket
router.post('/', ticketController.createTicket);

// Get all tickets (with optional filtering)
router.get('/', ticketController.getAllTickets);

// Get ticket statistics for dashboard
router.get('/stats/dashboard', ticketController.getTicketStats);

// Get a single ticket
router.get('/:id', ticketController.getTicket);

// Update a ticket (only if open) - for user updates
router.patch('/:id', ticketController.updateTicket);

// Update ticket status
router.patch('/:id/status', ticketController.updateTicketStatus);

// Add response to a ticket
router.post('/:id/responses', ticketController.addResponse);

// Assign ticket to an agent
router.patch('/:id/assign', ticketController.assignTicket);

// Archive/close a ticket
router.patch('/:id/archive', ticketController.archiveTicket);

// Delete a ticket (only if open)
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
