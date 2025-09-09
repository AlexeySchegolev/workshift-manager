import { Theme } from '@mui/material/styles';
import { LocationResponseDto } from '@/api/data-contracts';

/**
 * Get initials from location name
 */
export const getLocationInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get location status color
 */
export const getLocationStatusColor = (isActive: boolean, theme: Theme): string => {
  return isActive ? theme.palette.success.main : theme.palette.error.main;
};

/**
 * Format location status
 */
export const formatLocationStatus = (isActive: boolean): string => {
  return isActive ? 'Aktiv' : 'Inaktiv';
};

/**
 * Format operating hours for display
 */
export const formatOperatingHours = (location: LocationResponseDto): string => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  
  const activeDays = days
    .map((day, index) => ({
      name: dayNames[index],
      slots: location.operatingHours[day] || []
    }))
    .filter(day => Array.isArray(day.slots) && day.slots.length > 0);

  if (activeDays.length === 0) {
    return 'Geschlossen';
  }

  // Show first active day's hours as summary
  const firstDay = activeDays[0];
  const hoursText = firstDay.slots.map((slot: any) => `${slot.start}-${slot.end}`).join(', ');
  
  if (activeDays.length === 1) {
    return `${firstDay.name}: ${hoursText}`;
  } else {
    return `${firstDay.name}: ${hoursText} (+${activeDays.length - 1} weitere)`;
  }
};

/**
 * Format location address for display
 */
export const formatLocationAddress = (location: LocationResponseDto): string => {
  const parts = [
    location.address,
    location.postalCode && location.city ? `${location.postalCode} ${location.city}` : location.city
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Get employee count color based on number
 */
export const getEmployeeCountColor = (count: number, theme: Theme): string => {
  if (count === 0) return theme.palette.error.main;
  if (count < 5) return theme.palette.warning.main;
  return theme.palette.success.main;
};