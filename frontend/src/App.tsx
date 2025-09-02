import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShiftPlanningPage from './pages/ShiftPlanningPage';
import ShiftsPage from './pages/ShiftsPage';
import EmployeePage from './pages/EmployeePage';
import ShiftRulesPage from './pages/ShiftRulesPage';
import LocationManagementPage from './pages/LocationManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import AbsencesPage from './pages/AbsencesPage';
import { extendedTheme } from './theme/extendedTheme';
import { AuthProvider } from './contexts/AuthContext';

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
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shift-planning" element={<ShiftPlanningPage />} />
              <Route path="/shifts" element={<ShiftsPage />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/absences" element={<AbsencesPage />} />
              <Route path="/locations" element={<LocationManagementPage />} />
              <Route path="/roles" element={<RoleManagementPage />} />
              <Route path="/shift-rules" element={<ShiftRulesPage />} />
              {/* Fallback route to homepage */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
