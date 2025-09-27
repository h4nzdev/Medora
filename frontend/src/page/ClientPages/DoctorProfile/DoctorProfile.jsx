import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DoctorContext } from '../../../context/DoctorContext';
import AddAppointmentModal from '../../../components/ClientComponents/AddAppointmentModal/AddAppointmentModal';
import { Stethoscope, GraduationCap, CalendarPlus } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const { doctors } = useContext(DoctorContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doctor = doctors.find((doc) => doc._id === id);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <>
      <AddAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctorId={id} />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <img src={doctor.picture} alt={doctor.name} className="rounded-full w-48 h-48 object-cover shadow-lg" />
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">{doctor.name}</h1>
                <div className="flex items-center text-slate-600 mt-2">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  <p className="text-lg font-medium">{doctor.specialty}</p>
                </div>
                <div className="flex items-center text-slate-600 mt-2">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <p className="text-lg">{doctor.education}</p>
                </div>
                <div className="mt-6">
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center justify-center px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 font-semibold"
                    >
                        <CalendarPlus className="w-5 h-5 mr-2" />
                        Book an Appointment
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
