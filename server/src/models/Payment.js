const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String, // e.g., 'Appointment Booking', 'Consultation'
    required: true
  },
  paymentId: {
    type: String, // From payment gateway
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
