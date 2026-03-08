import { hash } from "bcryptjs";
import Attendance from "../models/Attendance.model.js";
import User from "../models/User.model.js";

export const getEmployeePendingApprovals = async (req, res)=> {
  try {
    const pendingApprovals = await Attendance.find({
      approvedByAdmin: false
    }).populate("userId", "name email");

    res.json({
      totalPending: pendingApprovals.length,
      approvals: pendingApprovals
    });
  } catch (error) {
    res.status(500).json({message: error.message});
    
  }
}

export const approveAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { day, half, double, night } = req.body;

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    attendance.day = day ?? attendance.day;
    attendance.half = half ?? attendance.half;
    attendance.double = double ?? attendance.double;
    attendance.night = night ?? attendance.night;
    attendance.approvedByAdmin = true;
    attendance.approvedBy = req.user.id; // admin user ID

    await attendance.save();

    res.json({
      message: "Attendance approved successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const getPresentEmployeesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required (YYYY-MM-DD)"
      });
    }

    const attendanceList = await Attendance.find({
      date: { $regex: `^${date}` },
      presentMarked: true
    }).populate("userId", "name email");

    res.json({
      date,
      totalPresent: attendanceList.length,
      employees: attendanceList.map(record => ({
        employeeId: record.userId._id,
        name: record.userId.name,
        email: record.userId.email,
        checkInTime: record.checkInTime
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getEmployeeMonthlyAttendance = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId || !month || !year) {
      return res.status(400).json({
        message: "Employee ID, month and year are required"
      });
    }

    // verify employee exists
    const employee = await User.findById(employeeId).select("name email");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // convert month/year
    const monthStr = String(month).padStart(2, "0"); // "01"
    const yearStr = String(year); // "2026"

    // fetch approved attendance (USING date FIELD, not createdAt)
    const attendanceList = await Attendance.find({
      userId: employeeId,
      approvedByAdmin: true,
      date: {
        $regex: `^${yearStr}-${monthStr}` // 2026-01
      }
    })
    .populate("approvedBy", "name email")
    .sort({ date: 1 });

    res.json({
      employee,
      month,
      year,
      totalRecords: attendanceList.length,
      attendance: attendanceList
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllEmployees = async (req, res)=> {
  try {
    const employees = await User.find({role:'employee'}).select('name email createdAt').sort({name:1});
    res.json({
      totalEmployees: employees.length,
      employees
    })

    
  } catch (error) {
    res.status(500).json({message: error.message});
    
  }
}


export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashpassword = await hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashpassword,
      role: "admin"
    });

    res.json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


