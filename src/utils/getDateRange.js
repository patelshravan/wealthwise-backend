const getDateRange = (filterType, from, to) => {
  const today = new Date();
  let startDate, endDate;

  switch (filterType) {
    case "today":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "yesterday":
      const y = new Date();
      y.setDate(y.getDate() - 1);
      startDate = new Date(y.setHours(0, 0, 0, 0));
      endDate = new Date(y.setHours(23, 59, 59, 999));
      break;
    case "this_week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "last_week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7 - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "this_month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "last_month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "custom":
      if (from && to) {
        startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
      }
      break;
    default:
      break;
  }

  return { startDate, endDate };
};

module.exports = { getDateRange };
