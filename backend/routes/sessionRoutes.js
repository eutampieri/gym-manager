// Import modules
const express = require('express');
const router = express.Router();
const API = require('../controller/sessionApi');

// in the path, before these, there must be /sessions
router.get('/', API.fetchAllSessions);
router.get('/:id', API.fetchSessionById);
router.get("/_id/:id", API.fetchSessionBy_Id)
router.get("/_id/id/:id", API.fetchSession_IdById)
router.post('/', API.createSession);
router.delete('/delete/:id', API.deleteSession);
router.get("/delete/deleteBy_Id/:id", API.deleteSessionBy_Id)
router.get("/trainer/:id", API.fetchSessionTrainer);
router.get("/participant/:id", API.fetchSessionParticipant);
router.get("/checkId/:id", API.isSessionIdPresent)
router.get("/calculate/nextId", API.nextAvailableId)

// Export the router to make it available elsewhere in the application
module.exports = router;