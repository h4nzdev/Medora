"use client";
import { useContext } from "react";
import { DoctorContext } from "../../../../context/DoctorContext";

const TimeTab = ({ formData, setFormData, nextTab, prevTab }) => {
  const { doctors } = useContext(DoctorContext);
  const doctor = doctors.find((d) => d._id === formData.doctorId);
  const availability = doctor?.availability;

  const generateTimeSlots = (startStr, endStr) => {
    const slots = [];
    if (!startStr || !endStr) return slots;

    const date = new Date(formData.date.toDateString());

    const parseTime = (timeStr) => {
      let hours, minutes;
      const timeStrLower = timeStr.toLowerCase();
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

      const startDate = new Date(date.getTime());
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(date.getTime());
      endDate.setHours(endHour, endMinute, 0, 0);

      let current = new Date(startDate);
      while (current < endDate) {
        slots.push(
          current.getHours().toString().padStart(2, "0") +
            ":" +
            current.getMinutes().toString().padStart(2, "0")
        );
        current.setMinutes(current.getMinutes() + 30);
      }
    } catch (error) {
      console.error("Error parsing time:", error);
      return [];
    }

    return slots;
  };

  const selectedDay = formData.date.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const scheduleForDay = availability?.find((a) => a.day === selectedDay);

  const timeSlots = scheduleForDay
    ? generateTimeSlots(scheduleForDay.startTime, scheduleForDay.endTime)
    : [];

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
    nextTab();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-center mb-6">Select a Time</h3>
      {timeSlots.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map((time, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTimeSelect(time)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
                formData.time === time
                  ? "bg-cyan-500 text-white shadow-md scale-105"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">
          {scheduleForDay === undefined && availability
            ? `The doctor is not available on ${selectedDay}. Please select another date.`
            : "This doctor has not set their availability. Please contact the clinic."}
        </p>
      )}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevTab}
          className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TimeTab;
