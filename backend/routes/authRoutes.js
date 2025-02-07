import { Router } from 'express'
const router = Router()
import { authenticate } from '../controller/authApi.js'


// in the path, before these, there must be /auth
router.post("/authenticate", authenticate)

export default router