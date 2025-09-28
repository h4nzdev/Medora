import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const InvoiceDetails = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-800">Invoice Details</h3>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-500 mb-1">Patient Name</span>
                <span className="text-slate-900 text-base font-medium">{invoice.patient.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-500 mb-1">Invoice Date</span>
                <span className="text-slate-900 text-base font-medium">{new Date(invoice.date).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-500 mb-1">Amount</span>
                <span className="text-green-600 text-xl font-bold">${invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-500 mb-1">Status</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full self-start ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Items (if you add them later) */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-slate-700 mb-3">Invoice Items</h4>
              <p className="text-slate-500 text-sm">Itemization is not yet implemented.</p>
              {/* Example of item list layout */}
              {/* <ul className="space-y-2">
                <li className="flex justify-between items-center text-slate-600">
                  <span>Consultation Fee</span>
                  <span>$150.00</span>
                </li>
              </ul> */}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-right">
            <button 
              onClick={onClose} 
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InvoiceDetails;
