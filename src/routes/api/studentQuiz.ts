import { createStudentQuiz } from "@/controllers/studentQuiz.controller";
import { requireStudent } from "@/middleware/requireStudent";
import { Router } from "express";

const router = Router()

router.post('/', requireStudent, createStudentQuiz)

export default router