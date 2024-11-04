import {getBuildConstant} from "../constants/build-constants.jsx";

export const getAPIBaseURL = () => {
  const host = getBuildConstant('REACT_APP_API_HOST');
  const protocol = getBuildConstant('REACT_APP_API_PROTOCOL');
  return `${protocol}://${host}`;
};

export const formatDateIfDate = (dateObj) => {
  if (dateObj instanceof Date) {
    // Format: YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  }
  // If it's not a Date object, return the original value
  return dateObj;
}

export const isNotEmptyObj = (value) =>
  value !== undefined && value !== null && Object.keys(value).length !== 0;

export const getInitials = (name) => {
  return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
}

export const getFirstName = (name) => {
  return name.split(' ')[0];
};

export const getSelectOptions = (options) => {
  return options.map(o => ({value: Number(o.id), label: o?.name || o?.value || o?.summary}));
};

export const getUserSelectOptions = (options) => {
  return options.map(o => ({value: Number(o.id), label: `${o.firstName} ${o.lastName}`}));
};

export const getMultiSelectOptions = (options, ids) => {
  return options.filter(item => ids.includes(item.value));
};

export const formatShortDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const options = {month: 'short', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  } else {
    return "N/A"
  }
}
