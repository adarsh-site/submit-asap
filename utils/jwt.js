import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
    try {
        return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    } catch (error) {
        throw new Error("Error generating token")
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}