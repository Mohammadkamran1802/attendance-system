import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getMyProfile } from '../controllers/user.controllers.js';



const router = express.Router();
router.get('/profile', authMiddleware, getMyProfile);
export default router;


