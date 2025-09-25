import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import sound from "../assets/reminder2.mp3";
import ringtone from "../assets/ringtone.mp3";

const ReminderContext = createContext();

export const useReminder = () => useContext(ReminderContext);

export const ReminderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
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
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [reminders, alarmSound, dueReminder]);

  useEffect(() => {
    if (isNotificationModalOpen && dueReminder) {
      callTimer.current = setTimeout(() => {
        if (user) {
          toast.info(
            `Calling ${user.phone} initiated for reminder: ${dueReminder.name}. You did not acknowledge in time.`
          );
        }
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
  }, [isNotificationModalOpen, dueReminder, alarmSound, ringtoneSound, user]);

  const saveReminders = (updated) => {
    setReminders(updated);
    if (user && user._id) {
      localStorage.setItem(`reminders_${user._id}`, JSON.stringify(updated));
    }
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

  return (
    <ReminderContext.Provider value={{ reminders, saveReminders }}>
      {children}
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
    </ReminderContext.Provider>
  );
};
