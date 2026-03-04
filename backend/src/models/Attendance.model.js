import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        presentMarked: {
            type: Boolean,
            default: true
        },
        checkInTime: {
            type: String,
            required: true
        },

        day: { type: Boolean, default: false },
        half: { type: Boolean, default: false },
        double: { type: Boolean, default: false },
        night: { type: Boolean, default: false },

        approvedByAdmin: {
            type: Boolean,
            default: false
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }



    },
    { timestamps: true }


);

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;