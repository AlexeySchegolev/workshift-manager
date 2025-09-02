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
    Business as BusinessIcon
} from '@mui/icons-material';
import EmployeeManagement from '../components/EmployeeManagement';
import {EmployeeService} from "@/services";
import {EmployeeResponseDto} from "@/api/data-contracts.ts";

/**
 * Modern Employee Management Page in Dashboard Style
 */
const EmployeePage: React.FC = () => {
    const theme = useTheme();

    // Load employee list via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Function to load employees
    const loadEmployees = async () => {
        try {
            const employees = await new EmployeeService().getAllEmployees();
            setEmployees(employees);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    // Fetch employees when component loads
    useEffect(() => {
        loadEmployees();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update employees and refresh from API if needed
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
                            Mitarbeiterverwaltung
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie Ihr Team und optimieren Sie die Personalplanung
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <PeopleIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
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