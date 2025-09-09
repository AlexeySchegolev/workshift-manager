import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Switch,
    Box,
    CircularProgress,
} from '@mui/material';
import { LocationResponseDto } from '@/api/data-contracts';

interface LocationFormErrors {
    name?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
}

interface LocationFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: LocationResponseDto;
    errors: LocationFormErrors;
    onUpdateField: (field: keyof LocationResponseDto, value: any) => void;
    isEditing: boolean;
    loading?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({
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
                {isEditing ? 'Standort bearbeiten' : 'Neuer Standort'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => onUpdateField('name', e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Code"
                                value={formData.code || ''}
                                onChange={(e) => onUpdateField('code', e.target.value)}
                                helperText="Optionaler Standort-Code"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={formData.address}
                                onChange={(e) => onUpdateField('address', e.target.value)}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="PLZ"
                                value={formData.postalCode}
                                onChange={(e) => onUpdateField('postalCode', e.target.value)}
                                error={!!errors.postalCode}
                                helperText={errors.postalCode}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Stadt"
                                value={formData.city}
                                onChange={(e) => onUpdateField('city', e.target.value)}
                                error={!!errors.city}
                                helperText={errors.city}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Bundesland"
                                value={formData.state || ''}
                                onChange={(e) => onUpdateField('state', e.target.value)}
                                helperText="Optionales Bundesland"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Land"
                                value={formData.country}
                                onChange={(e) => onUpdateField('country', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={formData.phone || ''}
                                onChange={(e) => onUpdateField('phone', e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="E-Mail"
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => onUpdateField('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Zeitzone"
                                value={formData.timezone}
                                onChange={(e) => onUpdateField('timezone', e.target.value)}
                                helperText="z.B. Europe/Berlin"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => onUpdateField('isActive', e.target.checked)}
                                    />
                                }
                                label="Aktiv"
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

export default LocationForm;