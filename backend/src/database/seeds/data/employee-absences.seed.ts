import { AbsenceType } from "@/database/entities/employee-absence.entity";

export const employeeAbsencesSeedData = [
  // September 2025 - Aktueller Monat
  {
    employeeId: '1', // Anna Schneider - wird durch echte ID ersetzt
    startDate: new Date('2025-09-05'),
    endDate: new Date('2025-09-06'),
    absenceType: AbsenceType.VACATION,
    daysCount: 2,
    hoursCount: 16
  },
  {
    employeeId: '2', // Thomas König
    startDate: new Date('2025-09-12'),
    endDate: new Date('2025-09-13'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 2,
    hoursCount: 16
  },
  {
    employeeId: '3', // Maria Wagner
    startDate: new Date('2025-09-18'),
    endDate: new Date('2025-09-20'),
    absenceType: AbsenceType.PERSONAL_LEAVE,
    daysCount: 3,
    hoursCount: 22.5 // 3 Tage à 7.5 Stunden (Teilzeit)
  },
  {
    employeeId: '4', // Stefan Bauer
    startDate: new Date('2025-09-25'),
    endDate: new Date('2025-09-27'),
    absenceType: AbsenceType.TRAINING,
    daysCount: 3,
    hoursCount: 24
  },
  {
    employeeId: '5', // Julia Richter
    startDate: new Date('2025-09-30'),
    endDate: new Date('2025-09-30'),
    absenceType: AbsenceType.VACATION,
    daysCount: 1,
    hoursCount: 5 // Teilzeit 5 Stunden pro Tag
  },

  // Oktober 2025 - Nächster Monat
  {
    employeeId: '6', // Dr. Michael Klein
    startDate: new Date('2025-10-03'),
    endDate: new Date('2025-10-04'),
    absenceType: AbsenceType.CONFERENCE,
    daysCount: 2,
    hoursCount: 16
  },
  {
    employeeId: '7', // Sandra Hoffmann
    startDate: new Date('2025-10-07'),
    endDate: new Date('2025-10-11'),
    absenceType: AbsenceType.VACATION,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '8', // Robert Zimmermann
    startDate: new Date('2025-10-14'),
    endDate: new Date('2025-10-16'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 3,
    hoursCount: 24
  },
  {
    employeeId: '9', // Christina Braun
    startDate: new Date('2025-10-21'),
    endDate: new Date('2025-10-25'),
    absenceType: AbsenceType.MATERNITY_LEAVE,
    daysCount: 5,
    hoursCount: 35 // Teilzeit 7 Stunden pro Tag
  },
  {
    employeeId: '10', // Andreas Wolf
    startDate: new Date('2025-10-28'),
    endDate: new Date('2025-10-31'),
    absenceType: AbsenceType.VACATION,
    daysCount: 4,
    hoursCount: 32
  },
  {
    employeeId: '1', // Anna Schneider - zweiter Eintrag
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-10-17'),
    absenceType: AbsenceType.TRAINING,
    daysCount: 3,
    hoursCount: 24
  },
  {
    employeeId: '2', // Thomas König - zweiter Eintrag
    startDate: new Date('2025-10-22'),
    endDate: new Date('2025-10-24'),
    absenceType: AbsenceType.PERSONAL_LEAVE,
    daysCount: 3,
    hoursCount: 24
  }
];