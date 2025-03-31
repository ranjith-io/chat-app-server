import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token =req.cookies.jwt;
        const sessionToken=req.cookies.sessionId;

        if (!token || !sessionToken) {
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded = jwt.verify(token,process.env.jwt_secret);

        if (!decoded || decoded.sessionToken!==sessionToken) {
            return res.status(401).json({message:"Unauthorized session"});
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({message:"User not found"});
        }
        req.user=user;
        next();

    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.log("protectroute",error.message);
    }
}