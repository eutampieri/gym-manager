const express = require('express')
const router = express.Router()
const API = require('../controller/courseApi')

// in the path, before these, there must be /courses
router.get("/", API.fetchAllCourses)
router.get("/names", API.fetchAllCoursesNames)
router.get("/_id/id/:courseName", API.fetchCourse_IdByName)
router.get("/_id/:id", API.fetchCourseBy_Id)
router.get("/name/:courseName", API.fetchCoursesByName)
router.post("/", API.createCourse)
router.post("/update", API.updateCourse)
router.delete("/delete/: courseName", API.deleteCourse)
router.get("/trainer/:courseName", API.fetchCourseTrainer)
router.get("/participants/:courseName", API.fetchCourseParticipants)
router.get("/removeParticipant/:courseName/:username", API.removeParticipantByUsername)
router.get("/addParticipant/:courseName/:clientId", API.addParticipantById)
router.get("/participants/:courseName/:username", API.checkParticipantsByUsername)

module.exports = router