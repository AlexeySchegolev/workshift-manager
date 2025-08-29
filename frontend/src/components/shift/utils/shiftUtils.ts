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
export const formatShiftPriority = (priority: number): string => {
  const priorityMap: Record<number, string> = {
    1: 'Niedrig',
    2: 'Normal',
    3: 'Hoch',
    4: 'Kritisch',
    5: 'Notfall',
  };
  return priorityMap[priority] || 'Normal';
};

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

export const getShiftPriorityColor = (priority: number): string => {
  const colorMap: Record<number, string> = {
    1: '#4CAF50',
    2: '#2196F3',
    3: '#FF9800',
    4: '#FF5722',
    5: '#F44336',
  };
  return colorMap[priority] || '#2196F3';
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

// Staffing functions
export const getStaffingStatus = (shift: ShiftResponseDto): 'understaffed' | 'adequate' | 'overstaffed' => {
  if (shift.currentEmployees < shift.minEmployees) return 'understaffed';
  if (shift.currentEmployees > shift.maxEmployees) return 'overstaffed';
  return 'adequate';
};

export const getStaffingStatusColor = (status: 'understaffed' | 'adequate' | 'overstaffed'): string => {
  const colorMap = {
    understaffed: '#F44336',
    adequate: '#4CAF50',
    overstaffed: '#FF9800',
  };
  return colorMap[status];
};

// Date functions
export const formatShiftDate = (date: string): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const isWeekend = (date: string): boolean => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isToday = (date: string): boolean => {
  const today = new Date();
  const shiftDate = new Date(date);
  return today.toDateString() === shiftDate.toDateString();
};

// Sorting functions
export const sortShiftsByDate = (shifts: ShiftResponseDto[]): ShiftResponseDto[] => {
  return [...shifts].sort((a, b) => {
    const dateA = new Date(`${a.shiftDate}T${a.startTime}`);
    const dateB = new Date(`${b.shiftDate}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const sortShiftsByStaffing = (shifts: ShiftResponseDto[]): ShiftResponseDto[] => {
  return [...shifts].sort((a, b) => a.staffingPercentage - b.staffingPercentage);
};

// Filter functions
export const filterShiftsByLocation = (shifts: ShiftResponseDto[], locationId: string): ShiftResponseDto[] => {
  return shifts.filter(shift => shift.locationId === locationId);
};

export const filterShiftsByType = (shifts: ShiftResponseDto[], type: string): ShiftResponseDto[] => {
  return shifts.filter(shift => shift.type === type);
};

export const filterShiftsByStatus = (shifts: ShiftResponseDto[], status: string): ShiftResponseDto[] => {
  return shifts.filter(shift => shift.status === status);
};

export const filterShiftsByDateRange = (
  shifts: ShiftResponseDto[], 
  startDate: string, 
  endDate: string
): ShiftResponseDto[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return shifts.filter(shift => {
    const shiftDate = new Date(shift.shiftDate);
    return shiftDate >= start && shiftDate <= end;
  });
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