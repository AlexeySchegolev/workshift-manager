import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
import ShiftPlanTable from '../components/ShiftPlanTable';
import {EmployeeService} from "@/services";
import {
    EmployeeResponseDto
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

    // Shift plan - using generic object type since MonthlyShiftPlanDto no longer exists
    const [shiftPlan, setShiftPlan] = useState<Record<string, any> | null>(null);


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
    };

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
            } catch (error) {
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
                        isLoading={isLoading}
                        onGeneratePlan={generateShiftPlan}
                    />
                </Paper>
            </Fade>
        </Container>
    );
};

export default ShiftPlanningPage;