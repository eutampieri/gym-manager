const express = require('express')
const router = express.Router()
const API = require('../controller/courseApi')

// in the path, before these, there must be /courses
router.get("/", API.fetchAllCourses)
router.get("/names", API.fetchAllCoursesNames)
router.get("/:id", API.fetchCourseById)
router.get("/_id/id/:id", API.fetchCourse_IdById)
router.get("/_id/:id", API.fetchCourseBy_Id)
router.get("/name/:name", API.fetchCoursesByName)
router.post("/", API.createCourse)
router.post("/update", API.updateCourse)
router.post("/delete", API.deleteCourse)
router.get("/delete/deleteBy_Id/:id", API.deleteCourseBy_Id)
router.get("/trainer/:id", API.fetchCourseTrainer)
router.get("/participants/:id", API.fetchCourseParticipants)
router.get("/removeParticipant/:id/:username", API.removeParticipantByUsername)
router.get("/addParticipant/:id/:clientId", API.addParticipantById)
router.get("/participants/:id/:username", API.checkParticipantsByUsername)
router.get("/checkId/:id", API.isCourseIdPresent)

module.exports = router