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

/**
 * Normalize time format to ensure HH:MM format
 * @param time - Time string to normalize
 * @returns Time string in HH:MM format
 */
export const normalizeTimeFormat = (time: string): string => {
  if (!time) return time;

  // Handle PostgreSQL time format variations
  // PostgreSQL TIME can return formats like "8:00:00", "08:00:00", "8:00", "08:00"
  const timeParts = time.split(':');

  if (timeParts.length >= 2) {
    const hours = timeParts[0].padStart(2, '0');
    const minutes = timeParts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return time;
};