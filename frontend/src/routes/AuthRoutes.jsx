import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ClientLogin from "../page/AuthPages/ClientAuth/ClientLogin";
import ClientRegister from "../page/AuthPages/ClientAuth/ClientRegister";
import ClinicLogin from "../page/AuthPages/ClinicAuth/ClinicLogin";
import ClinicRegister from "../page/AuthPages/ClinicAuth/ClinicRegister";
import LandingPage from "../page/LandingPage/LandingPage";
import AdminLogin from "../page/AuthPages/AdminAuth/AdminLogin";

const AuthRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/clinic/login" element={<ClinicLogin />} />
        <Route path="/clinic/register" element={<ClinicRegister />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/admin/secret/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthRoutes;
