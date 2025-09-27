import React from 'react';

const ClinicDoctorsList = ({ doctors }) => {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                {doctor.name ? doctor.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-lg">
                  {doctor.name}
                </p>
                <p className="text-sm text-slate-600">{doctor.specialty}</p>
                <p className="text-sm text-slate-500">{doctor.email}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <h3 className="text-slate-600 font-medium text-lg">
            No doctors found
          </h3>
          <p className="text-slate-500 text-sm">
            There are no doctors to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClinicDoctorsList;
