const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',// Reference to User model
        required: true,
    },
    salonID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',// Reference to Salon model
        required: true,
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',// Reference to Service model
        required: true,
    },
    bookingDate: {
        type: String,// e.g., "2024-07-15"
        required: true,
    },
    bookingTime: {
        type: String, // e.g., "14:30"
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'completed', 'canceled'],
        default: 'booked',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Booking', bookingSchema);