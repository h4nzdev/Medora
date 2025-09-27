"use client";
import { useState, useEffect, useContext } from "react";
import { User, MessageCircle, Search, ChevronDown, Filter } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";
import { AuthContext } from "../../../context/AuthContext";
import ClientChatsModal from "./components/ClientChatsModal.jsx";
import ClinicPatientsChatTableBody from "./components/ClinicPatientsChatTableBody.jsx";

const socket = io(import.meta.env.VITE_API_URL);

export default function ClinicPatientsChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const chatsPerPage = 5;

  const fetchMessages = async () => {
    try {
      if (!user || !user._id) {
        setChatHistory([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/clinic/${user._id}`
      );
      const chats = res.data?.chats || [];

      const byPatient = new Map();
      chats.forEach((c) => {
        const patient = c.patientId || {};
        const patientKey = patient._id || "unknown";
        const patientName = patient.name || patient.email || "Unknown";

        if (!byPatient.has(patientKey)) {
          byPatient.set(patientKey, {
            patientId: patientKey,
            patientName,
            lastTimestamp: c.timestamp ? new Date(c.timestamp).getTime() : 0,
            chat: [],
          });
        }

        const entry = byPatient.get(patientKey);
        entry.chat.push({
          role: c.role === "Client" ? "user" : "bot",
          text: c.message,
          timestamp: c.timestamp,
        });
        const ts = c.timestamp ? new Date(c.timestamp).getTime() : 0;
        if (ts > entry.lastTimestamp) entry.lastTimestamp = ts;
      });

      const grouped = Array.from(byPatient.values()).sort(
        (a, b) => b.lastTimestamp - a.lastTimestamp
      );

      setChatHistory(grouped);
    } catch (error) {
      console.error("Error fetching clinic chats:", error);
      if (error.response?.status === 404) {
        setChatHistory([]);
      } else {
        setChatHistory([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchMessages();
      socket.on("message_sent", fetchMessages);
      return () => {
        socket.off("message_sent");
      };
    }
  }, [user]);

  const indexOfLastChat = currentPage * chatsPerPage;
  const indexOfFirstChat = indexOfLastChat - chatsPerPage;
  const currentChats = chatHistory.slice(indexOfFirstChat, indexOfLastChat);
  const totalPages = Math.ceil(chatHistory.length / chatsPerPage);

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
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Patient Chat Overview
              </h1>
              <p className="text-slate-600 mt-1">
                View recent chatbot conversations from patients
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Chats
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {chatHistory?.length}
                </p>
              </div>
              <div className="bg-slate-500 p-4 rounded-2xl shadow-md">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Active Patients
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  {chatHistory?.length}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Recent Messages
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {chatHistory?.reduce(
                    (total, item) => total + item.chat.length,
                    0
                  )}
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <MessageCircle className="w-8 h-8 text-white" />
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
                  placeholder="Search patients or messages..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  disabled
                />
              </div>

              {/* Filter */}
              <button
                type="button"
                className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700 cursor-not-allowed"
                disabled
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Patient ID
                  </th>
                  <th className="font-semibold text-slate-700 px-4">
                    Patient Name
                  </th>
                  <th className="font-semibold text-slate-700 px-4">
                    Last Message
                  </th>
                  <th className="font-semibold text-slate-700 px-4">
                    Last Interaction
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Status</th>
                  <th className="font-semibold text-slate-700 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <ClinicPatientsChatTableBody
                chats={currentChats}
                loading={loading}
                setSelectedChat={setSelectedChat}
                setSelectedPatient={setSelectedPatient}
                fetchMessages={fetchMessages}
              />
            </table>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {indexOfFirstChat + 1}-
              {Math.min(indexOfLastChat, chatHistory.length)} of{" "}
              {chatHistory.length} chats
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

      {selectedChat && (
        <ClientChatsModal
          patient={selectedPatient}
          initialChat={selectedChat}
          onClose={() => {
            setSelectedChat(null);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}
