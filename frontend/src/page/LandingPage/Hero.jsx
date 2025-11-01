import { BarChart3, Clock, Shield, Award, Star } from "lucide-react";
import clinic from "../../assets/clinic.jpg";

const Hero = () => {
  return (
    <main
      className="pt-32 pb-24 container mx-auto px-6 relative overflow-hidden"
      id="hero"
      style={{
        backgroundImage: `url(/placeholder.svg?height=800&width=1600&query=abstract+medical+healthcare+pattern+light+blue+white)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content - Fixed Mobile Centering */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-200">
            <Award className="w-4 h-4" />
            Trusted by thousands of patients
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent leading-tight tracking-tighter">
            Your Personal Health
            <span className="block bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
              Companion
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Medora helps you manage your health with ease. Get instant advice
            from our AI symptom checker, schedule appointments, and keep track
            of your medical records, all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/clinic/register"
              className="group bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Create Your Account
                <div className="w-2 h-2 bg-white rounded-full group-hover:translate-x-1 transition-transform duration-200"></div>
              </span>
            </a>
            <a
              href="/clinic/login"
              className="bg-white text-cyan-600 font-bold text-base sm:text-lg px-6 sm:px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-cyan-100 hover:border-cyan-200"
            >
              For Clinics & Doctors
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">24/7 Available</span>
            </div>
          </div>
        </div>

        {/* Right Image - Responsive Sizing */}
        <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
          <div className="relative">
            {/* Main Image Container - Responsive Size */}
            <div className="w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl shadow-2xl border border-cyan-200 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder Content */}
              <img
                src={clinic || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover rounded-3xl"
              />

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1/3 left-4 w-4 h-4 bg-cyan-200 rounded-full animate-pulse delay-700"></div>
            </div>

            {/* Floating Cards - Responsive Positioning */}
            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Status</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Healthy
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Checkups</p>
                  <p className="text-sm font-semibold text-slate-800">
                    12 Done
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
