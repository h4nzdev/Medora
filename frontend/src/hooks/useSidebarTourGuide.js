import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useSidebarTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-sidebar-nav",
            popover: {
              title: "🗺️ Navigation Menu",
              description:
                "Access all your clinic features from here. Dashboard, appointments, patients, doctors, and more are just a click away.",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#tour-sidebar-profile",
            popover: {
              title: "👤 Your Profile",
              description:
                "Your clinic admin profile information. Quickly logout or manage your account from here.",
              side: "right",
              align: "end",
            },
          },
          {
            element: "#tour-sidebar-plan",
            popover: {
              title: "💳 Subscription Plan",
              description:
                "Your current subscription plan is displayed at the top. Upgrade anytime to unlock more features!",
              side: "right",
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
    }, 300);

    return () => clearTimeout(timer);
  }, [tourEnabled]);
};
