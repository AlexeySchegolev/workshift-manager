export const shiftRulesSeedData = [
  {
    minNursesPerShift: 3,
    minNurseManagersPerShift: 1,
    minHelpers: 2,
    maxSaturdaysPerMonth: 2,
    maxConsecutiveSameShifts: 3,
    weeklyHoursOverflowTolerance: 5.0,
    minRestHoursBetweenShifts: 11,
    maxConsecutiveWorkingDays: 6,
    isActive: true,
    description: 'Standard Schichtregeln für alle Stationen - Deutsche Arbeitsschutzbestimmungen'
  },
  {
    minNursesPerShift: 4,
    minNurseManagersPerShift: 1,
    minHelpers: 3,
    maxSaturdaysPerMonth: 2,
    maxConsecutiveSameShifts: 2,
    weeklyHoursOverflowTolerance: 3.0,
    minRestHoursBetweenShifts: 12,
    maxConsecutiveWorkingDays: 5,
    isActive: true,
    description: 'Verstärkte Regeln für Intensivstationen - Höhere Personalanforderungen'
  },
  {
    minNursesPerShift: 2,
    minNurseManagersPerShift: 1,
    minHelpers: 1,
    maxSaturdaysPerMonth: 3,
    maxConsecutiveSameShifts: 4,
    weeklyHoursOverflowTolerance: 8.0,
    minRestHoursBetweenShifts: 11,
    maxConsecutiveWorkingDays: 7,
    isActive: true,
    description: 'Flexiblere Regeln für Ambulanzen - Angepasst an geringere Patientenzahlen'
  }
];