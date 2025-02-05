// Import modules
const express = require('express');
const { createAuthMiddleware } = require('../utils')
const API = require('../controller/sessionApi');

const customerRouter = express.Router();
customerRouter.use(createAuthMiddleware(new Set(["admin", "customer"])));
const customerAndTrainerRouter = express.Router();
customerAndTrainerRouter.use(createAuthMiddleware(new Set(["admin", "customer", "trainer"])));
const adminRouter = express.Router();
adminRouter.use(createAuthMiddleware(new Set(["admin"])));

customerRouter.post('/', API.createSession);
adminRouter.get('/', API.fetchAllSessions);
customerAndTrainerRouter.get("/:id", API.fetchSessionBy_Id)
customerRouter.delete('/:id', API.deleteSession);

const router = express.Router();
router.use('/', adminRouter);
router.use('/', customerRouter);
router.use('/', customerAndTrainerRouter);

module.exports = router;