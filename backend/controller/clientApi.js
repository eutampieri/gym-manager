const Client = require('../models/clientModel');
const Course = require('../models/courseModel');
const idProjection = require('./idProjection');
const { hash } = require('@node-rs/argon2');

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD
// find returns an array of objects

module.exports = class API {
    static async createCustomer(req, res) {
        const customer = req.body;
        customer.password = await hash(customer.password);
        try {
            const userAlreadyPresent = await Client.findOne({ username: req.body.username }, idProjection(Client), null).exec();
            if (!userAlreadyPresent) {
                await Client.create(customer, null);
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
            const user = await Client.find({}, idProjection(Client), null).exec();
            res.status(200).json(user);

        } catch (error) {
            res.status(404).json({ message: error.message })
        } finally {
        }

    }


    static async fetchCustomerByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await Client.findOne({ username: username }, idProjection(Client), null).exec();
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
        const id = req.params.id;
        const { username, firstName, lastName, password, email, phoneNumber, dateOfBirth, address } = req.body;

        try {
            const updateFields = {}; // Object that will contain only the fields to update

            // Check and add non-empty fields to the update object
            if (password) updateFields.password = await hash(password);
            if (email) updateFields.email = email;
            if (phoneNumber) updateFields.phoneNumber = phoneNumber;
            if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
            if (address) updateFields.address = address;
            if (username) updateFields.username = username;
            if (firstName) updateFields.firstName = firstName;
            if (lastName) updateFields.lastName = lastName;

            // Perform the update only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                await Client.updateOne({ _id: id }, updateFields, null);
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
                {
                    $pull: { 'schedule.$[].participants': id },
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
                return res.status(404).json({ message: 'Client not found' });
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
}
