const Client = require('../models/clientModel');
const Course = require('../models/courseModel');
const Trainer = require('../models/trainerModel');
const Session = require('../models/sessionModel');

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD
// find returns an array of objects

module.exports = class API {
    static async createCustomer(req, res) {
        const client = req.body;
        try {
            const userAlreadyPresent = await Client.findOne({ username: req.body.username }, null, null).exec();
            if (!userAlreadyPresent) {
                await Client.create(client, null);
                res.status(201).json({ message: 'Client created successfully' });
            }
            else {
                res.status(500).json({ message: "Username already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllCustomers(req, res) {
        try {
                const user = await Client.find({}, null, null).exec();
                res.status(200).json(user);

        } catch (error) {
            res.status(404).json({ message: error.message })
        } finally {
        }

    }


    static async fetchCustomerByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await Client.findOne({username: username}, null, null).exec();
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async fetchCustomerBy_Id(req, res) {
        const id = req.params.id;
        try {
            const user = await Client.findById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }


    static async updateCustomer(req, res) {
        const username = req.body.username;
        const { password, email, phoneNumber, dateOfBirth, address, courses, sessions } = req.body; // Extract the fields to update

        try {
            const updateFields = {}; // Object that will contain only the fields to update

            // Check and add non-empty fields to the update object
            if (password) updateFields.password = password;
            if (email) updateFields.email = email;
            if (phoneNumber) updateFields.phoneNumber = phoneNumber;
            if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
            if (address) updateFields.address = address;
            if (courses) updateFields.courses = courses;
            if (sessions) updateFields.sessions = sessions;
            // Perform the update only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                await Client.updateOne({ username: username }, updateFields, null);
                res.status(200).json({ message: 'Client updated successfully' });
            } else {
                res.status(400).json({ message: 'No fields to update' });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }



    static async deleteCustomer(req, res) {
        const id = req.params.id;
        try {
            // Trova il cliente per ottenere i suoi corsi
            const client = await Client.findById(id);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
    
            // Rimuove il client dai participants dei corsi in cui è registrato
            await Course.updateMany(
                { 'schedule.participants': id },
                { $pull: { 'schedule.$[].participants': id }, 
                  $inc: { 'schedule.$[].availableSpots': 1 }
                }
            );
    
            // Elimina il cliente dal database
            await Client.findOneAndDelete({ _id: id });
    
            res.status(200).json({ message: 'Client deleted successfully and removed from all courses' });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    

    static async fetchAllCustomerCourses(req, res) {
        try {
            const id = req.params.id;
            const client = await Client.findOne({ _id: id })
            .populate({
                path: 'courses.course',
                select: 'name description capacity trainer'
            })
            .exec();
            if (!client) {
                return res.status(404).json({message: 'Client not found'});
            }
            res.status(200).json(client.courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllCustomerSessions(req, res) {
        try {
            const id = req.params.id;
    
            // Trova il cliente e popola le sessioni con tutti gli attributi
            const client = await Client.findOne({ _id: id })
                .populate({
                    path: 'sessions',
                    populate: {
                        path: 'trainer participant', // Popola trainer e participant se servono
                        select: 'username firstName lastName email phoneNumber' // Se vuoi solo alcune info di trainer e participant
                    }
                })
                .exec();
    
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
    
            res.status(200).json(client.sessions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    

///////////////////////////////////////////////////////////////////////////////////////
    static async deleteClientCourse(req, res) {
        try {
            const courseName = req.params.courseName;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('courses').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const indexToRemove = client.courses.findIndex(course => course.name === courseName);
            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Course not found' });
            }
            // Remove the course from the client's courses array
            client.courses.splice(indexToRemove, 1);
            await Client.updateOne({username:username}, { $set:{ courses: client.courses }}, null);
            res.status(200).json({ message: 'Course removed from client successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async deleteClientSession(req, res) {
        try {
            const id = req.params.sessionId;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('sessions').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const indexToRemove = client.sessions.findIndex(session => session._id === parseInt(id));

            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Session not found' });
            }
            // Remove the session from the client's sessions array
            client.sessions.splice(indexToRemove, 1);
            await Client.updateOne({username:username}, { $set:{ sessions: client.sessions }}, null);
            res.status(200).json({ message: 'Session removed from client successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async addClientCourseBy_Id(req, res) {
        try {
            const id = req.params.courseId;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('courses').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            // Check if the course is already present in the client's courses
            if (client.courses.some(course => course._id === parseInt(id))) {
                return res.status(400).json({ message: 'Course already added to client' });
            }
            client.courses.push(id);
            await Client.updateOne({username:username}, { $set:{ courses: client.courses }}, null);
            res.status(200).json({ message: 'Course added to client successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async addClientSessionBy_Id(req, res) {
        try {
            const id = req.params.sessionId;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('sessions').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            // Check if the course is already present in the client's courses
            if (client.sessions.some(session => session._id === parseInt(id))) {
                return res.status(400).json({ message: 'Session already added to client' });
            }
            client.sessions.push(id);
            await Client.updateOne({username:username}, { $set:{ sessions: client.sessions }}, null);
            res.status(200).json({ message: 'Session added to client successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async checkClientSessions(req, res) {
        try {
            const id = req.params.id;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('sessions').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            // Find the participant with the specified username
            const sessionPresent = client.sessions.some(session => session._id === parseInt(id));
            res.status(200).json(sessionPresent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }


    static async fetchClient_IdByUsername(req, res) {
        try {
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.status(200).json(client._id);
        } catch (error) {
            res.status(500).json({ message: error.message });

        } finally {
        }
    }

}