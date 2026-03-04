import express from 'express';
import { register, login } from '../controllers/auth.controllers.js';
const router = express.Router();
import { forgotPassword, verifyOtp, resetPassword } from '../controllers/auth.controllers.js';


router.post('/register',register);
router.post('/login',login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);




export default router;