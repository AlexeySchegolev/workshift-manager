import React from 'react';
import {
    Box,
    Paper,
    Typography,
    LinearProgress,
    Chip,
    useTheme,
    alpha,
    Grid,
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    TrendingUp as TrendingUpIcon,
    AccessTime as AccessTimeIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { ShiftResponseDto } from '@/api/data-contracts';
import { calculateShiftStatistics } from './utils/shiftUtils';

interface ShiftStatisticsProps {
    shifts: ShiftResponseDto[];
}

const ShiftStatistics: React.FC<ShiftStatisticsProps> = ({ shifts }) => {
    const theme = useTheme();
    const stats = calculateShiftStatistics(shifts);

    const StatCard: React.FC<{
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        color: string;
        progress?: number;
        warning?: boolean;
    }> = ({ title, value, subtitle, icon, color, progress, warning }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: warning
                    ? `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.light, 0.02)} 100%)`
                    : `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': warning ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: theme.palette.warning.main,
                } : undefined,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: alpha(color, 0.1),
                        color,
                    }}
                >
                    {icon}
                </Box>
            </Box>
            {progress !== undefined && (
                <Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(color, 0.1),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: color,
                                borderRadius: 3,
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {progress.toFixed(1)}% der Zielkapazität
                    </Typography>
                </Box>
            )}
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Schicht-Statistiken
            </Typography>

            <Grid container spacing={3}>
                {/* Total Shifts */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Gesamte Schichten"
                        value={stats.total}
                        subtitle="Alle geplanten Schichten"
                        icon={<ScheduleIcon />}
                        color={theme.palette.primary.main}
                    />
                </Grid>

                {/* Active Shifts */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Aktive Schichten"
                        value={stats.active}
                        subtitle={`${stats.published} veröffentlicht`}
                        icon={<TrendingUpIcon />}
                        color={theme.palette.success.main}
                        progress={(stats.active / Math.max(stats.total, 1)) * 100}
                    />
                </Grid>

                {/* Staffing Level */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Durchschnittliche Besetzung"
                        value={`${stats.averageStaffing}%`}
                        subtitle={`${stats.fullyStaffed} vollbesetzt`}
                        icon={<PeopleIcon />}
                        color={stats.averageStaffing >= 90 ? theme.palette.success.main : 
                               stats.averageStaffing >= 70 ? theme.palette.warning.main : 
                               theme.palette.error.main}
                        progress={Math.min(stats.averageStaffing, 100)}
                        warning={stats.averageStaffing < 80}
                    />
                </Grid>

                {/* Understaffed */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Unterbesetzt"
                        value={stats.understaffed}
                        subtitle="Schichten mit Personalmangel"
                        icon={<WarningIcon />}
                        color={theme.palette.error.main}
                        warning={stats.understaffed > 0}
                    />
                </Grid>

                {/* Shift Types Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon color="primary" />
                            Schichttypen
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(stats.byType).map(([type, count]) => (
                                <Chip
                                    key={type}
                                    label={`${type}: ${count}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Location Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon color="info" />
                            Standortverteilung
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(stats.byLocation).map(([location, count]) => (
                                <Chip
                                    key={location}
                                    label={`${location}: ${count}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: theme.palette.info.main,
                                        color: theme.palette.info.main,
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ShiftStatistics;