import { OperatingHours } from '../../entities/location.entity';

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
    name: 'Kardiologie Station 3A',
    address: 'Universitätsklinikum, Gebäude A3',
    city: 'München',
    postalCode: '80336',
    phone: '+49 89 4400-3301',
    email: 'kardiologie.3a@klinikum-muenchen.de',
    manager: 'Dr. Schmidt',
    capacity: 24,
    operatingHours: fullTimeOperatingHours,
    services: ['Herzkatheterlabor', 'EKG-Diagnostik', 'Echokardiographie', 'Herzschrittmacher'],
    equipment: ['Defibrillator', 'EKG-Gerät', 'Ultraschall', 'Monitoring-System']
  },
  {
    name: 'Intensivstation ICU-1',
    address: 'Universitätsklinikum, Gebäude B2',
    city: 'München',
    postalCode: '80336',
    phone: '+49 89 4400-2201',
    email: 'icu1@klinikum-muenchen.de',
    manager: 'Prof. Dr. Weber',
    capacity: 16,
    operatingHours: fullTimeOperatingHours,
    services: ['Intensivpflege', 'Beatmungstherapie', 'Dialyse', '24h-Monitoring'],
    equipment: ['Beatmungsgerät', 'Dialyse-Maschine', 'Defibrillator', 'Infusionspumpen']
  },
  {
    name: 'Chirurgie Ambulanz',
    address: 'Medizinisches Zentrum, Erdgeschoss',
    city: 'München',
    postalCode: '80337',
    phone: '+49 89 4400-4101',
    email: 'chirurgie.ambulanz@klinikum-muenchen.de',
    manager: 'Dr. Müller',
    capacity: 12,
    operatingHours: standardOperatingHours,
    services: ['Ambulante OPs', 'Wundversorgung', 'Nachsorge', 'Beratung'],
    equipment: ['OP-Tisch', 'Chirurgie-Instrumente', 'Röntgengerät', 'Sterilisation']
  },
  {
    name: 'Notaufnahme',
    address: 'Universitätsklinikum, Erdgeschoss Haupteingang',
    city: 'München',
    postalCode: '80336',
    phone: '+49 89 4400-1100',
    email: 'notaufnahme@klinikum-muenchen.de',
    manager: 'Dr. Fischer',
    capacity: 20,
    operatingHours: fullTimeOperatingHours,
    services: ['Notfallversorgung', 'Trauma-Behandlung', 'Triage', 'Erstversorgung'],
    equipment: ['Notfall-Equipment', 'Röntgen', 'CT', 'Defibrillator', 'Beatmungsgerät']
  }
];