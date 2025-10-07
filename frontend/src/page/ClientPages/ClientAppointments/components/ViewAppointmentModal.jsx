import React from 'react';
import { X } from 'lucide-react';

const ViewAppointmentModal = ({ appointment, onClose }) => {
  if (!appointment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">Doctor</h3>
            <p className="text-gray-600">{appointment.doctorId?.name}</p>
            <p className="text-gray-500 text-sm">{appointment.doctorId?.specialty}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Date & Time</h3>
            <p className="text-gray-600">{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Status</h3>
            <p className="text-gray-600 capitalize">{appointment.status}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Type</h3>
            <p className="text-gray-600 capitalize">{appointment.type}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Reason</h3>
            <p className="text-gray-600">{appointment.reason || 'Not specified'}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;