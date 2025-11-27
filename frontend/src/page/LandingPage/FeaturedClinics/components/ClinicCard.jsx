import {
  Stethoscope,
  Users,
  MapPin,
  Clock,
  Shield,
  Star,
  Phone,
  Calendar,
} from "lucide-react";

const ClinicCard = ({ clinic }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden group">
    {/* Clinic Header with Full Size Image */}
    <div className="h-48 relative overflow-hidden bg-slate-100">
      {clinic.clinicPicture ? (
        <img
          src={clinic.clinicPicture}
          alt={clinic.clinicName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <p className="text-cyan-700 font-medium text-sm">Medical Center</p>
          </div>
        </div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

      {/* Subscription Badge */}
      <div className="absolute top-3 right-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            clinic.subscriptionPlan === "pro"
              ? "bg-cyan-600 text-white"
              : "bg-cyan-500 text-white"
          }`}
        >
          {clinic.subscriptionPlan.toUpperCase()}
        </span>
      </div>

      {/* Member Since */}
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 bg-white/90 rounded text-xs text-cyan-700 font-medium">
          Since {new Date(clinic.createdAt).getFullYear()}
        </span>
      </div>

      {/* Doctor Count */}
      <div className="absolute bottom-3 left-3">
        <span className="px-2 py-1 bg-white/90 rounded text-xs text-cyan-700 font-medium flex items-center gap-1">
          <Users className="w-3 h-3" />
          {clinic.doctors?.length || 0} Doctor
          {clinic.doctors?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>

    {/* Clinic Details */}
    <div className="p-5">
      {/* Clinic Name and Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
            {clinic.clinicName}
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= 4 ? "fill-cyan-500 text-cyan-500" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">4.8 (124)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-cyan-600">
            ₱{clinic.subscriptionAmount}
          </div>
          <div className="text-xs text-slate-500">month</div>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {["General Medicine", "Pediatrics", "Cardiology"]
            .slice(0, 2)
            .map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded border border-cyan-100"
              >
                {specialty}
              </span>
            ))}
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            +2 more
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-cyan-500" />
          <a
            href={`tel:${clinic.phone}`}
            className="text-sm text-slate-700 hover:text-cyan-600 transition-colors duration-200"
          >
            {clinic.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-500" />
          <p className="text-sm text-slate-700">
            {clinic.address.split(",")[0]}
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="mb-4 p-2 bg-cyan-50 rounded-lg border border-cyan-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span className="font-medium text-cyan-700">Open Today</span>
          </div>
          <span className="text-cyan-600">8:00 AM - 6:00 PM</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <a
          href={`/client/login?clinicId=${clinic._id}`}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <Calendar className="w-4 h-4" />
          Book Now
          <div className="w-2 h-2 bg-white rounded-full group-hover/btn:translate-x-1 transition-transform duration-200"></div>
        </a>

        <button className="p-2.5 border border-cyan-300 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors duration-200">
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Stats */}
      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-cyan-500" />
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-cyan-500" />
          <span>{clinic.doctors?.length || 0} Doctors</span>
        </div>
      </div>
    </div>
  </div>
);

export default ClinicCard;
