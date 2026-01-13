const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 1. Basic Identity
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

  instagramId: { type: String, default: "" },

  // 2. The "Healing Tree" Game Logic 🌳
  treeState: {
    level: { 
      type: Number, 
      default: 1 // Level 1 = Seed
    },
    waterPoints: { 
      type: Number, 
      default: 0 // Points jo diary likhne se badhenge
    },
    lastWatered: { 
      type: Date, 
      default: null 
    }
  },

  // 3. The Locked Reward (Instagram Connection) 🔒
  lockedConnection: {
    targetName: { type: String, default: '' }, // e.g., "Crush" or "Ex-Bestfriend"
    targetId: { type: String, default: '' },   // e.g., Instagram Username
    isUnlocked: { type: Boolean, default: false } // Default locked
  },

  // 4. Diary Entries Link
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal'
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);