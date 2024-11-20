import {getBuildConstant} from "../constants/build-constants.jsx";
import moment from "moment";

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

export const getSpendTime = (timeEntries) => {
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.time, 0);

  const hoursInWeek = 168;
  const hoursInDay = 24;
  const minutesInHour = 60;

  const weeks = Math.floor(totalHours / hoursInWeek);
  const remainingHoursAfterWeeks = totalHours % hoursInWeek;

  const days = Math.floor(remainingHoursAfterWeeks / hoursInDay);
  const remainingHoursAfterDays = remainingHoursAfterWeeks % hoursInDay;

  const hours = Math.floor(remainingHoursAfterDays);
  const minutes = Math.round((remainingHoursAfterDays - hours) * minutesInHour);

  let result = '';
  if (weeks > 0) result += `${weeks}w `;
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim();
}

export const getRelativeDate = (dateString) => {
  const inputDate = moment(dateString);

  if (!inputDate.isValid()) {
    return 'Invalid date';
  }

  const now = moment();
  const daysDifference = now.diff(inputDate, 'days');

  if (daysDifference === 0) {
    return 'Today';
  } else if (daysDifference === 1) {
    return '1 day ago';
  } else {
    return `${daysDifference} days ago`;
  }
}

