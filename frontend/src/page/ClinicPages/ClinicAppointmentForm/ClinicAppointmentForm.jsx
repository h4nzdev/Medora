import React, { useContext, useState, useEffect } from "react";
import { createAppointment } from "../../../services/appointmentService";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  ChevronDown,
  X,
} from "lucide-react";

const ClinicAppointmentForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    type: "",
    bookingType: "online",
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Fetch doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors for this clinic
        const doctorsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/doctor/clinic/${user._id}`
        );
        setDoctors(doctorsResponse.data);

        // Fetch patients for this clinic
        const patientsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/patient/clinic/${user._id}`
        );
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [user]);

  // Generate time slots based on doctor's availability
  const generateTimeSlots = (doctor, selectedDate) => {
    if (!doctor || !selectedDate) return [];

    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = doctor.availability.find(
      (avail) => avail.day.toLowerCase() === selectedDay.toLowerCase()
    );

    if (!dayAvailability) return [];

    const slots = [];
    const start = new Date(`${selectedDate}T${dayAvailability.startTime}`);
    const end = new Date(`${selectedDate}T${dayAvailability.endTime}`);

    // Generate 30-minute slots
    let current = new Date(start);
    while (current < end) {
      slots.push({
        time: current.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        value: current.toTimeString().slice(0, 5),
      });
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If date changes and doctor is selected, update available slots
    if (name === "date" && formData.doctorId) {
      const doctor = doctors.find((d) => d._id === formData.doctorId);
      if (doctor) {
        const slots = generateTimeSlots(doctor, value);
        setAvailableSlots(slots);
      }
    }
  };

  const handleDoctorSelect = (doctor) => {
    setFormData((prev) => ({
      ...prev,
      doctorId: doctor._id,
    }));
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);

    // Generate available slots if date is already selected
    if (formData.date) {
      const slots = generateTimeSlots(doctor, formData.date);
      setAvailableSlots(slots);
    }
  };

  const handlePatientSelect = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient._id,
    }));
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        clinicId: user._id,
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        date: new Date(formData.date).toISOString(),
        type: formData.type,
        bookingType: formData.bookingType,
        status: "scheduled",
      };

      await createAppointment(appointmentData);
      toast.success("Appointment created successfully!");

      // Reset form
      setFormData({
        patientId: "",
        doctorId: "",
        date: "",
        type: "",
        bookingType: "online",
      });
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setAvailableSlots([]);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    "General Check-up",
    "Follow-up",
    "Consultation",
    "Emergency",
    "Vaccination",
    "Dental Check-up",
    "Eye Examination",
    "Physical Therapy",
    "Surgery Consultation",
    "Other",
  ];

  return (
    <div className="py-4">
      <div>
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Schedule New Appointment
          </h1>
          <p className="text-slate-600">
            Create a new appointment for your patient
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                  className="w-full p-3 border border-slate-300 rounded-lg text-left bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <span
                      className={
                        selectedPatient ? "text-slate-800" : "text-slate-500"
                      }
                    >
                      {selectedPatient
                        ? selectedPatient.name
                        : "Select a patient"}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </button>

                {showPatientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {patients.map((patient) => (
                      <button
                        key={patient._id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full p-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {patient.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {patient.email}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Select Doctor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                  className="w-full p-3 border border-slate-300 rounded-lg text-left bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-5 h-5 text-slate-400" />
                    <span
                      className={
                        selectedDoctor ? "text-slate-800" : "text-slate-500"
                      }
                    >
                      {selectedDoctor ? selectedDoctor.name : "Select a doctor"}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </button>

                {showDoctorDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor._id}
                        type="button"
                        onClick={() => handleDoctorSelect(doctor)}
                        className="w-full p-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {doctor.specialty}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Availability Display */}
            {selectedDoctor && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Doctor's Availability
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  {selectedDoctor.availability?.length > 0 ? (
                    <div className="space-y-1">
                      {selectedDoctor.availability.map((slot, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="font-medium">{slot.day}:</span>
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>No availability set</span>
                  )}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Available Time Slots */}
            {availableSlots.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className="p-2 border border-slate-300 rounded-lg text-sm hover:border-cyan-500 hover:bg-cyan-50 transition-colors"
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Appointment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select appointment type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Booking Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="online"
                    checked={formData.bookingType === "online"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-full p-4 border rounded-lg text-center ${
                      formData.bookingType === "online"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Online Booking
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="walk-in"
                    checked={formData.bookingType === "walk-in"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-full p-4 border rounded-lg text-center ${
                      formData.bookingType === "walk-in"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Walk-in
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Creating Appointment..." : "Schedule Appointment"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            All appointments will be scheduled based on doctor's availability
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicAppointmentForm;
