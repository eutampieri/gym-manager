const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },

    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    startTime: {
        type: String,
        required: true,
        match: /^(09|1[0-8]):00$/ // Regex for the "HH:00" format and hours between 09 and 18
    },
    endTime: {
        type: String,
        required: true,
        match: /^(1[0-9]):00$/ // Regex for the "HH:00" format and hours between 10 and 19
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },

});

module.exports = mongoose.model("Session", sessionSchema)
