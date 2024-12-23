const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    }],
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: false
    }],
    id: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("Trainer", trainerSchema)