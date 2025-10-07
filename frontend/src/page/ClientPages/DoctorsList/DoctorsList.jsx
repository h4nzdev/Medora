import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, User, Stethoscope, Star, Calendar } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";

const DoctorsList = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctor/clinic/${user.clinicId?._id}`
      );
      setDoctors(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  console.log(doctors);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto py-6">
        {/* Header Section */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
              Our Doctors
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
              Meet our team of experienced healthcare professionals ready to
              serve you.
            </p>
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-700 text-sm md:text-base font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Total Doctors
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">
                    {doctors.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 shadow-md">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 text-sm md:text-base font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Specialties
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">
                    {new Set(doctors.map((d) => d.specialty)).size}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-md">
                  <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm md:text-base font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Available
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">
                    {doctors.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-md">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Available Doctors
          </h2>
          <p className="text-slate-600 text-lg">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} ready to
            help you
          </p>
        </div>

        {/* Doctors Grid - Enhanced UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                {/* Doctor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center shadow-md bg-cover bg-center"
                      style={{ backgroundImage: `url(${doctor.profileImage})` }}
                    ></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors duration-300 mb-1">
                      {doctor.name}
                    </h2>
                    <p className="text-slate-600 font-medium text-sm mb-2">
                      {doctor.specialty}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-slate-700">4.8</span>
                      <span className="text-slate-500">(120+)</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info Card */}
                <div className="flex-grow bg-slate-50/80 rounded-xl p-4 mb-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Experience:</span>
                      <span className="font-semibold text-slate-700">
                        8+ years
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consultation:</span>
                      <span className="font-semibold text-emerald-600">
                      ₱45
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-green-600">
                        Available Today
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <Link
                    to={`/client/doctor/${doctor._id}`}
                    className="flex items-center justify-center px-4 py-3 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 font-semibold group w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    View Full Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
              <Stethoscope className="w-16 h-16 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No doctors available
            </h3>
            <p className="text-slate-500 text-lg">
              Please check back later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
