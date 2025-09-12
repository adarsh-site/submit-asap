import User from "../models/userModel.js";
import Assignment from "../models/assignmentModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    const token = generateToken(admin._id);

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssignmentForAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    const assignments = await Assignment.find({ adminId })
      .populate("userId", "name email")
      .populate("adminId", "name email role");

    res.status(200).json({ assignments });
  } catch (error) {
    console.error("Error retrieving assignments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId); // ✅ fixed
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.status = "accepted";
    await assignment.save();

    res.status(200).json({ message: "Assignment accepted successfully" });
  } catch (error) {
    console.error("Error accepting assignment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId); // ✅ fixed
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.status = "rejected";
    await assignment.save();

    res.status(200).json({ message: "Assignment rejected successfully" });
  } catch (error) {
    console.error("Error rejecting assignment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
