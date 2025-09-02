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
    Business as BusinessIcon
} from '@mui/icons-material';
import LocationManagement from '../components/LocationManagement';
import {LocationResponseDto} from '../api/data-contracts';
import {locationService} from '@/services';

/**
 * Modern Location Management Page in Dashboard Style
 */
const LocationManagementPage: React.FC = () => {
    const theme = useTheme();

    // Location list - load via API
    const [locations, setLocations] = useState<LocationResponseDto[]>([]);

    // Fetch locations when component loads
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await locationService.getAllLocations();
                setLocations(data);
            } catch (error) {
                console.error('Error loading locations:', error);
            }
        };

        loadLocations();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update locations
    const handleLocationsChange = (updatedLocations: LocationResponseDto[]) => {
        setLocations(updatedLocations);
    };

    // Calculate overall statistics
    const calculateOverallStatistics = () => {
        const activeLocations = locations.filter(loc => loc.isActive);
        const totalLocations = locations.length;
        const totalCapacity = locations.reduce((sum, loc) => sum + loc.currentCapacity, 0);

        let totalClients = 0;
        let totalEmployees = 0;
        let totalRevenue = 0;
        let avgSatisfaction = 0;
        let avgUtilization = 0;

        activeLocations.forEach(location => {
            // TODO: Load statistics from database
            // Temporary default values until DB integration is implemented
            const defaultStats = {
                totalClients: 25,
                employeeCount: 8,
                monthlyRevenue: 15000,
                clientSatisfaction: 4.2,
                averageUtilization: 85
            };

            totalClients += defaultStats.totalClients;
            totalEmployees += defaultStats.employeeCount;
            totalRevenue += defaultStats.monthlyRevenue;
            avgSatisfaction += defaultStats.clientSatisfaction;
            avgUtilization += defaultStats.averageUtilization;
        });

        avgSatisfaction = activeLocations.length > 0 ? avgSatisfaction / activeLocations.length : 0;
        avgUtilization = activeLocations.length > 0 ? avgUtilization / activeLocations.length : 0;

        return {
            totalLocations,
            activeLocations: activeLocations.length,
            totalCapacity,
            totalClients,
            totalEmployees,
            totalRevenue,
            avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
            avgUtilization: Math.round(avgUtilization),
        };
    };

    const stats = calculateOverallStatistics();

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
                            Standortverwaltung
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie alle Standorte zentral und optimieren Sie deren Betrieb
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <BusinessIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.activeLocations} von {stats.totalLocations} Standorten aktiv
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Location management - full width */}
            <Fade in={showCards} timeout={1400}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                    data-testid="location-management"
                >
                    <Box sx={{p: 3}}>
                        <LocationManagement
                            locations={locations}
                            onLocationsChange={handleLocationsChange}
                        />
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default LocationManagementPage;