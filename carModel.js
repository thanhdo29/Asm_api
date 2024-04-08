const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    ten: {
        type: String,
        required: true
    },
    namSx: {
        type: Number,
    },
    hang: {
        type: String,
        required: true
    },
    gia: {
        type: Number,
    },
    image: {
        type: String,
        default: 'default.jpg' 
    }
});

const CarModel = mongoose.model('car', CarSchema);

module.exports = CarModel;
