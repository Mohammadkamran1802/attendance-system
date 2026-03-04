import express from 'express';

import {  approveAttendance } from '../controllers/admin.controllers.js';
import { getPresentEmployeesByDate } from '../controllers/admin.controllers.js';
import { getEmployeeMonthlyAttendance } from '../controllers/admin.controllers.js';
import { getAllEmployees } from '../controllers/admin.controllers.js';
import { getEmployeePendingApprovals } from '../controllers/admin.controllers.js';
import { createAdmin } from '../controllers/admin.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = express.Router();

// router.get('/attendance',authMiddleware,roleMiddleware('admin'), getAttendanceByDate);

router.get('/attendance/by-date', authMiddleware, roleMiddleware('admin'), getPresentEmployeesByDate);

router.get(
  '/attendance/pending',
  authMiddleware,
  roleMiddleware('admin'),
  getEmployeePendingApprovals
);

router.put(
  "/attendance/:attendanceId",
  authMiddleware,
  roleMiddleware("admin"),
  approveAttendance
);

router.get(
  "/attendance/monthly",
  authMiddleware,
  roleMiddleware("admin"),
  getEmployeeMonthlyAttendance
);
router.get(
  "/employees",
  authMiddleware,
  roleMiddleware("admin"),
  getAllEmployees
);


router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware("admin"),
  createAdmin
);

export default router;