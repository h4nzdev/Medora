import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { configDB } from "./config/db.js";
import { startAutoCancelCron } from "./utils/autoCancellAppointments.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { corsConfig } from "./middleware/corsMiddleware.js";

// Import routes
import clinicRoutes from "./routes/clinicRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import patientRouter from "./routes/patientsRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import clinicAuthRoutes from "./routes/clinicAuthRoute.js";
import patientAuthRouter from "./routes/patientAuthRoute.js";
import medicalRecordsRouter from "./routes/medicalRecordsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import invoiceRouter from "./routes/invoiceRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import subscriptionRouter from "./routes/subscirptionRoutes.js";
import systemUpdatesRouter from "./routes/systemUpdatesRoutes.js";
import clinicAIRouter from "./routes/clinicAIRoutes.js"; // ✅ ONLY IMPORT, NO DUPLICATE

const allowedOrigins = [
  "https://medora-dun.vercel.app",
  "https://klinikahub.vercel.app",
  "http://localhost:5173",
];

dotenv.config();
configDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ USE MIDDLEWARE FILES INSTEAD OF HARDCODED
app.use(corsConfig); // From middleware file
app.use(express.json());

// Start the cron job when server starts
startAutoCancelCron();

// --- Socket.io connection ---
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Pass `io` to your routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/clinic", clinicRoutes);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointmentRouter);
app.use("/auth/clinic", clinicAuthRoutes);
app.use("/auth/patient", patientAuthRouter);
app.use("/medical-records", medicalRecordsRouter);
app.use("/", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/invoices", invoiceRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/admin", adminRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/system-update", systemUpdatesRouter);
app.use("/api/clinic-ai", clinicAIRouter); // ✅ USE THE IMPORTED ROUTER

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on PORT : 3000`);
});
