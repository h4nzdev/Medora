import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createInvoice, updateInvoice } from "../../services/invoiceService";

const InvoiceForm = ({ clinicId, editingInvoice, onSave }) => {
  const [formData, setFormData] = useState({
    patient: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "Unpaid",
  });

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        ...editingInvoice,
        date: new Date(editingInvoice.date).toISOString().split("T")[0],
      });
    } else {
      // Reset form when not editing
      setFormData({
        patient: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        status: "Unpaid",
      });
    }
  }, [editingInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData, clinic: clinicId };
      if (editingInvoice) {
        await updateInvoice(editingInvoice._id, dataToSubmit);
      } else {
        await createInvoice(dataToSubmit);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save invoice", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
            <input
              type="text"
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 shadow-sm bg-white"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            onClick={onSave} 
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
          >
            {editingInvoice ? "Update Invoice" : "Create Invoice"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default InvoiceForm;
