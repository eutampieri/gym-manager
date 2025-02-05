const express = require('express')
const { createAuthMiddleware } = require('../utils')
const API = require('../controller/trainerApi')

const customerRouter = express.Router();
customerRouter.use(createAuthMiddleware(new Set(["admin", "customer"])));
const adminRouter = express.Router();
adminRouter.use(createAuthMiddleware(new Set(["admin"])));
const trainerRouter = express.Router();
trainerRouter.use(createAuthMiddleware(new Set(["admin", "trainer"])));

adminRouter.post("/", API.createTrainer)
adminRouter.get("/", API.fetchAllTrainers)
customerRouter.get("/:id", API.fetchTrainerBy_Id)
adminRouter.put("/", API.updateTrainer)
adminRouter.delete("/:id", API.deleteTrainer)
trainerRouter.get("/:id/courses", API.fetchAllTrainerCourses)
trainerRouter.get("/:id/sessions", API.fetchAllTrainerSessions)

const router = express.Router();
router.use('/', adminRouter);
router.use('/', trainerRouter);
router.use('/', customerRouter);

module.exports = router