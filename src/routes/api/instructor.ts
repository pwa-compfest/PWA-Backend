import { Router } from 'express'
import { verifyInstructor, rejectInstructor, getInstructor } from '@/controllers/instructor/'
import { requireAdmin } from '@/middleware/requireAdmin'
const router = Router()

router.get('/', requireAdmin, getInstructor)
router.put('/verify/:id', requireAdmin, verifyInstructor)
router.put('/reject/:id', requireAdmin, rejectInstructor)

export default router