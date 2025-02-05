// Import modules
const express = require('express');
const { wrapMiddleware, adminAuth, customerAuth, anyAuth } = require('../utils')
const API = require('../controller/sessionApi');

const router = express.Router();

router.post('/', wrapMiddleware(customerAuth, API.createSession));
router.get('/', wrapMiddleware(adminAuth, API.fetchAllSessions));
router.get("/:id", wrapMiddleware(anyAuth, API.fetchSessionBy_Id));
router.delete('/:id', wrapMiddleware(customerAuth, API.deleteSession));

module.exports = router;