import { createLecture, deleteLecture, getAllLecturesFromCourse, updateLecture } from "@/controllers/lecture.controller";
import { requireInstructor } from "@/middleware/requireInstructor";
import { requireUser } from "@/middleware/requireUser";
import { Router } from "express";

const router = Router()

router.get('/:courseId', requireUser, getAllLecturesFromCourse)
router.post('/', requireInstructor, createLecture)
router.put('/:lectureId', requireInstructor, updateLecture)
router.delete('/:lectureId', requireInstructor, deleteLecture)

export default router