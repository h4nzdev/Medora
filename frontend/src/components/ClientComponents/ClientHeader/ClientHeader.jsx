"use client";

import { useContext } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { AuthContext } from "../../../context/AuthContext";

const ClientHeader = () => {
  const { user } = useContext(AuthContext);
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-100/80 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Branding */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-cyan-600">
              {user.clinicId?.clinicName}
            </a>
          </div>

          {/* Mobile Medical Records Button - Only visible on mobile */}

          {/* Spacer for desktop */}
          <div className="hidden sm:block flex-grow"></div>

          {/* Profile Dropdown */}
          <div className="ml-4 flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
