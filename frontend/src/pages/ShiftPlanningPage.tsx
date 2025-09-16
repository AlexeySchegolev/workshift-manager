import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
import ShiftPlanTable from '../components/shift-plan/ShiftPlanTable';
import {ShiftPlanService, LocationService} from "@/services";
import {shiftPlanCalculationService, CalculatedShiftPlan} from "@/services/ShiftPlanCalculationService";
import {shiftWeekdaysService, ShiftWeekdayResponseDto} from "@/services/ShiftWeekdaysService";
import {useAuth} from "@/contexts/AuthContext";
import {
    CreateShiftPlanDto
} from "@/api/data-contracts.ts";

/**
 * Modern Shift Planning Page in Dashboard Style
 */
const ShiftPlanningPage: React.FC = () => {
    const theme = useTheme();
    const { organizationId, userId } = useAuth();

    // Selected date
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Selected location
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

    // Calculated shift plan data from service
    const [calculatedShiftPlan, setCalculatedShiftPlan] = useState<CalculatedShiftPlan>({
        shiftPlan: null,
        shiftPlanDetails: [],
        employees: [],
        days: [],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        locationId: '',
        locationName: null,
        isLoading: false,
        hasData: false
    });

    // Shift weekdays data for selected location
    const [shiftWeekdays, setShiftWeekdays] = useState<ShiftWeekdayResponseDto[]>([]);

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

    // Load shift plan using calculation service
    const loadShiftPlan = async (locationId: string, date: Date) => {
        if (!locationId) return;
        
        setCalculatedShiftPlan(prev => ({ ...prev, isLoading: true }));
        
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-based
            
            const result = await shiftPlanCalculationService.calculateShiftPlan(
                year,
                month,
                locationId
            );
            
            setCalculatedShiftPlan(result);
        } catch (error) {
            console.error('Fehler beim Laden des Schichtplans:', error);
            setCalculatedShiftPlan({
                shiftPlan: null,
                shiftPlanDetails: [],
                employees: [],
                days: [],
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                locationId: '',
                locationName: null,
                isLoading: false,
                hasData: false
            });
        }
    };

    // Load shift weekdays for selected location
    const loadShiftWeekdays = async (locationId: string) => {
        try {
            const weekdays = await shiftWeekdaysService.getShiftWeekdaysByLocationId(locationId);
            setShiftWeekdays(weekdays);
        } catch (error) {
            console.error('Fehler beim Laden der Schicht-Wochentage:', error);
            setShiftWeekdays([]);
        }
    };

    // Load shift plan when date or location changes
    useEffect(() => {
        if (selectedLocationId && selectedDate) {
            loadShiftPlan(selectedLocationId, selectedDate);
            loadShiftWeekdays(selectedLocationId);
        } else {
            setCalculatedShiftPlan({
                shiftPlan: null,
                shiftPlanDetails: [],
                employees: [],
                days: [],
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                locationId: selectedLocationId || '',
                locationName: null,
                isLoading: false,
                hasData: false
            });
            setShiftWeekdays([]);
        }
    }, [selectedDate, selectedLocationId]);

    // Create new shift plan
    const createShiftPlan = async () => {
        if (!selectedLocationId) {
            alert('Bitte wählen Sie zuerst eine Location aus.');
            return;
        }
        
        if (!organizationId) {
            alert('Keine Organisation gefunden. Bitte melden Sie sich erneut an.');
            return;
        }
        
        setIsLoading(true);
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            
            // Load location data to get the location name
            const locationService = new LocationService();
            const location = await locationService.getLocationById(selectedLocationId);
            
            // Calculate planning period start and end dates
            const planningPeriodStart = new Date(year, month - 1, 1);
            const planningPeriodEnd = new Date(year, month, 0); // Last day of the month
            
            // Generate shift plan name with location name
            const monthNames = [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ];
            const planName = `Schichtplan ${location.name} ${monthNames[month - 1]}, ${year}`;
            
            const createShiftPlanData: CreateShiftPlanDto = {
                organizationId,
                locationId: selectedLocationId,
                name: planName,
                description: `Schichtplan für ${monthNames[month - 1]} ${year}`,
                year,
                month,
                planningPeriodStart: planningPeriodStart.toISOString().split('T')[0],
                planningPeriodEnd: planningPeriodEnd.toISOString().split('T')[0],
                createdBy: userId || undefined
            };
            
            const shiftPlanService = new ShiftPlanService();
            const newShiftPlan = await shiftPlanService.createShiftPlan(createShiftPlanData);
            
            // Refresh the calculated shift plan after creation
            await loadShiftPlan(selectedLocationId, selectedDate);
            
            console.log('Schichtplan erfolgreich erstellt:', newShiftPlan);
        } catch (error: any) {
            console.error('Fehler beim Erstellen des Schichtplans:', error);
            if (error?.response?.status === 400) {
                alert('Ein Schichtplan für diesen Monat und diese Location existiert bereits.');
            } else {
                alert('Fehler beim Erstellen des Schichtplans. Bitte versuchen Sie es erneut.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Generate/Refresh shift plan
    const generateShiftPlan = async () => {
        if (!selectedLocationId) {
            alert('Bitte wählen Sie zuerst eine Location aus.');
            return;
        }

        if (calculatedShiftPlan.employees.length === 0) {
            alert('Keine Mitarbeiter vorhanden. Bitte fügen Sie zuerst Mitarbeiter hinzu.');
            return;
        }

        // If no shift plan exists, create one first
        if (!calculatedShiftPlan.shiftPlan) {
            await createShiftPlan();
            return;
        }

        // Refresh the existing shift plan data
        setIsLoading(true);
        try {
            await loadShiftPlan(selectedLocationId, selectedDate);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Schichtplans:', error);
            alert('Fehler beim Aktualisieren des Schichtplans. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    // Define quick actions
// Status items for the status light
    return (
        <Container maxWidth="xl" sx={{py: 3}}>
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
                    <ShiftPlanTable
                        calculatedShiftPlan={calculatedShiftPlan}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        selectedLocationId={selectedLocationId}
                        onLocationChange={setSelectedLocationId}
                        isLoading={isLoading || calculatedShiftPlan.isLoading}
                        onGeneratePlan={generateShiftPlan}
                        onCreatePlan={createShiftPlan}
                        showNoShiftPlanOverlay={!!(selectedLocationId && !calculatedShiftPlan.isLoading && !calculatedShiftPlan.shiftPlan)}
                    />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftPlanningPage;