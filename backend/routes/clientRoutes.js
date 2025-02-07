import { Router } from 'express';
import API from '../controller/clientApi.js';
import { wrapMiddleware, adminAuth, trainerAuth, customerAuth, anyAuth } from '../utils.js';

const router = Router();

router.post("/", wrapMiddleware(adminAuth, API.createCustomer))
router.get("/", wrapMiddleware(adminAuth, API.fetchAllCustomers))
router.put("/", wrapMiddleware(adminAuth, API.updateCustomer))
router.delete("/:id", wrapMiddleware(adminAuth, API.deleteCustomer))
router.get("/:id", wrapMiddleware(trainerAuth, API.fetchCustomerBy_Id))
router.get("/:id/sessions", wrapMiddleware(customerAuth, API.fetchAllCustomerSessions))
router.get("/:id/courses", wrapMiddleware(customerAuth, API.fetchAllCustomerCourses))
router.get("/:id/availabilities", wrapMiddleware(anyAuth, API.listCustomerAvailability));

export default router