import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useAppointmentsTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-appointments-stats",
            popover: {
              title: "📈 Appointment Statistics",
              description:
                "Track total, confirmed, pending, and completed appointments at a glance. Monitor your subscription limits.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-appointments-controls",
            popover: {
              title: "🔍 Search & Filter",
              description:
                "Search by patient or doctor name. Filter by status or doctor to find specific appointments quickly.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-appointments-table",
            popover: {
              title: "📋 Appointment List",
              description:
                "View all appointment details including patient info, doctor, date, type, and current status. Manage actions easily.",
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
