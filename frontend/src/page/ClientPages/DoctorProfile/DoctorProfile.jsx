
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DoctorContext } from "../../../context/DoctorContext";
import { AuthContext } from "../../../context/AuthContext";
import AddAppointmentModal from "../../../components/ClientComponents/AddAppointmentModal/AddAppointmentModal";
import AddReviewModal from "../../../components/ClientComponents/AddReviewModal/AddReviewModal";
import {
  Stethoscope,
  GraduationCap,
  CalendarPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  MapPin,
  Star,
  Badge,
} from "lucide-react";

const DoctorProfile = () => {
  const { id } = useParams();
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isEligibleForReview, setIsEligibleForReview] = useState(false);

  const doctor = doctors.find((doc) => doc._id === id);

  const fetchReviews = async () => {
    if (doctor) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/doctor/${doctor._id}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [doctor]);

  useEffect(() => {
    // Mock eligibility check - In a real app, you would check for a completed appointment
    if (user && doctor) {
      // For demonstration, we'll just assume the user is eligible.
      // Replace this with actual logic, e.g., an API call to check appointment status.
      setIsEligibleForReview(true);
    }
  }, [user, doctor]);

  const handleReviewSubmitted = () => {
    fetchReviews(); // Re-fetch reviews to show the new one
  };

  if (!doctor) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
            <Stethoscope className="w-16 h-16 text-slate-400 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Doctor not found
          </h3>
          <p className="text-slate-500 text-lg">
            The requested doctor profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AddAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        doctorId={id}
      />
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={id}
        onReviewSubmitted={handleReviewSubmitted}
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
        <div className="mx-auto py-6">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8 mb-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {doctor.profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${doctor.profileImage}`}
                      alt={doctor.name}
                      className="rounded-2xl w-48 h-48 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center shadow-lg">
                      <User className="w-24 h-24 text-cyan-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight mb-4">
                  {doctor.name}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <Stethoscope className="w-5 h-5 mr-3 text-cyan-600" />
                    <span className="text-lg font-medium">
                      {doctor.specialty}
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <GraduationCap className="w-5 h-5 mr-3 text-emerald-600" />
                    <span className="text-lg font-medium">
                      {doctor.qualification || "MD"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <Award className="w-5 h-5 mr-3 text-amber-600" />
                    <span className="text-lg font-medium">
                      {doctor.experience || 0} years experience
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <User className="w-5 h-5 mr-3 text-purple-600" />
                    <span className="text-lg font-medium">
                      {doctor.gender || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-2 text-slate-600 font-semibold">
                      4.9 (150+ reviews)
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center lg:justify-start">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      doctor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Badge className="w-4 h-4" />
                    {doctor.status || "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-xl">
                  <div className="p-3 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-xl">
                    <Mail className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                      Email
                    </p>
                    <p className="text-slate-700 font-medium">
                      {doctor.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-xl">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                      Phone
                    </p>
                    <p className="text-slate-700 font-medium">
                      {doctor.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                Availability
              </h2>

              <div className="space-y-3">
                {doctor.availability && doctor.availability.length > 0 ? (
                  doctor.availability.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-slate-700">
                          {schedule.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p>No availability schedule provided</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              About Dr. {doctor.name.split(" ")[0] || doctor.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats */}
              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-2xl w-fit mx-auto mb-4">
                  <Award className="w-8 h-8 text-cyan-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">
                  {doctor.experience || 0}+
                </p>
                <p className="text-cyan-700 font-semibold">Years Experience</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl w-fit mx-auto mb-4">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">500+</p>
                <p className="text-emerald-700 font-semibold">Happy Patients</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl w-fit mx-auto mb-4">
                  <Star className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">4.9</p>
                <p className="text-amber-700 font-semibold">Patient Rating</p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-slate-50/80 rounded-xl">
              <p className="text-slate-600 leading-relaxed text-lg">
                Dr. {doctor.name} is a dedicated {doctor.specialty} with{" "}
                {doctor.experience || 0} years of experience in providing
                quality healthcare services. Known for compassionate care and
                expertise in the field, Dr.{" "}
                {doctor.name.split(" ")[0] || doctor.name} is committed to
                ensuring the best possible outcomes for all patients.
              </p>
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Patient Reviews
              </h2>
              {isEligibleForReview && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="group flex items-center justify-center px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Add Review
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="p-4 bg-slate-50/80 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800">{review.patient.name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 mt-2">{review.comment}</p>
                        <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p>No reviews yet for this doctor.</p>
                </div>
              )}
            </div>
          </div>

          {/* Book Appointment Button - At Bottom */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                Ready to schedule your appointment?
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                Book a consultation with Dr. {doctor.name} today
              </p>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="group flex items-center justify-center px-8 py-4 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 font-semibold text-lg mx-auto"
              >
                <CalendarPlus className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
