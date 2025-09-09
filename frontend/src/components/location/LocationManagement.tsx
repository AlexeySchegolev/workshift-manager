import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { LocationResponseDto } from '@/api/data-contracts';
import { locationService } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';
import { useLocationForm } from '@/components/location/hooks/useLocationForm';
import { useLocationActions } from '@/components/location/hooks/useLocationActions';
import LocationTable from '@/components/location/LocationTable';
import LocationForm from '@/components/location/LocationForm';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import { LocationOn as LocationIcon, Business as BusinessIcon } from '@mui/icons-material';

interface LocationManagementProps {
  locations?: LocationResponseDto[];
  onLocationsChange?: (locations: LocationResponseDto[]) => void;
}

/**
 * Modern Location Management in Dashboard Style
 * Refactored into smaller, manageable components
 */
const LocationManagement: React.FC<LocationManagementProps> = ({
  locations: propLocations,
  onLocationsChange,
}) => {
  const { showError } = useToast();
  const [locations, setLocations] = useState<LocationResponseDto[]>(propLocations || []);
  const [loading, setLoading] = useState(false);

  // Custom hooks for form and actions
  const {
    formData,
    errors,
    editingId,
    resetForm,
    loadLocationForEdit,
    updateField,
    validateForm,
    isEditing,
  } = useLocationForm();

  const {
    deleteDialogOpen,
    locationToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteLocation,
    addLocationModalOpen,
    openAddLocationModal,
    closeAddLocationModal,
    saveLocation,
    loading: actionLoading,
  } = useLocationActions(locations, handleLocationsChange);

  // Handle locations change
  function handleLocationsChange(newLocations: LocationResponseDto[]) {
    setLocations(newLocations);
    onLocationsChange?.(newLocations);
  }

  // Load locations from API
  useEffect(() => {
    if (!propLocations) {
      loadLocations();
    } else {
      setLocations(propLocations);
    }
  }, [propLocations]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
      onLocationsChange?.(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit location
  const handleEditLocation = (location: LocationResponseDto) => {
    loadLocationForEdit(location);
    openAddLocationModal();
  };

  // Handle save location
  const handleSaveLocation = async () => {
    if (!validateForm()) return;
    
    await saveLocation(formData, editingId);
    resetForm();
  };

  // Handle add location modal close
  const handleCloseAddLocationModal = () => {
    closeAddLocationModal();
    resetForm();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Location Table */}
      <LocationTable
        locations={locations}
        editingId={editingId}
        onEditLocation={handleEditLocation}
        onDeleteLocation={openDeleteDialog}
        onAddLocation={openAddLocationModal}
      />

      {/* Location Form Modal */}
      <LocationForm
        open={addLocationModalOpen}
        onClose={handleCloseAddLocationModal}
        onSave={handleSaveLocation}
        formData={formData}
        errors={errors}
        onUpdateField={updateField}
        isEditing={isEditing}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        config={{
          title: 'Standort löschen',
          entityName: 'den folgenden Standort',
          entityDisplayName: locationToDelete?.name,
          showDetailedView: true,
          icon: <LocationIcon color="primary" />,
          chips: [
            ...(locationToDelete?.code ? [{
              label: locationToDelete.code,
              color: 'primary' as const,
              variant: 'outlined' as const,
            }] : []),
            {
              label: locationToDelete?.isActive ? 'Aktiv' : 'Inaktiv',
              color: locationToDelete?.isActive ? 'success' : 'default',
              variant: 'outlined' as const,
            },
            {
              label: `${locationToDelete?.employees?.length || 0} Mitarbeiter`,
              icon: <BusinessIcon />,
              variant: 'outlined' as const,
            },
          ],
          fields: [
            { label: 'Adresse', value: locationToDelete?.address || '' },
            { label: 'Stadt', value: `${locationToDelete?.city || ''} ${locationToDelete?.postalCode || ''}`.trim() },
            ...(locationToDelete?.phone ? [{ label: 'Telefon', value: locationToDelete.phone }] : []),
            ...(locationToDelete?.email ? [{ label: 'E-Mail', value: locationToDelete.email }] : []),
          ].filter(field => field.value),
        }}
        onClose={closeDeleteDialog}
        onConfirm={deleteLocation}
      />
    </Box>
  );
};

export default LocationManagement;