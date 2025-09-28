import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const TourModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: 'Welcome to Your Dashboard!',
      content: 'This is your main dashboard where you can manage your appointments.',
    },
    {
      title: 'Booking a New Appointment',
      content: 'To book a new appointment, simply click the "New Appointment" button. This will take you to a list of our available doctors.',
    },
    {
      title: 'Selecting a Doctor',
      content: 'From the list, you can view the profiles of our doctors. Click on any doctor to see their details and availability.',
    },
    {
      title: 'Scheduling Your Visit',
      content: 'On the doctor\'s profile page, you can select a date and time that works for you and book your appointment.',
    },
    {
      title: 'All Set!',
      content: 'That\'s it! You\'re ready to manage your health with ease. Enjoy our services!',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-300 border border-slate-200/50 flex flex-col">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                {tourSteps[currentStep].title}
            </h2>
            <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
            >
                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            </button>
        </div>

        <div className="p-6 flex-grow">
          <p className="text-slate-600 leading-relaxed">
            {tourSteps[currentStep].content}
          </p>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                <span
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep === index ? 'bg-cyan-500 w-6' : 'bg-slate-200'}`}
                ></span>
                ))}
            </div>

            <div className="flex gap-3">
                {currentStep > 0 && (
                <button 
                    onClick={prevStep} 
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium">
                    <ChevronLeft size={20} />
                    Previous
                </button>
                )}
                {currentStep < tourSteps.length - 1 ? (
                <button 
                    onClick={nextStep} 
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    Next
                    <ChevronRight size={20} />
                </button>
                ) : (
                <button 
                    onClick={handleFinish} 
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    Finish
                </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TourModal;
