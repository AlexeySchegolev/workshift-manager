import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import React from 'react';

interface NoShiftPlanOverlayProps {
    selectedDate: Date;
    selectedLocationId: string | null;
    onCreatePlan: () => void;
}

/**
 * Overlay component that shows when no shift plan is found
 */
const NoShiftPlanOverlay: React.FC<NoShiftPlanOverlayProps> = ({
    selectedDate,
    selectedLocationId,
    onCreatePlan
}) => {
    // Helper function to get month name in German
    const getMonthName = (date: Date): string => {
        const months = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        return months[date.getMonth()];
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
            }}
        >
            <Stack
                spacing={3}
                alignItems="center"
                sx={{
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <Typography variant="h5" color="text.secondary">
                    Kein Schichtplan gefunden
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Es ist noch kein Schichtplan für {getMonthName(selectedDate)} {selectedDate.getFullYear()} 
                    {selectedLocationId && ' an diesem Standort'} vorhanden.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onCreatePlan}
                    sx={{
                        px: 4,
                        py: 1.5,
                    }}
                >
                    Plan erstellen
                </Button>
            </Stack>
        </Box>
    );
};

export default NoShiftPlanOverlay;