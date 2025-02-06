const express = require('express')
const { wrapMiddleware, adminAuth, trainerAuth, customerAuth, anyAuth } = require('../utils')
const API = require('../controller/trainerApi')

const router = express.Router();

router.post("/", wrapMiddleware(adminAuth, API.createTrainer));
router.get("/", wrapMiddleware(adminAuth, API.fetchAllTrainers));
router.get("/:id", wrapMiddleware(customerAuth, API.fetchTrainerBy_Id));
router.put("/:id", wrapMiddleware(adminAuth, API.updateTrainer));
router.delete("/:id", wrapMiddleware(adminAuth, API.deleteTrainer));
router.get("/:id/courses", wrapMiddleware(trainerAuth, API.fetchAllTrainerCourses));
router.get("/:id/sessions", wrapMiddleware(trainerAuth, API.fetchAllTrainerSessions));
router.get("/:id/availabilities", wrapMiddleware(anyAuth, API.listTrainerAvailability));

module.exports = router