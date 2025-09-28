import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, Users, Clock, CheckCircle, Heart, Bell } from "lucide-react";

const TourModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: "Welcome to HealthConnect!",
      content: "Your personal healthcare companion is here to make managing your health simple and stress-free. Let's take a quick tour to get you started on your wellness journey.",
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      color: "from-rose-50 to-pink-50"
    },
    {
      title: "Your Personal Dashboard",
      content: "This is your health hub! Here you'll see your upcoming appointments, recent visits, health reminders, and quick access to all our services. Everything you need is just one click away.",
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      color: "from-blue-50 to-cyan-50"
    },
    {
      title: "Book Your First Appointment",
      content: "Ready to schedule a visit? Click the 'New Appointment' button to get started. You can book routine checkups, consultations, or urgent care visits - all from the comfort of your home.",
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-50 to-green-50"
    },
    {
      title: "Choose Your Perfect Doctor",
      content: "Browse our network of qualified healthcare professionals. View their specialties, patient reviews, availability, and even virtual consultation options. Find the right match for your health needs.",
      icon: <Users className="w-8 h-8 text-purple-500" />,
      color: "from-purple-50 to-indigo-50"
    },
    {
      title: "Flexible Scheduling Made Easy",
      content: "Select your preferred date and time from available slots. Choose between in-person visits or video consultations. You'll receive instant confirmation and calendar reminders.",
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      color: "from-orange-50 to-yellow-50"
    },
    {
      title: "Stay Connected & Informed",
      content: "Get appointment reminders, test results, and health tips through our notification system. Track your health journey, access your medical history, and communicate securely with your care team.",
      icon: <Bell className="w-8 h-8 text-teal-500" />,
      color: "from-teal-50 to-cyan-50"
    },
    {
      title: "You're All Set to Thrive!",
      content: "Welcome to a smarter way to manage your health! Remember, our support team is always here to help. Take control of your wellness journey - your future self will thank you.",
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      color: "from-green-50 to-emerald-50"
    },
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-0 sm:p-4">
      {/* Mobile: Full screen, Desktop: Modal */}
      <div className="bg-white w-full h-full sm:w-full sm:max-w-2xl sm:h-auto sm:rounded-3xl shadow-2xl transform animate-in zoom-in-95 duration-300 border-0 sm:border sm:border-slate-200/50 flex flex-col sm:max-h-[95vh]">
        {/* Header */}
        <div className={`flex justify-between items-start sm:items-center p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-r ${currentTourStep.color} sm:rounded-t-3xl relative overflow-hidden`}>
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/30"></div>
            <div className="absolute -right-8 top-8 w-16 h-16 rounded-full bg-white/20"></div>
          </div>
          
          <div className="flex-1 pr-4 relative z-10">
            <div className="flex items-center gap-4 mb-3">
              {currentTourStep.icon}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                {currentTourStep.title}
              </h2>
            </div>
            
            {/* Mobile step indicator in header */}
            <div className="flex items-center gap-3 mt-3 sm:hidden">
              <span className="text-sm text-slate-600 font-semibold px-3 py-1 bg-white/80 rounded-full">
                {currentStep + 1} of {tourSteps.length}
              </span>
              <div className="flex gap-1.5">
                {tourSteps.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      currentStep === index 
                        ? "bg-slate-700 w-6" 
                        : currentStep > index 
                        ? "bg-slate-400" 
                        : "bg-slate-300"
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 relative z-10">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 hidden sm:block"
            >
              Skip Tour
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 hover:bg-white/80 rounded-xl transition-colors duration-200 group flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center min-h-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-xl">
              <p className="text-slate-700 leading-relaxed text-lg sm:text-xl font-medium mb-6">
                {currentTourStep.content}
              </p>
              
              {/* Progress visualization */}
              <div className="hidden sm:flex justify-center items-center gap-3 mt-8">
                {tourSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 border-2 ${
                        currentStep === index
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-500 w-6 h-6 shadow-lg shadow-blue-500/30"
                          : currentStep > index
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400"
                          : "bg-white border-slate-300 hover:border-slate-400"
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      {currentStep > index && (
                        <CheckCircle className="w-full h-full text-white" />
                      )}
                    </span>
                    {index < tourSteps.length - 1 && (
                      <div className={`h-8 w-px transition-all duration-300 ${
                        currentStep > index ? "bg-green-400" : "bg-slate-200"
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-7 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50 sm:rounded-b-3xl">
          {/* Desktop navigation */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 font-medium">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                      currentStep === index
                        ? "bg-blue-500 w-8"
                        : currentStep > index
                        ? "bg-green-400"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  ></span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-white hover:border-slate-300 transition-all duration-200 font-semibold hover:scale-105"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
              )}
              {currentStep < tourSteps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle size={20} />
                  Get Started
                </button>
              )}
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="sm:hidden space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <button 
                onClick={handleSkip}
                className="text-slate-600 hover:text-slate-800 font-medium"
              >
                Skip Tour
              </button>
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-all duration-200 font-semibold active:scale-95"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
              )}
              {currentStep < tourSteps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className={`flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg active:scale-95 ${
                    currentStep === 0 ? "flex-1" : "flex-1"
                  }`}
                >
                  Continue
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg active:scale-95"
                >
                  <CheckCircle size={20} />
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourModal;