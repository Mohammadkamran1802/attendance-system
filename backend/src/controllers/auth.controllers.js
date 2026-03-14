import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const register = async(req, res) =>{
    try {
        const {name, email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already registerd"});

        }

        const hashedpassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email, 
            password: hashedpassword,
            role:"employee"
        })
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "user not registerd"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}

        );
        res.json({
            message: "Login successful",
            token, 
            user:{
                name: user.name,
                email: user.email,
                role: user.role
            }
            
        });


        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
      });
    }

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP - Standard Interior",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    });

    res.json({
      message: "OTP sent to registered email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔹 VERIFY OTP */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetOtp ||
      user.resetOtp !== otp ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    res.json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔹 RESET PASSWORD */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOtp !== otp ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};