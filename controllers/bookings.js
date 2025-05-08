const Booking = require('../models/Booking');
const House = require('../models/House');
const asyncHandler = require('express-async-handler');

// @desc    Get all bookings
// @route   GET /api/bookings
// @route   GET /api/houses/:houseId/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res) => {
  if (req.params.houseId) {
    const bookings = await Booking.find({ house: req.params.houseId });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'house',
    select: 'name description'
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this booking'
    });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Add booking
// @route   POST /api/houses/:houseId/bookings
// @access  Private
exports.addBooking = asyncHandler(async (req, res) => {
  req.body.house = req.params.houseId;
  req.body.user = req.user.id;

  const house = await House.findById(req.params.houseId);

  if (!house) {
    return res.status(404).json({
      success: false,
      error: 'House not found'
    });
  }

  // Check if house is available for the requested dates
  const existingBooking = await Booking.findOne({
    house: req.params.houseId,
    $or: [
      {
        checkIn: { $lte: req.body.checkOut },
        checkOut: { $gte: req.body.checkIn }
      }
    ]
  });

  if (existingBooking) {
    return res.status(400).json({
      success: false,
      error: 'House is not available for the selected dates'
    });
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to update this booking'
    });
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to delete this booking'
    });
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 