import twilio from "twilio";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Twilio configuration
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send SMS Notification
export const sendSms = (to, body) => {
  client.messages
    .create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
    .then((message) => console.log("Message sent: " + message.sid))
    .catch((err) => console.error("Error sending SMS: ", err));
};

// Send Email Notification
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email: ", err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
