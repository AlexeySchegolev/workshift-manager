import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Fade,
    useTheme,
    alpha,
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Tooltip,
    Button,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Schedule as ScheduleIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { LocationResponseDto, ShiftResponseDto } from '../api/data-contracts';
import { ShiftWeekdayResponseDto } from '../services/ShiftWeekdaysService';
import { locationService, shiftService, shiftWeekdaysService } from '../services';
import ShiftWeekdayAssignment, { WeekDay } from '../components/shift/ShiftWeekdayAssignment';
import { startOfWeek, addDays, format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Shift Configuration Page with Location Selection and Week View
 */
const ShiftRulesPage: React.FC = () => {
    const theme = useTheme();
    const [showCards, setShowCards] = useState(false);
    const [locations, setLocations] = useState<LocationResponseDto[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>('');
    const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
    const [shiftWeekdays, setShiftWeekdays] = useState<ShiftWeekdayResponseDto[]>([]);
    const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([]);
    const [selectedDate] = useState<Date>(new Date());

    // Animation control
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Load locations
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const locationData = await locationService.getAllLocations();
                setLocations(locationData);
            } catch (error) {
                console.error('Error loading locations:', error);
            }
        };
        loadLocations();
    }, []);

    // Load shifts for selected location
    useEffect(() => {
        const loadShifts = async () => {
            if (!selectedLocationId) {
                setShifts([]);
                return;
            }
            try {
                const shiftData = await shiftService.getAllShifts({
                    locationId: selectedLocationId,
                    activeOnly: true,
                    includeRelations: true
                });
                setShifts(shiftData);
            } catch (error) {
                console.error('Error loading shifts:', error);
            }
        };
        loadShifts();
    }, [selectedLocationId]);

    // Load shift weekdays
    useEffect(() => {
        const loadShiftWeekdays = async () => {
            if (shifts.length === 0) {
                setShiftWeekdays([]);
                return;
            }
            try {
                const allWeekdays: ShiftWeekdayResponseDto[] = [];
                for (const shift of shifts) {
                    const weekdays = await shiftWeekdaysService.getShiftWeekdaysByShiftId(shift.id);
                    allWeekdays.push(...weekdays);
                }
                setShiftWeekdays(allWeekdays);
            } catch (error) {
                console.error('Error loading shift weekdays:', error);
            }
        };
        loadShiftWeekdays();
    }, [shifts]);

    // Generate current week data
    useEffect(() => {
        const generateWeekData = () => {
            const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const weekData: WeekDay[] = [];

            for (let i = 0; i < 7; i++) {
                const currentDay = addDays(weekStart, i);
                const dayOfWeek = currentDay.getDay();
                const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0=Monday, 6=Sunday

                const dayShifts: { [schichtName: string]: number } = {};
                
                // Find shifts for this weekday
                const dayWeekdays = shiftWeekdays.filter(sw => sw.weekday === adjustedDayOfWeek);
                for (const weekday of dayWeekdays) {
                    const shift = shifts.find(s => s.id === weekday.shiftId);
                    if (shift) {
                        dayShifts[shift.name] = 1; // Show that shift is configured for this day
                    }
                }

                weekData.push({
                    datum: currentDay,
                    schichten: dayShifts,
                    istWochenende: dayOfWeek === 0 || dayOfWeek === 6,
                });
            }

            setCurrentWeek(weekData);
        };

        generateWeekData();
    }, [selectedDate, shifts, shiftWeekdays]);

    const handleLocationChange = (event: SelectChangeEvent) => {
        setSelectedLocationId(event.target.value);
    };

    const handleDayClick = (date: Date) => {
        // Handle day selection for shift assignment
        console.log('Day clicked:', format(date, 'yyyy-MM-dd'));
    };

    const addShiftToDay = async (shiftId: string, weekday: number) => {
        try {
            await shiftWeekdaysService.createShiftWeekday({
                shiftId,
                weekday
            });
            // Reload shift weekdays
            const allWeekdays: ShiftWeekdayResponseDto[] = [];
            for (const shift of shifts) {
                const weekdays = await shiftWeekdaysService.getShiftWeekdaysByShiftId(shift.id);
                allWeekdays.push(...weekdays);
            }
            setShiftWeekdays(allWeekdays);
        } catch (error) {
            console.error('Error adding shift to day:', error);
        }
    };

    const removeShiftFromDay = async (shiftId: string, weekday: number) => {
        try {
            const weekdayToRemove = shiftWeekdays.find(sw => sw.shiftId === shiftId && sw.weekday === weekday);
            if (weekdayToRemove) {
                await shiftWeekdaysService.deleteShiftWeekday(weekdayToRemove.id);
                // Reload shift weekdays
                const allWeekdays: ShiftWeekdayResponseDto[] = [];
                for (const shift of shifts) {
                    const weekdays = await shiftWeekdaysService.getShiftWeekdaysByShiftId(shift.id);
                    allWeekdays.push(...weekdays);
                }
                setShiftWeekdays(allWeekdays);
            }
        } catch (error) {
            console.error('Error removing shift from day:', error);
        }
    };

    const getWeekdayName = (weekday: number): string => {
        const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
        return days[weekday] || '';
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Fade in={showCards} timeout={800}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Schichtkonfiguration
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Konfigurieren Sie Schichten für verschiedene Standorte und Wochentage
                    </Typography>
                </Box>
            </Fade>

            {/* Location Selection */}
            <Fade in={showCards} timeout={1000}>
                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <BusinessIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6">Standort auswählen</Typography>
                    </Box>
                    
                    <FormControl fullWidth>
                        <InputLabel>Standort</InputLabel>
                        <Select
                            value={selectedLocationId}
                            label="Standort"
                            onChange={handleLocationChange}
                        >
                            <MenuItem value="">
                                <em>Bitte wählen Sie einen Standort</em>
                            </MenuItem>
                            {locations.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Fade>

            {/* Week Overview */}
            {selectedLocationId && (
                <Fade in={showCards} timeout={1200}>
                    <Box sx={{ mb: 4 }}>
                        <ShiftWeekdayAssignment
                            woche={currentWeek}
                            selectedDate={selectedDate}
                            onDateSelect={handleDayClick}
                            title="Schichtzuordnung zu Wochentagen"
                        />
                    </Box>
                </Fade>
            )}

            {/* Shift Management */}
            {selectedLocationId && shifts.length > 0 && (
                <Fade in={showCards} timeout={1400}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <ScheduleIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6">Schichten verwalten</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {shifts.map((shift) => {
                                const shiftWeekdaysForShift = shiftWeekdays.filter(sw => sw.shiftId === shift.id);
                                
                                return (
                                    <Box key={shift.id} sx={{ flex: '1 1 300px', minWidth: 300 }}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardHeader
                                                title={shift.name}
                                                subheader={`${shift.startTime} - ${shift.endTime}`}
                                                sx={{ pb: 1 }}
                                            />
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Aktive Wochentage:
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                                    {shiftWeekdaysForShift.map((sw) => (
                                                        <Chip
                                                            key={sw.id}
                                                            label={getWeekdayName(sw.weekday)}
                                                            size="small"
                                                            onDelete={() => removeShiftFromDay(shift.id, sw.weekday)}
                                                            deleteIcon={<DeleteIcon />}
                                                            sx={{
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                color: 'primary.main',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Zu Wochentag hinzufügen:
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
                                                        const isActive = shiftWeekdaysForShift.some(sw => sw.weekday === weekday);
                                                        if (isActive) return null;
                                                        
                                                        return (
                                                            <Tooltip key={weekday} title={`Zu ${getWeekdayName(weekday)} hinzufügen`}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => addShiftToDay(shift.id, weekday)}
                                                                    sx={{
                                                                        fontSize: '0.7rem',
                                                                        minWidth: 32,
                                                                        height: 24,
                                                                        backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                                                        '&:hover': {
                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                        }
                                                                    }}
                                                                >
                                                                    <AddIcon sx={{ fontSize: '0.8rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Fade>
            )}

            {/* No Location Selected */}
            {!selectedLocationId && (
                <Fade in={showCards} timeout={1200}>
                    <Paper
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                            mb: 4,
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            Standort auswählen
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Wählen Sie einen Standort aus, um die Schichtkonfiguration zu verwalten.
                        </Typography>
                    </Paper>
                </Fade>
            )}
        </Container>
    );
};

export default ShiftRulesPage;