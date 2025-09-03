import { useMemo } from 'react';
import { startOfWeek, addDays } from 'date-fns';
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

// Dashboard statistics interface using data-contracts concepts
interface DashboardStatistics {
  employeeCount: number;
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
  selectedDate: Date = new Date()
): DashboardData => {
  // Calculate statistics
  const statistics = useMemo((): DashboardStatistics => {
    const employeeCount = employees.length;

    return {
      employeeCount
    };
  }, [employees]);

  // Generate current week
  const currentWeek = useMemo((): WeekDay[] => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday as week start
    const weekDays: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);

      // Extract shifts for this day from current plan
      const shifts: { [shiftName: string]: number } = {};

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      weekDays.push({
        datum: date,
        schichten: shifts,
        istWochenende: isWeekend,
        istFeiertag: false, // Holiday detection will be implemented when holiday management system is added
      });
    }

    return weekDays;
  }, [selectedDate]);

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

    return items;
  }, [statistics]);

  return {
    statistics,
    currentWeek,
    statusItems,
  };
};