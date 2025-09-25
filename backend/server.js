import express from "express";
import { configDB } from "./config/db.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import patientRouter from "./routes/patientsRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import clinicAuthRoutes from "./routes/clinicAuthRoute.js";
import patientAuthRouter from "./routes/patientAuthRoute.js";
import medicalRecordsRouter from "./routes/medicalRecordsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();
configDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on PORT : 3000`);
});

app.use("/clinic", clinicRoutes);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointmentRouter);
app.use("/auth/clinic", clinicAuthRoutes);
app.use("/auth/patient", patientAuthRouter);
app.use("/medical-records", medicalRecordsRouter);
app.use("/", chatRoutes);
