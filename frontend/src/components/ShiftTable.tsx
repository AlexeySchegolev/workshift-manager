import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Alert,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Chip,
    CardContent,
    CardHeader,
    Card,
    useTheme,
    alpha,
    Fade,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    FileDownload as FileDownloadIcon,
    PlayArrow as PlayArrowIcon,
    Assessment as AssessmentIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import {ConstraintViolationDto, EmployeeResponseDto, MonthlyShiftPlanDto} from "@/api/data-contracts.ts";
import { excelExportService } from '@/services';

interface ShiftTableProps {
    employees: EmployeeResponseDto[];
    selectedDate: Date;
    shiftPlan: MonthlyShiftPlanDto | null;
    shiftPlanId?: string | null; // Optional shift plan ID for Excel export
    constraints: ConstraintViolationDto[];
    isLoading: boolean;
    onGeneratePlan: () => void;
}

/**
 * Modern Shift Plan Table in Dashboard Style
 */
const ShiftTable: React.FC<ShiftTableProps> = ({
                                                   employees,
                                                   selectedDate,
                                                   shiftPlan,
                                                   shiftPlanId,
                                                   constraints,
                                                   isLoading,
                                                   onGeneratePlan
                                               }) => {
    const theme = useTheme();

    // Sorted days of the month from the shift plan
    const sortedDays = shiftPlan
        ? Object.keys(shiftPlan)
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('.').map(Number);
                const [dayB, monthB, yearB] = b.split('.').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            })
        : [];

    // Formatted month name
    const monthName = format(selectedDate, 'MMMM yyyy', {locale: de});

    // Function to export the shift plan
    const handleExportToExcel = async () => {
        if (!shiftPlan || !shiftPlanId) {
            alert('Kein Schichtplan zum Exportieren verfügbar.');
            return;
        }

        try {
            const blob = await excelExportService.exportShiftPlan(
                shiftPlanId,
                { 
                    includeStatistics: true, 
                    includePlanning: true, 
                    dateRange: { 
                        start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
                        end: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
                    }
                }
            );

            excelExportService.downloadBlob(blob, `Schichtplan_${monthName}.xlsx`);
        } catch (error) {
            console.error('Error exporting shift plan:', error);
            alert('Der Schichtplan konnte nicht exportiert werden.');
        }
    };

    // Function to determine background color based on shift
    const getShiftBackgroundColor = (shift: string): string => {
        switch (shift) {
            case 'F':
                return alpha(theme.palette.shifts?.early || theme.palette.success.main, 0.1);
            case 'S':
            case 'S0':
            case 'S1':
            case 'S00':
                return alpha(theme.palette.shifts?.late || theme.palette.warning.main, 0.1);
            case 'FS':
                return alpha(theme.palette.shifts?.special || theme.palette.info.main, 0.1);
            case '4':
            case '5':
            case '6':
                return alpha(theme.palette.shifts?.uetersen || theme.palette.info.main, 0.1);
            default:
                return 'transparent';
        }
    };

    // Function for shift colors
    const getShiftColor = (shift: string): string => {
        switch (shift) {
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
                return theme.palette.text.secondary;
        }
    };

    // Function to render status color for constraints
    const getConstraintColor = (type: "hard" | "soft" | "warning" | "info"): 'success' | 'warning' | 'error' | 'default' => {
        switch (type) {
            case 'info':
                return 'success';
            case 'warning':
                return 'warning';
            case 'hard':
            case 'soft':
                return 'error';
            default:
                return 'default';
        }
    };

    // Constraint icon based on status
    const getConstraintIcon = (type: "hard" | "soft" | "warning" | "info") => {
        switch (type) {
            case 'info':
                return <CheckCircleIcon sx={{fontSize: '1rem'}}/>;
            case 'warning':
                return <WarningIcon sx={{fontSize: '1rem'}}/>;
            case 'hard':
            case 'soft':
                return <ErrorIcon sx={{fontSize: '1rem'}}/>;
            default:
                return <WarningIcon sx={{fontSize: '1rem'}}/>;
        }
    };

    return (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* Header */}
            <CardHeader
                title={
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <ScheduleIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                        <Typography variant="h6" component="div">
                            Schichtplan {monthName}
                        </Typography>
                    </Box>
                }
                action={
                    <Box sx={{display: 'flex', gap: 1}}>
                        <Tooltip title="Schichtplan generieren">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onGeneratePlan}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={16}/> : <PlayArrowIcon/>}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                }}
                            >
                                {isLoading ? 'Wird generiert...' : 'Generieren'}
                            </Button>
                        </Tooltip>

                        <Tooltip title="Als Excel exportieren">
                            <IconButton
                                color="primary"
                                onClick={handleExportToExcel}
                                disabled={!shiftPlan || isLoading}
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                }}
                            >
                                <FileDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                sx={{pb: 1}}
            />

            <CardContent sx={{pt: 0, px: 0, flex: 1, display: 'flex', flexDirection: 'column'}}>
                {/* Shift plan table */}
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            py: 8,
                            gap: 2,
                        }}
                    >
                        <CircularProgress size={48}/>
                        <Typography variant="body1" color="text.secondary">
                            Schichtplan wird generiert...
                        </Typography>
                    </Box>
                ) : !shiftPlan ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            py: 8,
                            textAlign: 'center',
                        }}
                    >
                        <ScheduleIcon sx={{fontSize: 64, color: 'text.disabled', mb: 2}}/>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Kein Schichtplan verfügbar
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3, maxWidth: 400}}>
                            Generieren Sie einen neuen Schichtplan für {monthName}, um die Schichtverteilung zu sehen.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onGeneratePlan}
                            startIcon={<PlayArrowIcon/>}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                            }}
                        >
                            Schichtplan generieren
                        </Button>
                    </Box>
                ) : sortedDays.length === 0 ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                width: '100%',
                            },
                        }}
                    >
                        <Typography variant="body2">
                            Der Schichtplan enthält keine gültigen Tage.
                        </Typography>
                    </Alert>
                ) : (
                    <Fade in timeout={600}>
                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    flex: 1,
                                    maxHeight: '75vh',
                                    overflow: 'auto',
                                    borderRadius: 0,
                                    border: 'none',
                                    width: '100%',
                                }}
                            >
                                <Table stickyHeader size="medium">
                                    {/* Table head with dates */}
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    minWidth: 200,
                                                    width: '200px',
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 3,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRight: `2px solid ${theme.palette.divider}`,
                                                    fontWeight: 700,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                Mitarbeiter
                                            </TableCell>
                                            {sortedDays.map(dayKey => {
                                                const [day, month, year] = dayKey.split('.').map(Number);
                                                const date = new Date(year, month - 1, day);
                                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                                return (
                                                    <TableCell
                                                        key={dayKey}
                                                        align="center"
                                                        sx={{
                                                            minWidth: 70,
                                                            width: '70px',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            backgroundColor: isWeekend ? alpha(theme.palette.error.main, 0.05) : 'inherit',
                                                            color: isWeekend ? theme.palette.error.main : 'inherit',
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="caption"
                                                                        sx={{display: 'block', fontWeight: 700}}>
                                                                {format(date, 'dd.MM')}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        sx={{fontSize: '0.7rem', opacity: 0.8}}>
                                                                {format(date, 'EEE', {locale: de})}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>

                                    {/* Table body with employees and shifts */}
                                    <TableBody>
                                        {employees.map((emp, empIndex) => (
                                            <TableRow
                                                key={emp.id}
                                                hover
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    sx={{
                                                        minWidth: 200,
                                                        width: '200px',
                                                        position: 'sticky',
                                                        left: 0,
                                                        backgroundColor: 'inherit',
                                                        borderRight: `2px solid ${theme.palette.divider}`,
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    <Box sx={{py: 0.5}}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.85rem',
                                                                color: 'text.primary',
                                                            }}
                                                        >
                                                            {emp.lastName}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            mt: 0.5
                                                        }}>
                                                            <Chip
                                                                label={emp.primaryRole?.type}
                                                                size="small"
                                                                color={emp.primaryRole?.type === 'shift_leader' ? 'primary' : 'default'}
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={emp.location?.name}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                    color: theme.palette.info.main,
                                                                }}
                                                            />
                                                        </Box>
                                                        {emp.hoursPerMonth && (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.7rem',
                                                                    display: 'block',
                                                                    mt: 0.5,
                                                                }}
                                                            >
                                                                {emp.hoursPerMonth}h/Monat
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {sortedDays.map(dayKey => {
                                                    const dayPlan = (shiftPlan as Record<string, any>)?.[dayKey] as Record<string, string[]> | null;
                                                    let assignedShift = '';

                                                    if (dayPlan) {
                                                        for (const shiftName in dayPlan) {
                                                            if (dayPlan[shiftName]?.includes(emp.id)) {
                                                                assignedShift = shiftName;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    const [day, month, year] = dayKey.split('.').map(Number);
                                                    const date = new Date(year, month - 1, day);
                                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                                    return (
                                                        <TableCell
                                                            key={`${emp.id}-${dayKey}`}
                                                            align="center"
                                                            sx={{
                                                                backgroundColor: (shiftPlan as Record<string, any>)?.[dayKey] === null
                                                                    ? alpha(theme.palette.grey[500], 0.1)
                                                                    : assignedShift
                                                                        ? getShiftBackgroundColor(assignedShift)
                                                                        : isWeekend
                                                                            ? alpha(theme.palette.error.main, 0.02)
                                                                            : 'inherit',
                                                                border: assignedShift
                                                                    ? `1px solid ${alpha(getShiftColor(assignedShift), 0.3)}`
                                                                    : 'none',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            {(shiftPlan as Record<string, any>)?.[dayKey] === null ? (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: 'text.disabled',
                                                                        fontStyle: 'italic',
                                                                        fontSize: '0.75rem',
                                                                    }}
                                                                >
                                                                    —
                                                                </Typography>
                                                            ) : assignedShift ? (
                                                                <Chip
                                                                    label={assignedShift}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 24,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 700,
                                                                        backgroundColor: getShiftBackgroundColor(assignedShift),
                                                                        color: getShiftColor(assignedShift),
                                                                        border: `1px solid ${alpha(getShiftColor(assignedShift), 0.5)}`,
                                                                        '& .MuiChip-label': {
                                                                            px: 1,
                                                                        },
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: 'text.disabled',
                                                                            fontSize: '0.7rem',
                                                                        }}
                                                                    >
                                                                        —
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Fade>
                )}

                {/* Constraints summary */}
                {constraints.length > 0 && (
                    <Fade in timeout={800}>
                        <Card
                            sx={{
                                mt: 3,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <CardHeader
                                title={
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <AssessmentIcon sx={{fontSize: '1.25rem', color: 'warning.main'}}/>
                                        <Typography variant="h6" component="div">
                                            Planungsvalidierung
                                        </Typography>
                                    </Box>
                                }
                                subheader={`${constraints.length} Prüfungen durchgeführt`}
                                sx={{pb: 1}}
                            />
                            <CardContent sx={{pt: 0}}>
                                <List sx={{py: 0}}>
                                    {constraints.map((constraint, index) => (
                                        <ListItem
                                            key={`constraint-${index}`}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                backgroundColor: alpha(
                                                    constraint.type === 'hard' || constraint.type === 'soft' ? theme.palette.error.main :
                                                        constraint.type === 'warning' ? theme.palette.warning.main :
                                                            theme.palette.success.main,
                                                    0.05
                                                ),
                                                border: `1px solid ${alpha(
                                                    constraint.type === 'hard' || constraint.type === 'soft' ? theme.palette.error.main :
                                                        constraint.type === 'warning' ? theme.palette.warning.main :
                                                            theme.palette.success.main,
                                                    0.2
                                                )}`,
                                                '&:last-child': {
                                                    mb: 0,
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                                                        <Chip
                                                            icon={getConstraintIcon(constraint.type)}
                                                            label={
                                                                constraint.type === 'hard' || constraint.type === 'soft' ? 'Fehler' :
                                                                    constraint.type === 'warning' ? 'Warnung' :
                                                                        'OK'
                                                            }
                                                            color={getConstraintColor(constraint.type)}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': {
                                                                    fontSize: '0.9rem',
                                                                },
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                color: 'text.primary',
                                                            }}
                                                        >
                                                            {constraint.message}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Fade>
                )}
            </CardContent>
        </Box>
    );
};

export default ShiftTable;