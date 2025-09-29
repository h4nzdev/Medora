"use client";

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

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

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-3.5-3.5a1.5 1.5 0 000-2.12L20 8a8 8 0 10-16 0l3.5 3.38a1.5 1.5 0 000 2.12L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <ProfileDropdown />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.name || 'Client User'}</p>
                <p className="text-xs text-slate-500">Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
