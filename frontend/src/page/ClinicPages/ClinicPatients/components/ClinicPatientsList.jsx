import React from 'react';

const ClinicPatientsList = ({ patients }) => {
  return (
    <div className="space-y-3 px-4">
      {patients.length > 0 ? (
        patients.map((patient, index) => (
          <div
            key={patient._id}
            className={`
              bg-white rounded-2xl shadow-sm border border-slate-200 
              hover:shadow-md hover:border-blue-200 
              transition-all duration-300 ease-in-out
              hover:scale-[1.01] active:scale-[0.99]
              ${index % 2 === 0 ? '' : 'bg-slate-50/50'}
            `}
          >
            <div className="p-4">
              {/* Main patient info row */}
              <div className="flex items-center space-x-4 mb-3">
                {patient.patientPicture ? (
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${
                        patient.patientPicture
                      }`}
                      alt={patient.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
                    {patient.name ? patient.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-lg truncate pr-2">
                      {patient.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-md">
                      ID: {patient._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Age and Gender badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {patient.age} years
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          patient.gender?.toLowerCase() === "male"
                            ? "bg-blue-500"
                            : patient.gender?.toLowerCase() === "female"
                            ? "bg-pink-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <span className="capitalize text-slate-600 text-sm font-medium">
                        {patient.gender}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {/* Email */}
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-slate-500"
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
                  </div>
                  <span className="text-sm truncate flex-1" title={patient.email}>
                    {patient.email}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-slate-500"
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
                  </div>
                  <span className="text-sm font-mono">
                    {patient.phone}
                  </span>
                </div>

                {/* Address */}
                {patient.address && (
                  <div className="flex items-start gap-3 text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-slate-500"
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
                    </div>
                    <span className="text-sm leading-relaxed flex-1">
                      {patient.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Action indicator */}
              <div className="flex justify-end mt-3 pt-2">
                <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-slate-400"
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
            <h3 className="text-slate-600 font-semibold text-xl mb-2">
              No patients found
            </h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              There are no patients to display at the moment. Try adjusting your search or add new patients to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicPatientsList;