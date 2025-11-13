import React, { useContext, useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  Shield,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useProfileTourGuide } from "../../../hooks/useProfileTourGuide";

const ClinicProfile = () => {
  const { user } = useContext(AuthContext);
  const [showTour, setShowTour] = useState(false);

  // Check if this is the first visit to profile
  useEffect(() => {
    const hasVisitedProfile = localStorage.getItem("clinicProfileVisited");
    if (!hasVisitedProfile) {
      setShowTour(true);
      localStorage.setItem("clinicProfileVisited", "true");
    }
  }, []);

  useProfileTourGuide(showTour);
  // Mock reviews data for demonstration
  const [reviews] = useState([
    {
      id: 1,
      patient: "John Doe",
      rating: 5,
      comment: "Excellent service and friendly staff!",
      date: "2024-01-15",
    },
    {
      id: 2,
      patient: "Jane Smith",
      rating: 4,
      comment: "Great experience, would recommend!",
      date: "2024-01-10",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      rating: 5,
      comment: "Professional and efficient service.",
      date: "2024-01-08",
    },
  ]);

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Star distribution
  const starDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <div>
        {/* Hero Section */}
        <div
          id="tour-clinic-hero"
          className="bg-gradient-to-br from-cyan-500 to-sky-600 rounded-3xl p-8 mb-8 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Clinic Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                <img
                  src={user.clinicPicture}
                  alt={user.clinicName}
                  className="w-28 h-28 rounded-2xl object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden w-28 h-28 rounded-2xl bg-white/30 items-center justify-center flex-col">
                  <Users className="w-12 h-12 text-white" />
                  <span className="text-white text-sm font-medium mt-2">
                    Medora
                  </span>
                </div>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {user.clinicName}
                  </h1>
                  <p className="text-cyan-100 text-lg mb-4">
                    Managed by {user.contactPerson}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(averageRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-amber-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">
                      {averageRating.toFixed(1)} • {reviews.length} reviews
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold capitalize">
                    {user.subscriptionPlan} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Clinic Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                About Medora
              </h2>
              <p className="text-slate-600 leading-relaxed">
                A modern healthcare facility located in IT Park, providing
                comprehensive medical services with a focus on patient care and
                comfort. Under the management of {user.contactPerson}, we strive
                to deliver exceptional healthcare experiences.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-slate-700 font-medium">Address</p>
                    <p className="text-slate-600">{user.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-slate-700 font-medium">Phone</p>
                    <p className="text-slate-600">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-slate-700 font-medium">Email</p>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Reviews */}
            <div
              id="tour-clinic-reviews"
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Patient Reviews
              </h2>

              {/* Rating Summary */}
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-1">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(averageRating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-amber-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">
                    {reviews.length} reviews
                  </div>
                </div>

                {/* Star Distribution */}
                <div className="flex-1 space-y-2">
                  {starDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-slate-600 text-sm">
                          {item.stars}
                        </span>
                        <Star className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-sm w-8">
                        ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">
                        {review.patient}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-amber-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      {review.comment}
                    </p>
                    <span className="text-slate-500 text-xs">
                      {review.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Operating Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-cyan-500" />
                <h3 className="text-xl font-bold text-slate-800">
                  Operating Hours
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0"
                  >
                    <span className="font-medium text-slate-700">
                      {schedule.day}
                    </span>
                    <span className="text-slate-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinic Stats */}
            <div
              id="tour-clinic-stats"
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-cyan-500" />
                <h3 className="text-xl font-bold text-slate-800">
                  Clinic Stats
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Daily Limit</span>
                  <span className="font-semibold text-slate-800">
                    {user.dailyPatientLimit} patients
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Current Patients</span>
                  <span className="font-semibold text-slate-800">
                    {user.currentPatientCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Available Slots</span>
                  <span className="font-semibold text-emerald-600">
                    {user.dailyPatientLimit - user.currentPatientCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: "blue", label: "Facebook" },
                  { icon: Twitter, color: "sky", label: "Twitter" },
                  { icon: Instagram, color: "pink", label: "Instagram" },
                  { icon: Youtube, color: "red", label: "YouTube" },
                ].map((social, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors group"
                  >
                    <social.icon
                      className={`w-5 h-5 text-slate-600 group-hover:text-${social.color}-500 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Verified Clinic
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Fully licensed and accredited
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile;
