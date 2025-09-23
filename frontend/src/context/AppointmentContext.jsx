import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/appointment`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(() => {
      fetchAppointments();
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments, fetchAppointments }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
