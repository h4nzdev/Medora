import { useState } from "react";
import {
  Users,
  BarChart3,
  Calendar,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HowItWorks = () => {
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    {
      icon: Users,
      title: "Create Your Profile",
      desc: "Quick signup with basic information",
      fullDesc:
        "Set up your personalized health profile in under 2 minutes. We only require essential information to get you started on your healthcare journey.",
      features: [
        "2-minute setup",
        "Secure data encryption",
        "Personalized dashboard",
      ],
      iconBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "AI Health Assessment",
      desc: "Smart symptom analysis and insights",
      fullDesc:
        "Our advanced AI analyzes your symptoms and medical history to provide personalized insights and recommend the best course of action.",
      features: [
        "Instant analysis",
        "Personalized insights",
        "Smart recommendations",
      ],
      iconBg: "bg-gradient-to-r from-cyan-500 to-teal-500",
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      desc: "Choose from verified healthcare providers",
      fullDesc:
        "Connect with certified healthcare professionals. Choose your preferred time slot and get instant confirmation for your appointment.",
      features: [
        "Verified providers",
        "Flexible scheduling",
        "Instant confirmation",
      ],
      iconBg: "bg-gradient-to-r from-teal-500 to-emerald-500",
    },
  ];

  return (
    <section
      className="py-12 bg-gradient-to-b from-slate-50 to-white md:py-20"
      id="how-it-works"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Simplified Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Simple & Secure Process
            </div>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3 md:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            How It Works
          </h3>
          <p className="text-slate-600 md:text-xl max-w-2xl mx-auto leading-relaxed md:block hidden">
            Experience seamless healthcare with our intuitive three-step process
            designed for your comfort and convenience
          </p>
          <p className="text-slate-600 max-w-md mx-auto md:hidden">
            Three simple steps to better healthcare
          </p>
        </div>

        {/* Mobile Accordion */}
        <div className="space-y-4 max-w-2xl mx-auto md:hidden">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Clickable Header */}
              <button
                onClick={() =>
                  setExpandedStep(expandedStep === index ? null : index)
                }
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedStep === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expandable Content */}
              {expandedStep === index && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-4 animate-in fade-in duration-300">
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {item.fullDesc}
                  </p>
                  <div className="space-y-3">
                    {item.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="group relative">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"></div>

                {/* Main Card */}
                <div className="relative bg-white rounded-3xl p-8 border-2 border-slate-200 group-hover:border-cyan-300 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 h-full overflow-hidden">
                  {/* Icon with Enhanced Design */}
                  <div className="relative mb-8">
                    <div
                      className={`w-20 h-20 ${item.iconBg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="text-2xl font-bold text-slate-800 mb-4 text-center group-hover:text-slate-900 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-center mb-6 leading-relaxed font-medium">
                    {item.desc}
                  </p>

                  {/* Expanded Description */}
                  <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
                    {item.fullDesc}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {item.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Bottom Line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-lg max-w-2xl mx-auto">
            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4">
              Ready to Get Started?
            </h4>
            <p className="text-slate-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
              Join thousands of satisfied users who have transformed their
              healthcare experience
            </p>

            <a
              href="/client/register"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-4 md:px-12 md:py-5 rounded-2xl w-full md:w-auto transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg shadow-cyan-500/25 mb-4 md:mb-6"
            >
              <span>Start Your Journey Today</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>

            {/* Trust Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-slate-500 text-xs md:text-sm">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full border border-slate-200">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full border border-slate-200">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full border border-slate-200">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                <span>No Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
