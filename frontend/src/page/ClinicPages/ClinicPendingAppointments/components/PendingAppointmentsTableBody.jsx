import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  CheckCheck,
  Ban,
  Loader2,
} from "lucide-react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AppointmentContext } from "../../../../context/AppointmentContext";
import { AuthContext } from "../../../../context/AuthContext";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../../../../utils/emailService";
import { useDate, useTime } from "../../../../utils/date";

const PendingAppointmentsTableBody = ({ appointments }) => {
  const { fetchAppointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const [loadingStates, setLoadingStates] = useState({});

  const handleRespond = async (appointmentId, action) => {
    // Set loading state for this specific appointment
    setLoadingStates(prev => ({ ...prev, [appointmentId]: true }));

    try {
      // Find the appointment details for email
      const appointment = appointments.find(
        (apt) => apt._id === appointmentId
      );

      // Update appointment status first
      const res = await axios.patch(
        `http://localhost:3000/appointment/respond/${appointmentId}`,
        { action }
      );

      // Send email notification after successful status update
      if (appointment && appointment.patientId) {
        const appointmentDetails = {
          date: useDate(appointment.date),
          time: useTime(appointment.date), // use real time, fallback to 09:00 AM if missing
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
          // If email fails, still show success for the appointment update
          console.error("Email sending failed:", emailError);
          if (action === "approve") {
            toast.success(
              res.data.message ||
                "Appointment Approved! (Email notification failed)"
            );
          } else {
            toast.success(
              res.data.message ||
                "Appointment Rejected! (Email notification failed)"
            );
          }
        }
      } else {
        // Fallback if no appointment found or no patient email
        if (action === "approve") {
          toast.success(res.data.message || "Appointment Approved!");
        } else {
          toast.success(res.data.message || "Appointment Rejected!");
        }
      }

      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status.");
      console.error("Error responding:", error);
    } finally {
      // Clear loading state for this appointment
      setLoadingStates(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const confirmAction = (appointmentId, action) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleRespond(appointmentId, action);
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "scheduled":
        return <CalendarCheck className="w-4 h-4" />;
      case "completed":
        return <CheckCheck className="w-4 h-4" />;
      case "cancelled":
        return <Ban className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <tbody>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <tr
            key={appointment._id}
            className="hover:bg-slate-50 transition-colors border-t border-slate-200"
          >
            <td className="py-4 px-4">
              <p className="font-semibold text-slate-800">
                {appointment.patientId.name}
              </p>
              <p className="text-sm text-slate-500">ID: #0001</p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                {appointment.doctorId.name}
              </p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                {appointment.date.slice(1, 10)}
              </p>
              <p className="text-sm text-slate-500">09:00 AM</p>
            </td>
            <td className="px-4">
              <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm capitalize">
                {appointment.type}
              </span>
            </td>
            <td className="px-4">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm w-fit ${
                  {
                    pending:
                      "text-amber-700 bg-amber-50 border border-amber-200",
                    accepted:
                      "text-green-700 bg-green-50 border border-green-200",
                    rejected: "text-red-700 bg-red-50 border border-red-200",
                    scheduled:
                      "text-blue-700 bg-blue-50 border border-blue-200",
                    completed:
                      "text-purple-700 bg-purple-50 border border-purple-200",
                    cancelled:
                      "text-gray-700 bg-gray-50 border border-gray-200",
                  }[appointment.status] ||
                  "text-slate-700 bg-slate-100 border border-slate-200"
                }`}
              >
                {getStatusIcon(appointment.status)}
                {appointment.status}
              </span>
            </td>
            <td className="px-4 text-sm">
              <p className="text-slate-700">{appointment.patientId.phone}</p>
              <p className="text-slate-500">{appointment.patientId.email}</p>
            </td>
            <td className="px-4 text-right">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className={`p-2 rounded-md transition-all duration-200 ${
                    loadingStates[appointment._id]
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "hover:bg-slate-100 text-green-500 hover:text-green-600"
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
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-md transition-all duration-200 ${
                    loadingStates[appointment._id]
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "hover:bg-slate-100 text-red-500 hover:text-red-600"
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
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-8 text-slate-500">
            No pending appointments found.
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default PendingAppointmentsTableBody;
