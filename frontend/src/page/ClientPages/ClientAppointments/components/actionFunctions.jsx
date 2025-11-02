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

export const handleRescheduleAppointment = async (
  appointment,
  setIsLoading,
  setIsOpen,
  setRescheduleModalOpen, // ADD THIS - to control the new modal
  setSelectedAppointment
) => {
  setIsOpen(false); // Close the dropdown menu
  setSelectedAppointment(appointment); // Set the appointment for the modal
  setRescheduleModalOpen(true);
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

export const handleCancelAppointment = async (id, setIsLoading, setIsOpen) => {
  const { value: result } = await Swal.fire({
    title: "Cancel Appointment?",
    text: "This will mark the appointment as cancelled.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, cancel",
    cancelButtonText: "Keep appointment",
    confirmButtonColor: "#dc2626",
  });

  if (result.isConfirmed) {
    setIsLoading(true);
    try {
      // Update status to cancelled instead of deleting
      await updateAppointment(id, {
        status: "cancelled",
      });
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

// ADD THIS - For actual deletion
// In your handleDeleteAppointment function, add console logs:
export const handleDeleteAppointment = async (id, setIsLoading, setIsOpen) => {
  console.log("Delete function called with ID:", id); // ADD THIS

  const result = await Swal.fire({
    title: "Delete Appointment?",
    text: "This will permanently remove the appointment from the system. This action cannot be undone!",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Yes, delete permanently",
    cancelButtonText: "Keep appointment",
    confirmButtonColor: "#dc2626",
    background: "#fee2e2",
  });

  if (result.isConfirmed) {
    setIsLoading(true);
    try {
      console.log("Attempting to delete appointment..."); // ADD THIS
      // Actually delete from database
      await deleteAppointment(id);
      console.log("Appointment deleted successfully"); // ADD THIS
      toast.error("Appointment permanently deleted!");
    } catch (error) {
      console.error("Delete error:", error); // ADD MORE DETAILS
      toast.error("Failed to delete appointment");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
};
