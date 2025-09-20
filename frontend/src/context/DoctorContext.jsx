import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState();

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/doctor");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, setDoctors, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
