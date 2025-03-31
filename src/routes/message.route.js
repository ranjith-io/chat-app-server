import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getContactListForSidebar, sendMessage } from '../controllers/message.controller.js';

const router=express.Router();

router.get('/users',protectRoute,getContactListForSidebar);
router.get('/:receiverId',protectRoute,getMessages);
router.post("/send/:receiverId",protectRoute,sendMessage);

export default router;