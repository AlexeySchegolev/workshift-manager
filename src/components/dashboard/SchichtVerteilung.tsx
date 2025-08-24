import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

export interface SchichtVerteilungData {
  schichtTyp: string;
  geplant: number;
  benötigt: number;
  farbe: string;
  beschreibung: string;
}

export interface SchichtVerteilungProps {
  verteilungsDaten: SchichtVerteilungData[];
  title?: string;
  monat: string;
}

/**
 * Schichtverteilungs-Komponente für das Dashboard
 */
const SchichtVerteilung: React.FC<SchichtVerteilungProps> = ({
  verteilungsDaten,
  title = 'Schichtverteilung',
  monat,
}) => {
  const theme = useTheme();

  const getSchichtColor = (schichtTyp: string): string => {
    switch (schichtTyp.toUpperCase()) {
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

  const getSchichtBackground = (schichtTyp: string): string => {
    const color = getSchichtColor(schichtTyp);
    return alpha(color, 0.1);
  };

  const getSchichtName = (schichtTyp: string): string => {
    switch (schichtTyp.toUpperCase()) {
      case 'F': return 'Frühschicht';
      case 'S': return 'Spätschicht';
      case 'S0': return 'Spätschicht S0';
      case 'S1': return 'Spätschicht S1';
      case 'S00': return 'Spätschicht S00';
      case 'FS': return 'Spezialschicht';
      case '4': return 'Standort B Früh';
      case '5': return 'Standort B Spät';
      case '6': return 'Standort B Leitung';
      default: return schichtTyp;
    }
  };

  const getTrendIcon = (geplant: number, benötigt: number) => {
    const prozent = benötigt > 0 ? (geplant / benötigt) * 100 : 100;
    if (prozent >= 100) return <TrendingUpIcon sx={{ fontSize: '1rem', color: 'success.main' }} />;
    if (prozent >= 80) return <TrendingUpIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />;
    return <TrendingDownIcon sx={{ fontSize: '1rem', color: 'error.main' }} />;
  };

  const getStatusColor = (geplant: number, benötigt: number): 'success' | 'warning' | 'error' => {
    const prozent = benötigt > 0 ? (geplant / benötigt) * 100 : 100;
    if (prozent >= 100) return 'success';
    if (prozent >= 80) return 'warning';
    return 'error';
  };

  const gesamtGeplant = verteilungsDaten.reduce((sum, item) => sum + item.geplant, 0);
  const gesamtBenötigt = verteilungsDaten.reduce((sum, item) => sum + item.benötigt, 0);
  const gesamtProzent = gesamtBenötigt > 0 ? Math.round((gesamtGeplant / gesamtBenötigt) * 100) : 100;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        subheader={`${monat} • ${gesamtGeplant}/${gesamtBenötigt} Schichten (${gesamtProzent}%)`}
        action={
          <Chip
            label={`${gesamtProzent}%`}
            color={getStatusColor(gesamtGeplant, gesamtBenötigt)}
            size="small"
            sx={{
              fontWeight: 600,
              minWidth: 60,
            }}
          />
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Gesamtfortschritt */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Gesamtfortschritt
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {gesamtGeplant} / {gesamtBenötigt}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(gesamtProzent, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.grey[500], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 
                  gesamtProzent >= 100 ? theme.palette.success.main :
                  gesamtProzent >= 80 ? theme.palette.warning.main :
                  theme.palette.error.main,
              },
            }}
          />
        </Box>

        {/* Schichttyp-Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Schichttypen ({verteilungsDaten.length})
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {verteilungsDaten.map((schicht, index) => {
              const prozent = schicht.benötigt > 0 ? Math.round((schicht.geplant / schicht.benötigt) * 100) : 100;
              const schichtColor = getSchichtColor(schicht.schichtTyp);
              const backgroundColor = getSchichtBackground(schicht.schichtTyp);
              
              return (
                <Tooltip
                  key={index}
                  title={schicht.beschreibung}
                  placement="top"
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor,
                      border: `1px solid ${alpha(schichtColor, 0.2)}`,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(schichtColor, 0.15),
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={schicht.schichtTyp}
                          size="small"
                          sx={{
                            backgroundColor: alpha(schichtColor, 0.2),
                            color: schichtColor,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 24,
                            minWidth: 32,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {getSchichtName(schicht.schichtTyp)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(schicht.geplant, schicht.benötigt)}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: schichtColor,
                          }}
                        >
                          {schicht.geplant}/{schicht.benötigt}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Fortschrittsbalken */}
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(prozent, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(schichtColor, 0.2),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: schichtColor,
                        },
                      }}
                    />

                    {/* Prozentanzeige */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {prozent}% abgedeckt
                      </Typography>
                      {prozent < 100 && (
                        <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>
                          {schicht.benötigt - schicht.geplant} fehlen
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Zusammenfassung */}
        {gesamtProzent < 100 && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main', mb: 0.5 }}>
              Unvollständige Abdeckung
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {gesamtBenötigt - gesamtGeplant} Schichten müssen noch geplant werden
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SchichtVerteilung;