import RoleRoutes from "./routes/RoleRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReminderProvider } from "./context/ReminderContext";
import { NotificationProvider } from "./context/NotificationContext";
import InstallPWA from "./components/InstallPWA";

const App = () => {
  return (
    <>
      <NotificationProvider>
        <ReminderProvider>
          <RoleRoutes />
        </ReminderProvider>
      </NotificationProvider>
      <ToastContainer />
      <InstallPWA />
    </>
  );
};

export default App;
