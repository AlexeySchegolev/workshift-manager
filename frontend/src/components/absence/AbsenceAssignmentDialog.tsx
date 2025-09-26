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
    alpha,
    TextField,
} from '@mui/material';
import { ReducedEmployee } from '@/services';
import { CreateEmployeeAbsenceDto } from '@/api/data-contracts';
import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';

// Abwesenheitstypen
const ABSENCE_TYPES = [
    { value: 'vacation' as const, label: 'Urlaub' },
    { value: 'sick_leave' as const, label: 'Krankheit' },
    { value: 'other' as const, label: 'Sonstiges' }
];

interface AbsenceAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    onAssign: (absenceData: CreateEmployeeAbsenceDto) => Promise<void>;
    employee: ReducedEmployee | null;
    selectedDate: string; // Format: "DD.MM.YYYY"
}

const AbsenceAssignmentDialog: React.FC<AbsenceAssignmentDialogProps> = ({
    open,
    onClose,
    onAssign,
    employee,
    selectedDate,
}) => {
    const [formData, setFormData] = useState({
        absenceType: '' as CreateEmployeeAbsenceDto['absenceType'] | '',
        startDate: '',
        endDate: '',
        hoursCount: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Set form data when dialog opens
    useEffect(() => {
        if (open && selectedDate) {
            // Convert DD.MM.YYYY to YYYY-MM-DD for input
            const [day, month, year] = selectedDate.split('.');
            const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            setFormData({
                absenceType: '',
                startDate: isoDate,
                endDate: isoDate,
                hoursCount: '',
            });
            setError('');
        }
    }, [open, selectedDate]);

    const handleAssign = async () => {
        if (!employee || !formData.absenceType || !formData.startDate || !formData.endDate) {
            setError('Bitte füllen Sie alle Pflichtfelder aus');
            return;
        }

        setIsLoading(true);
        try {
            const absenceData: CreateEmployeeAbsenceDto = {
                employeeId: employee.id,
                absenceType: formData.absenceType as CreateEmployeeAbsenceDto['absenceType'],
                startDate: formData.startDate,
                endDate: formData.endDate,
                daysCount: 1, // Wird vom Backend berechnet
                hoursCount: formData.hoursCount ? parseInt(formData.hoursCount) : undefined,
            };

            await onAssign(absenceData);
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Fehler beim Erstellen der Abwesenheit');
        } finally {
            setIsLoading(false);
        }
    };

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
                    Abwesenheit hinzufügen
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
                            {employee.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                                label={employee.role}
                                size="small"
                                color="primary"
                                sx={{
                                    height: 20,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }}
                            />
                            <Chip
                                label={employee.location}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: '0.7rem',
                                    backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
                                    color: (theme) => theme.palette.info.main,
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Datum: {selectedDate} ({(() => {
                                try {
                                    const parsedDate = parse(selectedDate, 'dd.MM.yyyy', new Date());
                                    return format(parsedDate, 'EEE', { locale: de });
                                } catch {
                                    return '';
                                }
                            })()})
                        </Typography>
                    </Box>

                    {/* Absence Type Selection */}
                    <FormControl fullWidth>
                        <InputLabel>Abwesenheitstyp</InputLabel>
                        <Select
                            value={formData.absenceType}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                absenceType: e.target.value as CreateEmployeeAbsenceDto['absenceType']
                            }))}
                            label="Abwesenheitstyp"
                        >
                            {ABSENCE_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date Selection */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Startdatum"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Enddatum"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: formData.startDate || undefined }}
                        />
                    </Box>

                    {/* Optional Hours Count */}
                    <TextField
                        fullWidth
                        label="Stunden (optional)"
                        type="number"
                        value={formData.hoursCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, hoursCount: e.target.value }))}
                        helperText="Falls Abwesenheit in Stunden gemessen werden soll"
                        inputProps={{ min: 0, step: 0.5 }}
                    />

                    {/* Selected Type Info */}
                    {formData.absenceType && (
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'warning.50', 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'warning.200'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                Abwesenheitstyp: {ABSENCE_TYPES.find(t => t.value === formData.absenceType)?.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Zeitraum: {formData.startDate} bis {formData.endDate}
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
                    disabled={isLoading || !formData.absenceType || !formData.startDate || !formData.endDate}
                    sx={{ borderRadius: 2 }}
                >
                    {isLoading ? 'Hinzufügen...' : 'Hinzufügen'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AbsenceAssignmentDialog;