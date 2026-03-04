import express from 'express';
import { getMonthlyAttendance, markPresent } from '../controllers/attendance.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = express.Router();


router.post('/mark-present',authMiddleware, roleMiddleware('employee'), markPresent);
router.get('/my-monthly',authMiddleware,roleMiddleware('employee'),getMonthlyAttendance);






export default router;
