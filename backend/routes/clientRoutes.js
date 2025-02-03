const express = require('express')
const router = express.Router()
const API = require('../controller/clientApi')

router.post("/", API.createCustomer)
router.get("/", API.fetchAllCustomers)
router.get("/username/:username", API.fetchCustomerByUsername)
router.get("/:id", API.fetchCustomerBy_Id)
router.put("/", API.updateCustomer)
router.delete("/:id", API.deleteCustomer)
router.get("/sessions/:id", API.fetchAllCustomerSessions)
router.get("/courses/:id", API.fetchAllCustomerCourses)

// in the path, before these, there must be /customers
router.get("/courses/delete/:username/:courseName", API.deleteClientCourse)
router.get("/sessions/delete/:username/:sessionId", API.deleteClientSession)
router.get("/courses/add/:username/:courseId", API.addClientCourseBy_Id)
router.get("/sessions/add/:username/:sessionId", API.addClientSessionBy_Id)
router.get("/sessions/:username/:id", API.checkClientSessions)
router.get("/id/:username", API.fetchClient_IdByUsername)


module.exports = router