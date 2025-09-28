import React from "react";

const InvoiceDetails = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="invoice-details-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Invoice Details</h2>
        <div><strong>Invoice ID:</strong> {invoice._id}</div>
        <div><strong>Patient:</strong> {invoice.patientId.name}</div>
        <div><strong>Appointment Date:</strong> {new Date(invoice.appointmentId.date).toLocaleDateString()}</div>
        <div><strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}</div>
        <div><strong>Status:</strong> {invoice.status}</div>
        <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
        
        <h3>Services</h3>
        <ul>
          {invoice.services.map((service, index) => (
            <li key={index}>{service.name} - ${service.price.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoiceDetails;
