import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Rule as RuleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ShiftRulesDisplay from '../components/ShiftRulesDisplay';

/**
 * Startseite der Anwendung
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);

  const handleOpenRulesDialog = () => {
    setRulesDialogOpen(true);
  };

  const handleCloseRulesDialog = () => {
    setRulesDialogOpen(false);
  };

  return (
    <Box>
      {/* Hero-Bereich */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: 'primary.light',
          backgroundImage: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Dialysepraxis Schichtplanung
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
        >
          Effiziente Planung und Verwaltung von Schichten für das Personal der Dialysepraxis
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/schichtplanung')}
          >
            Schichtplanung starten
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/mitarbeiter')}
          >
            Mitarbeiter verwalten
          </Button>
        </Box>
      </Paper>

      {/* Funktionen */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ mb: 3, fontWeight: 'medium' }}
      >
        Funktionen und Möglichkeiten
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 6
        }}
      >
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <CalendarIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Automatische Schichtplanung
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Erstellen Sie Schichtpläne unter Berücksichtigung aller Regeln und Vorgaben mit nur einem Klick. Die Anwendung berücksichtigt alle Anforderungen und verteilt die Schichten optimal.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/schichtplanung')}>
              Zur Schichtplanung
            </Button>
          </CardActions>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Mitarbeiterverwaltung
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verwalten Sie alle Mitarbeiter, deren Rollen und Wochenstunden. Fügen Sie neue Mitarbeiter hinzu, bearbeiten oder entfernen Sie bestehende und halten Sie alles auf dem neuesten Stand.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/mitarbeiter')}>
              Mitarbeiter verwalten
            </Button>
          </CardActions>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <InfoIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Excel-Export
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Exportieren Sie Ihre Schichtpläne als Excel-Dateien für den Druck oder die Weitergabe. Die Pläne werden übersichtlich formatiert und sind sofort einsatzbereit.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/schichtplanung')}>
              Ausprobieren
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Regeln und Vorgaben */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Berücksichtigte Regeln
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RuleIcon />}
            onClick={handleOpenRulesDialog}
            sx={{ mb: 1 }}
          >
            Detaillierte Regeln anzeigen
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Mitarbeiterkapazitäten" 
              secondary="Berücksichtigung der Wochenstunden und Rollen jedes Mitarbeiters"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Schichtanforderungen" 
              secondary="Sicherstellung der korrekten Besetzung jeder Schicht (z.B. 4 Pfleger, 1 Schichtleiter, 1 Pflegehelfer)"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Spezielle Schichten" 
              secondary="Korrekte Zuweisung spezieller Schichten wie S00, S und FS an die richtigen Mitarbeiter"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Samstagsregel" 
              secondary="Maximal ein Samstag pro Monat pro Mitarbeiter"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Abwechselnde Schichten" 
              secondary="Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Dialog für detaillierte Schichtregeln */}
      <Dialog
        open={rulesDialogOpen}
        onClose={handleCloseRulesDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Detaillierte Schichtregeln</Typography>
            <IconButton onClick={handleCloseRulesDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <ShiftRulesDisplay />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRulesDialog}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;