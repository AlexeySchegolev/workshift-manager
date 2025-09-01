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
    Schedule as ScheduleIcon,
    People as PeopleIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import ShiftTable from '../components/ShiftTable';
import {EmployeeService} from "@/services";
import {
    ConstraintViolationDto,
    EmployeeResponseDto,
    MonthlyShiftPlanDto
} from "@/api/data-contracts.ts";

import {shiftPlanningService} from '@/services';

/**
 * Modern Shift Planning Page in Dashboard Style
 */
const ShiftPlanningPage: React.FC = () => {
    const theme = useTheme();

    // Selected date
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Employee list - load via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when component loads
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await new EmployeeService().getAllEmployees();
                setEmployees(employees);
            } catch (error) {
                console.error('Error loading employees:', error);
            }
        };

        loadEmployees();
    }, []);

    // Shift plan
    const [shiftPlan, setShiftPlan] = useState<MonthlyShiftPlanDto | null>(null);

    // Rule violations
    const [constraints, setConstraints] = useState<ConstraintViolationDto[]>([]);

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Helper function for SessionStorage key
    const getSessionKey = (date: Date, type: string): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return `schichtplan_${year}_${month}_${type}`;
    };

    // Initialize shift plan
    const initializeShiftPlan = () => {
        setShiftPlan(null);
        setConstraints([]);
    };

    // Calculate statistics
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
                    Object.values(dayPlan as Record<string, string[]>).forEach(shiftEmployees => {
                        plannedShifts += shiftEmployees.length;
                    });
                }
            });
            totalPossibleShifts = currentMonthDays * 6; // Assumption: 6 shifts per day
        }

        constraints.forEach(constraint => {
            if (constraint.type === 'hard' || constraint.type === 'soft') violations++;
            if (constraint.type === 'warning') warnings++;
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

    // Initialize shift plan when date changes or load from sessionStorage
    useEffect(() => {
        const planKey = getSessionKey(selectedDate, 'plan');
        const availabilityKey = getSessionKey(selectedDate, 'availability');

        const storedPlan = sessionStorage.getItem(planKey);
        sessionStorage.getItem(availabilityKey);
        if (storedPlan) {
            try {
                const parsedPlan = JSON.parse(storedPlan);
                setShiftPlan(parsedPlan);

                // TODO: Implement constraint checking with backend integration
                // For now, set empty constraints to avoid async issues in useEffect
                const newConstraints: ConstraintViolationDto[] = [];
                setConstraints(newConstraints);
            } catch (error) {
                console.error('Error loading shift plan from sessionStorage:', error);
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

    // Generate shift plan
    const generateShiftPlan = async () => {
        if (employees.length === 0) {
            alert('Keine Mitarbeiter vorhanden. Bitte fügen Sie zuerst Mitarbeiter hinzu.');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const generatedPlan = await shiftPlanningService.generateOptimalPlan(
                employees
            );

            const newConstraints = await shiftPlanningService.validatePlan(
                generatedPlan
            );

            setShiftPlan(generatedPlan);
            setConstraints(newConstraints);

            const planKey = getSessionKey(selectedDate, 'plan');
            const availabilityKey = getSessionKey(selectedDate, 'availability');

            sessionStorage.setItem(planKey, JSON.stringify(generatedPlan));
            sessionStorage.setItem(availabilityKey, JSON.stringify([])); // TODO: Store actual availability data
        } catch (error) {
            console.error('Error generating shift plan:', error);
            alert('Der Schichtplan konnte nicht generiert werden.');
        } finally {
            setIsLoading(false);
        }
    };

    // Define quick actions
// Status items for the status light
    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Hero section */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 3, md: 4},
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
                    <Box sx={{position: 'relative', zIndex: 1}}>
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
                            Schichtplan
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie Ihre Schichtpläne für{' '}
                            {format(selectedDate, 'MMMM yyyy', {locale: de})}
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <CalendarIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {format(selectedDate, 'MMMM yyyy', {locale: de})}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <PeopleIcon sx={{color: 'success.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.totalEmployees} Mitarbeiter verfügbar
                                </Typography>
                            </Box>
                            {shiftPlan && (
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <ScheduleIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
                                    <Typography variant="body2" color="text.secondary">
                                        {stats.plannedShifts} Schichten geplant
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Sidebar - above the table */}
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

                </Box>
            </Fade>

            {/* Shift plan table - full width */}
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
                        onDateChange={setSelectedDate}
                        shiftPlan={shiftPlan}
                        constraints={constraints}
                        isLoading={isLoading}
                        onGeneratePlan={generateShiftPlan}
                    />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftPlanningPage;