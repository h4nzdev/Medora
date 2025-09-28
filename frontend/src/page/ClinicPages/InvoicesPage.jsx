import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import InvoiceList from "../../components/Invoice/InvoiceList";
import InvoiceForm from "../../components/Invoice/InvoiceForm";
import InvoiceDetails from "../../components/Invoice/InvoiceDetails";
import DeleteInvoiceModal from "../../components/Invoice/DeleteInvoiceModal";
import { deleteInvoice } from "../../services/invoiceService";
import { ClinicContext } from "../../context/ClinicContext";
import { PlusCircle } from "lucide-react"; // Icon for the button

const InvoicesPage = () => {
  const { clinics } = useContext(ClinicContext);
  const clinicId = clinics?.[0]?._id;

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [listKey, setListKey] = useState(Date.now());

  const handleCreate = () => {
    setEditingInvoice(null);
    setIsFormVisible(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setIsFormVisible(true);
  };

  const handleView = (invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDelete = (id) => {
    setDeletingInvoiceId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteInvoice(deletingInvoiceId);
      setDeletingInvoiceId(null);
      handleSave();
    } catch (error) {
      console.error("Failed to delete invoice", error);
    }
  };

  const handleSave = () => {
    setIsFormVisible(false);
    setEditingInvoice(null);
    setListKey(Date.now());
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg min-h-full">
      <div className="flex items-center justify-between mb-8 border-b pb-4 border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800">
          Invoice Management
        </h2>
        <button 
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mb-8"
          >
            <InvoiceForm 
              clinicId={clinicId} 
              editingInvoice={editingInvoice} 
              onSave={handleSave} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <InvoiceList 
        key={listKey}
        clinicId={clinicId} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView} 
      />

      {viewingInvoice && (
        <InvoiceDetails 
          invoice={viewingInvoice} 
          onClose={() => setViewingInvoice(null)} 
        />
      )}

      <DeleteInvoiceModal 
        isOpen={!!deletingInvoiceId}
        onClose={() => setDeletingInvoiceId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default InvoicesPage;
