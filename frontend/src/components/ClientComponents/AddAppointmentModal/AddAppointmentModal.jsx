'use client';

import { useContext, useState } from "react";
import { X, Calendar, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DoctorContext } from "../../../context/DoctorContext";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { AppointmentContext } from "../../../context/AppointmentContext";
import ClientPaymentModal from "../ClientPaymentModal/ClientPaymentModal";

// Import the new tab components
import DateTab from "./Tabs/DateTab";
import TimeTab from "./Tabs/TimeTab";
import DetailsTab from "./Tabs/DetailsTab";

const AddAppointmentModal = ({ isOpen, onClose }) => {
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);
  const { fetchAppointments } = useContext(AppointmentContext);
  const doctorClinic = doctors?.filter(
    (doc) => doc.clinicId?._id === user.clinicId?._id
  );

  const [currentTab, setCurrentTab] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: new Date(),
    time: "",
    type: "consultation",
    status: "scheduled",
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const appointmentTypes = [
    { value: "consultation", label: "Consultation" },
    { value: "follow-up", label: "Follow-up" },
    { value: "check-up", label: "Check-up" },
    { value: "surgery", label: "Surgery" },
    { value: "therapy", label: "Therapy" },
    { value: "vaccination", label: "Vaccination" },
    { value: "screening", label: "Screening" },
  ];

  const nextTab = () => setCurrentTab((prev) => prev + 1);
  const prevTab = () => setCurrentTab((prev) => prev - 1);

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.time || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const datePart = formData.date.toISOString().split('T')[0];
      const appointmentDateTime = `${datePart}T${formData.time}:00.000Z`;

      const finalData = {
        ...formData,
        date: appointmentDateTime,
        clinicId: user.clinicId?._id,
        patientId: user._id,
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: paymentData.bankDetails,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/appointment/add-appointment`,
        finalData
      );

      if (paymentData.paymentMethod === "cash") {
        toast.success("Appointment booked successfully! Please pay in cash upon arrival.");
      } else {
        toast.success("Appointment booked successfully! Payment processed.");
      }

      fetchAppointments();
      setIsPaymentModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  const tabContent = () => {
    switch (currentTab) {
      case 1:
        return <DateTab formData={formData} setFormData={setFormData} nextTab={nextTab} />;
      case 2:
        return <TimeTab formData={formData} setFormData={setFormData} nextTab={nextTab} prevTab={prevTab} />;
      case 3:
        return <DetailsTab formData={formData} setFormData={setFormData} doctors={doctorClinic} appointmentTypes={appointmentTypes} prevTab={prevTab} />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-300 border border-slate-200/50">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Schedule Appointment
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Step {currentTab} of 3
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleAddAppointment} className="p-6 space-y-6">
            {tabContent()}

            {currentTab === 3 && (
                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                        >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.doctorId || !formData.date || !formData.time}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                        >
                        <CreditCard className="w-4 h-4" />
                        Proceed to Payment
                    </button>
                </div>
            )}
        </form>
      </div>
      
      <ClientPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default AddAppointmentModal;
