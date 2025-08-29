import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Chip,
    Box,
    Typography,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Close as CloseIcon,
    Schedule as ScheduleIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { ShiftFormData, ShiftFormErrors } from './hooks/useShiftForm';
import { formatShiftType, formatShiftStatus, formatShiftPriority } from './utils/shiftUtils';

interface ShiftFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: ShiftFormData;
    errors: ShiftFormErrors;
    onUpdateField: (field: keyof ShiftFormData, value: any) => void;
    isEditing: boolean;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
    open,
    onClose,
    onSave,
    formData,
    errors,
    onUpdateField,
    isEditing,
}) => {
    const [skillInput, setSkillInput] = useState('');
    const [certificationInput, setCertificationInput] = useState('');

    // Mock data for locations - in real app, this would come from API
    const locations = [
        { id: '1', name: 'Dialyse Station A', code: 'DSA' },
        { id: '2', name: 'Dialyse Station B', code: 'DSB' },
    ];

    const shiftTypes = [
        { value: 'morning', label: 'Frühschicht' },
        { value: 'afternoon', label: 'Spätschicht' },
        { value: 'evening', label: 'Abendschicht' },
        { value: 'night', label: 'Nachtschicht' },
        { value: 'full_day', label: 'Ganztag' },
        { value: 'split', label: 'Geteilte Schicht' },
        { value: 'on_call', label: 'Bereitschaft' },
        { value: 'overtime', label: 'Überstunden' },
    ];

    const shiftStatuses = [
        { value: 'draft', label: 'Entwurf' },
        { value: 'published', label: 'Veröffentlicht' },
        { value: 'active', label: 'Aktiv' },
        { value: 'completed', label: 'Abgeschlossen' },
        { value: 'cancelled', label: 'Abgesagt' },
    ];

    const priorities = [
        { value: 1, label: 'Niedrig' },
        { value: 2, label: 'Normal' },
        { value: 3, label: 'Hoch' },
        { value: 4, label: 'Kritisch' },
        { value: 5, label: 'Notfall' },
    ];

    const recurrencePatterns = [
        { value: 'daily', label: 'Täglich' },
        { value: 'weekly', label: 'Wöchentlich' },
        { value: 'monthly', label: 'Monatlich' },
    ];

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            onUpdateField('requiredSkills', [...formData.requiredSkills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        onUpdateField('requiredSkills', formData.requiredSkills.filter(s => s !== skill));
    };

    const handleAddCertification = () => {
        if (certificationInput.trim() && !formData.requiredCertifications.includes(certificationInput.trim())) {
            onUpdateField('requiredCertifications', [...formData.requiredCertifications, certificationInput.trim()]);
            setCertificationInput('');
        }
    };

    const handleRemoveCertification = (certification: string) => {
        onUpdateField('requiredCertifications', formData.requiredCertifications.filter(c => c !== certification));
    };

    const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            action();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="h6">
                        {isEditing ? 'Schicht bearbeiten' : 'Neue Schicht erstellen'}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Grundinformationen
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            label="Schichtname"
                            value={formData.name}
                            onChange={(e) => onUpdateField('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.type}>
                            <InputLabel>Schichttyp</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={(e) => onUpdateField('type', e.target.value)}
                                label="Schichttyp"
                            >
                                {shiftTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            value={formData.description}
                            onChange={(e) => onUpdateField('description', e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => onUpdateField('status', e.target.value)}
                                label="Status"
                            >
                                {shiftStatuses.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Priorität</InputLabel>
                            <Select
                                value={formData.priority}
                                onChange={(e) => onUpdateField('priority', e.target.value)}
                                label="Priorität"
                            >
                                {priorities.map((priority) => (
                                    <MenuItem key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors.locationId}>
                            <InputLabel>Station</InputLabel>
                            <Select
                                value={formData.locationId}
                                onChange={(e) => onUpdateField('locationId', e.target.value)}
                                label="Station"
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name} ({location.code})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Time and Duration */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Zeit und Dauer
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Datum"
                            type="date"
                            value={formData.shiftDate}
                            onChange={(e) => onUpdateField('shiftDate', e.target.value)}
                            error={!!errors.shiftDate}
                            helperText={errors.shiftDate}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Startzeit"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => onUpdateField('startTime', e.target.value)}
                            error={!!errors.startTime}
                            helperText={errors.startTime}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Endzeit"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => onUpdateField('endTime', e.target.value)}
                            error={!!errors.endTime}
                            helperText={errors.endTime}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Pausenzeit (Minuten)"
                            type="number"
                            value={formData.breakDuration}
                            onChange={(e) => onUpdateField('breakDuration', parseInt(e.target.value) || 0)}
                            inputProps={{ min: 0, max: 480 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Gesamtstunden"
                            type="number"
                            value={formData.totalHours}
                            onChange={(e) => onUpdateField('totalHours', parseFloat(e.target.value) || 0)}
                            error={!!errors.totalHours}
                            helperText={errors.totalHours}
                            inputProps={{ min: 0, max: 24, step: 0.5 }}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    {/* Staffing */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Personalbesetzung
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Mindestanzahl Mitarbeiter"
                            type="number"
                            value={formData.minEmployees}
                            onChange={(e) => onUpdateField('minEmployees', parseInt(e.target.value) || 1)}
                            error={!!errors.minEmployees}
                            helperText={errors.minEmployees}
                            inputProps={{ min: 1, max: 20 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Maximalanzahl Mitarbeiter"
                            type="number"
                            value={formData.maxEmployees}
                            onChange={(e) => onUpdateField('maxEmployees', parseInt(e.target.value) || 1)}
                            error={!!errors.maxEmployees}
                            helperText={errors.maxEmployees}
                            inputProps={{ min: 1, max: 20 }}
                            required
                        />
                    </Grid>

                    {/* Additional Options */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Zusätzliche Optionen
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Farbcode"
                            type="color"
                            value={formData.colorCode}
                            onChange={(e) => onUpdateField('colorCode', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isOvertime}
                                        onChange={(e) => onUpdateField('isOvertime', e.target.checked)}
                                    />
                                }
                                label="Überstunden"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isWeekend}
                                        onChange={(e) => onUpdateField('isWeekend', e.target.checked)}
                                    />
                                }
                                label="Wochenende"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isHoliday}
                                        onChange={(e) => onUpdateField('isHoliday', e.target.checked)}
                                    />
                                }
                                label="Feiertag"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notizen"
                            value={formData.notes}
                            onChange={(e) => onUpdateField('notes', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* Recurring Options */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isRecurring}
                                    onChange={(e) => onUpdateField('isRecurring', e.target.checked)}
                                />
                            }
                            label="Wiederkehrende Schicht"
                        />
                    </Grid>

                    {formData.isRecurring && (
                        <>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Wiederholungsmuster</InputLabel>
                                    <Select
                                        value={formData.recurrencePattern || ''}
                                        onChange={(e) => onUpdateField('recurrencePattern', e.target.value)}
                                        label="Wiederholungsmuster"
                                    >
                                        {recurrencePatterns.map((pattern) => (
                                            <MenuItem key={pattern.value} value={pattern.value}>
                                                {pattern.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Enddatum der Wiederholung"
                                    type="date"
                                    value={formData.recurrenceEndDate || ''}
                                    onChange={(e) => onUpdateField('recurrenceEndDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Abbrechen
                </Button>
                <Button onClick={onSave} variant="contained">
                    {isEditing ? 'Aktualisieren' : 'Erstellen'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShiftForm;