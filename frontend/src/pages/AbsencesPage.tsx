import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    useTheme,
    Paper,
} from '@mui/material';
import AbsenceTable from '../components/absence/AbsenceTable';
import { EmployeeService } from "@/services";
import { employeeAbsenceService } from "@/services";
import {
    EmployeeResponseDto,
    EmployeeAbsenceResponseDto,
} from "@/api/data-contracts.ts";

/**
 * Abwesenheiten-Seite im Dashboard-Stil
 */
const AbsencesPage: React.FC = () => {
    const theme = useTheme();

    // Ausgewähltes Datum
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Mitarbeiterliste - über API laden
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Abwesenheiten
    const [absences, setAbsences] = useState<EmployeeAbsenceResponseDto[]>([]);

    // Loading-Status
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Animation-Kontrolle
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Mitarbeiter laden beim Komponenten-Start
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

    // Abwesenheiten für den ausgewählten Monat laden
    useEffect(() => {
        const loadAbsences = async () => {
            setIsLoading(true);
            try {
                const year = selectedDate.getFullYear().toString();
                const month = (selectedDate.getMonth() + 1).toString();
                const absences = await employeeAbsenceService.getAbsencesByMonth(year, month);
                setAbsences(absences);
            } catch (error) {
                // Error handling could be added here if needed
            } finally {
                setIsLoading(false);
            }
        };

        loadAbsences();
    }, [selectedDate]);


    // Refresh absences function
    const refreshAbsences = async () => {
        setIsLoading(true);
        try {
            const year = selectedDate.getFullYear().toString();
            const month = (selectedDate.getMonth() + 1).toString();
            const updatedAbsences = await employeeAbsenceService.getAbsencesByMonth(year, month);
            setAbsences(updatedAbsences);
        } catch (error) {
            // Error handling could be added here if needed
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>

            {/* Abwesenheiten-Tabelle - volle Breite */}
            <Box sx={{ opacity: showCards ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <AbsenceTable
                        employees={employees}
                        absences={absences}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onRefreshAbsences={refreshAbsences}
                        isLoading={isLoading}
                    />
                </Paper>
            </Box>

        </Container>
    );
};

export default AbsencesPage;