import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useSubscriptionTourGuide = (tourEnabled) => {
  useEffect(() => {
    if (!tourEnabled) return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-subscription-header",
            popover: {
              title: "💳 Flexible Plans",
              description:
                "Choose the perfect plan for your clinic. Start free and upgrade as you grow your patient base.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-subscription-cards",
            popover: {
              title: "📊 Plan Comparison",
              description:
                "Compare features across Free, Basic, and Pro plans. The Pro plan offers unlimited patients and premium support.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-subscription-features",
            popover: {
              title: "✅ Security & Support",
              description:
                "All plans include enterprise-grade security, HIPAA compliance, and 24/7 support. Cancel anytime!",
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
