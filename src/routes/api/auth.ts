import { signIn, signOut, signUp, verifyAccount } from "@/controllers/auth.controller";
import { requireUser } from "@/middleware/requireUser";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post('/account/verify', verifyAccount)
router.post('/signin', signIn);
router.post('/signout', requireUser, signOut);

export default router;
