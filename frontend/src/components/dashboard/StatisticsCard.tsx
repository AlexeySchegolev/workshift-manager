import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

export interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  onClick?: () => void;
}

/**
 * Reusable Statistics Card for the Dashboard
 */
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  onClick,
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

  const mainColor = getColorValue(color);
  const backgroundColor = getBackgroundColor(color);

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header with icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor,
              color: mainColor,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 40,
              height: 40,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.7rem',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Main value */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 0.5,
            lineHeight: 1.1,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
          }}
        >
          {value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: trend ? 1 : 0,
              fontSize: '0.8rem',
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Trend display */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Chip
              icon={
                trend.isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: '1rem' }} />
                )
              }
              label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
              size="small"
              color={trend.isPositive ? 'success' : 'error'}
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  fontSize: '1rem',
                },
              }}
            />
            {trend.label && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                {trend.label}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;