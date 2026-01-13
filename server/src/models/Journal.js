const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['Anxious', 'Depressed', 'Angry', 'Happy', 'Neutral', 'Panic'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dailyWin: { type: String, default: "" },       // Choti si jeet
  dailyChallenge: { type: String, default: "" },
  // Agar future mein AI feedback store karna ho
  aiResponse: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);