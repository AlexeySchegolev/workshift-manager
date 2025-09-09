import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { RoleResponseDto } from '@/api/data-contracts';
import { roleService } from '@/services';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';
import { useRoleForm } from '@/components/role/hooks/useRoleForm';
import { useRoleActions } from '@/components/role/hooks/useRoleActions';
import RoleTable from '@/components/role/RoleTable';
import RoleForm from '@/components/role/RoleForm';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import { People as PeopleIcon, Business as BusinessIcon } from '@mui/icons-material';
import { filterRolesByStatus, sortRolesByName } from './utils/roleUtils';

interface RoleManagementProps {
  roles?: RoleResponseDto[];
  onRolesChange?: (roles: RoleResponseDto[]) => void;
}

/**
 * Modern Role Management in Dashboard Style
 * Refactored into smaller, manageable components
 */
const RoleManagement: React.FC<RoleManagementProps> = ({
  roles: propRoles,
  onRolesChange,
}) => {
  const { showError } = useToast();
  const [roles, setRoles] = useState<RoleResponseDto[]>(propRoles || []);
  const [loading, setLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Custom hooks for form and actions
  const {
    formData,
    errors,
    editingId,
    resetForm,
    loadRoleForEdit,
    updateField,
    validateForm,
    isEditing,
  } = useRoleForm();

  const {
    deleteDialogOpen,
    roleToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteRole,
    addRoleModalOpen,
    openAddRoleModal,
    closeAddRoleModal,
    saveRole,
    toggleRoleActive,
    loading: actionLoading,
  } = useRoleActions(roles, handleRolesChange);

  // Handle roles change
  function handleRolesChange(newRoles: RoleResponseDto[]) {
    setRoles(newRoles);
    onRolesChange?.(newRoles);
  }

  // Load roles from API
  useEffect(() => {
    if (!propRoles) {
      loadRoles();
    } else {
      setRoles(propRoles);
    }
  }, [propRoles]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAllRoles({ includeRelations: true });
      setRoles(data);
      onRolesChange?.(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit role
  const handleEditRole = (role: RoleResponseDto) => {
    loadRoleForEdit(role);
    openAddRoleModal();
  };

  // Handle save role
  const handleSaveRole = async () => {
    if (!validateForm()) return;
    
    await saveRole(formData, editingId);
    resetForm();
  };

  // Handle add role modal close
  const handleCloseAddRoleModal = () => {
    closeAddRoleModal();
    resetForm();
  };

  // Filter and sort roles
  const filteredRoles = filterRolesByStatus(roles, showInactive);
  const sortedRoles = sortRolesByName(filteredRoles);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Role Table */}
      <RoleTable
        roles={sortedRoles}
        editingId={editingId}
        onEditRole={handleEditRole}
        onDeleteRole={openDeleteDialog}
        onAddRole={openAddRoleModal}
        onToggleActive={toggleRoleActive}
      />

      {/* Role Form Modal */}
      <RoleForm
        open={addRoleModalOpen}
        onClose={handleCloseAddRoleModal}
        onSave={handleSaveRole}
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
          title: 'Rolle löschen',
          entityName: 'die folgende Rolle',
          entityDisplayName: roleToDelete?.displayName || roleToDelete?.name,
          showDetailedView: true,
          icon: <PeopleIcon color="primary" />,
          chips: [
            {
              label: roleToDelete?.isActive ? 'Aktiv' : 'Inaktiv',
              color: roleToDelete?.isActive ? 'success' : 'default',
              variant: 'outlined' as const,
            },
            {
              label: roleToDelete?.isAvailable ? 'Verfügbar' : 'Nicht verfügbar',
              color: roleToDelete?.isAvailable ? 'info' : 'warning',
              variant: 'outlined' as const,
            },
            {
              label: roleToDelete?.name || 'Rolle',
              icon: <BusinessIcon />,
              variant: 'outlined' as const,
            },
          ],
          fields: [
            { label: 'Rollenname', value: roleToDelete?.name || '' },
            { label: 'Anzeigename', value: roleToDelete?.displayName || '' },
            ...(roleToDelete?.createdAt ? [{ label: 'Erstellt am', value: new Date(roleToDelete.createdAt).toLocaleDateString('de-DE') }] : []),
          ].filter(field => field.value),
        }}
        onClose={closeDeleteDialog}
        onConfirm={deleteRole}
      />
    </Box>
  );
};

export default RoleManagement;