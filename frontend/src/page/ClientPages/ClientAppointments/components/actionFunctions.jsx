// actionFunctions.js
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  deleteAppointment,
  updateAppointment,
} from "../../../../services/appointmentService";

export const handleSetReminder = async (appointment) => {
  // Implement reminder logic
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
  toast.success("🔔 Reminder set for appointment!");
};

export const handleDelete = async (id, setIsLoading, setIsOpen) => {
  const { value: result } = await Swal.fire({
    title: "Cancel Appointment",
    html: `
      <div class="text-center space-y-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-2">Are you sure?</h3>
          <p class="text-slate-600 text-sm">This action cannot be undone. The appointment will be permanently cancelled.</p>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Yes, cancel appointment",
    cancelButtonText: "Keep appointment",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    width: "420px",
    customClass: {
      popup: "rounded-xl shadow-xl border border-slate-200",
      confirmButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      cancelButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      header: "border-b-0 pb-0",
    },
  });

  if (result.isConfirmed) {
    setIsLoading(true);
    try {
      await deleteAppointment(id);
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while cancelling!");
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
      <div class="space-y-6">
        <!-- Current Appointment Card -->
        <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <h4 class="font-semibold text-slate-800 mb-3 text-sm">Current Appointment</h4>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-slate-600">${new Date(
                  appointment.date
                ).toLocaleDateString()}</p>
                <p class="text-slate-500 text-xs">${new Date(
                  appointment.date
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <p class="text-slate-600">Dr. ${appointment.doctorId?.name}</p>
                <p class="text-slate-500 text-xs">${
                  appointment.doctorId?.specialty
                }</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="space-y-4">
          <!-- New Date & Time -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">New Date & Time</label>
            <input 
              id="new-datetime" 
              type="datetime-local" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              min="${new Date().toISOString().slice(0, 16)}"
              required
            >
          </div>

          <!-- Reason for Reschedule -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Reason for Reschedule</label>
            <select 
              id="reschedule-reason" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a reason...</option>
              <option value="Schedule conflict">Schedule conflict</option>
              <option value="Emergency">Emergency</option>
              <option value="Doctor unavailable">Doctor unavailable</option>
              <option value="Personal reasons">Personal reasons</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Additional Notes -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
            <textarea 
              id="additional-notes" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none" 
              placeholder="Any additional information..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Confirm Reschedule",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#06b6d4",
    cancelButtonColor: "#64748b",
    width: "480px",
    customClass: {
      popup: "rounded-xl shadow-xl border border-slate-200",
      confirmButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      cancelButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      header: "border-b-0 pb-0",
      actions: "gap-3 mt-2",
    },
    preConfirm: () => {
      const datetime = document.getElementById("new-datetime").value;
      const reason = document.getElementById("reschedule-reason").value;
      const notes = document.getElementById("additional-notes").value;

      if (!datetime) {
        Swal.showValidationMessage("Please select a new date and time");
        return false;
      }

      if (!reason) {
        Swal.showValidationMessage("Please select a reason for rescheduling");
        return false;
      }

      return { datetime, reason, notes };
    },
  });

  if (formValues) {
    setIsLoading(true);
    try {
      await updateAppointment(appointment._id, {
        date: formValues.datetime,
        status: "pending",
        rescheduleReason: formValues.reason,
        rescheduleNotes: formValues.notes,
        previousDate: appointment.date,
        rescheduleRequested: true,
      });

      toast.success("Reschedule request sent! Waiting for clinic approval.");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Failed to reschedule appointment");
    } finally {
      setIsLoading(false);
      if (setIsOpen) setIsOpen(false);
    }
  }
};
export const handleEditAppointment = async (
  appointment,
  setIsLoading,
  setIsOpen
) => {
  const { value: formValues } = await Swal.fire({
    title: "Edit Appointment Details",
    html: `
      <div class="space-y-4">
        <!-- Appointment Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
          <select 
            id="appointment-type" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
          >
            <option value="check-up" ${
              appointment.type === "check-up" ? "selected" : ""
            }>Regular Check-up</option>
            <option value="consultation" ${
              appointment.type === "consultation" ? "selected" : ""
            }>Consultation</option>
            <option value="follow-up" ${
              appointment.type === "follow-up" ? "selected" : ""
            }>Follow-up</option>
            <option value="emergency" ${
              appointment.type === "emergency" ? "selected" : ""
            }>Emergency</option>
            <option value="other" ${
              appointment.type === "other" ? "selected" : ""
            }>Other</option>
          </select>
        </div>

        <!-- Booking Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Booking Type</label>
          <select 
            id="booking-type" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
          >
            <option value="online" ${
              appointment.bookingType === "online" ? "selected" : ""
            }>Online</option>
            <option value="walk-in" ${
              appointment.bookingType === "walk-in" ? "selected" : ""
            }>Walk-in</option>
          </select>
        </div>

        <!-- Additional Notes -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
          <textarea 
            id="appointment-notes" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none" 
            placeholder="Any special requirements or notes..."
            rows="3"
          >${appointment.notes || ""}</textarea>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update Appointment",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#06b6d4",
    cancelButtonColor: "#64748b",
    width: "420px",
    customClass: {
      popup: "rounded-xl shadow-xl border border-slate-200",
      confirmButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      cancelButton:
        "px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md transition-all",
      header: "border-b-0 pb-0",
      actions: "gap-3 mt-2",
    },
    preConfirm: () => {
      const type = document.getElementById("appointment-type").value;
      const bookingType = document.getElementById("booking-type").value;
      const notes = document.getElementById("appointment-notes").value;

      return { type, bookingType, notes };
    },
  });

  if (formValues) {
    setIsLoading(true);
    try {
      await updateAppointment(appointment._id, {
        type: formValues.type,
        bookingType: formValues.bookingType,
        notes: formValues.notes,
      });

      toast.success("Appointment updated successfully!");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    } finally {
      setIsLoading(false);
      if (setIsOpen) setIsOpen(false);
    }
  }
};
