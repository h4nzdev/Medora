import React from "react";
import InvoiceActions from "./InvoiceActions";
import { useDate } from "../../../../utils/date";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
} from "lucide-react";

const InvoiceTableBody = ({ invoices, onView, onEdit, onDelete, onSend }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: "bg-cyan-100 text-cyan-800",
      unpaid: "bg-amber-100 text-amber-800",
      pending: "bg-yellow-100 text-yellow-800",
      partial: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
    };
    return statusMap[status] || "bg-slate-100 text-slate-800";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      paid: <CheckCircle className="w-4 h-4" />,
      unpaid: <Clock className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      partial: <DollarSign className="w-4 h-4" />,
      overdue: <AlertCircle className="w-4 h-4" />,
    };
    return iconMap[status] || <Receipt className="w-4 h-4" />;
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
              <p className="text-sm text-slate-500">
                {invoice._id.slice(0, 10)}
              </p>
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
                ₱{invoice.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">
                Paid: ${invoice.paidAmount}
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
                invoice={invoice}
                onView={() => onView(invoice)}
                onEdit={() => onEdit(invoice)}
                onDelete={() => onDelete(invoice._id)}
                onSend={() => onSend(invoice._id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};

export default InvoiceTableBody;
