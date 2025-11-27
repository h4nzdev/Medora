import { useState, useEffect } from "react";
import {
  BarChart3,
  Clock,
  Shield,
  Award,
  Star,
  Users,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import doctor1 from "../../assets/doctor1.png";
import doctor2 from "../../assets/doctor2.png";
import doctor3 from "../../assets/doctor3.png";

const Hero = () => {
  const [currentDoctor, setCurrentDoctor] = useState(0);

  const doctors = [doctor1, doctor2, doctor3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDoctor((prev) => (prev + 1) % doctors.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [doctors.length]);

  return (
    <main
      className="pt-28 pb-20 container mx-auto px-6 relative overflow-hidden"
      id="hero"
      style={{
        backgroundImage: `url(/placeholder.svg?height=800&width=1600&query=abstract+medical+healthcare+pattern+light+blue+white)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content - Unchanged */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-cyan-200">
            <Award className="w-4 h-4" />
            Trusted by 100+ patients worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent leading-tight tracking-tighter">
            AI Chat for
            <span className="block bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
              Quick Symptom Help
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Connect with certified healthcare professionals instantly. Book
            appointments, get medical advice, and manage your health journey all
            in one platform.
          </p>

          {/* Login Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <a
              href="/client/login"
              className="group bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-lg sm:text-xl px-8 sm:px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                Login as Patient
                <div className="w-3 h-3 bg-white rounded-full group-hover:translate-x-1 transition-transform duration-200"></div>
              </span>
            </a>
            <a
              href="/clinic/login"
              className="bg-white text-cyan-600 font-bold text-lg sm:text-xl px-8 sm:px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-cyan-100 hover:border-cyan-200"
            >
              Login as Clinic
            </a>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">24/7</p>
                  <p className="text-sm text-slate-600">Online Support</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">20+</p>
                  <p className="text-sm text-slate-600">Specialists</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">100+</p>
                  <p className="text-sm text-slate-600">Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Doctor Image with Rotation */}
        <div className="hidden md:block flex justify-center lg:justify-end">
          <div className="relative h-full flex items-center justify-center">
            {/* Doctor Image Container with Gradient Overlay */}
            <div className="w-full h-auto max-h-full flex items-center justify-center relative">
              {/* Gradient Overlay for Smooth Blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10"></div>

              {/* Doctor Image with Framer Motion Slide */}
              <motion.img
                key={currentDoctor}
                src={doctors[currentDoctor] || "/placeholder.svg"}
                alt="Professional doctor with folded arms"
                className="w-auto h-[80vh] object-contain relative z-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-cyan-400 rounded-full animate-pulse z-20"></div>
              <div className="absolute bottom-12 left-8 w-3 h-3 bg-cyan-300 rounded-full animate-pulse delay-300 z-30"></div>
              <div className="absolute top-1/3 left-12 w-5 h-5 bg-cyan-200 rounded-full animate-pulse delay-700 z-30"></div>
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute top-8 -right-4 sm:right-4 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-slate-100 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Available</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    Online Now
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 -left-4 sm:left-4 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-slate-100 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Rating</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    4.9/5 Stars
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
