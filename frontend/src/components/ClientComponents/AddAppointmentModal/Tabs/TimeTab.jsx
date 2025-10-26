"use client";
import { useContext, useState, useMemo } from "react";
import { DoctorContext } from "../../../../context/DoctorContext";
import { Clock, ChevronLeft, Zap } from "lucide-react";

const TimeTab = ({ formData, setFormData, nextTab, prevTab }) => {
  const { doctors } = useContext(DoctorContext);
  const [selectedTime, setSelectedTime] = useState(formData.time);
  const [isAnimating, setIsAnimating] = useState(false);

  const doctor = doctors.find((d) => d._id === formData.doctorId);
  const availability = doctor?.availability;

  // Keep all the same time generation functions
  const generateTimeSlots = (startStr, endStr) => {
    const slots = [];
    if (!startStr || !endStr) return slots;

    const parseTime = (timeStr) => {
      let hours, minutes;
      const timeStrLower = timeStr.toLowerCase().trim();

      if (timeStrLower.includes("am") || timeStrLower.includes("pm")) {
        const [time, meridiem] = timeStr.split(" ");
        [hours, minutes] = time.split(":").map(Number);
        if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
      } else {
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
        const time24h = `${currentHour
          .toString()
          .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

        const displayTime = convertTo12Hour(time24h);

        let category = "midday";
        if (currentHour < 12) category = "morning";
        else if (currentHour < 17) category = "afternoon";
        else category = "evening";

        slots.push({
          value: time24h,
          display: displayTime,
          category,
          isPopular: currentHour >= 9 && currentHour <= 11,
        });

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

  const convertTo12Hour = (time24h) => {
    const [hours, minutes] = time24h.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
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

  const handleTimeSelect = async (time24h) => {
    setSelectedTime(time24h);
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFormData((prev) => ({ ...prev, time: time24h }));
    setIsAnimating(false);
    nextTab();
  };

  const displaySelectedTime = selectedTime ? convertTo12Hour(selectedTime) : "";

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto">
      {/* Simplified Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Select Time</h3>
        </div>
        <p className="text-gray-500 text-sm">
          {selectedDay} • {doctor?.name}
        </p>
      </div>

      {/* Simplified Time Slots Grid */}
      {timeSlots.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot, index) => {
            const isSelected = selectedTime === slot.value;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTimeSelect(slot.value)}
                disabled={isAnimating}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {slot.display}
              </button>
            );
          })}
        </div>
      ) : (
        /* Simplified Empty State */
        <div className="text-center py-8 space-y-3">
          <Clock className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-medium text-gray-700">
              {scheduleForDay === undefined && availability
                ? `No Availability on ${selectedDay}`
                : "Availability Not Set"}
            </h4>
            <p className="text-gray-500 text-sm">
              {scheduleForDay === undefined && availability
                ? "Try selecting a different date"
                : "Please contact the clinic directly"}
            </p>
          </div>
        </div>
      )}

      {/* Simplified Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={prevTab}
          disabled={isAnimating}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {selectedTime && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {displaySelectedTime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTab;
