const express = require('express')
const router = express.Router()
const API = require('../controller/courseApi')

router.post("/", API.createCourse)
router.get("/", API.fetchAllCourses)
router.get("/:id", API.fetchCourseBy_Id)
router.get("/name/:name", API.fetchCourseByName)
router.put("/", API.updateCourse)
router.delete("/:id", API.deleteCourse)
router.get("/:id/bookings", API.fetchCourseBookings)
router.post("/:id/bookings", API.createBooking) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}
router.delete("/:id/bookings", API.deleteBooking) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}

// in the path, before these, there must be /courses
router.get("/names", API.fetchAllCoursesNames)
router.get("/_id/id/:courseName", API.fetchCourse_IdByName)
router.get("/trainer/:courseName", API.fetchCourseTrainer)
router.get("/participants/:courseName", API.fetchCourseParticipants)
router.get("/removeParticipant/:courseName/:username", API.removeParticipantByUsername)
router.get("/participants/:courseName/:username", API.checkParticipantsByUsername)

module.exports = router