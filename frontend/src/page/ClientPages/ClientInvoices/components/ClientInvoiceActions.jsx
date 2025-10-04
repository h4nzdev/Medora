import { MoreHorizontal, Eye, DollarSign } from "lucide-react";
import React, { useState } from "react";

const ClientInvoiceActions = ({ invoice, onView, onPay }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
          <button
            onClick={() => {
              onView(invoice);
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          {invoice.status !== "paid" && (
            <button
              onClick={() => {
                onPay(invoice);
                setDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Pay Invoice
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientInvoiceActions;
