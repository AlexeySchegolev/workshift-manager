import { RoleType, RoleStatus } from '@/database/entities';

export const rolesSeedData = [
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    name: 'Schichtleiter',
    description: 'Leitung der Schicht und Koordination des Teams',
    type: RoleType.SHIFT_LEADER,
    status: RoleStatus.ACTIVE,
    hourlyRate: 32.00,
    overtimeRate: 40.00,
    minExperienceMonths: 36,
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Führungsqualifikation',
      'Erste Hilfe',
      'Hygiene-Schulung'
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Teamführung',
      'Qualitätsmanagement',
      'Notfallmanagement',
      'Personalplanung'
    ],
    permissions: [
      'patient.read',
      'patient.update',
      'nursing.perform',
      'team.manage',
      'shift.coordinate'
    ],
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: true,
    maxConsecutiveDays: 5,
    minRestHours: 11,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    priorityLevel: 4,
    colorCode: '#B8860B',
    isActive: true
  },
  {
    organizationId: '1',
    name: 'Krankenpfleger',
    description: 'Qualifizierte Krankenpflege und Patientenbetreuung',
    type: RoleType.NURSE,
    status: RoleStatus.ACTIVE,
    hourlyRate: 28.50,
    overtimeRate: 35.60,
    minExperienceMonths: 24,
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Erste Hilfe',
      'Hygiene-Schulung'
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Medikamentengabe',
      'Wundversorgung',
      'Dokumentation',
      'Notfallmanagement'
    ],
    permissions: [
      'patient.read',
      'patient.update',
      'nursing.perform',
      'medication.administer'
    ],
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: true,
    maxConsecutiveDays: 5,
    minRestHours: 11,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    priorityLevel: 3,
    colorCode: '#2E8B57',
    isActive: true
  },
  {
    organizationId: '1',
    name: 'Pflegerassistent',
    description: 'Unterstützung bei der Patientenbetreuung und pflegerischen Tätigkeiten',
    type: RoleType.ASSISTANT,
    status: RoleStatus.ACTIVE,
    hourlyRate: 18.50,
    overtimeRate: 23.10,
    minExperienceMonths: 6,
    requiredCertifications: [
      'Pflegehelfer-Ausbildung',
      'Erste Hilfe',
      'Hygiene-Schulung'
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Grundpflege',
      'Dokumentation',
      'Teamarbeit'
    ],
    permissions: [
      'patient.read',
      'nursing.assist',
      'documentation.create'
    ],
    canWorkNights: true,
    canWorkWeekends: true,
    canWorkHolidays: false,
    maxConsecutiveDays: 6,
    minRestHours: 11,
    maxWeeklyHours: 40.0,
    maxMonthlyHours: 160.0,
    priorityLevel: 2,
    colorCode: '#4682B4',
    isActive: true
  }
];