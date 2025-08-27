import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { WochenTag } from '@/components/dashboard';
import { StatusItem } from '@/components/dashboard';
import { EmployeeResponseDto } from '../api/data-contracts';

// Temporary type definitions until DTOs are properly generated
interface DayShiftPlan {
  [shiftName: string]: string[];
}

interface MonthlyShiftPlan {
  [dateKey: string]: DayShiftPlan | null;
}

interface ConstraintCheck {
  id: string;
  status: 'warning' | 'violation' | 'success';
  message: string;
  severity?: 'low' | 'medium' | 'high';
  rule?: string;
  affectedEmployees?: string[];
}

type Employee = EmployeeResponseDto;

export interface DashboardStatistiken {
  mitarbeiterAnzahl: number;
  schichtAbdeckung: number;
  durchschnittlicheAuslastung: number;
  aktuelleWarnungen: number;
  regelverletzungen: number;
}

export interface DashboardData {
  statistiken: DashboardStatistiken;
  aktuelleWoche: WochenTag[];
  statusItems: StatusItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook für Dashboard-Daten
 */
export const useDashboardData = (
  employees: Employee[],
  currentShiftPlan: MonthlyShiftPlan | null,
  constraints: ConstraintCheck[],
  selectedDate: Date = new Date()
): DashboardData => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Statistiken berechnen
  const statistiken = useMemo((): DashboardStatistiken => {
    const mitarbeiterAnzahl = employees.length;
    
    // Schichtabdeckung berechnen
    let schichtAbdeckung = 0;
    if (currentShiftPlan) {
      const totalDays = Object.keys(currentShiftPlan).length;
      const coveredDays = Object.values(currentShiftPlan).filter(day => day !== null).length;
      schichtAbdeckung = totalDays > 0 ? Math.round((coveredDays / totalDays) * 100) : 0;
    }

    // Durchschnittliche Auslastung berechnen
    let durchschnittlicheAuslastung = 0;
    if (employees.length > 0) {
      const totalHours = employees.reduce((sum, emp) => sum + (emp.hoursPerMonth || 0), 0);
      durchschnittlicheAuslastung = Math.ceil((totalHours / employees.length) * 10) / 10;
    }

    // Warnungen und Regelverletzungen zählen
    const aktuelleWarnungen = constraints.filter(c => c.status === 'warning').length;
    const regelverletzungen = constraints.filter(c => c.status === 'violation').length;

    return {
      mitarbeiterAnzahl,
      schichtAbdeckung,
      durchschnittlicheAuslastung,
      aktuelleWarnungen,
      regelverletzungen,
    };
  }, [employees, currentShiftPlan, constraints]);

  // Aktuelle Woche generieren
  const aktuelleWoche = useMemo((): WochenTag[] => {
    const startDerWoche = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Montag als Wochenstart
    const wocheTage: WochenTag[] = [];

    for (let i = 0; i < 7; i++) {
      const datum = addDays(startDerWoche, i);
      const dateKey = format(datum, 'dd.MM.yyyy');
      
      // Schichten für diesen Tag aus dem aktuellen Plan extrahieren
      const schichten: { [schichtName: string]: number } = {};
      
      if (currentShiftPlan && currentShiftPlan[dateKey]) {
        const dayPlan = currentShiftPlan[dateKey];
        if (dayPlan) {
          Object.entries(dayPlan).forEach(([shiftName, employeeIds]) => {
            if (employeeIds && employeeIds.length > 0) {
              schichten[shiftName] = employeeIds.length;
            }
          });
        }
      }

      const istWochenende = datum.getDay() === 0 || datum.getDay() === 6;
      
      wocheTage.push({
        datum,
        schichten,
        istWochenende,
        istFeiertag: false, // TODO: Feiertage implementieren
      });
    }

    return wocheTage;
  }, [selectedDate, currentShiftPlan]);

