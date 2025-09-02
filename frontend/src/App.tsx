import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import Layout from './components/Layout';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShiftPlanningPage from './pages/ShiftPlanningPage';
import ShiftsPage from './pages/ShiftsPage';
import EmployeePage from './pages/EmployeePage';
import ShiftRulesPage from './pages/ShiftRulesPage';
import LocationManagementPage from './pages/LocationManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import AbsencesPage from './pages/AbsencesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { extendedTheme } from './theme/extendedTheme';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

/**
 * Router component that handles authentication-based routing
 */
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Let AuthContext handle loading state
  }

  if (!isAuthenticated) {
    // Routes for unauthenticated users
    return (
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect all other routes to homepage for unauthenticated users */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Routes for authenticated users
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute fallbackPath="/">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/shift-planning" element={
          <ProtectedRoute fallbackPath="/">
            <ShiftPlanningPage />
          </ProtectedRoute>
        } />
        <Route path="/shifts" element={
          <ProtectedRoute fallbackPath="/">
            <ShiftsPage />
          </ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute fallbackPath="/">
            <EmployeePage />
          </ProtectedRoute>
        } />
        <Route path="/absences" element={
          <ProtectedRoute fallbackPath="/">
            <AbsencesPage />
          </ProtectedRoute>
        } />
        <Route path="/locations" element={
          <ProtectedRoute fallbackPath="/">
            <LocationManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/roles" element={
          <ProtectedRoute fallbackPath="/">
            <RoleManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/shift-rules" element={
          <ProtectedRoute fallbackPath="/">
            <ShiftRulesPage />
          </ProtectedRoute>
        } />
        {/* Redirect login to dashboard if already authenticated */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        {/* Fallback route to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

/**
 * Main application component
 * Defines routing and theme
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={extendedTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
