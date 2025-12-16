import React from "react";
import { useDate, useTime } from "../../../utils/date";
import { getStatusBadge, getStatusIcon } from "../../../utils/appointmentStats";
import { Clock } from "lucide-react";

const MobileAppointment = ({ showAll, setShowAll, visibleAppointments }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Appointments
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-cyan-600 font-medium"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
      <div className="space-y-3">
        {visibleAppointments?.length > 0 ? (
          visibleAppointments?.map((appointment) => (
            <div
              key={appointment?._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {appointment.patientId?.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {appointment.doctorId?.name || "Doctor unavailable"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    appointment?.status
                  )}`}
                >
                  {getStatusIcon(appointment?.status)}
                  <span className="ml-1 text-xs capitalize">
                    {appointment?.status}
                  </span>
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {useDate(appointment?.date)} at {useTime(appointment?.date)}
              </div>
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                {appointment?.type}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAppointment;
