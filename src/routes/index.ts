import { Router } from "express";
const router = Router();
import docs from "./docs";
import user from "./api/user";
import auth from "./api/auth";
import course from "./api/course";
import lecture from './api/lecture'
import quiz from './api/quiz'
import studentQuiz from './api/studentQuiz'

router.use("/docs", docs);
router.use("/users", user);
router.use("/auth", auth);
router.use("/courses", course);
router.use('/lectures', lecture);
router.use('/quizzes', quiz)
router.use('/student-quizzes', studentQuiz)

export default router;
