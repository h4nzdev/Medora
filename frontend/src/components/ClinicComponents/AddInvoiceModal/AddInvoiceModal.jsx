import React, { useState, useEffect, useContext } from "react";
import {
  Loader2,
  X,
  Plus,
  Trash2,
  Calendar,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { DoctorContext } from "../../../context/DoctorContext";
import { AppointmentContext } from "../../../context/AppointmentContext";

const AddInvoiceModal = ({ isOpen, onClose, onAddInvoice, isLoading }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "",
    services: [{ name: "", price: 0 }],
    totalAmount: 0,
    paidAmount: 0,
    dueDate: "",
    status: "unpaid",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [patients, setPatients] = useState([]);
  const [clinicDoctors, setClinicDoctors] = useState([]);
  const [clinicInvoices, setClinicInvoices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext);
  const { doctors } = useContext(DoctorContext);
  const { appointments } = useContext(AppointmentContext);

  // Get invoices for this clinic
  useEffect(() => {
    if (isOpen && user?._id) {
      const fetchInvoices = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/invoice/clinic/${user._id}`
          );
          setClinicInvoices(res.data || []);
        } catch (error) {
          console.error("Error fetching invoices:", error);
          setClinicInvoices([]);
        }
      };

      const fetchPatients = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/patient/clinic/${user._id}`
          );
          setPatients(res.data);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      };

      const filterAndSetDoctors = () => {
        const filtered = doctors?.filter(
          (doctor) => doctor.clinicId?._id === user._id
        );
        setClinicDoctors(filtered || []);
      };

      fetchInvoices();
      fetchPatients();
      filterAndSetDoctors();
    }
  }, [isOpen, user, doctors]);

  // Filter appointments for this clinic with status "scheduled"
  const scheduledAppointments = appointments.filter(
    (app) => app.clinicId?._id === user?._id && app.status === "scheduled"
  );

  // Check if appointment already has an invoice
  const checkIfAppointmentHasInvoice = (appointmentId) => {
    return clinicInvoices.some(
      (invoice) =>
        invoice.appointmentId?._id === appointmentId ||
        invoice.appointmentId === appointmentId
    );
  };

  // Get invoice status for appointment
  const getInvoiceStatus = (appointmentId) => {
    const invoice = clinicInvoices.find(
      (inv) =>
        inv.appointmentId?._id === appointmentId ||
        inv.appointmentId === appointmentId
    );
    return invoice
      ? {
          exists: true,
          status: invoice.status,
          invoiceNumber: invoice.invoiceNumber,
        }
      : { exists: false };
  };

  // Filter scheduled appointments based on search
  const filteredAppointments = scheduledAppointments.filter((app) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      app.patientId?.name?.toLowerCase().includes(searchLower) ||
      app.doctorId?.name?.toLowerCase().includes(searchLower) ||
      app.type?.toLowerCase().includes(searchLower) ||
      new Date(app.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower) ||
      app.time?.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const services = [...formData.services];
    services[index][name] = name === "price" ? parseFloat(value) || 0 : value;

    // Calculate total amount
    const total = services.reduce(
      (sum, service) => sum + (parseFloat(service.price) || 0),
      0
    );

    setFormData({
      ...formData,
      services,
      totalAmount: total,
    });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: "", price: 0 }],
    });
  };

  const removeService = (index) => {
    const services = [...formData.services];
    services.splice(index, 1);

    // Recalculate total after removal
    const total = services.reduce(
      (sum, service) => sum + (parseFloat(service.price) || 0),
      0
    );

    setFormData({
      ...formData,
      services,
      totalAmount: total,
    });
  };

  const handleAppointmentSelect = (appointmentId) => {
    const selectedApp = scheduledAppointments.find(
      (a) => a._id === appointmentId
    );
    setFormData({
      ...formData,
      appointmentId,
      // Auto-populate patient and doctor if appointment is selected
      patientId: selectedApp?.patientId?._id || "",
      doctorId: selectedApp?.doctorId?._id || "",
    });
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInvoice(formData);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get selected appointment details
  const selectedAppointment = formData.appointmentId
    ? scheduledAppointments.find((a) => a._id === formData.appointmentId)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Create New Invoice
              </h2>
              <p className="text-cyan-100 mt-1">
                Fill in the details to generate an invoice
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit}>
            {/* Main Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User size={16} />
                    Patient
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="text-slate-400">
                      Select a patient
                    </option>
                    {patients.map((patient) => (
                      <option
                        key={patient._id}
                        value={patient._id}
                        className="py-2"
                      >
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Stethoscope size={16} />
                    Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="text-slate-400">
                      Select a doctor
                    </option>
                    {clinicDoctors.map((doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor._id}
                        className="py-2"
                      >
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    min={formData.date}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Selection Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                Appointment Details
              </h3>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Select Appointment
                </label>

                {scheduledAppointments.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-700 mb-2">
                      No Scheduled Appointments
                    </h4>
                    <p className="text-slate-500 max-w-md mx-auto">
                      There are no appointments with "scheduled" status
                      available for invoicing. Only appointments marked as
                      "scheduled" can be invoiced.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Appointment Count Badge */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Showing{" "}
                        <span className="font-semibold">
                          {scheduledAppointments.length}
                        </span>{" "}
                        scheduled appointment
                        {scheduledAppointments.length !== 1 ? "s" : ""}
                      </div>
                      {filteredAppointments.length !==
                        scheduledAppointments.length && (
                        <div className="text-sm text-cyan-600">
                          {filteredAppointments.length} result
                          {filteredAppointments.length !== 1 ? "s" : ""} found
                        </div>
                      )}
                    </div>

                    {/* Custom Dropdown */}
                    <div className="relative">
                      <div className="relative">
                        <div
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer bg-white flex justify-between items-center hover:border-slate-400 transition-colors"
                        >
                          <span
                            className={
                              formData.appointmentId
                                ? "text-slate-800"
                                : "text-slate-400"
                            }
                          >
                            {formData.appointmentId
                              ? `${
                                  selectedAppointment?.patientId?.name ||
                                  "Unknown Patient"
                                } - ${formatDate(selectedAppointment?.date)} ${
                                  selectedAppointment?.time
                                }`
                              : "Select a scheduled appointment"}
                          </span>
                          <div className="flex items-center gap-2">
                            {formData.appointmentId && (
                              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                Scheduled
                              </span>
                            )}
                            <svg
                              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        {isDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                            {/* Search Input */}
                            <div className="p-3 border-b border-slate-100">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search scheduled appointments..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="w-full p-2 pl-9 border border-slate-200 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                                <svg
                                  className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Appointment List */}
                            <div className="py-1">
                              {filteredAppointments.length === 0 ? (
                                <div className="px-4 py-6 text-center">
                                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-2">
                                    <svg
                                      className="w-5 h-5 text-slate-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                  <p className="text-slate-500">
                                    No scheduled appointments match your search
                                  </p>
                                </div>
                              ) : (
                                filteredAppointments.map((appt) => {
                                  const invoiceStatus = getInvoiceStatus(
                                    appt._id
                                  );
                                  const isSelected =
                                    formData.appointmentId === appt._id;

                                  return (
                                    <div
                                      key={appt._id}
                                      onClick={() =>
                                        handleAppointmentSelect(appt._id)
                                      }
                                      className={`px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 border-l-4 ${
                                        isSelected
                                          ? "bg-cyan-50 border-cyan-500"
                                          : "border-transparent"
                                      } ${
                                        invoiceStatus.exists
                                          ? "bg-amber-50 hover:bg-amber-100"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-slate-800">
                                              {appt.patientId?.name ||
                                                "Unknown Patient"}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                              Scheduled
                                            </span>
                                            {invoiceStatus.exists && (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                Invoiced
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm text-slate-600 space-y-1">
                                            <p>
                                              <span className="font-medium">
                                                Date:
                                              </span>{" "}
                                              {formatDate(appt.date)} •{" "}
                                              {appt.time}
                                            </p>
                                            <p>
                                              <span className="font-medium">
                                                Doctor:
                                              </span>{" "}
                                              {appt.doctorId?.name ||
                                                "Unknown Doctor"}
                                            </p>
                                            <p>
                                              <span className="font-medium">
                                                Type:
                                              </span>{" "}
                                              {appt.type || "Consultation"}
                                            </p>
                                            {invoiceStatus.exists && (
                                              <p className="text-xs mt-1">
                                                <span className="font-medium">
                                                  Invoice:
                                                </span>{" "}
                                                {invoiceStatus.invoiceNumber} •
                                                Status:
                                                <span
                                                  className={`ml-1 font-medium ${
                                                    invoiceStatus.status ===
                                                    "paid"
                                                      ? "text-emerald-600"
                                                      : invoiceStatus.status ===
                                                        "pending"
                                                      ? "text-amber-600"
                                                      : "text-red-600"
                                                  }`}
                                                >
                                                  {invoiceStatus.status}
                                                </span>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {isDropdownOpen && (
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                      )}
                    </div>

                    {/* Selected Appointment Preview */}
                    {formData.appointmentId && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              Date & Time
                            </p>
                            <p className="font-medium text-slate-800">
                              {formatDate(selectedAppointment?.date)} •{" "}
                              {selectedAppointment?.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Patient</p>
                            <p className="font-medium text-slate-800">
                              {selectedAppointment?.patientId?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Doctor</p>
                            <p className="font-medium text-slate-800">
                              {selectedAppointment?.doctorId?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Type</p>
                            <p className="font-medium text-slate-800">
                              {selectedAppointment?.type || "Consultation"}
                            </p>
                          </div>
                        </div>

                        {/* Appointment Status Badge */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium inline-flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            Status: Scheduled
                          </div>
                          {selectedAppointment?.status === "completed" && (
                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium inline-flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Appointment Completed
                            </div>
                          )}
                        </div>

                        {/* Invoice Warning if already exists */}
                        {checkIfAppointmentHasInvoice(
                          formData.appointmentId
                        ) && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-amber-800 font-medium">
                                  This appointment already has an invoice
                                </p>
                                <p className="text-amber-700 text-sm mt-1">
                                  Creating another invoice will duplicate
                                  billing for this appointment.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">
                  Services & Charges
                </h3>
                <button
                  type="button"
                  onClick={addService}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  <Plus size={18} />
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        name="name"
                        placeholder="Service name (e.g., Consultation, X-Ray, Lab Test)"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, e)}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-500">
                          ₱
                        </span>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, e)}
                          required
                          min="0"
                          step="0.01"
                          className="w-full p-3 pl-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

                {/* Total Amount Preview */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <div className="w-64">
                    <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                      <span className="font-semibold text-slate-700">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-cyan-700">
                        ₱{formData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  checkIfAppointmentHasInvoice(formData.appointmentId) ||
                  !formData.appointmentId
                }
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Creating Invoice...
                  </span>
                ) : checkIfAppointmentHasInvoice(formData.appointmentId) ? (
                  "Appointment Already Invoiced"
                ) : !formData.appointmentId ? (
                  "Select an Appointment"
                ) : (
                  "Create Invoice"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
