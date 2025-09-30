import React, { useContext, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { AppointmentContext } from "../../../../context/AppointmentContext";
import { AuthContext } from "../../../../context/AuthContext";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../../../../utils/emailService";
import { useDate, useTime } from "../../../../utils/date";

const PendingAppointmentsList = ({ appointments }) => {
  const { fetchAppointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const [loadingStates, setLoadingStates] = useState({});

  const handleRespond = async (appointmentId, action) => {
    setLoadingStates((prev) => ({ ...prev, [appointmentId]: true }));

    try {
      const appointment = appointments.find((apt) => apt._id === appointmentId);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/appointment/respond/${appointmentId}`,
        { action }
      );

      if (appointment && appointment.patientId) {
        const appointmentDetails = {
          date: useDate(appointment.date),
          time: useTime(appointment.date),
          doctorName: appointment.doctorId?.name || "Dr. Unknown",
          clinicName: user?.clinicName || "Our Clinic",
        };

        try {
          if (action === "approve") {
            await sendApprovalEmail(
              appointment.patientId.email,
              appointment.patientId.name,
              appointmentDetails
            );
            toast.success("Appointment approved and email sent!");
          } else {
            await sendRejectionEmail(
              appointment.patientId.email,
              appointment.patientId.name,
              appointmentDetails
            );
            toast.success("Appointment rejected and email sent!");
          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          toast.success(
            `${
              res.data.message || "Appointment status updated!"
            } (Email failed)`
          );
        }
      } else {
        toast.success(res.data.message || "Appointment status updated!");
      }

      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status.");
      console.error("Error responding:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const confirmAction = (appointmentId, action) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${action} this appointment.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#3085d6" : "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleRespond(appointmentId, action);
      }
    });
  };

  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex-1 mb-4">
              <p className="font-semibold text-slate-800 text-lg">
                {appointment.patientId.name}
              </p>
              <p className="text-sm text-slate-600">
                with Dr. {appointment.doctorId.name}
              </p>
              <div className="mt-2 text-sm text-slate-500">
                <p>{useDate(appointment.date)}</p>
                <p>{useTime(appointment.date)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-white ${
                  loadingStates[appointment._id]
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                aria-label="Reject"
                disabled={loadingStates[appointment._id]}
                onClick={() => confirmAction(appointment._id, "reject")}
              >
                {loadingStates[appointment._id] ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                Reject
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-white ${
                  loadingStates[appointment._id]
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                aria-label="Accept"
                disabled={loadingStates[appointment._id]}
                onClick={() => confirmAction(appointment._id, "approve")}
              >
                {loadingStates[appointment._id] ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                Approve
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <h3 className="text-slate-600 font-medium text-lg">
            No pending appointments
          </h3>
          <p className="text-slate-500 text-sm">
            All appointments have been reviewed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingAppointmentsList;
