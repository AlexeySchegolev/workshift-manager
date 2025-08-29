import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    TextField,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { shiftRuleService } from '@/services';
import { CreateShiftRulesDto, UpdateShiftRulesDto, ShiftRulesResponseDto } from '../api/data-contracts';

interface ShiftRuleManagerProps {
    onSave?: (config: ShiftRulesResponseDto) => void;
    configId?: string; // ID of the configuration to load
}

const ShiftRuleManager: React.FC<ShiftRuleManagerProps> = ({
    onSave,
    configId
}) => {
    const [config, setConfig] = useState<ShiftRulesResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load data
    useEffect(() => {
        loadData();
    }, [configId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load shift rules
            let configData: ShiftRulesResponseDto | null = null;
            if (configId) {
                configData = await shiftRuleService.getShiftRuleById(configId);
            } else {
                // Load default shift rules
                const defaultRules = await shiftRuleService.getDefaultShiftRules();
                configData = defaultRules.length > 0 ? defaultRules[0] : null;
            }

            setConfig(configData);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err instanceof Error ? err.message : 'Fehler beim Laden der Daten');
            setConfig(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRuleChange = (field: keyof ShiftRulesResponseDto, value: any) => {
        setConfig(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const handleSaveConfig = async () => {
        if (!config) return;

        setSaving(true);
        setError(null);

        try {
            if (config.id) {
                // Update existing configuration
                const updateDto: UpdateShiftRulesDto = {
                    description: config.description,
                    maxConsecutiveSameShifts: config.maxConsecutiveSameShifts,
                    maxConsecutiveWorkingDays: config.maxConsecutiveWorkingDays,
                    maxSaturdaysPerMonth: config.maxSaturdaysPerMonth,
                    minHelpers: config.minHelpers,
                    minNurseManagersPerShift: config.minNurseManagersPerShift,
                    minNursesPerShift: config.minNursesPerShift,
                    minRestHoursBetweenShifts: config.minRestHoursBetweenShifts,
                    weeklyHoursOverflowTolerance: config.weeklyHoursOverflowTolerance,
                    isActive: config.isActive
                };
                const updatedConfig = await shiftRuleService.updateShiftRule(config.id, updateDto);
                setConfig(updatedConfig);
                setSuccessMessage('Konfiguration erfolgreich aktualisiert');
            } else {
                // Create new configuration
                const createDto: CreateShiftRulesDto = {
                    description: config.description || 'Neue Schichtregeln',
                    maxConsecutiveSameShifts: config.maxConsecutiveSameShifts,
                    maxConsecutiveWorkingDays: config.maxConsecutiveWorkingDays,
                    maxSaturdaysPerMonth: config.maxSaturdaysPerMonth,
                    minHelpers: config.minHelpers,
                    minNurseManagersPerShift: config.minNurseManagersPerShift,
                    minNursesPerShift: config.minNursesPerShift,
                    minRestHoursBetweenShifts: config.minRestHoursBetweenShifts,
                    weeklyHoursOverflowTolerance: config.weeklyHoursOverflowTolerance,
                    isActive: true
                };
                const newConfig = await shiftRuleService.createShiftRule(createDto);
                setConfig(newConfig);
                setSuccessMessage('Konfiguration erfolgreich erstellt');
            }

            if (onSave && config) {
                onSave(config);
            }
        } catch (err) {
            console.error('Error saving:', err);
            setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Konfiguration');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!config) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Fehler beim Laden der Schichtregeln-Konfiguration
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon />
                    Schichtregeln Konfiguration
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                        disabled={loading}
                    >
                        Neu laden
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveConfig}
                        disabled={saving}
                    >
                        {saving ? 'Speichern...' : 'Konfiguration Speichern'}
                    </Button>
                </Box>
            </Box>

            {/* Error and success messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            )}

            {/* Global rules */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Globale Schichtregeln</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            value={config.description || ''}
                            onChange={(e) => handleRuleChange('description', e.target.value)}
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Min. Krankenpfleger pro Schicht"
                            type="number"
                            value={config.minNursesPerShift}
                            onChange={(e) => handleRuleChange('minNursesPerShift', parseInt(e.target.value))}
                            inputProps={{ min: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Min. Stationsleitung pro Schicht"
                            type="number"
                            value={config.minNurseManagersPerShift}
                            onChange={(e) => handleRuleChange('minNurseManagersPerShift', parseInt(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            fullWidth
                            label="Min. Helfer"
                            type="number"
                            value={config.minHelpers}
                            onChange={(e) => handleRuleChange('minHelpers', parseInt(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            fullWidth
                            label="Max. aufeinanderfolgende Arbeitstage"
                            type="number"
                            value={config.maxConsecutiveWorkingDays}
                            onChange={(e) => handleRuleChange('maxConsecutiveWorkingDays', parseInt(e.target.value))}
                            inputProps={{ min: 1, max: 14 }}
                        />
                        <TextField
                            fullWidth
                            label="Max. aufeinanderfolgende gleiche Schichten"
                            type="number"
                            value={config.maxConsecutiveSameShifts}
                            onChange={(e) => handleRuleChange('maxConsecutiveSameShifts', parseInt(e.target.value))}
                            inputProps={{ min: 1, max: 10 }}
                        />
                        <TextField
                            fullWidth
                            label="Min. Ruhezeit zwischen Schichten (Stunden)"
                            type="number"
                            value={config.minRestHoursBetweenShifts}
                            onChange={(e) => handleRuleChange('minRestHoursBetweenShifts', parseInt(e.target.value))}
                            inputProps={{ min: 8, max: 24 }}
                        />
                        <TextField
                            fullWidth
                            label="Max. Samstage pro Monat"
                            type="number"
                            value={config.maxSaturdaysPerMonth}
                            onChange={(e) => handleRuleChange('maxSaturdaysPerMonth', parseInt(e.target.value))}
                            inputProps={{ min: 0, max: 5 }}
                        />
                        <TextField
                            fullWidth
                            label="Wöchentliche Stunden Überlauftoleranz"
                            type="number"
                            value={config.weeklyHoursOverflowTolerance}
                            onChange={(e) => handleRuleChange('weeklyHoursOverflowTolerance', parseInt(e.target.value))}
                            inputProps={{ min: 0, max: 20 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={config.isActive}
                                    onChange={(e) => handleRuleChange('isActive', e.target.checked)}
                                />
                            }
                            label="Regel aktiv"
                        />
                    </Box>

                    {/* Additional information */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Erstellt:</strong> {new Date(config.createdAt).toLocaleString('de-DE')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Zuletzt geändert:</strong> {new Date(config.updatedAt).toLocaleString('de-DE')}
                        </Typography>
                        {config.createdBy && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Erstellt von:</strong> {config.createdBy}
                            </Typography>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ShiftRuleManager;