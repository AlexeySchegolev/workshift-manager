import { Employee } from '../models/interfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mitarbeiterdaten nach Rollen sortiert für die Schichtplanung
 * Reihenfolge: Schichtleiter > Pfleger > Pflegehelfer
 */
export const employeeData: Employee[] = [
  // Schichtleiter
  { id: uuidv4(), name: "Sr. Sonja", role: "Schichtleiter", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { id: uuidv4(), name: "Sr. Andrea 2", role: "Schichtleiter", hoursPerWeek: 36, hoursPerMonth: 156.0, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Christina", role: "Schichtleiter", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Uta", role: "Schichtleiter", hoursPerWeek: 28, hoursPerMonth: 121.3, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Simone", role: "Schichtleiter", hoursPerWeek: 29, hoursPerMonth: 126.0, clinic: "Elmshorn" },
  
  // Pfleger
  { id: uuidv4(), name: "Sr. Andrea B", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 121.33, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Sabrina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 152.0, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Kay", role: "Pfleger", hoursPerWeek: 33, hoursPerMonth: 142.5, clinic: "Uetersen" },
  { id: uuidv4(), name: "Sr. Esther", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Annika", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.1, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Alina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { id: uuidv4(), name: "Sr. Britta", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Saskia", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Natalia", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 121.3, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Marina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Sandra", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { id: uuidv4(), name: "Sr. Susann", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Mandy", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { id: uuidv4(), name: "Sr. Eugenia", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Sr. Silke B", role: "Pfleger", hoursPerWeek: 24, hoursPerMonth: 106.2, clinic: "Uetersen" },
  { id: uuidv4(), name: "Nisa", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Pfl. Tobias", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 123.1, clinic: "Elmshorn" },
  
  // Pflegehelfer
  { id: uuidv4(), name: "Silke", role: "Pflegehelfer", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { id: uuidv4(), name: "Karen", role: "Pflegehelfer", hoursPerWeek: 23, hoursPerMonth: 99.4, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Birgit", role: "Pflegehelfer", hoursPerWeek: 31, hoursPerMonth: 135.0, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Birgit 2", role: "Pflegehelfer", hoursPerWeek: 28, hoursPerMonth: 121.0, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Jessica", role: "Pflegehelfer", hoursPerWeek: 39, hoursPerMonth: 169.1, clinic: "Elmshorn" },
  { id: uuidv4(), name: "Nurye", role: "Pflegehelfer", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" }
];

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Rolle
 */
export const getEmployeesByRole = (role: "Pfleger" | "Pflegehelfer" | "Schichtleiter"): Employee[] => {
  return employeeData.filter(employee => employee.role === role);
};

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Monatsstunden
 */
export const getEmployeesByHoursPerMonth = (hours: number): Employee[] => {
  return employeeData.filter(employee => employee.hoursPerMonth === hours);
};

/**
 * Hilfsfunktion zum Filtern der Mitarbeiter nach Praxisstandort
 */
export const getEmployeesByClinic = (clinic: "Elmshorn" | "Uetersen"): Employee[] => {
  return employeeData.filter(employee => employee.clinic === clinic);
};

/**
 * Hilfsfunktion zum Sortieren der Mitarbeiter nach Rolle
 */
export const sortEmployeesByRole = (employees: Employee[]): Employee[] => {
  const rolePriority: { [key: string]: number } = {
    'Schichtleiter': 1,
    'Pfleger': 2,
    'Pflegehelfer': 3
  };
  
  return [...employees].sort((a, b) => {
    return rolePriority[a.role] - rolePriority[b.role];
  });
};