import express from 'express';
import { checkAuth, login, logout, signup , updateProfile,addContact} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post("/signup",signup)
router.post("/login", login)
router.post("/logout", logout)

router.patch("/add-contact",protectRoute,addContact)
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check-auth",protectRoute,checkAuth)
export default router;