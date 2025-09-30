import RoleRoutes from "./routes/RoleRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReminderProvider } from "./context/ReminderContext";
import { NotificationProvider } from "./context/NotificationContext";
import InstallPWA from "./components/InstallPWA";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <NotificationProvider>
        <ReminderProvider>
          <RoleRoutes />
        </ReminderProvider>
      </NotificationProvider>
      <ToastContainer />
      <Toaster richColors position="top-right" />
      <InstallPWA />
    </>
  );
};

export default App;
