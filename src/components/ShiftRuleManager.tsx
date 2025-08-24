import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import {
  ConfigurableShiftRule,
  ShiftRoleRequirement,
  DayType,
  ShiftRulesConfiguration,
  DEFAULT_SHIFT_RULES_CONFIG,
  GlobalShiftRules
} from '../models/shiftRuleInterfaces';
import { DEFAULT_ROLES } from '../models/interfaces';

interface ShiftRuleManagerProps {
  onSave?: (config: ShiftRulesConfiguration) => void;
  initialConfig?: ShiftRulesConfiguration;
}

const ShiftRuleManager: React.FC<ShiftRuleManagerProps> = ({
  onSave,
  initialConfig = DEFAULT_SHIFT_RULES_CONFIG
}) => {
  const [config, setConfig] = useState<ShiftRulesConfiguration>(initialConfig);
  const [editingShift, setEditingShift] = useState<ConfigurableShiftRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewShift, setIsNewShift] = useState(false);

  const dayTypeLabels: Record<DayType, string> = {
    longDay: 'Lange Tage (Mo, Mi, Fr)',
    shortDay: 'Kurze Tage (Di, Do)',
    saturday: 'Samstag',
    sunday: 'Sonntag',
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag'
  };

  const locationLabels = {
    Elmshorn: 'Elmshorn',
    Uetersen: 'Uetersen',
    Both: 'Beide Standorte'
  };

  const createEmptyShift = (): ConfigurableShiftRule => ({
    id: `shift-${Date.now()}`,
    name: '',
    displayName: '',
    startTime: '06:00',
    endTime: '14:00',
    requiredRoles: [],
    dayTypes: ['longDay'],
    location: 'Elmshorn',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleAddShift = () => {
    setEditingShift(createEmptyShift());
    setIsNewShift(true);
    setIsDialogOpen(true);
  };

  const handleEditShift = (shift: ConfigurableShiftRule) => {
    setEditingShift({ ...shift });
    setIsNewShift(false);
    setIsDialogOpen(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    setConfig(prev => ({
      ...prev,
      shifts: prev.shifts.filter(s => s.id !== shiftId),
      updatedAt: new Date()
    }));
  };

  const handleSaveShift = () => {
    if (!editingShift) return;

    const updatedShift = {
      ...editingShift,
      updatedAt: new Date()
    };

    setConfig(prev => {
      const newShifts = isNewShift
        ? [...prev.shifts, updatedShift]
        : prev.shifts.map(s => s.id === updatedShift.id ? updatedShift : s);

      return {
        ...prev,
        shifts: newShifts,
        updatedAt: new Date()
      };
    });

    setIsDialogOpen(false);
    setEditingShift(null);
  };

  const handleAddRole = () => {
    if (!editingShift) return;

    const newRole: ShiftRoleRequirement = {
      roleId: 'pfleger',
      roleName: 'Pfleger',
      minCount: 1,
      maxCount: 1,
      priority: editingShift.requiredRoles.length + 1
    };

    setEditingShift(prev => prev ? {
      ...prev,
      requiredRoles: [...prev.requiredRoles, newRole]
    } : null);
  };

  const handleRemoveRole = (index: number) => {
    if (!editingShift) return;

    setEditingShift(prev => prev ? {
      ...prev,
      requiredRoles: prev.requiredRoles.filter((_, i) => i !== index)
    } : null);
  };

  const handleRoleChange = (index: number, field: keyof ShiftRoleRequirement, value: any) => {
    if (!editingShift) return;

    setEditingShift(prev => prev ? {
      ...prev,
      requiredRoles: prev.requiredRoles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    } : null);
  };

  const handleGlobalRulesChange = (field: keyof GlobalShiftRules, value: any) => {
    setConfig(prev => ({
      ...prev,
      globalRules: {
        ...prev.globalRules,
        [field]: value
      },
      updatedAt: new Date()
    }));
  };

  const handleSaveConfig = () => {
    if (onSave) {
      onSave(config);
    }
  };

  const calculateShiftDuration = (start: string, end: string): string => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (duration < 0) duration += 24 * 60; // Handle overnight shifts
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}min` : ''}`;
  };

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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddShift}
          >
            Neue Schicht
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfig}
          >
            Konfiguration Speichern
          </Button>
        </Box>
      </Box>

      {/* Globale Regeln */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Globale Schichtregeln</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <TextField
              fullWidth
              label="Max. aufeinanderfolgende Arbeitstage"
              type="number"
              value={config.globalRules.maxConsecutiveDays}
              onChange={(e) => handleGlobalRulesChange('maxConsecutiveDays', parseInt(e.target.value))}
            />
            <TextField
              fullWidth
              label="Min. Ruhezeit zwischen Schichten (Stunden)"
              type="number"
              value={config.globalRules.minRestHoursBetweenShifts}
              onChange={(e) => handleGlobalRulesChange('minRestHoursBetweenShifts', parseInt(e.target.value))}
            />
            <TextField
              fullWidth
              label="Max. Überstunden (%)"
              type="number"
              value={config.globalRules.maxOvertimePercentage}
              onChange={(e) => handleGlobalRulesChange('maxOvertimePercentage', parseInt(e.target.value))}
            />
            <TextField
              fullWidth
              label="Max. Samstage pro Monat"
              type="number"
              value={config.globalRules.maxSaturdaysPerMonth}
              onChange={(e) => handleGlobalRulesChange('maxSaturdaysPerMonth', parseInt(e.target.value))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.globalRules.allowBackToBackShifts}
                  onChange={(e) => handleGlobalRulesChange('allowBackToBackShifts', e.target.checked)}
                />
              }
              label="Aufeinanderfolgende Schichten erlauben"
            />
            <FormControl fullWidth>
              <InputLabel>Bevorzugte Schichtrotation</InputLabel>
              <Select
                value={config.globalRules.preferredShiftRotation}
                onChange={(e) => handleGlobalRulesChange('preferredShiftRotation', e.target.value)}
              >
                <MenuItem value="forward">Vorwärts (F → S)</MenuItem>
                <MenuItem value="backward">Rückwärts (S → F)</MenuItem>
                <MenuItem value="none">Keine Präferenz</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Schichten Liste */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Konfigurierte Schichten ({config.shifts.length})
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
        {config.shifts.map((shift) => (
          <Card key={shift.id} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" component="div">
                    {shift.displayName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Schichtcode: {shift.name}
                  </Typography>
                </Box>
                <Switch
                  checked={shift.isActive}
                  onChange={(e) => {
                    setConfig(prev => ({
                      ...prev,
                      shifts: prev.shifts.map(s => 
                        s.id === shift.id ? { ...s, isActive: e.target.checked } : s
                      )
                    }));
                  }}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimeIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {shift.startTime} - {shift.endTime}
                </Typography>
                <Chip 
                  label={calculateShiftDuration(shift.startTime, shift.endTime)}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {locationLabels[shift.location || 'Elmshorn']}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ScheduleIcon fontSize="small" color="primary" />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {shift.dayTypes.map((dayType) => (
                    <Chip
                      key={dayType}
                      label={dayTypeLabels[dayType]}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rollenanforderungen:
              </Typography>
              {shift.requiredRoles.map((role, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <GroupIcon fontSize="small" />
                  <Typography variant="body2">
                    {role.roleName}: {role.minCount}
                    {role.maxCount && role.maxCount !== role.minCount && ` - ${role.maxCount}`}
                  </Typography>
                </Box>
              ))}
            </CardContent>

            <CardActions>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEditShift(shift)}
              >
                Bearbeiten
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteShift(shift.id)}
              >
                Löschen
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Schicht bearbeiten Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isNewShift ? 'Neue Schicht erstellen' : 'Schicht bearbeiten'}
        </DialogTitle>
        <DialogContent>
          {editingShift && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Anzeigename"
                  value={editingShift.displayName}
                  onChange={(e) => setEditingShift(prev => prev ? { ...prev, displayName: e.target.value } : null)}
                />
                <TextField
                  fullWidth
                  label="Schichtcode (für Planung)"
                  value={editingShift.name}
                  onChange={(e) => setEditingShift(prev => prev ? { ...prev, name: e.target.value } : null)}
                  helperText="Kurzer Code wie 'F', 'S', '4', '5', '6'"
                />
                <TextField
                  fullWidth
                  label="Startzeit"
                  type="time"
                  value={editingShift.startTime}
                  onChange={(e) => setEditingShift(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Endzeit"
                  type="time"
                  value={editingShift.endTime}
                  onChange={(e) => setEditingShift(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Standort</InputLabel>
                  <Select
                    value={editingShift.location || 'Elmshorn'}
                    onChange={(e) => setEditingShift(prev => prev ? { ...prev, location: e.target.value as any } : null)}
                  >
                    <MenuItem value="Elmshorn">Elmshorn</MenuItem>
                    <MenuItem value="Uetersen">Uetersen</MenuItem>
                    <MenuItem value="Both">Beide Standorte</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Tag-Typen</InputLabel>
                  <Select
                    multiple
                    value={editingShift.dayTypes}
                    onChange={(e) => setEditingShift(prev => prev ? { ...prev, dayTypes: e.target.value as DayType[] } : null)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={dayTypeLabels[value]} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.entries(dayTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Rollenanforderungen
              </Typography>

              {editingShift.requiredRoles.map((role, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 2, alignItems: 'center' }}>
                    <FormControl fullWidth>
                      <InputLabel>Rolle</InputLabel>
                      <Select
                        value={role.roleId}
                        onChange={(e) => {
                          const selectedRole = DEFAULT_ROLES.find(r => r.id === e.target.value);
                          handleRoleChange(index, 'roleId', e.target.value);
                          handleRoleChange(index, 'roleName', selectedRole?.name || '');
                        }}
                      >
                        {DEFAULT_ROLES.map((r) => (
                          <MenuItem key={r.id} value={r.id}>
                            {r.displayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Min. Anzahl"
                      type="number"
                      value={role.minCount}
                      onChange={(e) => handleRoleChange(index, 'minCount', parseInt(e.target.value))}
                    />
                    <TextField
                      fullWidth
                      label="Max. Anzahl"
                      type="number"
                      value={role.maxCount || ''}
                      onChange={(e) => handleRoleChange(index, 'maxCount', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <TextField
                      fullWidth
                      label="Priorität"
                      type="number"
                      value={role.priority}
                      onChange={(e) => handleRoleChange(index, 'priority', parseInt(e.target.value))}
                    />
                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveRole(index)}
                    >
                      Entfernen
                    </Button>
                  </Box>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddRole}
                sx={{ mb: 2 }}
              >
                Rolle hinzufügen
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} startIcon={<CancelIcon />}>
            Abbrechen
          </Button>
          <Button onClick={handleSaveShift} variant="contained" startIcon={<SaveIcon />}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftRuleManager;