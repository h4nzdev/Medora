import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  User,
  Stethoscope,
  Star,
  Calendar,
  Search,
  Heart,
  Microscope,
  Brain,
  Baby,
  Bone,
  Flower,
  Eye,
  Sparkles,
  Sword,
  Mountain,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const DoctorsList = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Get unique specialties for categories
  const specialties = [
    ...new Set(doctors.map((doctor) => doctor.specialty)),
  ].filter(Boolean);

  // Filter doctors based on selected category and search term
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesCategory =
      selectedCategory === "all" || doctor.specialty === selectedCategory;
    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category icons mapping with Lucide React icons
  const getCategoryIcon = (specialty) => {
    const iconMap = {
      Cardiology: <Heart className="w-5 h-5" />,
      Dermatology: <Microscope className="w-5 h-5" />,
      Neurology: <Brain className="w-5 h-5" />,
      Pediatrics: <Baby className="w-5 h-5" />,
      Orthopedics: <Bone className="w-5 h-5" />,
      Dentistry: <Mountain className="w-5 h-5" />,
      Psychiatry: <Brain className="w-5 h-5" />,
      Surgery: <Sword className="w-5 h-5" />,
      Gynecology: <Flower className="w-5 h-5" />,
      Ophthalmology: <Eye className="w-5 h-5" />,
      default: <Stethoscope className="w-5 h-5" />,
    };

    const key = Object.keys(iconMap).find((key) =>
      specialty?.toLowerCase().includes(key.toLowerCase())
    );
    return iconMap[key] || iconMap.default;
  };

  // Get category background color
  const getCategoryColor = (specialty, isSelected) => {
    const colorMap = {
      Cardiology: isSelected ? "bg-red-500" : "bg-red-100 text-red-700",
      Dermatology: isSelected ? "bg-blue-500" : "bg-blue-100 text-blue-700",
      Neurology: isSelected ? "bg-purple-500" : "bg-purple-100 text-purple-700",
      Pediatrics: isSelected ? "bg-pink-500" : "bg-pink-100 text-pink-700",
      Orthopedics: isSelected
        ? "bg-orange-500"
        : "bg-orange-100 text-orange-700",
      Dentistry: isSelected ? "bg-teal-500" : "bg-teal-100 text-teal-700",
      Psychiatry: isSelected
        ? "bg-indigo-500"
        : "bg-indigo-100 text-indigo-700",
      Surgery: isSelected ? "bg-rose-500" : "bg-rose-100 text-rose-700",
      Gynecology: isSelected
        ? "bg-fuchsia-500"
        : "bg-fuchsia-100 text-fuchsia-700",
      Ophthalmology: isSelected
        ? "bg-amber-500"
        : "bg-amber-100 text-amber-700",
      default: isSelected ? "bg-cyan-500" : "bg-cyan-100 text-cyan-700",
    };

    const key = Object.keys(colorMap).find((key) =>
      specialty?.toLowerCase().includes(key.toLowerCase())
    );
    return colorMap[key] || colorMap.default;
  };

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50 w-full bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Specialty Categories */}
        <section className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Specialties</h2>
            <span className="text-sm text-slate-500">
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? "s" : ""} available
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                selectedCategory === "all"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-200"
                  : "bg-white/80 text-slate-700 border-slate-200 hover:border-cyan-300 hover:shadow-md"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  selectedCategory === "all" ? "bg-white/20" : "bg-cyan-100"
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="font-semibold">All Doctors</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedCategory === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {doctors.length}
              </span>
            </button>

            {/* Specialty Categories */}
            {specialties.map((specialty) => {
              const isSelected = selectedCategory === specialty;
              const colorClass = getCategoryColor(specialty, isSelected);

              return (
                <button
                  key={specialty}
                  onClick={() => setSelectedCategory(specialty)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                    isSelected
                      ? `${colorClass} text-white border-transparent shadow-lg shadow-cyan-200`
                      : "bg-white/80 text-slate-700 border-slate-200 hover:border-cyan-300 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-white/20" : colorClass.split(" ")[0]
                    }`}
                  >
                    {getCategoryIcon(specialty)}
                  </div>
                  <span className="font-semibold whitespace-nowrap">
                    {specialty}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doctors.filter((d) => d.specialty === specialty).length}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            {selectedCategory === "all" ? "All Doctors" : selectedCategory}
          </h2>
          <p className="text-slate-600 text-lg">
            {filteredDoctors.length} {selectedCategory.toLowerCase()} doctor
            {filteredDoctors.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Doctors Grid - Enhanced UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
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
                      style={{
                        backgroundImage: doctor.profileImage
                          ? `url(${doctor.profileImage})`
                          : "none",
                        backgroundColor: doctor.profileImage
                          ? "transparent"
                          : "#cffafe",
                      }}
                    >
                      {!doctor.profileImage && (
                        <User className="w-6 h-6 text-cyan-600" />
                      )}
                    </div>
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
                        $45
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
        {filteredDoctors.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
              <Stethoscope className="w-16 h-16 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No doctors found
            </h3>
            <p className="text-slate-500 text-lg">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No doctors available in this category"}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200"
              >
                Show All Doctors
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
