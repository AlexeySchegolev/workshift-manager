/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Safely converts a date to ISO date string format (YYYY-MM-DD)
 * @param date - Date object or string to convert
 * @returns Date string in YYYY-MM-DD format
 */
export const toDateString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If it's already a string, assume it's in ISO format and extract date part
    return date.split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

/**
 * Safely converts a date to full ISO string format
 * @param date - Date object or string to convert
 * @returns Full ISO string format
 */
export const toISOString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If it's already a string, convert to Date first
    return new Date(date).toISOString();
  }
  return date.toISOString();
};