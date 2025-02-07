import { Schema, model } from 'mongoose';

const trainerSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    }],
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: false
    }],
});

export default model("Trainer", trainerSchema)