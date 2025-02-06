// Import modules
import { Router } from 'express';
import { wrapMiddleware, adminAuth, customerAuth, anyAuth } from '../utils.js';
import API from '../controller/sessionApi.js';

const router = Router();

router.post('/', wrapMiddleware(customerAuth, API.createSession));
router.get('/', wrapMiddleware(adminAuth, API.fetchAllSessions));
router.get("/:id", wrapMiddleware(anyAuth, API.fetchSessionBy_Id));
router.delete('/:id', wrapMiddleware(customerAuth, API.deleteSession));

export default router;