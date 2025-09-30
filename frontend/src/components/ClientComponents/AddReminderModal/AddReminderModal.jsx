import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { X, Clock, Bell, Check, Edit } from "lucide-react";
import { toast } from "sonner";

const AddReminderModal = ({ isOpen, onClose, onSave, reminderToEdit }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (reminderToEdit) {
      setName(reminderToEdit.name);
      setTime(reminderToEdit.time);
      setIsActive(reminderToEdit.isActive);
    } else {
      setName("");
      setTime("");
      setIsActive(true);
    }
  }, [reminderToEdit, isOpen]);

  const handleSave = () => {
    const reminder = {
      userId: user._id,
      id: reminderToEdit ? reminderToEdit.id : Date.now(),
      name,
      time,
      isActive,
      notifiedCount: reminderToEdit ? reminderToEdit.notifiedCount : 0,
      lastAcknowledgedDate: reminderToEdit ? reminderToEdit.lastAcknowledgedDate : null,
    };
    onSave(reminder);
    toast.success("Reminder added successfully");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                reminderToEdit
                  ? "bg-gradient-to-br from-orange-500 to-amber-600"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            >
              {reminderToEdit ? (
                <Edit className="w-5 h-5 text-white" />
              ) : (
                <Bell className="w-5 h-5 text-white" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              {reminderToEdit ? "Edit Reminder" : "Set New Reminder"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Reminder Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Reminder Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Take morning medication"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-green-100" : "bg-slate-200"
                }`}
              >
                <Check
                  className={`w-4 h-4 ${
                    isActive ? "text-green-600" : "text-slate-400"
                  }`}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-800">
                  Active Reminder
                </span>
                <p className="text-xs text-slate-500">
                  Enable notifications for this reminder
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 rounded-b-2xl flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 shadow-sm ${
              reminderToEdit
                ? "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {reminderToEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReminderModal;
