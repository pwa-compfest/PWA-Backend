import { Router } from 'express'
import {
    getCourses,
    getVerifiedCourses,
    getCoursesByInstructor,
    store,
    update,
    destroy,
    getImage,
    getCourseById,
    verifyCourse,
    rejectCourse,
    publicCourse,
    privateCourse
    
} from '@/controllers/courses'
import upload from '@/utils/storage'
import { requireUser } from '@/middleware/requireUser'
import { requireInstructor } from '@/middleware/requireInstructor'
import { requireAdmin } from '@/middleware/requireAdmin'

const router = Router()

// Require User
router.get('/', requireUser, getVerifiedCourses)
router.get('/:id', requireUser, getCourseById)
router.get('/image/:file',requireUser,getImage)

// Require Instructor
router.get('/instructor',requireInstructor,getCoursesByInstructor)
router.post('/',requireInstructor,upload.single('image'), store)
router.put('/:id',requireInstructor,upload.single('image'), update)
router.delete('/:id',requireInstructor,destroy)
router.put('/publish/:id',requireInstructor,publicCourse)
router.put('/private/:id',requireInstructor,privateCourse)


// Require Admin
router.put('/verify/:id', requireAdmin, verifyCourse)
router.put('/reject/:id', requireAdmin, rejectCourse)
router.get('/all', requireAdmin, getCourses)

export default router
