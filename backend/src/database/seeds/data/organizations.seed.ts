export const organizationsSeedData = [
  {
    name: 'Dialyse Praxis',
    legalName: 'Dialyse Praxis GmbH',
    taxId: 'DE123456789',
    registrationNumber: 'HRB 123456',
    description: 'Spezialisierte Dialyse-Praxis mit modernster Ausstattung und erfahrenem Personal',
    website: 'https://www.dialyse-praxis.de',
    primaryEmail: 'info@dialyse-praxis.de',
    primaryPhone: '+49 89 4400-0',
    headquartersAddress: 'Marchioninistraße 15',
    headquartersCity: 'München',
    headquartersPostalCode: '81377',
    headquartersCountry: 'Deutschland',
    subscriptionPlan: 'professional',
    maxEmployees: 100,
    maxLocations: 10,
    settings: {
      timezone: 'Europe/Berlin',
      language: 'de',
      currency: 'EUR',
      workingDaysPerWeek: 6,
      standardShiftLength: 8,
      overtimeThreshold: 40
    },
    features: [
      'advanced_scheduling',
      'constraint_management',
      'audit_trail',
      'reporting',
      'mobile_app'
    ],
    isActive: true
  }
];