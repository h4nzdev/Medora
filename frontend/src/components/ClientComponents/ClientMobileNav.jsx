import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Book,
  Bell,
  MessageSquare,
  User,
  Plus,
  MoreHorizontal,
  FileText,
  X,
  Receipt,
} from "lucide-react";

const ClientMobileNav = () => {
  const path = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Hide entire nav when on AI Chat page
  const isChatPage = path.pathname === "/client/chats";

  if (isChatPage) {
    return null; // Don't render anything on chat page
  }

  const leftMenuItems = [
    { icon: Home, link: "/client/dashboard", label: "Home" },
    { icon: Calendar, link: "/client/appointments", label: "Appointments" },
  ];

  const rightMenuItems = [
    { icon: MessageSquare, link: "/client/chats", label: "AI Chat" },
    {
      icon: MoreHorizontal,
      action: () => setShowMoreMenu(!showMoreMenu),
      label: "More",
    },
  ];

  const moreMenuItems = [
    {
      icon: FileText,
      link: "/client/medical-records",
      label: "Medical Records",
    },
    { icon: Bell, link: "/client/reminders", label: "Reminders" },
    { icon: Receipt, link: "/client/invoices", label: "Invoices" },
  ];

  const isMoreMenuActive = moreMenuItems.some(
    (item) => path.pathname === item.link
  );

  return (
    <>
      {/* Backdrop for more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* Drop-up More Menu */}
      {showMoreMenu && (
        <div className="md:hidden fixed bottom-24 right-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/50 z-40 min-w-[160px] animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-2">
            {moreMenuItems.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                onClick={() => setShowMoreMenu(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  path.pathname === item.link
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-50/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {path.pathname === item.link && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/95 border-r border-b border-slate-200/50 transform rotate-45"></div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-2xl z-40 before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-200 before:to-transparent">
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
            {rightMenuItems.map((item, index) => {
              const isMoreButton = item.action;
              const isActive = isMoreButton
                ? showMoreMenu || isMoreMenuActive
                : path.pathname === item.link;

              if (isMoreButton) {
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ease-out relative p-2 sm:p-3 rounded-2xl group min-w-0 ${
                      isActive
                        ? "text-blue-600 bg-blue-50/70"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/50"
                    }`}
                  >
                    <div
                      className={`relative transition-all duration-300 ${
                        isActive
                          ? "transform scale-105"
                          : "group-hover:scale-105"
                      }`}
                    >
                      {showMoreMenu ? (
                        <X
                          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                            isActive ? "drop-shadow-sm" : ""
                          }`}
                        />
                      ) : (
                        <item.icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                            isActive ? "drop-shadow-sm" : ""
                          }`}
                        />
                      )}
                      {isActive && (
                        <div className="absolute -inset-1 bg-blue-100 rounded-full -z-10 animate-pulse"></div>
                      )}
                    </div>
                    <span
                      className={`text-xs transition-all duration-300 text-center leading-tight truncate w-full ${
                        isActive
                          ? "font-semibold text-blue-700"
                          : "font-medium group-hover:font-semibold"
                      }`}
                    >
                      {showMoreMenu ? "Close" : item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
                    )}
                  </button>
                );
              }

              return (
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
              );
            })}
          </div>
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom"></div>
      </nav>
    </>
  );
};

export default ClientMobileNav;
