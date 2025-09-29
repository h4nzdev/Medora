
import React, { useState } from "react";
import { X } from "lucide-react";

const AddInvoiceModal = ({ isOpen, onClose, patients, doctors, onAddInvoice }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "", // This will be handled later
    services: [{ name: "", price: 0 }],
    totalAmount: 0,
    paidAmount: 0,
    dueDate: "",
    status: "unpaid",
    description: "",
    date: new Date().toISOString().split("T")[0],
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
    services[index][name] = value;
    setFormData({ ...formData, services });
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
    setFormData({ ...formData, services });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInvoice(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create New Invoice</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Patient
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Service Name"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, e)}
                  className="w-1/2 p-2 border border-slate-300 rounded-md"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, e)}
                  className="w-1/4 p-2 border border-slate-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="text-emerald-600 hover:text-emerald-800"
            >
              + Add Service
            </button>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
