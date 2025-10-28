// actionFunctions.js
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  deleteAppointment,
  updateAppointment,
} from "../../../../services/appointmentService";

export const handleSetReminder = async (appointment) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`Appointment Reminder`, {
      body: `You have an appointment with ${
        appointment.doctorId?.name
      } on ${new Date(appointment.date).toLocaleString()}`,
    });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(`Appointment Reminder`, {
          body: `You have an appointment with ${
            appointment.doctorId?.name
          } on ${new Date(appointment.date).toLocaleString()}`,
        });
      }
    });
  }
  toast.success("🔔 Reminder set!");
};

export const handleDelete = async (id, setIsLoading, setIsOpen) => {
  const { value: result } = await Swal.fire({
    title: "Cancel Appointment?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, cancel",
    cancelButtonText: "Keep appointment",
    confirmButtonColor: "#dc2626",
  });

  if (result.isConfirmed) {
    setIsLoading(true);
    try {
      await deleteAppointment(id);
      toast.success("Appointment cancelled!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
};

export const handleRescheduleAppointment = async (
  appointment,
  setIsLoading,
  setIsOpen
) => {
  const { value: formValues } = await Swal.fire({
    title: "Reschedule Appointment",
    html: `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">New Date & Time</label>
          <input 
            id="new-datetime" 
            type="datetime-local" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="${new Date().toISOString().slice(0, 16)}"
            required
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Reason</label>
          <select id="reschedule-reason" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select reason...</option>
            <option value="Schedule conflict">Schedule conflict</option>
            <option value="Emergency">Emergency</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Reschedule",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#06b6d4",
    preConfirm: () => {
      const datetime = document.getElementById("new-datetime").value;
      const reason = document.getElementById("reschedule-reason").value;

      if (!datetime) {
        Swal.showValidationMessage("Please select date and time");
        return false;
      }
      if (!reason) {
        Swal.showValidationMessage("Please select a reason");
        return false;
      }

      return { datetime, reason };
    },
  });

  if (formValues) {
    setIsLoading(true);
    try {
      await updateAppointment(appointment._id, {
        date: formValues.datetime,
        status: "pending",
        reason: formValues.reason,
      });
      toast.success("Reschedule request sent!");
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("Failed to reschedule");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
};

export const handleEditAppointment = async (
  appointment,
  setIsLoading,
  setIsOpen
) => {
  const { value: formValues } = await Swal.fire({
    title: "Edit Appointment",
    html: `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
          <select id="appointment-type" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="consultation" ${
              appointment.type === "consultation" ? "selected" : ""
            }>Consultation</option>
            <option value="follow-up" ${
              appointment.type === "follow-up" ? "selected" : ""
            }>Follow-up</option>
            <option value="check-up" ${
              appointment.type === "check-up" ? "selected" : ""
            }>Check-up</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Booking Type</label>
          <select id="booking-type" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="online" ${
              appointment.bookingType === "online" ? "selected" : ""
            }>Online</option>
            <option value="walk-in" ${
              appointment.bookingType === "walk-in" ? "selected" : ""
            }>Walk-in</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Update",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#06b6d4",
    preConfirm: () => {
      const type = document.getElementById("appointment-type").value;
      const bookingType = document.getElementById("booking-type").value;
      return { type, bookingType };
    },
  });

  if (formValues) {
    setIsLoading(true);
    try {
      await updateAppointment(appointment._id, {
        type: formValues.type,
        bookingType: formValues.bookingType,
      });
      toast.success("Appointment updated!");
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update appointment");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
};
