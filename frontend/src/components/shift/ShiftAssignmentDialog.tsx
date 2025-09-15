import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Alert,
    Stack,
    Chip,
    CircularProgress,
    alpha,
} from '@mui/material';
import { EmployeeResponseDto, ShiftResponseDto } from '@/api/data-contracts';
import { shiftService } from '@/services/ShiftService';

interface ShiftAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    onAssign: (employeeId: string, shiftId: string | null, date: string) => Promise<void>;
    employee: EmployeeResponseDto | null;
    selectedDate: string; // Format: "DD.MM.YYYY"
    currentShiftId?: string | null; // Currently assigned shift ID
    locationId: string | null;
}

const ShiftAssignmentDialog: React.FC<ShiftAssignmentDialogProps> = ({
    open,
    onClose,
    onAssign,
    employee,
    selectedDate,
    currentShiftId,
    locationId,
}) => {
    const [selectedShiftId, setSelectedShiftId] = useState<string>('');
    const [availableShifts, setAvailableShifts] = useState<ShiftResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [error, setError] = useState<string>('');

    // Load available shifts when dialog opens
    useEffect(() => {
        if (open && locationId) {
            loadAvailableShifts();
        }
    }, [open, locationId]);

    // Set current shift when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedShiftId(currentShiftId || '');
            setError('');
        }
    }, [open, currentShiftId]);

    const loadAvailableShifts = async () => {
        if (!locationId) return;

        setIsLoadingShifts(true);
        try {
            const shifts = await shiftService.getShiftsByLocationId(locationId, {
                activeOnly: true,
                includeRelations: true,
            });
            setAvailableShifts(shifts);
        } catch (error) {
            setError('Fehler beim Laden der verfügbaren Schichten');
            console.error('Error loading shifts:', error);
        } finally {
            setIsLoadingShifts(false);
        }
    };

    const handleAssign = async () => {
        if (!employee) return;

        setIsLoading(true);
        try {
            // Pass null if no shift is selected (to remove assignment)
            const shiftIdToAssign = selectedShiftId || null;
            await onAssign(employee.id, shiftIdToAssign, selectedDate);
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Fehler beim Zuweisen der Schicht');
        } finally {
            setIsLoading(false);
        }
    };

    const selectedShift = availableShifts.find(shift => shift.id === selectedShiftId);

    if (!employee) {
        return null;
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Schicht zuweisen
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {/* Employee Information */}
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: 'primary.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.200'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {employee.firstName} {employee.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                                label={employee.primaryRole?.name || 'Keine Rolle'}
                                size="small"
                                color="primary"
                                sx={{
                                    height: 20,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }}
                            />
                            {employee.location && (
                                <Chip
                                    label={employee.location.name}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.7rem',
                                        backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
                                        color: (theme) => theme.palette.info.main,
                                    }}
                                />
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Datum: {selectedDate}
                        </Typography>
                    </Box>

                    {/* Shift Selection */}
                    <FormControl fullWidth>
                        <InputLabel>Schicht</InputLabel>
                        <Select
                            value={selectedShiftId}
                            onChange={(e) => setSelectedShiftId(e.target.value)}
                            label="Schicht"
                            disabled={isLoadingShifts}
                        >
                            <MenuItem value="">
                                <em>Keine Schicht (Zuweisung entfernen)</em>
                            </MenuItem>
                            {availableShifts.map((shift) => (
                                <MenuItem key={shift.id} value={shift.id}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {shift.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {shift.startTime} - {shift.endTime} ({shift.duration}h)
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {isLoadingShifts && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    Lade verfügbare Schichten...
                                </Typography>
                            </Box>
                        )}
                    </FormControl>

                    {/* Selected Shift Details */}
                    {selectedShift && (
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'success.50', 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'success.200'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                Ausgewählte Schicht: {selectedShift.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Zeit: {selectedShift.startTime} - {selectedShift.endTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dauer: {selectedShift.duration} Stunden
                            </Typography>
                            {selectedShift.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {selectedShift.description}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Current Assignment Info */}
                    {currentShiftId && (
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'warning.50', 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'warning.200'
                        }}>
                            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                                {selectedShiftId === currentShiftId 
                                    ? 'Aktuelle Zuweisung beibehalten'
                                    : selectedShiftId 
                                        ? 'Aktuelle Zuweisung wird ersetzt'
                                        : 'Aktuelle Zuweisung wird entfernt'
                                }
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={onClose} 
                    disabled={isLoading}
                    sx={{ borderRadius: 2 }}
                >
                    Abbrechen
                </Button>
                <Button 
                    onClick={handleAssign} 
                    variant="contained" 
                    disabled={isLoading || isLoadingShifts}
                    sx={{ borderRadius: 2 }}
                >
                    {isLoading ? 'Zuweisen...' : 'Zuweisen'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShiftAssignmentDialog;