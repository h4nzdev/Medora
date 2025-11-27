import { useState } from "react";
import {
  Stethoscope,
  FileText,
  Users,
  BarChart3,
  Sparkles,
  Zap,
  Shield,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Features = () => {
  const [expandedFeature, setExpandedFeature] = useState(null);

  const features = [
    {
      icon: BarChart3,
      title: "AI Symptom Checker",
      desc: "Get instant, AI-powered advice on your symptoms with our advanced diagnostic tool.",
      badge: Zap,
    },
    {
      icon: Stethoscope,
      title: "Appointment Booking",
      desc: "Easily schedule appointments with doctors and clinics in just a few clicks.",
      badge: Heart,
    },
    {
      icon: FileText,
      title: "Medical Records",
      desc: "Keep all your medical records securely organized and accessible anywhere.",
      badge: Shield,
    },
    {
      icon: Users,
      title: "Clinic Management",
      desc: "Comprehensive tools for clinics to manage patients and appointments efficiently.",
      badge: Sparkles,
    },
  ];

  return (
    <section
      id="features"
      className="py-12 md:py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f0fdff 0%, #f8feff 50%, #ffffff 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-100 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-300 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Everything You Need
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl">
            Streamline your healthcare experience with our comprehensive suite
            of
            <span className="font-semibold text-cyan-600">
              {" "}
              cutting-edge features
            </span>
          </p>
        </div>

        {/* Mobile Accordion */}
        <div className="space-y-4 max-w-2xl mx-auto md:hidden">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden"
            >
              {/* Clickable Header */}
              <button
                onClick={() =>
                  setExpandedFeature(expandedFeature === index ? null : index)
                }
                className="w-full p-6 text-left flex items-center justify-between hover:bg-cyan-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex justify-center items-center h-14 w-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg flex-shrink-0">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">
                      {item.title}
                    </h4>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedFeature === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expandable Content */}
              {expandedFeature === index && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-4 animate-in fade-in duration-300">
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2 text-cyan-600">
                    <item.badge className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Feature included
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/60 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
              <div className="flex justify-center items-center h-20 w-20 mx-auto bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mt-6 mb-3 group-hover:text-cyan-700 transition-colors">
                {item.title}
              </h4>
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                {item.desc}
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <item.badge className="w-5 h-5 text-cyan-500 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/60">
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span className="font-semibold text-sm">HIPAA Compliant</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
            <div className="flex items-center gap-2 text-slate-700">
              <Zap className="w-5 h-5 text-cyan-500" />
              <span className="font-semibold text-sm">24/7 Support</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
            <div className="flex items-center gap-2 text-slate-700">
              <Heart className="w-5 h-5 text-cyan-500" />
              <span className="font-semibold text-sm">Patient First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
