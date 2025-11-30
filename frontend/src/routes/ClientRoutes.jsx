import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ClientLayout from "../layout/ClientLayout";
import ClientDashboard from "../page/ClientPages/ClientDashboard/ClientDashboard";
import ClientAppointments from "../page/ClientPages/ClientAppointments/ClientAppointments";
import ClientChat from "../page/ClientPages/ClientChat/ClientChat";
import ClientMedicalRecords from "../page/ClientPages/ClientMedicalRecords/ClientMedicalRecords";
import ClientReminders from "../page/ClientPages/ClientReminders/ClientReminders";
import ClientProfile from "../page/ClientPages/ClientProfile/ClientProfile";
import ClientSettings from "../page/ClientPages/ClientSettings/ClientSettings";
import ClientCalendar from "../page/ClientPages/ClientCalendar/ClientCalendar";
import ClientTimeline from "../page/ClientPages/ClientTimeline/ClientTimeline";
import DoctorsList from "../page/ClientPages/DoctorsList/DoctorsList";
import DoctorProfile from "../page/ClientPages/DoctorProfile/DoctorProfile";
import ClientInvoices from "../page/ClientPages/ClientInvoices/ClientInvoices";
import ClientNotifications from "../page/ClientPages/ClientNotifications/ClientNotifications";
import ClientMedicalRecordDetails from "../page/ClientPages/ClientMedicalRecords/components/ClientMedicalRecordDetails";

const ClientRoutes = () => {
  return (
    <BrowserRouter>
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
          path="/client/invoices"
          element={
            <ClientLayout>
              <ClientInvoices />
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
          path="/client/medical-records/:id"
          element={
            <ClientLayout>
              <ClientMedicalRecordDetails />
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
        <Route
          path="/client/notifications"
          element={
            <ClientLayout>
              <ClientNotifications />
            </ClientLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default ClientRoutes;
