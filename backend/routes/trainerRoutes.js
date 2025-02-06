import { Router } from 'express';
import { wrapMiddleware, adminAuth, trainerAuth, customerAuth, anyAuth } from '../utils.js';
import API from '../controller/trainerApi.js';

const router = Router();

router.post("/", wrapMiddleware(adminAuth, API.createTrainer));
router.get("/", wrapMiddleware(adminAuth, API.fetchAllTrainers));
router.get("/:id", wrapMiddleware(customerAuth, API.fetchTrainerBy_Id));
router.put("/", wrapMiddleware(adminAuth, API.updateTrainer));
router.delete("/:id", wrapMiddleware(adminAuth, API.deleteTrainer));
router.get("/:id/courses", wrapMiddleware(trainerAuth, API.fetchAllTrainerCourses));
router.get("/:id/sessions", wrapMiddleware(trainerAuth, API.fetchAllTrainerSessions));
router.get("/:id/availabilities", wrapMiddleware(anyAuth, API.listTrainerAvailability));

export default router