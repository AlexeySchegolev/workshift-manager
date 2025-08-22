import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

export interface SchnellAktion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export interface SchnellAktionenProps {
  aktionen: SchnellAktion[];
  title?: string;
  maxItems?: number;
}

/**
 * Schnellaktionen-Panel für das Dashboard
 */
const SchnellAktionen: React.FC<SchnellAktionenProps> = ({
  aktionen,
  title = 'Schnellaktionen',
  maxItems = 6,
}) => {
  const theme = useTheme();

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getBackgroundColor = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return alpha(theme.palette.primary.main, 0.1);
      case 'success':
        return alpha(theme.palette.success.main, 0.1);
      case 'warning':
        return alpha(theme.palette.warning.main, 0.1);
      case 'error':
        return alpha(theme.palette.error.main, 0.1);
      case 'info':
        return alpha(theme.palette.info.main, 0.1);
      default:
        return alpha(theme.palette.primary.main, 0.1);
    }
  };

  const sichtbareAktionen = aktionen.slice(0, maxItems);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayArrowIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0, px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {sichtbareAktionen.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              py: 4,
            }}
          >
            <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Keine Schnellaktionen verfügbar
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, py: 0 }}>
            {sichtbareAktionen.map((aktion, index) => {
              const mainColor = getColorValue(aktion.color);
              const backgroundColor = getBackgroundColor(aktion.color);

              return (
                <React.Fragment key={aktion.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={aktion.onClick}
                      disabled={aktion.disabled}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(mainColor, 0.08),
                          transform: 'translateX(4px)',
                        },
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Box
                          sx={{
                            p: 0.75,
                            borderRadius: 1.5,
                            backgroundColor,
                            color: mainColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            minWidth: 36,
                            height: 36,
                          }}
                        >
                          {aktion.icon}
                          {aktion.badge && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                backgroundColor: 'error.main',
                                color: 'white',
                                borderRadius: '50%',
                                minWidth: 16,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                px: 0.5,
                              }}
                            >
                              {aktion.badge}
                            </Box>
                          )}
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              fontSize: '0.875rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {aktion.title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: '0.75rem',
                              lineHeight: 1.2,
                              mt: 0.25,
                            }}
                          >
                            {aktion.description}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  {index < sichtbareAktionen.length - 1 && (
                    <Divider sx={{ my: 0.5, opacity: 0.3 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {/* Alle Aktionen anzeigen Button */}
        {aktionen.length > maxItems && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Alle {aktionen.length} Aktionen anzeigen
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Vordefinierte Schnellaktionen für die Schichtplanung
export const createDefaultSchnellAktionen = (
  onGenerateShiftPlan: () => void,
  onAddEmployee: () => void,
  onExportExcel: () => void,
  onOpenSettings: () => void,
  onViewReports: () => void,
  hasCurrentPlan: boolean = false,
  warningCount: number = 0
): SchnellAktion[] => [
  {
    id: 'generate-plan',
    title: 'Schichtplan generieren',
    description: 'Neuen Schichtplan für den ausgewählten Monat erstellen',
    icon: <ScheduleIcon />,
    color: 'primary',
    onClick: onGenerateShiftPlan,
  },
  {
    id: 'add-employee',
    title: 'Mitarbeiter hinzufügen',
    description: 'Neuen Mitarbeiter zur Datenbank hinzufügen',
    icon: <AddIcon />,
    color: 'success',
    onClick: onAddEmployee,
  },
  {
    id: 'export-excel',
    title: 'Excel exportieren',
    description: 'Aktuellen Schichtplan als Excel-Datei herunterladen',
    icon: <FileDownloadIcon />,
    color: 'info',
    onClick: onExportExcel,
    disabled: !hasCurrentPlan,
  },
  {
    id: 'view-reports',
    title: 'Berichte anzeigen',
    description: 'Statistiken und Auswertungen der Schichtplanung',
    icon: <AssessmentIcon />,
    color: 'warning',
    onClick: onViewReports,
    badge: warningCount > 0 ? warningCount : undefined,
  },
  {
    id: 'settings',
    title: 'Einstellungen',
    description: 'Schichtregeln und Systemeinstellungen anpassen',
    icon: <SettingsIcon />,
    color: 'primary',
    onClick: onOpenSettings,
  },
];

export default SchnellAktionen;