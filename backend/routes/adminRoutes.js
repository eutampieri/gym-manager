import { Router } from 'express';
const router = Router()
import API from '../controller/adminApi.js';
import { createAuthMiddleware } from '../utils.js';
import { Role } from '@gym-manager/models/role.js'

router.use(createAuthMiddleware(new Set([Role.Admin])));
router.use((req, res, next) => {
    if (!req.user.hasFullPrivileges) {
        res.status(401).json({ message: 'User not authorized' });
    } else {
        next();
    }
});

router.post("/", API.createAdmin)
router.get("/", API.fetchAllAdmins)
router.get("/username/:username", API.fetchAdminByUsername)
router.get("/:id", API.fetchAdminBy_Id)
router.put("/", API.updateAdmin)
router.delete("/:id", API.deleteAdmin)

export default router