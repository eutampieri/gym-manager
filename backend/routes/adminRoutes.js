const express = require('express')
const router = express.Router()
const API = require('../controller/adminApi')

router.post("/", API.createAdmin)
router.get("/", API.fetchAllAdmins)
router.get("/username/:username", API.fetchAdminByUsername)
router.get("/:id", API.fetchAdminBy_Id)
router.put("/", API.updateAdmin)
router.delete("/:id", API.deleteAdmin)

// in the path, before these, there must be /admins
router.get("/id/:username", API.fetchAdmin_IdByUsername)

module.exports = router