const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    plan: {
      type: String,
      default: 'PRO MEMBERSHIP',
    },
    terminal: {
      type: String,
      default: 'Turnstile Gate Alpha-1',
    },
    timeIn: {
      type: String,
      required: true,
    },
    timeOut: {
      type: String,
      default: '--',
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active Inside', 'Checked Out'],
      default: 'Active Inside',
    },
    verification: {
      type: String,
      default: 'Manual OTP Verified',
    },
    otpCode: {
      type: String,
      default: '',
    },
    checkInTimestamp: {
      type: Date,
      default: Date.now,
    },
    checkOutTimestamp: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
