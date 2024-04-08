const mongoose = require('mongoose');
const COMMON = require('./COMMIN');

async function connectDB() {
    try {
        await mongoose.connect(COMMON.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;