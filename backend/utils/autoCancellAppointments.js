// utils/autoCancellAppointments.js
import cron from "node-cron";
import Appointment from "../model/appointmentModel.js";

export const startAutoCancelCron = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await Appointment.cancelExpiredAppointments();

      if (result.modifiedCount > 0) {
        console.log(
          `🕒 Auto-cancelled ${result.modifiedCount} expired appointments`
        );
      }
    } catch (error) {
      console.error("❌ Error in auto-cancel cron job:", error);
    }
  });

  console.log("✅ Auto-cancel cron job started");
};
