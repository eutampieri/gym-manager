const express = require('express')
const router = express.Router()
const API = require('../controller/trainerApi')

// in the path, before these, there must be /trainers
router.get("/", API.fetchAllTrainers)
router.get("/username/:username", API.fetchTrainerByUsername)
router.get("/id/:id", API.fetchTrainerById)
router.post("/", API.createTrainer)
router.post("/update", API.updateTrainer)
router.post("/delete", API.deleteTrainer)
router.get("/courses/:username", API.fetchAllTrainerCourses)
router.get("/sessions/:username", API.fetchAllTrainerSessions)
router.get("/courses/add/:id/:courseId", API.addTrainerCourse)
router.get("/courses/delete/:id/:courseId", API.deleteTrainerCourse)
router.get("/trainerId/:username", API.fetchTrainerIdByUsername)
router.get("/sessions/add/:username/:id", API.addTrainerSessionById)
router.get("/sessions/delete/:username/:id", API.deleteTrainerSessionById)
router.get("/checkId/:id", API.isTrainerIdPresent)


module.exports = router