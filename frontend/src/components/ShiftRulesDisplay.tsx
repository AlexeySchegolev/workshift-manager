import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import { ShiftRulesConfiguration, DayType } from '../models/shiftRuleInterfaces';
import { ApiService } from '../services/ApiService';

interface ShiftRulesDisplayProps {
  configId?: string;
  showTitle?: boolean;
}

const ShiftRulesDisplay: React.FC<ShiftRulesDisplayProps> = ({
  configId,
  showTitle = true
}) => {
  const [config, setConfig] = useState<ShiftRulesConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadConfiguration();
  }, [configId]);

  const loadConfiguration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let configData: ShiftRulesConfiguration;
      if (configId) {
        configData = await ApiService.getShiftRulesConfiguration(configId);
      } else {
        configData = await ApiService.getDefaultShiftRulesConfiguration();
      }
      
      setConfig(configData);
    } catch (err) {
      console.error('Fehler beim Laden der Schichtregeln:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Schichtregeln');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!config) {
    return (
      <Alert severity="warning">
        Keine Schichtregeln-Konfiguration gefunden
      </Alert>
    );
  }

  return (
    <Box>
      {showTitle && (
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <SettingsIcon />
          {config.name}
        </Typography>
      )}

      {config.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {config.description}
        </Typography>
      )}

      {/* Globale Regeln */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Globale Schichtregeln</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Max. aufeinanderfolgende Arbeitstage
              </Typography>
              <Typography variant="h6">
                {config.globalRules.maxConsecutiveDays} Tage
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Min. Ruhezeit zwischen Schichten
              </Typography>
              <Typography variant="h6">
                {config.globalRules.minRestHoursBetweenShifts} Stunden
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Max. Überstunden
              </Typography>
              <Typography variant="h6">
                {config.globalRules.maxOvertimePercentage}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Max. Samstage pro Monat
              </Typography>
              <Typography variant="h6">
                {config.globalRules.maxSaturdaysPerMonth}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Aufeinanderfolgende Schichten
              </Typography>
              <Typography variant="h6">
                {config.globalRules.allowBackToBackShifts ? 'Erlaubt' : 'Nicht erlaubt'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Bevorzugte Schichtrotation
              </Typography>
              <Typography variant="h6">
                {config.globalRules.preferredShiftRotation === 'forward' ? 'Vorwärts (F → S)' :
                 config.globalRules.preferredShiftRotation === 'backward' ? 'Rückwärts (S → F)' :
                 'Keine Präferenz'}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Schichten */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Konfigurierte Schichten ({config.shifts.filter(s => s.isActive).length})
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
        {config.shifts
          .filter(shift => shift.isActive)
          .map((shift) => (
            <Box key={shift.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {shift.displayName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    Schichtcode: {shift.name}
                  </Typography>

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

                  {shift.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        {locationLabels[shift.location] || shift.location}
                      </Typography>
                    </Box>
                  )}

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
              </Card>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ShiftRulesDisplay;