import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

import { allRuleCategories, RuleCategory } from '../data/detailedRules';

/**
 * Komponente zur Anzeige aller Schichtregeln
 * Verwendet die strukturierten Regeln aus der detailedRules.ts Datei
 * Zeigt alle Regeln direkt an (ohne Accordion), um sicherzustellen, dass alle Zeilen sichtbar sind
 */
const ShiftRulesDisplay: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Schichtregeln für beide Praxen
        </Typography>

        {allRuleCategories.map((category: RuleCategory, index: number) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 2, bgcolor: 'background.default', p: 1 }}>
              {category.title}
            </Typography>
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
            {index < allRuleCategories.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ShiftRulesDisplay;