import React, { useState } from "react";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { updatePatientApproval } from "../../../../services/patient_services/patientService";
import PatientActions from "../../../../components/ClinicComponents/PatientActions/PatientActions";
import Swal from "sweetalert2";
import { toast } from "sonner";

const ClinicPatientsTableBody = ({ patients, onApprovalUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(null);

  // Status options configuration
  const approvalOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "text-amber-600",
      bg: "bg-amber-100",
      icon: Clock,
      description: "Awaiting approval",
    },
    {
      value: "approve",
      label: "Approved",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: CheckCircle,
      description: "Patient approved",
    },
    {
      value: "reject",
      label: "Rejected",
      color: "text-red-600",
      bg: "bg-red-100",
      icon: XCircle,
      description: "Registration rejected",
    },
  ];

  // Handle approval update
  const handleUpdateApproval = async (patientId, newApproval) => {
    try {
      const patient = patients.find((p) => p._id === patientId);
      const currentApproval = patient?.approval || "pending";

      if (currentApproval === newApproval) {
        setOpenDropdown(null);
        return;
      }

      const result = await Swal.fire({
        title: "Update Patient Status",
        text: `Change patient status from ${currentApproval} to ${newApproval}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setLoading(patientId);

        await updatePatientApproval(patientId, newApproval);

        // Update the patient in local state via parent
        if (onApprovalUpdate) {
          onApprovalUpdate(patientId, newApproval);
        }

        setOpenDropdown(null);
        setLoading(null);

        toast.success(`Patient status updated to ${newApproval}.`);
      }
    } catch (error) {
      console.error("Error updating patient approval:", error);
      toast.error("Error!", "Failed to update patient status.", "error");
      setLoading(null);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (patientId) => {
    setOpenDropdown(openDropdown === patientId ? null : patientId);
  };

  // Get approval badge component
  const getApprovalBadge = (approval, patientId) => {
    const option =
      approvalOptions.find((opt) => opt.value === approval) ||
      approvalOptions[0];
    const Icon = option.icon;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
            option.bg
          } ${option.color} border ${option.color.replace(
            "text-",
            "border-"
          )} border-opacity-30 min-w-[90px] justify-center`}
        >
          <Icon className="w-4 h-4" />
          {option.label}
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(patientId);
            }}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={loading === patientId}
          >
            {loading === patientId ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Dropdown menu */}
          {openDropdown === patientId && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden">
              <div className="p-2 flex flex-col gap-2">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Change Status
                </div>
                {approvalOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleUpdateApproval(patientId, option.value)
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        option.bg
                      } hover:opacity-90 ${
                        approval === option.value
                          ? "" + option.color.replace("text-", "ring-")
                          : ""
                      }`}
                      disabled={loading === patientId}
                    >
                      <Icon className={`w-4 h-4 ${option.color}`} />
                      <div className="text-left">
                        <div className={`font-medium ${option.color}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <tbody className="divide-y divide-slate-100">
      {patients.length > 0 ? (
        patients.map((patient, index) => (
          <tr
            key={patient._id}
            className={`
              group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
              transition-all duration-300 ease-in-out
              ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
              hover:shadow-sm hover:scale-[1.002] hover:z-10 relative
            `}
          >
            {/* Combined Picture and Name column */}
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {patient?.patientPicture ? (
                    <img
                      src={patient.patientPicture}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      {patient.name
                        ? patient.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                    {patient.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: {patient._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
            </td>

            {/* Age with badge styling */}
            <td className="px-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 group-hover:bg-blue-100 group-hover:text-blue-800 transition-all duration-200">
                {patient.age} yrs
              </span>
            </td>

            {/* Gender with icon and color coding */}
            <td className="px-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    patient.gender?.toLowerCase() === "male"
                      ? "bg-blue-500"
                      : patient.gender?.toLowerCase() === "female"
                      ? "bg-pink-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="capitalize text-slate-700 font-medium">
                  {patient.gender}
                </span>
              </div>
            </td>

            {/* Phone with better formatting */}
            <td className="px-4">
              <div className="flex items-center gap-2 text-slate-700">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-mono text-sm">{patient.phone}</span>
              </div>
            </td>

            {/* Approval Status */}
            <td className="px-4">
              {getApprovalBadge(patient.approval || "pending", patient._id)}
            </td>

            {/* Email with better styling */}
            <td className="px-4">
              <div className="flex items-center gap-2 text-slate-500">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className="text-sm truncate max-w-[200px]"
                  title={patient.email}
                >
                  {patient.email}
                </span>
              </div>
            </td>

            {/* Address with location icon */}
            <td className="px-4">
              <div className="flex items-start gap-2 text-slate-600">
                <svg
                  className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm line-clamp-2 max-w-[180px]">
                  {patient.address}
                </span>
              </div>
            </td>

            {/* Actions with enhanced container */}
            <td className="px-4 text-center">
              <div className="flex justify-center">
                <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  <PatientActions id={patient._id} />
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center py-16">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-slate-600 font-medium text-lg mb-2">
                No patients found
              </h3>
              <p className="text-slate-500 text-sm">
                Try adjusting your search criteria or add new patients to get
                started.
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default ClinicPatientsTableBody;
