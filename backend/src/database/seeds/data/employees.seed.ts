import { EmployeeRole } from '../../entities/employee.entity';

export const employeesSeedData = [
  // Kardiologie Station 3A (locationId: 1)
  { name: 'Anna Schneider', role: EmployeeRole.SHIFT_LEADER, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 1 },
  { name: 'Thomas König', role: EmployeeRole.SPECIALIST, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 1 },
  { name: 'Maria Wagner', role: EmployeeRole.SPECIALIST, hoursPerMonth: 120, hoursPerWeek: 30, locationId: 1 },
  { name: 'Stefan Bauer', role: EmployeeRole.ASSISTANT, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 1 },
  { name: 'Julia Richter', role: EmployeeRole.ASSISTANT, hoursPerMonth: 80, hoursPerWeek: 20, locationId: 1 },

  // Intensivstation ICU-1 (locationId: 2)
  { name: 'Dr. Michael Klein', role: EmployeeRole.SHIFT_LEADER, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 2 },
  { name: 'Sandra Hoffmann', role: EmployeeRole.SPECIALIST, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 2 },
  { name: 'Robert Zimmermann', role: EmployeeRole.SPECIALIST, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 2 },
  { name: 'Christina Braun', role: EmployeeRole.ASSISTANT, hoursPerMonth: 140, hoursPerWeek: 35, locationId: 2 },
  { name: 'Andreas Wolf', role: EmployeeRole.ASSISTANT, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 2 },

  // Chirurgie Ambulanz (locationId: 3)
  { name: 'Dr. Elisabeth Meyer', role: EmployeeRole.SHIFT_LEADER, hoursPerMonth: 140, hoursPerWeek: 35, locationId: 3 },
  { name: 'Markus Schulze', role: EmployeeRole.SPECIALIST, hoursPerMonth: 120, hoursPerWeek: 30, locationId: 3 },
  { name: 'Petra Neumann', role: EmployeeRole.ASSISTANT, hoursPerMonth: 100, hoursPerWeek: 25, locationId: 3 },
  { name: 'Daniel Krause', role: EmployeeRole.ASSISTANT, hoursPerMonth: 80, hoursPerWeek: 20, locationId: 3 },

  // Notaufnahme (locationId: 4)
  { name: 'Dr. Frank Lehmann', role: EmployeeRole.SHIFT_LEADER, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 4 },
  { name: 'Sabine Schmitz', role: EmployeeRole.SPECIALIST, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 4 },
  { name: 'Oliver Koch', role: EmployeeRole.SPECIALIST, hoursPerMonth: 140, hoursPerWeek: 35, locationId: 4 },
  { name: 'Jennifer Werner', role: EmployeeRole.ASSISTANT, hoursPerMonth: 120, hoursPerWeek: 30, locationId: 4 },
  { name: 'Lars Möller', role: EmployeeRole.ASSISTANT, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 4 },
  { name: 'Nicole Berg', role: EmployeeRole.ASSISTANT, hoursPerMonth: 100, hoursPerWeek: 25, locationId: 4 },

  // Additional staff for better coverage
  { name: 'Gabriele Hartmann', role: EmployeeRole.SPECIALIST, hoursPerMonth: 120, hoursPerWeek: 30, locationId: 1 },
  { name: 'Uwe Schäfer', role: EmployeeRole.ASSISTANT, hoursPerMonth: 140, hoursPerWeek: 35, locationId: 2 },
  { name: 'Silke Kramer', role: EmployeeRole.ASSISTANT, hoursPerMonth: 160, hoursPerWeek: 40, locationId: 3 },
  { name: 'Jürgen Lange', role: EmployeeRole.SPECIALIST, hoursPerMonth: 140, hoursPerWeek: 35, locationId: 4 },
  { name: 'Monika Herrmann', role: EmployeeRole.ASSISTANT, hoursPerMonth: 100, hoursPerWeek: 25, locationId: 1 }
];