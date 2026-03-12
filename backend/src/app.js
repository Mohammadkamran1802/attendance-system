import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import testRoutes from './routes/test.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js';
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://attendancestandard.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.get('/',(req,res)=> {
    res.send("Attendence API is running");
});



export default app;