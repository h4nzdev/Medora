
import express from "express";
import { createServer } from "http"; // Import http
import { Server } from "socket.io"; // Import socket.io
import { configDB } from "./config/db.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import patientRouter from "./routes/patientsRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import clinicAuthRoutes from "./routes/clinicAuthRoute.js";
import patientAuthRouter from "./routes/patientAuthRoute.js";
import medicalRecordsRouter from "./routes/medicalRecordsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
configDB();
const app = express();
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer, { // Attach socket.io to the server
  cors: {
    origin: "*", // Adjust for your frontend URL in production
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

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


// Serve static files from the 'public' directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/clinic", clinicRoutes);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointmentRouter);
app.use("/auth/clinic", clinicAuthRoutes);
app.use("/auth/patient", patientAuthRouter);
app.use("/medical-records", medicalRecordsRouter);
app.use("/", chatRoutes);
app.use('/api/reviews', reviewRoutes);

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on PORT : 3000`);
});
