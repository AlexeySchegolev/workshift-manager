import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import {
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import { ShiftResponseDto } from '@/api/data-contracts';
import { formatShiftType, formatShiftStatus } from './utils/shiftUtils';

interface DeleteConfirmationDialogProps {
    open: boolean;
    shift: ShiftResponseDto | null;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    open,
    shift,
    onClose,
    onConfirm,
}) => {
    if (!shift) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'error.main',
                }}
            >
                <WarningIcon />
                Schicht löschen
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Sind Sie sicher, dass Sie die folgende Schicht löschen möchten?
                </Typography>

                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'grey.50',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ScheduleIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {shift.name}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip
                            label={formatShiftType(shift.type)}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            label={formatShiftStatus(shift.isActive, shift.isAvailable)}
                            size="small"
                            color="secondary"
                            variant="outlined"
                        />
                        <Chip
                            icon={<BusinessIcon />}
                            label={shift.location?.name || 'Unbekannt'}
                            size="small"
                            variant="outlined"
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        <strong>Datum:</strong> {new Date(shift.shiftDate).toLocaleDateString('de-DE')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Zeit:</strong> {shift.startTime} - {shift.endTime}
                    </Typography>

                    {shift.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Beschreibung:</strong> {shift.description}
                        </Typography>
                    )}
                </Box>

                <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 500 }}>
                    ⚠️ Diese Aktion kann rückgängig gemacht werden (Soft Delete).
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Abbrechen
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Löschen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;