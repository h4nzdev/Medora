"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { User, LogOut, CalendarDays, Settings } from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/client/login");
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-10 h-10 bg-cover bg-center flex items-center justify-center hover:bg-slate-300 transition-colors duration-200 outline-none ring-2 ring-offset-2 ring-cyan-500"
        style={{ backgroundImage: `url(${user?.patientPicture})` }}
      ></button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100/80 py-2 z-50 animate-in fade-in-20 zoom-in-95 duration-200 md:hidden">
          <Link to="/client/profile">
            <button
              onClick={() => setIsOpen(false)}
              href="/client/profile"
              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <User className="w-4 h-4 mr-3" />
              Profile
            </button>
          </Link>
          <Link to="/client/calendar">
            <button
              onClick={() => setIsOpen(false)}
              href="/client/profile"
              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <CalendarDays className="w-4 h-4 mr-3" />
              Calendar
            </button>
          </Link>
          <Link to="/client/settings">
            <button
              onClick={() => setIsOpen(false)}
              href="/client/profile"
              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
