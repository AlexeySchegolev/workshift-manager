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
    EventBusy as EventBusyIcon,
    People as PeopleIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import AbsenceTable from '../components/absence/AbsenceTable';
import AbsenceDialog from '../components/absence/AbsenceDialog';
import { EmployeeService } from "@/services";
import { employeeAbsenceService } from "@/services";
import {
    EmployeeResponseDto,
    EmployeeAbsenceResponseDto,
    CreateEmployeeAbsenceDto,
} from "@/api/data-contracts.ts";

/**
 * Abwesenheiten-Seite im Dashboard-Stil
 */
const AbsencesPage: React.FC = () => {
    const theme = useTheme();

    // Ausgewähltes Datum
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Mitarbeiterliste - über API laden
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Abwesenheiten
    const [absences, setAbsences] = useState<EmployeeAbsenceResponseDto[]>([]);

    // Loading-Status
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Dialog-Status
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    // Animation-Kontrolle
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Mitarbeiter laden beim Komponenten-Start
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await new EmployeeService().getAllEmployees();
                setEmployees(employees);
            } catch (error) {
                console.error('Fehler beim Laden der Mitarbeiter:', error);
            }
        };

        loadEmployees();
    }, []);

    // Abwesenheiten für den ausgewählten Monat laden
    useEffect(() => {
        const loadAbsences = async () => {
            setIsLoading(true);
            try {
                const year = selectedDate.getFullYear().toString();
                const month = (selectedDate.getMonth() + 1).toString();
                const absences = await employeeAbsenceService.getAbsencesByMonth(year, month);
                setAbsences(absences);
            } catch (error) {
                console.error('Fehler beim Laden der Abwesenheiten:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAbsences();
    }, [selectedDate]);

    // Statistiken berechnen
    const calculateStatistics = () => {
        const totalEmployees = employees.length;
        const currentMonthAbsences = absences.length;
        
        // Aktive Abwesenheiten (heute)
        const today = new Date();
        const activeAbsences = absences.filter(absence => {
            const startDate = new Date(absence.startDate);
            const endDate = new Date(absence.endDate);
            return today >= startDate && today <= endDate;
        }).length;

        // Betroffene Mitarbeiter
        const affectedEmployees = new Set(absences.map(absence => absence.employeeId)).size;

        return {
            totalEmployees,
            currentMonthAbsences,
            activeAbsences,
            affectedEmployees,
        };
    };

    const stats = calculateStatistics();

    // Neue Abwesenheit hinzufügen
    const handleAddAbsence = () => {
        setDialogOpen(true);
    };

    // Dialog schließen
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Neue Abwesenheit speichern
    const handleSaveAbsence = async (absenceData: CreateEmployeeAbsenceDto) => {
        try {
            await employeeAbsenceService.createAbsence(absenceData);
            
            // Abwesenheiten neu laden
            const year = selectedDate.getFullYear().toString();
            const month = (selectedDate.getMonth() + 1).toString();
            const updatedAbsences = await employeeAbsenceService.getAbsencesByMonth(year, month);
            setAbsences(updatedAbsences);
        } catch (error) {
            console.error('Fehler beim Erstellen der Abwesenheit:', error);
            throw error; // Re-throw to let the dialog handle error display
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Hero-Sektion */}
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
                            Abwesenheiten
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 2, maxWidth: 600 }}
                        >
                            Verwalten Sie Mitarbeiterabwesenheiten für{' '}
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
                                    {stats.totalEmployees} Mitarbeiter
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventBusyIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {stats.activeAbsences} aktive Abwesenheiten
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Abwesenheiten-Tabelle - volle Breite */}
            <Box sx={{ opacity: showCards ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <AbsenceTable
                        employees={employees}
                        absences={absences}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onAddAbsence={handleAddAbsence}
                        isLoading={isLoading}
                    />
                </Paper>
            </Box>

            {/* Abwesenheit hinzufügen Dialog */}
            <AbsenceDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSaveAbsence}
                employees={employees}
            />
        </Container>
    );
};

export default AbsencesPage;