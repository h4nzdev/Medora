import React from "react";
// Assuming Link comes from react-router-dom or similar routing library
import { Link } from "react-router-dom";
// Assuming icons come from lucide-react (or similar)
import { Plus, Eye, MessageSquare, Users } from "lucide-react";

const MobileActions = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Add Doctor */}
        <Link
          to="/clinic/doctors"
          className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-cyan-100 transition-colors"
        >
          <div className="bg-cyan-500 p-2 rounded-lg mb-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">Add Doctor</span>
          <span className="text-xs text-gray-600 text-center">New doctor</span>
        </Link>

        {/* Manage Appointments */}
        <Link
          to="/clinic/appointments"
          className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-sky-100 transition-colors"
        >
          <div className="bg-sky-500 p-2 rounded-lg mb-2">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            Appointments
          </span>
          <span className="text-xs text-gray-600 text-center">
            Manage bookings
          </span>
        </Link>

        {/* View Patient Chats */}
        <Link
          to="/clinic/patients-chats"
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors"
        >
          <div className="bg-blue-500 p-2 rounded-lg mb-2">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            Patient Chats
          </span>
          <span className="text-xs text-gray-600 text-center">
            AI chat history
          </span>
        </Link>

        {/* View Patients */}
        <Link
          to="/clinic/patients"
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-emerald-100 transition-colors"
        >
          <div className="bg-emerald-500 p-2 rounded-lg mb-2">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            View Patients
          </span>
          <span className="text-xs text-gray-600 text-center">
            All patients
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileActions;
