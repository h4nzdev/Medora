// hooks/useMedicalRecords.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function useMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch records function
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/medical-records/patient/${user._id}`
      );
      setRecords(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Run once when component mounts
  useEffect(() => {
    if (user?._id) {
      fetchRecords();
    }

    const interval = setInterval(() => {
      fetchRecords();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  return { records, loading, error, refetch: fetchRecords };
}

export default useMedicalRecords;
