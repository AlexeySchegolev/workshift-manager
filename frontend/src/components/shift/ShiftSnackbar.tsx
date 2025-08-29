import React from 'react';
import {
    Snackbar,
    Alert,
} from '@mui/material';
import { SnackbarState } from './hooks/useShiftActions';

interface ShiftSnackbarProps {
    snackbar: SnackbarState;
    onClose: () => void;
}

const ShiftSnackbar: React.FC<ShiftSnackbarProps> = ({
    snackbar,
    onClose,
}) => {
    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default ShiftSnackbar;