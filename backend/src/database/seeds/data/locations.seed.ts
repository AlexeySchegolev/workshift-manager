import { OperatingHours, LocationStatus } from '@/database/entities';

const standardOperatingHours: OperatingHours = {
  monday: [{ start: '06:00', end: '22:00' }],
  tuesday: [{ start: '06:00', end: '22:00' }],
  wednesday: [{ start: '06:00', end: '22:00' }],
  thursday: [{ start: '06:00', end: '22:00' }],
  friday: [{ start: '06:00', end: '22:00' }],
  saturday: [{ start: '08:00', end: '20:00' }],
  sunday: [{ start: '08:00', end: '18:00' }]
};

const fullTimeOperatingHours: OperatingHours = {
  monday: [{ start: '00:00', end: '23:59' }],
  tuesday: [{ start: '00:00', end: '23:59' }],
  wednesday: [{ start: '00:00', end: '23:59' }],
  thursday: [{ start: '00:00', end: '23:59' }],
  friday: [{ start: '00:00', end: '23:59' }],
  saturday: [{ start: '00:00', end: '23:59' }],
  sunday: [{ start: '00:00', end: '23:59' }]
};

export const locationsSeedData = [
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    name: 'Dialyse Station A',
    code: 'DSA',
    description: 'Hauptstation für Dialyse-Behandlungen mit 12 Plätzen',
    address: 'Universitätsklinikum, Gebäude A3',
    city: 'München',
    postalCode: '80336',
    country: 'Deutschland',
    phone: '+49 89 4400-3301',
    email: 'dialyse.a@dialyse-praxis.de',
    managerName: 'Dr. Schmidt',
    managerEmail: 'dr.schmidt@dialyse-praxis.de',
    managerPhone: '+49 89 4400-3302',
    maxCapacity: 12,
    currentCapacity: 0,
    status: LocationStatus.ACTIVE,
    operatingHours: fullTimeOperatingHours,
    services: ['Hämodialyse', 'Peritonealdialyse', 'Hämofiltration', 'Patientenberatung'],
    equipment: ['Dialyse-Maschinen', 'Wasseraufbereitung', 'Monitoring-System', 'Notfall-Equipment'],
    accessibilityFeatures: ['Rollstuhlgerecht', 'Behindertentoilette', 'Aufzug'],
    safetyFeatures: ['Notausgang', 'Brandmelder', 'Erste-Hilfe-Station'],
    isActive: true,
    timezone: 'Europe/Berlin'
  },
  {
    organizationId: '1',
    name: 'Dialyse Station B',
    code: 'DSB',
    description: 'Zusätzliche Station für Dialyse-Behandlungen mit 8 Plätzen',
    address: 'Universitätsklinikum, Gebäude B2',
    city: 'München',
    postalCode: '80336',
    country: 'Deutschland',
    phone: '+49 89 4400-2201',
    email: 'dialyse.b@dialyse-praxis.de',
    managerName: 'Prof. Dr. Weber',
    managerEmail: 'prof.weber@dialyse-praxis.de',
    managerPhone: '+49 89 4400-2202',
    maxCapacity: 8,
    currentCapacity: 0,
    status: LocationStatus.ACTIVE,
    operatingHours: fullTimeOperatingHours,
    services: ['Hämodialyse', 'Notfall-Dialyse', '24h-Monitoring'],
    equipment: ['Dialyse-Maschinen', 'Intensiv-Monitoring', 'Notfall-Equipment'],
    accessibilityFeatures: ['Rollstuhlgerecht', 'Behindertentoilette'],
    safetyFeatures: ['Notausgang', 'Brandmelder', 'Erste-Hilfe-Station', 'Defibrillator'],
    isActive: true,
    timezone: 'Europe/Berlin'
  }
];