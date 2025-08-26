import { EmployeeStatus, ContractType } from '../../entities/employee.entity';

export const employeesSeedData = [
  // Kardiologie Station 3A (locationId: 1)
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    employeeNumber: 'EMP001',
    firstName: 'Anna',
    lastName: 'Schneider',
    email: 'anna.schneider@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-001',
    hireDate: new Date('2020-01-15'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '1', // Will be replaced with actual location ID
    primaryRoleId: '1', // Will be replaced with Schichtleiter role ID
    certifications: ['Krankenpflege-Ausbildung', 'Führungsqualifikation', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Teamführung', 'Qualitätsmanagement'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP002',
    firstName: 'Thomas',
    lastName: 'König',
    email: 'thomas.koenig@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-002',
    hireDate: new Date('2019-03-10'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '1',
    primaryRoleId: '2', // Krankenpfleger
    certifications: ['Krankenpflege-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Medikamentengabe', 'Wundversorgung'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP003',
    firstName: 'Maria',
    lastName: 'Wagner',
    email: 'maria.wagner@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-003',
    hireDate: new Date('2021-06-01'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME,
    hoursPerMonth: 120,
    hoursPerWeek: 30,
    locationId: '1',
    primaryRoleId: '2', // Krankenpfleger
    certifications: ['Krankenpflege-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Dokumentation'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP004',
    firstName: 'Stefan',
    lastName: 'Bauer',
    email: 'stefan.bauer@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-004',
    hireDate: new Date('2022-02-15'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '1',
    primaryRoleId: '3', // Pflegerassistent
    certifications: ['Pflegehelfer-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Grundpflege', 'Teamarbeit'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP005',
    firstName: 'Julia',
    lastName: 'Richter',
    email: 'julia.richter@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-005',
    hireDate: new Date('2023-01-10'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME,
    hoursPerMonth: 80,
    hoursPerWeek: 20,
    locationId: '1',
    primaryRoleId: '3', // Pflegerassistent
    certifications: ['Pflegehelfer-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Dokumentation'],
    isActive: true
  },

  // Intensivstation ICU-1 (locationId: 2)
  {
    organizationId: '1',
    employeeNumber: 'EMP006',
    firstName: 'Dr. Michael',
    lastName: 'Klein',
    email: 'michael.klein@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-006',
    hireDate: new Date('2018-09-01'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '2',
    primaryRoleId: '1', // Schichtleiter
    certifications: ['Krankenpflege-Ausbildung', 'Führungsqualifikation', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Teamführung', 'Notfallmanagement'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP007',
    firstName: 'Sandra',
    lastName: 'Hoffmann',
    email: 'sandra.hoffmann@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-007',
    hireDate: new Date('2020-05-15'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    certifications: ['Krankenpflege-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Medikamentengabe'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP008',
    firstName: 'Robert',
    lastName: 'Zimmermann',
    email: 'robert.zimmermann@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-008',
    hireDate: new Date('2019-11-20'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '2',
    primaryRoleId: '2', // Krankenpfleger
    certifications: ['Krankenpflege-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Wundversorgung'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP009',
    firstName: 'Christina',
    lastName: 'Braun',
    email: 'christina.braun@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-009',
    hireDate: new Date('2021-08-01'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME,
    hoursPerMonth: 140,
    hoursPerWeek: 35,
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    certifications: ['Pflegehelfer-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Grundpflege'],
    isActive: true
  },
  {
    organizationId: '1',
    employeeNumber: 'EMP010',
    firstName: 'Andreas',
    lastName: 'Wolf',
    email: 'andreas.wolf@dialyse-praxis.de',
    phoneNumber: '+49 89 1234-010',
    hireDate: new Date('2022-04-10'),
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME,
    hoursPerMonth: 160,
    hoursPerWeek: 40,
    locationId: '2',
    primaryRoleId: '3', // Pflegerassistent
    certifications: ['Pflegehelfer-Ausbildung', 'Erste Hilfe'],
    skills: ['Patientenbetreuung', 'Teamarbeit'],
    isActive: true
  }
];