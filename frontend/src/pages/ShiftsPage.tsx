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
    Business as BusinessIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import ShiftManagement from '../components/ShiftManagement';
import {shiftService} from "@/services/ShiftService";
import {ShiftResponseDto} from "@/api/data-contracts.ts";

/**
 * Modern Shift Management Page in Dashboard Style
 */
const ShiftsPage: React.FC = () => {
    const theme = useTheme();

    // Load shift list via API
    const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch shifts when component loads
    useEffect(() => {
        const loadShifts = async () => {
            try {
                setLoading(true);
                const shifts = await shiftService.getAllShifts({
                    activeOnly: true,
                    includeRelations: true
                });
                setShifts(shifts);
            } catch (error) {
                console.error('Error loading shifts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadShifts();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update shifts
    const handleShiftsChange = (updatedShifts: ShiftResponseDto[]) => {
        setShifts(updatedShifts);
    };

    // Calculate statistics
    const calculateStatistics = () => {
        const totalShifts = shifts.length;
        const stationA = shifts.filter(shift => shift.location?.code === 'DSA').length;
        const stationB = shifts.filter(shift => shift.location?.code === 'DSB').length;
        const morningShifts = shifts.filter(shift => shift.type === 'morning').length;
        const afternoonShifts = shifts.filter(shift => shift.type === 'afternoon').length;
        const nightShifts = shifts.filter(shift => shift.type === 'night').length;
        const weekendShifts = shifts.filter(shift => shift.isWeekend).length;

        const totalStaffingPercentage = shifts.reduce((sum, shift) => sum + shift.staffingPercentage, 0);
        const avgStaffing = totalShifts > 0 ? Math.round((totalStaffingPercentage / totalShifts) * 10) / 10 : 0;

        const fullyStaffed = shifts.filter(shift => shift.isFullyStaffed).length;
        const understaffed = shifts.filter(shift => !shift.isFullyStaffed).length;

        // Calculate warnings
        let warnings = 0;
        if (understaffed > totalShifts * 0.2) warnings++; // More than 20% understaffed
        if (nightShifts < 2) warnings++; // Too few night shifts
        if (avgStaffing < 80) warnings++; // Low average staffing

        return {
            totalShifts,
            stationA,
            stationB,
            morningShifts,
            afternoonShifts,
            nightShifts,
            weekendShifts,
            avgStaffing,
            fullyStaffed,
            understaffed,
            warnings,
        };
    };

    const stats = calculateStatistics();

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{py: 3}}>
                <Typography>Lade Schichten...</Typography>
            </Container>
        );
    }

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
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
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
                            Schichten
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie Ihre Schichten
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <ScheduleIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.totalShifts} Schichten geplant
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <BusinessIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.stationA} Station A • {stats.stationB} Station B
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <AccessTimeIcon sx={{color: 'warning.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Ø {stats.avgStaffing.toFixed(1)}% Besetzung
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Shift management - full width */}
            <Fade in={showCards} timeout={1400}>
                <Box>
                    <ShiftManagement
                        shifts={shifts}
                        onShiftsChange={handleShiftsChange}
                    />
                </Box>
            </Fade>
        </Container>
    );
};

export default ShiftsPage;