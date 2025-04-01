import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import speakeasy from "speakeasy";
import { sendEmailOtp, sendSmsOtp } from "../utils/sendOtp.js";

// Generate OTP
const generateOTP = () => speakeasy.totp({ secret: process.env.OTP_SECRET, digits: 6 });

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    res.status(201).json({ message: "User registered successfully, please log in" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User (Step 1: Generate OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins
    await user.save();

    await sendEmailOtp(user.email, otp);
    await sendSmsOtp(user.phone, otp);

    res.status(200).json({ message: "OTP sent to your email and phone" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP (Step 2: Generate JWT)
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to Protect Routes
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};
