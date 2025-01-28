// creation of the course model in the database
// use models to interact with the database
// to modify courses, I will use Course (module.exports = Course)
const mongoose = require('mongoose');

// Definition of the schema for the course model
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
    capacity: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: false
    }]
});


// Creation of the course model
module.exports = mongoose.model("Course", courseSchema)


