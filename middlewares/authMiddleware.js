import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";

export const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: "Access Denied. No token provided."})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if(!user) return res.status(401).json({message: "Access Denied. Invalid Token."});
        
        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({message: "Access Denied. Invalid Token."});
    }
};

// Middleware to authorize admin only
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
};