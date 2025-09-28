import React, { useState, useEffect } from "react";
import { createInvoice, updateInvoice } from "../../services/invoiceService";

const InvoiceForm = ({ clinicId, editingInvoice, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentId: "",
    services: [{ name: "", price: 0 }],
    totalAmount: 0,
    status: "unpaid",
    dueDate: "",
  });

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        ...editingInvoice,
        dueDate: new Date(editingInvoice.dueDate).toISOString().split('T')[0], // Format for input[type=date]
      });
    }
  }, [editingInvoice]);

  const handleServiceChange = (index, event) => {
    const newServices = [...formData.services];
    newServices[index][event.target.name] = event.target.value;
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: "", price: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice._id, { ...formData, clinicId });
      } else {
        await createInvoice({ ...formData, clinicId });
      }
      onSave(); // Notify parent to refresh
    } catch (error) {
      console.error("Failed to save invoice", error);
    }
  };

  // ... (Add patient and appointment selection logic here)

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingInvoice ? "Edit Invoice" : "Create Invoice"}</h3>
      {/* Patient and Appointment selection will be added later */}
      
      <h4>Services</h4>
      {formData.services.map((service, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={service.name}
            onChange={(e) => handleServiceChange(index, e)}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={service.price}
            onChange={(e) => handleServiceChange(index, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addService}>+ Add Service</button>

      <div>
        <label>Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div>
        <label>Status</label>
        <select 
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      
      <button type="submit">Save Invoice</button>
    </form>
  );
};

export default InvoiceForm;
