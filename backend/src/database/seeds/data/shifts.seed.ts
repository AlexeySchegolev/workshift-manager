import { ShiftType } from '../../entities/shift.entity';

export const shiftsSeedData = [
  // Frühschicht Station A
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    locationId: '1', // Dialyse Station A
    name: 'Frühschicht Station A',
    description: 'Morgendliche Dialyse-Behandlungen und Patientenbetreuung',
    type: ShiftType.MORNING,
    startTime: '06:00',
    endTime: '14:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 3,
    maxEmployees: 5,
    currentEmployees: 0,
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    isActive: true
  },
  
  // Spätschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Spätschicht Station A',
    description: 'Nachmittägliche und abendliche Dialyse-Behandlungen',
    type: ShiftType.AFTERNOON,
    startTime: '14:00',
    endTime: '22:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 4,
    currentEmployees: 0,
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    isActive: true
  },

  // Nachtschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Nachtschicht Station A',
    description: 'Nächtliche Überwachung und Notfall-Dialyse',
    type: ShiftType.NIGHT,
    startTime: '22:00',
    endTime: '06:00',
    breakDuration: 60,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 3,
    currentEmployees: 0,
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    isActive: true
  },

  // Frühschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Frühschicht Station B',
    description: 'Morgendliche Dialyse-Behandlungen Station B',
    type: ShiftType.MORNING,
    startTime: '07:00',
    endTime: '15:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 4,
    currentEmployees: 0,
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    isActive: true
  },

  // Spätschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Spätschicht Station B',
    description: 'Nachmittägliche Dialyse-Behandlungen Station B',
    type: ShiftType.AFTERNOON,
    startTime: '15:00',
    endTime: '23:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 3,
    currentEmployees: 0,
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    isActive: true
  }
];