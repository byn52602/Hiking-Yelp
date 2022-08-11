const mongoose = require('mongoose');

const HikingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    lengthKM: {
        type: Number,
        required: true
    },
    hours: String,
    description: String,
    image: String
})

const Hiking = mongoose.model('Hiking', HikingSchema);
module.exports = Hiking;