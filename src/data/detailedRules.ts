/**
 * Detaillierte Schichtregeln für beide Praxen
 * Enthält alle spezifischen Regeln für die Schichtplanung
 */

export interface RuleCategory {
  title: string;
  rules: Rule[];
}

export interface Rule {
  primary: string;
  secondary: string;
}

// Allgemeine Regeln für die Hauptpraxis
export const generalRules: RuleCategory = {
  title: 'Allgemeine Regeln (Hauptpraxis)',
  rules: [
    {
      primary: 'Mindestbesetzung pro Schicht',
      secondary: 'Mindestens 4 Pfleger, 1 Schichtleiter und 1 Pflegehelfer pro Schicht'
    },
    {
      primary: 'Maximale Anzahl an Samstagen',
      secondary: 'Maximal 1 Samstag pro Mitarbeiter und Monat (2 im gelockerten Modus)'
    },
    {
      primary: 'Aufeinanderfolgende gleiche Schichten',
      secondary: 'Keine gleichen Schichten hintereinander erlaubt'
    },
    {
      primary: 'Überstundentoleranz',
      secondary: '10% Überstunden auf die monatliche Sollarbeitszeit erlaubt (15% im gelockerten Modus)'
    }
  ]
};

// Spätschicht-Regeln für die Hauptpraxis (lange Tage)
export const lateShiftRules: RuleCategory = {
  title: 'Spätschicht-Regeln Hauptpraxis (lange Tage: Mo, Mi, Fr)',
  rules: [
    {
      primary: 'S00 (11:00-18:00)',
      secondary: 'Muss von einem Pfleger besetzt werden'
    },
    {
      primary: 'S0 (11:30-18:30)',
      secondary: 'Muss von einem Pfleger oder Schichtleiter besetzt werden. Bei Überschuss an Kapazität können bis zu 2 Pflegehelfer eingesetzt werden.'
    },
    {
      primary: 'S1 (12:00-19:00)',
      secondary: 'Muss von einem Pfleger oder Schichtleiter besetzt werden'
    },
    {
      primary: 'S (12:00-19:00)',
      secondary: 'Muss von einem Pfleger besetzt werden'
    },
    {
      primary: 'Schichtleiter-Einschränkung',
      secondary: 'Schichtleiter können nur in S0 oder S1 Schichten eingesetzt werden'
    },
    {
      primary: 'Pflegehelfer-Einschränkung',
      secondary: 'Pflegehelfer können nur in S0 Schichten eingesetzt werden (1 Person, bei Überschuss an Kapazität 2 Personen)'
    }
  ]
};

// Frühschicht-Regeln für die Hauptpraxis (alle Tage)
export const earlyShiftRules: RuleCategory = {
  title: 'Frühschicht-Regeln Hauptpraxis (alle Tage)',
  rules: [
    {
      primary: 'F (06:00-13:00)',
      secondary: 'Kann von Pflegern, Schichtleitern und Pflegehelfern besetzt werden'
    }
  ]
};

// Spezielle Schichten für die Hauptpraxis (kurze Tage)
export const specialShiftRules: RuleCategory = {
  title: 'Spezielle Schichten Hauptpraxis (kurze Tage: Di, Do, Sa)',
  rules: [
    {
      primary: 'FS (06:45-14:00)',
      secondary: 'Kann nur von einem Pfleger oder Schichtleiter besetzt werden'
    }
  ]
};

// Regeln für die zweite Praxis
export const secondClinicRules: RuleCategory = {
  title: 'Zweite Praxis (Mo, Mi, Fr)',
  rules: [
    {
      primary: 'Frühschicht (Markiert als 4)',
      secondary: 'Besetzung: 2 Pfleger und 1 Pflegehelfer'
    },
    {
      primary: 'Spätschicht (Markiert als 5)',
      secondary: 'Besetzung: 2 Pfleger'
    },
    {
      primary: 'Schichtleiter (Markiert als 6)',
      secondary: '1 Schichtleiter pro Tag für beide Schichten'
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