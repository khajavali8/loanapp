import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from "path";
import { sendEmail } from "../utils/emailService.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilepics");  
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);  
  },
});

export const upload = multer({ storage });

const authController = {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, role } = req.body;
      const profilePic = req.file ? req.file.path : "";

      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        profilePic,
      });

      console.log("Sending email to:", email);

      await sendEmail(
        email,
        "Farm IT - Registration Successful",
        `<p><strong>Dear ${firstName},</strong></p>
        <p>Your account has been successfully registered.</p>
        <p><strong>Admin verification takes 2 days.</strong> Once verified, you will receive another email notification, and then you can log in.</p>
        <p>Thank you for your patience.</p>
        <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully. Check your email for verification details.",
        user: newUser,
      });

    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default authController;
