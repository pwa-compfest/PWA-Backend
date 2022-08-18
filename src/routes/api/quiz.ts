import { createQuiz, getAllQuizFromCourse, getSingleQuiz } from "@/controllers/quiz.controller"
import { requireInstructor } from "@/middleware/requireInstructor"
import { requireUser } from "@/middleware/requireUser"
import { Router } from "express"

const router = Router()


router.get('/quiz/:quizId', requireUser, getSingleQuiz)
router.get('/:courseId', requireUser, getAllQuizFromCourse)
router.post('/', requireInstructor, createQuiz)

export default router