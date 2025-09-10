export const employeesSeedData = [
  // Kardiologie Station 3A (locationId: 1)
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    firstName: 'Anna',
    lastName: 'Schneider',
    email: 'anna.schneider@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-001',
    hireDate: new Date('2020-01-15'),
    locationId: '1', // Will be replaced with actual location ID
    primaryRoleId: '1', // Will be replaced with Schichtleiter role ID
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Thomas',
    lastName: 'König',
    email: 'thomas.koenig@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-002',
    hireDate: new Date('2019-03-10'),
    locationId: '1',
    primaryRoleId: '2', // Krankenpfleger
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Maria',
    lastName: 'Wagner',
    email: 'maria.wagner@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-003',
    hireDate: new Date('2021-06-01'),
    locationId: '1',
    primaryRoleId: '2', // Krankenpfleger
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Stefan',
    lastName: 'Bauer',
    email: 'stefan.bauer@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-004',
    hireDate: new Date('2022-02-15'),
    locationId: '1',
    primaryRoleId: '3', // Pflegerassistent
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Julia',
    lastName: 'Richter',
    email: 'julia.richter@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-005',
    hireDate: new Date('2023-01-10'),
    locationId: '1',
    primaryRoleId: '3', // Pflegerassistent
    isActive: true
  },

  // Intensivstation ICU-1 (locationId: 2)
  {
    organizationId: '1',
    firstName: 'Dr. Michael',
    lastName: 'Klein',
    email: 'michael.klein@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-006',
    hireDate: new Date('2018-09-01'),
    locationId: '2',
    primaryRoleId: '1', // Schichtleiter
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Sandra',
    lastName: 'Hoffmann',
    email: 'sandra.hoffmann@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-007',
    hireDate: new Date('2020-05-15'),
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Robert',
    lastName: 'Zimmermann',
    email: 'robert.zimmermann@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-008',
    hireDate: new Date('2019-11-20'),
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Christina',
    lastName: 'Braun',
    email: 'christina.braun@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-009',
    hireDate: new Date('2021-08-01'),
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Andreas',
    lastName: 'Wolf',
    email: 'andreas.wolf@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-010',
    hireDate: new Date('2022-04-10'),
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    isActive: true
  }
];