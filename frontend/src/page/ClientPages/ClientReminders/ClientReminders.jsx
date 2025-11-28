"use client";

import { useState } from "react";
import { Plus, BellRing, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useReminder } from "../../../context/ReminderContext";
import AddReminderModal from "../../../components/ClientComponents/AddReminderModal/AddReminderModal";
import ReminderDropdown from "../../../components/ClientComponents/ReminderDropdown/ReminderDropdown";
import { formatTo12Hour } from "../../../utils/date";
import Swal from "sweetalert2";

const ClientReminders = () => {
  const { reminders, saveReminders } = useReminder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  const handleSaveReminder = (reminder) => {
    const updated = reminderToEdit
      ? reminders.map((r) => (r.id === reminder.id ? reminder : r))
      : [...reminders, reminder];
    saveReminders(updated);
    setReminderToEdit(null);
  };

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-slate-800 text-xl font-bold",
        htmlContainer: "text-slate-600",
        confirmButton: "rounded-lg px-6 py-3 font-semibold",
        cancelButton: "rounded-lg px-6 py-3 font-semibold",
      },
    });

    if (result.isConfirmed) {
      const updated = reminders.filter((r) => r.id !== id);
      saveReminders(updated);
      toast.success("Reminder removed!");
    }
  };

  const handleEdit = (reminder) => {
    setReminderToEdit(reminder);
    setIsModalOpen(true);
  };

  const openModal = () => {
    setReminderToEdit(null);
    setIsModalOpen(true);
  };

  const stats = [
    {
      title: "Total Reminders",
      value: reminders.length,
      icon: BellRing,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      title: "Active",
      value: reminders.filter((r) => r.isActive).length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Inactive",
      value: reminders.filter((r) => !r.isActive).length,
      icon: AlertCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      title: "Due Today",
      value: reminders.length,
      icon: Clock,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
        <div className="mx-auto">
          <header className="mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  My Reminders
                </h1>
                <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                  Manage your personal health reminders.
                </p>
              </div>
              <button
                onClick={openModal}
                className="group flex items-center justify-center px-6 md:px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-base md:text-lg font-semibold"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Set New Reminder
              </button>
            </div>
          </header>

          <section className="mb-8 md:mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className={`${stat.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`${stat.color} text-sm md:text-base font-semibold uppercase tracking-wider mb-3 truncate opacity-80`}
                        >
                          {stat.title}
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 md:p-4 rounded-xl ${stat.bgColor} ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border ${stat.borderColor}`}
                      >
                        <IconComponent
                          className={`w-6 h-6 md:w-7 md:h-7 ${stat.color}`}
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
                All Reminders
              </h2>
              <p className="text-slate-600 mt-2 text-lg">
                {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>

            {reminders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                  <BellRing className="w-16 h-16 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No reminders yet.
                </h3>
                <p className="text-slate-500 text-lg">
                  Click "Set New Reminder" to add one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {reminders.map((r, index) => (
                  <div
                    key={r.id}
                    className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-2 ${
                            r.isActive
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <div>
                          <p className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-cyan-600 transition-colors duration-300">
                            {r.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg font-semibold transition-all ${
                          r.isActive
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                            : "text-slate-700 bg-slate-100 border border-slate-200"
                        }`}
                      >
                        <BellRing
                          className={`w-4 h-4 mr-1 ${
                            r.isActive ? "animate-pulse" : ""
                          }`}
                        />
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="my-4 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

                    <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl border border-cyan-100 shadow-sm">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-full flex items-center justify-center shadow-md">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-cyan-700 font-bold text-xl">
                          {formatTo12Hour(r.time)}
                        </p>
                        <p className="text-cyan-600 text-sm font-medium">
                          Reminder Time
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleRemove(r.id)}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 hover:shadow-md transition-all font-semibold flex-1 hover:scale-105 border border-red-200"
                      >
                        Remove
                      </button>
                      <ReminderDropdown
                        onEdit={() => handleEdit(r)}
                        reminder={r}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyan-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReminder}
        reminderToEdit={reminderToEdit}
      />
    </>
  );
};

export default ClientReminders;
