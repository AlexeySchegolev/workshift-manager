import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Container,
    Fade
} from '@mui/material';
import ShiftManagement from '../components/shift/ShiftManagement';
import {shiftService} from "@/services/ShiftService";
import {ShiftResponseDto} from "@/api/data-contracts.ts";

/**
 * Modern Shift Management Page in Dashboard Style
 */
const ShiftsPage: React.FC = () => {
    // Load shift list via API
    const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch shifts when component loads
    useEffect(() => {
        const loadShifts = async () => {
            try {
                setLoading(true);
                const shifts = await shiftService.getAllShifts({
                    activeOnly: true,
                    includeRelations: true
                });
                setShifts(shifts);
            } catch (error) {
                // Error handling could be added here if needed
            } finally {
                setLoading(false);
            }
        };

        loadShifts();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update shifts
    const handleShiftsChange = (updatedShifts: ShiftResponseDto[]) => {
        setShifts(updatedShifts);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{py: 3}}>
                <Typography>Lade Schichten...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Shift management - full width */}
            <Fade in={showCards} timeout={1400}>
                <Box>
                    <ShiftManagement
                        shifts={shifts}
                        onShiftsChange={handleShiftsChange}
                    />
                </Box>
            </Fade>
        </Container>
    );
};

export default ShiftsPage;