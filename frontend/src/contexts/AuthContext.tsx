import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { organizationsService, userService } from '../services';
import { UserResponseDto, OrganizationResponseDto } from '../api/data-contracts';

// Using the backend DTO types directly for consistency
type User = UserResponseDto;
type Organization = OrganizationResponseDto;

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  userId: string | null;
  organizationId: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setOrganization: (organization: Organization | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize with null, will be loaded from backend
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and organization data from backend
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        setIsLoading(true);
        
        // Load the first user (assuming single-tenant for now)
        const users = await userService.getAllUsers({ includeRelations: true });
        if (users.length > 0) {
          setUser(users[0]);
        }

        // Load the first organization (assuming single-tenant for now)
        const organizations = await organizationsService.getAllOrganizations({ includeRelations: true });
        if (organizations.length > 0) {
          setOrganization(organizations[0]);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
        // In case of error, you might want to set some default values or show an error state
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const value: AuthContextType = {
    user,
    organization,
    userId: user?.id || null,
    organizationId: organization?.id || null,
    isLoading,
    setUser,
    setOrganization,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;