import React, { useState, useEffect, useContext } from "react";
import { Receipt, Search } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { getInvoicesByPatient } from "../../../services/invoiceService";
import ClientInvoicesList from "./components/ClientInvoicesList";
import { socket } from "../../../services/socket";

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

  const filteredInvoices = invoices.filter((invoice) => {
    const searchTermLower = searchTerm.toLowerCase();
    const clinicName = invoice.clinicId?.clinicName?.toLowerCase() || "";
    const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || "";
    return clinicName.includes(searchTermLower) || invoiceNumber.includes(searchTermLower);
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
              My Invoices
            </h1>
            <p className="text-slate-600 mt-1">View and manage your invoices.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by clinic or invoice #..."
                className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading invoices...</div>
          ) : (
            <ClientInvoicesList invoices={filteredInvoices} />
          )}
        </div>
      </div>
    </div>
  );
}
