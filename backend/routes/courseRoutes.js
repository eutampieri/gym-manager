import { Router } from 'express';
import API from '../controller/courseApi.js';
import { wrapMiddleware, adminAuth, trainerAuth, customerAuth, anyAuth } from '../utils.js';

const router = Router();

router.post("/", wrapMiddleware(adminAuth, API.createCourse))
router.get("/", wrapMiddleware(anyAuth, API.fetchAllCourses))
router.get("/:id", wrapMiddleware(anyAuth, API.fetchCourseBy_Id))
router.put("/", wrapMiddleware(adminAuth, API.updateCourse))
router.delete("/:id", wrapMiddleware(adminAuth, API.deleteCourse))
router.get("/:id/bookings", wrapMiddleware(trainerAuth, API.fetchCourseBookings))
router.post("/:id/bookings", wrapMiddleware(customerAuth, API.createBooking)) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}
router.delete("/:id/bookings", wrapMiddleware(customerAuth, API.deleteBooking)) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}


export default router