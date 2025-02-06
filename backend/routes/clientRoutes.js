const express = require('express')
const API = require('../controller/clientApi')
const { wrapMiddleware, adminAuth, trainerAuth, customerAuth } = require('../utils')

const router = express.Router();

router.post("/", wrapMiddleware(adminAuth, API.createCustomer))
router.get("/", wrapMiddleware(adminAuth, API.fetchAllCustomers))
router.put("/:id", wrapMiddleware(adminAuth, API.updateCustomer))
router.delete("/:id", wrapMiddleware(adminAuth, API.deleteCustomer))
router.get("/:id", wrapMiddleware(trainerAuth, API.fetchCustomerBy_Id))
router.get("/:id/sessions", wrapMiddleware(customerAuth, API.fetchAllCustomerSessions))
router.get("/:id/courses", wrapMiddleware(customerAuth, API.fetchAllCustomerCourses))


module.exports = router