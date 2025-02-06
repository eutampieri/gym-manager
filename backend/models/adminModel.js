import { Schema, model } from 'mongoose';

// Definition of the schema for the client model
const adminSchema = new Schema({
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
    hasFullPrivileges: {
        type: Boolean,
        required: true
    }

});

/* Here are some of the main functions offered by Mongoose:
Model: The mongoose.model() method allows you to define and create models for the database collections.
Schema: The mongoose.Schema module allows you to define the structure of documents in the database. You can specify field types, validation constraints, and other options.
Database connection: Mongoose allows you to establish a connection to the MongoDB database via the mongoose.connect() method.
CRUD operations: Mongoose provides methods to perform CRUD (Create, Read, Update, Delete) operations on database documents, such as Model.create(), Model.find(), Model.findOne(), Model.updateOne(), Model.deleteOne(), etc.
Advanced query methods: Mongoose offers many query methods to perform advanced searches in the database, such as Model.find(), Model.findOne(), Model.findById(), Model.updateMany(), Model.deleteMany(), etc.
*/

// Creation of the client model
export default model("Admin", adminSchema)
