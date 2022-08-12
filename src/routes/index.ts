import { Router } from "express";
const router = Router();
import docs from "./docs";
import user from "./api/user";
import auth from "./api/auth";
import course from "./api/course";

router.use("/docs", docs);
router.use("/users", user);
router.use("/auth", auth);
router.use("/courses", course);

export default router;
