import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Dashboard-Komponenten
import {
  StatistikCard,
  WochenUebersicht,
  SchnellAktionen,
  StatusAmpel,
  createDefaultSchnellAktionen,
} from '../components/dashboard';

// Hooks und Services
import { useDashboardData, useDashboardActions } from '../hooks/useDashboardData';
import { employeeService } from '../services';
import { EmployeeResponseDto } from '../api/data-contracts';

/**
 * Professionelle Dashboard-Startseite
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dashboardActions = useDashboardActions();

  // State für aktuelle Daten
  const [selectedDate] = useState<Date>(new Date());
  const [currentShiftPlan] = useState(null); // TODO: Aktuellen Schichtplan laden
  const [constraints] = useState([]); // TODO: Aktuelle Constraints laden
  
  // Mitarbeiterliste über API laden
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Mitarbeiter beim Laden der Komponente abrufen
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const employees = await employeeService.getAllEmployees();
        setEmployees(employees);
      } catch (error) {
        console.error('Fehler beim Laden der Mitarbeiter:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  // Dashboard-Daten laden
  const { statistiken, aktuelleWoche, statusItems, isLoading } = useDashboardData(
    employees, // Jetzt werden die geladenen Mitarbeiter übergeben
    currentShiftPlan,
    constraints,
    selectedDate
  );

  // Schnellaktionen definieren
  const schnellAktionen = createDefaultSchnellAktionen(
    () => navigate('/schichtplanung'),
    () => navigate('/mitarbeiter'),
    dashboardActions.exportCurrentPlan,
    dashboardActions.openSettings,
    dashboardActions.viewReports,
    !!currentShiftPlan,
    statistiken.aktuelleWarnungen
  );

  // Animationsdelay für Cards
  const [showCards, setShowCards] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
              Dashboard
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 600 }}
            >
              Willkommen zurück! Hier ist Ihre Übersicht für{' '}
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
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
                  {statistiken.mitarbeiterAnzahl} Mitarbeiter aktiv
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
            value={statistiken.mitarbeiterAnzahl}
            subtitle="Aktive Mitarbeiter"
            icon={<PeopleIcon />}
            color="primary"
            onClick={() => navigate('/mitarbeiter')}
            trend={{
              value: 5,
              isPositive: true,
              label: 'vs. letzter Monat',
            }}
          />
          <StatistikCard
            title="Schichtabdeckung"
            value={`${statistiken.schichtAbdeckung}%`}
            subtitle="Geplante Schichten"
            icon={<ScheduleIcon />}
            color={statistiken.schichtAbdeckung >= 90 ? 'success' : statistiken.schichtAbdeckung >= 70 ? 'warning' : 'error'}
            onClick={() => navigate('/schichtplanung')}
          />
          <StatistikCard
            title="Ø Auslastung"
            value={`${statistiken.durchschnittlicheAuslastung.toFixed(1)}h`}
            subtitle="Pro Mitarbeiter/Monat"
            icon={<TrendingUpIcon />}
            color={statistiken.durchschnittlicheAuslastung <= 160 ? 'success' : 'warning'}
          />
          <StatistikCard
            title="Warnungen"
            value={statistiken.aktuelleWarnungen + statistiken.regelverletzungen}
            subtitle="Aktuelle Probleme"
            icon={<WarningIcon />}
            color={statistiken.aktuelleWarnungen + statistiken.regelverletzungen === 0 ? 'success' : 'warning'}
          />
        </Box>
      </Fade>

      {/* Hauptinhalt */}
      <Fade in={showCards} timeout={1200}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '2fr 1fr',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Wochenübersicht */}
          <WochenUebersicht
            woche={aktuelleWoche}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              // TODO: Datum auswählen und zur Schichtplanung navigieren
              navigate('/schichtplanung');
            }}
            title="Aktuelle Woche"
          />

          {/* Schnellaktionen */}
          <SchnellAktionen
            aktionen={schnellAktionen}
            title="Schnellaktionen"
            maxItems={5}
          />
        </Box>
      </Fade>

      {/* Status-Übersicht */}
      <Fade in={showCards} timeout={1400}>
        <Box sx={{ mb: 4 }}>
          <StatusAmpel
            statusItems={statusItems}
            title="System-Status"
            showProgress={true}
          />
        </Box>
      </Fade>

      {/* Zusätzliche Informationen */}
      <Fade in={showCards} timeout={1600}>
        <Box sx={{ mt: 4 }}>
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
              Wichtige Hinweise
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
                <strong>Schichtplanung:</strong> Automatische Generierung berücksichtigt alle Regeln und Vorgaben
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Mitarbeiterverwaltung:</strong> Einfache Verwaltung von Rollen und Arbeitszeiten
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Excel-Export:</strong> Professionelle Schichtpläne für Druck und Weitergabe
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default HomePage;