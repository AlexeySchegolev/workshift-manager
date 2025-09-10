import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Alert,
    Stack,
} from '@mui/material';
import { differenceInDays, format, parseISO, addDays } from 'date-fns';
import { EmployeeResponseDto, CreateEmployeeAbsenceDto } from '@/api/data-contracts';

interface AbsenceDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (absenceData: CreateEmployeeAbsenceDto) => Promise<void>;
    employees: EmployeeResponseDto[];
}

// Absence type options with German labels
const ABSENCE_TYPES = [
    { value: 'vacation', label: 'Urlaub' },
    { value: 'sick_leave', label: 'Krankheit' },
    { value: 'personal_leave', label: 'Persönlich' },
    { value: 'maternity_leave', label: 'Mutterschutz' },
    { value: 'paternity_leave', label: 'Vaterzeit' },
    { value: 'unpaid_leave', label: 'Unbezahlt' },
    { value: 'training', label: 'Schulung' },
    { value: 'conference', label: 'Konferenz' },
    { value: 'bereavement', label: 'Trauerfall' },
    { value: 'jury_duty', label: 'Geschworene' },
    { value: 'military_leave', label: 'Militärdienst' },
    { value: 'other', label: 'Sonstiges' },
] as const;

const AbsenceDialog: React.FC<AbsenceDialogProps> = ({
    open,
    onClose,
    onSave,
    employees,
}) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        absenceType: '' as CreateEmployeeAbsenceDto['absenceType'] | '',
        startDate: '',
        endDate: '',
        hoursCount: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Calculate days count automatically
    const daysCount = formData.startDate && formData.endDate 
        ? Math.max(1, differenceInDays(parseISO(formData.endDate), parseISO(formData.startDate)) + 1)
        : 1;

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            // Set default dates: today and tomorrow
            const today = new Date();
            const tomorrow = addDays(today, 1);
            
            setFormData({
                employeeId: '',
                absenceType: '',
                startDate: format(today, 'yyyy-MM-dd'),
                endDate: format(tomorrow, 'yyyy-MM-dd'),
                hoursCount: '',
            });
            setErrors({});
        } else {
            setFormData({
                employeeId: '',
                absenceType: '',
                startDate: '',
                endDate: '',
                hoursCount: '',
            });
            setErrors({});
        }
    }, [open]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.employeeId) {
            newErrors.employeeId = 'Bitte wählen Sie einen Mitarbeiter aus';
        }

        if (!formData.absenceType) {
            newErrors.absenceType = 'Bitte wählen Sie einen Abwesenheitstyp aus';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Bitte geben Sie ein Startdatum an';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Bitte geben Sie ein Enddatum an';
        }

        if (formData.startDate && formData.endDate && parseISO(formData.startDate) > parseISO(formData.endDate)) {
            newErrors.endDate = 'Das Enddatum muss nach dem Startdatum liegen';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const absenceData: CreateEmployeeAbsenceDto = {
                employeeId: formData.employeeId,
                absenceType: formData.absenceType as CreateEmployeeAbsenceDto['absenceType'],
                startDate: formData.startDate,
                endDate: formData.endDate,
                daysCount,
                hoursCount: formData.hoursCount ? parseInt(formData.hoursCount) : undefined,
            };

            await onSave(absenceData);
            onClose();
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Fehler beim Speichern der Abwesenheit'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

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
                        Neue Abwesenheit hinzufügen
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {errors.submit && (
                            <Alert severity="error" onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}>
                                {errors.submit}
                            </Alert>
                        )}

                        {/* Employee Selection */}
                        <FormControl fullWidth error={!!errors.employeeId}>
                            <InputLabel>Mitarbeiter</InputLabel>
                            <Select
                                value={formData.employeeId}
                                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                                label="Mitarbeiter"
                            >
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>
                                        {employee.firstName} {employee.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.employeeId && (
                                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                    {errors.employeeId}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Absence Type Selection */}
                        <FormControl fullWidth error={!!errors.absenceType}>
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
                            {errors.absenceType && (
                                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                    {errors.absenceType}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Date Selection */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Startdatum"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                label="Enddatum"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: formData.startDate || undefined }}
                            />
                        </Box>

                        {/* Days Count Display */}
                        {formData.startDate && formData.endDate && (
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'primary.50', 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'primary.200'
                            }}>
                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                    Berechnete Abwesenheitsdauer: {daysCount} Tag{daysCount !== 1 ? 'e' : ''}
                                </Typography>
                                {selectedEmployee && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Mitarbeiter: {selectedEmployee.firstName} {selectedEmployee.lastName}
                                    </Typography>
                                )}
                            </Box>
                        )}

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
                        onClick={handleSave} 
                        variant="contained" 
                        disabled={isLoading}
                        sx={{ borderRadius: 2 }}
                    >
                        {isLoading ? 'Speichern...' : 'Speichern'}
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

export default AbsenceDialog;