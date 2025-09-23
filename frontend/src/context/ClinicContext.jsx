import axios from "axios";
import { createContext, useEffect, useState } from "react";

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

    const interval = setInterval(() => {
      fetchClinics()
    }, 5000)

    return () => clearInterval(interval)
  }, []);

  return (
    <ClinicContext.Provider value={{ clinics, setClinics, fetchClinics }}>
      {children}
    </ClinicContext.Provider>
  );
};
