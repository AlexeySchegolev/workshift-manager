import { Location } from '../models/interfaces';

/**
 * Beispieldaten für Standorte
 */
export const locationData: Location[] = [
  {
    id: 'standort-a',
    name: 'Standort A',
    address: 'Musterstraße 123',
    city: 'Musterstadt',
    postalCode: '12345',
    phone: '+49 123 456789',
    email: 'standort-a@unternehmen.de',
    manager: 'Max Mustermann',
    capacity: 24,
    operatingHours: {
      monday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      tuesday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      wednesday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      thursday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      friday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      saturday: [
        { start: '07:00', end: '15:00' }
      ],
      sunday: []
    },
    services: ['Service A', 'Service B', 'Service C'],
    equipment: [
      'Gerät Typ A',
      'Gerät Typ B',
      'Spezialausrüstung',
      'Notfallausrüstung'
    ],
    isActive: true
  },
  {
    id: 'standort-b',
    name: 'Standort B',
    address: 'Beispielweg 45',
    city: 'Beispielort',
    postalCode: '54321',
    phone: '+49 987 654321',
    email: 'standort-b@unternehmen.de',
    manager: 'Maria Musterfrau',
    capacity: 16,
    operatingHours: {
      monday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      tuesday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      wednesday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      thursday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      friday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      saturday: [
        { start: '08:00', end: '14:00' }
      ],
      sunday: []
    },
    services: ['Service A', 'Service D'],
    equipment: [
      'Gerät Typ C',
      'Gerät Typ D',
      'Spezialausrüstung',
      'Notfallausrüstung'
    ],
    isActive: true
  }
];

/**
 * Beispiel-Statistiken für Standorte
 */
export const locationStatsData = {
  'standort-a': {
    totalClients: 85,
    averageUtilization: 92,
    employeeCount: 12,
    monthlyRevenue: 125000,
    clientSatisfaction: 4.7
  },
  'standort-b': {
    totalClients: 58,
    averageUtilization: 87,
    employeeCount: 8,
    monthlyRevenue: 89000,
    clientSatisfaction: 4.5
  }
};