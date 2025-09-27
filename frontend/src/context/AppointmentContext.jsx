import axios from "axios";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client"; // Import socket.io-client

const socket = io(import.meta.env.VITE_API_URL); // Connect to the server

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/appointment`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    // 1. Initial fetch when the component mounts
    fetchAppointments();

    // 2. Set up the event listener for real-time updates
    socket.on("appointment_updated", () => {
      // When the backend tells us something changed, we refetch the data.
      fetchAppointments();
    });

    // 3. Clean up the listener when the component unmounts
    return () => {
      socket.off("appointment_updated");
    };
  }, []); // This effect runs only once

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments, fetchAppointments }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
