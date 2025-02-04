const Client = require('../models/clientModel');
const Course = require('../models/courseModel');
const Trainer = require('../models/trainerModel');
const Session = require('../models/sessionModel');


// RESTful CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD

module.exports = class API {
    
    static async createSession(req, res) {
        const session = req.body;
        const idTrainer = req.body.trainer;
        const idParticipant = req.body.participant;
        try {
            const sessionAlreadyPresent = await Session.findOne({id: req.body.id }, null, null).exec();
            if (!sessionAlreadyPresent) {
                const newSession = await Session.create(session, null);
                // Aggiunge la sessione al Client
                await Client.updateOne(
                { _id: idParticipant },
                { $push: { sessions: newSession._id } }
                );

               // Aggiunge la sessione al Trainer
               await Trainer.updateOne(
               { _id: idTrainer },
               { $push: { sessions: newSession._id } }
               );
                res.status(201).json({ message: 'Session created successfully' });
            }
            else {
                res.status(500).json({ message: "Session already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllSessions(req, res) {
        try {
            const sessions = await Session.find({}, null, null).exec();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(404).json({message: error.message})
        }
    }

    static async fetchSessionBy_Id(req, res) {
        console.log("fetchSessionBy_Id");
        const id = req.params.id;
        try {
            const session = await Session.findById(id, null, null).exec();
            res.status(200).json(session);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async deleteSession(req, res) {
        try {
            const sessionId = req.params.id;
    
            // Trova la sessione prima di eliminarla per recuperare clientId e trainerId
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }
    
            // Elimina la sessione dal database
            await Session.findOneAndDelete({ _id: sessionId });
    
            // Rimuove la sessione dal Client
            await Client.updateOne(
                { _id: session.participant },
                { $pull: { sessions: sessionId } }
            );
    
            // Rimuove la sessione dal Trainer
            await Trainer.updateOne(
                { _id: session.trainer },
                { $pull: { sessions: sessionId } }
            );
    
            res.status(200).json({ message: "Session deleted successfully" });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
//////////////////////////////////////////////////////////////7

    static async isSessionIdPresent(req, res) {
        const id = req.params.id;
        try {
            const session = await Session.findOne({ id: id }, null, null).exec();
            if(session) {
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
    static async fetchSession_IdById(req, res) {
        console.log("fetchSession_IdById");
        const id = req.params.id;
        try {
            const session = await Session.findOne({id: id}, null, null).exec();
            res.status(200).json(session._id);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchSessionById(req, res) {
        const id = req.params.id;
        try {
            const session = await Session.findOne({id: id}, null, null).exec();
            res.status(200).json(session);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async deleteSessionBy_Id(req, res) {
        const sessionId = req.params.id;
        try {
            await Session.findOneAndDelete({_id:sessionId}, null);
            res.status(200).json({ message: 'Session deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchSessionTrainer(req, res) {
        try {
            const id = req.params.id;
            const session = await Session.findOne({id: id}, null, null).populate('trainer').exec();
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            const trainer = session.trainer;
            res.status(200).json(trainer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async fetchSessionParticipant(req, res) {
        try {
            const id = req.params.id;
            const session = await Session.findOne({id: id}, null, null).populate('participant').exec();
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            const participant = session.participant;
            res.status(200).json(participant);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async nextAvailableId(req, res) {
        try {
            console.log("done");
            const sessions = await Session.find({}, null, null).sort({ id: 1 });
            let nextId = 1;
            for (const session of sessions) {
                if (session.id !== nextId) {
                    // If the current ID does not match the expected next ID, return the expected next ID
                    break;
                }
                nextId++;
            }
            res.json({ nextId });
        } catch (err) {
            console.error("Error fetching next available session ID:", err);
            res.status(500).json({ error: "Internal server error" });
        } finally {
        }
    }
}