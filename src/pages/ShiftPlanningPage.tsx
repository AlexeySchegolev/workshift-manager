import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

import MonthSelector from '../components/MonthSelector';
import ShiftTable from '../components/ShiftTable';
import {
  Employee,
  MonthlyShiftPlan,
  ConstraintCheck,
  EmployeeAvailability
} from '../models/interfaces';
import { ShiftPlanningService } from '../services/ShiftPlanningService';
import { employeeData } from '../data/employeeData';

/**
 * Schichtplanungs-Seite
 */
const ShiftPlanningPage: React.FC = () => {
  // Ausgewähltes Datum
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mitarbeiterliste - direkt aus der Datei laden
  const [employees] = useState<Employee[]>(employeeData);
  
  // Schichtplan
  const [shiftPlan, setShiftPlan] = useState<MonthlyShiftPlan | null>(null);
  
  // Regelverletzungen
  const [constraints, setConstraints] = useState<ConstraintCheck[]>([]);
  
  // Lade-Zustand
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hilfsfunktion für SessionStorage-Key
  const getSessionKey = (date: Date, type: string): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `schichtplan_${year}_${month}_${type}`;
  };

  // Schichtplan initialisieren
  const initializeShiftPlan = () => {
    // Neuen leeren Schichtplan erstellen
    setShiftPlan(null);
    setConstraints([]);
  };

  // Schichtplan beim Ändern des Datums initialisieren oder aus sessionStorage laden
  useEffect(() => {
    // Zuerst nach einem gespeicherten Plan im sessionStorage suchen
    const planKey = getSessionKey(selectedDate, 'plan');
    const availabilityKey = getSessionKey(selectedDate, 'availability');
    
    const storedPlan = sessionStorage.getItem(planKey);
    const storedAvailability = sessionStorage.getItem(availabilityKey);
    
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setShiftPlan(parsedPlan);
        
        // Wenn Verfügbarkeitsdaten vorhanden sind, diese auch verwenden
        let employeeAvailability: EmployeeAvailability = {};
        if (storedAvailability) {
          employeeAvailability = JSON.parse(storedAvailability);
        }
        
        // Constraints berechnen
        const newConstraints = ShiftPlanningService.checkConstraints(
          parsedPlan,
          employees,
          employeeAvailability
        );
        setConstraints(newConstraints);
      } catch (error) {
        console.error('Fehler beim Laden des Schichtplans aus dem sessionStorage:', error);
        initializeShiftPlan();
      }
    } else {
      initializeShiftPlan();
    }
    
    // Event-Listener für das Neuladen der Seite hinzufügen
    const handleBeforeUnload = () => {
      // Alle sessionStorage-Einträge für Schichtpläne löschen
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('schichtplan_')) {
          sessionStorage.removeItem(key);
        }
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Event-Listener beim Unmount entfernen
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedDate, employees]);

  // Schichtplan generieren
  const generateShiftPlan = async () => {
    if (employees.length === 0) {
      alert('Keine Mitarbeiter vorhanden. Bitte fügen Sie zuerst Mitarbeiter hinzu.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulierte Verzögerung, um die Ladeanimation anzuzeigen (kann in Produktion entfernt werden)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      // Schichtplan generieren
      const { shiftPlan: generatedPlan, employeeAvailability } =
        ShiftPlanningService.generateShiftPlan(
          employees,
          year,
          month
        );

      // Constraints prüfen
      const newConstraints = ShiftPlanningService.checkConstraints(
        generatedPlan,
        employees,
        employeeAvailability
      );

      // Status aktualisieren
      setShiftPlan(generatedPlan);
      setConstraints(newConstraints);
      
      // Im sessionStorage speichern
      const planKey = getSessionKey(selectedDate, 'plan');
      const availabilityKey = getSessionKey(selectedDate, 'availability');
      
      sessionStorage.setItem(planKey, JSON.stringify(generatedPlan));
      sessionStorage.setItem(availabilityKey, JSON.stringify(employeeAvailability));
    } catch (error) {
      console.error('Fehler beim Generieren des Schichtplans:', error);
      alert('Der Schichtplan konnte nicht generiert werden.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Schichtplanung
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Monat auswählen
        </Typography>
        <MonthSelector 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
      </Paper>
      
      <ShiftTable 
        employees={employees}
        selectedDate={selectedDate}
        shiftPlan={shiftPlan}
        constraints={constraints}
        isLoading={isLoading}
        onGeneratePlan={generateShiftPlan}
      />
    </Box>
  );
};

export default ShiftPlanningPage;