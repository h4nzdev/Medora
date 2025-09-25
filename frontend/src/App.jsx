import RoleRoutes from "./routes/RoleRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReminderProvider } from "./context/ReminderContext";

const App = () => {
  return (
    <>
      <ReminderProvider>
        <RoleRoutes />
      </ReminderProvider>
      <ToastContainer />
    </>
  );
};

export default App;
