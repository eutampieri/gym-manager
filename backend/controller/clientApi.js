const Client = require('../models/clientModel');

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD
// find returns an array of objects

module.exports = class API {

    static async fetchAllClients(req, res) {
        try {
                const user = await Client.find({}, null, null).exec();
                res.status(200).json(user);

        } catch (error) {
            res.status(404).json({ message: error.message })
        } finally {
        }

    }


    static async fetchClientByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await Client.findOne({username: username}, null, null).exec();
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async isClientIdPresent(req, res) {
        const id = req.params.id;
        try {
            const client = await Client.findOne({ id: id }, null, null).exec();
            if(client) {
                res.status(200).json(true);
            }
            else {
                res.status(200).json(false);
            }
        } catch (error) {
            res.status(404).json({message: error.message});
        } finally {
        }
    }



    static async createClient(req, res) {
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
            await Lock.updateOne({id: 1}, { available: true }, null);
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
            await Lock.updateOne({id: 1}, { available: true }, null);
        }
    }

    static async updateClient(req, res) {
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



    static async deleteClient(req, res) {
        const username = req.body.username;
        try {
            await Client.findOneAndDelete({username:username}, null);
            res.status(200).json({ message: 'Client deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllClientCourses(req, res) {
        try {
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).exec();
            if (!client) {
                return res.status(404).json({message: 'Client not found'});
            }
            res.status(200).json(client.courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllClientSessions(req, res) {
        try {
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.status(200).json(client.sessions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async deleteClientCourse(req, res) {
        try {
            const id = req.params.id;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('courses').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const indexToRemove = client.courses.findIndex(course => course.id === parseInt(id));
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
            const id = req.params.id;
            const username = req.params.username;
            const client = await Client.findOne({username: username}, null, null).populate('sessions').exec();
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const indexToRemove = client.sessions.findIndex(session => session.id === parseInt(id));

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

    static async addClientCourseById(req, res) {
        try {
            const id = req.params.id;
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

    static async addClientSessionById(req, res) {
        try {
            const id = req.params.id;
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