import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({role: "admin"});
        if(adminExists) {
            console.log("Admin user already exists");
            return;
        }
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
            name: "Mohammad Kamran",
            email: "mohammadkamran615@gmail.com",
            password: hashedPassword,
            role: "admin"
        });


        
    } catch (error) {
        console.log("Error creating admin user:", error.message);
        
    }
}

export default createDefaultAdmin;