import React from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material';

import ShiftRuleManager from '../components/ShiftRuleManager';
import { ShiftRulesResponseDto } from '../api/data-contracts';

/**
 * Page for displaying all shift rules
 * Shows a clear overview of all rules for shift planning
 */
const ShiftRulesPage: React.FC = () => {

  const handleSaveConfiguration = (config: ShiftRulesResponseDto) => {
    // Here the configuration would be saved
    console.log('Schichtregeln-Konfiguration gespeichert:', config);
    // TODO: Integration with Backend/LocalStorage
    alert('Schichtregeln-Konfiguration wurde gespeichert!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Schichtregeln
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Verwaltung und Übersicht aller Regeln für die Schichtplanung in beiden Praxen
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Wichtige Information</AlertTitle>
          Diese Regeln werden automatisch bei der Schichtplanung angewendet.
          Bei Konflikten wird zunächst der strikte Modus verwendet, bei Bedarf auf den gelockerten Modus gewechselt.
        </Alert>
      </Box>

      {/* Shift rules configuration */}
      <ShiftRuleManager onSave={handleSaveConfiguration} />
    </Container>
  );
};

export default ShiftRulesPage;