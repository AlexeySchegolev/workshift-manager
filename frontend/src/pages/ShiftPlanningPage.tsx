import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
import ShiftPlanTable from '../components/ShiftPlanTable';
import {EmployeeService, ShiftPlanService} from "@/services";
import {
    EmployeeResponseDto,
    ShiftPlanResponseDto
} from "@/api/data-contracts.ts";

/**
 * Modern Shift Planning Page in Dashboard Style
 */
const ShiftPlanningPage: React.FC = () => {
    const theme = useTheme();

    // Selected date
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Selected location
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

    // Employee list - load via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when component loads
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await new EmployeeService().getAllEmployees({
                    includeRelations: true
                });
                setEmployees(employees);
            } catch (error) {
                // Error handling could be added here if needed
            }
        };

        loadEmployees();
    }, []);

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
                        isLoading={isLoading || isLoadingShiftPlan}
                        onGeneratePlan={generateShiftPlan}
                    />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftPlanningPage;