import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import RoleManagement from '../components/RoleManagement';

/**
 * Page for Role Management
 */
const RoleManagementPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Rollen
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Verwalten Sie die Rollen und Berechtigungen für Ihr Schichtplanungssystem. 
          Definieren Sie neue Rollen, bearbeiten Sie bestehende oder passen Sie 
          Berechtigungen und Anforderungen an.
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <RoleManagement />
      </Paper>
    </Container>
  );
};

export default RoleManagementPage;