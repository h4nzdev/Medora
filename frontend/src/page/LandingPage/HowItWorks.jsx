import {
  Users,
  BarChart3,
  Calendar,
  Heart,
  Stethoscope,
  Shield,
} from "lucide-react";

const HowItWorks = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="how-it-works"
    >
      {/* Enhanced Medical-Themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-cyan-50/70"></div>

      {/* Animated Medical Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #0891b2 2px, transparent 0),
                            radial-gradient(circle at 75px 75px, #0891b2 2px, transparent 0)`,
          backgroundSize: "100px 100px",
          animation: "float 20s ease-in-out infinite",
        }}
      ></div>

      {/* Floating Medical Icons */}
      <div className="absolute top-20 left-10 w-8 h-8 text-cyan-200/40 animate-bounce">
        <Heart className="w-full h-full" />
      </div>
      <div className="absolute top-40 right-20 w-10 h-10 text-cyan-300/30 animate-pulse delay-1000">
        <Stethoscope className="w-full h-full" />
      </div>
      <div className="absolute bottom-32 left-20 w-12 h-12 text-cyan-400/20 animate-bounce delay-500">
        <Shield className="w-full h-full" />
      </div>

      {/* Subtle Wave Pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 opacity-10"
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.184-4h6.216c-.5.5-1 1-1.5 1.5-4.122 4.122-9.142 6-17.9 6v-3.5z' fill='%230891b2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 32px",
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            How It Works
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started with Medora in three simple steps
          </p>
        </div>

        <div className="mx-auto">
          {/* Step 1 - Enhanced with medical vibe */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-cyan-200">
                1
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-4">
                Create Your Account
              </h4>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Sign up in less than 2 minutes. Simply provide your basic
                information, and you're ready to go. No complicated forms or
                lengthy verification processes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Quick registration process</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Secure account setup</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Instant access to features</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200/50 h-80 flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-16 h-16 text-cyan-600" />
                  </div>
                  <p className="text-cyan-700 font-semibold">
                    User Registration
                  </p>
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse group-hover:animate-ping"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 bg-cyan-300 rounded-full animate-pulse delay-300 group-hover:scale-150 transition-transform duration-300"></div>
              </div>
            </div>
          </div>

          {/* Step 2 - Enhanced */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200/50 h-80 flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-16 h-16 text-cyan-600" />
                  </div>
                  <p className="text-cyan-700 font-semibold">AI Health Check</p>
                </div>
                <div className="absolute top-8 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-150 group-hover:animate-ping"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-cyan-300 rounded-full animate-pulse delay-500 group-hover:scale-150 transition-transform duration-300"></div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-cyan-200">
                2
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-4">
                Check Your Symptoms
              </h4>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Use our AI-powered symptom checker to get instant preliminary
                insights about your health. Our intelligent system asks the
                right questions to understand your condition better.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Describe symptoms in plain language</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Get AI-powered health insights</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Receive care recommendations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 - Enhanced */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-cyan-200">
                3
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-4">
                Book Your Appointment
              </h4>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Browse our network of trusted clinics and healthcare providers.
                Book appointments instantly with just a few clicks and manage
                everything from your dashboard.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Choose from verified clinics</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Select convenient time slots</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Receive instant confirmation</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200/50 h-80 flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-16 h-16 text-cyan-600" />
                  </div>
                  <p className="text-cyan-700 font-semibold">
                    Book Appointment
                  </p>
                </div>
                <div className="absolute top-6 right-6 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-700 group-hover:animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 bg-cyan-300 rounded-full animate-pulse group-hover:scale-150 transition-transform duration-300"></div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA */}
          <div className="text-center mt-16">
            <a
              href="/client/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Your Health Journey</span>
              <div className="w-2 h-2 bg-white rounded-full relative z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
