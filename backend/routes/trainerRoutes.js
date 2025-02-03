const express = require('express')
const router = express.Router()
const API = require('../controller/trainerApi')

router.post("/", API.createTrainer)
router.get("/", API.fetchAllTrainers)
router.get("/username/:username", API.fetchTrainerByUsername)
router.get("/:id", API.fetchTrainerBy_Id)
router.put("/", API.updateTrainer)
router.delete("/:id", API.deleteTrainer)
router.get("/courses/:id", API.fetchAllTrainerCourses)
router.get("/sessions/:id", API.fetchAllTrainerSessions)

// in the path, before these, there must be /trainers
router.get("/courses/add/:trainerId/:courseId", API.addTrainerCourse)
router.get("/courses/delete/:trainerId/:courseId", API.deleteTrainerCourse)
router.get("/trainerId/:username", API.fetchTrainerIdByUsername)
router.get("/sessions/add/:username/:id", API.addTrainerSessionBy_Id)
router.get("/sessions/delete/:username/:id", API.deleteTrainerSessionBy_Id)
router.get("/trainerName/:id", API.fetchTrainerNameBy_Id)


module.exports = router