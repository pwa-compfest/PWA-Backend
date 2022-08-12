import { signIn, signOut, signUp, verifyAccount } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post('/account/verify', verifyAccount)
router.post('/signin', signIn);
router.post('/signout', signOut);

export default router;
