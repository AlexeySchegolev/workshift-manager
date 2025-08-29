import React, {useState, useEffect} from 'react';
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
import EmployeeManagement from '../components/EmployeeManagement';
import {EmployeeService} from "@/services";
import {EmployeeResponseDto} from "@/api/data-contracts.ts";
import QuickActions from "@/components/dashboard/QuickActions.tsx";
import StatusLight from "@/components/dashboard/StatusLight.tsx";
import StatisticsCard from "@/components/dashboard/StatisticsCard.tsx";

/**
 * Modern Employee Management Page in Dashboard Style
 */
const EmployeePage: React.FC = () => {
    const theme = useTheme();

    // Load employee list via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when component loads
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await new EmployeeService().getAllEmployees();
                setEmployees(employees);
            } catch (error) {
            }
        };

        loadEmployees();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update employees (but don't save to localStorage)
    const handleEmployeesChange = (updatedEmployees: EmployeeResponseDto[]) => {
        setEmployees(updatedEmployees);
    };

    // Calculate statistics
    const calculateStatistics = () => {
        const totalEmployees = employees.length;
        const locationA = employees.filter(emp => emp.locationId !== "2").length;
        const locationB = employees.filter(emp => emp.locationId === "2").length;
        const shiftLeaders = employees.filter(emp => emp.primaryRoleId === "1").length;
        const specialists = employees.filter(emp => emp.primaryRoleId === "2").length;
        const assistants = employees.filter(emp => emp.primaryRoleId === "3").length;

        const totalHours = employees.reduce((sum, emp) => sum + (emp.hoursPerMonth || 0), 0);
        const avgHours = totalEmployees > 0 ? Math.ceil((totalHours / totalEmployees) * 10) / 10 : 0;

        // Calculate warnings
        let warnings = 0;
        if (shiftLeaders < 2) warnings++; // Too few shift leaders
        if (totalEmployees < 5) warnings++; // Too few employees overall
        if (avgHours > 160) warnings++; // Too high average working time

        return {
            totalEmployees,
            locationA,
            locationB,
            shiftLeaders,
            specialists,
            assistants,
            avgHours,
            totalHours,
            warnings,
        };
    };

    const stats = calculateStatistics();

    // Define quick actions
    const quickActions = [
        {
            id: 'add-employee',
            title: 'Mitarbeiter hinzufügen',
            description: 'Neuen Mitarbeiter zur Datenbank hinzufügen',
            icon: <PersonAddIcon/>,
            color: 'success' as const,
            onClick: () => {
                // Scroll to form
                const formElement = document.querySelector('[data-testid="employee-form"]');
                if (formElement) {
                    formElement.scrollIntoView({behavior: 'smooth'});
                }
            },
        },
        {
            id: 'export-list',
            title: 'Mitarbeiterliste exportieren',
            description: 'Aktuelle Mitarbeiterliste als Excel-Datei herunterladen',
            icon: <AssessmentIcon/>,
            color: 'info' as const,
            onClick: () => {
                // TODO: Implement Excel export
                console.log('Excel-Export für Mitarbeiterliste');
            },
        },
        {
            id: 'manage-roles',
            title: 'Rollen verwalten',
            description: 'Mitarbeiterrollen und Berechtigungen anpassen',
            icon: <BusinessIcon/>,
            color: 'warning' as const,
            onClick: () => {
                // TODO: Implement role management
                console.log('Rollenverwaltung öffnen');
            },
        },
        {
            id: 'working-hours',
            title: 'Arbeitszeiten analysieren',
            description: 'Übersicht über Arbeitszeiten und Auslastung',
            icon: <ScheduleIcon/>,
            color: 'primary' as const,
            onClick: () => {
                // TODO: Implement working time analysis
                console.log('Arbeitszeitanalyse öffnen');
            },
        },
    ];

    // Status items for the status light
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
            status: stats.shiftLeaders >= 3 ? 'success' : stats.shiftLeaders >= 2 ? 'warning' : 'error',
            value: stats.shiftLeaders,
            maxValue: 5,
            details: stats.shiftLeaders < 3 ? ['Mindestens 3 Schichtleiter für kontinuierliche Abdeckung empfohlen'] : undefined,
        } as const,
        {
            id: 'location-distribution',
            title: 'Standortverteilung',
            description: 'Verteilung der Mitarbeiter auf beide Standorte',
            status: stats.locationB >= 2 && stats.locationA >= 3 ? 'success' : 'warning',
            value: Math.min(stats.locationA, stats.locationB),
            maxValue: Math.max(stats.locationA, stats.locationB),
            details: stats.locationB < 2 ? ['Zu wenige Mitarbeiter für Standort B'] : undefined,
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
        <Container maxWidth={false} sx={{py: 3, px: {xs: 2, sm: 3, md: 4}, maxWidth: '100%'}}>
            {/* Hero section */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 3, md: 4},
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
                    <Box sx={{position: 'relative', zIndex: 1}}>
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
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie Ihr Team und optimieren Sie die Personalplanung für beide Standorte
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <PeopleIcon sx={{color: 'success.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.totalEmployees} Mitarbeiter registriert
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <BusinessIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.locationA} Standort A • {stats.locationB} Standort B
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <ScheduleIcon sx={{color: 'warning.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Ø {stats.avgHours.toFixed(1)}h pro Monat
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Employee management - full width */}
            <Fade in={showCards} timeout={1400}>
                <Box>
                    <EmployeeManagement
                        employees={employees}
                        onEmployeesChange={handleEmployeesChange}
                    />
                </Box>
            </Fade>
        </Container>
    );
};

export default EmployeePage;