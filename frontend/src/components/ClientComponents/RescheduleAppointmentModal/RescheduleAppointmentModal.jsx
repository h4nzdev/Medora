"use client";

import { useState, useContext } from "react";
import { X, Calendar, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { updateAppointment } from "../../../services/appointmentService";

// Import tab components (we'll create these next)
import RescheduleDateTab from "./components/RescheduleDateTab";
import RescheduleTimeTab from "./components/RescheduleTimeTab";
import RescheduleConfirmationTab from "./components/RescheduleConfirmationTab";

const RescheduleAppointmentModal = ({ isOpen, onClose, appointment }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: appointment?.date ? new Date(appointment.date) : new Date(),
    time: appointment?.date
      ? new Date(appointment.date).toTimeString().slice(0, 5)
      : "",
    cancellationReason: "",
  });

  const nextTab = () => setCurrentTab((prev) => prev + 1);
  const prevTab = () => setCurrentTab((prev) => prev - 1);

  const handleReschedule = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.cancellationReason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // FIX: Properly combine date and time
      const year = formData.date.getFullYear();
      const month = String(formData.date.getMonth() + 1).padStart(2, "0");
      const day = String(formData.date.getDate()).padStart(2, "0");

      const appointmentDateTime = `${year}-${month}-${day}T${formData.time}:00.000Z`;

      console.log("📅 Sending update with:", {
        date: appointmentDateTime,
        time: formData.time,
        cancellationReason: formData.cancellationReason,
        isReschedule: true,
      });

      await updateAppointment(appointment._id, {
        date: appointmentDateTime,
        cancellationReason: formData.cancellationReason,
        isReschedule: true,
        status: "pending",
      });

      toast.success("Appointment rescheduled successfully!");
      onClose();
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("Failed to reschedule appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const totalSteps = 3;

  const tabContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <RescheduleDateTab
            formData={formData}
            setFormData={setFormData}
            nextTab={nextTab}
            originalDate={appointment?.date}
          />
        );
      case 2:
        return (
          <RescheduleTimeTab
            formData={formData}
            setFormData={setFormData}
            nextTab={nextTab}
            prevTab={prevTab}
            originalDate={appointment?.date}
            doctorId={appointment?.doctorId?._id}
          />
        );
      case 3:
        return (
          <RescheduleConfirmationTab
            formData={formData}
            setFormData={setFormData}
            prevTab={prevTab}
            originalAppointment={appointment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-300 border border-slate-200/50">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Reschedule Appointment
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Step {currentTab} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleReschedule} className="p-6 space-y-6">
          {tabContent()}

          {currentTab === totalSteps && (
            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-4 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.date ||
                  !formData.time ||
                  !formData.cancellationReason ||
                  isLoading
                }
                className="px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rescheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Confirm Reschedule
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
