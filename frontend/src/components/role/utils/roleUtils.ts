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
 * Get display name for role
 */
export const getRoleDisplayName = (role: { name: string; displayName?: string }): string => {
    return role.displayName || role.name;
};