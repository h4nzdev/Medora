import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patient`);
      setPatients(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PatientsContext.Provider value={{ patients, setPatients, fetchPatients }}>
      {children}
    </PatientsContext.Provider>
  );
};
