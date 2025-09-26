import React, { useContext } from 'react';
import { Calendar } from 'lucide-react';
import { AppointmentContext } from '../../../context/AppointmentContext';
import { AuthContext } from '../../../context/AuthContext';
import { getStatusBadge1 } from '../../../utils/appointmentStats.jsx';
import { useDate, useTime } from '../../../utils/date.jsx';

const ClientTimeline = () => {
  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);

  // Filter and sort appointments
  const patientAppointments = appointments
    .filter(app => app.patientId?._id === user?._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
            Appointment Timeline
          </h1>
          <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
            A chronological view of all your appointments.
          </p>
        </header>

        <div className="relative pl-8">
          {/* The vertical line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200"></div>

          {patientAppointments.length > 0 ? (
            patientAppointments.map((appointment) => (
              <div key={appointment._id} className="relative mb-10">
                {/* The icon */}
                <div className="absolute -left-1 top-1 w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-cyan-500 to-sky-500 shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>

                {/* The content card */}
                <div className="ml-12 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      {appointment.doctorId?.name}
                    </h3>
                    {getStatusBadge1(appointment.status)}
                  </div>
                  <p className="text-slate-600 font-medium mb-4">{appointment.doctorId?.specialty}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50/80 rounded-lg p-3">
                      <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold">Date</p>
                      <p className="font-bold text-slate-700">{useDate(appointment.date)}</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-lg p-3">
                      <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold">Time</p>
                      <p className="font-bold text-slate-700">{useTime(appointment.date)}</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-lg p-3">
                      <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold">Type</p>
                      <p className="font-bold text-slate-700 capitalize">{appointment.type}</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-lg p-3">
                      <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold">Reason</p>
                      <p className="font-bold text-slate-700">{appointment.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ml-12 bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                No appointments found
              </h3>
              <p className="text-slate-500">
                Your appointment timeline is empty. Schedule a new appointment to see it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTimeline;
