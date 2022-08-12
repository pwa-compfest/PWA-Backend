import {Router} from 'express'
import {get,store,update,destroy,getImage,getCourseById} from '@/controllers/course.controller'
import upload from '@/utils/storage'
const router = Router()

router.get('/',get)
router.get('/:id',getCourseById)
router.get('/image/:file',getImage)
router.post('/',upload.single('image'),store)
router.put('/:id',upload.single('image'),update)
router.delete('/:id',destroy)

export default router
  