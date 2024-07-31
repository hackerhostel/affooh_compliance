export const formatDateIfDate = (dateObj) => {
  if (dateObj instanceof Date) {
    // Format: YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  }
  // If it's not a Date object, return the original value
  return dateObj;
}