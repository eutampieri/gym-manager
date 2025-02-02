const express = require('express')
const router = express.Router()
const API = require('../controller/adminApi')

// in the path, before these, there must be /admins
router.get("/", API.fetchAllAdmins)
router.post("/", API.createAdmin)
router.post("/update", API.updateAdmin)
router.delete("/delete/:username", API.deleteAdmin)
router.get("/username/:username", API.fetchAdminByUsername)
router.get("/id/:username", API.fetchAdmin_IdByUsername)

module.exports = router