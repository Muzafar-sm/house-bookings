const express = require('express');
const router = express.Router();
const {
  getHouses,
  getHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  getHousesInRadius,
  housePhotoUpload
} = require('../controllers/houses');

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const bookingRouter = require('./bookings');

// Re-route into other resource routers
router.use('/:houseId/bookings', bookingRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(getHousesInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('admin'), housePhotoUpload);

router
  .route('/')
  .get(getHouses)
  .post(protect, authorize('admin'), createHouse);

router
  .route('/:id')
  .get(getHouse)
  .put(protect, authorize('admin'), updateHouse)
  .delete(protect, authorize('admin'), deleteHouse);

module.exports = router; 