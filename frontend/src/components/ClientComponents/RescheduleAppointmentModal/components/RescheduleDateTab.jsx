"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Zap,
  History,
} from "lucide-react";

const RescheduleDateTab = ({
  formData,
  setFormData,
  nextTab,
  originalDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(formData.date);
  const [activeView, setActiveView] = useState("calendar");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date }));
    setTimeout(() => nextTab(), 200);
  };

  // Quick dates with emphasis on original date
  const quickDates = [
    {
      label: "Original",
      date: new Date(originalDate),
      emoji: "📌",
      isOriginal: true,
    },
    {
      label: "Today",
      date: new Date(),
      emoji: "🚀",
    },
    {
      label: "Tomorrow",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      emoji: "⭐",
    },
    {
      label: "Mon",
      date: getNextWeekday(1),
      emoji: "📅",
    },
    {
      label: "Wed",
      date: getNextWeekday(3),
      emoji: "💼",
    },
    {
      label: "Fri",
      date: getNextWeekday(5),
      emoji: "🎉",
    },
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
      const isOriginal =
        date.toDateString() === new Date(originalDate).toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      if (isToday)
        classes.push(
          "!bg-gradient-to-br from-cyan-500 to-blue-600 !text-white font-semibold"
        );
      if (isOriginal)
        classes.push("!bg-amber-100 !border !border-amber-400 font-semibold");
      if (isSelected && !isToday && !isOriginal)
        classes.push("!bg-orange-500/20 !border !border-orange-500");
      if (isPast && !isToday && !isOriginal)
        classes.push("!text-slate-300 !cursor-not-allowed opacity-50");
    }
    return classes.join(" ");
  };

  const formatOriginalDate = new Date(originalDate).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-h-[75vh] overflow-y-auto">
      {/* Header with Original Date Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
          <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Select New Date</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-3">
          <History className="w-4 h-4 text-amber-600" />
          <span>Original: {formatOriginalDate}</span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => setActiveView("quick")}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeView === "quick"
              ? "bg-white text-orange-600 shadow-sm"
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
              ? "bg-white text-orange-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CalendarIcon className="w-3 h-3 mx-auto mb-0.5" />
          Calendar
        </button>
      </div>

      {/* Quick Select View */}
      {activeView === "quick" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {quickDates.slice(0, 2).map((quickDate, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(quickDate.date)}
                className={`p-3 border rounded-lg text-sm font-medium transition-all active:scale-95 shadow-xs ${
                  quickDate.isOriginal
                    ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                    : "bg-white border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600"
                }`}
              >
                <div className="text-lg mb-1">{quickDate.emoji}</div>
                {quickDate.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickDates.slice(2, 4).map((quickDate, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(quickDate.date)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
              >
                <span className="text-sm">{quickDate.emoji}</span>
                {quickDate.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickDates.slice(4).map((quickDate, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(quickDate.date)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
              >
                <span className="text-sm">{quickDate.emoji}</span>
                {quickDate.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar View */}
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

      {/* Date Preview */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3 h-3 text-orange-600" />
            <span className="text-xs font-medium text-slate-700">
              New Date:
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => nextTab()}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-all duration-200 hover:shadow-xl transform flex items-center justify-center gap-2"
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

export default RescheduleDateTab;
