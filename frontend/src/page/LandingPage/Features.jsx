import { Stethoscope, FileText, Users, BarChart3 } from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="py-18 bg-gradient-to-b from-white to-slate-50 relative"
      style={{
        backgroundImage: `url(/placeholder.svg?height=1000&width=1600&query=subtle+geometric+hexagon+pattern+medical+light+cyan+white)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Key Features
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need for a seamless healthcare experience, powered by
            cutting-edge technology.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-10 h-10 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              AI Symptom Checker
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Get instant, AI-powered advice on your symptoms with our advanced
              diagnostic tool.
            </p>
          </div>
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="w-10 h-10 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              Appointment Booking
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Easily schedule appointments with doctors and clinics in just a
              few clicks.
            </p>
          </div>
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              Medical Records
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Keep all your medical records securely organized and accessible
              anywhere.
            </p>
          </div>
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              Clinic Management
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Comprehensive tools for clinics to manage patients and
              appointments efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
