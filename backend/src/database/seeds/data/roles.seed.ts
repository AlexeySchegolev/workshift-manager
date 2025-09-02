
export const rolesSeedData = [
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    name: 'Schichtleiter',
    hourlyRate: 32.00,
    overtimeRate: 40.00,
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: true,
    maxConsecutiveDays: 5,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    isActive: true
  },
  {
    organizationId: '1',
    name: 'Krankenpfleger',
    hourlyRate: 28.50,
    overtimeRate: 35.60,
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: true,
    maxConsecutiveDays: 5,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    isActive: true
  },
  {
    organizationId: '1',
    name: 'Pflegerassistent',
    hourlyRate: 18.50,
    overtimeRate: 23.10,
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: false,
    maxConsecutiveDays: 6,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    isActive: true
  }
];