import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade
} from '@mui/material';
import EmployeeManagement from '../components/EmployeeManagement';
import {EmployeeService} from "@/services";
import {EmployeeResponseDto} from "@/api/data-contracts.ts";
import {useToast} from "@/contexts/ToastContext";

/**
 * Modern Employee Management Page in Dashboard Style
 */
const EmployeePage: React.FC = () => {
    const { showError } = useToast();

    // Load employee list via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Function to load employees
    const loadEmployees = async () => {
        try {
            const employees = await new EmployeeService().getAllEmployees();
            setEmployees(employees);
        } catch (error) {
            showError('Error loading employees. Please try again.');
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

    return (
        <Container maxWidth="xl" sx={{py: 3}}>
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