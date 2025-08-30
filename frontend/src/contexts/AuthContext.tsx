import React, { createContext, useContext, useState, ReactNode } from 'react';

// Hardcoded seed data basierend auf den Seed-Dateien
const SEED_USER = {
  id: 1,
  email: 'admin@dialyse-praxis.de',
  firstName: 'System',
  lastName: 'Administrator',
  role: 'SUPER_ADMIN'
};

const SEED_ORGANIZATION = {
  id: 1,
  name: 'Dialyse Praxis',
  legalName: 'Dialyse Praxis GmbH'
};

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Organization {
  id: number;
  name: string;
  legalName: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  userId: number | null;
  organizationId: number | null;
  setUser: (user: User | null) => void;
  setOrganization: (organization: Organization | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Hardcoded mit Seed-Daten initialisiert
  const [user, setUser] = useState<User | null>(SEED_USER);
  const [organization, setOrganization] = useState<Organization | null>(SEED_ORGANIZATION);

  const value: AuthContextType = {
    user,
    organization,
    userId: user?.id || null,
    organizationId: organization?.id || null,
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