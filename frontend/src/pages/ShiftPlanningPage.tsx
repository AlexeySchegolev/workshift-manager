import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
import ShiftPlanTable from '../components/shift-plan/ShiftPlanTable';
import {EmployeeService, ShiftPlanService, LocationService} from "@/services";
import {useAuth} from "@/contexts/AuthContext";
import {
    EmployeeResponseDto,
    ShiftPlanResponseDto,
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

    // Employee list - load via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when selectedLocationId changes
    useEffect(() => {
        const loadEmployees = async () => {
            if (!selectedLocationId) {
                setEmployees([]);
                return;
            }

            try {
                const employees = await new EmployeeService().getEmployeesByLocation(selectedLocationId, {
                    includeRelations: true
                });
                setEmployees(employees);
            } catch (error) {
                console.error('Fehler beim Laden der Mitarbeiter:', error);
                setEmployees([]);
            }
        };

        loadEmployees();
    }, [selectedLocationId]);

    // Shift plan - using proper DTO type
    const [shiftPlan, setShiftPlan] = useState<ShiftPlanResponseDto | null>(null);

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingShiftPlan, setIsLoadingShiftPlan] = useState<boolean>(false);

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

    // Load shift plan from API
    const loadShiftPlan = async (locationId: string, date: Date) => {
        if (!locationId) return;
        
        setIsLoadingShiftPlan(true);
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-based
            
            const shiftPlanService = new ShiftPlanService();
            const plan = await shiftPlanService.getShiftPlanByLocationMonthYear(
                locationId,
                year,
                month
            );
            
            setShiftPlan(plan);
        } catch (error) {
            console.error('Fehler beim Laden des Schichtplans:', error);
            setShiftPlan(null);
        } finally {
            setIsLoadingShiftPlan(false);
        }
    };

    // Initialize shift plan
    const initializeShiftPlan = () => {
        setShiftPlan(null);
    };

    // Load shift plan when date or location changes
    useEffect(() => {
        if (selectedLocationId && selectedDate) {
            loadShiftPlan(selectedLocationId, selectedDate);
        } else {
            setShiftPlan(null);
        }
    }, [selectedDate, selectedLocationId]);

    // Initialize shift plan when date changes or load from sessionStorage (fallback)
    useEffect(() => {
        const planKey = getSessionKey(selectedDate, 'plan');
        const availabilityKey = getSessionKey(selectedDate, 'availability');

        const storedPlan = sessionStorage.getItem(planKey);
        sessionStorage.getItem(availabilityKey);
        if (storedPlan && !shiftPlan) {
            try {
                const parsedPlan = JSON.parse(storedPlan);
                setShiftPlan(parsedPlan);
            } catch (error) {
                initializeShiftPlan();
            }
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
    }, [selectedDate, employees, shiftPlan]);

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
            
            // Set the new shift plan to display it
            setShiftPlan(newShiftPlan);
            
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

    // Generate shift plan
    const generateShiftPlan = async () => {
        if (employees.length === 0) {
            alert('Keine Mitarbeiter vorhanden. Bitte fügen Sie zuerst Mitarbeiter hinzu.');
            return;
        }
        alert("Dieses Feature kommt noch...");
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
                        employees={employees}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        selectedLocationId={selectedLocationId}
                        onLocationChange={setSelectedLocationId}
                        shiftPlan={shiftPlan}
                        shiftPlanId={shiftPlan?.id}
                        isLoading={isLoading || isLoadingShiftPlan}
                        onGeneratePlan={generateShiftPlan}
                        onCreatePlan={createShiftPlan}
                        showNoShiftPlanOverlay={!!(selectedLocationId && !isLoadingShiftPlan && !shiftPlan)}
                    />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftPlanningPage;