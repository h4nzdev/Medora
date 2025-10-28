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
      return false;
    }
  });

  const [role, setRole] = useState(() => {
    // Priority: localStorage -> sessionStorage -> fallback
    return (
      localStorage.getItem("role") || sessionStorage.getItem("role") || "Clinic"
    );
  });

  // Centralized login function
  const login = useCallback((userData, userRole, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("role", userRole);
    setUser(userData);
    setRole(userRole);
  }, []);

  // Centralized logout function
  const logout = useCallback(() => {
    // Clear credentials from all possible storages
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

    // Reset state to default
    setUser(false);
    setRole("Clinic"); // or null, depending on desired default state
  }, []);

  const initials = user ? getInitials(user.name) : "";

  return (
    <AuthContext.Provider
      value={{ user, role, login, logout, initials, setUser, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
