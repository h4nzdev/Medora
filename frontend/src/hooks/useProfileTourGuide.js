import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useProfileTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    // Create the tour instance
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#tour-clinic-hero",
          popover: {
            title: "👋 Welcome to Your Profile",
            description:
              "This is your clinic's public profile. It displays your clinic information, rating, subscription plan, and credentials to patients.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-clinic-reviews",
          popover: {
            title: "⭐ Patient Reviews & Ratings",
            description:
              "See your average rating, review breakdown, and individual patient feedback. This builds trust with potential patients.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#tour-clinic-stats",
          popover: {
            title: "📊 Clinic Statistics",
            description:
              "Track your daily patient limits, current patient count, and available appointment slots at a glance.",
            side: "left",
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
