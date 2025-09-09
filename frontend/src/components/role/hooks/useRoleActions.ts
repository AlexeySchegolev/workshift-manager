import { useState } from 'react';
import { RoleResponseDto, CreateRoleDto, UpdateRoleDto } from '@/api/data-contracts';
import { roleService } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';

export const useRoleActions = (
  roles: RoleResponseDto[],
  onRolesChange: (roles: RoleResponseDto[]) => void
) => {
  const { showSuccess, showError } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponseDto | null>(null);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open delete dialog
  const openDeleteDialog = (role: RoleResponseDto) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  // Delete role
  const deleteRole = async () => {
    if (!roleToDelete) return;

    try {
      setLoading(true);
      await roleService.deleteRole(roleToDelete.id);
      const updatedRoles = roles.filter(role => role.id !== roleToDelete.id);
      onRolesChange(updatedRoles);
      showSuccess(`Rolle ${roleToDelete.displayName || roleToDelete.name} wurde erfolgreich gelöscht`);
      closeDeleteDialog();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Open add role modal
  const openAddRoleModal = () => {
    setAddRoleModalOpen(true);
  };

  // Close add role modal
  const closeAddRoleModal = () => {
    setAddRoleModalOpen(false);
  };

  // Helper function to filter role data for updates
  const createUpdateRoleData = (role: RoleResponseDto): UpdateRoleDto => {
    return {
      name: role.name,
    };
  };

  // Helper function to filter role data for creation
  const createRoleData = (role: RoleResponseDto): CreateRoleDto => {
    return {
      organizationId: role.organizationId,
      name: role.name,
    };
  };

  // Save role
  const saveRole = async (formData: RoleResponseDto, editingId: string | null) => {
    try {
      setLoading(true);

      if (editingId) {
        // Update role
        const updateData = createUpdateRoleData(formData);
        const updatedRole = await roleService.updateRole(editingId, updateData);
        const updatedRoles = roles.map(role =>
          role.id === editingId ? updatedRole : role
        );
        onRolesChange(updatedRoles);
        showSuccess(`Rolle ${formData.displayName || formData.name} wurde erfolgreich aktualisiert`);
      } else {
        // Create new role
        if (!formData?.organizationId) {
          showError('Rolle kann nicht erstellt werden: Keine Organisation verfügbar');
          return;
        }
        
        const createData = createRoleData(formData);
        const newRole = await roleService.createRole(createData);
        const updatedRoles = [...roles, newRole];
        onRolesChange(updatedRoles);
        showSuccess(`Rolle ${formData.displayName || formData.name} wurde erfolgreich erstellt`);
      }

      closeAddRoleModal();
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
    roleToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteRole,
    addRoleModalOpen,
    openAddRoleModal,
    closeAddRoleModal,
    saveRole,
    loading,
  };
};