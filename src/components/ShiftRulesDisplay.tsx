import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { allRuleCategories, RuleCategory } from '../data/detailedRules';

/**
 * Komponente zur Anzeige aller Schichtregeln
 * Verwendet die strukturierten Regeln aus der detailedRules.ts Datei
 */
const ShiftRulesDisplay: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Schichtregeln für beide Praxen
        </Typography>

        {allRuleCategories.map((category: RuleCategory, index: number) => (
          <Accordion key={index} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}a-content`}
              id={`panel${index + 1}a-header`}
            >
              <Typography variant="h6">{category.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {category.rules.map((rule, ruleIndex) => (
                  <React.Fragment key={ruleIndex}>
                    <ListItem>
                      <ListItemText 
                        primary={rule.primary} 
                        secondary={rule.secondary} 
                      />
                    </ListItem>
                    {ruleIndex < category.rules.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default ShiftRulesDisplay;