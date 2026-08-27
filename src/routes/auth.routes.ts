import { Router } from "express";
import { login, logout, me, register, googleLogin } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
const router=Router();
router.post("/register",asyncHandler(register));router.post("/login",asyncHandler(login));router.post("/google",asyncHandler(googleLogin));router.post("/logout",asyncHandler(logout));router.get("/me",requireAuth,asyncHandler(me));
export default router;
