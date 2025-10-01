import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AbsencesPage from './pages/AbsencesPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import LocationManagementPage from './pages/LocationManagementPage';
import LoginPage from './pages/LoginPage';
import PublicHomePage from './pages/PublicHomePage';
import RoleManagementPage from './pages/RoleManagementPage';
import ShiftPlanningPage from './pages/ShiftPlanningPage';
import ShiftRulesPage from './pages/ShiftRulesPage';
import ShiftsPage from './pages/ShiftsPage';
import { extendedTheme } from './theme/extendedTheme';

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
        <Route path="/shift-configuration" element={
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
        <ToastProvider>
          <Router>
            <AppRouter />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
