import React from 'react';
import { Chip, Tooltip, alpha, useTheme } from '@mui/material';
import { ShiftOccupancy } from '@/services';
import ShiftTooltip from './ShiftTooltip';

interface ShiftChipProps {
  shift: ShiftOccupancy;
}

const ShiftChip: React.FC<ShiftChipProps> = ({ shift }) => {
  const theme = useTheme();

  // Bestimme Farbe basierend auf Belegung
  const getOccupancyColor = () => {
    if (shift.isCorrectlyStaffed) {
      return {
        bg: alpha(theme.palette.success.main, 0.15),
        color: theme.palette.success.main,
        border: alpha(theme.palette.success.main, 0.3)
      };
    } else if (shift.isUnderStaffed) {
      return {
        bg: alpha(theme.palette.error.main, 0.15),
        color: theme.palette.error.main,
        border: alpha(theme.palette.error.main, 0.3)
      };
    } else {
      // Überbesetzt
      return {
        bg: alpha(theme.palette.warning.main, 0.15),
        color: theme.palette.warning.main,
        border: alpha(theme.palette.warning.main, 0.3)
      };
    }
  };

  const colors = getOccupancyColor();

  return (
    <Tooltip
      title={<ShiftTooltip shift={shift} />}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: 'none',
            padding: 0,
            maxWidth: 'none'
          }
        },
        arrow: {
          sx: {
            color: '#ffffff'
          }
        }
      }}
    >
      <Chip
        label={shift.shortName}
        size="small"
        sx={{
          height: 16,
          fontSize: '0.6rem',
          fontWeight: 600,
          backgroundColor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          '& .MuiChip-label': {
            padding: '0 4px',
          },
        }}
      />
    </Tooltip>
  );
};

export default ShiftChip;