const calculateNextDueDate = (baseDate, mode) => {
  const date = new Date(baseDate);
  switch (mode) {
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "half-yearly":
      date.setMonth(date.getMonth() + 6);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
};

module.exports = { calculateNextDueDate };
