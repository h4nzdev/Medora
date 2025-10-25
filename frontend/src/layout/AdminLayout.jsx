import { motion } from "framer-motion";
import AdminSidebar from "../components/AdminComponents/AdminSidebar";
import AdminMobileNav from "../components/AdminComponents/AdminMobileNav";
import AdminHeader from "../components/AdminComponents/AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <motion.div
      className="flex min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 w-full pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Nav for mobile */}
      <div className="md:hidden">
        <AdminMobileNav />
      </div>
    </motion.div>
  );
};

export default AdminLayout;
