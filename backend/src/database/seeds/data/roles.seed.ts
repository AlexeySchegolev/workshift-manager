import { RoleType, RoleStatus } from '../../entities/role.entity';

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
      'Patientendaten einsehen',
      'Patientendaten bearbeiten',
      'Neue Patienten anlegen',
      'Patientendaten löschen',
      'Pflegetätigkeiten durchführen',
      'Pflegepersonal überwachen',
      'Team leiten',
      'Mitarbeiter zuteilen',
      'Schichten koordinieren',
      'Dienstpläne erstellen',
      'Schichtpläne genehmigen',
      'Berichte erstellen',
      'Qualitätskontrolle',
      'Notfälle managen',
      'Personal bewerten',
      'Budget einsehen',
      'Dienstpläne ändern'
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
      'Patientendaten einsehen',
      'Patientendaten bearbeiten',
      'Neue Patienten anlegen',
      'Pflegetätigkeiten durchführen',
      'Pflegedokumentation',
      'Medikamente verabreichen',
      'Medikamente vorbereiten',
      'Vitalzeichen messen',
      'Wundversorgung',
      'Notfallversorgung',
      'Medizingeräte bedienen',
      'Hygienemaßnahmen',
      'Angehörigengespräche',
      'Schichtübergabe',
      'Qualitätsberichte'
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
      'Patientendaten einsehen',
      'Grundpflege durchführen',
      'Pflegekräfte unterstützen',
      'Einfache Pflegetätigkeiten',
      'Dokumentation erstellen',
      'Dokumentation aktualisieren',
      'Grundlegende Vitalzeichen',
      'Hygienehilfe',
      'Mobilitätshilfe',
      'Essenshilfe',
      'Patientenkomfort',
      'Beobachtungen melden',
      'Geräte reinigen',
      'Material verwalten'
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