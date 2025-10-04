export const employeesSeedData = [
  // Station A (locationId: 1) - nur 3 Mitarbeiter, je 1 pro Rolle
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    firstName: 'Anna',
    lastName: 'Schneider',
    email: 'anna.schneider@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-001',
    hireDate: new Date('2020-01-15'),
    locationId: '1', // Will be replaced with actual location ID
    primaryRoleId: '1', // Schichtleiter
    monthlyWorkHours: 173, // Vollzeit (40h/Woche)
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
    monthlyWorkHours: 173, // Vollzeit (40h/Woche)
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
    monthlyWorkHours: 87, // Teilzeit (20h/Woche)
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
    monthlyWorkHours: 173, // Vollzeit (40h/Woche)
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
    monthlyWorkHours: 173, // Vollzeit (40h/Woche)
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
    monthlyWorkHours: 152, // Teilzeit (35h/Woche)
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
    monthlyWorkHours: 130, // Teilzeit (30h/Woche)
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
    monthlyWorkHours: 87, // Teilzeit (20h/Woche)
    isActive: true
  },

  // Keine zusätzlichen Schichtleiter für Station A
  {
    organizationId: '1',
    firstName: 'Frank',
    lastName: 'Weber',
    email: 'frank.weber@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-012',
    hireDate: new Date('2020-08-20'),
    locationId: '2',
    primaryRoleId: '1', // Schichtleiter
    monthlyWorkHours: 173,
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Martin',
    lastName: 'Schulz',
    email: 'martin.schulz@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-014',
    hireDate: new Date('2022-03-10'),
    locationId: '2',
    primaryRoleId: '1', // Schichtleiter
    monthlyWorkHours: 173,
    isActive: true
  },

  // Keine zusätzlichen Krankenpfleger für Station A
  {
    organizationId: '1',
    firstName: 'Daniel',
    lastName: 'Krause',
    email: 'daniel.krause@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-016',
    hireDate: new Date('2020-11-08'),
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    monthlyWorkHours: 173,
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Markus',
    lastName: 'Lange',
    email: 'markus.lange@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-018',
    hireDate: new Date('2021-09-15'),
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    monthlyWorkHours: 130,
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Jürgen',
    lastName: 'Berger',
    email: 'juergen.berger@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-020',
    hireDate: new Date('2021-11-25'),
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    monthlyWorkHours: 173,
    isActive: true
  },

  // Keine zusätzlichen Pflegeassistenten für Station A
  {
    organizationId: '1',
    firstName: 'Ralf',
    lastName: 'Mayer',
    email: 'ralf.mayer@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-022',
    hireDate: new Date('2021-12-10'),
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    monthlyWorkHours: 108,
    isActive: true
  },
  {
    organizationId: '1',
    firstName: 'Holger',
    lastName: 'Roth',
    email: 'holger.roth@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-024',
    hireDate: new Date('2022-09-05'),
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    monthlyWorkHours: 130,
    isActive: true
  }
];