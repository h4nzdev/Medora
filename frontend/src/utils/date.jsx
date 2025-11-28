export const useTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Convert to 12-hour format with AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${twelveHour}:${minutes} ${ampm}`;
};

export const formatTo12Hour = (timeString) => {
  if (!timeString) return "";
  if (timeString.includes("AM") || timeString.includes("PM")) {
    return timeString;
  }

  if (timeString.includes(":")) {
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  }
  return `${timeString}:00 PM`;
};

export const createISOFromDateAndTime = (date, time24h) => {
  const [hours, minutes] = time24h.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setUTCHours(hours, minutes, 0, 0);
  return newDate.toISOString(); // Creates "2025-10-19T09:00:00.000Z"
};

export const useDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
