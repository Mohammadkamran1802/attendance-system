import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import createDefaultAdmin from "./utils/createAdmin.js";

dotenv.config();

const PORT = process.env.PORT;
connectDB();
createDefaultAdmin();
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})