import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const usePendingAppointmentsTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-pending-header",
            popover: {
              title: "⏳ Pending Appointments",
              description:
                "View all appointments waiting for your response. Quick action required to confirm or reject bookings.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-pending-search",
            popover: {
              title: "🔍 Search & Filter",
              description:
                "Search pending appointments by patient or doctor name. Filter to find specific requests quickly.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-pending-table",
            popover: {
              title: "📋 Action Required",
              description:
                "Review pending appointment details and take actions. Accept or reject bookings to manage your schedule.",
              side: "top",
              align: "start",
            },
          },
        ],
      });

      driverObj.drive();

      return () => {
        if (driverObj) {
          driverObj.destroy();
        }
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [tourEnabled]);
};
