import PatientActions from "../../../../components/ClinicComponents/PatientActions/PatientActions";

const ClinicPatientsTableBody = ({ patients }) => {
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
                  {patient.patientPicture ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${
                        patient.patientPicture
                      }`}
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
          <td colSpan="7" className="text-center py-16">
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
