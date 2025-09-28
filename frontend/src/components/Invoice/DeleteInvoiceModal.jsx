import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const DeleteInvoiceModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 mb-8">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={onClose} 
                className="px-8 py-3 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm} 
                className="px-8 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteInvoiceModal;
