import mongoose from "mongoose";
const userSchema  = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role:{
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
    resetOtp: {
      type: String,
      default: null
    },

    resetOtpExpiry: {
      type: Date,
      default: null
    }

},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;
