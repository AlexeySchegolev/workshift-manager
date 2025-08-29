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
import { extendedTheme } from './theme/extendedTheme';

/**
 * Main application component
 * Defines routing and theme
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={extendedTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schichtplanung" element={<ShiftPlanningPage />} />
            <Route path="/schichten" element={<ShiftsPage />} />
            <Route path="/mitarbeiter" element={<EmployeePage />} />
            <Route path="/standorte" element={<LocationManagementPage />} />
            <Route path="/rollen" element={<RoleManagementPage />} />
            <Route path="/schichtregeln" element={<ShiftRulesPage />} />
            {/* Fallback route to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
