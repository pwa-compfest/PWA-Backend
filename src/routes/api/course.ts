import {Router} from 'express'
import { 
    getVerifiedCourses,
    store,
    update,
    destroy,
    getImage,
    getCourseById,
    verifyCourse,
    rejectCourse
} from '@/controllers/course.controller'
import upload from '@/utils/storage'
import {requireUser} from '@/middleware/requireUser'
import {requireAdmin} from '@/middleware/requireAdmin'

const router = Router()

// Require User
router.get('/',requireUser,getVerifiedCourses)
router.get('/:id',requireUser,getCourseById)
router.get('/image/:file',getImage)

// Require Instructor
router.post('/',upload.single('image'),store)
router.put('/:id',upload.single('image'),update)
router.delete('/:id',destroy)

// Require Admin
router.put('/verify/:id',requireAdmin,verifyCourse)
router.put('/reject/:id',requireAdmin,rejectCourse)

export default router
