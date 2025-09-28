
import React, { createContext, useContext } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useNavigate } from 'react-router-dom';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const navigate = useNavigate();

  const driverObj = driver({
    showProgress: true,
    onClose: () => {
      localStorage.setItem('hasCompletedBookingTour', 'true');
    },
    steps: [
      {
        element: '#new-appointment-button',
        popover: {
          title: 'New Appointment',
          description: "Let's start by booking a new appointment. Click here to find a doctor.",
          side: 'bottom',
          align: 'start',
        },
        onNextClick: () => {
          // Check if tour is completed to avoid navigation loops
          if (localStorage.getItem('hasCompletedBookingTour') !== 'true') {
            navigate('/client/doctors');
            driverObj.moveNext();
          }
        },
      },
      {
        element: '.doctor-card', // We'll need to add this class to the doctor cards
        popover: {
          title: 'Select a Doctor',
          description: "Here's a list of available doctors. Click on a doctor to view their profile.",
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#book-appointment-profile-button', // We'll need to add this ID
        popover: {
          title: 'Book from Profile',
          description: "Once you're on the doctor's profile, click here to start booking.",
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '#booking-details-tab', // Inside the modal
        popover: {
          title: 'Appointment Details',
          description: 'Fill in the details for your appointment here.',
        },
      },
      {
        element: '#booking-date-tab', // Inside the modal
        popover: {
          title: 'Choose a Date',
          description: 'Select a date that works for you.',
        },
      },
       {
        element: '#booking-time-tab', // Inside the modal
        popover: {
          title: 'Choose a Time',
          description: 'Select an available time slot.',
        },
      },
      {
        element: '#confirm-booking-button', // Inside the modal
        popover: {
          title: 'Confirm',
          description: 'Finally, confirm your appointment. The tour will end here.',
        },
      },
    ],
  });

  const startTour = () => {
    const hasCompletedTour = localStorage.getItem('hasCompletedBookingTour');
    if (!hasCompletedTour) {
      setTimeout(() => {
        driverObj.drive();
      }, 500); // Small delay to ensure elements are mounted
    }
  };

  return (
    <TourContext.Provider value={{ startTour, driverObj }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  return useContext(TourContext);
};
