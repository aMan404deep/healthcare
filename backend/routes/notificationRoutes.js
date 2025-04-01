import express from "express";
import { sendSms, sendEmail } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming this is your auth middleware

const router = express.Router();

// Send SMS notification
router.post("/send-sms", protect, (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ message: "Phone number and message are required." });
  }

  sendSms(phoneNumber, message);
  return res.status(200).json({ message: "SMS sent successfully" });
});

// Send email notification
router.post("/send-email", protect, (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Email, subject, and message are required." });
  }

  sendEmail(email, subject, message);
  return res.status(200).json({ message: "Email sent successfully" });
});

export default router;
