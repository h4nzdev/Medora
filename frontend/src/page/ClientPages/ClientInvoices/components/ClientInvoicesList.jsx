import React from "react";
import { useDate } from "../../../utils/date";
import { CheckCircle, Clock, AlertCircle, DollarSign } from "lucide-react";

const ClientInvoicesList = ({ invoices }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: "bg-cyan-100 text-cyan-800",
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
    return iconMap[status] || null;
  };

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="text-center py-10 text-slate-500 italic">
          No invoices found.
        </div>
      ) : (
        invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex-1 mb-4 sm:mb-0">
                <p className="font-semibold text-slate-800">
                  {invoice.clinicId?.clinicName}
                </p>
                <p className="text-sm text-slate-500">
                  Invoice #{invoice.invoiceNumber}
                </p>
                <p className="text-sm text-slate-500">
                  Billed by: Dr. {invoice.doctorId?.name}
                </p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  ₱{invoice.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-slate-500">
                  Due on {useDate(invoice.dueDate)}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-start sm:justify-end mt-4 sm:mt-0">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    invoice.status
                  )}`}
                >
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientInvoicesList;
