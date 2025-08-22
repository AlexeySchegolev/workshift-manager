import { Location } from '../models/interfaces';

/**
 * Beispieldaten für Standorte
 */
export const locationData: Location[] = [
  {
    id: 'elmshorn',
    name: 'Dialysepraxis Elmshorn',
    address: 'Musterstraße 123',
    city: 'Elmshorn',
    postalCode: '25335',
    phone: '+49 4121 123456',
    email: 'elmshorn@dialysepraxis.de',
    manager: 'Dr. Schmidt',
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
    specialties: ['Hämodialyse', 'Hämofiltration', 'Hämodiafiltration'],
    equipment: [
      'Fresenius 5008S',
      'B. Braun Dialog+',
      'Wasseraufbereitungsanlage',
      'Notfallausrüstung'
    ],
    isActive: true
  },
  {
    id: 'uetersen',
    name: 'Dialysepraxis Uetersen',
    address: 'Bahnhofstraße 45',
    city: 'Uetersen',
    postalCode: '25436',
    phone: '+49 4122 987654',
    email: 'uetersen@dialysepraxis.de',
    manager: 'Dr. Müller',
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
    specialties: ['Hämodialyse', 'Peritonealdialyse'],
    equipment: [
      'Fresenius 4008S',
      'Gambro AK 200',
      'Wasseraufbereitungsanlage',
      'Notfallausrüstung'
    ],
    isActive: true
  }
];

/**
 * Beispiel-Statistiken für Standorte
 */
export const locationStatsData = {
  elmshorn: {
    totalPatients: 85,
    averageUtilization: 92,
    employeeCount: 12,
    monthlyRevenue: 125000,
    patientSatisfaction: 4.7
  },
  uetersen: {
    totalPatients: 58,
    averageUtilization: 87,
    employeeCount: 8,
    monthlyRevenue: 89000,
    patientSatisfaction: 4.5
  }
};