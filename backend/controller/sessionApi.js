const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');
const Session = require('../models/sessionModel');
const idProjection = require('./idProjection');

// RESTful CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD

module.exports = class API {

    static async createSession(req, res) {
        const session = req.body;
        const idTrainer = req.body.trainer;
        const idParticipant = req.body.participant;
        const safeIdParticipant = req.user.role === "admin" ? idParticipant : req.user.id;

        try {

            session.participant = safeIdParticipant;

            /* check if session can be created */
            // check in partecipant sessions
            const overlappingParticipantSessions = await Client.find({
                _id: safeIdParticipant,
                'sessions.startTime': session.startTime,
                'sessions.dayOfWeek': session.dayOfWeek
            }, null, null);
            if (overlappingParticipantSessions) {
                return res.status(400).json({ message: 'Cannot create session' });
            }
            // check in trainer sessions
            const overlappingTrainerSessions = await Trainer.find({
                _id: idTrainer,
                'sessions.startTime': session.startTime,
                'sessions.dayOfWeek': session.dayOfWeek
            }, null, null);
            if (overlappingTrainerSessions) {
                return res.status(400).json({ message: 'Cannot create session' });
            }
            // check in trainer courses
            const overlappingTrainerCourses = await Trainer.find({
                _id: idTrainer,
                'courses.schedule.startTime': session.startTime,
                'courses.schedule.dayOfWeek': session.dayOfWeek
            }, null, null);
            if (overlappingTrainerCourses) {
                return res.status(400).json({ message: 'Cannot create session' });
            }

            /* Create session */
            const newSession = await Session.create(session, null);
            // Aggiunge la sessione al Client
            await Client.updateOne(
                { _id: safeIdParticipant },
                { $push: { sessions: newSession._id } }
            );

            // Aggiunge la sessione al Trainer
            await Trainer.updateOne(
                { _id: idTrainer },
                { $push: { sessions: newSession._id } }
            );
            res.status(201).json({ message: 'Session created successfully' });


        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllSessions(req, res) {
        try {
            const sessions = await Session.find({}, idProjection(Session), null).exec();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchSessionBy_Id(req, res) {
        console.log("fetchSessionBy_Id");
        const id = req.params.id;
        try {
            const session = await Session.findById(id, idProjection(Session), null).exec();
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
}