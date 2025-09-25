import RoleRoutes from "./routes/RoleRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReminderProvider } from "./context/ReminderContext";
import InstallPWA from "./components/InstallPWA";

const App = () => {
  return (
    <>
      <ReminderProvider>
        <RoleRoutes />
      </ReminderProvider>
      <ToastContainer />
      <InstallPWA />
    </>
  );
};

export default App;
