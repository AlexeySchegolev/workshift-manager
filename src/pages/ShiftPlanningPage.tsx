import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Fade,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Dashboard-Komponenten
import {
  StatistikCard,
  SchnellAktionen,
  StatusAmpel,
  createDefaultSchnellAktionen,
  createShiftPlanningStatusItems,
} from '../components/dashboard';

// Komponenten
import MonthSelector from '../components/MonthSelector';
import ShiftTable from '../components/ShiftTable';

// Interfaces und Services
import {
  Employee,
  MonthlyShiftPlan,
  ConstraintCheck,
  EmployeeAvailability
} from '../models/interfaces';
import { ShiftPlanningService } from '../services/ShiftPlanningService';
import { employeeData } from '../data/employeeData';

/**
 * Moderne Schichtplanungs-Seite im Dashboard-Style
 */
const ShiftPlanningPage: React.FC = () => {
  const theme = useTheme();

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

  // Animationssteuerung
  const [showCards, setShowCards] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hilfsfunktion für SessionStorage-Key
  const getSessionKey = (date: Date, type: string): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `schichtplan_${year}_${month}_${type}`;
  };

  // Schichtplan initialisieren
  const initializeShiftPlan = () => {
    setShiftPlan(null);
    setConstraints([]);
  };

  // Statistiken berechnen
  const calculateStatistics = () => {
    const totalEmployees = employees.length;
    const currentMonthDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    
    let plannedShifts = 0;
    let totalPossibleShifts = 0;
    let violations = 0;
    let warnings = 0;

    if (shiftPlan) {
      Object.values(shiftPlan).forEach(dayPlan => {
        if (dayPlan) {
          Object.values(dayPlan).forEach(shiftEmployees => {
            plannedShifts += shiftEmployees.length;
          });
        }
      });
      totalPossibleShifts = currentMonthDays * 6; // Annahme: 6 Schichten pro Tag
    }

    constraints.forEach(constraint => {
      if (constraint.status === 'violation') violations++;
      if (constraint.status === 'warning') warnings++;
    });

    const coverage = totalPossibleShifts > 0 ? Math.round((plannedShifts / totalPossibleShifts) * 100) : 0;
    const avgHoursPerEmployee = totalEmployees > 0 ? Math.round((plannedShifts * 8) / totalEmployees) : 0;

    return {
      totalEmployees,
      coverage,
      avgHoursPerEmployee,
      violations,
      warnings,
      plannedShifts,
    };
  };

  const stats = calculateStatistics();

  // Schichtplan beim Ändern des Datums initialisieren oder aus sessionStorage laden
  useEffect(() => {
    const planKey = getSessionKey(selectedDate, 'plan');
    const availabilityKey = getSessionKey(selectedDate, 'availability');
    
    const storedPlan = sessionStorage.getItem(planKey);
    const storedAvailability = sessionStorage.getItem(availabilityKey);
    
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setShiftPlan(parsedPlan);
        
        let employeeAvailability: EmployeeAvailability = {};
        if (storedAvailability) {
          employeeAvailability = JSON.parse(storedAvailability);
        }
        
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
    
    const handleBeforeUnload = () => {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('schichtplan_')) {
          sessionStorage.removeItem(key);
        }
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const { shiftPlan: generatedPlan, employeeAvailability } =
        ShiftPlanningService.generateShiftPlan(
          employees,
          year,
          month
        );

      const newConstraints = ShiftPlanningService.checkConstraints(
        generatedPlan,
        employees,
        employeeAvailability
      );

      setShiftPlan(generatedPlan);
      setConstraints(newConstraints);
      
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

  // Schnellaktionen definieren
  const schnellAktionen = createDefaultSchnellAktionen(
    generateShiftPlan,
    () => {}, // Mitarbeiter hinzufügen - wird später implementiert
    () => {}, // Excel Export - wird in ShiftTable gehandhabt
    () => {}, // Einstellungen
    () => {}, // Berichte
    !!shiftPlan,
    stats.warnings + stats.violations
  );

  // Status-Items für die Ampel
  const statusItems = createShiftPlanningStatusItems(
    stats.totalEmployees,
    stats.coverage,
    stats.violations,
    stats.warnings
  );

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
      {/* Hero-Bereich */}
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Schichtplanung
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 600 }}
            >
              Verwalten Sie Ihre Schichtpläne für{' '}
              {format(selectedDate, 'MMMM yyyy', { locale: de })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {format(selectedDate, 'MMMM yyyy', { locale: de })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {stats.totalEmployees} Mitarbeiter verfügbar
                </Typography>
              </Box>
              {shiftPlan && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {stats.plannedShifts} Schichten geplant
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Monatsauswahl */}
      <Fade in={showCards} timeout={1000}>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: 'primary.main' }} />
            Monat auswählen
          </Typography>
          <MonthSelector 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </Paper>
      </Fade>

      {/* KPI-Cards */}
      <Fade in={showCards} timeout={1200}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatistikCard
            title="Mitarbeiter"
            value={stats.totalEmployees}
            subtitle="Verfügbare Mitarbeiter"
            icon={<PeopleIcon />}
            color="primary"
          />
          <StatistikCard
            title="Schichtabdeckung"
            value={`${stats.coverage}%`}
            subtitle="Geplante Schichten"
            icon={<ScheduleIcon />}
            color={stats.coverage >= 90 ? 'success' : stats.coverage >= 70 ? 'warning' : 'error'}
          />
          <StatistikCard
            title="Ø Auslastung"
            value={`${stats.avgHoursPerEmployee}h`}
            subtitle="Pro Mitarbeiter/Monat"
            icon={<TrendingUpIcon />}
            color={stats.avgHoursPerEmployee <= 160 ? 'success' : 'warning'}
          />
          <StatistikCard
            title="Probleme"
            value={stats.violations + stats.warnings}
            subtitle="Regelverletzungen & Warnungen"
            icon={<WarningIcon />}
            color={stats.violations + stats.warnings === 0 ? 'success' : stats.violations > 0 ? 'error' : 'warning'}
          />
        </Box>
      </Fade>

      {/* Seitenleiste - oberhalb der Tabelle */}
      <Fade in={showCards} timeout={1400}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Schnellaktionen */}
          <SchnellAktionen
            aktionen={schnellAktionen}
            title="Schnellaktionen"
            maxItems={4}
          />

          {/* Status-Ampel */}
          <StatusAmpel
            statusItems={statusItems}
            title="Planungsstatus"
            showProgress={true}
          />
        </Box>
      </Fade>

      {/* Schichtplan-Tabelle - volle Breite */}
      <Fade in={showCards} timeout={1600}>
        <Paper
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <ShiftTable
            employees={employees}
            selectedDate={selectedDate}
            shiftPlan={shiftPlan}
            constraints={constraints}
            isLoading={isLoading}
            onGeneratePlan={generateShiftPlan}
          />
        </Paper>
      </Fade>

      {/* Zusätzliche Informationen */}
      <Fade in={showCards} timeout={1600}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.info.main, 0.02),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon sx={{ color: 'info.main' }} />
            Planungshinweise
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Automatische Planung:</strong> Berücksichtigt alle Regeln und Mitarbeiterverfügbarkeiten
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Regelvalidierung:</strong> Kontinuierliche Überprüfung auf Konflikte und Verletzungen
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Excel-Export:</strong> Professionelle Schichtpläne für Druck und Weitergabe
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ShiftPlanningPage;