import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Book,
  Bell,
  MessageSquare,
  User,
  Plus,
} from "lucide-react";

const ClientMobileNav = () => {
  const path = useLocation();

  const leftMenuItems = [
    { icon: Home, link: "/client/dashboard", label: "Home" },
    { icon: Calendar, link: "/client/appointments", label: "Appointments" },
  ];

  const rightMenuItems = [
    { icon: MessageSquare, link: "/client/chats", label: "AI Chat" },
    { icon: Bell, link: "/client/reminders", label: "Reminders" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-2xl z-50 before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-200 before:to-transparent">
      <div className="flex justify-between items-center h-20 px-3 sm:px-4 max-w-md mx-auto relative">
        {/* Left menu items */}
        <div className="flex flex-1 justify-around">
          {leftMenuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ease-out relative p-2 sm:p-3 rounded-2xl group min-w-0 ${
                path.pathname === item.link
                  ? "text-blue-600 bg-blue-50/70"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`relative transition-all duration-300 ${
                  path.pathname === item.link
                    ? "transform scale-105"
                    : "group-hover:scale-105"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                    path.pathname === item.link ? "drop-shadow-sm" : ""
                  }`}
                />
                {path.pathname === item.link && (
                  <div className="absolute -inset-1 bg-blue-100 rounded-full -z-10 animate-pulse"></div>
                )}
              </div>
              <span
                className={`text-xs transition-all duration-300 text-center leading-tight truncate w-full ${
                  path.pathname === item.link
                    ? "font-semibold text-blue-700"
                    : "font-medium group-hover:font-semibold"
                }`}
              >
                {item.label}
              </span>
              {path.pathname === item.link && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Center plus button */}
        <div className="flex-shrink-0 mx-2">
          <Link
            to="/client/doctors"
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-out relative group ${
              path.pathname === "/client/doctors"
                ? "text-white"
                : "text-white hover:scale-105"
            }`}
          >
            <div
              className={`relative transition-all duration-300 p-3 rounded-full ${
                path.pathname === "/client/doctors"
                  ? "bg-cyan-600 shadow-lg shadow-cyan-500/30 scale-110"
                  : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30 group-hover:scale-105"
              }`}
            >
              <Plus
                className="w-6 h-6 transition-all duration-300"
                strokeWidth={2.5}
              />
              {path.pathname === "/client/doctors" && (
                <div className="absolute -inset-2 bg-cyan-400/30 rounded-full -z-10 animate-pulse"></div>
              )}
            </div>
            <span
              className={`text-xs transition-all duration-300 text-center leading-tight mt-1 ${
                path.pathname === "/client/doctors"
                  ? "font-semibold text-cyan-700"
                  : "font-medium text-slate-600 group-hover:font-semibold group-hover:text-cyan-600"
              }`}
            >
              Doctors
            </span>
          </Link>
        </div>

        {/* Right menu items */}
        <div className="flex flex-1 justify-around">
          {rightMenuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ease-out relative p-2 sm:p-3 rounded-2xl group min-w-0 ${
                path.pathname === item.link
                  ? "text-blue-600 bg-blue-50/70"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`relative transition-all duration-300 ${
                  path.pathname === item.link
                    ? "transform scale-105"
                    : "group-hover:scale-105"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                    path.pathname === item.link ? "drop-shadow-sm" : ""
                  }`}
                />
                {path.pathname === item.link && (
                  <div className="absolute -inset-1 bg-blue-100 rounded-full -z-10 animate-pulse"></div>
                )}
              </div>
              <span
                className={`text-xs transition-all duration-300 text-center leading-tight truncate w-full ${
                  path.pathname === item.link
                    ? "font-semibold text-blue-700"
                    : "font-medium group-hover:font-semibold"
                }`}
              >
                {item.label}
              </span>
              {path.pathname === item.link && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom"></div>
    </nav>
  );
};

export default ClientMobileNav;
