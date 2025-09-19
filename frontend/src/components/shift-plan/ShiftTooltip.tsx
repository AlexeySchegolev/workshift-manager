import React from 'react';
import { Box, Typography } from '@mui/material';
import { ShiftOccupancy } from '@/services';

interface ShiftTooltipProps {
  shift: ShiftOccupancy;
}

const ShiftTooltip: React.FC<ShiftTooltipProps> = ({ shift }) => {
  return (
    <Box sx={{ p: 1.5, maxWidth: 300 }}>
      {/* Schicht-Name */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        {shift.shiftName}
      </Typography>
      
      {/* Zeit */}
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Zeit: {shift.startTime} - {shift.endTime}
      </Typography>
      
      {/* Gesamt-Belegung */}
      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
        Gesamt: {shift.assignedCount} / {shift.requiredCount}
      </Typography>
      
      {/* Rollen-Belegung */}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Belegung nach Rollen:
        </Typography>
        
        <Box sx={{ pl: 1 }}>
          {shift.roleOccupancy && shift.roleOccupancy.length > 0 ? (
            shift.roleOccupancy.map((role, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                {role.roleName}: {role.assigned} / {role.required}
              </Typography>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                opacity: 0.7,
                color: 'text.disabled'
              }}
            >
              Keine Rollen konfiguriert
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShiftTooltip;