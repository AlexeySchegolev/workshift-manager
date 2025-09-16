import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format, isSameDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';

export interface WeekDay {
  datum: Date;
  schichten: {
    [schichtName: string]: number; // Number of employees in this shift
  };
  istFeiertag?: boolean;
  istWochenende?: boolean;
}

export interface ShiftWeekdayAssignmentProps {
  woche: WeekDay[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onWeekChange?: (direction: 'prev' | 'next') => void;
  title?: string;
}

/**
 * Shift Weekday Assignment Component for Configuration
 */
const ShiftWeekdayAssignment: React.FC<ShiftWeekdayAssignmentProps> = ({
  woche,
  selectedDate,
  onDateSelect,
  onWeekChange,
  title = 'Schichtzuordnung zu Wochentagen',
}) => {
  const theme = useTheme();

  const getShiftColor = (schichtName: string): string => {
      return theme.palette.shifts?.early;
  };

  const getShiftBackground = (schichtName: string): string => {
    return alpha(theme.palette.grey[500], 0.1);
  };

  const formatWeekday = (datum: Date): string => {
    return format(datum, 'EEE', { locale: de });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        subheader=""
        action={
          onWeekChange && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Vorherige Woche">
                <IconButton
                  size="small"
                  onClick={() => onWeekChange('prev')}
                  sx={{ color: 'text.secondary' }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Nächste Woche">
                <IconButton
                  size="small"
                  onClick={() => onWeekChange('next')}
                  sx={{ color: 'text.secondary' }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
          {woche.map((day, index) => {
            const isTodayLocal = isToday(day.datum);
            const isSelected = selectedDate && isSameDay(day.datum, selectedDate);
            const isWeekend = day.istWochenende || day.datum.getDay() === 0 || day.datum.getDay() === 6;

            return (
              <Box key={index} sx={{ flex: '1 1 0', minWidth: 80 }}>
                <Box
                  onClick={() => onDateSelect && onDateSelect(day.datum)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: onDateSelect ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: isSelected 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : isTodayLocal
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent',
                    border: isTodayLocal
                      ? `2px solid ${theme.palette.primary.main}`
                      : isSelected
                        ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}`
                        : '2px solid transparent',
                    '&:hover': onDateSelect ? {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateY(-1px)',
                    } : {},
                  }}
                >
                  {/* Weekday */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 600,
                      color: isWeekend ? 'error.main' : 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {formatWeekday(day.datum)}
                  </Typography>

                  {/* Shifts */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {Object.entries(day.schichten).map(([schichtName, anzahl]) => (
                      <Chip
                        key={schichtName}
                        label={`${schichtName}: ${anzahl}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: getShiftBackground(schichtName),
                          color: getShiftColor(schichtName),
                          border: `1px solid ${alpha(getShiftColor(schichtName), 0.3)}`,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    ))}

                    {Object.keys(day.schichten).length === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.disabled',
                          fontStyle: 'italic',
                        }}
                      >
                        Keine Schichten
                      </Typography>
                    )}
                  </Box>

                  {/* Holiday indicator */}
                  {day.istFeiertag && (
                    <Box
                      sx={{
                        mt: 0.5,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'error.main',
                        mx: 'auto',
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

       
      </CardContent>
    </Card>
  );
};

export default ShiftWeekdayAssignment;