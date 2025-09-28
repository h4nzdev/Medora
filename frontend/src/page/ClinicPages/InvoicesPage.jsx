import React, { useState, useEffect } from "react";
import InvoiceList from "../../components/Invoice/InvoiceList";
import InvoiceForm from "../../components/Invoice/InvoiceForm";
import InvoiceDetails from "../../components/Invoice/InvoiceDetails";
import DeleteInvoiceModal from "../../components/Invoice/DeleteInvoiceModal";
import { deleteInvoice } from "../../services/invoiceService";
import { useSelector } from "react-redux";

const InvoicesPage = () => {
  const { clinic } = useSelector((state) => state.clinic);
  const clinicId = clinic?._id;

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // This key is used to force a re-render of the InvoiceList
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
      handleSave(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete invoice", error);
    }
  };

  const handleSave = () => {
    setIsFormVisible(false);
    setEditingInvoice(null);
    setListKey(Date.now()); // Update the key to trigger re-fetch in InvoiceList
  };

  return (
    <div className="invoices-page">
      <h2>Invoice Management</h2>
      <button onClick={handleCreate}>+ Create New Invoice</button>

      {isFormVisible && (
        <InvoiceForm 
          clinicId={clinicId} 
          editingInvoice={editingInvoice} 
          onSave={handleSave} 
        />
      )}

      <InvoiceList 
        key={listKey} // Use the key here
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
