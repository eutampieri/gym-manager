const express = require('express')
const API = require('../controller/courseApi')
const { createAuthMiddleware } = require('../utils')

const customerRouter = express.Router();
customerRouter.use(createAuthMiddleware(new Set(["admin", "customer"])));
const customerAndTrainerRouter = express.Router();
customerAndTrainerRouter.use(createAuthMiddleware(new Set(["admin", "customer", "trainer"])));
const adminRouter = express.Router();
adminRouter.use(createAuthMiddleware(new Set(["admin"])));
const trainerRouter = express.Router();
trainerRouter.use(createAuthMiddleware(new Set(["admin", "trainer"])));

adminRouter.post("/", API.createCourse)
customerAndTrainerRouter.get("/", API.fetchAllCourses)
customerAndTrainerRouter.get("/:id", API.fetchCourseBy_Id)
adminRouter.put("/", API.updateCourse)
adminRouter.delete("/:id", API.deleteCourse)
trainerRouter.get("/:id/bookings", API.fetchCourseBookings)
customerRouter.post("/:id/bookings", API.createBooking) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}
customerRouter.delete("/:id/bookings", API.deleteBooking) //prende come body {clientId:"", dayOfWeek: "", startTime: ""}

const router = express.Router();
router.use('/', adminRouter);
router.use('/', trainerRouter);
router.use('/', customerRouter);
router.use('/', customerAndTrainerRouter);

module.exports = router