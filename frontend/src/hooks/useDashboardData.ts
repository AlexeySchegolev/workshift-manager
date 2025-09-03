import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { WeekDay } from '../components/dashboard/WeekOverview';
import {
    EmployeeResponseDto,
} from '../api/data-contracts';

// StatusItem interface for dashboard status items
export interface StatusItem {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  value: number;
  maxValue: number;
  details?: string[];
}

type Employee = EmployeeResponseDto;

// Monthly shift plan type matching ShiftPlanResponseDto.planData structure
// Structure: { "01.12.2024": { "Morning": ["employee-id-1", "employee-id-2"], "Evening": [...] } }
type MonthlyShiftPlanData = Record<string, Record<string, string[]> | null>;

// Dashboard statistics interface using data-contracts concepts
interface DashboardStatistics {
  employeeCount: number;
  shiftCoverage: number;
  currentWarnings: number;
  ruleViolations: number;
}

// Dashboard data interface
interface DashboardData {
  statistics: DashboardStatistics;
  currentWeek: WeekDay[];
  statusItems: StatusItem[];
}

/**
 * Hook for Dashboard Data
 */
export const useDashboardData = (
  employees: Employee[],
  currentShiftPlan: MonthlyShiftPlanData | null,
  selectedDate: Date = new Date()
): DashboardData => {
  // Calculate statistics
  const statistics = useMemo((): DashboardStatistics => {
    const employeeCount = employees.length;
    
    // Calculate shift coverage
    let shiftCoverage = 0;
    if (currentShiftPlan) {
      const totalDays = Object.keys(currentShiftPlan).length;
      const coveredDays = Object.values(currentShiftPlan).filter(day => day !== null).length;
      shiftCoverage = totalDays > 0 ? Math.round((coveredDays / totalDays) * 100) : 0;
    }

    // Constraint validation not available - set to 0
    const currentWarnings = 0;
    const ruleViolations = 0;

    return {
      employeeCount,
      shiftCoverage,
      currentWarnings,
      ruleViolations,
    };
  }, [employees, currentShiftPlan]);

  // Generate current week
  const currentWeek = useMemo((): WeekDay[] => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday as week start
    const weekDays: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateKey = format(date, 'dd.MM.yyyy');

      // Extract shifts for this day from current plan
      const shifts: { [shiftName: string]: number } = {};
      
      if (currentShiftPlan && currentShiftPlan[dateKey]) {
        const dayPlan = currentShiftPlan[dateKey];
        if (dayPlan) {
          Object.entries(dayPlan).forEach(([shiftName, employeeIds]) => {
            if (employeeIds && employeeIds.length > 0) {
              shifts[shiftName] = employeeIds.length;
            }
          });
        }
      }

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      weekDays.push({
        datum: date,
        schichten: shifts,
        istWochenende: isWeekend,
        istFeiertag: false, // Holiday detection will be implemented when holiday management system is added
      });
    }

    return weekDays;
  }, [selectedDate, currentShiftPlan]);

  // Generate status items
  const statusItems = useMemo((): StatusItem[] => {
    const items: StatusItem[] = [];

    // Employee status
    items.push({
      id: 'employees',
      title: 'Mitarbeiter',
      description: 'Verfügbare Mitarbeiter im System',
      status: statistics.employeeCount >= 8 ? 'success' : 
              statistics.employeeCount >= 5 ? 'warning' : 'error',
      value: statistics.employeeCount,
      maxValue: 15,
      details: statistics.employeeCount < 5 ? 
        ['Zu wenige Mitarbeiter für optimale Schichtplanung'] : undefined,
    });

    // Shift coverage status
    items.push({
      id: 'coverage',
      title: 'Schichtabdeckung',
      description: 'Prozent der geplanten Schichten im aktuellen Monat',
      status: statistics.shiftCoverage >= 95 ? 'success' : 
              statistics.shiftCoverage >= 80 ? 'warning' : 'error',
      value: statistics.shiftCoverage,
      maxValue: 100,
      details: statistics.shiftCoverage < 95 ? 
        ['Unvollständige Schichtabdeckung'] : undefined,
    });

    // Rule violations status
    if (statistics.ruleViolations > 0) {
      items.push({
        id: 'violations',
        title: 'Regelverletzungen',
        description: 'Kritische Regelverletzungen im aktuellen Plan',
        status: 'error',
        value: statistics.ruleViolations,
        maxValue: 0,
        details: [`${statistics.ruleViolations} kritische Regelverletzungen gefunden`],
      });
    }

    // Warnings status
    if (statistics.currentWarnings > 0) {
      items.push({
        id: 'warnings',
        title: 'Warnungen',
        description: 'Warnungen und Optimierungsvorschläge',
        status: 'warning',
        value: statistics.currentWarnings,
        maxValue: 0,
        details: [`${statistics.currentWarnings} Warnungen vorhanden`],
      });
    }

    return items;
  }, [statistics]);

  return {
    statistics,
    currentWeek,
    statusItems,
  };
};