export const formatTaskStatusToCamelCase = (statusName) => {
  return statusName === 'IN_PROGRESS' ? 'inProgress' : statusName.toLowerCase();
};

export const formatTaskStatusToSnakeCase = (statusName) => {
  return statusName === 'inProgress' ? 'IN_PROGRESS' : statusName.toUpperCase();
};
