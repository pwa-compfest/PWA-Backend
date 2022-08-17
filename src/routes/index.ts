import { Router } from "express";
const router = Router();
import docs from "./docs";
import user from "./api/user";
import auth from "./api/auth";
import course from "./api/course";
import lecture from './api/lecture'

router.use("/docs", docs);
router.use("/users", user);
router.use("/auth", auth);
router.use("/courses", course);
router.use('/lectures', lecture)

export default router;
