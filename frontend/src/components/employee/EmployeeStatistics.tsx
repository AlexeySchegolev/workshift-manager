import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Fade,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { EmployeeResponseDto } from '@/api/data-contracts';
import { calculateEmployeeStatistics } from './utils/employeeUtils';

interface EmployeeStatisticsProps {
  employees: EmployeeResponseDto[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const EmployeeStatistics: React.FC<EmployeeStatisticsProps> = ({ employees }) => {
  const theme = useTheme();
  const stats = calculateEmployeeStatistics(employees);

  const statisticsData = [
    {
      title: 'Gesamt Mitarbeiter',
      value: stats.totalEmployees,
      icon: <PeopleIcon sx={{ fontSize: '1.5rem' }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Aktive Mitarbeiter',
      value: stats.activeEmployees,
      icon: <PersonAddIcon sx={{ fontSize: '1.5rem' }} />,
      color: theme.palette.success.main,
    }
  ];

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {statisticsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </Box>
    </Fade>
  );
};

export default EmployeeStatistics;