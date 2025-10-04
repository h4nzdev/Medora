import React, { useState, useEffect, useContext } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Eye,
  Download,
  Edit,
  Trash2,
  Send,
} from "lucide-react";

import AddInvoiceModal from "../../../components/ClinicComponents/AddInvoiceModal/AddInvoiceModal";
import {
  getInvoicesByClinic,
  createInvoice,
  deleteInvoice,
} from "../../../services/invoiceService";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "sonner";
import InvoiceTableBody from "./components/InvoiceTableBody";
import { createNotification } from "../../../services/notificationService";
import ClinicInvoiceViewModal from "./components/ClinicInvoiceViewModal";
import Swal from "sweetalert2";

export default function ClinicInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const invoicesPerPage = 5;

  const fetchInvoices = async () => {
    if (user?._id) {
      try {
        const data = await getInvoicesByClinic(user._id);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchInvoices();
    }
  }, [user]);

  const handleAddInvoice = async (invoiceData) => {
    setIsLoading(true);
    const totalAmount = invoiceData.services.reduce(
      (sum, service) => sum + parseFloat(service.price),
      0
    );
    const newInvoice = {
      ...invoiceData,
      clinicId: user._id,
      totalAmount,
    };

    try {
      await createInvoice(newInvoice);

      if (invoiceData.patientId) {
        try {
          await createNotification({
            recipientId: invoiceData.patientId,
            recipientType: "Client",
            message: `New invoice has been generated for you. Total amount: ₱${totalAmount}`,
            type: "payment",
          });
        } catch (notificationError) {
          console.error("Failed to create notification:", notificationError);
          toast.error("Failed to create notification.");
        }
      }

      fetchInvoices();
      setIsModalOpen(false);
      toast.success("Successfully added Invoice!");
    } catch (error) {
      if (error.response.data && error.response) {
        toast.error(error.response.message);
      }
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId, invoiceNumber) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete invoice ${invoiceNumber}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#1e293b",
      customClass: {
        title: "text-slate-800 text-xl font-semibold",
        htmlContainer: "text-slate-600",
        confirmButton: "px-4 py-2 rounded-lg font-medium",
        cancelButton: "px-4 py-2 rounded-lg font-medium",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteInvoice(invoiceId);
        // Refresh the invoices list
        fetchInvoices();
        toast.success("Invoice deleted successfully!");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice.");
      }
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchTermLower = searchTerm.toLowerCase();
    const patientName = invoice.patientName?.toLowerCase() || "";
    const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || "";
    return (
      patientName.includes(searchTermLower) ||
      invoiceNumber.includes(searchTermLower)
    );
  });

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate stats
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + (invoice.totalAmount || 0),
    0
  );
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "paid"
  ).length;
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "pending"
  ).length;
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "overdue"
  ).length;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Invoices
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and track all patient invoices
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Invoices
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {invoices.length}
                </p>
              </div>
              <div className="bg-slate-500 p-4 rounded-2xl shadow-md">
                <Receipt className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Revenue
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  ₱{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Paid Invoices
                </p>
                <p className="text-4xl font-semibold text-cyan-600">
                  {paidInvoices}
                </p>
              </div>
              <div className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Pending/Overdue
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {pendingInvoices + overdueInvoices}
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Invoice
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-visible">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Invoice #
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Patient</th>
                  <th className="font-semibold text-slate-700 px-4">Doctor</th>
                  <th className="font-semibold text-slate-700 px-4">Amount</th>
                  <th className="font-semibold text-slate-700 px-4">
                    Due Date
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Status</th>
                  <th className="font-semibold text-slate-700 px-4">
                    Services
                  </th>
                  <th className="font-semibold text-slate-700 px-4 text-center w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <InvoiceTableBody
                invoices={currentInvoices}
                onView={handleViewInvoice}
                onDelete={handleDeleteInvoice}
              />
            </table>
          </div>

          {/* Mobile List - You can create a similar component like ClinicPatientsList for invoices */}
          <div className="block md:hidden">
            {/* Mobile invoice cards can be implemented similar to ClinicPatientsList */}
            <div className="space-y-4">
              {currentInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">
                      {invoice.invoiceNumber}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    Patient: {invoice.patientName}
                  </p>
                  <p className="text-sm text-slate-600 mb-1">
                    Amount: ${invoice.totalAmount}
                  </p>
                  <p className="text-sm text-slate-600">
                    Due: {invoice.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {indexOfFirstInvoice + 1}-
              {Math.min(indexOfLastInvoice, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddInvoice={handleAddInvoice}
        isLoading={isLoading}
      />

      {selectedInvoice && (
        <ClinicInvoiceViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}
