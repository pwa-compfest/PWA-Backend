import {Router} from 'express'
import * as UserController from '@/controllers/user.controller'
const router = Router()

router.get('/',UserController.get)
router.get('/:id',UserController.getById)
router.post('/store',UserController.store)

export default router
  