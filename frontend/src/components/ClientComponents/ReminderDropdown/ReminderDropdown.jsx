import React, { useState, useRef, useEffect, useContext } from "react";
import { MoreVertical, Edit3, Bell, ChevronDown } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const ReminderDropdown = ({ onEdit, reminder }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
    <div className="relative z-20" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="dropdown-btn group w-full flex items-center justify-center px-4 py-3 bg-slate-100/80 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-slate-200/80 hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-200/50"
        type="button"
      >
        <MoreVertical className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-semibold tracking-wide flex-1">Options</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute md:top-full bottom-full right-0 mt-1 w-48 z-50">
          <div className="py-1 bg-white rounded-xl shadow-xl border border-slate-200">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onEdit();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </a>
            <div className="flex items-center px-4 py-2 text-sm text-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Notified: {reminder.notifiedCount || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderDropdown;
