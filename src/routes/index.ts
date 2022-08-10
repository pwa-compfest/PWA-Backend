import { Router } from "express";
const router = Router();
import docs from "./docs";
import user from "./api/user";
import auth from "./api/auth";

router.use("/docs", docs);
router.use("/users", user);
router.use("/auth", auth);

export default router;
