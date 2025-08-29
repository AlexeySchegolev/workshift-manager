import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Rule as RuleIcon,
  Schedule as ScheduleIcon,
  WbSunny as EarlyShiftIcon,
  Brightness3 as LateShiftIcon,
  Star as SpecialIcon,
  Business as ClinicIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rule-tabpanel-${index}`}
      aria-labelledby={`rule-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `rule-tab-${index}`,
    'aria-controls': `rule-tabpanel-${index}`,
  };
}

/**
 * Modern Planning Validation with Professional Tab Structure
 */
const PlanungsValidierung: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('general');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Icons for different categories
  const getCategoryIcon = (title: string) => {
    if (title.includes('Allgemeine')) return <RuleIcon />;
    if (title.includes('Spätschicht')) return <LateShiftIcon />;
    if (title.includes('Frühschicht')) return <EarlyShiftIcon />;
    if (title.includes('Spezielle')) return <SpecialIcon />;
    if (title.includes('Uetersen')) return <ClinicIcon />;
    return <InfoIcon />;
  };

  // Colors for different categories
  const getCategoryColor = (title: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
    if (title.includes('Allgemeine')) return 'primary';
    if (title.includes('Spätschicht')) return 'warning';
    if (title.includes('Frühschicht')) return 'success';
    if (title.includes('Spezielle')) return 'info';
    if (title.includes('Uetersen')) return 'secondary';
    return 'primary';
  };

  // Rule category interface
  interface Rule {
    primary: string;
    secondary: string;
  }

  interface RuleCategory {
    title: string;
    rules: Rule[];
  }

  // TODO: Load rule categories from backend service
  const allRuleCategories: RuleCategory[] = [
    {
      title: 'Allgemeine Regeln',
      rules: [
        {
          primary: 'Mindestbesetzung',
          secondary: 'Jede Schicht muss mindestens mit der erforderlichen Anzahl Mitarbeiter besetzt sein'
        },
        {
          primary: 'Maximale Arbeitszeit',
          secondary: 'Die tägliche und wöchentliche Höchstarbeitszeit darf nicht überschritten werden'
        },
        {
          primary: 'Ruhezeiten',
          secondary: 'Zwischen zwei Schichten müssen die gesetzlichen Ruhezeiten eingehalten werden'
        }
      ]
    },
    {
      title: 'Frühschicht Regeln',
      rules: [
        {
          primary: 'Frühschicht Besetzung',
          secondary: 'Frühschichten müssen mit qualifizierten Mitarbeitern besetzt werden'
        },
        {
          primary: 'Frühe Ankunftszeit',
          secondary: 'Mitarbeiter müssen rechtzeitig vor Schichtbeginn eintreffen'
        }
      ]
    },
    {
      title: 'Spätschicht Regeln',
      rules: [
        {
          primary: 'Spätschicht Besetzung',
          secondary: 'Spätschichten erfordern erfahrene Mitarbeiter für Nachtdienst'
        },
        {
          primary: 'Übergabezeit',
          secondary: 'Ausreichende Überlappung für Schichtübergabe einplanen'
        }
      ]
    },
    {
      title: 'Spezielle Regeln',
      rules: [
        {
          primary: 'Urlaubsvertretung',
          secondary: 'Bei Urlaub muss eine qualifizierte Vertretung eingeplant werden'
        },
        {
          primary: 'Fortbildungen',
          secondary: 'Fortbildungszeiten müssen in der Schichtplanung berücksichtigt werden'
        }
      ]
    },
    {
      title: 'Uetersen Spezific',
      rules: [
        {
          primary: 'Standort-spezifische Regeln',
          secondary: 'Besondere Anforderungen für den Standort Uetersen'
        },
        {
          primary: 'Lokale Bestimmungen',
          secondary: 'Einhaltung lokaler Arbeitsrichtlinien und Bestimmungen'
        }
      ]
    }
  ];

  // Tab view for desktop
  const renderTabView = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              '&.Mui-selected': {
                fontWeight: 600,
              },
            },
          }}
        >
          {allRuleCategories.map((category, index) => (
            <Tab
              key={index}
              icon={getCategoryIcon(category.title)}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.title.split(' ').slice(0, 2).join(' ')}
                  <Badge badgeContent={category.rules.length} color={getCategoryColor(category.title)} />
                </Box>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {allRuleCategories.map((category, index) => (
        <TabPanel key={index} value={selectedTab} index={index}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette[getCategoryColor(category.title)].main, 0.2)}`,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette[getCategoryColor(category.title)].main, 0.02)} 0%, ${alpha(theme.palette[getCategoryColor(category.title)].light, 0.01)} 100%)`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette[getCategoryColor(category.title)].main, 0.1),
                    color: `${getCategoryColor(category.title)}.main`,
                  }}
                >
                  {getCategoryIcon(category.title)}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {category.title}
                  </Typography>
                  <Chip
                    label={`${category.rules.length} Regeln`}
                    size="small"
                    color={getCategoryColor(category.title)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <List sx={{ p: 0 }}>
                {category.rules.map((rule, ruleIndex) => (
                  <React.Fragment key={ruleIndex}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette[getCategoryColor(category.title)].main, 0.04),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CheckIcon sx={{ color: `${getCategoryColor(category.title)}.main`, fontSize: '1.2rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {rule.primary}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                            {rule.secondary}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {ruleIndex < category.rules.length - 1 && (
                      <Divider sx={{ mx: 2, opacity: 0.3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      ))}
    </Box>
  );

  // Accordion view for mobile
  const renderAccordionView = () => (
    <Box sx={{ width: '100%' }}>
      {allRuleCategories.map((category, index) => (
        <Accordion
          key={index}
          expanded={expandedAccordion === `panel${index}`}
          onChange={handleAccordionChange(`panel${index}`)}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette[getCategoryColor(category.title)].main, 0.2)}`,
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              margin: '0 0 16px 0',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: alpha(theme.palette[getCategoryColor(category.title)].main, 0.04),
              borderRadius: '8px 8px 0 0',
              '&.Mui-expanded': {
                borderRadius: '8px 8px 0 0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette[getCategoryColor(category.title)].main, 0.1),
                  color: `${getCategoryColor(category.title)}.main`,
                }}
              >
                {getCategoryIcon(category.title)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {category.title}
                </Typography>
              </Box>
              <Chip
                label={category.rules.length}
                size="small"
                color={getCategoryColor(category.title)}
                sx={{ mr: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List sx={{ p: 2, pt: 0 }}>
              {category.rules.map((rule, ruleIndex) => (
                <React.Fragment key={ruleIndex}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckIcon sx={{ color: `${getCategoryColor(category.title)}.main`, fontSize: '1.1rem' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {rule.primary}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {rule.secondary}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {ruleIndex < category.rules.length - 1 && (
                    <Divider sx={{ mx: 1, opacity: 0.3 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <ScheduleIcon sx={{ fontSize: '1.5rem' }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Planungsvalidierung
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Schichtregeln für beide Praxen im Überblick
            </Typography>
          </Box>
        </Box>

        {/* Statistics */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<RuleIcon />}
            label={`${allRuleCategories.reduce((sum, cat) => sum + cat.rules.length, 0)} Regeln insgesamt`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<InfoIcon />}
            label={`${allRuleCategories.length} Kategorien`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Responsive view */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {renderTabView()}
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {renderAccordionView()}
      </Box>
    </Paper>
  );
};

export default PlanungsValidierung;