import React, { useContext } from "react";
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
  Download,
} from "lucide-react";
import { formatDate } from "../../../../utils/date";
import { AuthContext } from "../../../../context/AuthContext";

const ClientInvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  const { user } = useContext(AuthContext);
  if (!isOpen || !invoice) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      unpaid: "bg-amber-100 text-amber-800 border border-amber-200",
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in-0">
      {/* Scrollable container */}
      <div className="w-full h-full md:max-h-[90vh] overflow-hidden">
        <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-3xl h-full mx-auto flex flex-col transform transition-all duration-300 scale-100 animate-in zoom-in-95">
          {/* Receipt Header - Fixed */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl shadow-sm">
                    <Receipt className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
                      MEDICAL INVOICE
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Official Receipt
                    </p>
                  </div>
                </div>

                {/* Clinic Header Info - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-1 truncate">
                      {invoice.clinicId?.clinicName}
                    </h2>
                    <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                      <p className="flex items-center gap-1 sm:gap-2 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {invoice.clinicId?.address ||
                            "123 Medical Street, City"}
                        </span>
                      </p>
                      <p className="flex items-center gap-1 sm:gap-2">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {invoice.clinicId?.phone || "(123) 456-7890"}
                      </p>
                      <p className="flex items-center gap-1 sm:gap-2 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {invoice.clinicId?.email || "info@clinic.com"}
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

          {/* Receipt Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 hide-scroll">
            {/* Billing & Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Billed From */}
              <div className="p-3 sm:p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                  Billed From
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Clinic</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                      {invoice.clinicId?.clinicName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Doctor</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">
                      Dr. {invoice.doctorId?.name}
                    </p>
                  </div>
                  {invoice.clinicId?.taxId && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Tax ID
                      </p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {invoice.clinicId.taxId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Billed To */}
              <div className="p-3 sm:p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Billed To
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Patient</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">
                      {user?.name || "N/A"}
                    </p>
                  </div>
                  {user?.email && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                  {user?.phone && (
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {user.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-cyan-50/50 rounded-lg border border-cyan-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Invoice Date
                    </p>
                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                      {formatDate(invoice.createdAt)}
                    </p>
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
                      Due Date
                    </p>
                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Services Rendered
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[300px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200">
                        Description
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

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-100 p-4 sm:p-6">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                Payment Summary
              </h3>

              <div className=" ml-auto space-y-2 sm:space-y-3">
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
                      Tax
                    </span>
                    <span className="font-medium text-slate-800 text-sm sm:text-base">
                      ₱{tax.toFixed(2)}
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="text-sm sm:text-base">Discount</span>
                    <span className="font-medium text-sm sm:text-base">
                      -₱{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-2 sm:pt-3 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-slate-800">
                      Total Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-800">
                      ₱{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs sm:text-sm">
                      Amount Paid
                    </span>
                    <span className="font-medium text-slate-800 text-xs sm:text-sm">
                      ₱{invoice.paidAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
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

            {/* Notes Section */}
            {invoice.notes && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50/80 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">
                  Notes
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Receipt Footer - Fixed */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-200 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-500 mb-0.5 sm:mb-1">
                  Thank you for choosing {invoice.clinicId?.clinicName}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  For billing inquiries, please contact our office
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button className="flex gap-2 items-center bg-cyan-500 text-cyan-50 p-4 rounded-md hover:bg-cyan-600">
                  <Download  size={18}/>
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoiceViewModal;
