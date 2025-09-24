"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { Plus, BellRing, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/AuthContext";
import AddReminderModal from "../../../components/ClientComponents/AddReminderModal/AddReminderModal";
import ReminderDropdown from "../../../components/ClientComponents/ReminderDropdown/ReminderDropdown";
import sound from "../../../assets/reminder2.mp3";
import ringtone from "../../../assets/ringtone.mp3";

const ClientReminders = () => {
  const { user } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [dueReminder, setDueReminder] = useState(null);
  const callTimer = useRef(null);

  const alarmSound = new Audio(sound);
  const ringtoneSound = new Audio(ringtone);

  useEffect(() => {
    if (user && user._id) {
      const storedReminders = localStorage.getItem(`reminders_${user._id}`);
      if (storedReminders) setReminders(JSON.parse(storedReminders));
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      reminders.forEach((r) => {
        if (
          r.time === currentTime &&
          r.isActive &&
          r.lastAcknowledgedDate !== today
        ) {
          if (!dueReminder) {
            setDueReminder(r);
            setIsNotificationModalOpen(true);
            alarmSound.currentTime = 0;
            alarmSound.play().catch((err) => {
              console.warn("Sound play blocked by browser:", err);
            });
          }
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders, alarmSound, dueReminder]);

  useEffect(() => {
    if (isNotificationModalOpen && dueReminder) {
      callTimer.current = setTimeout(() => {
        toast.info(
          `📞 Mock call initiated for reminder: ${dueReminder.name}. You did not acknowledge in time.`
        );
        setIsNotificationModalOpen(false);
        setDueReminder(null);
        alarmSound.pause();
        ringtoneSound.currentTime = 0;
        ringtoneSound.play().catch((err) => {
          console.warn("Sound play blocked by browser:", err);
        });
      }, 30000); // 30 seconds
    }

    return () => {
      if (callTimer.current) {
        clearTimeout(callTimer.current);
      }
    };
  }, [isNotificationModalOpen, dueReminder, alarmSound]);

  const saveReminders = (updated) => {
    setReminders(updated);
    localStorage.setItem(`reminders_${user._id}`, JSON.stringify(updated));
    setReminderToEdit(null);
  };

  const handleSaveReminder = (reminder) => {
    const updated = reminderToEdit
      ? reminders.map((r) => (r.id === reminder.id ? reminder : r))
      : [...reminders, reminder];
    saveReminders(updated);
  };

  const handleAcknowledge = () => {
    if (dueReminder) {
      if (callTimer.current) {
        clearTimeout(callTimer.current);
      }

      const today = new Date().toISOString().split("T")[0];
      const updatedReminders = reminders.map((r) =>
        r.id === dueReminder.id
          ? {
              ...r,
              notifiedCount: (r.notifiedCount || 0) + 1,
              lastAcknowledgedDate: today,
            }
          : r
      );
      saveReminders(updatedReminders);
      setIsNotificationModalOpen(false);
      setDueReminder(null);

      // ✅ stop sounds
      alarmSound.pause();
      alarmSound.currentTime = 0;
      ringtoneSound.pause();
      ringtoneSound.currentTime = 0;
    }
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this reminder?")) {
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

  const stats = {
    total: reminders.length,
    active: reminders.filter((r) => r.isActive).length,
    inactive: reminders.filter((r) => !r.isActive).length,
    today: reminders.length,
  };

  return (
    <>
      <div className="w-full min-h-screen bg-slate-50 pb-6">
        <div className="mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                My Reminders
              </h1>
              <p className="text-slate-600 mt-2 font-medium tracking-wide">
                Manage your personal health reminders.
              </p>
            </div>
            <button
              onClick={openModal}
              className="group flex items-center justify-center px-6 py-3 bg-cyan-600/90 text-white rounded-xl shadow-lg hover:bg-cyan-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Set New Reminder
            </button>
          </header>

          <section className="grid grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 rounded-xl p-6 shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-slate-600 font-medium">Total Reminders</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <BellRing className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6 shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {stats.active}
                  </p>
                  <p className="text-slate-600 font-medium">Active</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6 shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-slate-600">
                    {stats.inactive}
                  </p>
                  <p className="text-slate-600 font-medium">Inactive</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6 shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-cyan-700">
                    {stats.today}
                  </p>
                  <p className="text-slate-600 font-medium">Due Today</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </div>
          </section>

          {reminders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellRing className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-lg">
                No reminders yet.
              </p>
              <p className="text-slate-500 mt-2">
                Click "Set New Reminder" to add one!
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders.map((r, index) => (
                <div
                  key={r.id}
                  className="group bg-white/70 rounded-xl p-6 shadow flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-cyan-200"
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
                        <p className="text-lg font-bold text-slate-800 group-hover:text-slate-900">
                          {r.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
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

                  <div className="flex items-center gap-3 mb-6 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-cyan-700 font-bold text-xl">
                        {r.time}
                      </p>
                      <p className="text-cyan-600 text-sm">Reminder Time</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleRemove(r.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium flex-1 hover:scale-105"
                    >
                      Remove
                    </button>
                    <ReminderDropdown
                      onEdit={() => handleEdit(r)}
                      reminder={r}
                    />
                  </div>

                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyan-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {isNotificationModalOpen && dueReminder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all scale-100">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Reminder!
            </h2>
            <p className="mb-6 text-lg text-slate-600">
              It's time for your reminder:{" "}
              <strong className="text-cyan-700">{dueReminder.name}</strong>
            </p>
            <button
              onClick={handleAcknowledge}
              className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700 transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

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
