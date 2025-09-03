import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Divider,
    IconButton,
    Grid,
} from '@mui/material';
import {
    Close as CloseIcon,
    Schedule as ScheduleIcon,

} from '@mui/icons-material';
import { ShiftFormData, ShiftFormErrors } from './hooks/useShiftForm';
import { useLocations } from '@/hooks/useLocations';
import { 
    SHIFT_TYPES 
} from '@/constants/shiftConstants';

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
    // Fetch locations from API
    const { locations, loading: locationsLoading} = useLocations();
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
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Grundinformationen
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
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

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth error={!!errors.type}>
                            <InputLabel>Schichttyp</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={(e) => onUpdateField('type', e.target.value)}
                                label="Schichttyp"
                            >
                                {SHIFT_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            value={formData.description}
                            onChange={(e) => onUpdateField('description', e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth error={!!errors.locationId}>
                            <InputLabel>Station</InputLabel>
                            <Select
                                value={formData.locationId}
                                onChange={(e) => onUpdateField('locationId', e.target.value)}
                                label="Station"
                                disabled={locationsLoading}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name}{location.code ? ` (${location.code})` : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Time and Duration */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Zeit und Dauer
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
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

                    <Grid size={{ xs: 12, md: 4 }}>
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

                    <Grid size={{ xs: 12, md: 4 }}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Pausenzeit (Minuten)"
                            type="number"
                            value={formData.breakDuration}
                            onChange={(e) => onUpdateField('breakDuration', parseInt(e.target.value) || 0)}
                            inputProps={{ min: 0, max: 480 }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Personalbesetzung
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Zusätzliche Optionen
                        </Typography>
                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>
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