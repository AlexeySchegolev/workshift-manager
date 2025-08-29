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
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import LocationManagement from '../components/LocationManagement';
import {LocationResponseDto} from '../api/data-contracts';
import {locationService} from '@/services';
import StatisticsCard from "@/components/dashboard/StatisticsCard.tsx";
import QuickActions from "@/components/dashboard/QuickActions.tsx";
import StatusLight from "@/components/dashboard/StatusLight.tsx";

/**
 * Modern Location Management Page in Dashboard Style
 */
const LocationManagementPage: React.FC = () => {
    const theme = useTheme();

    // Location list - load via API
    const [locations, setLocations] = useState<LocationResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch locations when component loads
    useEffect(() => {
        const loadLocations = async () => {
            try {
                setLoading(true);
                const data = await locationService.getAllLocations();
                setLocations(data);
            } catch (error) {
                console.error('Error loading locations:', error);
            } finally {
                setLoading(false);
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
        const totalCapacity = locations.reduce((sum, loc) => sum + loc.maxCapacity, 0);

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

    // Define quick actions
    const quickActions = [
        {
            id: 'add-location',
            title: 'Neuer Standort',
            description: 'Neuen Standort zur Verwaltung hinzufügen',
            icon: <BusinessIcon/>,
            color: 'success' as const,
            onClick: () => {
                // Scroll to form
                const formElement = document.querySelector('[data-testid="location-management"]');
                if (formElement) {
                    formElement.scrollIntoView({behavior: 'smooth'});
                }
            },
        },
        {
            id: 'location-analysis',
            title: 'Standortanalyse',
            description: 'Detaillierte Analyse aller Standorte',
            icon: <AssessmentIcon/>,
            color: 'info' as const,
            onClick: () => {
                // TODO: Implement location analysis
                console.log('Standortanalyse öffnen');
            },
        },
        {
            id: 'capacity-planning',
            title: 'Kapazitätsplanung',
            description: 'Optimierung der Standortkapazitäten',
            icon: <TrendingUpIcon/>,
            color: 'warning' as const,
            onClick: () => {
                // TODO: Implement capacity planning
                console.log('Kapazitätsplanung öffnen');
            },
        },
        {
            id: 'location-reports',
            title: 'Standortberichte',
            description: 'Berichte und Statistiken exportieren',
            icon: <LocationIcon/>,
            color: 'primary' as const,
            onClick: () => {
                // TODO: Implement report generation
                console.log('Standortberichte generieren');
            },
        },
    ];

    // Status items for the status light
    const statusItems = [
        {
            id: 'active-locations',
            title: 'Aktive Standorte',
            description: 'Anzahl der betriebsbereiten Standorte',
            status: stats.activeLocations >= 2 ? 'success' : stats.activeLocations >= 1 ? 'warning' : 'error',
            value: stats.activeLocations,
            maxValue: stats.totalLocations,
            details: stats.activeLocations < 2 ? ['Mindestens 2 aktive Standorte für Redundanz empfohlen'] : undefined,
        } as const,
        {
            id: 'capacity-utilization',
            title: 'Kapazitätsauslastung',
            description: 'Durchschnittliche Auslastung aller Standorte',
            status: stats.avgUtilization >= 80 && stats.avgUtilization <= 95 ? 'success' : stats.avgUtilization > 95 ? 'warning' : 'error',
            value: stats.avgUtilization,
            maxValue: 100,
            details: stats.avgUtilization > 95 ? ['Sehr hohe Auslastung - Kapazitätserweiterung prüfen'] :
                stats.avgUtilization < 70 ? ['Niedrige Auslastung - Optimierungspotential vorhanden'] : undefined,
        } as const,
        {
            id: 'client-satisfaction',
            title: 'Kundenzufriedenheit',
            description: 'Durchschnittliche Bewertung aller Standorte',
            status: stats.avgSatisfaction >= 4.5 ? 'success' : stats.avgSatisfaction >= 4.0 ? 'warning' : 'error',
            value: stats.avgSatisfaction,
            maxValue: 5,
            details: stats.avgSatisfaction < 4.0 ? ['Kundenzufriedenheit unter Zielwert - Maßnahmen erforderlich'] : undefined,
        } as const,
        {
            id: 'employee-distribution',
            title: 'Personalverteilung',
            description: 'Mitarbeiter pro Standort',
            status: stats.totalEmployees >= stats.activeLocations * 6 ? 'success' : 'warning',
            value: Math.round(stats.totalEmployees / Math.max(stats.activeLocations, 1)),
            maxValue: 15,
            details: stats.totalEmployees < stats.activeLocations * 6 ? ['Zu wenig Personal pro Standort'] : undefined,
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
                        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.warning.main})`,
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
                                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
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
                                <BusinessIcon sx={{color: 'info.main', fontSize: '1.2rem'}}/>
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