  // Status-Items generieren
  const statusItems = useMemo((): StatusItem[] => {
    const items: StatusItem[] = [];

    // Mitarbeiter-Status
    items.push({
      id: 'employees',
      title: 'Mitarbeiter',
      description: 'Verfügbare Mitarbeiter im System',
      status: statistiken.mitarbeiterAnzahl >= 8 ? 'success' : 
              statistiken.mitarbeiterAnzahl >= 5 ? 'warning' : 'error',
      value: statistiken.mitarbeiterAnzahl,
      maxValue: 15,
      details: statistiken.mitarbeiterAnzahl < 5 ? 
        ['Zu wenige Mitarbeiter für optimale Schichtplanung'] : undefined,
    });

    // Schichtabdeckung-Status
    items.push({
      id: 'coverage',
      title: 'Schichtabdeckung',
      description: 'Prozent der geplanten Schichten im aktuellen Monat',
      status: statistiken.schichtAbdeckung >= 95 ? 'success' : 
              statistiken.schichtAbdeckung >= 80 ? 'warning' : 'error',
      value: statistiken.schichtAbdeckung,
      maxValue: 100,
      details: statistiken.schichtAbdeckung < 95 ? 
        ['Unvollständige Schichtabdeckung'] : undefined,
    });

    // Regelverletzungen-Status
    if (statistiken.regelverletzungen > 0) {
      items.push({
        id: 'violations',
        title: 'Regelverletzungen',
        description: 'Kritische Regelverletzungen im aktuellen Plan',
        status: 'error',
        value: statistiken.regelverletzungen,
        maxValue: 0,
        details: [`${statistiken.regelverletzungen} kritische Regelverletzungen gefunden`],
      });
    }

    // Warnungen-Status
    if (statistiken.aktuelleWarnungen > 0) {
      items.push({
        id: 'warnings',
        title: 'Warnungen',
        description: 'Warnungen und Optimierungsvorschläge',
        status: 'warning',
        value: statistiken.aktuelleWarnungen,
        maxValue: 0,
        details: [`${statistiken.aktuelleWarnungen} Warnungen vorhanden`],
      });
    }

    // Auslastung-Status
    items.push({
      id: 'workload',
      title: 'Durchschnittliche Auslastung',
      description: 'Durchschnittliche Monatsstunden pro Mitarbeiter',
      status: statistiken.durchschnittlicheAuslastung <= 160 && statistiken.durchschnittlicheAuslastung >= 120 ? 'success' :
              statistiken.durchschnittlicheAuslastung <= 180 ? 'warning' : 'error',
      value: statistiken.durchschnittlicheAuslastung,
      maxValue: 160,
      details: statistiken.durchschnittlicheAuslastung > 160 ? 
        ['Überdurchschnittliche Arbeitsbelastung'] : 
        statistiken.durchschnittlicheAuslastung < 120 ? 
        ['Unterdurchschnittliche Arbeitsbelastung'] : undefined,
    });

    return items;
  }, [statistiken]);

  return {
    statistiken,
    aktuelleWoche,
    statusItems,
    isLoading,
    error,
  };
};

/**
 * Hook für Dashboard-Aktionen
 */
export const useDashboardActions = () => {
  const navigateToShiftPlanning = () => {
    window.location.href = '/schichtplanung';
  };

  const navigateToEmployees = () => {
    window.location.href = '/mitarbeiter';
  };

  const exportCurrentPlan = () => {
    // TODO: Excel-Export implementieren
    console.log('Excel-Export wird implementiert...');
  };

  const openSettings = () => {
    // TODO: Einstellungen-Dialog implementieren
    console.log('Einstellungen werden implementiert...');
  };

  const viewReports = () => {
    // TODO: Berichte-Seite implementieren
    console.log('Berichte werden implementiert...');
  };

  return {
    navigateToShiftPlanning,
    navigateToEmployees,
    exportCurrentPlan,
    openSettings,
    viewReports,
  };
};

export default useDashboardData;