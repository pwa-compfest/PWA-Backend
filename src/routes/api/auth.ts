import { signUp } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);

export default router;
