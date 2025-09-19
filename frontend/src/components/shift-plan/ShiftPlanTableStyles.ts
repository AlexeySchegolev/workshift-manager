import { alpha, Theme } from '@mui/material';

/**
 * Shift color and styling utilities for ShiftPlanTable
 */
export class ShiftPlanTableStyles {
    /**
     * Get background color for shift based on shift type
     */
    static getShiftBackgroundColor(shift: string, theme: Theme): string {
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
    }

    /**
     * Get color for shift based on shift type
     */
    static getShiftColor(shift: string, theme: Theme): string {
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
    }

    /**
     * Header action styles
     */
    static getHeaderActionStyles(theme: Theme) {
        return {
            refreshButton: {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
                '&:disabled': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    color: alpha(theme.palette.common.white, 0.5),
                },
            },
            exportButton: {
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
            },
        };
    }

    /**
     * Month selector styles
     */
    static getMonthSelectorStyles() {
        return {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '& .MuiBox-root': {
                margin: 0,
                padding: 0,
                backgroundColor: 'transparent',
                borderRadius: 1,
            },
            '& .MuiButton-root': {
                fontSize: '1rem',
                fontWeight: 600,
                padding: '4px 8px',
                minHeight: 'auto',
                textTransform: 'capitalize',
            },
            '& .MuiIconButton-root': {
                padding: '4px',
                '& .MuiSvgIcon-root': {
                    fontSize: '1.2rem',
                },
            },
        };
    }

    /**
     * Table cell styles for sticky header
     */
    static getTableCellStyles(theme: Theme) {
        return {
            employeeCell: {
                minWidth: 250,
                width: '250px',
                position: 'sticky',
                left: 0,
                top: 0,
                zIndex: 4,
                backgroundColor: theme.palette.background.paper,
                borderRight: `2px solid ${theme.palette.divider}`,
                borderBottom: `2px solid ${theme.palette.divider}`,
                fontWeight: 700,
                fontSize: '0.875rem',
            },
            dateCell: (dayInfo: any) => ({
                minWidth: 50,
                width: '50px',
                height: '50px',
                fontWeight: 600,
                fontSize: '0.8rem',
                backgroundColor: dayInfo.isToday
                    ? alpha(theme.palette.primary.main, 0.04)
                    : dayInfo.isWeekend
                        ? alpha(theme.palette.error.main, 0.05)
                        : theme.palette.background.paper,
                color: dayInfo.isWeekend ? theme.palette.error.main : 'inherit',
                position: 'sticky',
                top: 0,
                zIndex: 2,
                borderBottom: `2px solid ${theme.palette.divider}`,
            }),
            shiftOverviewCell: {
                minWidth: 250,
                width: '250px',
                position: 'sticky',
                left: 0,
                top: 50,
                zIndex: 3,
                backgroundColor: theme.palette.background.paper,
                borderRight: `2px solid ${theme.palette.divider}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontWeight: 600,
                fontSize: '0.8rem',
                color: theme.palette.text.primary,
                padding: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to top right, transparent 49%, ${theme.palette.divider} 49%, ${theme.palette.divider} 51%, transparent 51%)`,
                    zIndex: 1,
                }
            },
        };
    }
}