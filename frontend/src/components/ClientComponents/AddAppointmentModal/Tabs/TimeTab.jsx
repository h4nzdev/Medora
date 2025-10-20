"use client";
import { useContext, useState, useMemo } from "react";
import { DoctorContext } from "../../../../context/DoctorContext";
import {
  Clock,
  ChevronLeft,
  Zap,
  Coffee,
  Sun,
  Moon,
  Watch,
  Sparkles,
} from "lucide-react";

const TimeTab = ({ formData, setFormData, nextTab, prevTab }) => {
  const { doctors } = useContext(DoctorContext);
  const [selectedTime, setSelectedTime] = useState(formData.time);
  const [isAnimating, setIsAnimating] = useState(false);

  const doctor = doctors.find((d) => d._id === formData.doctorId);
  const availability = doctor?.availability;

  // FIXED: Proper 24h to 12h conversion without timezone issues
  const generateTimeSlots = (startStr, endStr) => {
    const slots = [];
    if (!startStr || !endStr) return slots;

    const parseTime = (timeStr) => {
      let hours, minutes;
      const timeStrLower = timeStr.toLowerCase().trim();

      // Handle both "HH:MM" and "HH:MM AM/PM" formats
      if (timeStrLower.includes("am") || timeStrLower.includes("pm")) {
        const [time, meridiem] = timeStr.split(" ");
        [hours, minutes] = time.split(":").map(Number);
        if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
      } else {
        // Assume 24h format
        [hours, minutes] = timeStr.split(":").map(Number);
      }
      return { hours, minutes };
    };

    try {
      const { hours: startHour, minutes: startMinute } = parseTime(startStr);
      const { hours: endHour, minutes: endMinute } = parseTime(endStr);

      let currentHour = startHour;
      let currentMinute = startMinute;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        // Create time string in 24h format for storage
        const time24h = `${currentHour
          .toString()
          .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

        // Convert to 12h format for display - NO TIMEZONE BUGS!
        const displayTime = convertTo12Hour(time24h);

        // Add time category for smart grouping
        let category = "midday";
        if (currentHour < 12) category = "morning";
        else if (currentHour < 17) category = "afternoon";
        else category = "evening";

        slots.push({
          value: time24h, // Store as "09:00", "13:30" etc.
          display: displayTime, // Display as "9:00 AM", "1:30 PM" etc.
          category,
          isPopular: currentHour >= 9 && currentHour <= 11,
        });

        // Increment by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }
    } catch (error) {
      console.error("Error generating time slots:", error);
      return [];
    }

    return slots;
  };

  // FIXED: Simple 24h to 12h conversion without Date object timezone issues
  const convertTo12Hour = (time24h) => {
    const [hours, minutes] = time24h.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0, 13-23 to 12, 1-11

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const selectedDay = formData.date.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const scheduleForDay = availability?.find((a) => a.day === selectedDay);

  const timeSlots = useMemo(
    () =>
      scheduleForDay
        ? generateTimeSlots(scheduleForDay.startTime, scheduleForDay.endTime)
        : [],
    [scheduleForDay, formData.date]
  );

  // Group time slots by category
  const groupedSlots = useMemo(() => {
    const groups = {
      morning: [],
      midday: [],
      afternoon: [],
      evening: [],
    };

    timeSlots.forEach((slot) => {
      groups[slot.category].push(slot);
    });

    return Object.entries(groups)
      .filter(([_, slots]) => slots.length > 0)
      .map(([category, slots]) => ({
        category,
        slots,
        icon:
          category === "morning"
            ? Sun
            : category === "afternoon"
            ? Coffee
            : Moon,
        label:
          category === "morning"
            ? "Morning"
            : category === "midday"
            ? "Midday"
            : category === "afternoon"
            ? "Afternoon"
            : "Evening",
      }));
  }, [timeSlots]);

  const handleTimeSelect = async (time24h) => {
    setSelectedTime(time24h);
    setIsAnimating(true);

    // Smooth animation before proceeding
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFormData((prev) => ({ ...prev, time: time24h })); // Store as 24h format
    setIsAnimating(false);
    nextTab();
  };

  const getTimeIcon = (time24h) => {
    const hour = parseInt(time24h.split(":")[0]);
    if (hour < 12) return Sun;
    if (hour < 17) return Coffee;
    return Moon;
  };

  // FIXED: Display selected time properly
  const displaySelectedTime = selectedTime ? convertTo12Hour(selectedTime) : "";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-h-[75vh] overflow-y-auto">
      {/* Enhanced Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Clock className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Select Time</h3>
        </div>
        <p className="text-slate-500 text-sm">
          {selectedDay} • Choose your preferred time
        </p>

        {/* Debug info - remove in production */}
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
          🔧 <strong>Time Debug:</strong> Storing as 24h ({selectedTime}),
          Displaying as 12h ({displaySelectedTime})
        </div>
      </div>

      {/* Doctor Info Card */}
      {doctor && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DR</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">
                Dr. {doctor.name}
              </p>
              <p className="text-slate-500 text-xs">{doctor.specialization}</p>
            </div>
            <Watch className="w-4 h-4 text-cyan-500" />
          </div>
          {scheduleForDay && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-600">
                <strong>Hours:</strong> {scheduleForDay.startTime} -{" "}
                {scheduleForDay.endTime}
              </p>
            </div>
          )}
        </div>
      )}

      {timeSlots.length > 0 ? (
        <div className="space-y-4">
          {/* Quick Time Suggestions */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {timeSlots
              .filter((slot) => slot.isPopular)
              .slice(0, 4)
              .map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(slot.value)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-all flex-shrink-0"
                >
                  <Zap className="w-3 h-3" />
                  {slot.display}
                </button>
              ))}
          </div>

          {/* Grouped Time Slots */}
          <div className="space-y-4">
            {groupedSlots.map((group, groupIndex) => {
              const Icon = group.icon;
              return (
                <div key={group.category} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {group.slots.map((slot, slotIndex) => {
                      const TimeIcon = getTimeIcon(slot.value);
                      const isSelected = selectedTime === slot.value;
                      const isPopular = slot.isPopular;

                      return (
                        <button
                          key={slotIndex}
                          type="button"
                          onClick={() => handleTimeSelect(slot.value)}
                          disabled={isAnimating}
                          className={`
                            relative p-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out
                            border-2 backdrop-blur-sm
                            ${
                              isSelected
                                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-500 shadow-lg scale-105"
                                : "bg-white/80 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 text-slate-700 hover:scale-105"
                            }
                            ${
                              isPopular && !isSelected
                                ? "ring-1 ring-amber-200 bg-amber-50"
                                : ""
                            }
                            transform transition-all duration-300
                            hover:shadow-md active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {/* Popular badge */}
                          {isPopular && !isSelected && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          )}

                          {/* Time icon */}
                          <TimeIcon
                            className={`w-3 h-3 mx-auto mb-1 ${
                              isSelected ? "text-white" : "text-slate-400"
                            }`}
                          />

                          {/* Time text */}
                          <span
                            className={`font-semibold ${
                              isSelected ? "text-white" : "text-slate-700"
                            }`}
                          >
                            {slot.display}
                          </span>

                          {/* Selection glow effect */}
                          {isSelected && (
                            <div className="absolute inset-0 rounded-xl bg-cyan-500/20 animate-ping opacity-20"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-700">
              {scheduleForDay === undefined && availability
                ? `No Availability on ${selectedDay}`
                : "Availability Not Set"}
            </h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              {scheduleForDay === undefined && availability
                ? `Dr. ${doctor?.name} isn't available on ${selectedDay}. Try selecting a different date.`
                : "This doctor hasn't set their working hours yet. Please contact the clinic directly."}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevTab}
          disabled={isAnimating}
          className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Date
        </button>

        {selectedTime && (
          <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">
              {displaySelectedTime}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TimeTab;
