import { signIn, signOut, signUp, verifyAccount, sendChangePasswordEmail, verifyNewPassword } from "@/controllers/auth.controller";
import { requireUser } from "@/middleware/requireUser";
import upload from "@/utils/storage";
import { Router } from "express";

const router = Router();

router.post("/signup", upload.single('photo'), signUp);
router.post('/account/verify', verifyAccount)
router.post('/signin', signIn);
router.post('/signout', requireUser, signOut);
router.post('/password/send', sendChangePasswordEmail);
router.post('/password/verify', verifyNewPassword)

export default router;
