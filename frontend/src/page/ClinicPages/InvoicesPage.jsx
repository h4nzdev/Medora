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

import AddInvoiceModal from "../../components/ClinicComponents/AddInvoiceModal/AddInvoiceModal";
import {
  createInvoice,
  getInvoicesByClinic,
} from "../../services/invoiceService";
import { ClinicContext } from "../../context/ClinicContext";
import { AuthContext } from "../../context/AuthContext";

// Utility functions
const useDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status) => {
  const statusMap = {
    paid: "bg-emerald-100 text-emerald-800",
    unpaid: "bg-amber-100 text-amber-800",
    partial: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
  };
  return statusMap[status] || "bg-slate-100 text-slate-800";
};

const getStatusIcon = (status) => {
  const iconMap = {
    paid: <CheckCircle className="w-4 h-4" />,
    unpaid: <Clock className="w-4 h-4" />,
    partial: <DollarSign className="w-4 h-4" />,
    overdue: <AlertCircle className="w-4 h-4" />,
  };
  return iconMap[status] || <Receipt className="w-4 h-4" />;
};

// Invoice Actions Component
const InvoiceActions = ({
  invoiceId,
  status,
  onView,
  onEdit,
  onDelete,
  onSend,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
          <button
            onClick={() => {
              onView(invoiceId);
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Invoice
          </button>
          <button
            onClick={() => {
              console.log(`Download invoice ${invoiceId}`);
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          {(status === "unpaid" || status === "overdue") && (
            <button
              onClick={() => {
                onSend(invoiceId);
                setDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </button>
          )}
          <button
            onClick={() => {
              onDelete(invoiceId);
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Invoice Table Body Component
const InvoiceTableBody = ({ invoices }) => {
  const handleView = (invoiceId) => {
    console.log(`Viewing invoice ${invoiceId}`);
  };

  const handleEdit = (invoiceId) => {
    console.log(`Editing invoice ${invoiceId}`);
  };

  const handleDelete = (invoiceId) => {
    console.log(`Deleting invoice ${invoiceId}`);
  };

  const handleSend = (invoiceId) => {
    console.log(`Sending reminder for invoice ${invoiceId}`);
  };

  return (
    <tbody>
      {invoices.length === 0 ? (
        <tr>
          <td colSpan="8" className="text-center py-6 text-slate-500 italic">
            No invoices found
          </td>
        </tr>
      ) : (
        invoices.map((invoice) => (
          <tr
            key={invoice._id}
            className="hover:bg-slate-50 transition-colors border-t border-slate-200"
          >
            <td className="py-4 px-4">
              <p className="font-semibold text-slate-800">
                {invoice.invoiceNumber}
              </p>
              <p className="text-sm text-slate-500">{useDate(invoice.date)}</p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                {invoice.patientId?.name}
              </p>
              <p className="text-sm text-slate-500">
                {invoice.patientId?.email}
              </p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                {invoice.doctorId?.name}
              </p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                ${invoice.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">
                Paid: ${invoice.paidAmount.toFixed(2)}
              </p>
            </td>
            <td className="px-4">
              <p className="font-medium text-slate-700">
                {useDate(invoice.dueDate)}
              </p>
            </td>
            <td className="px-4">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm w-fit ${getStatusBadge(
                  invoice.status
                )}`}
              >
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </span>
            </td>
            <td className="px-4 text-sm">
              <p className="text-slate-700">
                {invoice.services.map((s) => s.name).join(", ")}
              </p>
            </td>
            <td className="px-4 text-right">
              <InvoiceActions
                invoiceId={invoice._id}
                status={invoice.status}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSend={handleSend}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};

// Main Invoice Component
export default function ClinicInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clinic } = useContext(ClinicContext);
  const { user } = useContext(AuthContext);

  const fetchInvoices = async () => {
    if (clinic?._id) {
      try {
        const data = await getInvoicesByClinic(clinic._id);
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
  }, [clinic, user]);

  const handleAddInvoice = async (invoiceData) => {
    const totalAmount = invoiceData.services.reduce(
      (sum, service) => sum + parseFloat(service.price),
      0
    );
    const newInvoice = {
      ...invoiceData,
      clinicId: clinic?._id,
      totalAmount,
      // This needs to be a valid appointment ID from your database
      appointmentId: "60c72b2f5f1b2c001f7b8e1a",
    };

    try {
      await createInvoice(newInvoice);
      fetchInvoices();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg">
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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search and Filters can be added here */}
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Invoice
            </button>
          </div>
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
                  <th className="font-semibold text-slate-700 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <InvoiceTableBody invoices={invoices} />
            </table>
          </div>
        </div>
      </div>

      <AddInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddInvoice={handleAddInvoice}
      />
    </div>
  );
}
