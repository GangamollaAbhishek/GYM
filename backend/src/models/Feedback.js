const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
    customerAvatar: {
      type: String,
      default: '',
    },
    customerPlan: {
      type: String,
      default: 'VIP Obsidian Access',
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    trainerName: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Trainer Consultation',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: '',
    },
    replyAuthor: {
      type: String,
      default: '',
    },
    replyDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Archived'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
