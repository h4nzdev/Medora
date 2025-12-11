import React from "react";
import {
  X,
  FileText,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Building,
  Stethoscope,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { formatDate } from "../../../../utils/date";

const ClinicInvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      unpaid: "bg-amber-100 text-amber-800 border border-amber-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      partial: "bg-blue-100 text-blue-800 border border-blue-200",
      overdue: "bg-red-100 text-red-800 border border-red-200",
    };
    return (
      statusMap[status] || "bg-slate-100 text-slate-800 border border-slate-200"
    );
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      paid: <CheckCircle className="w-4 h-4" />,
      unpaid: <Clock className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      partial: <DollarSign className="w-4 h-4" />,
      overdue: <AlertCircle className="w-4 h-4" />,
    };
    return iconMap[status] || null;
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return (
      invoice.services?.reduce(
        (sum, service) => sum + parseFloat(service.price),
        0
      ) || 0
    );
  };

  const subtotal = calculateSubtotal();
  const tax = invoice.tax || 0;
  const discount = invoice.discount || 0;
  const total = invoice.totalAmount || subtotal + tax - discount;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      <div className="w-full h-full max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-full mx-auto flex flex-col transform transition-all duration-300 scale-100 animate-in zoom-in-95">
          {/* Clinic-Focused Header */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
                    <Building className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
                      CLINIC INVOICE
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Clinic Management View
                    </p>
                  </div>
                </div>

                {/* Clinic & Invoice Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-1 truncate">
                      {invoice.clinicId?.clinicName || "Clinic"}
                    </h2>
                    <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                      <p className="flex items-center gap-1 sm:gap-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {invoice.clinicId?.address || "Clinic Address"}
                        </span>
                      </p>
                      <p className="flex items-center gap-1 sm:gap-2">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {invoice.clinicId?.phone || "Clinic Phone"}
                      </p>
                      <p className="flex items-center gap-1 sm:gap-2 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {invoice.clinicId?.email || "clinic@email.com"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end space-y-2">
                    <div className="w-full sm:w-auto">
                      <span
                        className={`inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadge(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        <span className="truncate">
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div className="w-full sm:text-right">
                      <p className="text-xs sm:text-sm text-slate-500">
                        Invoice Number
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-800 truncate">
                        #{invoice.invoiceNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 sm:p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 ml-2 sm:ml-4 flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Clinic & Patient Info - Clinic Focused */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Clinic & Doctor Info */}
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clinic Details
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Clinic Name
                    </p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                      {invoice.clinicId?.clinicName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Doctor</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Dr. {invoice.doctorName}
                      </span>
                    </p>
                  </div>
                  {invoice.clinicId?.taxId && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Clinic Tax ID
                      </p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {invoice.clinicId.taxId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-3 sm:p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Patient Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Patient Name
                    </p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">
                      {invoice.patientName}
                    </p>
                  </div>
                  {invoice.patientEmail && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {invoice.patientEmail}
                      </p>
                    </div>
                  )}
                  {invoice.patientPhone && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {invoice.patientPhone}
                      </p>
                    </div>
                  )}
                  {invoice.patientId?.patientId && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Patient ID
                      </p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {invoice.patientId.patientId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Timeline - Clinic Management Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Invoice Created
                    </p>
                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                      {formatDate(invoice.createdAt)}
                    </p>
                    {invoice.createdBy && (
                      <p className="text-xs text-slate-500 mt-1">
                        By: {invoice.createdBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Payment Due Date
                    </p>
                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                      {formatDate(invoice.dueDate)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {invoice.status === "overdue" ? (
                        <span className="text-red-600">Overdue</span>
                      ) : invoice.status === "paid" ? (
                        <span className="text-emerald-600">Paid</span>
                      ) : (
                        "Pending payment"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Rendered - Detailed View */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Services Rendered
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[300px]">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200">
                        Service Description
                      </th>
                      <th className="py-2 px-3 sm:py-3 sm:px-4 text-right text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.services?.map((service, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-100">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm sm:text-base truncate">
                              {service.name}
                            </p>
                            {service.description && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">
                                {service.description}
                              </p>
                            )}
                            {service.category && (
                              <div className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                {service.category}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 text-right border-b border-slate-100 whitespace-nowrap">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base">
                            ₱{parseFloat(service.price).toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clinic Payment Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-100 p-4 sm:p-6">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
                <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Payment Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700 text-sm sm:text-base">
                    Financial Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm sm:text-base">
                        Subtotal
                      </span>
                      <span className="font-medium text-slate-800 text-sm sm:text-base">
                        ₱{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {tax > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm sm:text-base">
                          Tax (VAT)
                        </span>
                        <span className="font-medium text-slate-800 text-sm sm:text-base">
                          ₱{tax.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600">
                        <span className="text-sm sm:text-base">
                          Patient Discount
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          -₱{discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700 text-sm sm:text-base">
                    Payment Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm sm:text-base">
                        Total Amount
                      </span>
                      <span className="font-bold text-slate-800 text-base sm:text-lg">
                        ₱{total.toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-xs sm:text-sm">
                          Amount Paid
                        </span>
                        <span className="font-medium text-slate-800 text-xs sm:text-sm">
                          ₱{invoice.paidAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-600 text-xs sm:text-sm">
                          Balance Due
                        </span>
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          ₱{(total - (invoice.paidAmount || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic Notes & Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {/* Clinic Notes */}
              {invoice.notes && (
                <div className="p-3 sm:p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">
                    Clinic Notes
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {invoice.notes}
                  </p>
                </div>
              )}

              {/* Clinic Actions */}
              <div className="p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">
                  Clinic Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    Print Receipt
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    Send Reminder
                  </button>
                  {invoice.status !== "paid" && (
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Footer */}
          <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-500 mb-0.5 sm:mb-1">
                  {invoice.clinicId?.clinicName || "Clinic"} • Invoice
                  Management
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  Generated on {formatDate(invoice.createdAt)} • ID:{" "}
                  {invoice._id?.slice(-8) || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-slate-700">
                    Clinic Invoice
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    For internal use
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInvoiceViewModal;
