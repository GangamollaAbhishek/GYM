const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Membership', 'Supplements', 'Coaching', 'Renewal'],
      default: 'Membership',
    },
    planOrItem: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'Card (Online)',
    },
    paymentStatus: {
      type: String,
      default: 'Paid',
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
