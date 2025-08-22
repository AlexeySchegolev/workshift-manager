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
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Dashboard-Komponenten
import {
  StatistikCard,
  SchnellAktionen,
  StatusAmpel,
} from '../components/dashboard';

// Komponenten
import EmployeeManagement from '../components/EmployeeManagement';

// Interfaces
import { Employee } from '../models/interfaces';
import { employeeData } from '../data/employeeData';

/**
 * Moderne Mitarbeiterverwaltungs-Seite im Dashboard-Style
 */
const EmployeePage: React.FC = () => {
  const theme = useTheme();

  // Mitarbeiterliste immer direkt aus der Datei laden, nicht aus localStorage
  const [employees, setEmployees] = useState<Employee[]>(employeeData);

  // Animationssteuerung
  const [showCards, setShowCards] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mitarbeiter aktualisieren (aber nicht in localStorage speichern)
  const handleEmployeesChange = (updatedEmployees: Employee[]) => {
    setEmployees(updatedEmployees);
  };

  // Statistiken berechnen
  const calculateStatistics = () => {
    const totalEmployees = employees.length;
    const elmshorn = employees.filter(emp => emp.clinic !== 'Uetersen').length;
    const uetersen = employees.filter(emp => emp.clinic === 'Uetersen').length;
    const schichtleiter = employees.filter(emp => emp.role === 'Schichtleiter').length;
    const pfleger = employees.filter(emp => emp.role === 'Pfleger').length;
    const pflegehelfer = employees.filter(emp => emp.role === 'Pflegehelfer').length;
    
    const totalHours = employees.reduce((sum, emp) => sum + (emp.hoursPerMonth || 0), 0);
    const avgHours = totalEmployees > 0 ? Math.round(totalHours / totalEmployees) : 0;
    
    // Warnungen berechnen
    let warnings = 0;
    if (schichtleiter < 2) warnings++; // Zu wenige Schichtleiter
    if (totalEmployees < 5) warnings++; // Zu wenige Mitarbeiter insgesamt
    if (avgHours > 160) warnings++; // Zu hohe durchschnittliche Arbeitszeit

    return {
      totalEmployees,
      elmshorn,
      uetersen,
      schichtleiter,
      pfleger,
      pflegehelfer,
      avgHours,
      totalHours,
      warnings,
    };
  };

  const stats = calculateStatistics();

  // Schnellaktionen definieren
  const schnellAktionen = [
    {
      id: 'add-employee',
      title: 'Mitarbeiter hinzufügen',
      description: 'Neuen Mitarbeiter zur Datenbank hinzufügen',
      icon: <PersonAddIcon />,
      color: 'success' as const,
      onClick: () => {
        // Scroll zum Formular
        const formElement = document.querySelector('[data-testid="employee-form"]');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      id: 'export-list',
      title: 'Mitarbeiterliste exportieren',
      description: 'Aktuelle Mitarbeiterliste als Excel-Datei herunterladen',
      icon: <AssessmentIcon />,
      color: 'info' as const,
      onClick: () => {
        // TODO: Excel-Export implementieren
        console.log('Excel-Export für Mitarbeiterliste');
      },
    },
    {
      id: 'manage-roles',
      title: 'Rollen verwalten',
      description: 'Mitarbeiterrollen und Berechtigungen anpassen',
      icon: <BusinessIcon />,
      color: 'warning' as const,
      onClick: () => {
        // TODO: Rollenverwaltung implementieren
        console.log('Rollenverwaltung öffnen');
      },
    },
    {
      id: 'working-hours',
      title: 'Arbeitszeiten analysieren',
      description: 'Übersicht über Arbeitszeiten und Auslastung',
      icon: <ScheduleIcon />,
      color: 'primary' as const,
      onClick: () => {
        // TODO: Arbeitszeitanalyse implementieren
        console.log('Arbeitszeitanalyse öffnen');
      },
    },
  ];

  // Status-Items für die Ampel
  const statusItems = [
    {
      id: 'total-employees',
      title: 'Mitarbeiteranzahl',
      description: 'Gesamtanzahl der registrierten Mitarbeiter',
      status: stats.totalEmployees >= 8 ? 'success' : stats.totalEmployees >= 5 ? 'warning' : 'error',
      value: stats.totalEmployees,
      maxValue: 15,
      details: stats.totalEmployees < 8 ? ['Für optimale Schichtplanung werden mindestens 8 Mitarbeiter empfohlen'] : undefined,
    } as const,
    {
      id: 'shift-leaders',
      title: 'Schichtleiter',
      description: 'Anzahl der verfügbaren Schichtleiter',
      status: stats.schichtleiter >= 3 ? 'success' : stats.schichtleiter >= 2 ? 'warning' : 'error',
      value: stats.schichtleiter,
      maxValue: 5,
      details: stats.schichtleiter < 3 ? ['Mindestens 3 Schichtleiter für kontinuierliche Abdeckung empfohlen'] : undefined,
    } as const,
    {
      id: 'clinic-distribution',
      title: 'Praxisverteilung',
      description: 'Verteilung der Mitarbeiter auf beide Praxen',
      status: stats.uetersen >= 2 && stats.elmshorn >= 3 ? 'success' : 'warning',
      value: Math.min(stats.elmshorn, stats.uetersen),
      maxValue: Math.max(stats.elmshorn, stats.uetersen),
      details: stats.uetersen < 2 ? ['Zu wenige Mitarbeiter für Uetersen-Praxis'] : undefined,
    } as const,
    {
      id: 'working-hours',
      title: 'Arbeitszeiten',
      description: 'Durchschnittliche Monatsstunden pro Mitarbeiter',
      status: stats.avgHours <= 160 ? 'success' : stats.avgHours <= 170 ? 'warning' : 'error',
      value: stats.avgHours,
      maxValue: 180,
      details: stats.avgHours > 160 ? ['Hohe durchschnittliche Arbeitszeit - Überlastung möglich'] : undefined,
    } as const,
  ];

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
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
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
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mitarbeiterverwaltung
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 600 }}
            >
              Verwalten Sie Ihr Team und optimieren Sie die Personalplanung für beide Praxisstandorte
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {stats.totalEmployees} Mitarbeiter registriert
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  {stats.elmshorn} Elmshorn • {stats.uetersen} Uetersen
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  Ø {stats.avgHours}h pro Monat
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* KPI-Cards */}
      <Fade in={showCards} timeout={1000}>
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
            subtitle="Registrierte Mitarbeiter"
            icon={<PeopleIcon />}
            color="success"
            trend={{
              value: 12,
              isPositive: true,
              label: 'vs. letztes Quartal',
            }}
          />
          <StatistikCard
            title="Schichtleiter"
            value={stats.schichtleiter}
            subtitle="Verfügbare Schichtleiter"
            icon={<BusinessIcon />}
            color={stats.schichtleiter >= 3 ? 'success' : stats.schichtleiter >= 2 ? 'warning' : 'error'}
          />
          <StatistikCard
            title="Ø Arbeitszeit"
            value={`${stats.avgHours}h`}
            subtitle="Pro Mitarbeiter/Monat"
            icon={<TrendingUpIcon />}
            color={stats.avgHours <= 160 ? 'success' : stats.avgHours <= 170 ? 'warning' : 'error'}
          />
          <StatistikCard
            title="Gesamtstunden"
            value={`${stats.totalHours}h`}
            subtitle="Alle Mitarbeiter/Monat"
            icon={<ScheduleIcon />}
            color="info"
          />
        </Box>
      </Fade>

      {/* Seitenleiste - oberhalb der Tabelle */}
      <Fade in={showCards} timeout={1200}>
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
            title="Personalstatus"
            showProgress={true}
          />
        </Box>
      </Fade>

      {/* Mitarbeiterverwaltung - volle Breite */}
      <Fade in={showCards} timeout={1400}>
        <Paper
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            mb: 4,
          }}
          data-testid="employee-form"
        >
          <EmployeeManagement
            employees={employees}
            onEmployeesChange={handleEmployeesChange}
          />
        </Paper>
      </Fade>

      {/* Zusätzliche Informationen */}
      <Fade in={showCards} timeout={1400}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.success.main, 0.02),
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon sx={{ color: 'success.main' }} />
            Personalmanagement-Tipps
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
              <strong>Optimale Teamgröße:</strong> 8-12 Mitarbeiter für flexible Schichtplanung
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Schichtleiter-Ratio:</strong> Mindestens 3 Schichtleiter für kontinuierliche Abdeckung
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Arbeitszeit-Balance:</strong> Durchschnittlich 140-160 Stunden pro Monat anstreben
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default EmployeePage;