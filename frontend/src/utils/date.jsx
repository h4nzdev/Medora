export const useTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`; // Returns "09:00" from "2025-10-19T09:00:00.000+00:00"
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
