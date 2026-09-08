const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    enquiryId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: 'N/A',
      trim: true,
    },
    goal: {
      type: String,
      default: 'Muscle Gain & Strength',
      trim: true,
    },
    source: {
      type: String,
      default: 'Walk-in Visitor',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New Lead', 'Followed Up', 'Trial Booked', 'Converted', 'Closed'],
      default: 'New Lead',
    },
    notes: {
      type: String,
      default: '',
    },
    capturedBy: {
      type: String,
      default: 'Front Desk Receptionist',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
