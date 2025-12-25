//This file tells the server: "When someone sends a request to /, run the createBooking function."

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings -> Creates a new booking
router.post('/', bookingController.createBooking);

// GET /api/bookings/check -> Check slot availability
router.get('/check', bookingController.checkAvailability);

module.exports = router;