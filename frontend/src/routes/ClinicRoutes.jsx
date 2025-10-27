import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClinicAppointments from "../page/ClinicPages/ClinicAppointments/ClinicAppointments";
import ClinicLayout from "../layout/ClinicLayout";
import ClinicPatients from "../page/ClinicPages/ClinicPatients/ClinicPatients";
import ClinicDoctors from "../page/ClinicPages/ClinicDoctors/ClinicDoctors";
import ClinicPatientsChat from "../page/ClinicPages/ClinicPatientsChat/ClinicPatientsChat";
import ClinicMedicalRecords from "../page/ClinicPages/ClinicMedicalRecords/ClinicMedicalRecords";
import ClinicSubscriptions from "../page/ClinicPages/ClinicSubscriptions/ClinicSubscriptions";
import ClinicDashboard from "../page/ClinicPages/ClinicDashboard/ClinicDashboard";
import ClinicSettings from "../page/ClinicPages/ClinicSettings/ClinicSettings";
import PendingAppointments from "../page/ClinicPages/ClinicPendingAppointments/ClinicPendingAppointments";
import ClinicDoctorProfile from "../page/ClinicPages/DoctorProfile/ClinicDoctorProfile";
import ClinicPatientProfile from "../page/ClinicPages/PatientProfile/ClinicPatientProfile";
import ClinicCalendar from "../page/ClinicPages/ClinicCalendar/ClinicCalendar";
import InvoicesPage from "../page/ClinicPages/ClinicInvoicePage/InvoicesPage"; // Import the new page
import ClinicNotifications from "../page/ClinicPages/ClinicNotifications/ClinicNotifications";
import ClinicProfile from "../page/ClinicPages/ClinicProfile/ClinicProfile";

const ClinicRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/clinic/dashboard"
          element={
            <ClinicLayout>
              <ClinicDashboard />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/appointments"
          element={
            <ClinicLayout>
              <ClinicAppointments />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/calendar"
          element={
            <ClinicLayout>
              <ClinicCalendar />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/pending-appointments"
          element={
            <ClinicLayout>
              <PendingAppointments />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/patients"
          element={
            <ClinicLayout>
              <ClinicPatients />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/doctors"
          element={
            <ClinicLayout>
              <ClinicDoctors />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/patients-chats"
          element={
            <ClinicLayout>
              <ClinicPatientsChat />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/medical-records"
          element={
            <ClinicLayout>
              <ClinicMedicalRecords />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/notifications"
          element={
            <ClinicLayout>
              <ClinicNotifications />
            </ClinicLayout>
          }
        />
        {/* Add the new Invoices route here */}
        <Route
          path="/clinic/invoices"
          element={
            <ClinicLayout>
              <InvoicesPage />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/profile"
          element={
            <ClinicLayout>
              <ClinicProfile />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/subscriptions"
          element={
            <ClinicLayout>
              <ClinicSubscriptions />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/settings"
          element={
            <ClinicLayout>
              <ClinicSettings />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/doctor-profile/:id"
          element={
            <ClinicLayout>
              <ClinicDoctorProfile />
            </ClinicLayout>
          }
        />
        <Route
          path="/clinic/patient-profile/:id"
          element={
            <ClinicLayout>
              <ClinicPatientProfile />
            </ClinicLayout>
          }
        />
        <Route path="*" element={<Navigate to="/clinic/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ClinicRoutes;
