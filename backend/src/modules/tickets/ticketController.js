const mongoose = require('mongoose');
const Ticket = require('../../models/Ticket');

// POST /api/tickets - Customer raises a support/service ticket
const createTicket = async (req, res) => {
  try {
    const {
      ticketId,
      customerId,
      customerDisplayId,
      customerName,
      customerEmail,
      customerPhone,
      customerAvatar,
      customerPlan,
      subject,
      category,
      priority,
      description,
      status,
      reply,
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Ticket Subject and Description are required fields.',
      });
    }

    const uniqueTicketId =
      ticketId ||
      `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = new Ticket({
      ticketId: uniqueTicketId,
      customerId: customerId && mongoose.isValidObjectId(customerId) ? customerId : null,
      customerDisplayId: customerDisplayId || '',
      customerName: customerName || 'Gym Athlete',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      customerAvatar: customerAvatar || '',
      customerPlan: customerPlan || 'Titan Elite All-Access',
      subject: subject.trim(),
      category: category || 'Facility & Equipment',
      priority: priority || 'Medium',
      description: description.trim(),
      status: status || 'Open',
      reply: reply || 'Ticket logged with Front Desk. Our management team will review and respond promptly.',
      replyBy: '',
      replyAt: '',
      assignedTo: 'Front Desk Receptionist',
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    await newTicket.save();

    console.log(`🎫 [Support Ticket API] New ticket logged: ${newTicket.ticketId} by ${newTicket.customerName} (${newTicket.subject}) -> Synced to Receptionist Dashboard.`);

    return res.status(201).json({
      status: 'success',
      message: 'Support ticket raised successfully and dispatched to Reception Desk!',
      data: {
        id: newTicket.ticketId,
        _id: newTicket._id,
        ticketId: newTicket.ticketId,
        customerId: newTicket.customerId,
        customerDisplayId: newTicket.customerDisplayId,
        customerName: newTicket.customerName,
        customerEmail: newTicket.customerEmail,
        customerPhone: newTicket.customerPhone,
        customerAvatar: newTicket.customerAvatar,
        customerPlan: newTicket.customerPlan,
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        description: newTicket.description,
        status: newTicket.status,
        reply: newTicket.reply,
        replyBy: newTicket.replyBy,
        replyAt: newTicket.replyAt,
        assignedTo: newTicket.assignedTo,
        date: newTicket.date,
        time: newTicket.time,
        createdAt: newTicket.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create support ticket: ' + (error.message || 'Server error'),
    });
  }
};

// GET /api/tickets - Retrieve all support tickets (for Receptionist & Admin)
const getAllTickets = async (req, res) => {
  try {
    const { status, category, priority, customerId, email } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (customerId) {
      query.$or = [
        { customerId: mongoose.isValidObjectId(customerId) ? customerId : null },
        { customerDisplayId: customerId },
      ];
    }
    if (email) {
      query.customerEmail = email;
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean().exec();

    const formatted = tickets.map((t) => ({
      id: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
      _id: t._id,
      ticketId: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
      customerId: t.customerId,
      customerDisplayId: t.customerDisplayId,
      customerName: t.customerName,
      customerEmail: t.customerEmail,
      customerPhone: t.customerPhone,
      customerAvatar: t.customerAvatar,
      customerPlan: t.customerPlan,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      description: t.description,
      status: t.status,
      reply: t.reply,
      replyBy: t.replyBy,
      replyAt: t.replyAt,
      assignedTo: t.assignedTo,
      date: t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
      time: t.time || (t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve support tickets: ' + (error.message || 'Server error'),
    });
  }
};

// GET /api/tickets/my - Retrieve authenticated customer's tickets
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const userEmail = req.user.email;

    const queryConditions = [];
    if (userId && mongoose.isValidObjectId(userId)) {
      queryConditions.push({ customerId: userId });
    }
    if (userEmail) {
      queryConditions.push({ customerEmail: userEmail });
    }

    const tickets = await Ticket.find({ $or: queryConditions.length > 0 ? queryConditions : [{ customerEmail: userEmail }] })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      count: tickets.length,
      data: tickets.map((t) => ({
        id: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
        _id: t._id,
        ticketId: t.ticketId || `TCK-${String(t._id).slice(-4)}`,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        description: t.description,
        status: t.status,
        reply: t.reply,
        replyBy: t.replyBy,
        replyAt: t.replyAt,
        assignedTo: t.assignedTo,
        date: t.date,
        time: t.time,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching customer tickets:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tickets: ' + (error.message || 'Server error'),
    });
  }
};

// PUT /api/tickets/:id - Update ticket status / reply / assigned resolution
const updateTicket = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { status, reply, replyBy, priority, assignedTo, category } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (reply !== undefined) {
      updateFields.reply = reply;
      updateFields.replyBy = replyBy || 'Front Desk Concierge';
      updateFields.replyAt = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (replyBy) updateFields.replyBy = replyBy;
    if (priority) updateFields.priority = priority;
    if (assignedTo) updateFields.assignedTo = assignedTo;
    if (category) updateFields.category = category;

    const updated = await Ticket.findOneAndUpdate(
      {
        $or: [
          { ticketId: targetId },
          { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
        ],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Support ticket not found.',
      });
    }

    console.log(`🎫 [Support Ticket API] Ticket ${updated.ticketId} updated -> Status: ${updated.status}`);

    return res.status(200).json({
      status: 'success',
      message: `Ticket ${updated.ticketId} updated successfully.`,
      data: {
        id: updated.ticketId,
        _id: updated._id,
        ticketId: updated.ticketId,
        customerId: updated.customerId,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        customerPhone: updated.customerPhone,
        subject: updated.subject,
        category: updated.category,
        priority: updated.priority,
        description: updated.description,
        status: updated.status,
        reply: updated.reply,
        replyBy: updated.replyBy,
        replyAt: updated.replyAt,
        assignedTo: updated.assignedTo,
        date: updated.date,
        time: updated.time,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update ticket: ' + (error.message || 'Server error'),
    });
  }
};

// DELETE /api/tickets/:id - Delete ticket
const deleteTicket = async (req, res) => {
  try {
    const targetId = req.params.id;
    const deleted = await Ticket.findOneAndDelete({
      $or: [
        { ticketId: targetId },
        { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Support ticket not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Support ticket ${deleted.ticketId} removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete ticket: ' + (error.message || 'Server error'),
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  updateTicket,
  deleteTicket,
};
