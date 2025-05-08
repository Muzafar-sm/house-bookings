const House = require('../models/House');
const asyncHandler = require('express-async-handler');
const path = require('path');
const geocoder = require('../utils/geocoder');

// @desc    Get all houses
// @route   GET /api/houses
// @access  Public
exports.getHouses = asyncHandler(async (req, res) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = House.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await House.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const houses = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: houses.length,
    pagination,
    data: houses
  });
});

// @desc    Get single house
// @route   GET /api/houses/:id
// @access  Public
exports.getHouse = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);

  if (!house) {
    return res.status(404).json({
      success: false,
      error: 'House not found'
    });
  }

  res.status(200).json({
    success: true,
    data: house
  });
});

// @desc    Create new house
// @route   POST /api/houses
// @access  Private
exports.createHouse = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.owner = req.user.id;

  const house = await House.create(req.body);

  res.status(201).json({
    success: true,
    data: house
  });
});

// @desc    Update house
// @route   PUT /api/houses/:id
// @access  Private
exports.updateHouse = asyncHandler(async (req, res) => {
  let house = await House.findById(req.params.id);

  if (!house) {
    return res.status(404).json({
      success: false,
      error: 'House not found'
    });
  }

  // Make sure user is house owner
  if (house.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to update this house'
    });
  }

  house = await House.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: house
  });
});

// @desc    Delete house
// @route   DELETE /api/houses/:id
// @access  Private
exports.deleteHouse = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);

  if (!house) {
    return res.status(404).json({
      success: false,
      error: 'House not found'
    });
  }

  // Make sure user is house owner
  if (house.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to delete this house'
    });
  }

  await house.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get houses within a radius
// @route   GET /api/houses/radius/:zipcode/:distance
// @access  Private
exports.getHousesInRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const houses = await House.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res.status(200).json({
    success: true,
    count: houses.length,
    data: houses
  });
});

// @desc    Upload photo for house
// @route   PUT /api/houses/:id/photo
// @access  Private
exports.housePhotoUpload = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);

  if (!house) {
    return res.status(404).json({
      success: false,
      error: 'House not found'
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      error: 'Please upload a file'
    });
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return res.status(400).json({
      success: false,
      error: 'Please upload an image file'
    });
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      error: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    });
  }

  // Create custom filename
  file.name = `photo_${house._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        error: 'Problem with file upload'
      });
    }

    await House.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
}); 