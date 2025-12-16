import React from "react";
// Import all necessary utility functions
import { useDate, useTime } from "../../../utils/date";
import { getStatusBadge, getStatusIcon } from "../../../utils/appointmentStats";
import { Clock } from "lucide-react";

const MobilePendingAppointment = ({
  clinicAppointments,
  showAll,
  setShowAll,
  handleAppointmentResponse,
  processingAppointments,
}) => {
  // 1. Filter all appointments to get only pending ones
  const pendingAppointments = clinicAppointments?.filter(
    (appointment) => appointment?.status?.toLowerCase() === "pending"
  );

  // 2. Slice the array based on the 'showAll' state
  const visiblePendingAppointments = showAll
    ? pendingAppointments
    : pendingAppointments?.slice(0, 3);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Appointments ({pendingAppointments?.length || 0})
        </h2>
        {pendingAppointments?.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-cyan-600 font-medium"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {visiblePendingAppointments?.length > 0 ? (
        <div className="space-y-3">
          {visiblePendingAppointments?.map((appointment) => (
            <div
              key={appointment?._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-amber-500"
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
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Clock className="w-3 h-3 mr-1" />
                {/* useDate and useTime are imported utilities */}
                {useDate(appointment?.date)} at {useTime(appointment?.date)}
              </div>
              <div className="flex justify-between items-center">
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                  {appointment?.type}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleAppointmentResponse(appointment?._id, "approve")
                    }
                    disabled={processingAppointments[appointment?._id]}
                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-medium disabled:opacity-50 flex items-center"
                  >
                    {processingAppointments[appointment?._id] === "approve" ? (
                      <>
                        <Clock className="w-3 h-3 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleAppointmentResponse(appointment?._id, "reject")
                    }
                    disabled={processingAppointments[appointment?._id]}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium disabled:opacity-50 flex items-center"
                  >
                    {processingAppointments[appointment?._id] === "reject" ? (
                      <>
                        <Clock className="w-3 h-3 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No pending appointments</p>
          <p className="text-sm mt-2">All appointments have been processed</p>
        </div>
      )}
    </div>
  );
};

export default MobilePendingAppointment;
