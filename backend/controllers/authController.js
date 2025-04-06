import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import speakeasy from "speakeasy";
import { sendEmailOtp } from "../utils/sendOtp.js";

// Generate OTP
const generateOTP = () => speakeasy.totp({ secret: process.env.OTP_SECRET, digits: 6 });

// Register User
// authController.js - Update registerUser to include OTP step
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate OTP for new registration
    const otp = generateOTP();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins
    await newUser.save();

    // Send OTP
    await sendEmailOtp(newUser.email, otp);

    // Create a temporary token
    const tempToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short expiry for OTP verification
    });

    res.status(201).json({ 
      message: "Registration successful! Please verify with OTP sent to your email.",
      token: tempToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// authController.js - Update the loginUser function
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

    // Generate a temporary token for OTP verification step
    const tempToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short expiry for OTP verification
    });

    await sendEmailOtp(user.email, otp);
    // await sendSmsOtp(user.phone, otp);

    // Return the temporary token
    res.status(200).json({ 
      message: "OTP sent to your email", 
      token: tempToken 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP (Step 2: Generate JWT)
export const verifyOtp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.otp !== req.body.otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const verifiedToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ verifiedToken, role: user.role });
  } catch (err) {
    console.error(err);
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


// Add this function to authController.js

// Resend OTP for user
export const resendOtp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins
    await user.save();

    await sendEmailOtp(user.email, otp);
    // If you implement SMS later
    // if (user.phone) {
    //   await sendSmsOtp(user.phone, otp);
    // }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Then add this route to your auth routes file (e.g., authRoutes.js):
// router.post("/resend-otp", resendOtp);