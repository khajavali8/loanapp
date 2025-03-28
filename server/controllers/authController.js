import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from "path";
import { sendEmail } from "../utils/emailService.js";
import crypto from 'crypto';

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
  },

  async sendOtp(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in the database
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes
        await user.save();

        console.log(`Generated OTP for ${email}: ${otp}`); 

        // Send OTP email
        await sendEmail(
            email,
            "Farm IT - OTP for Login",
            `<p>Your OTP for login is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 5 minutes.</p>
            <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
        );

        res.json({ success: true, message: "OTP sent to email." });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
},

async verifyOtp(req, res) {
  try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      console.log(`Stored OTP: ${user.otp}, Entered OTP: ${otp}`); 

      // Check if OTP exists and is still valid
      if (!user.otp || !user.otpExpires || new Date() > user.otpExpires) {
          return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Convert OTP to string before comparing
      if (user.otp.toString() !== otp.toString()) {
          return res.status(400).json({ message: "Invalid OTP" });
      }

      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

      res.json({ token, user });

  } catch (error) {
      console.error("OTP Verification Error:", error);
      res.status(500).json({ message: "Error verifying OTP" });
  }
}


};

export default authController;
