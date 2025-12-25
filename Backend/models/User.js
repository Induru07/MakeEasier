const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //MongoDB will automatically create a unique _id field of type ObjectId
    name : {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);


