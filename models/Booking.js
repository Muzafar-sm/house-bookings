const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  house: {
    type: mongoose.Schema.ObjectId,
    ref: 'House',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: [true, 'Please add check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please add check-out date']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add total price']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent booking the same house for overlapping dates
BookingSchema.index({ house: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', BookingSchema); 