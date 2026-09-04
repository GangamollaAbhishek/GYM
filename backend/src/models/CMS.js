const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'landing_cms',
      unique: true,
      index: true,
    },
    brand: {
      name: { type: String, default: 'TITAN•PULSE' },
      subname: { type: String, default: '3D FITNESS SYSTEM' },
      tagline: { type: String, default: 'RISE ABOVE AVERAGE. DOMINATE YOUR LIMITS.' },
      logo: { type: String, default: '' },
    },
    hero: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    horizontalWords: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    exploreEscape: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    supplements: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    equipment: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    memberships: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('CMS', cmsSchema);
