import {
  Stethoscope,
  Users,
  MapPin,
  Clock,
  Shield,
  Star,
  MapPinIcon,
  PhoneIcon,
  Calendar,
} from "lucide-react";

const ClinicCard = ({ clinic }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group z-40">
    {/* Clinic Header with Image and Overlay */}
    <div className="h-48 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
      {clinic.clinicPicture ? (
        <img
          src={clinic.clinicPicture}
          alt={clinic.clinicName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <p className="text-cyan-700 font-semibold text-lg">Medical Center</p>
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>

      {/* Subscription Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
            clinic.subscriptionPlan === "pro"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-300"
              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-blue-300"
          }`}
        >
          {clinic.subscriptionPlan.toUpperCase()} PLAN
        </span>
      </div>

      {/* Member Since */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs text-slate-700 font-semibold shadow-sm">
          🏥 Since {new Date(clinic.createdAt).getFullYear()}
        </span>
      </div>

      {/* Doctor Count */}
      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs text-slate-700 font-semibold shadow-sm flex items-center gap-1">
          <Users className="w-3 h-3" />
          {clinic.doctors?.length || 0} Doctor
          {clinic.doctors?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>

    {/* Clinic Details */}
    <div className="p-6">
      {/* Clinic Name and Rating */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors duration-200 mb-1">
            {clinic.clinicName}
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">4.8 (124 reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-600">
            ₱{clinic.subscriptionAmount}
          </div>
          <div className="text-xs text-slate-500">per month</div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="mb-4">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">
          🏥 Medical Specialties
        </h5>
        <div className="flex flex-wrap gap-2">
          {["General Medicine", "Pediatrics", "Cardiology", "Dermatology"]
            .slice(0, 3)
            .map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full border border-cyan-200"
              >
                {specialty}
              </span>
            ))}
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            +2 more
          </span>
        </div>
      </div>
      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <PhoneIcon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Phone</p>
            <a
              href={`tel:${clinic.phone}`}
              className="text-sm font-medium text-slate-800 hover:text-cyan-600"
            >
              {clinic.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <MapPinIcon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm font-medium text-slate-800">
              {clinic.address.split(",")[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Clinic Hours */}
      <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">
              Open Today
            </span>
          </div>
          <span className="text-sm text-amber-700">8:00 AM - 6:00 PM</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <a
          href={`/client/login?clinicId=${clinic._id}`}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <Calendar className="w-4 h-4" />
          Book Appointment
          <div className="w-2 h-2 bg-white rounded-full group-hover/btn:translate-x-1 transition-transform duration-200"></div>
        </a>

        <button className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors duration-200 hover:border-cyan-200 hover:text-cyan-600">
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-green-500" />
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-500" />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-purple-500" />
          <span>500+ Patients</span>
        </div>
      </div>
    </div>
  </div>
);

export default ClinicCard;
