import { Sparkles, User, ChevronDown } from "lucide-react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

const MobileHeader = ({ activeTab, handleChartsClick, user }) => {
  const { logout } = useContext(AuthContext);
  // State to manage the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown state
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Placeholder functions for profile and logout actions
  const handleProfileClick = () => {
    // TODO: Implement navigation to the user profile page
    console.log("Navigating to Profile...");
    setIsDropdownOpen(false); // Close dropdown after clicking
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false); // Close dropdown after clicking
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-500 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {user.clinicName}
            </h1>
            <p className="text-xs text-gray-500">
              {activeTab === "home" && "Dashboard"}
              {activeTab === "appointments" && "Appointments"}
              {activeTab === "pending" && "Pending"}
              {activeTab === "actions" && "Quick Actions"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Charts Button */}
          <button
            onClick={handleChartsClick}
            className={`px-3 py-1 text-xs rounded-lg ${
              user.subscriptionPlan === "pro"
                ? "bg-cyan-600 text-white hover:bg-cyan-700 transition"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={user.subscriptionPlan !== "pro"}
          >
            Charts {user.subscriptionPlan !== "pro" && "(Pro)"}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none flex items-center transition"
              aria-expanded={isDropdownOpen}
              aria-label="User menu"
            >
              <User className="w-5 h-5" />
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
