const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceID: {
        type: String,
        required: true,
        unique: true,
    },
    salonID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Salon model
        ref: 'Salon',// Reference to Salon model
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'Unisex'],
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    capacity: {// How many seats available for this service at a time
        type: Number,
        required: true,
    }
});


//MediaSourceHandle.exports = mongoose.model('Service', ServiceSchema);
module.exports = mongoose.model('Service', serviceSchema);