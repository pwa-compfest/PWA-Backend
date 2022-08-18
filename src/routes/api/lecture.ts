import { createLecture, deleteLecture, getAllLecturesFromCourse, updateLecture } from "@/controllers/lecture.controller";
import { addStudentProgress, getStudentProgress } from "@/controllers/studentProgress.controller";
import { requireInstructor } from "@/middleware/requireInstructor";
import { requireStudent } from "@/middleware/requireStudent";
import { requireUser } from "@/middleware/requireUser";
import { Router } from "express";

const router = Router()

router.get('/:courseId', requireUser, getAllLecturesFromCourse)
router.post('/', requireInstructor, createLecture)
router.put('/:lectureId', requireInstructor, updateLecture)
router.delete('/:lectureId', requireInstructor, deleteLecture)
router.get('/student-progress/:courseId', requireStudent, getStudentProgress)
router.post('/student-progress', requireStudent, addStudentProgress)

export default router