import { Employee } from '../models/interfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mitarbeiterdaten nach Rollen sortiert für die Schichtplanung
 * Reihenfolge: Schichtleiter > Fachkraft > Hilfskraft
 */
export const employeeData: Employee[] = [
  // Schichtleiter
  { id: uuidv4(), name: "Sonja M.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { id: uuidv4(), name: "Andrea K.", role: "ShiftLeader", hoursPerWeek: 36, hoursPerMonth: 156.0, locationId: 1 },
  { id: uuidv4(), name: "Christina L.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Uta S.", role: "ShiftLeader", hoursPerWeek: 28, hoursPerMonth: 121.3, locationId: 1 },
  { id: uuidv4(), name: "Simone R.", role: "ShiftLeader", hoursPerWeek: 29, hoursPerMonth: 126.0, locationId: 1 },
  
  // Fachkräfte
  { id: uuidv4(), name: "Andrea B.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.33, locationId: 1 },
  { id: uuidv4(), name: "Sabrina H.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 152.0, locationId: 1 },
  { id: uuidv4(), name: "Kay W.", role: "Specialist", hoursPerWeek: 33, hoursPerMonth: 142.5, locationId: 2 },
  { id: uuidv4(), name: "Esther T.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Annika F.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.1, locationId: 1 },
  { id: uuidv4(), name: "Alina G.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { id: uuidv4(), name: "Britta N.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Saskia P.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Natalia V.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.3, locationId: 1 },
  { id: uuidv4(), name: "Marina D.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Sandra J.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { id: uuidv4(), name: "Susann C.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Mandy E.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { id: uuidv4(), name: "Eugenia A.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Silke B.", role: "Specialist", hoursPerWeek: 24, hoursPerMonth: 106.2, locationId: 2 },
  { id: uuidv4(), name: "Nisa O.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { id: uuidv4(), name: "Tobias M.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 123.1, locationId: 1 },
  
  // Hilfskräfte
  { id: uuidv4(), name: "Silke K.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { id: uuidv4(), name: "Karen L.", role: "Assistant", hoursPerWeek: 23, hoursPerMonth: 99.4, locationId: 1 },
  { id: uuidv4(), name: "Birgit S.", role: "Assistant", hoursPerWeek: 31, hoursPerMonth: 135.0, locationId: 1 },
  { id: uuidv4(), name: "Birgit W.", role: "Assistant", hoursPerWeek: 28, hoursPerMonth: 121.0, locationId: 1 },
  { id: uuidv4(), name: "Jessica R.", role: "Assistant", hoursPerWeek: 39, hoursPerMonth: 169.1, locationId: 1 },
  { id: uuidv4(), name: "Nurye T.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 }
];

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Rolle
 */
export const getEmployeesByRole = (role: "Specialist" | "Assistant" | "ShiftLeader"): Employee[] => {
  return employeeData.filter(employee => employee.role === role);
};

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Monatsstunden
 */
export const getEmployeesByHoursPerMonth = (hours: number): Employee[] => {
  return employeeData.filter(employee => employee.hoursPerMonth === hours);
};

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Standort
 */
export const getEmployeesByLocation = (locationId: number): Employee[] => {
  return employeeData.filter(employee => employee.locationId === locationId);
};

/**
 * Hilfsfunktion zum Sortieren der Mitarbeiter nach Rolle
 */
export const sortEmployeesByRole = (employees: Employee[]): Employee[] => {
  const rolePriority: { [key: string]: number } = {
    'ShiftLeader': 1,
    'Specialist': 2,
    'Assistant': 3
  };
  
  return [...employees].sort((a, b) => {
    return rolePriority[a.role] - rolePriority[b.role];
  });
};