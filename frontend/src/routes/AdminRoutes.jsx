import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../page/AdminPages/AdminDashboard/AdminDashboard";
import AdminClinics from "../page/AdminPages/AdminClinics/AdminClinics";
import AdminPatients from "../page/AdminPages/AdminPatients/AdminPatients";
import AdminFeedBack from "../page/AdminPages/AdminFeedBack/AdminFeedBack";
import AdminSystemUpdates from "../page/AdminPages/AdminSystemUpdates/AdminSystemUpdates";

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/clinics"
          element={
            <AdminLayout>
              <AdminClinics />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <AdminLayout>
              <AdminPatients />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminLayout>
              <AdminFeedBack />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/system-updates"
          element={
            <AdminLayout>
              <AdminSystemUpdates />
            </AdminLayout>
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
