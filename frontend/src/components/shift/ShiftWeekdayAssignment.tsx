import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { ShiftWeekdaysService } from '@/services/ShiftWeekdaysService';

interface ShiftWeekdayAssignmentProps {
    shiftId: string;
    locationId: string;
    disabled?: boolean;
}

const WEEKDAYS = [
    { value: 1, label: 'Montag', short: 'Mo' },
    { value: 2, label: 'Dienstag', short: 'Di' },
    { value: 3, label: 'Mittwoch', short: 'Mi' },
    { value: 4, label: 'Donnerstag', short: 'Do' },
    { value: 5, label: 'Freitag', short: 'Fr' },
    { value: 6, label: 'Samstag', short: 'Sa' },
    { value: 0, label: 'Sonntag', short: 'So' },
];

const ShiftWeekdayAssignment: React.FC<ShiftWeekdayAssignmentProps> = ({
    shiftId,
    locationId,
    disabled = false,
}) => {
    const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const shiftWeekdaysService = new ShiftWeekdaysService();

    // Lade bestehende Wochentag-Zuordnungen
    useEffect(() => {
        if (!shiftId || !locationId) return;

        const loadWeekdays = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const weekdays = await shiftWeekdaysService.getShiftWeekdaysByLocationId(locationId);
                const shiftWeekdays = weekdays
                    .filter(sw => sw.shiftId === shiftId)
                    .map(sw => sw.weekday);
                
                setSelectedWeekdays(shiftWeekdays);
            } catch (err) {
                console.error('Fehler beim Laden der Wochentage:', err);
                setError('Fehler beim Laden der Wochentag-Zuordnungen');
            } finally {
                setLoading(false);
            }
        };

        loadWeekdays();
    }, [shiftId, locationId]);

    // Handle weekday toggle
    const handleWeekdayToggle = async (weekday: number) => {
        if (disabled || saving) return;

        setSaving(true);
        setError(null);

        try {
            const isCurrentlySelected = selectedWeekdays.includes(weekday);
            
            if (isCurrentlySelected) {
                // Entferne Wochentag
                const weekdayAssignments = await shiftWeekdaysService.getShiftWeekdaysByLocationId(locationId);
                const assignmentToDelete = weekdayAssignments.find(
                    sw => sw.shiftId === shiftId && sw.weekday === weekday
                );
                
                if (assignmentToDelete) {
                    await shiftWeekdaysService.deleteShiftWeekday(assignmentToDelete.id);
                }
                
                setSelectedWeekdays(prev => prev.filter(w => w !== weekday));
            } else {
                // Füge Wochentag hinzu
                await shiftWeekdaysService.createShiftWeekday({
                    shiftId,
                    weekday,
                });
                
                setSelectedWeekdays(prev => [...prev, weekday]);
            }
        } catch (err) {
            console.error('Fehler beim Aktualisieren der Wochentage:', err);
            setError('Fehler beim Speichern der Wochentag-Zuordnung');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                    Lade Wochentag-Zuordnungen...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Wochentage
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Wählen Sie die Wochentage aus, an denen diese Schicht verfügbar sein soll:
                </Typography>
                
                <FormGroup row>
                    {WEEKDAYS.map((weekday) => (
                        <FormControlLabel
                            key={weekday.value}
                            control={
                                <Checkbox
                                    checked={selectedWeekdays.includes(weekday.value)}
                                    onChange={() => handleWeekdayToggle(weekday.value)}
                                    disabled={disabled || saving}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {weekday.short}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {weekday.label}
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                mx: 1,
                                '& .MuiFormControlLabel-label': {
                                    textAlign: 'center',
                                },
                            }}
                        />
                    ))}
                </FormGroup>

                {selectedWeekdays.length === 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Diese Schicht ist für keinen Wochentag konfiguriert und wird nicht in Schichtplänen angezeigt.
                    </Alert>
                )}

                {saving && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                            Speichere...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ShiftWeekdayAssignment;