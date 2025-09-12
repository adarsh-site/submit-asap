import express from "express";
import {
  acceptAssignment,
  getAssignmentForAdmin,
  loginAdmin,
  registerAdmin,
  rejectAssignment,
} from "../controllers/adminController.js"; // ✅ remove double slash
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get(
  "/assignments",
  authenticateToken,
  authorizeAdmin,
  getAssignmentForAdmin
);
adminRouter.post(
  "/assignments/:id/accept",
  authenticateToken,
  authorizeAdmin,
  acceptAssignment
);
adminRouter.post(
  "/assignments/:id/reject",
  authenticateToken,
  authorizeAdmin,
  rejectAssignment
);

export default adminRouter;