import express from "express";
import {
  getAllAdmins,
  loginUser,
  registerUser,
  uploadAssignment,
} from "../controllers/userController.js"; // ✅ remove double slash
import { authenticateToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/upload", authenticateToken, uploadAssignment);
userRouter.get("/admins", authenticateToken, getAllAdmins);

export default userRouter;
