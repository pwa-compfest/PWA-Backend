import { createLecture, deleteLecture, getAllLecturesFromCourse, updateLecture } from "@/controllers/lecture.controller";
import { requireInstructor } from "@/middleware/requireInstructor";
import { Router } from "express";

const router = Router()

router.get('/:courseId', getAllLecturesFromCourse)
router.post('/', requireInstructor, createLecture)
router.put('/:lectureId', requireInstructor, updateLecture)
router.delete('/:lectureId', requireInstructor, deleteLecture)

export default router