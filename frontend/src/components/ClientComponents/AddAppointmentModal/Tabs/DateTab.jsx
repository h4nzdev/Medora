"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Smartphone,
  Clock,
  Zap,
} from "lucide-react";

const DateTab = ({ formData, setFormData, nextTab }) => {
  const [selectedDate, setSelectedDate] = useState(formData.date);
  const [activeView, setActiveView] = useState("calendar"); // 'calendar' or 'quick'

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date }));
    setTimeout(() => nextTab(), 200);
  };

  // Compact quick dates
  const quickDates = [
    { label: "Today", date: new Date(), emoji: "🚀" },
    {
      label: "Tomorrow",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      emoji: "⭐",
    },
    { label: "Mon", date: getNextWeekday(1), emoji: "📅" },
    { label: "Wed", date: getNextWeekday(3), emoji: "💼" },
    { label: "Fri", date: getNextWeekday(5), emoji: "🎉" },
  ];

  function getNextWeekday(day) {
    const date = new Date();
    date.setDate(date.getDate() + ((day - date.getDay() + 7) % 7));
    return date;
  }

  // Mobile-optimized tile classes
  const tileClassName = ({ date, view }) => {
    const classes = [];
    if (view === "month") {
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      if (isToday)
        classes.push(
          "!bg-gradient-to-br from-cyan-500 to-blue-600 !text-white font-semibold"
        );
      if (isSelected && !isToday)
        classes.push("!bg-cyan-500/20 !border !border-cyan-500");
      if (isPast && !isToday)
        classes.push("!text-slate-300 !cursor-not-allowed opacity-50");
    }
    return classes.join(" ");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-h-[75vh] overflow-y-auto">
      {/* Ultra Compact Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Select Date</h3>
      </div>

      {/* View Toggle - Super Compact */}
      <div className="flex bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => setActiveView("quick")}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeView === "quick"
              ? "bg-white text-cyan-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Zap className="w-3 h-3 mx-auto mb-0.5" />
          Quick
        </button>
        <button
          onClick={() => setActiveView("calendar")}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeView === "calendar"
              ? "bg-white text-cyan-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CalendarIcon className="w-3 h-3 mx-auto mb-0.5" />
          Calendar
        </button>
      </div>

      {/* Quick Select View - Ultra Compact */}
      {activeView === "quick" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {quickDates.slice(0, 3).map((quickDate, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(quickDate.date)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-cyan-500 hover:text-cyan-600 transition-all active:scale-95 shadow-xs"
              >
                <div className="text-lg mb-0.5">{quickDate.emoji}</div>
                {quickDate.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickDates.slice(3).map((quickDate, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(quickDate.date)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-cyan-500 hover:text-cyan-600 transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
              >
                <span className="text-sm">{quickDate.emoji}</span>
                {quickDate.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Calendar View */}
      {activeView === "calendar" && (
        <div className="bg-white rounded-xl p-2 shadow-lg border border-slate-200">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            tileClassName={tileClassName}
            prevLabel={<ChevronLeft className="w-3 h-3 text-slate-600" />}
            nextLabel={<ChevronRight className="w-3 h-3 text-slate-600" />}
            navigationLabel={({ date }) => (
              <span className="font-semibold text-slate-800 text-xs">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            formatShortWeekday={(locale, date) =>
              ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
            }
            showNeighboringMonth={false}
            className="border-0 compact-calendar !w-full"
          />
        </div>
      )}

      {/* Micro Date Preview */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3 h-3 text-cyan-600" />
            <span className="text-xs font-medium text-slate-700">
              Selected:
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {selectedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Continue Button - Always Visible */}
      <button
        onClick={() => nextTab()}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-all duration-200 hover:shadow-xl transform flex items-center justify-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Choose Time
      </button>

      <style jsx>{`
        .compact-calendar .react-calendar__tile {
          padding: 6px 2px;
          font-size: 0.75rem;
          height: 36px;
        }

        .compact-calendar .react-calendar__month-view__weekdays {
          font-size: 0.65rem;
          padding-bottom: 4px;
          margin-bottom: 4px;
        }

        .compact-calendar .react-calendar__navigation {
          margin-bottom: 6px;
          height: 32px;
        }

        .compact-calendar .react-calendar__navigation button {
          min-width: 32px;
          font-size: 0.75rem;
        }

        .compact-calendar .react-calendar__tile:enabled:hover {
          transform: scale(1.1);
        }

        .compact-calendar .react-calendar__tile:enabled:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default DateTab;
