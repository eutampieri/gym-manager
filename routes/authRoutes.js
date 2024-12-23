const express = require('express')
const router = express.Router()
const API = require('../controller/authApi')


// in the path, before these, there must be /auth
router.post("/authenticate", API.authenticate)

module.exports = router