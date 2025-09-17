import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Divider,
    IconButton,
    Grid,
} from '@mui/material';
import {
    Close as CloseIcon,
    Schedule as ScheduleIcon,

} from '@mui/icons-material';
import { ShiftFormData, ShiftFormErrors } from './hooks/useShiftForm';
import { useLocations } from '@/hooks/useLocations';
import { useShiftRoles } from './hooks/useShiftRoles';
import ShiftRolesTable from './ShiftRolesTable';
import ShiftRoleDialog from './ShiftRoleDialog';
import { ShiftRoleResponseDto } from '@/api/data-contracts';

interface ShiftFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: ShiftFormData;
    errors: ShiftFormErrors;
    onUpdateField: (field: keyof ShiftFormData, value: any) => void;
    isEditing: boolean;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
    open,
    onClose,
    onSave,
    formData,
    errors,
    onUpdateField,
    isEditing,
}) => {
    // Fetch locations from API
    const { locations, loading: locationsLoading} = useLocations();
    
    // Shift roles management
    const {
        shiftRoles,
        loading: rolesLoading,
        addShiftRole,
        updateShiftRole,
        deleteShiftRole,
    } = useShiftRoles(formData.id);

    // Role dialog state
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<ShiftRoleResponseDto | null>(null);

    const handleAddRole = () => {
        setEditingRole(null);
        setRoleDialogOpen(true);
    };

    const handleEditRole = (shiftRole: ShiftRoleResponseDto) => {
        setEditingRole(shiftRole);
        setRoleDialogOpen(true);
    };

    const handleRoleDialogClose = () => {
        setRoleDialogOpen(false);
        setEditingRole(null);
    };

    const handleRoleSave = async (data: { roleId: string; count: number }) => {
        if (editingRole) {
            await updateShiftRole(editingRole.id, { count: data.count });
        } else {
            await addShiftRole({
                shiftId: formData.id!,
                roleId: data.roleId,
                count: data.count,
            });
        }
    };

    const existingRoleIds = shiftRoles.map(sr => sr.roleId);
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                    fontWeight: 600,
                    gap: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    {isEditing ? 'Schicht bearbeiten' : 'Neue Schicht erstellen'}
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Grundinformationen
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Schichtname"
                            value={formData.name}
                            onChange={(e) => onUpdateField('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Kurzname"
                            value={formData.shortName || ''}
                            onChange={(e) => onUpdateField('shortName', e.target.value)}
                            error={!!errors.shortName}
                            helperText={errors.shortName}
                            required
                            inputProps={{ maxLength: 10 }}
                        />
                    </Grid>


                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            value={formData.description}
                            onChange={(e) => onUpdateField('description', e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth error={!!errors.locationId}>
                            <InputLabel>Station</InputLabel>
                            <Select
                                value={formData.locationId}
                                onChange={(e) => onUpdateField('locationId', e.target.value)}
                                label="Station"
                                disabled={locationsLoading}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name}{location.code ? ` (${location.code})` : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Time and Duration */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Zeit und Dauer
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Startzeit"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => onUpdateField('startTime', e.target.value)}
                            error={!!errors.startTime}
                            helperText={errors.startTime}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Endzeit"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => onUpdateField('endTime', e.target.value)}
                            error={!!errors.endTime}
                            helperText={errors.endTime}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    {/* Shift Roles Section - Only show for existing shifts */}
                    {isEditing && formData.id && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>
                            
                            <Grid size={{ xs: 12 }}>
                                <ShiftRolesTable
                                    shiftRoles={shiftRoles}
                                    loading={rolesLoading}
                                    onAdd={handleAddRole}
                                    onEdit={handleEditRole}
                                    onDelete={deleteShiftRole}
                                />
                            </Grid>
                        </>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Abbrechen
                </Button>
                <Button onClick={onSave} variant="contained">
                    {isEditing ? 'Aktualisieren' : 'Erstellen'}
                </Button>
            </DialogActions>

            {/* Role Dialog */}
            <ShiftRoleDialog
                open={roleDialogOpen}
                onClose={handleRoleDialogClose}
                onSave={handleRoleSave}
                shiftRole={editingRole}
                existingRoleIds={existingRoleIds}
            />
        </Dialog>
    );
};

export default ShiftForm;