import { useState } from 'react';
import { LocationResponseDto, CreateLocationDto, UpdateLocationDto } from '@/api/data-contracts';
import { locationService } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';

export const useLocationActions = (
  locations: LocationResponseDto[],
  onLocationsChange: (locations: LocationResponseDto[]) => void
) => {
  const { showSuccess, showError } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<LocationResponseDto | null>(null);
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open delete dialog
  const openDeleteDialog = (location: LocationResponseDto) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  // Delete location
  const deleteLocation = async () => {
    if (!locationToDelete) return;

    try {
      setLoading(true);
      await locationService.deleteLocation(locationToDelete.id);
      const updatedLocations = locations.filter(loc => loc.id !== locationToDelete.id);
      onLocationsChange(updatedLocations);
      showSuccess(`Standort ${locationToDelete.name} wurde erfolgreich gelöscht`);
      closeDeleteDialog();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Open add location modal
  const openAddLocationModal = () => {
    setAddLocationModalOpen(true);
  };

  // Close add location modal
  const closeAddLocationModal = () => {
    setAddLocationModalOpen(false);
  };

  // Helper function to filter location data for updates
  const createUpdateLocationData = (location: LocationResponseDto): UpdateLocationDto => {
    return {
      organizationId: location.organizationId,
      name: location.name,
      code: location.code,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      state: location.state,
      country: location.country,
      phone: location.phone,
      email: location.email,
      timezone: location.timezone,
      operatingHours: location.operatingHours,
      isActive: location.isActive,
    };
  };

  // Helper function to filter location data for creation
  const createLocationData = (location: LocationResponseDto): CreateLocationDto => {
    return {
      organizationId: location.organizationId,
      name: location.name,
      code: location.code,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      state: location.state,
      country: location.country,
      phone: location.phone,
      email: location.email,
      timezone: location.timezone,
      operatingHours: location.operatingHours,
      isActive: location.isActive,
    };
  };

  // Save location
  const saveLocation = async (formData: LocationResponseDto, editingId: string | null) => {
    try {
      setLoading(true);

      if (editingId) {
        // Update location
        const updateData = createUpdateLocationData(formData);
        const updatedLocation = await locationService.updateLocation(editingId, updateData);
        const updatedLocations = locations.map(loc =>
          loc.id === editingId ? updatedLocation : loc
        );
        onLocationsChange(updatedLocations);
        showSuccess(`Standort ${formData.name} wurde erfolgreich aktualisiert`);
      } else {
        // Create new location
        if (!formData?.organizationId) {
          showError('Standort kann nicht erstellt werden: Keine Organisation verfügbar');
          return;
        }
        
        const createData = createLocationData(formData);
        const newLocation = await locationService.createLocation(createData);
        const updatedLocations = [...locations, newLocation];
        onLocationsChange(updatedLocations);
        showSuccess(`Standort ${formData.name} wurde erfolgreich erstellt`);
      }

      closeAddLocationModal();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteDialogOpen,
    locationToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteLocation,
    addLocationModalOpen,
    openAddLocationModal,
    closeAddLocationModal,
    saveLocation,
    loading,
  };
};