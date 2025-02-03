// creation of the client model in the database
// use models to interact with the database
// to modify clients, I will use Client (module.exports = Client)
const mongoose = require('mongoose');

// Definition of the schema for the client model
const clientSchema = new mongoose.Schema({
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    fiscalCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: false
        },
        dayOfWeek: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        startTime: {
            type: String,
            required: true,
            match: /^(09|1[0-8]):00$/ // Regex per il formato "HH:00", tra 09 e 18
        }
    }],
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: false
    }]
});

/* Here are some of the main functions offered by Mongoose:
Model: The mongoose.model() method allows you to define and create models for the database collections.
Schema: The mongoose.Schema module allows you to define the structure of documents in the database. You can specify field types, validation constraints, and other options.
Database connection: Mongoose allows you to establish a connection to the MongoDB database via the mongoose.connect() method.
CRUD operations: Mongoose provides methods to perform CRUD (Create, Read, Update, Delete) operations on database documents, such as Model.create(), Model.find(), Model.findOne(), Model.updateOne(), Model.deleteOne(), etc.
Advanced query methods: Mongoose offers many query methods to perform advanced searches in the database, such as Model.find(), Model.findOne(), Model.findById(), Model.updateMany(), Model.deleteMany(), etc.
*/

// Creation of the client model
module.exports = mongoose.model("Client", clientSchema)
