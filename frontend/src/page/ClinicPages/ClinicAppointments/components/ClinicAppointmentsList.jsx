import React from "react";
import { getStatusBadge, getStatusIcon } from "../../../../utils/appointmentStats";
import { useDate, useTime } from "../../../../utils/date";

const ClinicAppointmentsList = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-lg">
                  {appointment.patientId?.name}
                </p>
                <p className="text-sm text-slate-600">
                  with Dr. {appointment.doctorId?.name}
                </p>
                <div className="mt-2 text-sm text-slate-500">
                  <p>{useDate(appointment.date)}</p>
                  <p>{useTime(appointment.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm w-fit ${getStatusBadge(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <h3 className="text-slate-600 font-medium text-lg">
            No appointments found
          </h3>
          <p className="text-slate-500 text-sm">
            There are no appointments to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClinicAppointmentsList;
