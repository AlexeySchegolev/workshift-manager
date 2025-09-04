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
  LocationOn as LocationIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { LocationResponseDto } from '@/api/data-contracts';

interface DeleteConfirmationDialogProps {
  open: boolean;
  location: LocationResponseDto | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  location,
  onClose,
  onConfirm,
}) => {
  if (!location) return null;

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
        Standort löschen
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sind Sie sicher, dass Sie den folgenden Standort löschen möchten?
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
            <LocationIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {location.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {location.code && (
              <Chip
                label={location.code}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            <Chip
              label={location.isActive ? 'Aktiv' : 'Inaktiv'}
              size="small"
              color={location.isActive ? 'success' : 'default'}
              variant="outlined"
            />
            <Chip
              icon={<BusinessIcon />}
              label={`${location.employees?.length || 0} Mitarbeiter`}
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            <strong>Adresse:</strong> {location.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Stadt:</strong> {location.city} {location.postalCode}
          </Typography>
          {location.phone && (
            <Typography variant="body2" color="text.secondary">
              <strong>Telefon:</strong> {location.phone}
            </Typography>
          )}
          {location.email && (
            <Typography variant="body2" color="text.secondary">
              <strong>E-Mail:</strong> {location.email}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 500 }}>
          ⚠️ Diese Aktion kann nicht rückgängig gemacht werden.
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