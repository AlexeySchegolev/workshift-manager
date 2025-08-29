import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Traffic as TrafficIcon,
} from '@mui/icons-material';

export type StatusLevel = 'success' | 'warning' | 'error' | 'info';

export interface StatusItem {
  id: string;
  title: string;
  description: string;
  status: StatusLevel;
  value?: number;
  maxValue?: number;
  details?: string[];
}

export interface StatusLightProps {
  statusItems: StatusItem[];
  title?: string;
  showProgress?: boolean;
}

/**
 * Status Light System for the Dashboard
 */
const StatusLight: React.FC<StatusLightProps> = ({
  statusItems,
  title = 'System-Status',
  showProgress = true,
}) => {
  const theme = useTheme();

  const getStatusIcon = (status: StatusLevel) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getStatusColor = (status: StatusLevel) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusBackgroundColor = (status: StatusLevel) => {
    const color = getStatusColor(status);
    return alpha(color, 0.1);
  };

  const getStatusLabel = (status: StatusLevel) => {
    switch (status) {
      case 'success':
        return 'OK';
      case 'warning':
        return 'Warnung';
      case 'error':
        return 'Fehler';
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  };

  // Calculate overall status
  const overallStatus: StatusLevel = statusItems.reduce((worst, item) => {
    const statusPriority = { success: 0, info: 1, warning: 2, error: 3 };
    return statusPriority[item.status] > statusPriority[worst] ? item.status : worst;
  }, 'success' as StatusLevel);

  const statusCounts = statusItems.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {} as Record<StatusLevel, number>);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrafficIcon sx={{ fontSize: '1.25rem', color: getStatusColor(overallStatus) }} />
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        action={
          <Chip
            label={getStatusLabel(overallStatus)}
            color={overallStatus as any}
            size="small"
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          />
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Overview of status distribution */}
        {showProgress && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Status-Übersicht ({statusItems.length} Bereiche)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${getStatusLabel(status as StatusLevel)}: ${count}`}
                  size="small"
                  color={status as any}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Status list */}
        {statusItems.length === 0 ? (
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
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Alle Systeme funktionieren ordnungsgemäß
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, py: 0 }}>
            {statusItems.map((item, index) => {
              const statusColor = getStatusColor(item.status);
              const backgroundColor = getStatusBackgroundColor(item.status);

              return (
                <ListItem
                  key={item.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: backgroundColor,
                    border: `1px solid ${alpha(statusColor, 0.2)}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        color: statusColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getStatusIcon(item.status)}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            flex: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        {item.value !== undefined && item.maxValue !== undefined && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            {item.value}/{item.maxValue}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            display: 'block',
                            mb: item.value !== undefined && item.maxValue !== undefined ? 1 : 0,
                          }}
                        >
                          {item.description}
                        </Typography>
                        
                        {/* Progress bar */}
                        {item.value !== undefined && item.maxValue !== undefined && (
                          <LinearProgress
                            variant="determinate"
                            value={(item.value / item.maxValue) * 100}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: alpha(statusColor, 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: statusColor,
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                        
                        {/* Details */}
                        {item.details && item.details.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {item.details.map((detail, detailIndex) => (
                              <Typography
                                key={detailIndex}
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  color: 'text.secondary',
                                  fontSize: '0.7rem',
                                  '&:before': {
                                    content: '"• "',
                                    color: statusColor,
                                    fontWeight: 'bold',
                                  },
                                }}
                              >
                                {detail}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to create standard status items for shift planning
export const createShiftPlanningStatusItems = (
  employeeCount: number,
  currentMonthCoverage: number,
  violationCount: number,
  warningCount: number
): StatusItem[] => [
  {
    id: 'employees',
    title: 'Mitarbeiter',
    description: 'Verfügbare Mitarbeiter im System',
    status: employeeCount >= 5 ? 'success' : employeeCount >= 3 ? 'warning' : 'error',
    value: employeeCount,
    maxValue: 20,
    details: employeeCount < 5 ? ['Zu wenige Mitarbeiter für optimale Schichtplanung'] : undefined,
  },
  {
    id: 'coverage',
    title: 'Schichtabdeckung',
    description: 'Prozent der geplanten Schichten im aktuellen Monat',
    status: currentMonthCoverage >= 90 ? 'success' : currentMonthCoverage >= 70 ? 'warning' : 'error',
    value: currentMonthCoverage,
    maxValue: 100,
    details: currentMonthCoverage < 90 ? ['Unvollständige Schichtabdeckung'] : undefined,
  },
  {
    id: 'violations',
    title: 'Regelverletzungen',
    description: 'Anzahl der Regelverletzungen im aktuellen Plan',
    status: violationCount === 0 ? 'success' : violationCount <= 2 ? 'warning' : 'error',
    value: violationCount,
    maxValue: 0,
    details: violationCount > 0 ? [`${violationCount} Regelverletzungen gefunden`] : undefined,
  },
  {
    id: 'warnings',
    title: 'Warnungen',
    description: 'Anzahl der Warnungen und Optimierungsvorschläge',
    status: warningCount === 0 ? 'success' : warningCount <= 5 ? 'warning' : 'error',
    value: warningCount,
    maxValue: 0,
    details: warningCount > 0 ? [`${warningCount} Warnungen vorhanden`] : undefined,
  },
];

export default StatusLight;