export const cleanSummary = (text) => {
  return text
    .replace(/\*/g, "")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .replace(/\. /g, ".\n\n")
    .trim();
};
