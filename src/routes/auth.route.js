import express from 'express';
import { checkAuth, login, logout, signup , updateProfile, userdata } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middlewate.js';

const router = express.Router();


router.post("/signup",signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/users",userdata)

router.patch("/update-profile",protectRoute,updateProfile)
router.get("/check-auth",protectRoute,checkAuth)
export default router;