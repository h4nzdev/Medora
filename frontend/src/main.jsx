import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DoctorProvider } from "./context/DoctorContext.jsx";
import { PatientsProvider } from "./context/PatientsContext.jsx";
import { AppointmentProvider } from "./context/AppointmentContext.jsx";
import { ClinicProvider } from "./context/ClinicContext.jsx";
import App from "./App.jsx";

// ✅ Correct import for PWA
import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DoctorProvider>
      <PatientsProvider>
        <AppointmentProvider>
          <ClinicProvider>
            <App />
          </ClinicProvider>
        </AppointmentProvider>
      </PatientsProvider>
    </DoctorProvider>
  </AuthProvider>
);

// ✅ Correct usage
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("New content available, reload to update.");
  },
  onOfflineReady() {
    console.log("App ready to work offline.");
  },
});
