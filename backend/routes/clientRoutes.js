const express = require('express')
const API = require('../controller/clientApi')
const { createAuthMiddleware } = require('../utils')

const customerRouter = express.Router();
customerRouter.use(createAuthMiddleware(new Set(["admin", "customer"])));
const adminRouter = express.Router();
adminRouter.use(createAuthMiddleware(new Set(["admin"])));
const trainerRouter = express.Router();
trainerRouter.use(createAuthMiddleware(new Set(["admin", "trainer"])));

adminRouter.post("/", API.createCustomer)
adminRouter.get("/", API.fetchAllCustomers)
adminRouter.put("/", API.updateCustomer)
adminRouter.delete("/:id", API.deleteCustomer)
trainerRouter.get("/:id", API.fetchCustomerBy_Id)
customerRouter.get("/:id/sessions", API.fetchAllCustomerSessions)
customerRouter.get("/:id/courses", API.fetchAllCustomerCourses)


const router = express.Router();
router.use('/', adminRouter);
router.use('/', trainerRouter);
router.use('/', customerRouter);

module.exports = router