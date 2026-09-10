const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerDisplayId: {
      type: String,
      default: '',
    },
    customerName: {
      type: String,
      required: true,
      default: 'Gym Athlete',
    },
    customerEmail: {
      type: String,
      default: '',
    },
    customerPhone: {
      type: String,
      default: '',
    },
    customerAvatar: {
      type: String,
      default: '',
    },
    customerPlan: {
      type: String,
      default: 'Titan Elite All-Access',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Facility & Equipment',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'High (Urgent)', 'Critical'],
      default: 'Medium',
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    reply: {
      type: String,
      default: 'Ticket logged with Front Desk. Our management team will review and respond promptly.',
    },
    replyBy: {
      type: String,
      default: '',
    },
    replyAt: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: String,
      default: 'Front Desk Receptionist',
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
