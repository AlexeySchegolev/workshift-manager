import React from 'react';
import { Box, Typography } from '@mui/material';
import { ShiftOccupancy } from '@/services';

interface ShiftTooltipProps {
  shift: ShiftOccupancy;
}

const ShiftTooltip: React.FC<ShiftTooltipProps> = ({ shift }) => {
  return (
    <Box sx={{
      p: 2,
      maxWidth: 300,
      backgroundColor: '#ffffff',
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Schicht-Name */}
      <Typography variant="subtitle2" sx={{
        fontWeight: 600,
        mb: 1.5,
        color: '#1976d2',
        fontSize: '1rem'
      }}>
        {shift.shiftName}
      </Typography>
      
      {/* Zeit */}
      <Typography variant="body2" sx={{
        mb: 1.5,
        color: '#666666',
        backgroundColor: '#f5f5f5',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.875rem'
      }}>
        🕐 {shift.startTime} - {shift.endTime}
      </Typography>
      
      {/* Gesamt-Belegung */}
      <Typography variant="body2" sx={{
        mb: 2,
        fontWeight: 600,
        color: '#2e7d32',
        backgroundColor: '#e8f5e8',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.875rem'
      }}>
        👥 Gesamt: {shift.assignedCount} / {shift.requiredCount}
      </Typography>
      
      {/* Rollen-Belegung */}
      <Box>
        <Typography variant="body2" sx={{
          fontWeight: 600,
          mb: 1.5,
          color: '#424242',
          fontSize: '0.875rem'
        }}>
          📋 Belegung nach Rollen:
        </Typography>
        
        <Box sx={{
          pl: 1,
          backgroundColor: '#fafafa',
          borderRadius: 1,
          p: 1
        }}>
          {shift.roleOccupancy && shift.roleOccupancy.length > 0 ? (
            shift.roleOccupancy.map((role, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: '#555555',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{role.roleName}</span>
                <span style={{ fontWeight: 500 }}>{role.assigned} / {role.required}</span>
              </Typography>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: '#999999',
                fontSize: '0.8125rem',
                textAlign: 'center'
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