import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // Changed from sonner to sonner
import { DoctorContext } from "../../../context/DoctorContext";
import { AuthContext } from "../../../context/AuthContext";
import AddAppointmentModal from "../../../components/ClientComponents/AddAppointmentModal/AddAppointmentModal";
import AddReviewModal from "../../../components/ClientComponents/AddReviewModal/AddReviewModal";
import { getAppointmentsByPatient } from "../../../services/appointmentService";
import { getDoctorsByClinic } from "../../../services/doctor_services/doctorService";
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
  MessageCircle,
} from "lucide-react";
import { formatDate } from "../../../utils/date";
import { getInvoicesByPatient } from "../../../services/invoiceService";

const DoctorProfile = () => {
  const { id } = useParams();
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isEligibleForReview, setIsEligibleForReview] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false);
  const [checkingAppointment, setCheckingAppointment] = useState(true);

  const doctor = doctors?.find((doc) => doc._id === id);
  const hasUnpaid = invoices.some((invoice) => invoice.status === "unpaid");
  const balances = invoices.filter((invoice) => invoice.status === "unpaid");
  const totalAmount = balances.reduce(
    (sum, balance) => sum + (balance.totalAmount || 0),
    0
  );

  console.log(balances);

  const fetchReviews = async () => {
    if (doctor) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reviews/doctor/${doctor._id}`
        );
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
  };

  const checkPendingAppointment = async () => {
    if (!user?._id || !id) {
      setCheckingAppointment(false);
      return;
    }

    try {
      const appointments = await getAppointmentsByPatient(user._id);

      const pendingAppointment = appointments.find(
        (appointment) =>
          appointment.patientId?._id === user._id &&
          appointment.doctorId?._id === id &&
          (appointment.status === "scheduled" ||
            appointment.status === "pending")
      );

      setHasPendingAppointment(!!pendingAppointment);
    } catch (error) {
      console.error("Error checking pending appointment:", error);
      setHasPendingAppointment(false);
    } finally {
      setCheckingAppointment(false);
    }
  };

  useEffect(() => {
    checkPendingAppointment();
  }, [user, id]);

  useEffect(() => {
    fetchReviews();
  }, [doctor]);

  useEffect(() => {
    // Mock eligibility check - In a real app, you would check for a completed appointment
    if (user && doctor) {
      setIsEligibleForReview(true);
    }
  }, [user, doctor]);

  const handleReviewSubmitted = () => {
    fetchReviews(); // Re-fetch reviews to show the new one
  };

  const handleBook = () => {
    if (hasPendingAppointment) {
      return toast.warning(
        "You already have a pending appointment with this doctor. Please wait for it to be processed before booking another one.",
        {
          id: "pending-appointment-notif",
        }
      );
    }

    if (hasUnpaid) {
      return toast.warning(
        `You still have an unpaid balance of ₱${totalAmount}. Please settle it before booking a new appointment.`,
        {
          id: "unpaid-notif",
        }
      );
    }

    return setIsAppointmentModalOpen(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-orange-500";
  };

  const fetchInvoices = async () => {
    if (user?._id) {
      try {
        const data = await getInvoicesByPatient(user._id);
        setInvoices(data || []);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (!doctor) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 md:p-12 text-center max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
            <Stethoscope className="w-12 h-12 md:w-16 md:h-16 text-slate-400 mx-auto" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-2">
            Doctor not found
          </h3>
          <p className="text-slate-500 text-base md:text-lg">
            The requested doctor profile could not be found. try to refresh your
            browser
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
        onCheckPending={checkPendingAppointment}
      />
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={id}
        onReviewSubmitted={handleReviewSubmitted}
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
        <div className="mx-auto py-4 md:py-6">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="rounded-xl md:rounded-2xl w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center shadow-lg">
                      <User className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-cyan-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight mb-3 md:mb-4">
                  {doctor.name}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <Stethoscope className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-cyan-600 flex-shrink-0" />
                    <span className="text-base md:text-lg font-medium truncate">
                      {doctor.specialty}
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-emerald-600 flex-shrink-0" />
                    <span className="text-base md:text-lg font-medium">
                      {doctor.qualification || "MD"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-amber-600 flex-shrink-0" />
                    <span className="text-base md:text-lg font-medium">
                      {doctor.experience || 0} years experience
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <User className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-purple-600 flex-shrink-0" />
                    <span className="text-base md:text-lg font-medium">
                      {doctor.gender || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                    <span className="ml-2 text-slate-600 font-semibold text-sm md:text-base">
                      4.9 (150+ reviews)
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center lg:justify-start">
                  <span
                    className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-semibold ${
                      doctor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Badge className="w-3 h-3 md:w-4 md:h-4" />
                    {doctor.status || "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 md:mb-6">
                Contact Information
              </h2>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50/80 rounded-lg md:rounded-xl">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-lg md:rounded-xl flex-shrink-0">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-semibold">
                      Email
                    </p>
                    <p className="text-slate-700 font-medium text-sm md:text-base truncate">
                      {doctor.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50/80 rounded-lg md:rounded-xl">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg md:rounded-xl flex-shrink-0">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-semibold">
                      Phone
                    </p>
                    <p className="text-slate-700 font-medium text-sm md:text-base">
                      {doctor.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 md:mb-6">
                Availability
              </h2>

              <div className="space-y-3">
                {doctor.availability && doctor.availability.length > 0 ? (
                  doctor.availability.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 md:p-4 bg-slate-50/80 rounded-lg md:rounded-xl"
                    >
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex-shrink-0">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm md:text-base truncate">
                          {schedule.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 text-slate-600 flex-shrink-0">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-medium text-xs md:text-sm">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-slate-500">
                    <Clock className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm md:text-base">
                      No availability schedule provided
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 md:mb-6">
              About Dr. {doctor.name.split(" ")[0] || doctor.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Stats */}
              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                <div className="p-3 md:p-4 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-xl md:rounded-2xl w-fit mx-auto mb-3 md:mb-4">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
                  {doctor.experience || 0}+
                </p>
                <p className="text-cyan-700 font-semibold text-sm md:text-base">
                  Years Experience
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                <div className="p-3 md:p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl md:rounded-2xl w-fit mx-auto mb-3 md:mb-4">
                  <User className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
                  500+
                </p>
                <p className="text-emerald-700 font-semibold text-sm md:text-base">
                  Happy Patients
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                <div className="p-3 md:p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl md:rounded-2xl w-fit mx-auto mb-3 md:mb-4">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
                  4.9
                </p>
                <p className="text-amber-700 font-semibold text-sm md:text-base">
                  Patient Rating
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-6 p-4 md:p-6 bg-slate-50/80 rounded-lg md:rounded-xl">
              <p className="text-slate-600 leading-relaxed text-sm md:text-base lg:text-lg">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Patient Reviews
              </h2>
              {isEligibleForReview && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="group flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 text-white rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-500 font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Add Review
                </button>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="group p-4 md:p-6 bg-gradient-to-br from-white to-slate-50/50 rounded-xl md:rounded-2xl border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3 md:gap-5 md:flex-row flex-col">
                      {/* Avatar with responsive sizing */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-md">
                          <img
                            src={review?.patient?.patientPicture}
                            alt="Patient Picture"
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-full h-full bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center"
                            style={{ display: "none" }}
                          >
                            <User className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <MessageCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header - Stack on mobile, side by side on desktop */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-base md:text-lg group-hover:text-slate-900 transition-colors truncate">
                              {review.patient.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-xs md:text-sm text-slate-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Rating with responsive styling */}
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
                                    i < review.rating
                                      ? `${getRatingColor(
                                          review.rating
                                        )} fill-current`
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs md:text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">
                              {review.rating}/5
                            </div>
                          </div>
                        </div>

                        {/* Comment with responsive padding */}
                        <div className="relative">
                          <p className="text-slate-700 leading-relaxed text-sm md:text-base bg-gradient-to-br from-slate-50 to-white p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-100 shadow-sm break-words">
                            "{review.comment}"
                          </p>
                          <div className="absolute -top-2 left-3 md:left-4 w-3 h-3 md:w-4 md:h-4 bg-white border-l border-t border-slate-100 transform rotate-45"></div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="mt-3 md:mt-4 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-16 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
                    </div>
                    <div className="absolute top-1 md:top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <MessageCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-600 mb-2 px-4">
                    No Reviews Yet
                  </h3>
                  <p className="text-sm md:text-base text-slate-500 max-w-sm mx-auto px-4">
                    Be the first to share your experience with this doctor and
                    help others make informed decisions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Book Appointment Button - At Bottom */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 lg:p-8">
            <div className="text-center">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-2">
                Ready to schedule your appointment?
              </h3>
              <p className="text-slate-600 mb-4 md:mb-6 text-base md:text-lg">
                Book a consultation with Dr. {doctor.name} today
              </p>
              <button
                onClick={handleBook}
                disabled={
                  hasPendingAppointment || hasUnpaid || checkingAppointment
                }
                className={`group flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                  hasPendingAppointment || hasUnpaid || checkingAppointment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-sky-500 cursor-pointer hover:from-cyan-600 hover:to-sky-600"
                } font-semibold text-base md:text-lg mx-auto`}
              >
                {checkingAppointment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking...
                  </>
                ) : hasPendingAppointment ? (
                  <>
                    <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    Appointment Pending or Scheduled
                  </>
                ) : hasUnpaid ? (
                  <>
                    <span className="mr-2">⚠️</span>
                    Unpaid Balance
                  </>
                ) : (
                  <>
                    <CalendarPlus className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Book an Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
