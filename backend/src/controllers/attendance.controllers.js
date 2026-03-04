import Attendance from "../models/Attendance.model.js";

const getTodayDate = ()=>{
    return new Date().toISOString().split("T")[0];
}


export const markPresent = async (req , res) =>{
    try {
        const userId = req.user.id;
        const today = getTodayDate();

        const alreadyMarked = await Attendance.findOne({
            userId,
            date: today
        })

        if(alreadyMarked) {
            return res.status(400).json({message:"Attendance already marked for today"});
        };

        const attendance  = await Attendance.create({
            userId,
            date: today,
            checkInTime : new Date().toLocaleTimeString()
        })

        res.status(201).json({message: "Attendance marked successfully", attendance});
        
    } catch (error) {

        res.status(500).json({message: error.message});
        
    }
}

export const getMonthlyAttendance = async (req,res) => {
    try {
        const userId = req.user.id;
        const {month, year} = req.query;
        if(!month || !year) {
            return res.status(400).json({message: "Month and Year are required"});
        }
        const monthStr = String(month).padStart(2, "0"); // "01"
        const yearStr = String(year); 

        const attendanceList = await Attendance.find({
            userId,
            // approvedByAdmin: true,
            date: {
                 $regex: `^${yearStr}-${monthStr}` // YYYY-MM
            }

        })
        .populate("approvedBy", "name email")
        .sort({date: 1}); 

        res.json({
            month,
            year,
            totalRecords: attendanceList.length,
            attendance: attendanceList
        })

        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

