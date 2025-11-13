import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    // Create the tour instance
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#tour-appointments-card",
          popover: {
            title: "📅 Today's Appointments",
            description:
              "View all appointments scheduled for today at your clinic. See the count and track your booking limits based on your subscription plan.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-quick-actions",
          popover: {
            title: "⚡ Quick Actions",
            description:
              "Quickly manage your clinic operations from here. Add doctors, manage appointments, or access patient chats without navigating elsewhere.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#tour-recent-appointments",
          popover: {
            title: "📋 Recent Appointments",
            description:
              "Check all recent appointment details including patient names, doctors, times, and status. Click 'View All' to see more appointments.",
            side: "top",
            align: "start",
          },
        },
      ],
    });

    // Start the tour
    driverObj.drive();

    // Cleanup
    return () => {
      if (driverObj) {
        driverObj.destroy();
      }
    };
  }, [tourEnabled]);
};
