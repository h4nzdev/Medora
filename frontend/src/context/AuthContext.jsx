import { createContext, useState, useCallback, useEffect } from "react";
import { getInitials } from "../utils/getInitials";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // Check localStorage first, then fall back to sessionStorage
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : false;
    } catch (error) {
      console.error("Failed to parse user from storage", error);
      // Clear corrupted data
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token"); // Clear token too
      sessionStorage.removeItem("token");
      return false;
    }
  });

  const [role, setRole] = useState(() => {
    // Priority: localStorage -> sessionStorage -> fallback
    return (
      localStorage.getItem("role") || sessionStorage.getItem("role") || "Clinic"
    );
  });

  // Centralized login function - UPDATED FOR JWT
  const login = useCallback((userData, userRole, rememberMe, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store user data and role
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("role", userRole);

    // ✅ STORE THE JWT TOKEN
    if (token) {
      storage.setItem("token", token);
    }

    // ✅ SET AXIOS DEFAULT HEADER for all future requests
    if (token) {
      // Make sure axios is imported in your main app file
      // or you can set this in each request
    }

    setUser(userData);
    setRole(userRole);
  }, []);

  // Centralized logout function - UPDATED FOR JWT
  const logout = useCallback(() => {
    // Clear credentials from all possible storages
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // Clear token
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token"); // Clear token

    // ✅ REMOVE AXIOS DEFAULT HEADER
    // You can add this if you set a default header

    // Reset state to default
    setUser(false);
    setRole("Clinic");
  }, []);

  // ✅ NEW: Function to get token for API calls
  const getToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }, []);

  const initials = user ? getInitials(user.name) : "";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        initials,
        setUser,
        setRole,
        getToken, // ✅ Add this new function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
