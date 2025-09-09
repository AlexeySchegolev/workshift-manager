import { Theme } from '@mui/material/styles';

/**
 * Get initials from role name
 */
export const getRoleInitials = (name: string): string => {
    if (!name) return 'R';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    
    return words
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
};

/**
 * Get role status color based on active state
 */
export const getRoleStatusColor = (isActive: boolean, theme: Theme): string => {
    return isActive ? theme.palette.success.main : theme.palette.grey[500];
};

/**
 * Format role status text
 */
export const formatRoleStatus = (isActive: boolean): string => {
    return isActive ? 'Aktiv' : 'Inaktiv';
};

/**
 * Get role availability color
 */
export const getRoleAvailabilityColor = (isAvailable: boolean, theme: Theme): string => {
    return isAvailable ? theme.palette.info.main : theme.palette.warning.main;
};

/**
 * Format role availability text
 */
export const formatRoleAvailability = (isAvailable: boolean): string => {
    return isAvailable ? 'Verfügbar' : 'Nicht verfügbar';
};

/**
 * Sort roles by name
 */
export const sortRolesByName = <T extends { name: string }>(roles: T[]): T[] => {
    return [...roles].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Filter roles by active status
 */
export const filterRolesByStatus = <T extends { isActive: boolean }>(
    roles: T[], 
    showInactive: boolean
): T[] => {
    return showInactive ? roles : roles.filter(role => role.isActive);
};

/**
 * Get display name for role
 */
export const getRoleDisplayName = (role: { name: string; displayName?: string }): string => {
    return role.displayName || role.name;
};