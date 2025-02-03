const Trainer = require('../models/trainerModel');

const Client = require("../models/clientModel");

//API RESTFUL CRUD CON LOCK PER LA GESTIONE DELLA MUTUA ESCLUSIONE
// le funzioni di Mongoose sono CRUD

module.exports = class API {

    static async fetchAllTrainers(req, res) {
        try {
            const trainers = await Trainer.find({}, null, null).exec();
            // trainers array
            res.status(200).json(trainers);
        } catch (error) {
            res.status(404).json({message: error.message})
        } finally {
        }
    }

    static async fetchTrainerByUsername(req, res) {
        const username = req.params.username;
        try {
            const trainer = await Trainer.findOne({username: username}, null, null).exec();
            res.status(200).json(trainer);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }



    static async createTrainer(req, res) {
        const trainer = req.body;
        console.log(req.body);
        try {
            const trainerAlreadyPresent = await Trainer.findOne({username: req.body.username}, null, null).exec();

            if (!trainerAlreadyPresent) {
                await Trainer.create(trainer, null);
                res.status(201).json({ message: 'Trainer created successfully' });
            }
            else {
                res.status(500).json({ message: "Trainer already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }



    static async updateTrainer(req, res) {
        const username = req.body.username;
        const { password, email, phoneNumber, courses, sessions} = req.body; // Extract the fields to update

        try {
            const updateFields = {}; // Object that will contain only the fields to update
            // Check and add non-empty fields to the update object
            if (password) updateFields.password = password;
            if (email) updateFields.email = email;
            if (phoneNumber) updateFields.phoneNumber = phoneNumber;
            if (courses) updateFields.courses = courses;
            if (sessions) updateFields.sessions = sessions;

            // Perform the update only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                await Trainer.updateOne({ username: username }, updateFields, null);
                res.status(200).json({ message: 'Trainer updated successfully' });
            } else {
                res.status(400).json({ message: 'No fields to update' });
            }

        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async deleteTrainer(req, res) {
        const username = req.params.username;
        try {
            const trainer = await Trainer.findOneAndDelete({username:username}, null);
            if (!trainer) {
                return res.status(404).json({message: 'Trainer not found'});
            }
            res.status(200).json({ message: 'Trainer deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllTrainerCourses(req, res) {
        const username = req.params.username;
        try {
            const trainer = await Trainer.findOne({username: username}, null, null).exec();
            if (!trainer) {
                return res.status(404).json({message: 'Trainer not found'});
            }
            res.status(200).json(trainer.courses);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllTrainerSessions(req, res) {
        const username = req.params.username;
        try {
            const trainer = await Trainer.findOne({username: username}, null, null).exec();
            if (!trainer) {
                return res.status(404).json({message: 'Trainer not found'});
            }
            res.status(200).json(trainer.sessions);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }


    static async addTrainerCourse(req, res) {
        try {
            const trainerId = req.params.trainerId;
            const courseId = req.params.courseId;
            const trainer = await Trainer.findById(trainerId, null, null).populate('courses').exec();

            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            if (trainer.courses.some(course => course._id === parseInt(courseId))) {
                return res.status(400).json({ message: 'Course already added to trainer' });
            }
            // Add course to trainer
            trainer.courses.push(courseId);
            await Trainer.updateOne({_id:trainerId}, { $set:{ courses: trainer.courses }}, null);
            res.status(200).json(trainer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }


    static async deleteTrainerCourse(req, res) {
        try {
            const trainerId = req.params.trainerId;
            const courseId = req.params.courseId;

            const trainer = await Trainer.findOne({_id: trainerId}, null, null).populate("courses").exec();

            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            const indexToRemove = trainer.courses.findIndex(course => course._id === parseInt(courseId));

            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            // Remove the course from the trainer's courses array
            trainer.courses.splice(indexToRemove, 1);
            await Trainer.updateOne({id:trainerId}, { $set:{ courses: trainer.courses }}, null);
            res.status(200).json({ message: 'Course removed from trainer successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async fetchTrainerIdByUsername(req, res) {
        try {
            const username = req.params.username;
            const trainer = await Trainer.findOne({username: username}, null, null).exec();
            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            res.status(200).json(trainer._id);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }


    // SAME AS DELETETRAINERSESSION BUT USING GET INSTEAD OF POST
    static async deleteTrainerSessionBy_Id(req, res) {
        try {

            const id = req.params.id;
            const username = req.params.username;

            const trainer = await Trainer.findOne({username: username}, null, null).populate('sessions').exec();

            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }

            const indexToRemove = trainer.sessions.findIndex(session => session._id === parseInt(id));
            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Trainer not found' });
            }

            // Remove the session from the trainer's sessions array
            trainer.sessions.splice(indexToRemove, 1);
            await Trainer.updateOne({username:username}, { $set:{ sessions: trainer.sessions }}, null);
            res.status(200).json({ message: 'Session removed from trainer successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    // SAME AS ADDTRAINERSESSION BUT USING GET INSTEAD OF POST
    static async addTrainerSessionBy_Id(req, res) {
        try {
            const id = req.params.id;
            const username = req.params.username;
            const trainer = await Trainer.findOne({username: username}, null, null).populate('sessions').exec();
            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }

            // Check if the course is already present in the trainer's sessions
            if (trainer.sessions.some(session => session._id === parseInt(id))) {
                return res.status(400).json({ message: 'Session already added to trainer' });
            }
            trainer.sessions.push(id);

            await Trainer.updateOne({username:username}, { $set:{ sessions: trainer.sessions }}, null);
            res.status(200).json({ message: 'Session added to trainer successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

     static async fetchTrainerNameBy_Id(req, res) {
            const id = req.params.id;
            try {
                const trainer = await Trainer.findById(id, null, null).exec();
                res.status(200).json(trainer.name);
            } catch (error) {
                res.status(404).json({ message: error.message });
            } finally {
            }
    }
    static async fetchTrainerBy_Id(req, res) {
        const id = req.params.id;
        try {
            const trainer = await Trainer.findById(id, null, null).exec();
            res.status(200).json(trainer);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
}
}