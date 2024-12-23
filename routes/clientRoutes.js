const express = require('express')
const router = express.Router()
const API = require('../controller/clientApi')

// in the path, before these, there must be /clients
router.get("/", API.fetchAllClients)
router.get("/username/:username", API.fetchClientByUsername)
router.post("/", API.createClient)
router.post("/update", API.updateClient)
router.post("/delete", API.deleteClient)
router.get("/courses/:username", API.fetchAllClientCourses)
router.get("/sessions/:username", API.fetchAllClientSessions)
router.get("/courses/delete/:username/:id", API.deleteClientCourse)
router.get("/sessions/delete/:username/:id", API.deleteClientSession)
router.get("/courses/add/:username/:id", API.addClientCourseById)
router.get("/sessions/add/:username/:id", API.addClientSessionById)
router.get("/sessions/:username/:id", API.checkClientSessions)
router.get("/id/:username", API.fetchClient_IdByUsername)
router.get("/checkId/:id", API.isClientIdPresent)


module.exports = router