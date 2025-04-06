import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Database Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", roleRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/lab", cloudinaryRoutes);
app.use("/api/doctor", doctorRoutes);

app.get("/", (req, res) => {
  res.send("Healthcare API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
