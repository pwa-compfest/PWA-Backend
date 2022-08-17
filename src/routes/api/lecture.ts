import { createLecture, deleteLecture, getAllLecturesFromCourse, updateLecture } from "@/controllers/lecture.controller";
import { isInstructor } from "@/middleware/isInstructor";
import { Router } from "express";

const router = Router()

router.get('/:courseId', getAllLecturesFromCourse)
router.post('/', isInstructor, createLecture)
router.put('/:lectureId', isInstructor, updateLecture)
router.delete('/:lectureId', isInstructor, deleteLecture)

export default router