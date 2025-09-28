import React, { useState } from "react";
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

// Mock invoice data
const mockInvoices = [
  {
    _id: "inv001",
    invoiceNumber: "INV-2024-001",
    patientId: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1234567890",
    },
    doctorId: { name: "Dr. Sarah Johnson" },
    date: "2024-01-15T10:30:00Z",
    dueDate: "2024-02-14T23:59:59Z",
    amount: 250.0,
    paidAmount: 250.0,
    status: "paid",
    services: ["Consultation", "Blood Test"],
    description: "General consultation and lab work",
  },
  {
    _id: "inv002",
    invoiceNumber: "INV-2024-002",
    patientId: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1234567891",
    },
    doctorId: { name: "Dr. Michael Chen" },
    date: "2024-01-16T14:15:00Z",
    dueDate: "2024-02-15T23:59:59Z",
    amount: 180.0,
    paidAmount: 90.0,
    status: "partial",
    services: ["Physical Therapy"],
    description: "Physical therapy session",
  },
  {
    _id: "inv003",
    invoiceNumber: "INV-2024-003",
    patientId: {
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      phone: "+1234567892",
    },
    doctorId: { name: "Dr. Lisa Anderson" },
    date: "2024-01-17T09:00:00Z",
    dueDate: "2024-02-16T23:59:59Z",
    amount: 320.0,
    paidAmount: 0,
    status: "pending",
    services: ["X-Ray", "Consultation"],
    description: "Diagnostic imaging and consultation",
  },
  {
    _id: "inv004",
    invoiceNumber: "INV-2024-004",
    patientId: {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1234567893",
    },
    doctorId: { name: "Dr. James Taylor" },
    date: "2024-01-18T11:45:00Z",
    dueDate: "2024-01-25T23:59:59Z",
    amount: 150.0,
    paidAmount: 0,
    status: "overdue",
    services: ["Follow-up"],
    description: "Follow-up consultation",
  },
  {
    _id: "inv005",
    invoiceNumber: "INV-2024-005",
    patientId: {
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1234567894",
    },
    doctorId: { name: "Dr. Sarah Johnson" },
    date: "2024-01-19T16:20:00Z",
    dueDate: "2024-02-18T23:59:59Z",
    amount: 400.0,
    paidAmount: 400.0,
    status: "paid",
    services: ["Surgery Consultation", "Pre-op Tests"],
    description: "Pre-surgical consultation and testing",
  },
  {
    _id: "inv006",
    invoiceNumber: "INV-2024-006",
    patientId: {
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      phone: "+1234567895",
    },
    doctorId: { name: "Dr. Michael Chen" },
    date: "2024-01-20T13:30:00Z",
    dueDate: "2024-02-19T23:59:59Z",
    amount: 200.0,
    paidAmount: 0,
    status: "draft",
    services: ["Consultation"],
    description: "General health checkup",
  },
];

// Utility functions
const useDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const useTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status) => {
  const statusMap = {
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    partial: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    draft: "bg-slate-100 text-slate-800",
  };
  return statusMap[status] || "bg-slate-100 text-slate-800";
};

const getStatusIcon = (status) => {
  const iconMap = {
    paid: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    partial: <DollarSign className="w-4 h-4" />,
    overdue: <AlertCircle className="w-4 h-4" />,
    draft: <Edit className="w-4 h-4" />,
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
          {status === "draft" && (
            <button
              onClick={() => {
                onEdit(invoiceId);
                setDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Invoice
            </button>
          )}
          {(status === "pending" || status === "overdue") && (
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
                ${invoice.amount.toFixed(2)}
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
              <p className="text-slate-700">{invoice.services.join(", ")}</p>
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

// Mobile Invoice List Component
const InvoiceList = ({ invoices }) => {
  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="text-center py-6 text-slate-500 italic">
          No invoices found
        </div>
      ) : (
        invoices.map((invoice) => (
          <div key={invoice._id} className="bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {invoice.invoiceNumber}
                </h3>
                <p className="text-sm text-slate-500">
                  {useDate(invoice.date)}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${getStatusBadge(
                  invoice.status
                )}`}
              >
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-600">Patient:</p>
                <p className="font-medium">{invoice.patientId?.name}</p>
              </div>
              <div>
                <p className="text-slate-600">Doctor:</p>
                <p className="font-medium">{invoice.doctorId?.name}</p>
              </div>
              <div>
                <p className="text-slate-600">Amount:</p>
                <p className="font-medium">${invoice.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-600">Due Date:</p>
                <p className="font-medium">{useDate(invoice.dueDate)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm text-slate-600">Services:</p>
              <p className="text-sm font-medium">
                {invoice.services.join(", ")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Main Invoice Component
export default function ClinicInvoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const invoicesPerPage = 5;

  const doctors = [
    ...new Set(mockInvoices.map((inv) => inv.doctorId?.name).filter(Boolean)),
  ];
  const statuses = ["All", "Paid", "Pending", "Partial", "Overdue", "Draft"];

  const filteredInvoices = mockInvoices
    .filter((inv) => {
      if (statusFilter === "All") return true;
      return inv.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((inv) => {
      if (doctorFilter === "All") return true;
      return inv.doctorId?.name === doctorFilter;
    })
    .filter((inv) => {
      const searchTermLower = searchTerm.toLowerCase();
      const patientName = inv.patientId?.name?.toLowerCase() || "";
      const doctorName = inv.doctorId?.name?.toLowerCase() || "";
      const invoiceNumber = inv.invoiceNumber?.toLowerCase() || "";
      return (
        patientName.includes(searchTermLower) ||
        doctorName.includes(searchTermLower) ||
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

  // Calculate stats
  const paidInvoices = mockInvoices.filter((inv) => inv.status === "paid");
  const pendingInvoices = mockInvoices.filter(
    (inv) => inv.status === "pending"
  );
  const overdueInvoices = mockInvoices.filter(
    (inv) => inv.status === "overdue"
  );
  const totalRevenue = mockInvoices.reduce(
    (sum, inv) => sum + inv.paidAmount,
    0
  );

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

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Invoices
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {mockInvoices.length}
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
                  Paid
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  {paidInvoices.length}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {pendingInvoices.length}
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Revenue
                </p>
                <p className="text-4xl font-semibold text-green-600">
                  ${totalRevenue.toFixed(0)}
                </p>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-md">
                <DollarSign className="w-8 h-8 text-white" />
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
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-emerald-300 focus:ring-1 focus:ring-emerald-200 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-transparent text-slate-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setStatusDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDoctorDropdownOpen(!isDoctorDropdownOpen)}
                    className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-transparent text-slate-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Doctor: {doctorFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {isDoctorDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      <button
                        onClick={() => {
                          setDoctorFilter("All");
                          setDoctorDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        All
                      </button>
                      {doctors.map((doctor) => (
                        <button
                          key={doctor}
                          onClick={() => {
                            setDoctorFilter(doctor);
                            setDoctorDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          {doctor}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
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
                  <th className="font-semibold text-slate-700 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <InvoiceTableBody invoices={currentInvoices} />
            </table>
          </div>

          {/* Mobile List */}
          <div className="block md:hidden">
            <InvoiceList invoices={currentInvoices} />
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
    </div>
  );
}
