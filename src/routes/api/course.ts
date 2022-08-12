import {Router} from 'express'
import {get,store} from '@/controllers/course.controller'
import upload from '@/utils/storage'
const router = Router()

router.get('/',get)
router.post('/',upload.single('image'),store)

export default router
  