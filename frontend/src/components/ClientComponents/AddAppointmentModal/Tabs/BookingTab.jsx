'use client';

import { useState } from 'react';
import { Monitor, Building } from 'lucide-react';

const BookingTab = ({ formData, setFormData, prevTab, nextTab }) => {
  const [selectedType, setSelectedType] = useState(formData.bookingType);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({ ...formData, bookingType: type });
  };

  const options = [
    {
      id: 'online',
      value: 'online',
      label: 'Online Consultation',
      description: 'Meet with your doctor virtually.',
      icon: Monitor,
      color: 'text-blue-600'
    },
    {
      id: 'walk-in',
      value: 'walk-in',
      label: 'Walk-In',
      description: 'Visit the clinic in person.',
      icon: Building,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Booking Type</h3>
        <p className="text-gray-500 text-sm mt-1">
          Choose how you'd like to have your appointment.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedType === option.value;
          
          return (
            <div
              key={option.id}
              onClick={() => handleTypeSelect(option.value)}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <IconComponent className={`h-5 w-5 ${isSelected ? 'text-blue-600' : option.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{option.label}</span>
                <span className="text-sm text-gray-500">{option.description}</span>
              </div>
              <div className={`ml-auto h-4 w-4 rounded-full border-2 ${
                isSelected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              }`}>
                {isSelected && (
                  <div className="h-full w-full rounded-full bg-white scale-[0.4]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={prevTab} 
          className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Back
        </button>
        <button 
          type="button" 
          onClick={nextTab} 
          disabled={!selectedType}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingTab;