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
    absenceType: AbsenceType.OTHER,
    daysCount: 3,
    hoursCount: 22.5 // 3 Tage à 7.5 Stunden (Teilzeit)
  },
  {
    employeeId: '4', // Stefan Bauer
    startDate: new Date('2025-09-25'),
    endDate: new Date('2025-09-27'),
    absenceType: AbsenceType.VACATION,
    daysCount: 3,
    hoursCount: 24
  },
  {
    employeeId: '5', // Julia Richter
    startDate: new Date('2025-09-30'),
    endDate: new Date('2025-09-30'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 1,
    hoursCount: 5 // Teilzeit 5 Stunden pro Tag
  },

  // Oktober 2025 - Nächster Monat
  {
    employeeId: '6', // Dr. Michael Klein
    startDate: new Date('2025-10-03'),
    endDate: new Date('2025-10-04'),
    absenceType: AbsenceType.OTHER,
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
    absenceType: AbsenceType.VACATION,
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
    absenceType: AbsenceType.OTHER,
    daysCount: 3,
    hoursCount: 24
  },
  {
    employeeId: '2', // Thomas König - zweiter Eintrag
    startDate: new Date('2025-10-22'),
    endDate: new Date('2025-10-24'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 3,
    hoursCount: 24
  },

  // Längere Abwesenheiten - eine Woche
  {
    employeeId: '11', // Petra Müller - Urlaubswoche
    startDate: new Date('2025-09-09'),
    endDate: new Date('2025-09-13'),
    absenceType: AbsenceType.VACATION,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '12', // Frank Weber - Krankheitswoche
    startDate: new Date('2025-09-16'),
    endDate: new Date('2025-09-20'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '13', // Sabine Fischer - Urlaubswoche
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-10-04'),
    absenceType: AbsenceType.VACATION,
    daysCount: 4,
    hoursCount: 30.4 // Teilzeit 7.6h/Tag
  },
  {
    employeeId: '14', // Martin Schulz - Fortbildungswoche
    startDate: new Date('2025-10-07'),
    endDate: new Date('2025-10-11'),
    absenceType: AbsenceType.OTHER,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '15', // Nicole Hartmann - Urlaubswoche
    startDate: new Date('2025-10-14'),
    endDate: new Date('2025-10-18'),
    absenceType: AbsenceType.VACATION,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '16', // Daniel Krause - Krankheitswoche
    startDate: new Date('2025-09-23'),
    endDate: new Date('2025-09-27'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '17', // Claudia Neumann - Urlaubswoche
    startDate: new Date('2025-10-21'),
    endDate: new Date('2025-10-25'),
    absenceType: AbsenceType.VACATION,
    daysCount: 5,
    hoursCount: 38 // Teilzeit 7.6h/Tag
  },
  {
    employeeId: '18', // Markus Lange - Krankheit
    startDate: new Date('2025-09-02'),
    endDate: new Date('2025-09-06'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 5,
    hoursCount: 32.5 // Teilzeit 6.5h/Tag
  },
  {
    employeeId: '19', // Birgit Schmitt - Urlaubswoche
    startDate: new Date('2025-10-28'),
    endDate: new Date('2025-11-01'),
    absenceType: AbsenceType.VACATION,
    daysCount: 5,
    hoursCount: 40
  },
  {
    employeeId: '20', // Jürgen Berger - Fortbildung
    startDate: new Date('2025-09-30'),
    endDate: new Date('2025-10-04'),
    absenceType: AbsenceType.OTHER,
    daysCount: 5,
    hoursCount: 40
  },

  // Zusätzliche kürzere Abwesenheiten für neue Mitarbeiter
  {
    employeeId: '21', // Karin Huber
    startDate: new Date('2025-09-11'),
    endDate: new Date('2025-09-12'),
    absenceType: AbsenceType.SICK_LEAVE,
    daysCount: 2,
    hoursCount: 13 // Teilzeit 6.5h/Tag
  },
  {
    employeeId: '22', // Ralf Mayer
    startDate: new Date('2025-10-09'),
    endDate: new Date('2025-10-10'),
    absenceType: AbsenceType.VACATION,
    daysCount: 2,
    hoursCount: 10.8 // Teilzeit 5.4h/Tag
  },
  {
    employeeId: '23', // Anja Winkler
    startDate: new Date('2025-09-19'),
    endDate: new Date('2025-09-19'),
    absenceType: AbsenceType.OTHER,
    daysCount: 1,
    hoursCount: 4.35 // Teilzeit 4.35h/Tag
  },
  {
    employeeId: '24', // Holger Roth
    startDate: new Date('2025-10-16'),
    endDate: new Date('2025-10-17'),
    absenceType: AbsenceType.VACATION,
    daysCount: 2,
    hoursCount: 13 // Teilzeit 6.5h/Tag
  }
];