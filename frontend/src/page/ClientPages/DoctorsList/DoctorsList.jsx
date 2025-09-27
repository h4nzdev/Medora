import { useContext } from 'react';
import { DoctorContext } from '../../../context/DoctorContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DoctorsList = () => {
  const { doctors } = useContext(DoctorContext);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
            Our Doctors
          </h1>
          <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
            Find the right doctor for your needs.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors duration-300">{doctor.name}</h2>
                  <p className="text-slate-600 font-medium">{doctor.specialty}</p>
                </div>
                <div className="mt-4">
                  <Link to={`/doctor/${doctor._id}`} className="flex items-center justify-center px-4 py-2 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 text-sm font-semibold">
                    View Full Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
