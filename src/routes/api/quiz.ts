import { createQuiz, deleteQuiz, getAllQuizFromCourse, getSingleQuiz, updateQuiz } from "@/controllers/quiz.controller"
import { requireInstructor } from "@/middleware/requireInstructor"
import { requireUser } from "@/middleware/requireUser"
import { Router } from "express"

const router = Router()

router.get('/quiz/:courseId/:quizId', requireUser, getSingleQuiz)
router.get('/:courseId', requireUser, getAllQuizFromCourse)
router.post('/', requireInstructor, createQuiz)
router.put('/:quizId', requireInstructor, updateQuiz)
router.delete('/:quizId', requireInstructor, deleteQuiz)

export default router