import User from "../models/userModel.js";
import Assignment from "../models/assignmentModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successfull",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error login user", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAssignment = async (req, res) => {
  try {
    const { userEmail, task, adminEmail } = req.body;
    if (!userEmail || !task || !adminEmail) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentails" });
    }

    const admin = await User.findOne({ email: adminEmail });
    if (!admin || admin.role !== "admin") {
      return res.status(400).json({ message: "Invalid credentails" });
    }

    const assignment = new Assignment({
      userId: user._id,
      task,
      adminId: admin._id,
    });

    await assignment.save();
    res.status(200).json({ message: "Assignment uploaded successfully" });
  } catch (error) {
    console.error("Error uploading assignment", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    const adminList = admins.map((admin) => ({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    }));
    res.status(200).json({ admins: adminList });
  } catch (error) {
    console.error("Error finding admins", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
