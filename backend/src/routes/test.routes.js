import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
const router = express.Router();


router.get('/profile',authMiddleware,(req,res)=>{
    res.json({
        message: "profile access granted ",
        user: req.user
    })
});


router.get('/admin',authMiddleware,roleMiddleware('admin'),(req,res)=>{
    res.json({
        message: "admin route granted ",
        user: req.user
    })
})

export default router;