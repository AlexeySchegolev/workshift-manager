import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

export interface DeleteDialogField {
  label: string;
  value: string | ReactNode;
}

export interface DeleteDialogChip {
  label: string | ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  icon?: React.ReactElement;
}

export interface DeleteConfirmationConfig {
  title: string;
  entityName: string;
  entityDisplayName?: string;
  confirmationMessage?: string;
  warningMessage?: string;
  showDetailedView?: boolean;
  icon?: ReactNode;
  chips?: DeleteDialogChip[];
  fields?: DeleteDialogField[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  config: DeleteConfirmationConfig;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  config,
  onClose,
  onConfirm,
}) => {
  const {
    title,
    entityName,
    entityDisplayName,
    confirmationMessage,
    warningMessage,
    showDetailedView = false,
    icon,
    chips = [],
    fields = [],
    maxWidth = 'sm',
    fullWidth = true,
    isLoading = false,
  } = config;

  const defaultConfirmationMessage = showDetailedView
    ? `Sind Sie sicher, dass Sie ${entityName} löschen möchten?`
    : `Möchten Sie ${entityName} ${entityDisplayName ? `"${entityDisplayName}"` : ''} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`;

  const displayMessage = confirmationMessage || defaultConfirmationMessage;
  const displayWarning = warningMessage || '⚠️ Diese Aktion kann nicht rückgängig gemacht werden.';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={
          showDetailedView
            ? {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'error.main',
                fontWeight: 600,
              }
            : { pb: 1, fontWeight: 600 }
        }
      >
        {showDetailedView && (icon || <WarningIcon />)}
        {title}
      </DialogTitle>

      <DialogContent>
        {showDetailedView ? (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {displayMessage}
            </Typography>

            {(chips.length > 0 || fields.length > 0) && (
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                }}
              >
                {entityDisplayName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {entityDisplayName}
                    </Typography>
                  </Box>
                )}

                {chips.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {chips.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip.label}
                        color={chip.color || 'default'}
                        variant={chip.variant || 'outlined'}
                        size={chip.size || 'small'}
                        icon={chip.icon}
                      />
                    ))}
                  </Box>
                )}

                {fields.map((field, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    <strong>{field.label}:</strong> {field.value}
                  </Typography>
                ))}
              </Box>
            )}

            <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 500 }}>
              {displayWarning}
            </Typography>
          </>
        ) : (
          <DialogContentText>{displayMessage}</DialogContentText>
        )}
      </DialogContent>

      <DialogActions sx={showDetailedView ? { p: 3, gap: 1 } : { p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant={showDetailedView ? 'outlined' : undefined}
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
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {isLoading ? 'Wird gelöscht...' : 'Löschen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;