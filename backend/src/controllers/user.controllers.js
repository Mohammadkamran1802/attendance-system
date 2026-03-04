import User from "../models/User.model.js";

export const getMyProfile = async (req , res)=> {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('name email role');
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.json({
            name: user.name,
            email: user.email,
            role: user.role
        })

    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}