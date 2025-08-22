import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShiftPlanningPage from './pages/ShiftPlanningPage';
import EmployeePage from './pages/EmployeePage';
import ShiftRulesPage from './pages/ShiftRulesPage';
import LocationManagementPage from './pages/LocationManagementPage';
import { extendedTheme } from './theme/extendedTheme';

/**
 * Hauptkomponente der Anwendung
 * Definiert Routing und Theme
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
            <Route path="/mitarbeiter" element={<EmployeePage />} />
            <Route path="/schichtregeln" element={<ShiftRulesPage />} />
            <Route path="/standorte" element={<LocationManagementPage />} />
            {/* Fallback-Route zur Startseite */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
