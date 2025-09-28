import React, { useContext, useState } from "react";
import AppointmentActions from "./AppointmentActions";
import AddMedicalRecordModal from "../../../../components/ClinicComponents/AddMedicalRecordModal";
import {
  getStatusBadge,
  getStatusIcon,
} from "../../../../utils/appointmentStats";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDate, useTime } from "../../../../utils/date";
import { Video, Building } from "lucide-react";

const ClinicAppointmentsTableBody = ({ appointments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleComplete = (appointmentId) => {
    const appointment = appointments.find((app) => app._id === appointmentId);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancel = (appointmentId) => {
    // logic to cancel appointment
    console.log(`Cancelling appointment ${appointmentId}`);
  };

  const handleDelete = async (appointmentId) => {
    // Show confirmation first
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // red button
        cancelButtonColor: "#3085d6", // blue button
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Only delete if confirmed
          const res = await axios.delete(
            `http://localhost:3000/appointment/${appointmentId}`
          );
          toast.success(res.data.message);
        }
      });
    } catch (error) {
      if (error.response.data.message && error.response.data) {
        toast.error(error.data.message);
      }

      console.log("Error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <>
      <tbody>
        {appointments.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center py-6 text-slate-500 italic">
              No appointments found
            </td>
          </tr>
        ) : (
          <>
            {appointments.map((appointment) => (
              <tr
                key={appointment._id}
                className="hover:bg-slate-50 transition-colors border-t border-slate-200"
              >
                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-800">
                    {appointment.patientId?.name}
                  </p>
                  <p className="text-sm text-slate-500">ID: #0001</p>
                </td>
                <td className="px-4">
                  <p className="font-medium text-slate-700">
                    {appointment.doctorId?.name}
                  </p>
                </td>
                <td className="px-4">
                  <p className="font-medium text-slate-700">
                    {useDate(appointment.date)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {useTime(appointment.date)}
                  </p>
                </td>
                <td className="px-4">
                  <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm capitalize">
                    {appointment.type}
                  </span>
                </td>
                 <td className="px-4">
              <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm capitalize ${
                appointment.bookingType === "online" ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {appointment.bookingType === "online" ? <Video className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                {appointment.bookingType}
              </span>
            </td>
                <td className="px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm w-fit ${getStatusBadge(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 text-sm">
                  <p className="text-slate-700">
                    {appointment.patientId.phone}
                  </p>
                  <p className="text-slate-500">
                    {appointment.patientId.email}
                  </p>
                </td>
                <td className="px-4 text-right">
                  <AppointmentActions
                    appointmentId={appointment._id}
                    status={appointment.status}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
      {selectedAppointment && (
        <AddMedicalRecordModal
          isOpen={isModalOpen}
          onClose={closeModal}
          patientId={selectedAppointment.patientId._id}
          clinicId={selectedAppointment.clinicId._id}
          doctorId={selectedAppointment.doctorId._id}
          appointmentId={selectedAppointment._id}
        />
      )}
    </>
  );
};

export default ClinicAppointmentsTableBody;
