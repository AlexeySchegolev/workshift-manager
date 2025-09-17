
export const shiftsSeedData = [
  // Frühschicht Station A
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    locationId: '1', // Dialyse Station A
    name: 'Frühschicht Station A',
    shortName: 'FSA',
    description: 'Morgendliche Dialyse-Behandlungen und Patientenbetreuung',
    startTime: '06:00',
    endTime: '14:00',
    isActive: true
  },
  
  // Spätschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Spätschicht Station A',
    shortName: 'SSA',
    description: 'Nachmittägliche und abendliche Dialyse-Behandlungen',
    startTime: '14:00',
    endTime: '22:00',
    isActive: true
  },

  // Nachtschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Nachtschicht Station A',
    shortName: 'NSA',
    description: 'Nächtliche Überwachung und Notfall-Dialyse',
    startTime: '22:00',
    endTime: '06:00',
    isActive: true
  },

  // Frühschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Frühschicht Station B',
    shortName: 'FSB',
    description: 'Morgendliche Dialyse-Behandlungen Station B',
    startTime: '07:00',
    endTime: '15:00',
    isActive: true
  },

  // Spätschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Spätschicht Station B',
    shortName: 'SSB',
    description: 'Nachmittägliche Dialyse-Behandlungen Station B',
    startTime: '15:00',
    endTime: '23:00',
    isActive: true
  },

  // Nachtschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Nachtschicht Station B',
    shortName: 'NSB',
    description: 'Nächtliche Überwachung und Notfall-Dialyse Station B',
    startTime: '23:00',
    endTime: '07:00',
    isActive: true
  }
];