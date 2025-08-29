import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { EmployeeResponseDto } from '@/api/data-contracts';

interface DeleteConfirmationDialogProps {
  open: boolean;
  employee: EmployeeResponseDto | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  employee,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Mitarbeiter löschen
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Möchten Sie den Mitarbeiter{' '}
          <strong>
            "{employee?.fullName || `${employee?.firstName} ${employee?.lastName}`}"
          </strong>{' '}
          wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;