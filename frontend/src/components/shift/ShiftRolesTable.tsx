import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ShiftRoleResponseDto } from '@/api/data-contracts';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';

interface ShiftRolesTableProps {
  shiftRoles: ShiftRoleResponseDto[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (shiftRole: ShiftRoleResponseDto) => void;
  onDelete: (id: string) => Promise<void>;
  readOnly?: boolean;
}

const ShiftRolesTable: React.FC<ShiftRolesTableProps> = ({
  shiftRoles,
  loading,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<ShiftRoleResponseDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (shiftRole: ShiftRoleResponseDto) => {
    setRoleToDelete(shiftRole);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    setDeleting(true);
    try {
      await onDelete(roleToDelete.id);
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  if (loading && shiftRoles.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Lade Rollen...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Benötigte Rollen
        </Typography>
        {!readOnly && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAdd}
            disabled={loading}
          >
            Rolle hinzufügen
          </Button>
        )}
      </Box>

      {shiftRoles.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Keine Rollen zugewiesen
          </Typography>
          {!readOnly && (
            <Button
              variant="text"
              size="small"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ mt: 1 }}
            >
              Erste Rolle hinzufügen
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rolle</TableCell>
                <TableCell align="center">Anzahl</TableCell>
                <TableCell align="center">Beschreibung</TableCell>
                {!readOnly && <TableCell align="center">Aktionen</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftRoles.map((shiftRole) => (
                <TableRow key={shiftRole.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(shiftRole.role as any)?.name || 'Unbekannte Rolle'}
                      </Typography>
                      {(shiftRole.role as any)?.color && (
                        <Chip
                          size="small"
                          label={(shiftRole.role as any)?.code || ''}
                          sx={{
                            backgroundColor: (shiftRole.role as any)?.color,
                            color: 'white',
                            fontSize: '0.75rem',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={shiftRole.count}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {(shiftRole.role as any)?.description || '-'}
                    </Typography>
                  </TableCell>
                  {!readOnly && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(shiftRole)}
                            disabled={loading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(shiftRole)}
                            disabled={loading}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        config={{
          title: "Rolle aus Schicht entfernen",
          entityName: "die Rolle",
          entityDisplayName: (roleToDelete?.role as any)?.name || "Unbekannte Rolle",
          confirmationMessage: `Möchten Sie die Rolle "${(roleToDelete?.role as any)?.name}" wirklich aus dieser Schicht entfernen?`
        }}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ShiftRolesTable;