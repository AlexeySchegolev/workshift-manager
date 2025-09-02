import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, organizationsService } from '../services';
import { 
  AuthUserDto, 
  OrganizationResponseDto, 
  LoginDto, 
  RegisterDto 
} from '../api/data-contracts';

// Using the backend DTO types directly for consistency
type User = AuthUserDto;
type Organization = OrganizationResponseDto;

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  userId: string | null;
  organizationId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          // Load current user from token
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          
          // TODO: Load organization when organizations property is available in AuthUserDto
          // For now, load first organization from organizationsService
          try {
            const organizations = await organizationsService.getAllOrganizations({ includeRelations: true });
            if (organizations.length > 0) {
              setOrganization(organizations[0]);
            }
          } catch (error) {
            console.warn('Failed to load organization:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        // If there's an error, clear the auth state
        await authService.logout();
        setUser(null);
        setOrganization(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginDto): Promise<void> => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login(credentials);
      setUser(authResponse.user);
      
      // TODO: Load organization when organizations property is available in AuthUserDto
      // For now, load first organization from organizationsService
      try {
        const organizations = await organizationsService.getAllOrganizations({ includeRelations: true });
        if (organizations.length > 0) {
          setOrganization(organizations[0]);
        }
      } catch (error) {
        console.warn('Failed to load organization during login:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterDto): Promise<void> => {
    await authService.register(userData);
    // Note: User will need to login after registration
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setOrganization(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    organization,
    userId: user?.id || null,
    organizationId: organization?.id || null,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
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