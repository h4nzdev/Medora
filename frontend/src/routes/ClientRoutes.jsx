import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ClientLayout from "../layout/ClientLayout";
import ClientDashboard from "../page/ClientPages/ClientDashboard/ClientDashboard";
import ClientAppointments from "../page/ClientPages/ClientAppointments/ClientAppointments";
import ClientChat from "../page/ClientPages/ClientChat/ClientChat";
import ClientMedicalRecords from "../page/ClientPages/ClientMedicalRecords/ClientMedicalRecords";
import ClientReminders from "../page/ClientPages/ClientReminders/ClientReminders";
import ClientProfile from "../page/ClientPages/ClientProfile/ClientProfile";
import ClientSettings from "../page/ClientPages/ClientSettings/ClinicSettings";
import ClientCalendar from "../page/ClientPages/ClientCalendar/ClientCalendar";
import ClientTimeline from "../page/ClientPages/ClientTimeline/ClientTimeline";
import DoctorsList from "../page/ClientPages/DoctorsList/DoctorsList";
import DoctorProfile from "../page/ClientPages/DoctorProfile/DoctorProfile";
import { TourProvider } from "../context/TourContext";

const ClientRoutes = () => {
  return (
    <BrowserRouter>
      <TourProvider>
        <Routes>
          <Route path="*" element={<Navigate to="/client/dashboard" />} />
          <Route
            path="/client/dashboard"
            element={
              <ClientLayout>
                <ClientDashboard />
              </ClientLayout>
            }
          />
          <Route
            path="/client/timeline"
            element={
              <ClientLayout>
                <ClientTimeline />
              </ClientLayout>
            }
          />
          <Route
            path="/client/appointments"
            element={
              <ClientLayout>
                <ClientAppointments />
              </ClientLayout>
            }
          />
          <Route
            path="/client/doctors"
            element={
              <ClientLayout>
                <DoctorsList />
              </ClientLayout>
            }
          />
          <Route
            path="/client/doctor/:id"
            element={
              <ClientLayout>
                <DoctorProfile />
              </ClientLayout>
            }
          />
          <Route
            path="/client/calendar"
            element={
              <ClientLayout>
                <ClientCalendar />
              </ClientLayout>
            }
          />
          <Route
            path="/client/chats"
            element={
              <ClientLayout>
                <ClientChat />
              </ClientLayout>
            }
          />
          <Route
            path="/client/medical-records"
            element={
              <ClientLayout>
                <ClientMedicalRecords />
              </ClientLayout>
            }
          />
          <Route
            path="/client/reminders"
            element={
              <ClientLayout>
                <ClientReminders />
              </ClientLayout>
            }
          />
          <Route
            path="/client/profile"
            element={
              <ClientLayout>
                <ClientProfile />
              </ClientLayout>
            }
          />
          <Route
            path="/client/settings"
            element={
              <ClientLayout>
                <ClientSettings />
              </ClientLayout>
            }
          />
        </Routes>
      </TourProvider>
    </BrowserRouter>
  );
};

export default ClientRoutes;
