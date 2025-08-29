import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState } from './hooks/useEmployeeActions';

interface EmployeeSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

const EmployeeSnackbar: React.FC<EmployeeSnackbarProps> = ({
  snackbar,
  onClose,
}) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{
          width: '100%',
          borderRadius: 2,
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default EmployeeSnackbar;