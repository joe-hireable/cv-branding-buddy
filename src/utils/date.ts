/**
 * @file Date Utilities
 * @description Utility functions for date handling and formatting
 */

/**
 * Formats a date into a human-readable string
 * @param {Date} date - The date to format
 * @param {boolean} [includeYear=true] - Whether to include the year in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (date: Date, includeYear = true): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    ...(includeYear && { year: 'numeric' })
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Formats a date range into a human-readable string
 * @param {Date} startDate - The start date
 * @param {Date | null} endDate - The end date (null for current)
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date | null): string => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
};

/**
 * Calculates the duration between two dates in years and months
 * @param {Date} startDate - The start date
 * @param {Date | null} endDate - The end date (null for current)
 * @returns {string} Formatted duration string
 */
export const calculateDuration = (startDate: Date, endDate: Date | null): string => {
  const end = endDate || new Date();
  const diffYears = end.getFullYear() - startDate.getFullYear();
  const diffMonths = end.getMonth() - startDate.getMonth();
  const totalMonths = diffYears * 12 + diffMonths;

  if (totalMonths < 12) {
    return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${
    months === 1 ? 'month' : 'months'
  }`;
}; 