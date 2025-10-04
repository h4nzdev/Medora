import React, { useState, useEffect, useContext } from "react";
import {
  Receipt,
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { getInvoicesByPatient } from "../../../services/invoiceService";
import socket from "../../../services/socket.js";
import { formatDate, useDate, useTime } from "../../../utils/date";
import ClientInvoiceActions from "./components/ClientInvoiceActions.jsx";

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchInvoices = async () => {
    if (user?._id) {
      try {
        const data = await getInvoicesByPatient(user._id);
        setInvoices(data || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
    socket.on("invoice_updated", fetchInvoices);

    return () => {
      socket.off("invoice_updated", fetchInvoices);
    };
  }, [user]);

  const handleView = (invoice) => {
    console.log("Viewing invoice:", invoice);
    // Implement view logic, e.g., open a modal with invoice details
  };

  const handlePay = (invoice) => {
    console.log("Paying invoice:", invoice);
    // Implement payment logic, e.g., redirect to a payment page
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchTermLower = searchTerm.toLowerCase();
    const clinicName = invoice.clinicId?.clinicName?.toLowerCase() || "";
    const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || "";
    return (
      clinicName.includes(searchTermLower) ||
      invoiceNumber.includes(searchTermLower)
    );
  });

  // Calculate stats
  const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid');
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');

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
    return iconMap[status] || null;
  };

  // Stats
  const stats = [
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: Receipt,
      color: "bg-gradient-to-br from-slate-50 to-slate-100",
      iconBg: "bg-gradient-to-br from-slate-100 to-slate-200",
      iconColor: "text-slate-600",
      textColor: "text-slate-700",
    },
    {
      title: "Total Amount",
      value: `₱${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-gradient-to-br from-cyan-50 to-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-700",
    },
    {
      title: "Paid",
      value: paidInvoices.length,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
    },
    {
      title: "Pending/Overdue",
      value: unpaidInvoices.length + overdueInvoices.length,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                My Invoices
              </h1>
              <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                View and manage your medical invoices and billing information.
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${stat.textColor} text-sm md:text-base font-semibold uppercase tracking-wider mb-3 truncate opacity-80`}
                      >
                        {stat.title}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 md:p-4 rounded-xl ${stat.iconBg} ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent
                        className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              All Invoices
            </h2>
            <p className="text-slate-600 mt-2 text-lg">
              {filteredInvoices.length} invoice
              {filteredInvoices.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by clinic or invoice #..."
                className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50 w-full bg-white/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                <Receipt className="w-16 h-16 text-slate-400 mx-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Loading invoices...
              </h3>
            </div>
          ) : (
            <>
              {/* Mobile List */}
              <div className="block lg:hidden space-y-4">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <div
                      key={invoice._id || index}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                            {invoice.clinicId?.clinicName}
                          </h3>
                          <p className="text-slate-600 text-base mb-3 font-medium">
                            Invoice #{invoice.invoiceNumber}
                          </p>
                          <p className="text-slate-600 text-sm mb-2">
                            Dr. {invoice.doctorId?.name}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
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

                      <div className="grid grid-cols-2 gap-4 text-base mb-4">
                        <div className="bg-slate-50/80 rounded-xl p-3">
                          <p className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                            Amount
                          </p>
                          <p className="font-bold text-slate-700">
                            ₱{invoice.totalAmount?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                        <div className="bg-slate-50/80 rounded-xl p-3">
                          <p className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                            Due Date
                          </p>
                          <p className="font-bold text-slate-700">
                            {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base text-slate-700 font-medium">
                              Services: {invoice.services?.length || 0} item(s)
                            </p>
                            <p className="text-sm text-slate-500">
                              Created: {formatDate(invoice.createdAt)}
                            </p>
                          </div>
                          <ClientInvoiceActions invoice={invoice} onView={handleView} onPay={handlePay} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                      <Receipt className="w-16 h-16 text-slate-400 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      No invoices found
                    </h3>
                    <p className="text-slate-500 text-lg">
                      Your invoices will appear here once available.
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <tr>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Invoice Details
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Clinic
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Doctor
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Amount
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Due Date
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Status
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Services
                      </th>
                      <th className="py-6 px-6 font-bold text-slate-700 text-base">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice, index) => (
                        <tr
                          key={invoice._id || index}
                          className="hover:bg-slate-50/50 transition-all duration-300 border-t border-slate-200/30 group"
                        >
                          <td className="py-6 px-6">
                            <p className="font-bold text-slate-800 text-lg group-hover:text-cyan-600 transition-colors duration-300">
                              #{invoice.invoiceNumber}
                            </p>
                            <p className="text-base text-slate-500 font-medium">
                              ID: {invoice._id?.slice(-6)}
                            </p>
                          </td>
                          <td className="px-6">
                            <p className="font-semibold text-slate-700 text-base">
                              {invoice.clinicId?.clinicName}
                            </p>
                          </td>
                          <td className="px-6">
                            <p className="font-semibold text-slate-700 text-base">
                              Dr. {invoice.doctorId?.name}
                            </p>
                          </td>
                          <td className="px-6">
                            <p className="font-bold text-slate-800 text-lg">
                              ₱{invoice.totalAmount?.toFixed(2) || "0.00"}
                            </p>
                          </td>
                          <td className="px-6">
                            <p className="font-semibold text-slate-700 text-base">
                              {formatDate(invoice.dueDate)}
                            </p>
                          </td>
                          <td className="px-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusBadge(
                                invoice.status
                              )}`}
                            >
                              {getStatusIcon(invoice.status)}
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6">
                            <span className="inline-block bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-xl text-base font-semibold shadow-sm">
                              {invoice.services?.length || 0} item(s)
                            </span>
                          </td>
                          <td className="px-6 text-right">
                           <ClientInvoiceActions invoice={invoice} onView={handleView} onPay={handlePay} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-16">
                          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 w-fit mx-auto mb-6">
                            <Receipt className="w-20 h-20 text-slate-400 mx-auto" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-700 mb-3">
                            No invoices found
                          </h3>
                          <p className="text-slate-500 text-lg">
                            Your invoices will appear here once available.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}