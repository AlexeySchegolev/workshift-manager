import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Box,
    CircularProgress,
} from '@mui/material';
import { RoleResponseDto } from '@/api/data-contracts';

interface RoleFormErrors {
    name?: string;
}

interface RoleFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: RoleResponseDto;
    errors: RoleFormErrors;
    onUpdateField: (field: keyof RoleResponseDto, value: any) => void;
    isEditing: boolean;
    loading?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
    open,
    onClose,
    onSave,
    formData,
    errors,
    onUpdateField,
    isEditing,
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                {isEditing ? 'Rolle bearbeiten' : 'Neue Rolle'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Rollenname"
                                value={formData.name}
                                onChange={(e) => onUpdateField('name', e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} disabled={loading}>
                    Abbrechen
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    sx={{ borderRadius: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} /> : (isEditing ? 'Speichern' : 'Erstellen')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleForm;