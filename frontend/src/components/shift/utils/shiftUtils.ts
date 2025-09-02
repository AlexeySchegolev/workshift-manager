import { ShiftResponseDto } from '@/api/data-contracts';

// Shift Type Formatting
export const formatShiftType = (type: string): string => {
  const typeMap: Record<string, string> = {
    morning: 'Frühschicht',
    afternoon: 'Spätschicht',
    evening: 'Abendschicht',
    night: 'Nachtschicht',
    full_day: 'Ganztag',
    split: 'Geteilte Schicht',
    on_call: 'Bereitschaft',
    overtime: 'Überstunden',
  };
  return typeMap[type] || type;
};

// Shift Status Formatting
export const formatShiftStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: 'Entwurf',
    published: 'Veröffentlicht',
    active: 'Aktiv',
    completed: 'Abgeschlossen',
    cancelled: 'Abgesagt',
  };
  return statusMap[status] || status;
};

// Shift Priority Formatting
// Color functions
export const getShiftTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    morning: '#4CAF50',
    afternoon: '#FF9800',
    evening: '#FF5722',
    night: '#3F51B5',
    full_day: '#9C27B0',
    split: '#607D8B',
    on_call: '#F44336',
    overtime: '#795548',
  };
  return colorMap[type] || '#757575';
};

export const getShiftStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    draft: '#757575',
    published: '#2196F3',
    active: '#4CAF50',
    completed: '#9E9E9E',
    cancelled: '#F44336',
  };
  return colorMap[status] || '#757575';
};
// Validation functions
export const validateShiftTime = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return end > start;
};

export const calculateShiftDuration = (startTime: string, endTime: string, breakDuration: number = 0): number => {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  
  return Math.max(0, durationHours - (breakDuration / 60));
};

// Date functions
export const isWeekend = (date: string): boolean => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Statistics functions
export const calculateShiftStatistics = (shifts: ShiftResponseDto[]) => {
  const total = shifts.length;
  const active = shifts.filter(s => s.status === 'active').length;
  const published = shifts.filter(s => s.status === 'published').length;
  const fullyStaffed = shifts.filter(s => s.isFullyStaffed).length;
  const understaffed = shifts.filter(s => !s.isFullyStaffed).length;
  
  const totalStaffingPercentage = shifts.reduce((sum, shift) => sum + shift.staffingPercentage, 0);
  const averageStaffing = total > 0 ? totalStaffingPercentage / total : 0;
  
  const byType = shifts.reduce((acc, shift) => {
    acc[shift.type] = (acc[shift.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byLocation = shifts.reduce((acc, shift) => {
    const locationName = shift.location?.name || 'Unbekannt';
    acc[locationName] = (acc[locationName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    active,
    published,
    fullyStaffed,
    understaffed,
    averageStaffing: Math.round(averageStaffing * 100) / 100,
    byType,
    byLocation,
  };
};