import { Router } from 'express'
import {
    getUnverifiedCourse,
    getVerifiedCourses,
    getCoursesByInstructor,
    store,
    update,
    destroy,
    getDetailCourseByInstructor,
    verifyCourse,
    rejectCourse,
    publicCourse,
    privateCourse,
    enrollCourse,
    getCourseByStudent,
    getDetailCourseByStudent
} from '@/controllers/courses'
import upload from '@/utils/storage'
import { requireInstructor } from '@/middleware/requireInstructor'
import { requireAdmin } from '@/middleware/requireAdmin'
import { requireStudent } from '@/middleware/requireStudent'

const router = Router()

// Require Student
router.get('/', requireStudent, getVerifiedCourses)
router.get('/me', requireStudent, getCourseByStudent)
router.get('/me/:id',requireStudent,getDetailCourseByStudent)
router.post('/enroll/:id', requireStudent, enrollCourse)

// Require Instructor
router.get('/instructor',requireInstructor,getCoursesByInstructor)
router.get('/instructor/:id', requireInstructor, getDetailCourseByInstructor)
router.post('/',requireInstructor,upload.single('image'), store)
router.put('/:id',requireInstructor,upload.single('image'), update)
router.delete('/:id',requireInstructor,destroy)
router.put('/publish/:id',requireInstructor,publicCourse)
router.put('/private/:id',requireInstructor,privateCourse)

// Require Admin
router.put('/verify/:id', requireAdmin, verifyCourse)
router.put('/reject/:id', requireAdmin, rejectCourse)
router.get('/unverified', requireAdmin, getUnverifiedCourse)


// Require User


export default router
