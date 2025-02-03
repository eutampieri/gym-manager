const express = require('express')
const router = express.Router()
const API = require('../controller/clientApi')

// in the path, before these, there must be /clients
router.get("/", API.fetchAllClients)
router.get("/username/:username", API.fetchClientByUsername)
router.post("/", API.createClient)
router.post("/update", API.updateClient)
router.delete("/delete/:username", API.deleteClient)
router.get("/courses/:username", API.fetchAllClientCourses)
router.get("/sessions/:username", API.fetchAllClientSessions)
router.get("/courses/delete/:username/:courseName", API.deleteClientCourse)
router.get("/sessions/delete/:username/:sessionId", API.deleteClientSession)
router.get("/courses/add/:username/:courseId", API.addClientCourseBy_Id)
router.get("/sessions/add/:username/:sessionId", API.addClientSessionBy_Id)
router.get("/sessions/:username/:id", API.checkClientSessions)
router.get("/id/:username", API.fetchClient_IdByUsername)


module.exports = router