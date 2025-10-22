export const useTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Convert to 12-hour format with AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${twelveHour}:${minutes} ${ampm}`;
  // Returns "9:00 AM" from "2025-10-19T09:00:00.000+00:00"
  // Returns "2:30 PM" from "2025-10-19T14:30:00.000+00:00"
  // Returns "12:00 AM" from "2025-10-19T00:00:00.000+00:00"
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
