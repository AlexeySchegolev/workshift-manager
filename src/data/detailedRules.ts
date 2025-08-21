/**
 * Detaillierte Schichtregeln für die Praxen Elmshorn und Uetersen
 * Enthält alle spezifischen Regeln für die Schichtplanung basierend auf
 * den implementierten Constraints im System
 */

export interface RuleCategory {
  title: string;
  rules: Rule[];
}

export interface Rule {
  primary: string;
  secondary: string;
}

// Allgemeine Regeln für beide Praxen
export const generalRules: RuleCategory = {
  title: 'Allgemeine Regeln für alle Schichten',
  rules: [
    {
      primary: 'Mindestbesetzung pro Schicht',
      secondary: 'Mindestens 4 Pfleger, 1 Schichtleiter und 1 Pflegehelfer pro Schicht'
    },
    {
      primary: 'Maximale Anzahl an Samstagen',
      secondary: 'Maximal 1 Samstag pro Mitarbeiter und Monat im strikten Modus, 2 Samstage im gelockerten Modus'
    },
    {
      primary: 'Aufeinanderfolgende gleiche Schichten',
      secondary: 'Keine gleichen Schichten an aufeinanderfolgenden Tagen erlaubt (Flexibilität am Monatsende möglich)'
    },
    {
      primary: 'Überstundentoleranz',
      secondary: '10% Überstunden auf die monatliche Sollarbeitszeit im strikten Modus, 15% im gelockerten Modus'
    },
    {
      primary: 'Wöchentliche Stundenverteilung',
      secondary: 'Flexible Stundenverteilung mit steigender Toleranz in späteren Wochen des Monats'
    }
  ]
};

// Spätschicht-Regeln für Elmshorn (lange Tage)
export const lateShiftRules: RuleCategory = {
  title: 'Spätschicht-Regeln Elmshorn (lange Tage: Mo, Mi, Fr)',
  rules: [
    {
      primary: 'S00 (11:00-18:00) - 7 Stunden',
      secondary: 'Muss von einem Pfleger besetzt werden'
    },
    {
      primary: 'S0 (11:30-18:30) - 7 Stunden',
      secondary: 'Kann von Schichtleitern, Pflegern und Pflegehelfern besetzt werden'
    },
    {
      primary: 'S1 (12:00-19:00) - 7 Stunden',
      secondary: 'Kann von Schichtleitern und Pflegern besetzt werden'
    },
    {
      primary: 'S (12:00-19:00) - 7 Stunden',
      secondary: 'Muss von einem Pfleger besetzt werden'
    },
    {
      primary: 'Schichtleiter-Einschränkung',
      secondary: 'Schichtleiter können in S0 und S1 Schichten eingesetzt werden'
    },
    {
      primary: 'Pflegehelfer-Einschränkung',
      secondary: 'Pflegehelfer können nur in S0 Schichten eingesetzt werden'
    }
  ]
};

// Frühschicht-Regeln für Elmshorn (alle Tage)
export const earlyShiftRules: RuleCategory = {
  title: 'Frühschicht-Regeln Elmshorn (alle Tage)',
  rules: [
    {
      primary: 'F (06:00-13:00) - 7 Stunden',
      secondary: 'Kann von Pflegern, Schichtleitern und Pflegehelfern besetzt werden'
    }
  ]
};

// Spezielle Schichten für Elmshorn (kurze Tage)
export const specialShiftRules: RuleCategory = {
  title: 'Spezielle Schichten Elmshorn (kurze Tage: Di, Do, Sa)',
  rules: [
    {
      primary: 'FS (06:45-14:00) - 7,25 Stunden',
      secondary: 'Kann von einem Pfleger oder Schichtleiter besetzt werden'
    }
  ]
};

// Regeln für die Praxis Uetersen
export const secondClinicRules: RuleCategory = {
  title: 'Praxis Uetersen (Mo, Mi, Fr)',
  rules: [
    {
      primary: 'Frühschicht (Markiert als 4) - 7 Stunden',
      secondary: 'Kann von Pflegern und Pflegehelfern besetzt werden, Besetzung: 2 Pfleger und 1 Pflegehelfer'
    },
    {
      primary: 'Spätschicht (Markiert als 5) - 7 Stunden',
      secondary: 'Kann nur von Pflegern besetzt werden, Besetzung: 2 Pfleger'
    },
    {
      primary: 'Schichtleiter (Markiert als 6) - 8 Stunden',
      secondary: 'Kann nur von Schichtleitern besetzt werden, 1 Schichtleiter pro Tag'
    },
    {
      primary: 'Überstundentoleranz für Uetersen',
      secondary: 'Erhöhte Überstundentoleranz von 25% (15% + 10%) für Uetersen-Schichten'
    },
    {
      primary: 'Verteilung über den Monat',
      secondary: 'Priorisierung einer gleichmäßigen Verteilung der Mitarbeiter über den Monat'
    }
  ]
};

// Alle Regelkategorien zusammengefasst für einfachen Import
export const allRuleCategories: RuleCategory[] = [
  generalRules,
  lateShiftRules,
  earlyShiftRules,
  specialShiftRules,
  secondClinicRules
];