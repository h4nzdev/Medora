import React, { useState } from "react";
import { X, Send, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const ConsultationLinkModal = ({
  isOpen,
  onClose,
  appointment,
  onSendLink,
}) => {
  const [consultationLink, setConsultationLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendLink = async () => {
    if (!consultationLink.trim()) {
      toast.error("Please enter a consultation link");
      return;
    }

    setIsLoading(true);
    try {
      await onSendLink(consultationLink, appointment);
      setConsultationLink("");
      onClose();
    } catch (error) {
      console.error("Failed to send link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Add Consultation Link
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Patient Info */}
        <div className="mb-4 p-3 bg-slate-50 rounded-md">
          <p className="font-medium text-slate-800">
            {appointment?.patientId?.name}
          </p>
          <p className="text-sm text-slate-600">
            {appointment?.patientId?.email}
          </p>
        </div>

        {/* Link Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Consultation Link
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="url"
              placeholder="https://meet.google.com/... or https://zoom.us/..."
              value={consultationLink}
              onChange={(e) => setConsultationLink(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enter Google Meet, Zoom, or other video consultation link
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSendLink}
            disabled={isLoading || !consultationLink.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationLinkModal;
