import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building, User } from "lucide-react";

const AdminMobileNav = () => {
  const path = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/admin/dashboard" },
    { icon: Building, label: "Clinics", link: "/admin/clinics" },
    { icon: User, label: "Patients", link: "/admin/patients" },
  ];

  const isItemActive = (link) => {
    return path.pathname === link;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center p-2">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              isItemActive(item.link)
                ? "bg-cyan-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminMobileNav;
