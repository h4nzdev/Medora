import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import useResponsive from "../../hooks/useResponsive";

const AdminHeader = () => {
  const { isMobile } = useResponsive();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
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
