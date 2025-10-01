import React, { useContext } from "react";
import { DoctorContext } from "../../../../context/DoctorContext";
import { AuthContext } from "../../../../context/AuthContext";
import DoctorActions from "../../../../components/ClinicComponents/DoctorActions/DoctorActions";

const ClinicDoctorsTableBody = ({ onEditDoctor }) => {
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);

  const clinicDoctors = doctors?.filter(
    (doctor) => doctor.clinicId?._id === user._id
  );

  return (
    <tbody className="divide-y divide-slate-100">
      {clinicDoctors?.length > 0 ? (
        clinicDoctors.map((doctor, index) => (
          <tr
            key={doctor._id}
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
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center font-bold text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      {doctor.name ? doctor.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: {doctor._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
            </td>

            {/* Specialty with enhanced styling */}
            <td className="px-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-all duration-200">
                {doctor.specialty}
              </span>
            </td>

            {/* Phone with icon */}
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
                <span className="font-mono text-sm">{doctor.phone}</span>
              </div>
            </td>

            {/* Email with icon */}
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
                  title={doctor.email}
                >
                  {doctor.email}
                </span>
              </div>
            </td>

            {/* Status with enhanced styling */}
            <td className="px-4">
              <span
                className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                ${
                  doctor.status?.toLowerCase() === "active"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : doctor.status?.toLowerCase() === "inactive"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-slate-100 text-slate-800 border border-slate-200"
                }
                group-hover:shadow-sm transition-all duration-200
              `}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    doctor.status?.toLowerCase() === "active"
                      ? "bg-emerald-500"
                      : doctor.status?.toLowerCase() === "inactive"
                      ? "bg-red-500"
                      : "bg-slate-500"
                  }`}
                ></div>
                {doctor.status}
              </span>
            </td>

            {/* Actions with enhanced container */}
            <td className="px-4 text-center">
              <div className="flex justify-center">
                <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  <DoctorActions
                    id={doctor._id}
                    doctor={doctor}
                    onEdit={() => onEditDoctor(doctor)}
                  />
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-16">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-slate-600 font-medium text-lg mb-2">
                No doctors found
              </h3>
              <p className="text-slate-500 text-sm">
                No doctors are currently assigned to this clinic.
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default ClinicDoctorsTableBody;
