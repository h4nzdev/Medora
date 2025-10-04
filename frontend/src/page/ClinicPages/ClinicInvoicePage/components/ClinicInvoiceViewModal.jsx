
import React from 'react';
import { X, FileText, User, Briefcase, Calendar, Hash, DollarSign, List, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

const ClinicInvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: 'bg-emerald-100 text-emerald-800',
      unpaid: 'bg-amber-100 text-amber-800',
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-slate-100 text-slate-800';
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in zoom-in-95">
        <div className="relative p-6 pb-4 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-xl">
                <FileText className="w-7 h-7 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Invoice Details
                </h2>
                <p className="text-base text-slate-500">
                  #{invoice.invoiceNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 absolute top-4 right-4"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 text-lg mb-3">Patient Info</h3>
                <div className="space-y-2 text-base">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">{invoice.patientName}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 text-lg mb-3">Clinic & Doctor</h3>
                <div className="space-y-2 text-base">
                   <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">{invoice.clinicId?.clinicName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">Dr. {invoice.doctorName}</span>
                  </div>
                </div>
              </div>
               <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 text-lg mb-3">Invoice Info</h3>
                <div className="space-y-2 text-base">
                   <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">Issued: {formatDate(invoice.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-medium text-slate-700">Due: {formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 text-lg mb-3">Payment Details</h3>
                 <div className="space-y-4">
                  <div className="flex justify-between items-center text-base">
                    <span className="text-slate-600 font-medium">Total Amount:</span>
                    <span className="font-bold text-slate-800 text-lg">₱{invoice.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-slate-600 font-medium">Status:</span>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <h3 className="font-semibold text-slate-800 text-lg mb-3">Services</h3>
                <ul className="space-y-2">
                  {invoice.services?.map((service, index) => (
                    <li key={index} className="flex justify-between items-center text-base p-2 rounded-lg hover:bg-slate-100">
                      <span className="font-medium text-slate-700">{service.name}</span>
                      <span className="font-semibold text-slate-800">₱{parseFloat(service.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInvoiceViewModal;
