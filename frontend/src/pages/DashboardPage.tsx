import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import {useDashboardData} from '../hooks/useDashboardData';
import {employeeService} from '@/services';
import {EmployeeResponseDto} from '../api/data-contracts';
import WeekOverview from "@/components/dashboard/WeekOverview.tsx";

/**
 * Professional Dashboard Page for authenticated users
 */
const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    // State for current data
    const [selectedDate] = useState<Date>(new Date());

    // Load employee list via API
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);

    // Fetch employees when component loads
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employees = await employeeService.getAllEmployees({
                    includeRelations: true
                });
                setEmployees(employees);
            } catch (error) {
                // Error handling could be added here if needed
            }
        };

        loadEmployees();
    }, []);

    // Load dashboard data
    const {currentWeek} = useDashboardData(
        employees,
        selectedDate
    );

    // Animation delay for cards
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Main content */}
            <Fade in={showCards} timeout={1200}>
                <Box sx={{mb: 4}}>
                    {/* Week overview - full width */}
                    <WeekOverview
                        woche={currentWeek}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                            // Navigate to shift planning with selected date
                            const dateString = format(date, 'yyyy-MM-dd');
                            navigate(`/schichtplan?date=${dateString}`);
                        }}
                        title="Aktuelle Woche"
                    />
                </Box>
            </Fade>
        </Container>
    );
};

export default DashboardPage;