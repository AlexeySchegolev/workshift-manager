import React, {useState, useEffect} from 'react';
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
    Warning as WarningIcon,
    TrendingUp as TrendingUpIcon,
    CalendarMonth as CalendarIcon,

} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import {useDashboardData} from '../hooks/useDashboardData';
import {employeeService, shiftPlanService} from '@/services';
import {EmployeeResponseDto} from '../api/data-contracts';
import StatisticsCard from "@/components/dashboard/StatisticsCard.tsx";
import WeekOverview from "@/components/dashboard/WeekOverview.tsx";

/**
 * Professional Dashboard Page for authenticated users
 */
const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    // State for current data
    const [selectedDate] = useState<Date>(new Date());
    const [currentShiftPlan, setCurrentShiftPlan] = useState<any>(null);

    // Load employee list via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when component loads
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await employeeService.getAllEmployees();
                setEmployees(employees);
            } catch (error) {
                console.error('Error loading employees:', error);
            }
        };

        loadEmployees();
    }, []);

    // Load current shift plan
    useEffect(() => {
        const loadCurrentShiftPlan = async () => {
            try {
                // Get all shift plans and find the most recent one or current month's plan
                const shiftPlans = await shiftPlanService.getAllShiftPlans({ includeRelations: true });
                
                if (shiftPlans && shiftPlans.length > 0) {
                    // For now, use the first available shift plan
                    // In a real scenario, you'd filter by current month/date
                    const currentPlan = shiftPlans[0];
                    
                    // Transform the shift plan data to match the expected MonthlyShiftPlanData format
                    // The planData is an array, so we use the first item if available
                    if (currentPlan.planData && currentPlan.planData.length > 0) {
                        setCurrentShiftPlan(currentPlan.planData[0]);
                    }
                }
            } catch (error) {
                console.error('Error loading current shift plan:', error);
                // Keep currentShiftPlan as null if loading fails
            }
        };

        loadCurrentShiftPlan();
    }, []);

    // Load dashboard data
    const {statistics, currentWeek} = useDashboardData(
        employees, // Now the loaded employees are passed
        currentShiftPlan,
        selectedDate
    );

    // Animation delay for cards
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

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
                            Dashboard
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Willkommen zurück! Hier ist Ihre Übersicht für{' '}
                            {format(selectedDate, 'EEEE, dd. MMMM yyyy', {locale: de})}
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
                                    {statistics.employeeCount} Mitarbeiter aktiv
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
                    <StatisticsCard
                        title="Mitarbeiter"
                        value={statistics.employeeCount}
                        subtitle="Aktive Mitarbeiter im System"
                        icon={<PeopleIcon/>}
                        color="primary"
                        onClick={() => navigate('/mitarbeiter')

                        }
                    />
                    <StatisticsCard
                        title="Schichtabdeckung"
                        value={`${statistics.shiftCoverage}%`}
                        subtitle="Geplante Schichten"
                        icon={<ScheduleIcon/>}
                        color={statistics.shiftCoverage >= 90 ? 'success' : statistics.shiftCoverage >= 70 ? 'warning' : 'error'}
                        onClick={() => navigate('/schichtplan')}
                    />
                    <StatisticsCard
                        title="Ø Auslastung"
                        value={`${statistics.averageWorkload.toFixed(1)}h`}
                        subtitle="Pro Mitarbeiter/Monat"
                        icon={<TrendingUpIcon/>}
                        color={statistics.averageWorkload <= 160 ? 'success' : 'warning'}
                    />
                    <StatisticsCard
                        title="Warnungen"
                        value={statistics.currentWarnings + statistics.ruleViolations}
                        subtitle="Aktuelle Probleme"
                        icon={<WarningIcon/>}
                        color={statistics.currentWarnings + statistics.ruleViolations === 0 ? 'success' : 'warning'}
                    />
                </Box>
            </Fade>

            {/* Main content */}
            <Fade in={showCards} timeout={1200}>
                <Box sx={{mb: 4}}>
                    {/* Week overview - full width */}
                    <WeekOverview
                        woche={currentWeek}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                            // Navigate to shift planning with selected date
                            const dateString = format(date, 'yyyy-MM-dd');
                            navigate(`/schichtplan?date=${dateString}`);
                        }}
                        title="Aktuelle Woche"
                    />
                </Box>
            </Fade>
        </Container>
    );
};

export default DashboardPage;