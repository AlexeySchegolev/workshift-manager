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
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  maxItems?: number;
}

/**
 * Quick Actions Panel for the Dashboard
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
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

  const visibleActions = actions.slice(0, maxItems);

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
        {visibleActions.length === 0 ? (
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
            {visibleActions.map((action, index) => {
              const mainColor = getColorValue(action.color);
              const backgroundColor = getBackgroundColor(action.color);

              return (
                <React.Fragment key={action.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={action.onClick}
                      disabled={action.disabled}
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
                          {action.icon}
                          {action.badge && (
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
                              {action.badge}
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
                            {action.title}
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
                            {action.description}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  {index < visibleActions.length - 1 && (
                    <Divider sx={{ my: 0.5, opacity: 0.3 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {/* Show all actions button */}
        {actions.length > maxItems && (
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
              Alle {actions.length} Aktionen anzeigen
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Predefined quick actions for shift planning
export default QuickActions;