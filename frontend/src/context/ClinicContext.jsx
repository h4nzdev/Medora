import axios from "axios";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
  const [clinics, setClinics] = useState();

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/clinic`);
      setClinics(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchClinics();

    socket.on("clinic_updated", () => {
      fetchClinics();
    });

    return () => {
      socket.off("clinic_updated");
    };
  }, []);

  return (
    <ClinicContext.Provider value={{ clinics, setClinics, fetchClinics }}>
      {children}
    </ClinicContext.Provider>
  );
};
