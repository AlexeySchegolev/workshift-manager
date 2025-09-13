import { ShiftType } from '../../entities/shift.entity';

export const shiftsSeedData = [
  // Frühschicht Station A
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    locationId: '1', // Dialyse Station A
    name: 'Frühschicht Station A',
    abbreviation: 'FSA',
    description: 'Morgendliche Dialyse-Behandlungen und Patientenbetreuung',
    type: ShiftType.MORNING,
    startTime: '06:00',
    endTime: '14:00',
    isActive: true
  },
  
  // Spätschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Spätschicht Station A',
    abbreviation: 'SSA',
    description: 'Nachmittägliche und abendliche Dialyse-Behandlungen',
    type: ShiftType.AFTERNOON,
    startTime: '14:00',
    endTime: '22:00',
    isActive: true
  },

  // Nachtschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Nachtschicht Station A',
    abbreviation: 'NSA',
    description: 'Nächtliche Überwachung und Notfall-Dialyse',
    type: ShiftType.NIGHT,
    startTime: '22:00',
    endTime: '06:00',
    isActive: true
  },

  // Frühschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Frühschicht Station B',
    abbreviation: 'FSB',
    description: 'Morgendliche Dialyse-Behandlungen Station B',
    type: ShiftType.MORNING,
    startTime: '07:00',
    endTime: '15:00',
    isActive: true
  },

  // Spätschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Spätschicht Station B',
    abbreviation: 'SSB',
    description: 'Nachmittägliche Dialyse-Behandlungen Station B',
    type: ShiftType.AFTERNOON,
    startTime: '15:00',
    endTime: '23:00',
    isActive: true
  }
];