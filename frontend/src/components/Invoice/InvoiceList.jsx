import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getInvoicesByClinic } from "../../services/invoiceService";
import { Eye, Edit, Trash2 } from "lucide-react";

const InvoiceList = ({ clinicId, onEdit, onDelete, onView }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (clinicId) {
        try {
          const fetchedInvoices = await getInvoicesByClinic(clinicId);
          setInvoices(fetchedInvoices);
        } catch (error) {
          console.error("Failed to fetch invoices", error);
        }
      }
    };
    fetchInvoices();
  }, [clinicId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {invoices.map((invoice) => (
              <motion.tr 
                key={invoice._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(invoice.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${invoice.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onView(invoice)} className="text-cyan-600 hover:text-cyan-900 mr-3 transition-colors duration-200"><Eye size={18} /></button>
                  <button onClick={() => onEdit(invoice)} className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"><Edit size={18} /></button>
                  <button onClick={() => onDelete(invoice._id)} className="text-red-600 hover:text-red-900 transition-colors duration-200"><Trash2 size={18} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InvoiceList;
