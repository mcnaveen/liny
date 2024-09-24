export const formatPostStatus = (status: string) => {
  switch (status) {
    case "OPEN":
      return "Open";
    case "UNDER_REVIEW":
      return "Under Review";
    case "PLANNED":
      return "Planned";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CLOSED":
      return "Closed";
    default:
      return "Unknown";
  }
};
