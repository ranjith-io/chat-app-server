import express from 'express';
import { login, logout, signup , userdata } from '../controllers/auth.controller.js';

const router = express.Router();


router.post("/signup",signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/users",userdata)
export default router;