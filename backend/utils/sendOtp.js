import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmailOtp = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  };
  return transporter.sendMail(mailOptions);
};

export const sendSmsOtp = async (phone, otp) => {
  return twilioClient.messages.create({
    body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
};
