const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    salonID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon', // Reference to Salon model
        required: true,
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // Reference to Service model
        required: true,
    },
    date: {
        type: string, // e.g., "2024-07-15"
        required: true,
    },
    time: {
        type: String, // e.g., "14:30"
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    }
});

// A compound index ensures you can't create duplicate slots for the same time at the same salon
slotSchema.index({ salonId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);