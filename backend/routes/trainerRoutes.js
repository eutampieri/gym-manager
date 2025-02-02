const express = require('express')
const router = express.Router()
const API = require('../controller/trainerApi')

// in the path, before these, there must be /trainers
router.get("/", API.fetchAllTrainers)
router.get("/username/:username", API.fetchTrainerByUsername)
router.post("/", API.createTrainer)
router.post("/update", API.updateTrainer)
router.delete("/delete/:username", API.deleteTrainer)
router.get("/courses/:username", API.fetchAllTrainerCourses)
router.get("/sessions/:username", API.fetchAllTrainerSessions)
router.get("/courses/add/:trainerId/:courseId", API.addTrainerCourse)
router.get("/courses/delete/:trainerId/:courseId", API.deleteTrainerCourse)
router.get("/trainerId/:username", API.fetchTrainerIdByUsername)
router.get("/sessions/add/:username/:id", API.addTrainerSessionBy_Id)
router.get("/sessions/delete/:username/:id", API.deleteTrainerSessionBy_Id)


module.exports = router