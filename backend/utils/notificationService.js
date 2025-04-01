import twilio from "twilio";
import nodemailer from "nodemailer";

// Twilio Configuration
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send SMS Notification
export const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`📲 SMS sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending SMS:", err.message);
  }
};

// Send Email Notification
export const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Healthcare System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};
