import ClinicHeader from "../components/ClinicComponents/ClinicHeader/ClinicHeader";
import ClinicSidebar from "../components/ClinicComponents/ClinicSidebar";
import useResponsive from "../hooks/useResponsive";
import MobileClinicView from "../page/ClinicPages/MobileClinicView";

const ClinicLayout = ({ children }) => {
  const isMobile = useResponsive();

  return isMobile ? (
    <MobileClinicView />
  ) : (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100">
      <ClinicSidebar />
      <div className="flex-1 md:ml-64 lg:ml-64">
        <ClinicHeader />
        <main className="p-6 w-full">{children}</main>
      </div>
    </div>
  );
};

export default ClinicLayout;
