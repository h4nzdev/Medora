import React, { useState, useEffect } from "react";
import { getInvoicesByClinic } from "../../services/invoiceService";
import socket from "../../services/socket"; // Assuming you have a socket instance configured

const InvoiceList = ({ clinicId, onEdit, onDelete, onView }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoicesByClinic(clinicId);
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch invoices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      fetchInvoices();

      // Listen for real-time updates
      socket.on("invoice_updated", fetchInvoices);

      // Cleanup listener on component unmount
      return () => {
        socket.off("invoice_updated", fetchInvoices);
      };
    }
  }, [clinicId]);

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="invoice-list">
      <h3>Invoices</h3>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.patientId.name}</td>
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>{invoice.status}</td>
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => onView(invoice)}>View</button>
                  <button onClick={() => onEdit(invoice)}>Edit</button>
                  <button onClick={() => onDelete(invoice._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList;
