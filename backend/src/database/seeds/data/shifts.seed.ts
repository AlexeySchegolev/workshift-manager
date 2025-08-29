import { ShiftType, ShiftStatus, ShiftPriority } from '../../entities/shift.entity';

export const shiftsSeedData = [
  // Frühschicht Station A
  {
    organizationId: '1', // Will be replaced with actual organization ID during seeding
    locationId: '1', // Dialyse Station A
    name: 'Frühschicht Station A',
    description: 'Morgendliche Dialyse-Behandlungen und Patientenbetreuung',
    type: ShiftType.MORNING,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.NORMAL,
    shiftDate: '2024-09-02', // Monday
    startTime: '06:00',
    endTime: '14:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 3,
    maxEmployees: 5,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '1', // Schichtleiter
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 5
      },
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 2,
        minCount: 1,
        maxCount: 3,
        priority: 4
      },
      {
        roleId: '3', // Pflegeassistent
        requiredCount: 1,
        minCount: 0,
        maxCount: 2,
        priority: 2
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Dialyse-Verfahren',
      'Medikamentengabe',
      'Notfallmanagement',
      'Dokumentation'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe'
    ],
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    colorCode: '#4CAF50',
    notes: 'Hauptbehandlungszeit für chronische Dialyse-Patienten',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },
  
  // Spätschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Spätschicht Station A',
    description: 'Nachmittägliche und abendliche Dialyse-Behandlungen',
    type: ShiftType.AFTERNOON,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.NORMAL,
    shiftDate: '2024-09-02',
    startTime: '14:00',
    endTime: '22:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 4,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '1', // Schichtleiter
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 5
      },
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 1,
        minCount: 1,
        maxCount: 2,
        priority: 4
      },
      {
        roleId: '3', // Pflegeassistent
        requiredCount: 1,
        minCount: 0,
        maxCount: 2,
        priority: 2
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Dialyse-Verfahren',
      'Medikamentengabe',
      'Dokumentation'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe'
    ],
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    colorCode: '#FF9800',
    notes: 'Behandlungszeit für berufstätige Patienten',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },

  // Nachtschicht Station A
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Nachtschicht Station A',
    description: 'Nächtliche Überwachung und Notfall-Dialyse',
    type: ShiftType.NIGHT,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.HIGH,
    shiftDate: '2024-09-02',
    startTime: '22:00',
    endTime: '06:00',
    breakDuration: 60,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 3,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 2,
        minCount: 1,
        maxCount: 2,
        priority: 5
      },
      {
        roleId: '3', // Pflegeassistent
        requiredCount: 1,
        minCount: 0,
        maxCount: 1,
        priority: 3
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Notfallmanagement',
      'Dialyse-Verfahren',
      'Medikamentengabe'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe',
      'Notfallmedizin'
    ],
    isOvertime: true,
    overtimeRate: 1.25,
    isHoliday: false,
    isWeekend: false,
    weekendRate: 1.15,
    colorCode: '#3F51B5',
    notes: 'Bereitschaftsdienst für Notfälle und kritische Patienten',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },

  // Frühschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Frühschicht Station B',
    description: 'Morgendliche Dialyse-Behandlungen Station B',
    type: ShiftType.MORNING,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.NORMAL,
    shiftDate: '2024-09-02',
    startTime: '06:00',
    endTime: '14:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 4,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '1', // Schichtleiter
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 5
      },
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 1,
        minCount: 1,
        maxCount: 2,
        priority: 4
      },
      {
        roleId: '3', // Pflegeassistent
        requiredCount: 1,
        minCount: 0,
        maxCount: 1,
        priority: 2
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Dialyse-Verfahren',
      'Medikamentengabe',
      'Dokumentation'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe'
    ],
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    colorCode: '#4CAF50',
    notes: 'Kleinere Station mit fokussierter Patientenbetreuung',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },

  // Spätschicht Station B
  {
    organizationId: '1',
    locationId: '2', // Dialyse Station B
    name: 'Spätschicht Station B',
    description: 'Nachmittägliche Dialyse-Behandlungen Station B',
    type: ShiftType.AFTERNOON,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.NORMAL,
    shiftDate: '2024-09-02',
    startTime: '14:00',
    endTime: '22:00',
    breakDuration: 30,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 3,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 1,
        minCount: 1,
        maxCount: 2,
        priority: 5
      },
      {
        roleId: '3', // Pflegeassistent
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 3
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Dialyse-Verfahren',
      'Dokumentation'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe'
    ],
    isOvertime: false,
    isHoliday: false,
    isWeekend: false,
    colorCode: '#FF9800',
    notes: 'Reduzierte Kapazität am Abend',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },

  // Wochenend-Schicht Station A (Samstag)
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Wochenend-Schicht Station A',
    description: 'Wochenend-Dialyse für Notfälle und spezielle Behandlungen',
    type: ShiftType.MORNING,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.HIGH,
    shiftDate: '2024-09-07', // Saturday
    startTime: '08:00',
    endTime: '16:00',
    breakDuration: 45,
    totalHours: 8.0,
    minEmployees: 2,
    maxEmployees: 3,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '1', // Schichtleiter
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 5
      },
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 1,
        minCount: 1,
        maxCount: 2,
        priority: 4
      }
    ],
    requiredSkills: [
      'Patientenbetreuung',
      'Dialyse-Verfahren',
      'Notfallmanagement',
      'Medikamentengabe'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe',
      'Notfallmedizin'
    ],
    isOvertime: false,
    isHoliday: false,
    isWeekend: true,
    weekendRate: 1.25,
    colorCode: '#9C27B0',
    notes: 'Wochenend-Bereitschaft für Notfall-Dialyse',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  },

  // Bereitschaftsdienst (On-Call)
  {
    organizationId: '1',
    locationId: '1', // Dialyse Station A
    name: 'Bereitschaftsdienst',
    description: 'Rufbereitschaft für medizinische Notfälle',
    type: ShiftType.ON_CALL,
    status: ShiftStatus.PUBLISHED,
    priority: ShiftPriority.CRITICAL,
    shiftDate: '2024-09-08', // Sunday
    startTime: '00:00',
    endTime: '23:59',
    breakDuration: 0,
    totalHours: 24.0,
    minEmployees: 1,
    maxEmployees: 2,
    currentEmployees: 0,
    roleRequirements: [
      {
        roleId: '1', // Schichtleiter
        requiredCount: 1,
        minCount: 1,
        maxCount: 1,
        priority: 5
      },
      {
        roleId: '2', // Krankenpfleger
        requiredCount: 1,
        minCount: 0,
        maxCount: 1,
        priority: 4
      }
    ],
    requiredSkills: [
      'Notfallmanagement',
      'Dialyse-Verfahren',
      'Patientenbetreuung',
      'Medikamentengabe',
      'Teamführung'
    ],
    requiredCertifications: [
      'Krankenpflege-Ausbildung',
      'Dialyse-Zertifikat',
      'Erste Hilfe',
      'Notfallmedizin',
      'Führungsqualifikation'
    ],
    isOvertime: true,
    overtimeRate: 1.5,
    isHoliday: false,
    isWeekend: true,
    weekendRate: 1.5,
    colorCode: '#F44336',
    notes: 'Rufbereitschaft - nur bei Notfällen vor Ort',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2024-12-31',
    isActive: true
  }
];