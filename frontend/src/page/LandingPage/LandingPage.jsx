import {
  Stethoscope,
  FileText,
  Users,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Award,
  Star,
  Menu,
  X,
  MapPinIcon,
  PhoneIcon,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import ayham from "../../assets/ayham.jpg";
import heart from "../../assets/heart.jpg";
import hanz from "../../assets/hanz.jpg";
import clinic from "../../assets/clinic.jpg";
import logo from "../../assets/medoralogo.png";
import axios from "axios";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch clinics with basic or pro subscription
  const fetchClinics = async () => {
    try {
      setLoading(true);
      // API call to get all clinics
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clinic`
      );

      // Filter clinics that have basic or pro subscription (not free)
      const premiumClinics = response.data.filter(
        (clinic) => clinic.subscriptionPlan !== "free"
      );

      setClinics(premiumClinics);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clinics when component loads
  useEffect(() => {
    fetchClinics();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Enhanced Header with Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src={logo} alt="logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Medora
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("clinics")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Clinics
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                FAQ
              </button>
              <a
                href="/client/login"
                className="text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/client/register"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
              <nav className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("clinics")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  Clinics
                </button>
                <button
                  onClick={() => scrollToSection("team")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  Team
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  Contact
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                >
                  FAQ
                </button>
                <a
                  href="/client/login"
                  className="text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="/client/register"
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg text-center"
                >
                  Get Started
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section with Image Placeholder */}
      {/* Enhanced Hero Section with Mobile Centering Fix */}
      <main
        className="pt-32 pb-24 container mx-auto px-6 relative overflow-hidden"
        id="hero"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                  src={clinic}
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

      {/* Features Section */}
      <section
        id="features"
        className="py-18 bg-gradient-to-b from-white to-slate-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Key Features
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need for a seamless healthcare experience, powered
              by cutting-edge technology.
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
                Get instant, AI-powered advice on your symptoms with our
                advanced diagnostic tool.
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

      {/* How It Works Section */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              How It Works
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started with Medora in three simple steps
            </p>
          </div>

          <div className=" mx-auto">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg">
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
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-16 h-16 text-cyan-600" />
                    </div>
                    <p className="text-cyan-700 font-semibold">
                      User Registration
                    </p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-16 h-16 text-cyan-600" />
                    </div>
                    <p className="text-cyan-700 font-semibold">
                      AI Health Check
                    </p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-8 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 bg-cyan-300 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg">
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

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h4 className="text-3xl font-bold text-slate-800 mb-4">
                  Book Your Appointment
                </h4>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Browse our network of trusted clinics and healthcare
                  providers. Book appointments instantly with just a few clicks
                  and manage everything from your dashboard.
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
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl border border-cyan-200 h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-16 h-16 text-cyan-600" />
                    </div>
                    <p className="text-cyan-700 font-semibold">
                      Book Appointment
                    </p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
                  <div className="absolute bottom-6 left-6 w-4 h-4 bg-cyan-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <a
                href="/client/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Your Health Journey
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clinics Section */}
      <section
        id="clinics"
        className="py-24 relative bg-cover bg-fixed"
        style={{ backgroundImage: `url(${clinic})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative w-full mx-auto z-40 space-x-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Featured Clinics
            </h3>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Discover our premium healthcare partners offering exceptional
              medical services.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          )}

          {/* No Clinics Available */}
          {!loading && clinics.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">
                  No Clinics Available
                </h4>
                <p className="text-slate-600">
                  We're currently working on adding more premium clinics to our
                  network.
                </p>
              </div>
            </div>
          )}

          {/* Clinics Grid */}
          {!loading && clinics.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {clinics.map((clinic) => (
                <div
                  key={clinic._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
                >
                  {/* Clinic Image Placeholder */}
                  <div className="h-58 bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      {clinic.clinicPicture ? (
                        <div className="relative">
                          <img
                            src={clinic.clinicPicture}
                            alt={clinic.clinicName}
                            onError={(e) => {
                              console.error("Image failed to load:", {
                                fullUrl: e.target.src,
                                baseUrl: import.meta.env.VITE_API_URL,
                                picturePath: clinic.clinicPicture,
                                clinicId: clinic._id,
                              });
                              e.target.style.display = "none";
                            }}
                            onLoad={() =>
                              console.log(
                                "Image loaded successfully for clinic:",
                                clinic.clinicName
                              )
                            }
                          />
                          {/* Fallback placeholder that shows when image fails */}
                          <div
                            className="absolute inset-0 hidden"
                            style={{ display: "none" }}
                          >
                            <div className="w-full h-full bg-cyan-200 rounded-lg flex items-center justify-center">
                              <Stethoscope className="w-10 h-10 text-cyan-600" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Stethoscope className="w-10 h-10 text-cyan-600" />
                          </div>
                          <p className="text-cyan-600 font-medium text-sm">
                            Medical Center
                          </p>
                        </>
                      )}
                    </div>
                    {/* Subscription Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          clinic.subscriptionPlan === "pro"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {clinic.subscriptionPlan.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Clinic Details */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                      {clinic.clinicName}
                    </h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Users className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="text-sm">{clinic.contactPerson}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <PhoneIcon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="text-sm">{clinic.phone}</span>
                      </div>

                      <div className="flex items-start gap-3 text-slate-600">
                        <MapPinIcon className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{clinic.address}</span>
                      </div>
                    </div>
                    {/* Book Now Button */}
                    <a
                      href={`/client/login?clinicId=${clinic._id}`}
                      className="group/btn w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                      <div className="w-2 h-2 bg-white rounded-full group-hover/btn:translate-x-1 transition-transform duration-200"></div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about Medora and how it works
            </p>
          </div>

          <div className="mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h4 className="text-lg font-semibold text-slate-800">
                  How does the AI Symptom Checker work?
                </h4>
                <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our AI Symptom Checker uses advanced machine learning algorithms
                to analyze your symptoms and provide preliminary health
                insights. Simply describe your symptoms, and our AI will ask
                relevant follow-up questions to better understand your condition
                before providing recommendations.
              </p>
            </details>

            {/* FAQ Item 2 */}
            <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h4 className="text-lg font-semibold text-slate-800">
                  Is my medical data secure?
                </h4>
                <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Absolutely. Medora is HIPAA compliant and uses bank-level
                encryption to protect your medical records. Your data is stored
                securely and never shared with third parties without your
                explicit consent.
              </p>
            </details>

            {/* FAQ Item 3 */}
            <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h4 className="text-lg font-semibold text-slate-800">
                  How do I book an appointment?
                </h4>
                <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Booking an appointment is simple! Browse our featured clinics,
                select your preferred healthcare provider, and click "Book
                Appointment." You'll be able to view available time slots and
                confirm your booking instantly.
              </p>
            </details>

            {/* FAQ Item 4 */}
            <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h4 className="text-lg font-semibold text-slate-800">
                  Can clinics join Medora?
                </h4>
                <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Yes! Healthcare providers and clinics can register on Medora to
                manage appointments, patient records, and streamline their
                operations. We offer different subscription plans including
                Basic and Pro to suit your clinic's needs.
              </p>
            </details>

            {/* FAQ Item 5 */}
            <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <h4 className="text-lg font-semibold text-slate-800">
                  Is Medora available 24/7?
                </h4>
                <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Yes! Our AI Symptom Checker and platform features are available
                24/7. While individual clinic hours may vary, you can always
                access your medical records, book future appointments, and get
                AI-powered health insights anytime.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className="py-24 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Meet Our Team
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Passionate healthcare professionals and technology experts working
              together to revolutionize healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                  <div className="text-center">
                    <img src={ayham} />
                  </div>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                Ayham Khalsam
              </h4>
              <p className="text-cyan-600 font-semibold">
                Chief Medical Officer
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                  <img src={heart} alt="" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                Heart Kho
              </h4>
              <p className="text-cyan-600 font-semibold">
                Cheif Executive Officer
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                  <img src={hanz} alt="" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                Hanz Christian Magbal
              </h4>
              <p className="text-cyan-600 font-semibold">Lead Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Get In Touch
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions? We're here to help you on your healthcare journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
                <Mail className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">
                Email Us
              </h4>
              <p className="text-slate-600 mb-4">
                Get in touch with our support team
              </p>
              <a
                href="mailto:medora603@gmail.com"
                className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors duration-200"
              >
                medora603@gmail.com
              </a>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
                <Phone className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">
                Call Us
              </h4>
              <p className="text-slate-600 mb-4">
                Speak directly with our team
              </p>
              <a
                href="tel:09566...message on facebook"
                className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors duration-200"
              >
                099278***00
              </a>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
                <MapPin className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">
                Visit Us
              </h4>
              <p className="text-slate-600 mb-4">Our headquarters location</p>
              <p className="text-cyan-600 font-semibold">
                Salinas Drive
                <br />
                IT Park, Lahug Cebu City
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="logo" className="w-10 h-10" />
                <h3 className="text-2xl font-bold">Medora</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
                Revolutionizing healthcare through innovative technology, making
                quality medical care accessible to everyone, everywhere.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">ISO 27001 Certified</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/client/register"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Get Started
                  </a>
                </li>
                <li>
                  <a
                    href="/client/login"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Patient Login
                  </a>
                </li>
                <li>
                  <a
                    href="/clinic/login"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Clinic Portal
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span>support@medora.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <span>+1 (800) MEDORA-1</span>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span>
                    123 Healthcare Ave
                    <br />
                    Medical District, CA 90210
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">
              © 2025 Medora. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a
                href="/terms"
                className="hover:text-cyan-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="hover:text-cyan-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/cookies"
                className="hover:text-cyan-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
