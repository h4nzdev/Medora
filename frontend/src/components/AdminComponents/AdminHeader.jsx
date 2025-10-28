import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import useResponsive from "../../hooks/useResponsive";

const AdminHeader = () => {
  const { isMobile } = useResponsive();

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-100/80 sticky top-0 z-40 p-4">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button className="md:hidden">
            <Menu />
          </button>
        )}
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      </div>
    </header>
  );
};

export default AdminHeader;
