export const groupTickets = (tickets, groupBy, sortBy) => {
  // Grouping logic based on groupBy (e.g., by status, user, priority)
  const grouped = tickets.reduce((acc, ticket) => {
    const key = ticket[groupBy];
    acc[key] = acc[key] ? [...acc[key], ticket] : [ticket];
    return acc;
  }, {});

  // Sorting logic
  for (let key in grouped) {
    grouped[key].sort((a, b) => {
      if (sortBy === "priority") return b.priority - a.priority;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }

  return grouped;
};
