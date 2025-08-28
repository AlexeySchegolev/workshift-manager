import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Grid,
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

export interface WochenTag {
  datum: Date;
  schichten: {
    [schichtName: string]: number; // Anzahl Mitarbeiter in dieser Schicht
  };
  istFeiertag?: boolean;
  istWochenende?: boolean;
}

export interface WochenUebersichtProps {
  woche: WochenTag[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onWeekChange?: (direction: 'prev' | 'next') => void;
  title?: string;
}

/**
 * Kompakte Wochenübersicht für das Dashboard
 */
const WochenUebersicht: React.FC<WochenUebersichtProps> = ({
  woche,
  selectedDate,
  onDateSelect,
  onWeekChange,
  title = 'Aktuelle Woche',
}) => {
  const theme = useTheme();

  const getSchichtColor = (schichtName: string): string => {
    switch (schichtName.toUpperCase()) {
      case 'F':
        return theme.palette.shifts?.early || theme.palette.success.main;
      case 'S':
      case 'S0':
      case 'S1':
      case 'S00':
        return theme.palette.shifts?.late || theme.palette.warning.main;
      case 'FS':
        return theme.palette.shifts?.special || theme.palette.info.main;
      case '4':
      case '5':
      case '6':
        return theme.palette.shifts?.uetersen || theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getSchichtBackground = (schichtName: string): string => {
    const color = getSchichtColor(schichtName);
    return alpha(color, 0.1);
  };

  const formatWochentag = (datum: Date): string => {
    return format(datum, 'EEE', { locale: de });
  };

  const formatDatum = (datum: Date): string => {
    return format(datum, 'dd.MM', { locale: de });
  };

  const getWochenbereich = (): string => {
    if (woche.length === 0) return '';
    const ersterTag = woche[0].datum;
    const letzterTag = woche[woche.length - 1].datum;
    return `${format(ersterTag, 'dd.MM', { locale: de })} - ${format(letzterTag, 'dd.MM', { locale: de })}`;
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
        subheader={getWochenbereich()}
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
          {woche.map((tag, index) => {
            const istHeute = isToday(tag.datum);
            const istAusgewaehlt = selectedDate && isSameDay(tag.datum, selectedDate);
            const istWochenende = tag.istWochenende || tag.datum.getDay() === 0 || tag.datum.getDay() === 6;
            
            return (
              <Box key={index} sx={{ flex: '1 1 0', minWidth: 80 }}>
                <Box
                  onClick={() => onDateSelect && onDateSelect(tag.datum)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: onDateSelect ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: istAusgewaehlt 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : istHeute 
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent',
                    border: istHeute 
                      ? `2px solid ${theme.palette.primary.main}`
                      : istAusgewaehlt
                        ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}`
                        : '2px solid transparent',
                    '&:hover': onDateSelect ? {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateY(-1px)',
                    } : {},
                  }}
                >
                  {/* Wochentag */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 600,
                      color: istWochenende ? 'error.main' : 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {formatWochentag(tag.datum)}
                  </Typography>

                  {/* Datum */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: istHeute ? 700 : 500,
                      color: istHeute ? 'primary.main' : 'text.primary',
                      mb: 1,
                    }}
                  >
                    {formatDatum(tag.datum)}
                  </Typography>

                  {/* Schichten */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {Object.entries(tag.schichten).map(([schichtName, anzahl]) => (
                      <Chip
                        key={schichtName}
                        label={`${schichtName}: ${anzahl}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: getSchichtBackground(schichtName),
                          color: getSchichtColor(schichtName),
                          border: `1px solid ${alpha(getSchichtColor(schichtName), 0.3)}`,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    ))}
                    
                    {Object.keys(tag.schichten).length === 0 && (
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

                  {/* Feiertag-Indikator */}
                  {tag.istFeiertag && (
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

        {/* Legende */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Schichttypen:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="F - Frühschicht"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: getSchichtBackground('F'),
                color: getSchichtColor('F'),
                border: `1px solid ${alpha(getSchichtColor('F'), 0.3)}`,
              }}
            />
            <Chip
              label="S - Spätschicht"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: getSchichtBackground('S'),
                color: getSchichtColor('S'),
                border: `1px solid ${alpha(getSchichtColor('S'), 0.3)}`,
              }}
            />
            <Chip
              label="FS - Spezial"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: getSchichtBackground('FS'),
                color: getSchichtColor('FS'),
                border: `1px solid ${alpha(getSchichtColor('FS'), 0.3)}`,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WochenUebersicht;