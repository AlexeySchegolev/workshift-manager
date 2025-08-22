import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { allRuleCategories, RuleCategory } from '../data/detailedRules';

/**
 * Seite zur Anzeige aller Schichtregeln
 * Zeigt eine übersichtliche Darstellung aller Regeln für die Schichtplanung
 */
const ShiftRulesPage: React.FC = () => {
  const getIconForCategory = (title: string) => {
    if (title.includes('Allgemeine')) return <InfoIcon />;
    if (title.includes('Spätschicht')) return <ScheduleIcon />;
    if (title.includes('Frühschicht')) return <TimeIcon />;
    if (title.includes('Spezielle')) return <WarningIcon />;
    if (title.includes('Uetersen')) return <GroupIcon />;
    return <ScheduleIcon />;
  };

  const getColorForCategory = (title: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
    if (title.includes('Allgemeine')) return 'info';
    if (title.includes('Spätschicht')) return 'primary';
    if (title.includes('Frühschicht')) return 'success';
    if (title.includes('Spezielle')) return 'warning';
    if (title.includes('Uetersen')) return 'secondary';
    return 'primary';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Schichtregeln
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Übersicht aller Regeln für die Schichtplanung in beiden Praxen
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Wichtige Information</AlertTitle>
          Diese Regeln werden automatisch bei der Schichtplanung angewendet. 
          Bei Konflikten wird zunächst der strikte Modus verwendet, bei Bedarf auf den gelockerten Modus gewechselt.
        </Alert>
      </Box>

      {/* Regelkategorien */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {allRuleCategories.map((category: RuleCategory, index: number) => (
          <Card 
            key={index}
            sx={{ 
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Kategorie Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={getIconForCategory(category.title)}
                  label={category.title}
                  color={getColorForCategory(category.title)}
                  variant="outlined"
                  sx={{ 
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Regeln */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {category.rules.map((rule, ruleIndex) => (
                  <Paper
                    key={ruleIndex}
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: 'background.default',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 0.5
                      }}
                    >
                      {rule.primary}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {rule.secondary}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Zusätzliche Informationen */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            Zusätzliche Hinweise
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
          >
            <Alert severity="success" variant="outlined">
              <AlertTitle>Strikter Modus</AlertTitle>
              Wird zuerst verwendet und befolgt alle Regeln strikt. 
              Bietet die beste Arbeitsverteilung und Mitarbeiterzufriedenheit.
            </Alert>
            <Alert severity="warning" variant="outlined">
              <AlertTitle>Gelockerter Modus</AlertTitle>
              Wird verwendet, wenn der strikte Modus keine vollständige Lösung findet. 
              Erlaubt mehr Flexibilität bei Überstunden und Samstagsarbeit.
            </Alert>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ShiftRulesPage;